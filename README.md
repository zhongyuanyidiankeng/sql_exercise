﻿# SQL 电商运营学习平台

一个专为电商运营人员设计的 SQL 入门学习平台，支持移动端和 PC 端。

## 项目结构

```
sql-learning/
├── app/
│   ├── layout.tsx                    # 根布局
│   ├── page.tsx                      # 首页（课程列表）
│   ├── globals.css                   # 全局样式 + CSS 变量
│   ├── lessons/
│   │   ├── [id]/
│   │   │   └── page.tsx              # 课程详情页（核心交互页）
│   └── api/
│       └── execute-sql/
│           └── route.ts              # SQL 执行 API（使用 sql.js 在浏览器端运行）
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # 顶部导航
│   │   └── ProgressBar.tsx           # 学习进度条
│   ├── lesson/
│   │   ├── DataPreview.tsx           # 数据预览（表格展示）
│   │   ├── KnowledgeCard.tsx         # 知识点卡片
│   │   ├── ExercisePanel.tsx         # 练习题面板
│   │   ├── SqlEditor.tsx             # SQL 编辑器
│   │   ├── ResultTable.tsx           # 执行结果表格
│   │   └── FeedbackModal.tsx         # 答题反馈弹窗
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       └── Tooltip.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts                 # 数据库 schema 定义（电商数据）
│   │   └── sqlRunner.ts              # SQL 执行引擎（sql.js）
│   ├── lessons/
│   │   └── index.ts                  # 课程数据（知识点 + 题目）
│   └── utils.ts
├── public/
│   └── sql-wasm.wasm                 # sql.js WebAssembly 文件
└── package.json
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **SQL 引擎**: sql.js（WebAssembly，纯前端执行，无需后端数据库）
- **代码编辑器**: CodeMirror 6
- **状态管理**: Zustand
- **动画**: Framer Motion

## 核心功能

### 学习流程
1. **数据预览** - 展示电商场景的真实数据表（订单、商品、用户、类目）
2. **知识点示例** - 图文并茂的 SQL 语法讲解 + 可执行示例
3. **实际问题** - 基于电商场景的真实业务问题
4. **解答验证** - 用户写 SQL → 执行 → 自动对比答案判断正误

### 电商知识点体系（10 节课）

| 课程 | 知识点 | 业务场景 |
|------|--------|---------|
| L01 | SELECT 基础 | 查看商品列表 |
| L02 | WHERE 筛选 | 找出滞销商品 |
| L03 | ORDER BY 排序 | 销量排行榜 |
| L04 | LIMIT 分页 | TOP10 爆款 |
| L05 | 聚合函数 COUNT/SUM/AVG | 日销售额统计 |
| L06 | GROUP BY 分组 | 各类目销售对比 |
| L07 | HAVING 过滤分组 | 找出高价值类目 |
| L08 | JOIN 多表关联 | 订单+商品+用户关联分析 |
| L09 | 子查询 | 复购用户分析 |
| L10 | 综合案例 | 完整的运营周报 SQL |

## 启动方式

```bash
npm install
npm run dev
```

## 数据库设计（内置电商数据）

```sql
-- 商品表
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  price DECIMAL,
  stock INTEGER,
  sales_count INTEGER,
  created_at DATE
);

-- 订单表
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  total_amount DECIMAL,
  status TEXT,
  created_at DATE
);

-- 用户表
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  city TEXT,
  level TEXT,  -- 普通/银卡/金卡/钻石
  register_date DATE
);

-- 类目表
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT,
  parent_id INTEGER
);
```



## 生产环境部署

### 本地构建 + 自托管

```bash
npm ci
npm run build
npm run start
```

### 环境变量

- `PORT`：服务端口（默认 3000）
- `HOSTNAME`：监听地址（例如 `0.0.0.0`）
- `.env.production.local`：生产环境变量（如需）

### 进程守护（示例：PM2）

```bash
npm install -g pm2
pm2 start npm --name sql-learning -- start
pm2 save
```

### 反向代理（可选）

- 使用 Nginx/Apache 反代到 `http://127.0.0.1:3000`
- 确保 `public/sql-wasm.wasm` 可被正确访问（sql.js 依赖）

## Next.js 版本安全校验（截至 2026-03-12）

- 当前依赖：`next@16.1.6`（见 `package.json`）
- `npm audit` 显示 0 个漏洞

校验命令：

```bash
npm ls next
npm audit --omit=dev
```
