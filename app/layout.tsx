// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SQL 电商运营学习平台',
  description: '专为电商运营人员设计的 SQL 入门课程，边学边练，即时验证',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-ink bg-paper relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-[-10%] h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute top-6 right-[-6%] h-[320px] w-[320px] rounded-full bg-accent2/20 blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
