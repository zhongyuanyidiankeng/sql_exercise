// components/lesson/DataPreview.tsx
'use client';

import { useState, useEffect } from 'react';
import { runSQL, type SqlResult } from '@/lib/db/sqlRunner';

interface DataPreviewProps {
  tables: string[];
}

export default function DataPreview({ tables }: DataPreviewProps) {
  const [selectedTable, setSelectedTable] = useState(tables[0]);
  const [data, setData] = useState<SqlResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTableData(selectedTable);
  }, [selectedTable]);

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    try {
      const result = await runSQL(`SELECT * FROM ${tableName} LIMIT 10`);
      if (!result.error) {
        setData(result);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Failed to load table data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tableIcons: Record<string, string> = {
    products: '📦',
    orders: '🧾',
    users: '👥',
    categories: '📁',
  };

  return (
    <div className="bg-panel/70 rounded-xl border border-ink/10 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
      {/* 表格选择器 */}
      <div className="flex gap-2 p-4 border-b border-ink/10 bg-panel/70">
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => setSelectedTable(table)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTable === table
                ? 'bg-accent text-paper'
                : 'bg-ink/5 text-ink/50 hover:bg-ink/10 hover:text-ink'
            }`}
          >
            <span className="mr-2">{tableIcons[table] || '📊'}</span>
            {table}
          </button>
        ))}
      </div>

      {/* 数据表格 */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-ink/60">加载中...</div>
          </div>
        ) : data ? (
          <table className="w-full">
            <thead className="bg-panel/75">
              <tr>
                {data.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-semibold text-ink/50 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {data.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-panel/70 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3 text-sm text-ink/70">
                      {cell === null ? (
                        <span className="text-ink/60 italic">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-ink/60">暂无数据</div>
          </div>
        )}
      </div>

      {/* 数据统计 */}
      {data && (
        <div className="px-4 py-3 bg-panel/70 border-t border-ink/10 text-xs text-ink/60">
          显示 {data.rows.length} 条记录 · {data.columns.length} 列
        </div>
      )}
    </div>
  );
}
