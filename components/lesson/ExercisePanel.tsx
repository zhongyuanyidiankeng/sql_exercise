// components/lesson/ExercisePanel.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ExercisePanelProps {
  exercise: {
    scenario: string;
    question: string;
    hints: string[];
  };
  onSubmit: (sql: string) => void;
}

export default function ExercisePanel({ exercise, onSubmit }: ExercisePanelProps) {
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  const revealNextHint = () => {
    if (revealedHints < exercise.hints.length) {
      setRevealedHints(revealedHints + 1);
    }
  };

  return (
    <div className="bg-panel/70 rounded-xl border border-ink/10 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
      {/* 标题 */}
      <div className="px-6 py-4 bg-gradient-to-r from-accent2/10 to-transparent border-b border-ink/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-ink">✍️ 动手练习</h3>
          <Badge variant="info">实战题目</Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 业务场景 */}
        <div className="bg-accent2/8 border border-accent2/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-accent2 mb-2">📋 业务场景</h4>
          <p className="text-ink/70 leading-relaxed">{exercise.scenario}</p>
        </div>

        {/* 问题 */}
        <div>
          <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-3">
            ❓ 问题
          </h4>
          <p className="text-ink text-lg font-medium leading-relaxed">
            {exercise.question}
          </p>
        </div>

        {/* 提示系统 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">
              💡 提示
            </h4>
            {!showHints && (
              <Button
                onClick={() => setShowHints(true)}
                size="sm"
                variant="ghost"
              >
                需要帮助？
              </Button>
            )}
          </div>

          {showHints && (
            <div className="space-y-3">
              {exercise.hints.slice(0, revealedHints).map((hint, idx) => (
                <div
                  key={idx}
                  className="bg-accent/8 border border-accent/20 rounded-lg p-4 animate-in fade-in-0 slide-in-from-top-2"
                >
                  <div className="flex gap-3">
                    <span className="text-accent font-bold flex-shrink-0">
                      提示 {idx + 1}:
                    </span>
                    <span className="text-ink/70">{hint}</span>
                  </div>
                </div>
              ))}

              {revealedHints < exercise.hints.length && (
                <Button
                  onClick={revealNextHint}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  查看下一条提示 ({revealedHints}/{exercise.hints.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 提交说明 */}
        <div className="bg-panel/70 border border-ink/10 rounded-lg p-4">
          <p className="text-sm text-ink/50">
            💻 在下方的 SQL 编辑器中编写你的查询语句，然后点击"运行并验证"按钮提交答案
          </p>
        </div>
      </div>
    </div>
  );
}
