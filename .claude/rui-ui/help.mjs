#!/usr/bin/env node
// rui-ui — 设计智能数据库帮助
// 用法: node .claude/rui-ui/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-ui — 设计智能数据库")}

${dim("BM25 检索 · 8 大设计领域 · 22+ 框架栈 · 设计系统生成 · Markdown/JSON 输出 | 为下游技能提供设计参考")}

${hdr("快速入门")}
${item("用户说 \"design inspiration\" / \"color palette\" / \"typography\" / \"landing pattern\"", "触发 BM25 搜索 → 返回设计推荐 → 可选生成完整设计系统", cyan)}
${item("用户说 \"design system for X\" / \"UI recommendation\"", "→ python3 scripts/search.py \"<query>\" --design-system → 风格+颜色+字体+UX 全推荐", cyan)}

${hdr("调用入口")}
${item("命令", "python3 <this-skill-dir>/scripts/search.py \"<query>\" [options]", cyan)}
${item("位置", ".claude/rui-ui/scripts/search.py — 与 SKILL.md 并列", dim)}

${hdr("4 种运行模式")}
${item("领域搜索", "python3 .../search.py \"<kw>\" → 该领域 Top 3 匹配行", cyan)}
${item("框架栈搜索", "python3 .../search.py \"<kw>\" --stack <stack> → 框架特定指南", cyan)}
${item("设计系统", "python3 .../search.py \"<kw>\" --design-system [-p \"Project Name\"] → 风格+颜色+字体+UX 全推荐", yellow)}
${item("持久化设计系统", "... --design-system --persist [-p \"...\"] [--page \"<page>\"] → 写入 design-system/<slug>/MASTER.md + 页面覆盖", yellow)}
${item("Raw JSON", "追加 --json → 结构化 JSON 替代 Markdown", dim)}

${hdr("8 大设计领域")}
${item("style", "设计风格目录 — glassmorphism · brutalism · minimalism · neumorphism ...", dim)}
${item("color", "色板 — 主色 · 辅色 · 强调色 · 中性色 · 语义色 (success/warning/error)", dim)}
${item("typography", "字体配对 — 标题+正文组合 · Google Fonts 推荐", dim)}
${item("chart", "图表类型与预设 — 折线 · 柱状 · 雷达 · 散点 · 热力图 ...", dim)}
${item("landing", "落地页模式 — hero+features · 英雄+CTA · 对比表 · 交互演示 ...", dim)}
${item("product", "产品原型 — SaaS · 仪表盘 · 电商 · 社交媒体 · 内容平台 ...", dim)}
${item("ux", "UX 指南 — 导航 · 表单 · 反馈 · 无障碍 · 响应式策略", dim)}
${item("google-fonts", "Google Fonts 推荐 — 按风格/语言/使用场景筛选", dim)}

${hdr("22+ 框架栈")}
${item("前端框架", "react · nextjs · vue · svelte · astro · nuxtjs · nuxt-ui · angular · laravel", yellow)}
${item("移动端", "swiftui · react-native · flutter · jetpack-compose", yellow)}
${item("桌面端", "javafx · wpf · winui · avalonia · uno · uwp", yellow)}
${item("CSS 框架", "html-tailwind · shadcn", yellow)}
${item("3D", "threejs", yellow)}

${hdr("设计系统生成器 (--design-system)")}
${item("输出内容", "推荐风格类别 · 主/辅/强调色板 (hex) · 字体配对 (header+body) · UX 启发式规则", cyan)}
${item("持久化 (--persist)", "design-system/<slug>/MASTER.md — 页面级覆盖文件树 · 版本可追溯", cyan)}
${item("页面覆盖 (--page)", "为特定页面创建覆盖 → 主设计系统的变体", dim)}
${item("被调用", "rui-demos Phase 0 · rui-html Phase 1 — 在提交主题前查询设计智能", dim)}

${hdr("搜索技术")}
${item("算法", "BM25 — 自定义实现，无外部依赖", dim)}
${item("数据源", "CSV 语料库 — data/*.csv + data/stacks/*.csv（只读）", dim)}
${item("输出", "Markdown (默认) · JSON (--json)", dim)}

${hdr("专业代理")}
${item("design-query-parser", "自然语言设计需求 → search.py CLI 调用计划", cyan)}
${item("recommendation-synthesizer", "跨风格/配色/字体 BM25 结果 → 一致的设计推荐", cyan)}

${hdr("边界（Borders）")}
${item("做什么", "BM25 搜索精选 UI/UX 语料 · 生成完整设计系统推荐 · 可选持久化为文件树", dim)}
${item("不做什么", "应用主题到页面 (rui-theme) · 渲染视觉制品 · 维护历史趋势（单词推荐）", dim)}

${hdr("协作技能")}
${item("rui-demos", "Phase 0 调用 search.py --design-system → 通知主题选择", dim)}
${item("rui-html", "Phase 1 调用 search.py --design-system → 新页面设计", dim)}
${item("rui-theme", "消费 rui-ui 输出的颜色/字体 token → 生成 --yry-* CSS 变量", dim)}

${hdr("使用场景")}
${scene("场景 1 — 快速配色查询")}
${item("用户: \"recommend a color palette for a fintech dashboard\"", "→ python3 search.py \"fintech dashboard\" → 返回匹配色板 + 风格建议", cyan)}

${scene("场景 2 — 框架特定设计指南")}
${item("用户: \"what's the best UI pattern for shadcn?\"", "→ python3 search.py \"UI pattern\" --stack shadcn → 框架特定设计指南", cyan)}

${scene("场景 3 — 生成完整设计系统")}
${item("用户: \"create a design system for a medical app\"", "→ python3 search.py \"medical\" --design-system -p \"MedApp\" --persist → 写入文件树", cyan)}

${scene("场景 4 — 落地页灵感")}
${item("用户: \"show me landing page patterns for SaaS\"", "→ python3 search.py \"SaaS landing\" → 返回匹配的落地页模式 + 示例特征", cyan)}
`;

console.log(help);
