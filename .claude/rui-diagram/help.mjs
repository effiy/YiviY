#!/usr/bin/env node
// rui-diagram — 架构图与知识图谱帮助
// 用法: node .claude/rui-diagram/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-diagram — 架构图与知识图谱系统")}

${dim("代码分析 · 知识图谱 · SVG 架构图 · 全景视图 · 增量更新 · 影响分析 | 21 种节点 × 35 种边 × 12+ 语言")}

${hdr("快速入门")}
${item("用户说 \"architecture diagram\" / \"架构图\" / \"系统图\"", "→ Mode A: 复制 SVG 模板 → 构建 SVG → 验证", cyan)}
${item("用户说 \"system overview\" / \"总揽全局\" / \"全景视图\"", "→ W7 全景模式: Phase 0 跨项目分析 → 合并 KG → 统一 SVG 全景图", cyan)}
${item("用户说 \"analyze this codebase\" / \"what does this code do?\"", "→ 仅 Phase 0: 多代理分析 → 生成 knowledge-graph.json", cyan)}
${item("用户说 \"what changed?\" / \"impact analysis\"", "→ Phase 0 指纹 diff → 仅重分析变更 → DiffImpact 输出", cyan)}

${hdr("决策树")}
${item("纯架构图（无代码）", "→ Mode A 直接构建 SVG", cyan)}
${item("基于代码的架构图", "→ Phase 0 代码分析 → Mode A 构建 SVG", cyan)}
${item("仅理解代码结构", "→ Phase 0 终止（输出 knowledge-graph.json）", cyan)}
${item("代码变更影响", "→ Phase 0 diff impact — 1-hop + 2-hop 影响范围", cyan)}
${item("跨项目全景", "→ W7 Panorama: 各子项目 Phase 0 → 合并 → 统一 KG → SVG", cyan)}
${item("增量更新", "→ Phase 0 指纹对比 → 仅重分析变更文件 → 更新图表", cyan)}
${item("交互探索", "→ Phase 0 → Dashboard (React 应用读取 knowledge-graph.json)", cyan)}
${item("Wiki/知识库分析", "→ Phase 0 知识模式 — 文章检测 · wikilink · 实体提取", cyan)}

${hdr("知识图谱 (Knowledge Graph)")}

${subhdr("节点类型 (21)")}
${item("Code", "file · function · class · module · concept", yellow)}
${item("Non-Code", "config · document · service · table · endpoint · pipeline · schema · resource", yellow)}
${item("Domain", "domain · flow · step", yellow)}
${item("Knowledge", "article · entity · topic · claim · source", yellow)}

${subhdr("边类型 (35, 8 大类)")}
${item("Structural (5)", "imports · exports · contains · inherits · implements — weight 0.7-1.0", dim)}
${item("Behavioral (4)", "calls · subscribes · publishes · middleware — weight 0.8", dim)}
${item("Data Flow (4)", "reads_from · writes_to · transforms · validates — weight 0.5", dim)}
${item("Dependencies (3)", "depends_on · tested_by · configures — weight 0.5-0.7", dim)}
${item("Semantic (2)", "related · similar_to — weight 0.5", dim)}
${item("Infrastructure (4)", "deploys · serves · provisions · triggers — weight 0.5-0.7", dim)}
${item("Schema/Data (4)", "migrates · documents · routes · defines_schema — weight 0.5", dim)}
${item("Domain/Knowledge (9)", "contains_flow · flow_step · cross_domain · cites · contradicts · builds_on · exemplifies · categorized_under · authored_by — weight 0.5", dim)}

${hdr("Phase 0: 代码分析流水线")}
${item("0.0 — 预检", "项目根目录确定 · 语言指令 · 指纹检查 (NONE/COSMETIC→SKIP, 少量→增量, 大量→全量) · .diagramignore", cyan)}
${item("0.1 — 扫描", "scan-project.mjs: 文件枚举 · 语言检测 · 类别分配 · 12+ 语言导入解析 → scan-result.json", cyan)}
${item("0.2 — 批处理分析", "按目录内聚分组 → 最多 5 并发子代理: 结构化提取 (tree-sitter) + LLM 语义标注", cyan)}
${item("0.3 — 组装审查", "合并批次 → 规范化 ID → 去重 → 检查悬空边 → 组装审查子代理验证完整性", cyan)}
${item("0.4 — 架构分层", "LLM 将节点分为 3-10 逻辑层（目录信号 · 导入邻接 · 跨类别边）", cyan)}
${item("0.5 — 学习路线", "5-15 步依赖排序: BFS 入口点 → fan-in 排序 → 聚类检测 → 自底向上", cyan)}
${item("0.6 — 验证", "4 层验证: 清理 → 自动修复 → Zod schema 校验 → 引用完整性检查", cyan)}
${item("0.7 — 保存", "knowledge-graph.json + meta.json + 指纹基线 → .diagram/", cyan)}

${hdr("4 层验证管道")}
${item("Tier 1 — 清理", "null → [] · 枚举小写 · 去除 null 可选字段", dim)}
${item("Tier 2 — 自动修复", "填充缺失字段 · 类型强制转换 · 60+ 节点别名 · 50+ 边别名", dim)}
${item("Tier 3 — 校验", "Zod schema 每节点/边 → 无效项丢弃 + 日志", dim)}
${item("Tier 4 — 引用", "丢弃悬空边 · 过滤无效 layer/tour nodeId", dim)}

${hdr("Mode A: SVG 架构图")}
${item("主题", "暗色 (#020617) · JetBrains Mono · 导出工具栏 (Copy PNG / Download PNG / Download PDF)", dim)}
${item("SVG 规则", "箭头 z-order（网格后、组件框前）· 遮罩 · 图例外置 · ≥40px 间距 · 40×40 网格", yellow)}
${item("10 层颜色映射", "UI#22d3ee · API#38bdf8 · Service#34d399 · Data#a78bfa · Infra#fbbf24 · Config#94a3b8 · Auth#fb7185 · Events#fb923c · Utility#64748b · External#475569", cyan)}

${hdr("工作流")}
${item("W1 — 生成架构图", "复制模板 → 构建 SVG → 更新卡片/页脚 → 验证（基于代码则先 Phase 0）", cyan)}
${item("W2 — 增量更新", "指纹检查 → 分级更新 → 重跑受影响阶段 → 更新图表 → 更新基线", cyan)}
${item("W3 — 差异影响分析", "git diff → 变更节点 → 1-hop 直接依赖 → 2-hop 间接影响 → 风险评估", cyan)}
${item("W7 — 全景模式", "所有子项目 Phase 0 → 合并 KG → 跨域边协调 → 统一 SVG 全景图", cyan)}

${hdr("插件架构")}
${item("plugins/extractors/", "语言特定结构化提取器（tree-sitter 语法）", dim)}
${item("plugins/parsers/", "非代码解析器（Markdown · YAML · Dockerfile · SQL · GraphQL）", dim)}
${item("plugins/languages/", "语言配置：模式 · 惯用法 · 边约定", dim)}
${item("plugins/frameworks/", "框架配置：目录信号 · 层映射", dim)}
${item("plugins/locales/", "输出语言指南（i18n 内容生成）", dim)}

${hdr("使用场景")}
${scene("场景 1 — 理解陌生项目")}
${item("用户: \"analyze this codebase\"", "→ Phase 0 多代理分析 → 21 种节点 + 35 种边 → knowledge-graph.json", cyan)}

${scene("场景 2 — 画架构图")}
${item("用户: \"draw an architecture diagram\"", "→ Phase 0 分析 → knowledge-graph.json → Mode A 构建 SVG → 验证", cyan)}

${scene("场景 3 — 代码变更影响")}
${item("用户: \"what does this PR affect?\"", "→ Phase 0 diff → 变更节点 → 1-hop + 2-hop 影响 → 风险分级", cyan)}

${scene("场景 4 — 跨项目全景")}
${item("用户: \"give me a panorama of all projects\"", "→ W7: 每个子项目 Phase 0 → 合并 KG → 统一 SVG 全景图", cyan)}
`;

console.log(help);
