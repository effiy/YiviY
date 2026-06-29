#!/usr/bin/env node
/**
 * rui-bot — 企业微信消息通知发送
 * 用法: node .claude/rui-bot/send.mjs [options]
 *
 * 支持两种模式:
 *   1. 原始模式 (--content / --contentFile): 发送纯文本
 *   2. 模板模式 (--template / --level): 使用 format.mjs 生成结构化消息
 */

import { join } from "node:path";
import { appendFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";

import { NODE_ARGV_OFFSET } from "../../lib/constants.mjs";
import { findProjectRoot, readProjectName, isMain } from "../../lib/fs.mjs";
import {
  formatAlert, formatPipelineReport, formatHealthReport,
  formatDailyIntrospect, formatDeployReport, formatSummary,
  ALERT_LEVELS, truncateForWecom
} from "./format.mjs";

const CONFIG_PATH = ".claude/rui-bot/config.json";
const API_URL_DEFAULT = "https://api.effiy.cn/wework/send-message";
const MAX_RETRIES = 3;
const MSG_MAX_LENGTH = 2000;

// --- config -------------------------------------------------------------------

function loadConfig(projectRoot) {
  const configFile = join(projectRoot, CONFIG_PATH);
  if (!existsSync(configFile)) return {};
  try { return JSON.parse(readFileSync(configFile, "utf-8")); }
  catch { return {}; }
}

// --- args ---------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(NODE_ARGV_OFFSET);
  if (args.length === 0 || args.includes("--help") || args.includes("-h") || args.includes("help")) {
    showUsage();
    process.exit(0);
  }

  const opts = {
    story: "", project: "", content: "", contentFile: "", noSend: false,
    // Template mode
    template: "", level: "", title: "", detail: "",
    // Pipeline report
    pipelineName: "", status: "", total: "", success: "", failed: "", skipped: "", durationSec: "",
    // Health report
    score: "", passCount: "", failCount: "", warnCount: "",
    // Daily introspect
    goods: "", bads: "", actions: "", date: "",
    // Deploy
    version: "", env: "", changes: "",
    // Summary
    summaryTitle: "", items: "",
  };

  for (const arg of args) {
    if (arg === "--no-send" || arg.startsWith("--no-send=")) { opts.noSend = true; continue; }
    const eq = arg.indexOf("=");
    if (eq === -1) continue;
    const key = arg.slice(2, eq);
    const val = arg.slice(eq + 1);
    if (key in opts) opts[key] = val;
  }
  return opts;
}

function showUsage() {
  console.log(`
rui-bot — 企业微信消息通知发送

用法:
  node .claude/rui-bot/send.mjs [options]

== 原始模式 ==
  --story=<name>        故事名（用于日志路径）
  --project=<name>      项目名（默认从 CLAUDE.md 读取）
  --content=<text>      消息正文
  --contentFile=<path>  从文件读取消息正文（相对于项目根目录）
  --no-send             仅追加日志，不发送 HTTP

== 模板模式 (使用 format.mjs) ==
  --template=<name>     报告模板: alert | pipeline | health | daily | deploy | summary
  --level=<level>       告警级别: info | success | warning | error | fatal
  --title=<text>        告警/报告标题

  Pipeline 模板 (--template=pipeline):
    --pipelineName=<n> --status=<s|w|e> --total=<n> --success=<n> --failed=<n> --durationSec=<n>

  Health 模板 (--template=health):
    --score=<n> --passCount=<n> --failCount=<n> --warnCount=<n>

  Daily 模板 (--template=daily):
    --date=<YYYY-MM-DD> --goods=<g1,g2,g3> --bads=<b1,b2,b3> --actions=<a1,a2>

  Deploy 模板 (--template=deploy):
    --version=<v> --env=<production|staging|dev> --status=<s|w|e> --changes=<c1,c2>

  Summary 模板 (--template=summary):
    --summaryTitle=<t> --items=<i1|i2|i3>

环境变量:
  API_X_TOKEN            网关认证令牌（必填）
  WEWORK_BOT_WEBHOOK_URL 可选全局 webhook URL 覆盖
`);
}

// --- message building ----------------------------------------------------------

function buildMessage(opts, projectName) {
  // ── Template mode: use format.mjs ──────────────────────────────────────────
  if (opts.template) {
    return buildFromTemplate(opts, projectName);
  }

  // ── Raw mode ────────────────────────────────────────────────────────────────
  let msg = opts.content || "";

  if (!msg && opts.contentFile) {
    const projectRoot = findProjectRoot(process.cwd());
    const filePath = join(projectRoot, opts.contentFile);
    if (existsSync(filePath)) {
      msg = readFileSync(filePath, "utf-8").trim();
    }
  }

  // Prepend project header
  const header = `【${projectName}】`;
  if (!msg.startsWith(header)) {
    msg = header + "\n" + msg;
  }

  // Truncate if over limit
  if (msg.length > MSG_MAX_LENGTH) {
    msg = msg.slice(0, MSG_MAX_LENGTH - 1) + "…";
  }

  return msg;
}

function buildFromTemplate(opts, projectName) {
  const tpl = opts.template;
  const level = opts.level || 'info';

  switch (tpl) {
    case 'alert': {
      const msg = formatAlert({
        project: projectName,
        level,
        title: opts.title || 'Notification',
        detail: opts.detail || undefined,
        suggestion: opts.suggestion || undefined,
        link: opts.link || undefined,
      });
      return truncateForWecom(msg);
    }

    case 'pipeline': {
      const msg = formatPipelineReport({
        project: projectName,
        pipelineName: opts.pipelineName || 'Pipeline',
        status: opts.status || 'success',
        stats: {
          total: parseInt(opts.total) || 0,
          success: parseInt(opts.success) || 0,
          failed: parseInt(opts.failed) || 0,
          skipped: parseInt(opts.skipped) || 0,
        },
        durationSec: parseFloat(opts.durationSec) || 0,
        logUrl: opts.logUrl || undefined,
      });
      return truncateForWecom(msg);
    }

    case 'health': {
      const msg = formatHealthReport({
        project: projectName,
        health: {
          score: parseInt(opts.score) || 0,
          passCount: parseInt(opts.passCount) || 0,
          failCount: parseInt(opts.failCount) || 0,
          warnCount: parseInt(opts.warnCount) || 0,
          pendingCount: parseInt(opts.pendingCount) || 0,
        },
        topIssues: parseIssues(opts.topIssues),
        reportUrl: opts.reportUrl || undefined,
      });
      return truncateForWecom(msg);
    }

    case 'daily': {
      const msg = formatDailyIntrospect({
        project: projectName,
        date: opts.date || new Date().toISOString().slice(0, 10),
        goods: (opts.goods || '').split(',').filter(Boolean),
        bads: (opts.bads || '').split(',').filter(Boolean),
        actions: (opts.actions || '').split(',').filter(Boolean),
      });
      return truncateForWecom(msg);
    }

    case 'deploy': {
      const msg = formatDeployReport({
        project: projectName,
        version: opts.version || 'unknown',
        env: opts.env || 'production',
        status: opts.status || 'success',
        changes: (opts.changes || '').split(',').filter(Boolean),
        durationSec: parseFloat(opts.durationSec) || undefined,
      });
      return truncateForWecom(msg);
    }

    case 'summary': {
      const items = (opts.items || '').split('|').filter(Boolean).map(text => ({ icon: '•', text }));
      const msg = formatSummary({
        project: projectName,
        title: opts.summaryTitle || 'Summary',
        items,
      });
      return truncateForWecom(msg);
    }

    default: {
      console.error(`[rui-bot] 未知模板: ${tpl}，可用: alert, pipeline, health, daily, deploy, summary`);
      return null;
    }
  }
}

function parseIssues(str) {
  if (!str) return [];
  // Format: "name1:status1:note1|name2:status2:note2"
  return str.split('|').filter(Boolean).map(part => {
    const [name, status, note] = part.split(':');
    return { name, status, note };
  });
}

// --- notification log ---------------------------------------------------------

function appendLog(projectRoot, story, message) {
  if (!story) return;
  const logDir = join(projectRoot, "docs", "故事任务面板", story);
  mkdirSync(logDir, { recursive: true });
  const logPath = join(logDir, "消息通知列表.md");
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const entry = `【${timestamp}】\n\n${message}\n`;
  appendFileSync(logPath, entry, "utf-8");
  console.log(`[rui-bot] 通知已追加到日志: ${logPath}`);
}

// --- HTTP send ----------------------------------------------------------------

async function httpPost(apiUrl, token, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": token,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return { ok: res.status >= 200 && res.status < 300, status: res.status };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: err.message };
  }
}

async function sendWithRetry(apiUrl, webhookUrl, message, token, maxRetries) {
  for (let i = 0; i <= maxRetries; i++) {
    const result = await httpPost(apiUrl, token, { webhook_url: webhookUrl, content: message });
    if (result.ok) return { ok: true, error: null, retries: i };
    if (i < maxRetries) {
      const delay = Math.min(2000 * Math.pow(2, i), 30_000);
      console.log(`[rui-bot] 发送失败，${delay / 1000}s 后重试 (${i + 1}/${maxRetries})`);
      await new Promise((r) => setTimeout(r, delay));
    } else {
      return { ok: false, error: result.error || `HTTP ${result.status}`, retries: i };
    }
  }
  return { ok: false, error: "unknown", retries: maxRetries };
}

// --- main sender --------------------------------------------------------------

export async function sendNotification(projectRoot, opts) {
  const projectName = opts.project || readProjectName(projectRoot);
  const config = loadConfig(projectRoot);

  // Build message
  const message = buildMessage(opts, projectName);
  if (!message.trim() || message.trim() === `【${projectName}】`) {
    console.error("[rui-bot] ❌ 消息内容为空，请通过 --content 或 --contentFile 指定");
    return { ok: false, error: "empty-content", retries: 0 };
  }

  // Always append to log
  appendLog(projectRoot, opts.story, message);

  // --no-send mode
  if (opts.noSend) {
    console.log("[rui-bot] --no-send 模式，跳过 HTTP 发送");
    return { ok: true, error: null, retries: 0, noSend: true };
  }

  // Resolve token
  const token = process.env.API_X_TOKEN || "";
  if (!token) {
    console.log("[rui-bot] ⚠️  API_X_TOKEN 缺失，跳过发送（日志已写入）");
    return { ok: false, error: "no-token", retries: 0 };
  }

  // Resolve webhook URL
  let webhookUrl = process.env.WEWORK_BOT_WEBHOOK_URL || "";
  if (!webhookUrl && config.robots) {
    const robotName = config.default_robot || "general";
    const robot = (config.robots || {})[robotName] || {};
    webhookUrl = robot.webhook_url || "";
    if (robot.webhook_url_env && process.env[robot.webhook_url_env]) {
      webhookUrl = process.env[robot.webhook_url_env];
    }
  }
  if (!webhookUrl) {
    console.log("[rui-bot] ⚠️  webhook URL 未配置，跳过发送（日志已写入）");
    return { ok: false, error: "no-webhook", retries: 0 };
  }

  // Send
  const apiUrl = config.api_url || API_URL_DEFAULT;
  console.log(`[rui-bot] 发送通知: story=${opts.story || "—"} 长度=${message.length}`);
  const result = await sendWithRetry(apiUrl, webhookUrl, message, token, MAX_RETRIES);

  if (result.ok) {
    console.log(`[rui-bot] ✅ 发送成功 (retries=${result.retries})`);
  } else {
    console.error(`[rui-bot] ❌ 发送失败: ${result.error} (retries=${result.retries})`);
  }

  return result;
}

// --- main ---------------------------------------------------------------------

async function main() {
  const opts = parseArgs();
  const projectRoot = findProjectRoot(process.cwd());
  await sendNotification(projectRoot, opts);
}

const _isMain = isMain(import.meta.url);
if (_isMain) {
  main().catch((err) => {
    console.error(`[rui-bot] fatal: ${err.message}`);
    process.exit(1);
  });
}
