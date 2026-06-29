#!/usr/bin/env node
// rui-html — 文档页面组件化生成帮助
// 用法: node .claude/rui-html/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-html — 4 文件组件化文档页面系统")}

${dim("Vue 3 CDN · 零构建 · Token 桥接主题 · 原生 JS i18n · 组件生成与重构 | 标准组件化模式")}

${hdr("快速入门")}
${item("用户说 \"create a doc page\" / \"文档页面\" / \"component template\" / \"组件化 HTML\"", "触发文档页面生成/重构 → 标准 4-file 组件化模式", cyan)}
${item("核心模式", "一个组件 = 四个文件: index.html (结构) + index.css (样式) + index.js (逻辑) + data.js (数据)", dim)}

${hdr("标准 4 文件组件化模式")}
${item("index.html", "① 结构 — <template id> + <script src=\"data.js\"> + <script src=\"index.js\">", cyan)}
${item("index.css", "② 样式 — .vl-doc 作用域 · 全部 var(--yry-*) token · 768px/375px 响应式断点", cyan)}
${item("index.js", "③ 逻辑 — mountDocComponent({name, templateId, dataKey, i18n, extra})", cyan)}
${item("data.js", "④ 数据 — window.XXX_CONFIG = { constants, en, 'zh-CN' } — i18n 就绪", cyan)}

${hdr("为什么是 4 文件？")}
${item("可维护性", "结构/样式/逻辑/数据各司其职，改样式只动 CSS，改数据只动 JS", dim)}
${item("可复用性", "data.js 可被其他组件引用；CSS 可被覆盖", dim)}
${item("可审查性", "Git diff 每个文件独立，改动一目了然", dim)}
${item("团队协作", "结构/样式/逻辑/数据可并行修改", dim)}
${item("工具兼容", "HTML/CSS/JS 各自用标准工具 (prettier/eslint)", dim)}

${hdr("index.html 规则")}
${item("<template id>", "全局唯一 — 匹配 index.js 中的 templateId", yellow)}
${item("<section id>", "匹配 sidebar href 锚点", yellow)}
${item("脚本加载顺序", "data.js 必须在 index.js 之前", yellow)}
${item("内容渲染", "含 HTML 用 v-html，纯文本用 {{ }}", yellow)}
${item("CDN 引用", "Vue 3 (unpkg) + 主题 CSS (cdn/theme/{name}.css) + 组件 CSS/JS (cdn/)", dim)}

${hdr("index.css 规则")}
${item("零硬编码颜色", "全部样式用 var(--yry-*) — 跟随主题切换", yellow)}
${item("作用域", ".vl-doc 前缀防止样式泄漏到全局", yellow)}
${item("响应式", "768px（平板）· 375px（手机）断点", yellow)}
${item("交互", ":hover 边框变色 · 过渡动画 · 卡片悬浮效果", dim)}

${hdr("index.js 规则")}
${item("永远用 mountDocComponent()", "不直接调 Vue.createApp() — 统一挂载逻辑", yellow)}
${item("i18n: true", "自动处理语言切换（en ↔ zh-CN）", yellow)}
${item("extra.methods", "事件处理函数 → 模板中 @click=\"handleClick(id)\"", dim)}
${item("extra.computed", "派生数据 → 自动缓存 + 依赖追踪", dim)}
${item("extra.mounted", "DOM 依赖初始化（图表、外部库）", dim)}
${item("extra.beforeUnmount", "清理定时器 · 事件监听 · 子 Vue 实例 unmount()", yellow)}

${hdr("data.js 规则")}
${item("constants 顶层", "跨语言常量（非语言切片内）→ repoUrl 等", yellow)}
${item("语言切片结构一致", "en 和 zh-CN 的 key/嵌套完全相同", yellow)}
${item("window key 全局唯一", "window.XXX_CONFIG — 与 index.js 中 dataKey 匹配", yellow)}
${item("不要在属性名中用语种代码", "en/zh-CN 只在顶层做切片键 — 属性名保持中性", yellow)}

${hdr("设计流水线")}
${item("Phase 1 — 新页面搭建", "确定组件名 → 查询 rui-ui 设计智能 → 选 rui-theme 主题 → 生成 4 文件骨架", cyan)}
${item("Phase 2 — 已有页面重构", "读取页面 → 分析结构/样式/逻辑/数据 → 按 4-file 拆分 → 验证功能一致", cyan)}
${item("Phase 3 — 增强", "添加 i18n · 添加 Vue 交互 · 优化响应式 · 补充 CDN 组件引用", cyan)}

${hdr("组件路径约定")}
${item("普通组件", "docs/components/<name>/ — index.html + index.js + index.css + data.js", dim)}
${item("视图页面", "docs/views/<name>/ — 同上 4-file 结构", dim)}
${item("演示页面", "docs/views/<name>/demos/<slug>/ — 同上 4-file 结构（独立模式）", dim)}
${item("CDN 组件", "cdn/<name>/ — 供其他页面引用的公共组件", dim)}

${hdr("与 rui-demos 协作")}
${item("独立 Demo 模式", "views/<name>/demos/ 下的 demo → 无 data-include 依赖 → 手动 i18n → YrySceneCard 独立挂载", yellow)}
${item("CDN 路径", "4 级相对引用: ../../../../cdn/... → docs/cdn/...", dim)}

${hdr("使用场景")}
${scene("场景 1 — 创建新文档页面")}
${item("用户: \"create a docs page for the config reference\"", "→ Phase 1: 查询 rui-ui 设计智能 → 选主题 → 生成 4 文件 → 填充 i18n 内容", cyan)}

${scene("场景 2 — 重构静态页面")}
${item("用户: \"refactor this page to 4-file pattern\"", "→ Phase 2: 读取单文件 → 提取 HTML/CSS/JS/Data → 拆分为 4 文件 → 验证", cyan)}

${scene("场景 3 — 添加 i18n 支持")}
${item("用户: \"add Chinese translation to this page\"", "→ Phase 3: 提取 en 内容 → 创建 zh-CN 切片 → mountDocComponent i18n: true", cyan)}

${scene("场景 4 — 添加 Vue 交互")}
${item("用户: \"add filtering and search to this list\"", "→ Phase 3: 添加 computed.filteredItems → v-model 搜索框 → v-for 渲染", cyan)}
`;

console.log(help);
