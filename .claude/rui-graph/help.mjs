#!/usr/bin/env node
// rui-graph — Python 代码依赖图谱帮助
// 用法: node .claude/rui-graph/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-graph — Python 代码依赖图谱")}

${dim("Cytoscape.js 交互图 · AST 解析 · 导入/调用/继承/包含/导出 · 3 种模式 · 5 阶段流水线 | 仅限 Python")}

${hdr("快速入门")}
${item("用户说 \"dependency graph\" / \"源码图谱\" / \"import analysis\" / \"模块依赖\"", "触发图谱生成 → Phase 0-5 → 4-file 交互式 HTML 输出", cyan)}
${item("默认模式", "Mode A 全图: 文件 + 类 + 函数 + 模块 + 全部边类型", dim)}
${item("简化模式", "--mode modules / --simple → Mode B: 仅文件 + 模块 + 导入/导出边", dim)}
${item("深度模式", "--mode deep --module <name> → Mode C: 单模块 + 全部内含符号 + 直接依赖", dim)}

${hdr("决策树")}
${item("全量代码库交互图", "→ Mode A: 全图（所有节点类型 + 所有边类型）— 默认", cyan)}
${item("模块级总览", "→ Mode B: 模块图（仅文件 + 模块 + 导入/导出边）", cyan)}
${item("单模块深挖", "→ Mode C: 聚焦图（一个包展开内部全部符号 + 直接依赖）", cyan)}

${hdr("节点类型与视觉")}
${item("文件节点", "矩形 · 大小按行数缩放 · 颜色按层级 (core=深色 · library=中色 · utility=浅色)", cyan)}
${item("类节点", "六边形 · 紫色调 · 显示继承关系和方法数", cyan)}
${item("函数节点", "椭圆 · 翠绿色 · 显示调用关系", cyan)}
${item("模块节点 (__init__.py)", "菱形 · 琥珀色 · 显示重导出", cyan)}

${hdr("边类型 (5)")}
${item("imports", "实线箭头 — 文件间导入关系", yellow)}
${item("calls", "虚线箭头 — 函数间调用关系", yellow)}
${item("inherits", "粗实线箭头 — 类间继承关系", yellow)}
${item("contains", "细实线 — 文件包含其类/函数定义", yellow)}
${item("exports", "点状青色箭头 — __init__.py 重导出子模块", yellow)}

${hdr("5 阶段流水线")}

${subhdr("Phase 0 — 预检")}
${item("Step 1", "确定 Python 源码目录（site-packages/<pkg>/ · src/<pkg>/ · 用户指定）", cyan)}
${item("Step 2", "解析模式: 默认全图 · --mode modules 简化 · --mode deep 聚焦", cyan)}
${item("Step 3", "准备输出目录: docs/views/<name>/graph/ 或 <path>/graph/", cyan)}
${item("排除目录", "extractor/ · downloader/ · postprocessor/ · test/ · tests/ · compat/（默认）", dim)}

${subhdr("Phase 1 — 解析与分析")}
${item("Step 1-2", "遍历 .py 文件 → AST 解析: imports · ClassDef · FunctionDef · Call 节点", cyan)}
${item("Step 3", "实体分类: 文件层级 (core/library/utility) · 类类别 (orchestrator/abstract/data/handler) · 函数角色 (entry/core/utility)", cyan)}
${item("Step 4", "构建符号索引: 限定名 → 节点 ID 映射 (用于边创建)", cyan)}
${item("Step 5", "输出 code-analysis.json: source · fileCount · classCount · functionCount · files[] · classes[] · functions[] · modules[]", cyan)}

${subhdr("Phase 2 — 构建图谱")}
${item("Step 1-2", "创建 Cytoscape.js 节点 + 边 (id/type/label + 元数据)", cyan)}
${item("Step 3", "去重: 节点按 ID · 边按 (source, target, type) · 丢弃悬空边", cyan)}

${subhdr("Phase 3 — 验证")}
${item("检查项", "所有 source/target 指向存在的节点 · 边类型合法 · 无孤立节点（可选）", dim)}

${subhdr("Phase 4 — 生成输出")}
${item("4 文件", "index.html (Cytoscape.js CDN + 模板) · index.js (图初始化 + 交互) · index.css (暗色主题) · data.js (graphData)", cyan)}

${subhdr("Phase 5 — 保存与报告")}
${item("汇总", "节点数 · 边数 · 文件数 · 类数 · 函数数 · 输出路径", dim)}

${hdr("Cytoscape.js 交互特性")}
${item("布局", "dagre / cose-bilkent · 层级方向 · 节点分组", dim)}
${item("交互", "拖拽 · 缩放 · 点击展开详情面板 · 悬停高亮邻居 · 搜索定位", cyan)}
${item("过滤", "按节点类型 · 按边类型 · 按层级 · 按搜索关键词", cyan)}
${item("深度分析", "传递依赖 (2-hop/3-hop) · 循环依赖检测 · fan-in/fan-out 指标 · 影响分析", yellow)}

${hdr("输出结构")}
${item("4-file", "index.html + index.js + index.css + data.js — 标准组件化模式", dim)}
${item("零构建", "file:// 直接运行 · 仅依赖 Cytoscape.js CDN · 无编译步骤", dim)}

${hdr("使用场景")}
${scene("场景 1 — 理解开源库结构")}
${item("用户: \"graph the yt-dlp codebase\"", "→ Phase 0 定位 site-packages/yt_dlp/ → Phase 1 AST 解析 → Phase 2-5 生成交互图", cyan)}

${scene("场景 2 — 模块级快速总览")}
${item("用户: \"show me the module structure --simple\"", "→ Mode B: 仅文件和模块节点 → 清晰展示导入导出关系", cyan)}

${scene("场景 3 — 单模块深度分析")}
${item("用户: \"deep dive into the downloader module\"", "→ Mode C: 展开 downloader/ 全部内部符号 → 类层次 + 函数调用 + 直接依赖", cyan)}

${scene("场景 4 — 循环依赖检测")}
${item("用户: \"find circular imports in this project\"", "→ Phase 1 解析 → Phase 2 构建 → 标记循环边 → 红色高亮", cyan)}
`;

console.log(help);
