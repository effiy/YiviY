#!/usr/bin/env node
// rui-theme — 主题样式工具包帮助
// 用法: node .claude/rui-theme/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-theme — 主题样式工具包")}

${dim("10 套预设主题 · 自定义主题生成 · CSS Token 输出 · 字体配色 | 为任意制品应用专业样式")}

${hdr("快速入门")}
${item("用户说 \"apply a theme\" / \"change the theme\" / \"pick a color scheme\"", "→ 展示 10 套主题 → 用户选择 → 读取主题定义 → 应用到制品", cyan)}
${item("用户说 \"create a custom theme\" / \"generate a theme\"", "→ 接收描述 → python3 scripts/generate-theme.py \"<描述>\" → 生成新主题", cyan)}
${item("主题输出", "CSS 文件（cdn/theme/<name>.css）或 stdout — 定义权威 --yry-* token 值", dim)}

${hdr("10 套预设主题")}
${item("1. Ocean Depths", "深海 — 专业沉稳的海事风格 · 蓝绿色系", dim)}
${item("2. Sunset Boulevard", "日落大道 — 温暖活力的日落色系 · 橙红调", dim)}
${item("3. Forest Canopy", "森林华盖 — 自然沉稳的大地色系 · 绿色调", dim)}
${item("4. Modern Minimalist", "现代极简 — 干净当代的灰色系 · 默认推荐", dim)}
${item("5. Golden Hour", "金色时光 — 丰富温暖的秋日色板 · 金棕色系", dim)}
${item("6. Arctic Frost", "极地冰霜 — 冷静清爽的冬日主题 · 蓝白色系", dim)}
${item("7. Desert Rose", "沙漠玫瑰 — 柔和精致的尘土色系 · 粉棕调", dim)}
${item("8. Tech Innovation", "科技创新 — 大胆现代的科技美学 · 霓虹色系", dim)}
${item("9. Botanical Garden", "植物园 — 清新有机的花园色系 · 自然绿调", dim)}
${item("10. Midnight Galaxy", "午夜银河 — 戏剧性的宇宙深色调 · 紫蓝色系", dim)}

${hdr("主题文件结构")}
${item("themes/<name>.md", "完整定义: 内聚色板 (hex) + 互补字体配对 (header/body) + 视觉特性描述", dim)}
${item("scripts/generate-theme.py", "自然语言描述 → 12 步色板 + 字体配对 → CSS token 输出", yellow)}
${item("输出格式", "CSS 自定义属性: --yry-bg · --yry-text · --yry-accent · --yry-border · --yry-radius 等", cyan)}

${hdr("应用流程")}
${item("Step 1", "展示 themes/ 目录所有预设（或展示 theme-showcase.pdf）", cyan)}
${item("Step 2", "询问用户选择 → 等待明确确认", cyan)}
${item("Step 3", "读取对应主题文件 → 应用色值和字体到目标制品", cyan)}
${item("Step 4", "确保对比度和可读性 → 全制品一致性", cyan)}

${hdr("自定义主题")}
${item("生成命令", "python3 <this-skill-dir>/scripts/generate-theme.py \"<自然语言描述>\" [-o output.css]", cyan)}
${item("输入", "任意自然语言描述 — 如 \"warm bakery theme with cream and brown tones\"", dim)}
${item("输出", "CSS token 集 或 文件 — 与预设主题结构一致", dim)}
${item("命名", "主题名描述字体/颜色组合代表的意境 — 如预设的命名风格", dim)}

${hdr("专业代理")}
${item("palette-generator", "自然语言描述 → 12 步色板 + 字体配对", cyan)}
${item("contrast-checker", "部署前 WCAG 对比度与状态色辨识度审计", cyan)}

${hdr("--yry-* Token 权威命名")}
${item("--yry-bg / --yry-bg-card", "页面背景 / 卡片背景", dim)}
${item("--yry-text / --yry-text-dim", "正文颜色 / 次要文本", dim)}
${item("--yry-accent / --yry-accent-hover", "强调色 / 悬停强调色", dim)}
${item("--yry-border / --yry-radius", "边框颜色 / 圆角", dim)}
${item("--yry-font / --yry-font-mono", "正文字体 / 等宽字体", dim)}
${item("--yry-shadow / --yry-gradient", "阴影 / 渐变", dim)}

${hdr("边界（Borders）")}
${item("做什么", "选 10 套预设主题之一 · 用 scripts/generate-theme.py 生成自定义主题 · 输出 <name>.css 定义 --yry-* token · 提供 hex 值/字体配对/使用建议", dim)}
${item("不做什么", "注入 CSS 到页面 — 由调用方负责 · 重命名 token · 替换 rui-ui 设计智能 · 提供 dark/light 切换", dim)}

${hdr("协作技能")}
${item("rui-html", "调用 rui-theme 获取颜色/字体 token → 注入到 4-file 文档页面", dim)}
${item("rui-demos", "Phase 0 调用 rui-theme 选主题 → 应用到 demo 页面 CDN link", dim)}
${item("rui-graph", "调用 rui-theme → 暗色主题 Cytoscape.js 图的 token", dim)}
${item("rui-diagram", "引用 rui-theme 色板 → SVG 架构图的 var(--diag-*) token", dim)}

${hdr("使用场景")}
${scene("场景 1 — 为幻灯片选主题")}
${item("用户: \"apply a theme to my slides\"", "→ 展示 10 套主题 → 用户选 Modern Minimalist → 读取 themes/modern-minimalist.md → 应用", cyan)}

${scene("场景 2 — 生成自定义主题")}
${item("用户: \"create a warm autumn theme\"", "→ python3 scripts/generate-theme.py \"warm autumn\" → 审查色板 → 确认 → 保存到 themes/", cyan)}

${scene("场景 3 — 对比度审计")}
${item("用户: \"check the contrast of this theme\"", "→ contrast-checker 代理 → WCAG 检查 → 报告问题 + 建议修复", cyan)}

${scene("场景 4 — 多制品统一主题")}
${item("用户: \"apply the same theme across all demos\"", "→ 读取主题 CSS token → 更新每个 demo 的 CDN link → 验证一致性", cyan)}
`;

console.log(help);
