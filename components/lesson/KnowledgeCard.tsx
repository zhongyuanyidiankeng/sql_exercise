// components/lesson/KnowledgeCard.tsx
'use client';

import { useState } from 'react';
import { runSQL, type SqlResult } from '@/lib/db/sqlRunner';
import Button from '@/components/ui/Button';

interface KnowledgeCardProps {
  knowledge: {
    title: string;
    explanation: string;
    syntax: string;
    example: {
      description: string;
      sql: string;
    };
    tips: string[];
  };
}

export default function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
  const [showExample, setShowExample] = useState(false);
  const [exampleResult, setExampleResult] = useState<SqlResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runExample = async () => {
    setLoading(true);
    try {
      const result = await runSQL(knowledge.example.sql);
      setExampleResult(result);
      setShowExample(true);
    } catch (error) {
      console.error('Failed to run example:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-panel/70 rounded-xl border border-ink/10 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
      {/* 标题 */}
      <div className="px-6 py-4 bg-gradient-to-r from-accent/12 to-transparent border-b border-ink/10">
        <h3 className="text-xl font-bold text-ink">{knowledge.title}</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* 说明 */}
        <div>
          <p className="text-ink/70 leading-relaxed whitespace-pre-line">
            {knowledge.explanation}
          </p>
        </div>

        {/* 语法 */}
        <div>
          <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-3">
            📝 语法格式
          </h4>
          <pre className="bg-ink/5 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-accent2 font-mono">
              {knowledge.syntax}
            </code>
          </pre>
        </div>

        {/* 示例 */}
        <div>
          <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-3">
            💡 示例
          </h4>
          <p className="text-ink/70 mb-3">{knowledge.example.description}</p>
          <pre className="bg-ink/5 rounded-lg p-4 overflow-x-auto mb-3">
            <code className="text-sm text-accent2 font-mono">
              {knowledge.example.sql}
            </code>
          </pre>
          <Button
            onClick={runExample}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? '执行中...' : '▶ 运行示例'}
          </Button>

          {/* 示例结果 */}
          {showExample && exampleResult && (
            <div className="mt-4 bg-ink/4 rounded-lg p-4 border border-ink/10">
              {exampleResult.error ? (
                <div className="text-red-400 text-sm font-mono">
                  {exampleResult.error}
                </div>
              ) : exampleResult.columns.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/10">
                        {exampleResult.columns.map((col: string, idx: number) => (
                          <th key={idx} className="px-3 py-2 text-left text-ink/50 font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {exampleResult.rows.map((row: (string | number | null)[], rowIdx: number) => (
                        <tr key={rowIdx} className="border-b border-ink/10">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="px-3 py-2 text-ink/70">
                              {cell === null ? <span className="text-ink/60">NULL</span> : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-ink/50">查询执行成功，无返回结果</div>
              )}
            </div>
          )}
        </div>

        {/* 提示 */}
        <div>
          <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-3">
            💡 小贴士
          </h4>
          <ul className="space-y-2">
            {knowledge.tips.map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-ink/70">
                <span className="text-accent flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
