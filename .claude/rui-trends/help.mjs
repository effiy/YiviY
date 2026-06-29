#!/usr/bin/env node
// rui-trends — GitHub Trending 帮助
// 用法: node .claude/rui-trends/help.mjs

import { bold, dim, cyan } from '../../lib/tty.mjs';
import { hdr, subhdr, item, flag } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-trends — GitHub Trending 查询")}

${dim("发现热门仓库 · 跟踪技术趋势")}

${hdr("快速入门")}
${item("node .claude/rui-trends/rui-trends.mjs", "查询今日 GitHub Trending（全语言）", cyan)}
${item("node .claude/rui-trends/rui-trends.mjs --lang TypeScript", "TypeScript 语言过滤", cyan)}
${item("node .claude/rui-trends/rui-trends.mjs --since weekly --lang Go", "Go 语言本周趋势", cyan)}

${hdr("参数")}
${item("--lang, -l <语言>", "编程语言过滤（TypeScript, Python, Go, Rust...）", cyan)}
${item("--since daily|weekly", "时间窗口，默认 daily", cyan)}

${hdr("数据源")}
${item("GitHub Trending", "https://github.com/trending — 实时热门仓库", dim)}
`;

console.log(help);
