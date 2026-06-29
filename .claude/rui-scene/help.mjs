#!/usr/bin/env node
// rui-scene — yry-scene-card 卡片数据生成帮助
// 用法: node .claude/rui-scene/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-scene — YrySceneCard 专业卡片数据生成")}

${dim("内容改写 · 卡片优化 · 3 级质量体系 · 7 字段设计方法论 | Code Health Report 标准")}

${hdr("快速入门")}
${item("用户说 \"create a scene card\" / \"scene card\" / \"卡片\" / \"card component\"", "触发卡片数据生成 → 理解内容 → 分析提取 → 生成 YrySceneCard props 对象", cyan)}
${item("核心目标", "将原始描述（工具/功能/项目/报告/代理）转化为专业、细节丰富的卡片数据", dim)}

${hdr("Code Health Report — 标准参考卡片")}
${item("desc 模式", "\"7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap\"", cyan)}
${item("tags 模式", "[{text:'58/100', modifier:'warn'}, {text:'7 dimensions', modifier:'info'}, {text:'26 actions', modifier:'cyan'}] — 恰好 3 个", cyan)}
${item("badge 模式", "'Report' — 大写 · 单字 · 可扫描的类型分类器", cyan)}
${item("meta 模式", "'Assessment date 2026-06-28 · Technical Due Diligence' — 等宽出处信息", cyan)}

${hdr("卡片质量 3 级体系")}
${item("Rich（丰富级）", "报告/审计/工具/项目/代理 → 必填: name · desc (·+<strong>) · tags (2-4, 语义 modifier) · badge → 建议: meta · nameHref · custom links", yellow)}
${item("Standard（标准级）", "功能网格/能力卡片 → 必填: name · desc (·+<strong>) · tags (2-4, 语义 modifier) → 建议: badge (如核心) · meta", yellow)}
${item("Nav（导航级）", "文档页面导航 → 必填: name · nameHref · nameTarget:'' · desc (简洁 · 多要点用 ·) → 建议: badge (如新/特殊) · tags", yellow)}

${hdr("标准规则（适用所有卡片）")}
${item("desc 分隔符", "必须用 · (U+00B7) — 不用逗号，不用空格。至少一个 <strong> 强调关键信息", yellow)}
${item("tags 必填", "Rich/Standard 级卡片必须 2-4 个 tags → semantic modifier 匹配语义 (score→warn/green/red, methodology→purple, count→cyan, highlight→accent)", yellow)}
${item("数字量化", "\"7 dimensions\" 不是 \"multiple dimensions\" · \"26 actions\" 不是 \"several fixes\" · \"56h roadmap\" 不是 \"improvement plan\"", yellow)}
${item("meta 出处", "每张卡片有 meta 或有明确理由不设置 — 日期 · 版本 · 上下文", yellow)}
${item("badge 类型分类", "'Report' · 'Core' · 'Agent' · 'OSS' · 'Beta' — 大写 · 单字 · 可扫描", yellow)}

${hdr("YrySceneCard 完整 Props")}
${item("name *", "卡片标题 — 用 emoji 前缀增加视觉节奏", cyan)}
${item("nameHref", "标题链接 — 有链接目标的页面", dim)}
${item("nameTarget", "链接目标 — 默认 _blank (新窗口) · '' = 同窗口", dim)}
${item("badge", "标题后小徽章 — 如 '新' · '核心' · 'Report'", dim)}
${item("desc", "描述 — 支持 HTML (<strong> · <br> · <code>) · 1-2 行", cyan)}
${item("tags", "标签芯片 — [{text, modifier, href?}] — modifier: info/accent/warn/red/purple/cyan/green", cyan)}
${item("meta", "等宽页脚 — 日期/版本/统计", dim)}
${item("demo", "演示 URL — 自动追加为 '演示' 链接（去重）", dim)}
${item("links", "底部链接 — [{icon, label, href, target}] — null=默认 · []=隐藏 · [...]=自定义", cyan)}

${hdr("Tags 约定")}
${item("命名原则", "标签描述卡片本身，不是指导用户操作 — 名词性分类器", yellow)}
${item("好的标签", "\"7 dimensions\" · \"26 actions\" · \"58/100\" · \"ATAM\" — 自描述", dim)}
${item("避免的标签", "\"View details\" · \"Click here\" · \"Learn more\" — 指令性", dim)}

${hdr("Links 约定")}
${item("功能网格卡片", "links: [] — 隐藏默认链接（tag 已充分分类，底部链接增加视觉噪音）", dim)}
${item("外部工具卡片", "3-5 个自定义链接 — 指向该工具的 repo/docs/community", dim)}
${item("内部卡片", "links: null — 使用 data.js 默认链接（清单/架构/图谱/源码/测试/演示/审查）", dim)}
${item("报告卡片", "2-4 个自定义链接 — 报告详情/数据源/方法论文档", dim)}

${hdr("卡片设计 7 字段方法论")}
${item("① 核心标识", "一行的本质是什么？→ name", dim)}
${item("② 关联", "它链接到哪里？→ nameHref · nameTarget", dim)}
${item("③ 显著性", "新/核心/特色？→ badge（类型分类器）", dim)}
${item("④ 描述", "做什么、为什么重要？→ desc（必须 · + <strong>）", dim)}
${item("⑤ 分类器", "什么类别/分数/维度？→ tags（2-4 个，语义 modifier）", dim)}
${item("⑥ 出处", "什么时候/哪个版本/什么上下文？→ meta（Rich 级必填）", dim)}
${item("⑦ 资源", "下一步去哪？→ links · demo", dim)}

${hdr("使用场景")}
${scene("场景 1 — 为新工具创建卡片")}
${item("用户: \"create a card for yt-dlp\"", "→ 理解 yt-dlp 功能 → 提取标识/描述/标签/出处/链接 → 生成 Rich 级卡片", cyan)}

${scene("场景 2 — 批量改写卡片")}
${item("用户: \"rewrite these feature descriptions as cards\"", "→ 分析每个功能 → 按 Standard 级生成 → 保持风格一致 → i18n 双语言", cyan)}

${scene("场景 3 — 优化已有卡片")}
${item("用户: \"make these cards more professional\"", "→ 对照 Code Health Report 标准 → 提升 desc (·+<strong>) → 补充 tags → 量化数字 → 添加出处", cyan)}

${scene("场景 4 — 生成 data.js")}
${item("用户: \"generate data.js for the intro page\"", "→ 创建 INTRO_CONFIG 结构 → 按场景分层 (overview/cards) → 双语言切片", cyan)}
`;

console.log(help);
