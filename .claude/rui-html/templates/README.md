# rui-html · Templates

文档组件与独立页的标准化模板。

## 文件结构

### `component/` — 文档组件（4 文件）
挂载到 `docs/components/<scene>/`，通过 `data-include` 加载。

| 文件 | 作用 |
|------|------|
| `index.html` | `<template id="...">` Vue 模板根 |
| `data.js`  | `window.XXX_CONFIG`（constants + i18n 文案） |
| `index.js` | `DOC_XXX_EXTRA` 对象（data/computed/methods/mounted/beforeUnmount） |
| `index.css` | 组件作用域样式，必须加入 `_COMPONENTS_WITH_CSS` 白名单 |

### `standalone/` — 独立子页（4 文件）
挂载到 `docs/views/<name>/`，不依赖侧边栏与跨组件依赖。

| 文件 | 作用 |
|------|------|
| `index.html` | 完整 HTML 入口 |
| `data.js`  | `window.XXX_CONFIG` |
| `index.js` | `PAGE_XXX_APP` Vue 应用 |
| `index.css` | 页面作用域样式 |

## 占位符约定

- `<<PLACEHOLDER>>` — 模板生成器需替换的字段
- `{{ ... }}` — Vue 模板插值（生成后保留）
- `__PLACEHOLDER__` — 兼容现有 rui-demos 风格的占位符（部分文件）

## 资源管理硬约束

- `beforeUnmount` 必须清理：Chart 实例、Timer、`AbortController`
- 父组件在语言切换重渲染前显式 `app.unmount()` 防泄漏
- CSS 颜色一律 `--yry-*` / `--vl-doc-*` token，禁止硬编码 hex / px 字号