// components/layout/ProgressBar.tsx
'use client';

import { LESSONS } from '@/lib/lessons';
import { useEffect, useState } from 'react';

export default function ProgressBar() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    // 从 localStorage 读取已完成的课程
    const completed = localStorage.getItem('completedLessons');
    if (completed) {
      setCompletedLessons(JSON.parse(completed));
    }
  }, []);

  const progress = (completedLessons.length / LESSONS.length) * 100;

  return (
    <div className="bg-panel/70 border-b border-ink/10 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-ink/60">学习进度</span>
              <span className="text-xs text-ink/60">
                {completedLessons.length} / {LESSONS.length} 课程
              </span>
            </div>
            <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-semibold text-accent">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
