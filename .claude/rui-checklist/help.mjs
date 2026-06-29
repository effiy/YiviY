#!/usr/bin/env node
// rui-checklist — 项目自改进系统帮助
// 用法: node .claude/rui-checklist/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-checklist — 项目自改进系统")}

${dim("卡片质量检查 · 每日自省 · 自动修复 · 效果追踪 · 趋势分析 | 23 条规则 × 6 大类别")}

${hdr("快速入门")}
${item("用户说 \"check the cards\" / \"检查卡片\" / \"生成清单\"", "触发卡片质量检查 → 读取 scene card 数据 → 运行 23 条规则 → 生成交互式清单 HTML", cyan)}
${item("用户说 \"今日自省\" / \"daily check\"", "触发每日自省 → 记录 Good/Bad → 追加到每日自省.md → 可选通知发送", cyan)}
${item("用户说 \"项目自检\" / \"health check\" / \"自改进\"", "触发完整 5 步自改进循环（自省 → 检查 → 修复 → 验证 → 报告）", cyan)}
${item("用户说 \"run self test\" / \"自测试\"", "运行所有检查规则的自测试夹具，验证检查逻辑正确性", cyan)}

${hdr("三大核心能力")}

${subhdr("能力一：卡片质量检查 (Card Quality Audit)")}
${item("数据源", "docs/components/<scene>/data.js 或 docs/views/<scene>/data.js 中的卡片数组", dim)}
${item("检查规则 23 条", "structural ×7 · tag-quality ×4 · link-hygiene ×3 · standard ×3 · i18n ×3 · human ×3", yellow)}
${item("输出", "4-file 交互式验证清单 HTML（data.js + index.html + index.js + index.css）", dim)}
${item("检查状态", "pass / fail / warn / pending — 客观可判定；主观项标记 pending 供人工审查", cyan)}

${subhdr("能力二：项目自改进 (Self-Improvement Cycle)")}
${item("Step 1 — 每日自省", "记录 Good（做得好）和 Bad（需改进）→ 制定明日计划 → 追加日志", cyan)}
${item("Step 2 — 质量检查", "对卡片/项目运行全部 23 条规则 → 生成健康分 (0-100)", cyan)}
${item("Step 3 — 自动修复", "badge 大小写 · links 缺失 · 硬编码颜色替换 · tags modifier 推荐 · desc 分隔符建议", cyan)}
${item("Step 4 — 验证改进", "修复后重新检查 → 对比健康分变化 → 量化改进效果", cyan)}
${item("Step 5 — 报告通知", "生成健康报告 → 通过 rui-bot 发送企业微信通知（需配置）", cyan)}

${subhdr("能力三：规则自测试 (Rule Self-Testing)")}
${item("测试覆盖", "23 条规则全覆盖，每条规则 pass / fail / warn 三种状态", yellow)}
${item("测试目录", ".claude/rui-checklist/tests/ — fixtures + 验证脚本", dim)}

${hdr("辅助能力")}
${item("完成效果追踪", "每次检查后生成结构化效果报告：健康分变化 · 问题解决数 · 自动修复数 · 待处理项", cyan)}
${item("通知模板库", "三类企业微信 Markdown 模板：健康报告 / 每日自省 / 改进警报 → 给 rui-bot 消费", cyan)}
${item("自改进分析报告", "多轮数据综合分析：趋势预测 · 复发检测 · 分类速率 · 稳定性评估 · 数据驱动建议", cyan)}

${hdr("检查类别详情")}
${item("structural (7)", "name · desc · tags · badge · meta · links · nameHref — 字段完整性", dim)}
${item("tag-quality (4)", "modifier 语义匹配 · 自描述分类器 · 简洁性 · 唯一性", dim)}
${item("link-hygiene (3)", "links 配置完整性 · grid 策略适用性 · nameHref 配对", dim)}
${item("standard (3)", "数字量化 · badge 大写 · 卡片差异化 — Code Health Report 标准", dim)}
${item("i18n (3)", "多语言结构一致性（如有 en/zh-CN 切片）", dim)}
${item("human (3)", "人工审查项 — 描述准确性 / 标签覆盖度 / 链接有效性", dim)}

${hdr("输出路径")}
${item("检查清单", "docs/components/<scene>/checklist/ 或 docs/views/<scene>/checklist/", dim)}
${item("自省日志", "docs/故事任务面板/daily-check/每日自省.md", dim)}
${item("效果报告", "终端摘要 + HTML 组件 + JSONL 持久化", dim)}
${item("通知模板", ".claude/rui-checklist/templates/notification/", dim)}

${hdr("使用场景")}
${scene("场景 1 — 验证卡片质量")}
${item("用户: \"check the intro cards\"", "→ 读取 INTRO_CONFIG → 运行 23 条规则 → 生成 docs/components/intro/checklist/", cyan)}

${scene("场景 2 — 每日自省")}
${item("用户: \"今日自省\"", "→ 交互式收集 Good/Bad → 追加日志 → 可选发送企业微信通知", cyan)}

${scene("场景 3 — 完整自改进循环")}
${item("用户: \"项目自检\"", "→ Step 1 自省 → Step 2 质量检查 → Step 3 自动修复 → Step 4 验证 → Step 5 报告", cyan)}

${scene("场景 4 — 验证检查规则")}
${item("用户: \"run self test\"", "→ 运行 tests/ 下所有夹具 → 验证 23 条规则 pass/fail/warn 逻辑正确", cyan)}
`;

console.log(help);
