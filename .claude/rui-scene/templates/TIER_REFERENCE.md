# YrySceneCard Tier Reference

| Tier | Use Case | Required Fields | Optional Fields |
|------|----------|---------------|-----------------|
| **Rich** | Reports, audits, tools, projects, agents | `name`, `desc` (with `·` + `<strong>`), `tags` (2–4 with semantic modifiers), `badge` | `meta`, `nameHref`, `nameTarget`, custom `links` |
| **Standard** | Feature grids, capability cards | `name`, `desc` (with `·` + `<strong>`), `tags` (2–4 with semantic modifiers) | `badge`, `meta` |
| **Nav** | Documentation navigation | `name`, `nameHref`, `nameTarget: ''`, `desc` (with `·` for multiple points) | `badge`, `tags` |

## Tag Modifier Semantics

| Modifier | Use For | Example |
|----------|---------|---------|
| `warn`   | Warning scores (mid-range) | `58 / 100`, `B+` |
| `red`    | Failing scores | `Failed`, `Critical` |
| `green`  | Passing scores / healthy state | `100 / 100`, `Active` |
| `info`   | Methodology / dimension count | `7 dimensions`, `ATAM` |
| `accent` | Highlight / new | `New`, `Highlighted` |
| `purple` | Tech / pipeline / process | `Python`, `Pipeline` |
| `cyan`   | Counts / quantities | `26 actions`, `12 dimensions` |

## Links Convention

- `null` (default) → use `data.js` default 7-link row (清单 / 架构 / 图谱 / 源码 / 测试 / 演示 / 审查)
- `[]` → hide all bottom links (preferred for dense feature grids)
- `[{ icon, label, href, target }]` → custom override

## desc Field Standard

```
'7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap'
```

Rules:
- Use `·` (U+00B7) as separator — never commas or plain spaces between features
- At least one `<strong>` for the key takeaway
- 1–2 lines max (cards are scannable, not encyclopedic)
- End with a concrete outcome ("56h roadmap", "5-week implementation plan")