// lib/db/sqlRunner.ts
// 使用 sql.js 在浏览器端执行 SQL（WebAssembly）

import { CREATE_TABLES_SQL, SEED_DATA_SQL } from './schema';

export interface SqlResult {
  columns: string[];
  rows: (string | number | null)[][];
  rowCount: number;
  executionTime: number;
  error?: string;
}

let dbInstance: any = null;
let initPromise: Promise<any> | null = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs({
      locateFile: (file: string) => `/sql-wasm.wasm`,
    });
    const db = new SQL.Database();
    db.run(CREATE_TABLES_SQL);
    db.run(SEED_DATA_SQL);
    dbInstance = db;
    return db;
  })();

  return initPromise;
}

export async function executeSQL(sql: string): Promise<SqlResult> {
  const start = performance.now();
  try {
    const db = await getDb();
    const results = db.exec(sql.trim());
    const elapsed = performance.now() - start;

    if (!results || results.length === 0) {
      return { columns: [], rows: [], rowCount: 0, executionTime: elapsed };
    }

    const { columns, values } = results[0];
    return {
      columns,
      rows: values,
      rowCount: values.length,
      executionTime: Math.round(elapsed),
    };
  } catch (err: any) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTime: performance.now() - start,
      error: err.message || String(err),
    };
  }
}

export async function validateAnswer(
  userSql: string,
  answerSql: string,
  mode: 'exact' | 'result' = 'result'
): Promise<{ correct: boolean; userResult: SqlResult; answerResult: SqlResult }> {
  const [userResult, answerResult] = await Promise.all([
    executeSQL(userSql),
    executeSQL(answerSql),
  ]);

  if (userResult.error) {
    return { correct: false, userResult, answerResult };
  }

  if (mode === 'exact') {
    const userStr = JSON.stringify({ cols: userResult.columns, rows: userResult.rows });
    const answerStr = JSON.stringify({ cols: answerResult.columns, rows: answerResult.rows });
    return { correct: userStr === answerStr, userResult, answerResult };
  }

  // result mode: 只比较数据内容（忽略列名别名差异），行数和值都匹配即正确
  if (userResult.rowCount !== answerResult.rowCount) {
    return { correct: false, userResult, answerResult };
  }

  // 比较每行数据（排序后对比）
  const normalize = (rows: (string | number | null)[][]) =>
    rows.map(r => r.map(v => String(v ?? '')).join('|')).sort().join('\n');

  const correct = normalize(userResult.rows) === normalize(answerResult.rows);
  return { correct, userResult, answerResult };
}

export async function getTablePreview(tableName: string, limit = 5): Promise<SqlResult> {
  return executeSQL(`SELECT * FROM ${tableName} LIMIT ${limit};`);
}

// 别名导出，兼容不同的导入方式
export const runSQL = executeSQL;
