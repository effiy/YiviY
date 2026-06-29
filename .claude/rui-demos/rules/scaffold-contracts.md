---
paths:
  - ".claude/rui-demos/**"
  - ".claude/rui-demos/SKILL.md"
description: "从 rui-scene 卡片数据生成 4 文件 demo 的边界与契约。"
---

# rui-demos 脚手架契约

> 把 rui-scene 的 YrySceneCard 数据包装成可独立访问的演示页面，所有路径与渲染边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | rui-scene 的卡片数组（`INTRO_CONFIG.en.cards` 或 `data.js` 片段） |
| 输出 | `docs/components/<scene>/demos/<slug>/{index.html,index.js,index.css,data.js}` 4 文件 |
| 调用模式 | 6 阶段管线（Discovery → Classify → Scaffold → Content → Integrate → Validate）|
| 状态 | 写产物 + 可选回滚（不修改源 scene 数据） |

## 6 阶段产物矩阵

| 阶段 | 写产物 | 读产物 | 失败语义 |
|------|--------|--------|---------|
| 0 Discovery | `_demo-plan.json` | scene `data.js` | 无卡片 → 退出并提示先用 [[rui-scene]] |
| 1 Classify | `_batch-plan.json` | `_demo-plan.json` | 类型不可判定 → 默认 B + warning |
| 2 Scaffold | 4 文件骨架 | `assets/scaffold-*` | CDN 不可达 → 阻塞 Phase 3 |
| 3 Content | 4 文件内容填充 | `_batch-plan.json` + 类型 spec | 部分失败 → 保存部分结果 |
| 4 Integrate | scene demo 索引页 | scene + 子目录 | 索引页缺失可恢复 |
| 5 Validate | 验证报告 | 全部输出 | 阻塞问题 → 列出清单 |

## 4 文件结构契约

| 文件 | 必含元素 | 禁止 |
|------|---------|------|
| `index.html` | DOCTYPE、viewport、theme `<link>`、Vue 3 CDN、`<div id="scene-card">`、`<div id="demo-app">`、`<script src="data.js">` 后跟 `<script src="index.js">` | 内联样式 / 异步数据 fetch / 服务端逻辑 |
| `index.js` | IIFE 包裹、`Vue.createApp()`、`YrySceneCard.mount()`、`window.DEMO_MOCK_DATA` 引用、`beforeUnmount` 清理 | 任何 `window.*` 顶层暴露（非 mount 必要） |
| `index.css` | reset / layout / type-specific / responsive | 硬编码 hex/rgb（必须用 `var(--yry-*)`）|
| `data.js` | `window.DEMO_CARD_DATA`、`window.DEMO_MOCK_DATA`、`_meta` | 跨 demo 全局副作用 |

## 6 种 demo 类型边界

| 类型 | 触发信号 | Demo Area 形态 | 互动作最低要求 |
|------|---------|----------------|---------------|
| A Tool Interface | 自定义外部链接 / 3+ 自定义 | 模拟 UI（输入 + 输出） | 用户输入 → 模拟处理 → 渲染结果 |
| B Pipeline | purple tag / stage 关键词 | 步骤流图 | 步骤点击展开 + 自动播放序列 |
| C Comparison | 量化 tag（"6 engines"） | 并排对比面板 | 切换变体 + 高亮差异 |
| D State Machine | "real-time" / "state" | 交互式状态图 | 点击触发状态切换 |
| E Dashboard | badge='Report' | 度量卡 + 图表 | hover 详情 + 维度切换 |
| F Guide | badge='Guide' / nameHref 锚点 | 步骤引导 + 代码块 | 步骤导航 + 代码复制 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `docs/components/<scene>/demos/<slug>/` | write | 4 文件主产物 |
| `docs/components/<scene>/demos/index.html` | write | scene 索引页 |
| `assets/scaffold-*.{html,js,css}` | read-only | 脚手架模板权威 |
| `assets/demo-index.html` | read-only | 索引页模板 |
| `<scene>/data.js`（源卡片） | read | 不修改源 scene 数据 |
| `_demo-plan.json` / `_batch-plan.json` | write | 中间产物 |
| 主题 CSS | read | [[rui-theme]] 输出 |
| `cdn/yry-scene-card/` | read-only | 上游组件 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 所有 `var(--yry-*)` 来源于主题 CSS — 禁止硬编码 hex/rgb | 主题可切换 | 抛出构建错误 |
| 2 | `<script>` 加载顺序：先 `data.js` 后 `index.js`（绝对） | IIFE 依赖 | 重排顺序 |
| 3 | 卡片区域在 Vue mount point 外，禁止内部 `{{ }}` 模板 | template 渲染边界 | 移除或转义 |
| 4 | `beforeUnmount` 必须清理 Chart、Timer、AbortController | 内存泄漏防线 | 阻塞输出 |
| 5 | 不写入 scene 既有数据；修改需经 rui-scene | 数据所有权分离 | 拒绝并提示 |
| 6 | Mock 数据必须客户端生成 — 禁止 `fetch()` 真实端点 | 自包含 | 改成静态数据 |
| 7 | 主题由 rui-theme 决定，本技能不内置颜色 | 单一来源 | 报错并跳转 rui-theme |
| 8 | 渲染图标仅用内联 SVG 或 emoji — 禁图标字体 | 零依赖 | 移除字体包引用 |
| 9 | 单 demo `<style>` 总量上限 250 行 — 超出提示拆分 | 包体积控制 | 警告并继续（无阻塞）|

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| 子代理渲染失败（≤2 次） | 自动重试 1 次 | 重试仍失败 → 标记 partial |
| 子代理持续失败 | 写 scaffold + 部分内容 | "Partial" 标签公示 |
| Chart.js CDN 不可达（Type E） | 降级为静态 SVG 简化版 | 提示部署 cdnis 镜像 |
| 主题 CSS 路径 404 | 提示调用 [[rui-theme]] 重新生成 | 中断 Phase 4 |
| 卡片 desc 缺失（<8 字符） | 标 warning，仍然生成 demo | 提示调用 [[rui-scene]] 补全 |
| 语言切片缺失 | 默认 `en` | 显式询问调用方 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-scene]] | 上游 | `data.js` 中卡片对象 | 卡片数据源 |
| [[rui-theme]] | 上游 | `cdn/theme/<name>.css` | 提供颜色/字体 |
| [[rui-ui]] | 上游（可选） | `--design-system` 设计情报 | Phase 0 调用 |
| [[rui-html]] | 平行 | 4 文件结构同源 | 不直接调用 |
| [[rui-graph]] / [[rui-diagram]] | 下游候选 | 对 demo 数据做可视化 | 由调用方决定 |
| [[rui-web-test]] | 下游 | 验证生成的 4 文件结构 | Phase 5 推荐联动 |

## 集成点

> 当前状态：rui-demos 为按需工具，无内置定时器。Phase 5 验证脚本可被 [[rui-web-test]] 接管。Phase 0 的设计情报查询 (`python3 rui-ui/scripts/search.py`) 是约定调用，但不强制 — 调用方可使用既有主题。
