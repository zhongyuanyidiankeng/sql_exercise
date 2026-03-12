'use client';
// app/page.tsx — 首页，课程列表

import { useRouter } from 'next/navigation';
import { LESSONS, DIFFICULTY_LABEL, DIFFICULTY_COLOR } from '@/lib/lessons';

export default function HomePage() {
  const router = useRouter();

  const beginnerCount = LESSONS.filter(l => l.difficulty === 'beginner').length;
  const intermediateCount = LESSONS.filter(l => l.difficulty === 'intermediate').length;
  const advancedCount = LESSONS.filter(l => l.difficulty === 'advanced').length;

  return (
    <div className="min-h-screen text-ink">
      {/* 顶部 Hero */}
      <header className="relative overflow-hidden">
        {/* 背景网格 */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,107,53,0.18) 0%, transparent 55%),
              radial-gradient(circle at 75% 20%, rgba(42,157,143,0.12) 0%, transparent 50%),
              linear-gradient(rgba(20,20,22,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20,20,22,0.05) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            专为电商运营设计的 SQL 入门课
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            <span className="text-ink">从零学会</span>
            <span className="text-accent"> SQL</span>
            <br />
            <span className="text-ink/60 text-3xl sm:text-4xl font-normal">用数据驱动运营决策</span>
          </h1>
          <p className="text-ink/50 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            10 节课 · 真实电商数据 · 边学边练 · 即时执行验证<br />
            掌握运营必备数据分析技能，不需要任何编程基础
          </p>

          {/* 数据统计 */}
          <div className="flex justify-center gap-8 mt-8 mb-6">
            {[
              { label: '入门', count: beginnerCount, color: 'text-accent2' },
              { label: '进阶', count: intermediateCount, color: 'text-accent' },
              { label: '高级', count: advancedCount, color: 'text-ink/70' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-xs text-ink/60">{item.label}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push('/lessons/L01')}
            className="px-8 py-3 bg-accent hover:bg-accent/90 rounded-2xl text-paper font-semibold transition-colors text-sm"
          >
            从第一课开始 →
          </button>
        </div>
      </header>

      {/* 课程列表 */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* 学习路径说明 */}
        <div className="grid sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: '👀', step: '01', label: '数据预览', desc: '先看表结构和数据' },
            { icon: '📖', step: '02', label: '知识点', desc: '理解语法和用法' },
            { icon: '✍️', step: '03', label: '动手练习', desc: '写 SQL 解决问题' },
            { icon: '✅', step: '04', label: '验证答案', desc: 'AI 即时判断对错' },
          ].map(item => (
            <div key={item.step} className="flex gap-3 items-start p-4 bg-panel/70 rounded-xl border border-ink/10 shadow-[0_6px_16px_rgba(20,20,22,0.06)]">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm text-ink">{item.label}</p>
                <p className="text-xs text-ink/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 课程卡片 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.map((lesson, index) => {
            const diffClass = DIFFICULTY_COLOR[lesson.difficulty];
            const diffLabel = DIFFICULTY_LABEL[lesson.difficulty];

            return (
              <div
                key={lesson.id}
                onClick={() => router.push(`/lessons/${lesson.id}`)}
                className="group relative p-5 rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)] hover:bg-panel/90 hover:border-accent/40 cursor-pointer transition-all duration-200"
              >
                {/* 顶部 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ink/60 bg-ink/5 px-2 py-1 rounded-lg">{lesson.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${diffClass}`}>{diffLabel}</span>
                  </div>
                  <span className="text-xs text-ink/60">⏱ {lesson.estimatedMinutes}min</span>
                </div>

                {/* 标题 */}
                <h3 className="font-bold text-base text-ink mb-1 group-hover:text-accent transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-ink/60 mb-4">{lesson.subtitle}</p>

                {/* 业务场景摘要 */}
                <p className="text-xs text-ink/60 leading-relaxed line-clamp-2 mb-4">
                  {lesson.exercise.scenario}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-ink/5 rounded text-[11px] text-ink/60 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* hover 箭头 */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent opacity-0 group-hover:opacity-100 transition-opacity text-lg">
                  →
                </div>
              </div>
            );
          })}
        </div>

        {/* 数据库预览 */}
        <div className="mt-12 p-6 rounded-2xl border border-ink/10 bg-panel/70 shadow-[0_10px_30px_rgba(20,20,22,0.08)]">
          <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">📊 内置电商数据库</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'products', icon: '📦', desc: '商品表', count: '15条', cols: 'id, name, category, price, stock, sales_count' },
              { name: 'users', icon: '👥', desc: '用户表', count: '10条', cols: 'id, name, city, level, register_date' },
              { name: 'orders', icon: '🧾', desc: '订单表', count: '20条', cols: 'id, user_id, product_id, quantity, total_amount, status' },
            ].map(table => (
              <div key={table.name} className="bg-panel/75 rounded-xl p-4 border border-ink/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{table.icon}</span>
                  <div>
                    <code className="text-accent text-sm font-mono">{table.name}</code>
                    <span className="text-ink/60 text-xs ml-2">· {table.count}</span>
                  </div>
                </div>
                <p className="text-xs text-ink/60 font-mono">{table.cols}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/60 mt-4 text-center">
            所有数据运行在浏览器内（sql.js + WebAssembly），无需联网，即时响应 ⚡
          </p>
        </div>
      </main>
    </div>
  );
}
