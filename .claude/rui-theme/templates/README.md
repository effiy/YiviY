# rui-theme · Templates

主题生成与校验模板。

| 模板 | 用途 |
|------|------|
| `theme.md`             | 单个主题规格（颜色 token + 字体 + 用法） |
| `tokens-manifest.json` | 权威 `--yry-*` token 清单（必须全量定义） |
| `palette-generation.md` | 12 步调色板生成流程 |

## 与 `themes/` 目录的关系

- `themes/*.md` — 已有的预设主题（10 套）
- `templates/theme.md` — 新主题的脚手架（生成后迁入 `themes/`）

## Token 所有权

`tokens-manifest.json` 列出了**所有** `--yry-*` token。任何主题文件（`themes/*.md` 与 `templates/theme.md` 的派生 CSS）都必须定义这些 token。`token-contracts.md` 规则强制此约束。