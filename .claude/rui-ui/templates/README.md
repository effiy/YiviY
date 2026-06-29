# rui-ui · Templates

UI/UX 设计智能的参考模板。

## `base/` — 通用模板

| 模板 | 用途 |
|------|------|
| `quick-reference.md`  | UI/UX 规则速查（10 类优先级 + Must Have / Anti-Pattern） |
| `skill-content.md`    | SKILL.md 骨架（含 `{{TITLE}}` 等占位） |

## `stack-*.md` — 框架栈指南

| 模板 | 框架 |
|------|------|
| `stack-react.md`   | React (含 Hooks、状态、性能) |
| `stack-vue.md`     | Vue 3 (Composition API) |
| `stack-svelte.md`  | Svelte / SvelteKit |
| `stack-swiftui.md` | SwiftUI (iOS 17+ / iPadOS / macOS) |

## 与 `data/stacks/*.csv` 的关系

- CSV 是 BM25 检索语料
- `stack-*.md` 是该栈的设计指南全文（人读，不进 BM25）