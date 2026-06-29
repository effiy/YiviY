#!/usr/bin/env node
/**
 * rui-bot/format.mjs — 消息格式化与报告模板
 * 提供多级告警格式、项目报告模板、人性化消息构建。
 *
 * 用法:
 *   import { formatAlert, formatReport, formatSummary, ALERT_LEVELS } from './format.mjs'
 */

// ── 告警级别 ──────────────────────────────────────────────────────────────────

/** @enum {string} 告警级别及对应 Emoji/颜色语义 */
export const ALERT_LEVELS = {
  info:    { emoji: 'ℹ️',  label: '信息',   priority: 0 },
  success: { emoji: '✅',  label: '成功',   priority: 1 },
  warning: { emoji: '⚠️',  label: '警告',   priority: 2 },
  error:   { emoji: '🚨',  label: '错误',   priority: 3 },
  fatal:   { emoji: '💥',  label: '致命',   priority: 4 },
};

// ── 消息格式化 ────────────────────────────────────────────────────────────────

/**
 * 构建带级别的告警消息
 *
 * @param {Object} opts
 * @param {string} opts.project - 项目名
 * @param {'info'|'success'|'warning'|'error'|'fatal'} opts.level - 告警级别
 * @param {string} opts.title - 告警标题（一行概要）
 * @param {string} [opts.detail] - 详细描述
 * @param {Object<string, string>} [opts.fields] - 键值对字段（如 { 耗时: '2m 34s', 文件: '12' }）
 * @param {string} [opts.suggestion] - 建议/下一步
 * @param {string} [opts.link] - 相关链接
 * @returns {string} 格式化后的消息文本
 */
export function formatAlert(opts) {
  const { project, level, title, detail, fields, suggestion, link } = opts;
  const lv = ALERT_LEVELS[level] || ALERT_LEVELS.info;

  const lines = [];
  lines.push(`${lv.emoji} 【${project}】${lv.label}: ${title}`);

  if (detail) {
    lines.push('');
    lines.push(detail);
  }

  if (fields && Object.keys(fields).length > 0) {
    lines.push('');
    for (const [key, val] of Object.entries(fields)) {
      lines.push(`  ${key}: ${val}`);
    }
  }

  if (suggestion) {
    lines.push('');
    lines.push(`💡 ${suggestion}`);
  }

  if (link) {
    lines.push('');
    lines.push(`🔗 ${link}`);
  }

  lines.push('');
  lines.push(`—— ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);

  return lines.join('\n');
}

// ── 报告模板 ──────────────────────────────────────────────────────────────────

/**
 * 管线完成报告
 *
 * @param {Object} opts
 * @param {string} opts.project
 * @param {string} opts.pipelineName - 管线名称（如 "yt-dlp 字幕提取"）
 * @param {'success'|'warning'|'error'} opts.status
 * @param {Object} opts.stats - 统计 { total, success, failed, skipped }
 * @param {number} opts.durationSec - 耗时秒数
 * @param {string} [opts.logUrl] - 日志链接
 */
export function formatPipelineReport(opts) {
  const { project, pipelineName, status, stats, durationSec, logUrl } = opts;
  const level = status === 'success' ? 'success' : status === 'warning' ? 'warning' : 'error';

  const mins = Math.floor(durationSec / 60);
  const secs = Math.round(durationSec % 60);
  const duration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return formatAlert({
    project,
    level,
    title: `管线完成: ${pipelineName}`,
    detail: [
      `📊 总计: ${stats.total} | ✅ 成功: ${stats.success} | ❌ 失败: ${stats.failed} | ⏭️ 跳过: ${stats.skipped}`,
      `⏱️ 耗时: ${duration}`,
    ].join('\n'),
    fields: {
      '管线': pipelineName,
      '状态': level === 'success' ? '全部成功' : level === 'warning' ? '部分成功' : '执行失败',
      '耗时': duration,
    },
    suggestion: status === 'error'
      ? '请检查日志排查失败原因，可使用 rui-checklist 进行项目自检。'
      : '管线已完成，可查看日志了解详情。',
    link: logUrl || undefined,
  });
}

/**
 * 项目自检报告（配合 rui-checklist 使用）
 *
 * @param {Object} opts
 * @param {string} opts.project
 * @param {Object} opts.health - { score, passCount, failCount, warnCount, pendingCount }
 * @param {Array<{name: string, status: string, note: string}>} opts.topIssues - Top 3-5 问题
 * @param {string} [opts.reportUrl]
 */
export function formatHealthReport(opts) {
  const { project, health, topIssues, reportUrl } = opts;
  const scoreEmoji = health.score >= 90 ? '🟢' : health.score >= 70 ? '🟡' : health.score >= 50 ? '🟠' : '🔴';

  let issuesText = '';
  if (topIssues && topIssues.length > 0) {
    issuesText = topIssues.map((issue, i) =>
      `  ${i + 1}. ${issue.status === 'fail' ? '❌' : '⚠️'} ${issue.name} — ${issue.note}`
    ).join('\n');
  }

  return formatAlert({
    project,
    level: health.score >= 90 ? 'success' : health.score >= 70 ? 'warning' : 'error',
    title: `项目健康度: ${health.score}/100 ${scoreEmoji}`,
    detail: [
      `📋 检查项: ${health.passCount + health.failCount + health.warnCount + health.pendingCount}`,
      `✅ 通过: ${health.passCount} | ❌ 失败: ${health.failCount} | ⚠️ 警告: ${health.warnCount} | 👤 待审: ${health.pendingCount}`,
      issuesText ? `\n🔍 重点关注:\n${issuesText}` : '',
    ].filter(Boolean).join('\n'),
    fields: {
      '健康分': `${health.score}/100`,
      '通过率': `${Math.round(health.passCount / (health.passCount + health.failCount + health.warnCount) * 100)}%`,
    },
    suggestion: health.score < 70
      ? '建议立即处理 fail 项，查看详细报告了解改进建议。'
      : health.score < 90
        ? '建议关注 warn 项，持续改进项目质量。'
        : '项目状态良好，继续保持！',
    link: reportUrl || undefined,
  });
}

/**
 * 每日自省报告（配合 rui-checklist 每日自省使用）
 *
 * @param {Object} opts
 * @param {string} opts.project
 * @param {string} opts.date - 日期 YYYY-MM-DD
 * @param {string[]} opts.goods - 今日做得好
 * @param {string[]} opts.bads - 今日需改进
 * @param {string[]} [opts.actions] - 明日计划
 */
export function formatDailyIntrospect(opts) {
  const { project, date, goods, bads, actions } = opts;

  const lines = [];
  lines.push(`📋 【${project}】每日自省 — ${date}`);

  lines.push('');
  lines.push('🟢 今日 Good:');
  goods.forEach((g, i) => { lines.push(`  ${i + 1}. ${g}`); });

  lines.push('');
  lines.push('🔴 今日 Bad:');
  bads.forEach((b, i) => { lines.push(`  ${i + 1}. ${b}`); });

  if (actions && actions.length > 0) {
    lines.push('');
    lines.push('🎯 明日计划:');
    actions.forEach((a, i) => { lines.push(`  ${i + 1}. ${a}`); });
  }

  lines.push('');
  lines.push(`—— 每日自省 · ${date}`);

  return lines.join('\n');
}

/**
 * 部署/发布通知
 *
 * @param {Object} opts
 * @param {string} opts.project
 * @param {string} opts.version - 版本号
 * @param {string} opts.env - 环境 (production/staging/dev)
 * @param {'success'|'warning'|'error'} opts.status
 * @param {string[]} [opts.changes] - 变更列表
 * @param {number} [opts.durationSec]
 */
export function formatDeployReport(opts) {
  const { project, version, env, status, changes, durationSec } = opts;
  const envLabel = { production: '生产', staging: '预发', dev: '开发' }[env] || env;

  const duration = durationSec != null
    ? (durationSec >= 60 ? `${Math.floor(durationSec / 60)}m ${Math.round(durationSec % 60)}s` : `${Math.round(durationSec)}s`)
    : null;

  let changesText = '';
  if (changes && changes.length > 0) {
    changesText = changes.map((c, i) => `  ${i + 1}. ${c}`).join('\n');
  }

  return formatAlert({
    project,
    level: status,
    title: `${envLabel}环境部署${status === 'success' ? '完成' : status === 'warning' ? '完成（有警告）' : '失败'}`,
    detail: [
      `📦 版本: ${version}`,
      `🌍 环境: ${envLabel}`,
      duration ? `⏱️ 耗时: ${duration}` : '',
      changesText ? `\n📝 变更:\n${changesText}` : '',
    ].filter(Boolean).join('\n'),
    fields: {
      '版本': version,
      '环境': envLabel,
      ...(duration ? { '耗时': duration } : {}),
    },
    suggestion: status === 'error'
      ? '部署失败，请检查构建日志和服务器状态。'
      : '部署已完成，请验证关键功能。',
  });
}

/**
 * 简洁摘要 — 用于高频通知合并
 *
 * @param {Object} opts
 * @param {string} opts.project
 * @param {string} opts.title
 * @param {Array<{icon: string, text: string}>} opts.items
 */
export function formatSummary(opts) {
  const { project, title, items } = opts;

  const lines = [];
  lines.push(`📋 【${project}】${title}`);

  if (items && items.length > 0) {
    for (const item of items) {
      lines.push(`  ${item.icon || '•'} ${item.text}`);
    }
  }

  lines.push('');
  lines.push(`—— ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);

  return lines.join('\n');
}

// ── Markdown 消息增强 ────────────────────────────────────────────────────────

/**
 * WeCom 支持的 Markdown 子集转义/清理
 * WeCom webhook 仅支持纯文本，这里做安全清理。
 *
 * @param {string} text
 * @returns {string}
 */
export function sanitizeForWecom(text) {
  return text
    // 移除 HTML 标签
    .replace(/<[^>]*>/g, '')
    // 保留常用 emoji，移除零宽字符
    .replace(/[​-‍﻿]/g, '')
    // 多个空行合并
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * 将消息截断到 WeCom 限制 (2000 字符)
 *
 * @param {string} msg
 * @param {number} [maxLen=2000]
 * @returns {string}
 */
export function truncateForWecom(msg, maxLen = 2000) {
  if (msg.length <= maxLen) return msg;
  const suffix = '\n\n…[消息过长已截断]';
  return msg.slice(0, maxLen - suffix.length) + suffix;
}
