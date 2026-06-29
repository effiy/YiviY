#!/usr/bin/env node
/**
 * rui-skill — 元技能：创建、改进、评估、打包其他技能
 * 用法: node .claude/rui-skill/help.mjs
 *
 * rui-skill 是技能生态系统中的顶层编排者——它管理其他技能的全生命周期。
 */

import { bold, dim, yellow, cyan } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-skill — 技能工厂 · 元技能编排")}

${dim("创建 · 评估 · 基准测试 · 描述优化 · 迭代改进 · 打包发布")}

${hdr("快速入门")}
${item("通过对话调用", "在 Claude Code 中说「创建一个 skill 用于…」即可触发", cyan)}
${item("python -m scripts.quick_validate <skill-dir>", "快速校验 SKILL.md frontmatter", cyan)}
${item("python -m scripts.run_eval --target-skill <name>", "对目标技能执行评估", cyan)}
${item("python -m scripts.package_skill <skill-dir>", "将技能打包为 .skill 文件", cyan)}

${hdr("可执行入口: python -m scripts.<脚本名>")}

${subhdr("脚本")}
${item("quick_validate <skill-dir>", "快速校验 — 检查 frontmatter YAML、name 格式、description 长度", cyan)}
${item("run_eval --target-skill <name>", "触发评估 — 创建 claude -p 命令测试技能描述触发率", cyan)}
${item("run_loop --eval-set <json> --skill-path <dir> --model <id>", "完整优化循环 — 60/40 切分训练测试集，多迭代描述优化", cyan)}
${item("improve_description <skill-dir>", "描述改进 — 调用 claude -p 生成优化后的 description（≤1024 字符）", cyan)}
${item("aggregate_benchmark <workspace-dir> --skill-name <name>", "基准聚合 — 从 grading.json 生成 benchmark.json + benchmark.md", cyan)}
${item("generate_report <run-loop-output>", "报告生成 — 将 run_loop.py 输出渲染为 HTML 报告", cyan)}
${item("package_skill <skill-dir>", "打包 — 将技能目录打包为 .skill zip 文件", cyan)}

${subhdr("核心参数")}
${item("--target-skill <name>", "目标技能名（run_eval 使用）", cyan)}
${item("--eval-set <path>", "触发评估集 JSON 路径（run_loop 使用）", yellow)}
${item("--skill-path <dir>", "技能目录路径（run_loop / improve_description 使用）", yellow)}
${item("--skill-name <name>", "技能名用于报告标题（aggregate_benchmark 使用）", yellow)}
${item("--model <id>", "Claude 模型 ID（run_loop 使用，应与当前会话一致）", yellow)}
${item("--max-iterations <N>", "最大优化迭代次数，默认 5（run_loop 使用）", yellow)}
${item("--benchmark <path>", "benchmark.json 路径（generate_review.py 使用）", yellow)}
${item("--previous-workspace <dir>", "上一次迭代的 workspace（generate_review.py 迭代 2+ 使用）", yellow)}
${item("--static <output_path>", "生成静态 HTML 而非启动服务器（Cowork / 无头环境）", yellow)}
${item("--verbose", "详细日志输出（run_loop / run_eval 使用）", yellow)}

${hdr("核心特性演示")}
${scene("场景 1 — 从零创建技能")}
${item("# 1. 对话触发", "「帮我创建一个 rui-foo 技能，用于…」", cyan)}
${item("# 2. rui-skill 访谈", "捕获意图 → 研究 → 起草 SKILL.md → 编写测试用例", dim)}
${item("# 3. 复制模板", "cp .claude/rui-skill/templates/SKILL.md .claude/rui-foo/SKILL.md", cyan)}
${item("# 4. 运行评估", "python -m scripts.run_eval --target-skill rui-foo", cyan)}
${item("# 5. 人工评审", "python eval-viewer/generate_review.py <workspace> --benchmark <path>", cyan)}
${item("# 6. 迭代改进", "根据 feedback.json 修改 SKILL.md，重复步骤 4-5", dim)}
${item("# 7. 打包发布", "python -m scripts.package_skill .claude/rui-foo", cyan)}

${scene("场景 2 — 评估现有技能")}
${item("# 1. 准备评估集", "编写 evals/evals.json（prompts + assertions）", cyan)}
${item("# 2. 运行评估", "python -m scripts.run_eval --target-skill rui-bot", cyan)}
${item("# 3. 聚合基准", "python -m scripts.aggregate_benchmark workspace/iteration-1 --skill-name rui-bot", cyan)}
${item("# 4. 启动查看器", "python eval-viewer/generate_review.py workspace/iteration-1 --benchmark benchmark.json", cyan)}
${item("# 5. 收集反馈", "用户在浏览器中评审 → Submit All Reviews → feedback.json", dim)}

${scene("场景 3 — 优化技能描述（触发率调优）")}
${item("# 1. 生成触发查询", "创建 20 条 eval queries（should-trigger + should-not-trigger）", cyan)}
${item("# 2. 用户审阅", "通过 assets/eval_review.html 模板展示，用户确认后导出", cyan)}
${item("# 3. 运行优化", "python -m scripts.run_loop --eval-set eval_set.json --skill-path .claude/rui-foo --model claude-sonnet-4-6 --max-iterations 5", cyan)}
${item("# 4. 应用结果", "取 best_description 更新 SKILL.md frontmatter", cyan)}

${scene("场景 4 — 盲对比（A/B 版本对比）")}
${item("# 1. 生成两个版本输出", "with-skill vs baseline（或 new vs old）", cyan)}
${item("# 2. 启动 comparator", "子代理盲评两个输出（不知 A/B 身份）", cyan)}
${item("# 3. 分析原因", "analyzer 代理分析胜出版本的优势维度", dim)}

${hdr("技能生命周期")}
${item("Capture Intent", "理解用户意图 → 明确技能边界", dim)}
${item("Interview & Research", "边缘情况 → 输入/输出格式 → 依赖 → MCP 调研", dim)}
${item("Draft SKILL.md", "frontmatter + 渐进式披露 + 模板生成 help.mjs", dim)}
${item("Write Test Cases", "evals.json（2-3 prompts + 量化断言）", dim)}
${item("Run & Grade", "with-skill / baseline 并行子代理 → grader 评分", dim)}
${item("Aggregate & Review", "benchmark.json → 人工评审 → feedback.json", dim)}
${item("Improve & Iterate", "泛化反馈 → 精简 prompt → 解释 why → 发现重复模式", dim)}
${item("Describe Optimize", "触发率调优（可选，60/40 切分，多迭代）", dim)}
${item("Package & Present", "打包为 .skill 文件分发", dim)}
`;

console.log(help);
