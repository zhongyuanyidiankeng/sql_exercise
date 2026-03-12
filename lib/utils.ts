// lib/utils.ts
// 通用工具函数

import { type ClassValue, clsx } from 'clsx';

/**
 * 合并 className，支持条件类名
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 延迟执行（用于演示加载状态）
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 比较两个 SQL 查询结果是否相同
 */
export function compareResults(result1: any[][], result2: any[][]): boolean {
  if (result1.length !== result2.length) return false;

  // 转换为字符串进行比较（处理数值类型差异）
  const str1 = JSON.stringify(result1.map(row => row.map(cell => String(cell))));
  const str2 = JSON.stringify(result2.map(row => row.map(cell => String(cell))));

  return str1 === str2;
}

/**
 * 规范化 SQL 查询语句（用于比较）
 */
export function normalizeSql(sql: string): string {
  return sql
    .trim()
    .replace(/\s+/g, ' ') // 多个空格替换为单个
    .replace(/;\s*$/, '') // 移除末尾分号
    .toLowerCase();
}

/**
 * 检查 SQL 是否只包含 SELECT 语句（安全检查）
 */
export function isSafeQuery(sql: string): boolean {
  const normalized = sql.trim().toLowerCase();
  // 只允许 SELECT 查询
  return normalized.startsWith('select') &&
         !normalized.includes('insert') &&
         !normalized.includes('update') &&
         !normalized.includes('delete') &&
         !normalized.includes('drop') &&
         !normalized.includes('create') &&
         !normalized.includes('alter');
}
