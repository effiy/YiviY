#!/usr/bin/env node
// rui-demos — 交互式场景演示页面生成帮助
// 用法: node .claude/rui-demos/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-demos — 交互式场景演示页面生成")}

${dim("卡片 → 演示 · 6 种 Demo 类型 · 5 阶段流水线 · 4-file 输出 | 从 rui-scene 卡片到可交互展示页")}

${hdr("快速入门")}
${item("用户说 \"generate demos\" / \"演示页面\" / \"demo pages\" / \"场景效果\"", "触发 demo 生成流水线 → 发现卡片数据 → 分类 → 搭建 → 填充 → 集成 → 验证", cyan)}
${item("数据源", "rui-scene 卡片数据（INTRO_CONFIG · data.js · 内联卡片数组）", dim)}
${item("输出位置", "docs/components/<scene>/demos/<slug>/ 或 docs/views/<name>/demos/<slug>/", dim)}

${hdr("6 大 Demo 类型")}

${subhdr("Type A — 工具界面 (Tool Interface)")}
${item("信号", "外部链接 3+ · badge: OSS/Core · desc 含技术术语", yellow)}
${item("效果", "输入 URL → 进度条 → 模拟处理 → 结果展示 — \"让用户试用这个工具\"", cyan)}
${item("示例场景", "yt-dlp 视频下载 · WhisperX 语音转录 · Streamlit 控制面板", dim)}

${subhdr("Type B — 管线可视化 (Pipeline)")}
${item("信号", "purple tag · desc 含 pipeline/steps/stages", yellow)}
${item("效果", "步骤节点 → 自动播放动画 → 点击展开细节 — \"展示数据流经各阶段\"", cyan)}
${item("示例场景", "NLP 分句管线 · 3-Step T-R-A 翻译 · 字幕提取流程 · 术语库构建", dim)}

${subhdr("Type C — 对比展示 (Comparison)")}
${item("信号", "count tags (\"6 engines\"/\"4 languages\") · desc 列引擎/选项", yellow)}
${item("效果", "并排面板 → 切换变体 → 高亮差异 → \"一键对比各引擎效果\"", cyan)}
${item("示例场景", "多引擎 TTS 对比 · 多语言翻译质量 · 视频格式/分辨率选择", dim)}

${subhdr("Type D — 状态机 (State Machine)")}
${item("信号", "tags 含 \"real-time\"/\"3 states\"/\"checkpoint\"", yellow)}
${item("效果", "状态图 → 点击转换 → 操作日志 — \"模拟状态流转和操作\"", cyan)}
${item("示例场景", "任务控制面板 · 断点续传恢复 · 模型选择器搜索", dim)}

${subhdr("Type E — 仪表盘 (Dashboard)")}
${item("信号", "badge: 'Report' · tags 含分数/数量", yellow)}
${item("效果", "评分卡 → 雷达图 (Chart.js) → 展开建议 — \"可视化所有指标\"", cyan)}
${item("示例场景", "代码健康报告 · 架构评估 · 质量审计", dim)}

${subhdr("Type F — 引导教程 (Guide Walkthrough)")}
${item("信号", "badge: 'Guide' · nameHref 含 #fragment", yellow)}
${item("效果", "步骤点 → 代码块 → 复制按钮 — \"3-5 步带用户走完入门\"", cyan)}
${item("示例场景", "快速开始指南 · 配置指南 · 故障排查", dim)}

${hdr("5 阶段流水线")}
${item("Phase 0 — 发现", "解析卡片数据源 → 确定输出目录 → 检查已有 demo → 查询 rui-ui 设计智能", cyan)}
${item("Phase 1 — 分类", "提取分类信号 → 分配 Demo 类型 → 生成概念 → 用户确认（审批门）", cyan)}
${item("Phase 2 — 搭建", "从 assets/ 复制 4-file 骨架 → 填充占位符 → 确定 theme + CDN 路径", cyan)}
${item("Phase 3 — 内容", "生成 Vue 模板 · mock 数据 · 交互逻辑 · 类型特定样式（≥3 个可并行子代理）", cyan)}
${item("Phase 4 — 集成", "更新父级 index 页 · 链接校验 · 交叉引用更新", cyan)}
${item("Phase 5 — 验证", "内联验证脚本：4 文件完整性 · CDN 路径 · 无硬编码颜色 · 结构正确性", cyan)}

${hdr("4-File 输出结构")}
${item("index.html", "DOCTYPE + viewport + CDN refs + 三区布局 DIV + Vue 模板指令", dim)}
${item("index.js", "Vue 3 app: reactive data · methods · computed · mounted · beforeUnmount", dim)}
${item("index.css", "Reset + body + layout + 通用元素 + 类型特定 + 响应式断点（全部 var(--yry-*)）", dim)}
${item("data.js", "DEMO_CARD_DATA (YrySceneCard props) + DEMO_MOCK_DATA + _meta", dim)}

${hdr("三区布局")}
${item("Card Area（顶部）", "YrySceneCard.mount() 渲染 — 页面身份标识 + 文档入口", dim)}
${item("Demo Area（中部）", "Vue 3 挂载点 #demo-app — 交互核心区域", cyan)}
${item("Info Area（底部）", "演示说明 + 导航链接行（管线图 · 源码图 · 所有 demo · 文档首页）", dim)}

${hdr("技术栈")}
${item("Vue 3 CDN", "unpkg.com/vue@3 — 零构建 · file:// 可运行 · 响应式模板", dim)}
${item("主题", "cdn/theme/{name}.css — 10 套预设 · 一个 <link> 切换配色", dim)}
${item("组件", "yry-scene-card (CDN) — 与主文档一致的卡片渲染", dim)}
${item("图表", "Chart.js 4 (CDN) — Type E 仪表盘专用", dim)}
${item("动画", "CSS @keyframes + Vue Transition — 零额外依赖", dim)}

${hdr("使用场景")}
${scene("场景 1 — 为项目所有功能生成 demo")}
${item("用户: \"generate demos for intro cards\"", "→ Phase 0 发现 11 张卡片 → Phase 1 分类 (A-F) → 用户确认 → Phase 2-5 并行生成", cyan)}

${scene("场景 2 — 为单个工具创建演示")}
${item("用户: \"create a demo page for yt-dlp\"", "→ 识别为 Type A → 搭建工具界面骨架 → 填充 mock 数据 → 验证", cyan)}

${scene("场景 3 — 更新已有 demo")}
${item("用户: \"update the code health demo\"", "→ Phase 0 检测已有 demo → 询问 skip/overwrite/update → 增量更新", cyan)}
`;

console.log(help);
