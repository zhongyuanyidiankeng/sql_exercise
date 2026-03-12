// components/lesson/SqlEditor.tsx
'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import Button from '@/components/ui/Button';

interface SqlEditorProps {
  onExecute: (sql: string) => void;
  isExecuting?: boolean;
}

export default function SqlEditor({ onExecute, isExecuting = false }: SqlEditorProps) {
  const [sqlQuery, setSqlQuery] = useState('');

  const handleExecute = () => {
    if (sqlQuery.trim()) {
      onExecute(sqlQuery);
    }
  };

  return (
    <div className="bg-panel/70 rounded-xl border border-ink/10 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-panel/75 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink/50">SQL 编辑器</span>
          <span className="text-xs text-ink/60">按 Ctrl+Enter 快速执行</span>
        </div>
        <Button
          onClick={handleExecute}
          disabled={isExecuting || !sqlQuery.trim()}
          size="sm"
        >
          {isExecuting ? '执行中...' : '▶ 运行并验证'}
        </Button>
      </div>

      {/* 代码编辑器 */}
      <div className="min-h-[200px]">
        <CodeMirror
          value={sqlQuery}
          height="200px"
          theme="light"
          extensions={[sql()]}
          onChange={(value) => setSqlQuery(value)}
          className="text-sm"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              handleExecute();
            }
          }}
        />
      </div>

      {/* 编辑器底部提示 */}
      <div className="px-4 py-2 bg-panel/70 border-t border-ink/10 text-xs text-ink/60">
        💡 提示: 输入 SQL 查询语句后点击运行按钮，系统会自动验证答案是否正确
      </div>
    </div>
  );
}
