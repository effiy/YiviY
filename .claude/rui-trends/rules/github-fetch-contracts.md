---
paths:
  - ".claude/rui-trends/**"
  - ".claude/rui-trends/SKILL.md"
description: "GitHub Trending 数据获取的速率限制与边界。"
---

# rui-trends 数据契约

> 抓取 GitHub Trending HTML 并输出结构化 markdown 表格，所有 HTTP 与限速边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 用户选项（语言 / 时间窗口）|
| 输出 | 标准 markdown 表格（stdout）|
| 调用模式 | 单次 CLI，无管线 |
| 状态 | 仅 HTTP GET 输出到 stdout，无写 |

## 输入契约

| 选项 | 取值 | 默认 | 备注 |
|------|------|:---:|------|
| `--lang, -l` | 自由字符串 | `全部` | 不与 GitHub 内部语言白名单校验 |
| `--since` | `daily` \| `weekly` | `daily` | 仅这两个枚举合法 |
| `--help, -h` | 标志 | — | 输出 `help.mjs` 内容 |

## 输出契约

| 列 | 来源 | 必填 |
|---|------|:---:|
| 排名 | 解析顺序 | 是 |
| 仓库 | `owner/repo` | 是 |
| Stars | GitHub 展示 | 是 |
| 语言 | `<span itemprop="programmingLanguage">` | 否 |
| 今日 / 本周 Stars | `span.float-sm-right` 或相对计数 | 是 |
| 描述 | `p.col-9` | 否 |

## 速率与安全约束

| # | 规则 | 来源 |
|---|------|------|
| 1 | HTTP 30s 超时 | skill 自定义 |
| 2 | 默认匿名请求 — 不要主动带 GitHub token | 凭据保护 |
| 3 | 不持久化任何缓存（无 `.cache/` 目录写入）| 简化 |
| 4 | 失败时输出原始 URL 让用户手动访问 | 优雅降级 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `<this-skill-dir>/` | read+write | owned |
| stdout | write | 主产物 |
| stderr | write | 错误输出 |
| `https://github.com/trending*` | read-only HTTP GET | 唯一外部源 |
| 其他任何路径 | **no** | 无副作用 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 仅抓取 `?since=daily|weekly&language=<L>` URL 第一页 | 数据源固定 | 不发起其他路径 |
| 2 | 请求 `User-Agent: rui-trends/<version>` 自定义标识 | GitHub 抗爬可识别 | 注入 |
| 3 | 不持久化历史 — 每次都是新一次 fetch | 单次任务定位 | 拒绝持久化 |
| 4 | 输出严格按 markdown 表格对齐 — 不附加 emoji / 评分 | 可管线消费 | 警告 |
| 5 | HTML 解析失败时直接报告 + 原始 URL，不伪造数据 | 数据准确性 | 阻塞 |
| 6 | 不替代 [[rui-npm]] / [[rui-scene]] 等 package/search 类技能 | 范围聚焦 GitHub Trending | 推荐替代方案 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| GitHub 429 / 限速（60 req/h 匿名）| 输出错误信息 + 手动访问链接 | 等下一窗口 |
| 网络超时 30s | stderr 错误信息 | 用户重试 |
| HTML 结构变更（CSS 选择器失效）| 解析失败 + 原始 URL | 升级脚本 |
| `--since` 不在枚举 | stderr 错误 + 退出非 0 | 改 `--since daily` |
| `--lang` 内容为空字符串 | URL 仍合法（不过滤），结果可能等于"全部" | 接受 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-npm]] | 平行 | 不互调 | npm vs GitHub 趋势 |
| [[rui-ui]] | 不相交 | 风格情报 vs 趋势数据 | 平行 |

## 集成点

> 当前状态：本技能为按需单次任务工具。无定时器、无管线级消费者。任何"每日早报"或"周报"需求须由调用方（如调度器）显式调用 `node <this-skill-dir>/rui-trends.mjs --lang <L> --since daily|weekly`，不内置 cron。
