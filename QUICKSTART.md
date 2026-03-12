# 快速启动指南

## 安装依赖

```bash
npm install
```

## 启动开发服务器

```bash
npm run dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目功能

### 首页
- 查看所有课程列表
- 按难度分类（入门/进阶/高级）
- 点击"从第一课开始"或任意课程卡片进入学习

### 课程详情页
1. **数据预览** - 查看电商数据表（商品、订单、用户）
2. **知识点学习** - 学习 SQL 语法和示例
3. **动手练习** - 在 SQL 编辑器中编写查询
4. **即时验证** - 系统自动判断答案正确性

### 核心特性
- ✅ 纯前端运行（sql.js + WebAssembly）
- ✅ 实时 SQL 执行和结果展示
- ✅ 自动答案验证
- ✅ 学习进度追踪
- ✅ 响应式设计（支持移动端）

## 课程列表

| 课程ID | 标题 | 难度 |
|--------|------|------|
| L01 | SELECT 基础查询 | 入门 |
| L02 | WHERE 条件筛选 | 入门 |
| L03 | ORDER BY 排序 | 入门 |
| L04 | LIMIT 分页 | 入门 |
| L05 | 聚合函数 | 进阶 |
| L06 | GROUP BY 分组 | 进阶 |
| L07 | HAVING 过滤 | 进阶 |
| L08 | JOIN 多表关联 | 高级 |
| L09 | 子查询 | 高级 |
| L10 | 综合案例 | 高级 |

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- sql.js (WebAssembly)
- CodeMirror 6
- Framer Motion
- Zustand

## 常见问题

### 1. 依赖安装失败？
确保使用 Node.js 18+ 版本：
```bash
node --version
```

### 2. SQL 执行报错？
sql.js 会自动从 CDN 加载 WebAssembly 文件，确保网络连接正常。

### 3. 如何重置学习进度？
打开浏览器开发者工具，在 Console 中执行：
```javascript
localStorage.removeItem('completedLessons')
```

## 项目结构

```
sql_exercise_v2/
├── app/                    # Next.js 应用目录
│   ├── page.tsx           # 首页
│   ├── lessons/[id]/      # 课程详情页
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   ├── lesson/           # 课程相关组件
│   └── ui/               # UI 基础组件
└── lib/                  # 核心逻辑
    ├── db/              # 数据库相关
    └── lessons/         # 课程数据
```

## 开发建议

1. 修改课程内容：编辑 `lib/lessons/index.ts`
2. 修改数据库数据：编辑 `lib/db/schema.ts`
3. 调整样式：修改 `app/globals.css` 或组件内的 Tailwind 类名
4. 添加新组件：在 `components/` 目录下创建

---

祝学习愉快！🎉
