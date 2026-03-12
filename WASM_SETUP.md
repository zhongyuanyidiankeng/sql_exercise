# SQL.js WASM 文件说明

由于 sql.js 需要加载 WebAssembly 文件，有两种方式：

## 方案 1：从 CDN 加载（当前配置）
- 优点：无需额外文件，自动更新
- 缺点：依赖网络，可能被防火墙阻止

## 方案 2：本地文件（如果 CDN 失败）

1. 下载 WASM 文件到 public 目录：
```bash
# 在项目根目录执行
mkdir -p public
curl -o public/sql-wasm.wasm https://sql.js.org/dist/sql-wasm.wasm
```

2. 修改 lib/db/sqlRunner.ts 中的 locateFile：
```typescript
const SQL = await initSqlJs({
  locateFile: (file: string) => `/sql-wasm.wasm`,
});
```

## 当前状态
项目配置使用方案 1（CDN 加载）。如果遇到加载失败，请：
1. 检查网络连接
2. 确认可以访问 https://sql.js.org
3. 如果问题持续，切换到方案 2
