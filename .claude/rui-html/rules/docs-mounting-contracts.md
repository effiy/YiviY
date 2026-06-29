---
paths:
  - ".claude/rui-html/**"
  - ".claude/rui-html/SKILL.md"
description: "VideoLingo 文档站 4 文件组件架构的硬约束与跨技能契约。"
---

# rui-html 文档挂载契约

> Vue 3 CDN + 4 文件组件 + 主题桥接 + 零构建。所有路径、CSS token、i18n 边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 文档需求 / 现有静态页 / KG（来自 [[rui-diagram]]）|
| 输出 | `docs/` 站点的 `index.html` + `index.css` + `assets/` + `components/` + `views/` |
| 调用模式 | 7 个 Workflow（W1–W7）按需选用 |
| 状态 | 严格写产物到 `docs/` 子树，绝不碰其他目录 |

## 4 文件组件契约

| 文件 | 必含元素 | 禁止 |
|------|---------|------|
| `components/<name>/index.html` | `<template id="<name>-template">`、`<section id="<name>">`、`<script src="data.js">` 在前、`index.js` 在后 | 多个 `<template>` 同 ID；裸元素选择器 |
| `components/<name>/data.js` | `window.<NAME>_CONFIG = { constants?, en, 'zh-CN', ... }`；所有语言切片结构同构 | 顶层无全局赋值；语言键与非语言键混用 |
| `components/<name>/index.js` | `mountDocComponent({...})` 调用 | 直接调用 `Vue.createApp()`；漏写 `beforeUnmount` 清理 |
| `components/<name>/index.css` | 限定在 `.vl-doc` 作用域下 | 裸选择器；硬编码 hex/rgb |

## 4 种文件写模式

| 类别 | 复杂度 | 模式 | CSS | 例 |
|------|:---:|------|:---:|------|
| Simple text | 低 | data.js 单层 | 无 | contact、license |
| Table / list | 低–中 | `v-for` | 无 | config |
| Cards + sub-apps | 中 | 容器 + 子 App mount | 极简 | intro（YrySceneCard）|
| Code blocks | 中 | `v-for` + `<pre><code>` | 无 | quick-start |
| Interactive | 高 | events / methods | index.css | sidebar |
| Chart-based | 高 | Chart.js | index.css | code-activity |
| Static | 极低 | 纯 HTML | 无 | 罕见 |

## 脚本加载顺序（硬约束）

```
CDN Vue → CDN Chart.js → CDN theme CSS → docs/index.css
→ yry-loader → yry-tag-chip → yry-scene-card → yry-back-top
→ mount-component.js → lang.js → include.js → main.js
```

| 位置 | 脚本 | 原因 |
|:---:|------|------|
| 1 | `mount-component.js` | 提供 `mountDocComponent()` |
| 2 | `lang.js` | `window.VL_LANG` 先于 `include.js` 就绪 |
| 3 | `include.js` | 顺序执行所有 data-include |
| 4 | `main.js` | 触发 includeHTML().then(...) |

## CSS Token 桥接契约

| Token 类型 | 来源 | 用途 |
|----------|------|------|
| `--yry-*` | CDN 主题（10 套）| 全站色彩 |
| `--vl-doc-*` | `styles/tokens.css` 桥接 | 文档站命名空间 |

**关键**：所有 10 个主题定义**相同** `--yry-*` 变量名。换主题 = 改一个 `<link>`。

## i18n 契约

| 规则 | 违反处置 |
|------|---------|
| 多语言切片必须同构（同名键、同深度） | 校验失败、i18n 解析为 `undefined` |
| `constants` 顶层（不得放入语言切片） | 被 `extra.data()` 覆盖 |
| 语言代码（`en` / `zh-CN`）不得用作数据键 | 被剥离 |
| `currentLang` 字段由 i18n 包装注入，模板不要 shadowing | 被覆盖警告 |

## 挂载生命周期契约

| 阶段 | 必做 | 严禁 |
|------|------|------|
| 创建 | `mountDocComponent({ name, templateId, dataKey, i18n, extra })` | 直接 `Vue.createApp` |
| 挂载 | 自动插入 mount div + auto-inject CSS（白名单命中时）| 自建 div / 手动 link |
| 监听 | `vl-lang-changed` → 重新挂载子 App | 漏处理语言切换导致子 App 泄漏 |
| 卸载 | `beforeUnmount` 内 unmount 子 App、清理 timer / Chart / AbortController | 累积 Vue 实例内存泄漏 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `docs/` 整树 | write | 文档产物 |
| `docs/assets/` | write | mount-component / lang / include / main |
| `docs/components/<name>/` | write | 4 文件组件 |
| `docs/views/<name>/` | write | 独立子页 |
| `docs/styles/` | write | tokens / base / layout / responsive |
| `docs/index.html`, `docs/index.css` | write | 入口 |
| `cdn/theme/<name>.css` | read-only | 来自 [[rui-theme]] |
| `cdn/{yry-loader,yry-tag-chip,yry-scene-card,yry-back-top}/` | read-only | CDN 组件 |
| `_COMPONENTS_WITH_CSS` Set | write（仅在 mount-component.js）| 自动注入白名单 |
| 任何 `docs/` 之外路径 | **no write** | 严禁越界 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 组件 CSS 必须 `.vl-doc` 作用域，避免污染 | 跨页可移植 | 报错并提示 |
| 2 | `<template id>` 全站唯一 | data-include 会重复注入 | 校验失败 |
| 3 | 永不重定义 `Vue.createApp`、`window.YrYVueCE` 等废弃 API | 已被 [[rui-skill]] 历史教训标记 | 拒绝 |
| 4 | 组件若带 `index.css`，其目录名必须加入 `_COMPONENTS_WITH_CSS` Set | 自动注入幂等 | 漏注不阻塞，仅警告 |
| 5 | 不允许 `fetch()` 抓真实数据 — 全静态 | 自包含可 file:// | 改成静态 |
| 6 | 仅在 `beforeUnmount` 销毁 Vue 子 App、Chart、Timer、AbortController | 内存安全 | 阻塞警告 |
| 7 | 语言切换时若组件维护 `mountedApps` 数组，必须先 unmount 旧再 mount 新 | 跨语言无泄漏 | 阻塞警告 |
| 8 | data.js 不能有 `import` / `export` 语句 — 是浏览器 `<script>` | 不可被打包 | 校验 |
| 9 | CSS @import 链固定：`tokens → base → layout → responsive` | 顺序敏感 | 报错 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| Vue CDN 不可达 | 静态 HTML 降级 + 控制台告警 | 引入 Vue 本地副本 |
| 主题 CSS 404 | 黑白 fallback + 提示 | 重新生成主题 |
| `data-include` 抓取失败 | 单组件降级为 placeholder | 用户刷新 |
| 组件 ID 冲突 | data.js 加载前 warning，渲染时崩溃 | 改名 |
| 子 App 累积泄漏 | 页面无明显感知但 DevTools 报警 | `beforeUnmount` 必须实现 |
| i18n 切片缺失键 | 渲染为 `undefined` | 补齐 `data.js` |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-diagram]] | 上游 | `knowledge-graph.json` | 嵌入 SVG |
| [[rui-theme]] | 上游 | `--yry-*` | 主题切换 |
| [[rui-scene]] | 平行 | 卡片数据 | YrySceneCard 引入 |
| [[rui-demos]] | 平行 | 4 文件结构同源 | 各自维护 |
| [[rui-graph]] / [[rui-diagram]] | 下游候选 | view 子页 | 可被嵌入 |

## 集成点

> 当前状态：本技能为按需工具，无管线自动触发。如需"管线完成自动生成新文档页"，由管线协调器在尾部显式调用 rui-html 的相关 Workflow（W1 / W6），避免在 rui-html 内实现内置触发器。
