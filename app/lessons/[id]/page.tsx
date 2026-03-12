'use client';
// app/lessons/[id]/page.tsx
// 课程核心交互页面

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonById, LESSONS, DIFFICULTY_LABEL, DIFFICULTY_COLOR } from '@/lib/lessons';
import { executeSQL, validateAnswer, getTablePreview } from '@/lib/db/sqlRunner';
import { TABLE_METADATA } from '@/lib/db/schema';
import type { SqlResult } from '@/lib/db/sqlRunner';

// ==================== 子组件 ====================

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = ['数据预览', '知识点', '练习题', '验证答案'];
  return (
    <div className="flex items-center gap-1 px-4 py-3 overflow-x-auto">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            i === currentStep
              ? 'bg-accent text-paper'
              : i < currentStep
              ? 'bg-accent/20 text-accent'
              : 'bg-ink/5 text-ink/40'
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              i === currentStep ? 'bg-panel/80' : i < currentStep ? 'bg-accent/30' : 'bg-ink/10'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </span>
            {label}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-px mx-1 ${i < currentStep ? 'bg-accent/40' : 'bg-ink/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ResultTable({ result }: { result: SqlResult }) {
  if (result.error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-red-400 font-mono text-sm">❌ 错误：{result.error}</p>
      </div>
    );
  }
  if (result.rowCount === 0 && result.columns.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ink/60">
          {result.rowCount} 行结果 · 耗时 {result.executionTime}ms
        </span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink/5">
              {result.columns.map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold text-ink/50 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i} className={`border-t border-ink/10 ${i % 2 === 0 ? 'bg-transparent' : 'bg-panel/70'}`}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-ink/70 whitespace-nowrap font-mono text-xs">
                    {cell === null ? <span className="text-ink/60">NULL</span> : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SqlEditor({ value, onChange, onRun, isRunning }: {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
  isRunning: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-ink/5 border-b border-ink/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-ink/60 font-mono">SQL Editor</span>
        <button
          onClick={onRun}
          disabled={isRunning || !value.trim()}
          className="flex items-center gap-1.5 px-3 py-1 bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-paper text-xs font-medium transition-colors"
        >
          {isRunning ? (
            <span className="animate-spin">⟳</span>
          ) : (
            '▶ 运行'
          )}
        </button>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            onRun();
          }
          // Tab 插入两个空格
          if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newVal = value.substring(0, start) + '  ' + value.substring(end);
            onChange(newVal);
            setTimeout(() => {
              e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
            }, 0);
          }
        }}
        className="w-full bg-panel/80 text-ink font-mono text-sm p-4 min-h-[140px] resize-y outline-none placeholder-ink/40"
        placeholder="-- 在这里写你的 SQL
-- 提示：Ctrl+Enter 或 Cmd+Enter 快速运行

SELECT ..."
        spellCheck={false}
      />
    </div>
  );
}

// ==================== 主页面 ====================

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const lesson = getLessonById(lessonId);

  const [step, setStep] = useState(0); // 0=预览 1=知识点 2=练习 3=验证
  const [tableData, setTableData] = useState<Record<string, SqlResult>>({});
  const [selectedTable, setSelectedTable] = useState('');
  const [exampleResult, setExampleResult] = useState<SqlResult | null>(null);
  const [userSql, setUserSql] = useState('');
  const [userResult, setUserResult] = useState<SqlResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [validation, setValidation] = useState<{
    checked: boolean; correct: boolean;
    userResult?: SqlResult; answerResult?: SqlResult;
  } | null>(null);
  const [hintIndex, setHintIndex] = useState(-1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  const lessonIndex = LESSONS.findIndex(l => l.id === lessonId);
  const nextLesson = LESSONS[lessonIndex + 1];

  useEffect(() => {
    if (!lesson) return;
    setLoading(true);
    const fetchPreviews = async () => {
      const data: Record<string, SqlResult> = {};
      for (const table of lesson.tables) {
        data[table] = await getTablePreview(table, 5);
      }
      setTableData(data);
      setSelectedTable(lesson.tables[0]);
      setLoading(false);
    };
    fetchPreviews();
  }, [lesson]);

  const runExampleSQL = useCallback(async () => {
    if (!lesson) return;
    setIsRunning(true);
    const result = await executeSQL(lesson.knowledge.example.sql);
    setExampleResult(result);
    setIsRunning(false);
  }, [lesson]);

  const runUserSQL = useCallback(async () => {
    if (!userSql.trim()) return;
    setIsRunning(true);
    setValidation(null);
    const result = await executeSQL(userSql);
    setUserResult(result);
    setIsRunning(false);
    setStep(3);
  }, [userSql]);

  const checkAnswer = useCallback(async () => {
    if (!lesson || !userSql.trim()) return;
    setIsRunning(true);
    const result = await validateAnswer(userSql, lesson.exercise.answerSql, lesson.exercise.validateMode);
    setValidation({ checked: true, ...result });
    setIsRunning(false);
  }, [lesson, userSql]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-ink/50">课程不存在</p>
          <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-accent rounded-lg text-sm text-paper">
            回到首页
          </button>
        </div>
      </div>
    );
  }

  const diffClass = DIFFICULTY_COLOR[lesson.difficulty];
  const diffLabel = DIFFICULTY_LABEL[lesson.difficulty];

  return (
    <div className="min-h-screen text-ink">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-ink/60 hover:text-ink transition-colors text-sm">
              ← 课程列表
            </button>
            <span className="text-ink/40">|</span>
            <span className="text-accent text-sm font-medium">{lesson.id}</span>
            <span className="text-ink text-sm font-semibold hidden sm:block">{lesson.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${diffClass}`}>{diffLabel}</span>
            <span className="text-xs text-ink/60">⏱ {lesson.estimatedMinutes}min</span>
          </div>
        </div>
        <StepIndicator currentStep={step} totalSteps={4} />
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-6">

          {/* 左侧主内容 */}
          <div className="space-y-6">

            {/* ========== STEP 0: 数据预览 ========== */}
            <section className="rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-ink/5 transition-colors"
                onClick={() => setStep(step === 0 ? 1 : 0)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 0 ? 'bg-accent text-paper' : 'bg-ink/10'}`}>1</div>
                  <div>
                    <h2 className="font-semibold text-sm">数据预览</h2>
                    <p className="text-xs text-ink/60">先看看我们要操作的数据长什么样</p>
                  </div>
                </div>
                <span className="text-ink/60 text-xs">{step === 0 ? '▼' : '▶'}</span>
              </div>

              {step === 0 && (
                <div className="px-4 pb-4 space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-ink/60">加载数据中...</div>
                  ) : (
                    <>
                      {/* 表格切换 */}
                      <div className="flex gap-2 flex-wrap">
                        {lesson.tables.map(table => (
                          <button
                            key={table}
                            onClick={() => setSelectedTable(table)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selectedTable === table ? 'bg-accent text-paper' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'
                            }`}
                          >
                            {TABLE_METADATA[table as keyof typeof TABLE_METADATA]?.icon} {table}
                          </button>
                        ))}
                      </div>

                      {/* 表结构说明 */}
                      {selectedTable && TABLE_METADATA[selectedTable as keyof typeof TABLE_METADATA] && (
                        <div className="bg-panel/75 rounded-xl p-3 border border-ink/10">
                          <p className="text-xs text-ink/60 mb-2">
                            📋 {TABLE_METADATA[selectedTable as keyof typeof TABLE_METADATA].description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {TABLE_METADATA[selectedTable as keyof typeof TABLE_METADATA].columns.map(col => (
                              <span key={col.name} className="text-xs bg-ink/5 rounded-lg px-2 py-1">
                                <code className="text-accent">{col.name}</code>
                                <span className="text-ink/60 ml-1">·</span>
                                <span className="text-ink/60 ml-1">{col.desc}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 数据表格 */}
                      {selectedTable && tableData[selectedTable] && (
                        <div>
                          <p className="text-xs text-ink/60 mb-2">前 5 条数据示例</p>
                          <ResultTable result={tableData[selectedTable]} />
                        </div>
                      )}

                      <button
                        onClick={() => setStep(1)}
                        className="w-full py-2.5 bg-accent hover:bg-accent/90 rounded-xl text-sm font-medium text-paper transition-colors"
                      >
                        已了解数据，进入知识点 →
                      </button>
                    </>
                  )}
                </div>
              )}
            </section>

            {/* ========== STEP 1: 知识点 ========== */}
            <section className="rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-ink/5 transition-colors"
                onClick={() => setStep(step === 1 ? 0 : 1)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-accent text-paper' : 'bg-ink/10 text-ink/60'}`}>2</div>
                  <div>
                    <h2 className="font-semibold text-sm">知识点讲解</h2>
                    <p className="text-xs text-ink/60">{lesson.knowledge.title}</p>
                  </div>
                </div>
                <span className="text-ink/60 text-xs">{step === 1 ? '▼' : '▶'}</span>
              </div>

              {step === 1 && (
                <div className="px-4 pb-4 space-y-4">
                  {/* 解释 */}
                  <div className="bg-accent2/8 border border-accent2/30 rounded-xl p-4">
                    <p className="text-ink/70 text-sm leading-relaxed whitespace-pre-line">{lesson.knowledge.explanation}</p>
                  </div>

                  {/* 语法 */}
                  <div>
                    <p className="text-xs text-ink/60 mb-2 uppercase tracking-wider font-medium">语法结构</p>
                    <pre className="bg-panel/80 rounded-xl p-4 text-sm font-mono text-accent2 overflow-x-auto border border-ink/10">
                      {lesson.knowledge.syntax}
                    </pre>
                  </div>

                  {/* 示例 */}
                  <div>
                    <p className="text-xs text-ink/60 mb-2 uppercase tracking-wider font-medium">📌 示例：{lesson.knowledge.example.description}</p>
                    <pre className="bg-panel/80 rounded-xl p-4 text-sm font-mono text-accent2 overflow-x-auto border border-ink/10">
                      {lesson.knowledge.example.sql}
                    </pre>
                    <button
                      onClick={runExampleSQL}
                      disabled={isRunning}
                      className="mt-2 px-4 py-2 bg-accent2/12 hover:bg-accent2/18 border border-accent2/30 rounded-lg text-xs text-accent2 transition-colors"
                    >
                      {isRunning ? '运行中...' : '▶ 运行这个示例看看效果'}
                    </button>
                    {exampleResult && (
                      <div className="mt-3">
                        <ResultTable result={exampleResult} />
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="space-y-2">
                    <p className="text-xs text-ink/60 uppercase tracking-wider font-medium">💡 注意事项</p>
                    {lesson.knowledge.tips.map((tip, i) => (
                      <div key={i} className="flex gap-2 text-sm text-ink/50">
                        <span className="text-accent mt-0.5 shrink-0">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-2.5 bg-accent hover:bg-accent/90 rounded-xl text-sm font-medium text-paper transition-colors"
                  >
                    开始练习 →
                  </button>
                </div>
              )}
            </section>

            {/* ========== STEP 2: 练习题 + 编辑器 ========== */}
            <section className="rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)] overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-ink/5 transition-colors"
                onClick={() => setStep(step === 2 || step === 3 ? 1 : 2)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-accent text-paper' : 'bg-ink/10 text-ink/60'}`}>3</div>
                  <div>
                    <h2 className="font-semibold text-sm">动手练习</h2>
                    <p className="text-xs text-ink/60">写 SQL 解决真实运营问题</p>
                  </div>
                </div>
              </div>

              {(step === 2 || step === 3) && (
                <div className="px-4 pb-4 space-y-4">
                  {/* 业务场景 */}
                  <div className="bg-accent/8 border border-accent/20 rounded-xl p-4">
                    <p className="text-ink/70 text-sm leading-relaxed">{lesson.exercise.scenario}</p>
                  </div>

                  {/* 问题 */}
                  <div className="bg-ink/5 rounded-xl p-4 border border-ink/10">
                    <p className="text-xs text-ink/60 uppercase tracking-wider mb-2 font-medium">📝 你的任务</p>
                    <p className="text-ink text-sm leading-relaxed">{lesson.exercise.question}</p>
                  </div>

                  {/* SQL 编辑器 */}
                  <SqlEditor
                    value={userSql}
                    onChange={setUserSql}
                    onRun={runUserSQL}
                    isRunning={isRunning}
                  />

                  {/* 用户结果 */}
                  {userResult && (
                    <div>
                      <p className="text-xs text-ink/60 mb-2">执行结果</p>
                      <ResultTable result={userResult} />
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={runUserSQL}
                      disabled={isRunning || !userSql.trim()}
                      className="flex-1 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-paper transition-colors"
                    >
                      {isRunning ? '运行中...' : '▶ 运行 SQL'}
                    </button>
                    {userResult && !userResult.error && (
                      <button
                        onClick={checkAnswer}
                        disabled={isRunning}
                        className="flex-1 py-2.5 bg-accent2 hover:bg-accent2/90 disabled:opacity-40 rounded-xl text-sm font-medium text-paper transition-colors"
                      >
                        ✓ 验证答案
                      </button>
                    )}
                  </div>

                  {/* 提示系统 */}
                  <div className="flex gap-2 flex-wrap">
                    {hintIndex < lesson.exercise.hints.length - 1 && (
                      <button
                        onClick={() => setHintIndex(prev => prev + 1)}
                        className="px-4 py-2 bg-ink/5 hover:bg-ink/10 rounded-lg text-xs text-ink/50 border border-ink/10 transition-colors"
                      >
                        💡 {hintIndex === -1 ? '需要提示？' : `下一条提示（${hintIndex + 2}/${lesson.exercise.hints.length}）`}
                      </button>
                    )}
                    {!showAnswer && (
                      <button
                        onClick={() => setShowAnswer(true)}
                        className="px-4 py-2 bg-ink/5 hover:bg-ink/10 rounded-lg text-xs text-ink/50 border border-ink/10 transition-colors"
                      >
                        🔓 查看参考答案
                      </button>
                    )}
                  </div>

                  {/* 显示提示 */}
                  {hintIndex >= 0 && (
                    <div className="space-y-2">
                      {lesson.exercise.hints.slice(0, hintIndex + 1).map((hint, i) => (
                        <div key={i} className="flex gap-2 items-start bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                          <span className="text-yellow-400 text-xs shrink-0">💡 提示{i + 1}</span>
                          <span className="text-yellow-300 text-xs">{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 参考答案 */}
                  {showAnswer && (
                    <div>
                      <p className="text-xs text-ink/60 mb-2">📋 参考答案</p>
                      <pre className="bg-panel/80 rounded-xl p-4 text-sm font-mono text-accent2 overflow-x-auto border border-ink/10">
                        {lesson.exercise.answerSql}
                      </pre>
                    </div>
                  )}

                  {/* 验证结果 */}
                  {validation?.checked && (
                    <div className={`rounded-xl border p-4 ${
                      validation.correct
                        ? 'bg-accent2/12 border-accent2/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <p className={`font-semibold text-sm mb-1 ${validation.correct ? 'text-accent2' : 'text-red-400'}`}>
                        {validation.correct ? lesson.exercise.successMessage : lesson.exercise.failMessage}
                      </p>
                      {validation.correct && nextLesson && (
                        <button
                          onClick={() => router.push(`/lessons/${nextLesson.id}`)}
                          className="mt-3 w-full py-2 bg-accent2 hover:bg-accent2/90 rounded-lg text-sm font-medium transition-colors text-paper"
                        >
                          进入下一课：{nextLesson.title} →
                        </button>
                      )}
                      {validation.correct && !nextLesson && (
                        <button
                          onClick={() => router.push('/')}
                          className="mt-3 w-full py-2 bg-accent hover:bg-accent/90 rounded-lg text-sm font-medium transition-colors text-paper"
                        >
                          🎉 完成全部课程！返回首页
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* 右侧边栏（PC端） */}
          <aside className="hidden lg:block space-y-4">
            {/* 课程导航 */}
            <div className="rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)] p-4">
              <h3 className="text-xs text-ink/60 uppercase tracking-wider font-medium mb-3">课程列表</h3>
              <div className="space-y-1">
                {LESSONS.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => router.push(`/lessons/${l.id}`)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      l.id === lessonId
                        ? 'bg-accent/12 text-accent border border-accent/30'
                        : 'text-ink/60 hover:bg-ink/5 hover:text-ink/70'
                    }`}
                  >
                    <span className="font-mono mr-2 text-ink/60">{l.id}</span>
                    {l.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 相关表结构 */}
            <div className="rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)] p-4">
              <h3 className="text-xs text-ink/60 uppercase tracking-wider font-medium mb-3">本课用到的表</h3>
              <div className="space-y-3">
                {lesson.tables.map(table => {
                  const meta = TABLE_METADATA[table as keyof typeof TABLE_METADATA];
                  return meta ? (
                    <div key={table}>
                      <p className="text-xs font-medium text-ink/50 mb-1">{meta.icon} <code className="text-accent">{table}</code></p>
                      <div className="space-y-0.5">
                        {meta.columns.map(col => (
                          <div key={col.name} className="flex gap-2 text-xs">
                            <code className="text-accent2 shrink-0">{col.name}</code>
                            <span className="text-ink/40">·</span>
                            <span className="text-ink/60">{col.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* 标签 */}
            <div className="rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)] p-4">
              <h3 className="text-xs text-ink/60 uppercase tracking-wider font-medium mb-3">知识标签</h3>
              <div className="flex flex-wrap gap-2">
                {lesson.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-ink/5 rounded-lg text-xs text-ink/50 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
