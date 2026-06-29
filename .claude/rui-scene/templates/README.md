# rui-scene · Templates

YrySceneCard 三档卡片数据模板。

| 模板 | Tier | 用途 |
|------|------|------|
| `card-rich.js`     | Rich     | 报告 / 工具 / 项目 / Agent |
| `card-standard.js` | Standard | 特性网格 / 能力卡片 |
| `card-nav.js`      | Nav      | 文档页内导航 |
| `TIER_REFERENCE.md` | —       | 三档字段约束 + modifier 语义 |

## 占位约定

每个模板导出多个 variant（如 `YRY_CARD_RICH` / `YRY_CARD_RICH_TOOL` / `YRY_CARD_RICH_AGENT`），
Phase 3 选择最匹配的 variant 替换字段即可。

## modifier 语义速查

| Modifier | 含义 |
|----------|------|
| `warn` / `red` / `green` | 分数（passing / failing / mid） |
| `info` / `purple` | 方法 / 维度 |
| `cyan` | 计数 |
| `accent` | 亮点 / New |