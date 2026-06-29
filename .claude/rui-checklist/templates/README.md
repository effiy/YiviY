# rui-checklist · Templates

卡片质量与视图级清单模板。

| 模板 | 用途 |
|------|------|
| `scene/` | 场景级清单：分析 `docs/components/<scene>/data.js` 中的卡片 |
| `view/`  | 视图级清单：聚合多份报告的章节化清单（嵌入其他组件） |

## scene 模板

完整 4 文件独立页：
- `index.html` — 汇总仪表盘 + 过滤栏 + 卡片列表
- `index.js`   — Vue 3 应用，含 `counts` / `passRate` 计算属性
- `index.css`  — `--check-*` token，状态色（pass / fail / warn / pending）
- `data.js`    — `CHECKLIST_CONFIG` 含 `cards[]` 与 `checks[]`

## view 模板

可嵌入文档组件的清单：
- `index.html` — `<template>` 形式，可被 `mountDocComponent` 注册
- `index.js`   — 通过 `mountDocComponent` 注入（fallback 直接挂载）
- `index.css`  — 组件作用域样式
- `data.js`    — `VIEW_CHECKLIST_CONFIG` 含 `sections[]`

## 状态枚举

| Status | Icon | 含义 |
|--------|------|------|
| `pass` | ✓ | 自动通过 |
| `fail` | ✗ | 自动失败 |
| `warn` | ⚠ | 自动警告（边缘情况） |
| `pending` | ○ | 需人工审查 |