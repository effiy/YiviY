#!/usr/bin/env node
// rui-bot — 企业微信消息通知帮助
// 用法: node .claude/rui-bot/help.mjs

import { bold, dim, cyan } from '../../lib/tty.mjs';
import { hdr, subhdr, item } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-bot — 企业微信消息通知")}

${dim("消息发送 · 日志追加 | 手动触发")}

${hdr("快速入门")}
${item("node .claude/rui-bot/send.mjs --story=<name> --content=\"...\"", "发送通知：构建消息 → 日志 + HTTP 发送", cyan)}
${item("node .claude/rui-bot/send.mjs --story=<name> --content=\"...\" --no-send", "仅追加通知日志不发送 HTTP", cyan)}

${hdr("参数")}
${item("--story=<name>", "故事名（kebab-case），用于日志路径", cyan)}
${item("--project=<name>", "项目名，默认从 CLAUDE.md 读取", cyan)}
${item("--content=<text>", "消息正文", cyan)}
${item("--contentFile=<path>", "从文件读取消息正文（相对项目根目录）", cyan)}
${item("--no-send", "仅追加日志，不发送 HTTP 请求", cyan)}

${hdr("环境变量")}
${item("API_X_TOKEN", "网关认证令牌（必填）", cyan)}
${item("WEWORK_BOT_WEBHOOK_URL", "可选全局 webhook URL 覆盖", cyan)}

${hdr("输出")}
${item("通知日志", "追加到 docs/故事任务面板/<story>/消息通知列表.md", dim)}
${item("HTTP 响应", "stdout 打印发送结果", dim)}
`;

console.log(help);
