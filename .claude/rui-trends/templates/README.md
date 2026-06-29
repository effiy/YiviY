# rui-trends · Templates

GitHub Trending 报告模板。

| 模板 | 用途 |
|------|------|
| `trends-report.md`  | 通用趋势报告（每日 / 每周切换） |
| `daily-snapshot.md` | 每日 Top 10 快照 |
| `weekly-digest.md`  | 每周分类摘要 |

## 使用方式

```bash
# 1. 运行趋势抓取
node .claude/rui-trends/rui-trends.mjs --lang TypeScript --since weekly

# 2. 将输出整理到对应模板
# 3. （可选）追加推荐章节与领域分组
```

## 数据字段

| 字段 | 来源 |
|------|------|
| 仓库名 / 描述 | GitHub Trending HTML |
| Stars 总数 | 页面 `<a>` href 中 `owner/repo` 后的 star 徽章 |
| 今日 / 本周 | `+N stars today/this week` |
| 语言 | 仓库详情页 |