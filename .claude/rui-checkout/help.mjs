#!/usr/bin/env node
// rui-checkout — 改进行动项追踪帮助
// 用法: node .claude/rui-checkout/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-checkout — 改进行动项追踪系统")}

${dim("报告分析 · 行动提取 · 步骤分解 · 前后量化 · 关键路径 · 进度追踪 | 健康报告 + 架构报告 → 统一执行面板")}

${hdr("快速入门")}
${item("用户说 \"checkout\" / \"action items\" / \"改进清单\" / \"行动项\"", "触发报告分析 → 抽取行动项 → 自改进分析 → 生成交互式 checkout 页面", cyan)}
${item("数据源", "docs/views/健康报告/data.js + docs/views/架构报告/data.js（可单报告运行）", dim)}

${hdr("核心分析引擎")}

${subhdr("1. 跨报告关联 (Cross-Report Correlation)")}
${item("同根因检测", "健康报告和架构报告中的行动项交叉引用 — 同一根因只追踪一次", yellow)}
${item("顺序依赖", "A 必须先于 B 完成（如：star import 移除 → CI/CD 管线引入）", yellow)}
${item("放大效应", "一个行动完成会放大其他 5+ 行动的改进效果", yellow)}

${subhdr("2. 前后量化 (Before/After Quantification)")}
${item("Before 指标", "报告中的实测基线值（如 \"37/63 files use star import (58.7%)\"）", cyan)}
${item("After 指标", "完成后的预期值（如 \"0/63 files use star import, mypy pass rate 100%\"）", cyan)}
${item("影响链", "哪些下游指标会因此改善", dim)}

${subhdr("3. 步骤粒度 (Step Granularity)")}
${item("每项 2-5 步", "每一步独立可验证、有序、30min-2h 可完成", yellow)}
${item("示例", "A7.1: ①审计 star import 文件 → ②替换为显式导入 → ③运行 mypy → ④修复类型错误 → ⑤添加 CI 规则", dim)}

${subhdr("4. 关键路径检测 (Critical Path Detection)")}
${item("P0 阻塞项", "标记阻塞其他行动的前置任务 → 必须先完成", yellow)}
${item("自动化解锁", "完成后解锁自动化工具链（如 star import 移除 → 解锁 mypy/ruff）", cyan)}

${hdr("输出结构")}
${item("4-file checkout 页面", "docs/views/checkout/ — data.js + index.js + index.html + index.css", dim)}
${item("Vue 3 交互面板", "评分仪表盘 · 进度条 · 筛选栏 · 行动卡片 · 关键路径高亮", cyan)}
${item("localStorage 持久化", "状态变更 (todo → in_progress → done) 保存到浏览器 localStorage", cyan)}
${item("进度监控", "整体进度追踪 → 目标分数 (58→85 健康分, 5.6→7.9 架构分)", dim)}

${hdr("data.js 核心字段")}
${item("constants.sources", "报告来源列表（health-report / architecture-report）", dim)}
${item("constants.sourceMeta", "每个报告的路径、标签、当前分数、目标分数、维度数、行动数", dim)}
${item("actions[]", "统一行动项数组 — 含 id/priority/phase/source/steps[]/before/after/dependsOn[]", yellow)}
${item("phases[]", "4 阶段定义：Phase 1 止血 → Phase 2 修复 → Phase 3 巩固 → Phase 4 持续", yellow)}

${hdr("优先级体系")}
${item("P0 — 阻塞项", "阻止所有其他改进 — 必须先解决（如 star import、依赖版本锁定）", cyan)}
${item("P1 — 高优先级", "显著影响可维护性的改进（如 god function 拆分、架构层级修复）", cyan)}
${item("P2 — 中优先级", "可读性、开发体验、工具链（如 docstring 补充、IDE 配置）", cyan)}
${item("P3+ — 持续改进", "长期优化（如测试覆盖率提升、性能微调）", cyan)}

${hdr("使用场景")}
${scene("场景 1 — 从报告到执行计划")}
${item("用户: \"create a checkout from the reports\"", "→ 读取健康报告 + 架构报告 → 交叉分析 → 分解步骤 → 前后量化 → 生成 checkout 页面", cyan)}

${scene("场景 2 — 追踪改进进度")}
${item("用户: \"what's the status of improvements?\"", "→ 打开 checkout 页面 → 查看各阶段进度 → 关键路径状态 → 阻塞项提醒", cyan)}

${scene("场景 3 — 单报告模式")}
${item("用户: \"create checkout from health report only\"", "→ 仅读取健康报告 data.js → 分析 26 项行动 → 4 阶段分解 → 生成页面", cyan)}

${scene("场景 4 — 关键路径分析")}
${item("用户: \"what should we do first?\"", "→ 识别 P0 阻塞项 → 展示依赖图 → 建议执行顺序", cyan)}
`;

console.log(help);
