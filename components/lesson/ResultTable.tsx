// components/lesson/ResultTable.tsx
'use client';

interface ResultTableProps {
  result: {
    columns: string[];
    values: any[][];
  } | null;
  error?: string | null;
}

export default function ResultTable({ result, error }: ResultTableProps) {
  if (error) {
    return (
      <div className="bg-panel/70 rounded-xl border border-red-500/30 overflow-hidden">
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/30">
          <h4 className="text-sm font-semibold text-red-400">❌ 执行错误</h4>
        </div>
        <div className="p-4">
          <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-panel/70 rounded-xl border border-ink/10 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
        <div className="flex items-center justify-center py-12 text-ink/60">
          执行 SQL 查询后，结果将显示在这里
        </div>
      </div>
    );
  }

  return (
    <div className="bg-panel/70 rounded-xl border border-ink/10 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
      {/* 表头 */}
      <div className="px-4 py-3 bg-panel/75 border-b border-ink/10">
        <h4 className="text-sm font-semibold text-ink/50">📊 查询结果</h4>
      </div>

      {/* 数据表格 */}
      <div className="overflow-x-auto">
        {result.values.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-ink/60">
            查询成功，但没有返回数据
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-panel/75">
              <tr>
                {result.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-semibold text-ink/50 uppercase tracking-wider border-b border-ink/10"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {result.values.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-panel/70 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3 text-sm text-ink/70">
                      {cell === null ? (
                        <span className="text-ink/60 italic">NULL</span>
                      ) : typeof cell === 'number' ? (
                        <span className="text-accent2 font-mono">{cell}</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 统计信息 */}
      {result.values.length > 0 && (
        <div className="px-4 py-3 bg-panel/70 border-t border-ink/10 text-xs text-ink/60">
          返回 {result.values.length} 行 · {result.columns.length} 列
        </div>
      )}
    </div>
  );
}
