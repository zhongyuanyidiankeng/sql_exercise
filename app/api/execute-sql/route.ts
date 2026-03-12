// app/api/execute-sql/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runSQL, type SqlResult } from '@/lib/db/sqlRunner';
import { compareResults, normalizeSql } from '@/lib/utils';

type ExecResultSet = { columns: string[]; values: (string | number | null)[][] };

function toExecResults(result: SqlResult): ExecResultSet[] {
  if (result.columns.length === 0 && result.rows.length === 0) return [];
  return [{ columns: result.columns, values: result.rows }];
}

export async function POST(request: NextRequest) {
  try {
    const { sql, answerSql, validateMode } = await request.json();

    if (!sql || typeof sql !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid SQL query' },
        { status: 400 }
      );
    }

    const userResult = await runSQL(sql);

    if (userResult.error) {
      return NextResponse.json({
        success: false,
        error: userResult.error,
        isCorrect: false,
      });
    }

    const userResults = toExecResults(userResult);

    if (!answerSql) {
      return NextResponse.json({
        success: true,
        results: userResults,
        isCorrect: null,
      });
    }

    let isCorrect = false;

    if (validateMode === 'exact') {
      isCorrect = normalizeSql(sql) === normalizeSql(answerSql);
    } else {
      const answerResult = await runSQL(answerSql);

      if (!answerResult.error && userResult.rowCount === answerResult.rowCount) {
        isCorrect = compareResults(userResult.rows, answerResult.rows);
      }
    }

    return NextResponse.json({
      success: true,
      results: userResults,
      isCorrect,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
