// app/api/execute-sql/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runSQL } from '@/lib/db/sqlRunner';
import { compareResults, normalizeSql } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { sql, answerSql, validateMode } = await request.json();

    if (!sql || typeof sql !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid SQL query' },
        { status: 400 }
      );
    }

    // 执行用户的 SQL
    const userResult = await runSQL(sql);

    if (!userResult.success) {
      return NextResponse.json({
        success: false,
        error: userResult.error,
        isCorrect: false,
      });
    }

    // 如果没有提供答案 SQL，只返回执行结果
    if (!answerSql) {
      return NextResponse.json({
        success: true,
        results: userResult.results,
        isCorrect: null,
      });
    }

    // 验证答案
    let isCorrect = false;

    if (validateMode === 'exact') {
      // 精确匹配模式：比较 SQL 语句
      isCorrect = normalizeSql(sql) === normalizeSql(answerSql);
    } else {
      // 结果匹配模式：比较查询结果
      const answerResult = await runSQL(answerSql);

      if (answerResult.success && userResult.results && answerResult.results) {
        // 比较结果集
        if (userResult.results.length === answerResult.results.length) {
          isCorrect = userResult.results.every((userRes, idx) => {
            const answerRes = answerResult.results![idx];
            return compareResults(userRes.values, answerRes.values);
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      results: userResult.results,
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
