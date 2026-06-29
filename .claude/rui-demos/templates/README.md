# rui-demos · Templates

6 种 Demo 类型的标准化 4 文件模板，对应 SKILL.md 中 A–F 的判定决策树。

## 目录与触发

| 类型 | 触发信号 | 模板 |
|------|----------|------|
| **A · Tool Interface** | `links` 为外部 URL 数组 | `type-a-tool/` |
| **B · Pipeline**      | `tags` 含 `purple` 或 desc 含 stages/steps | `type-b-pipeline/` |
| **C · Comparison**    | 标签含计数（"6 engines"） | `type-c-comparison/` |
| **D · State Machine** | tags 含 "real-time" / "checkpoint" | `type-d-state/` |
| **E · Dashboard**     | `badge === 'Report'` | `type-e-dashboard/` |
| **F · Guide**         | `badge === 'Guide'` 或 `nameHref` 含 `#fragment` | `type-f-guide/` |

每个类型目录包含：

| 文件 | 内容 |
|------|------|
| `index.html` | card-area + demo-area + info-area 三段布局 |
| `index.js`   | Vue 3 IIFE（data / methods / beforeUnmount） |
| `index.css`  | 类型专用样式，依赖 `--yry-*` token |
| `data.js`    | `DEMO_CARD_DATA` + `DEMO_MOCK_DATA` + `_meta` |

## 与 `assets/scaffold-*` 的关系

- `assets/scaffold-*` 是通用的 Phase 2 骨架（仅含 `__PLACEHOLDER__`）
- `templates/type-*` 是各类型的成品骨架，Phase 3 直接按类型套用

## 占位符

| 占位符 | 含义 |
|--------|------|
| `__CARD_NAME__` | 卡片显示名 |
| `__CARD_DESC_SNIPPET__` | 描述摘录（≤160 字符） |
| `__THEME_NAME__` | 主题 preset 名（如 `modern-minimalist`） |
| `__CHARTJS_CDN__` | Type E 的 `<script>` 标签（其他类型注释） |
| `__STAGES_JSON__` / `__VARIANTS_JSON__` 等 | 数据占位（JSON 字面量） |
| `__DEMO_SLUG__` | 短横线命名 slug |
| `__SCENE_NAME__` | 所属场景名 |
| `__GENERATED_AT__` | ISO 8601 时间戳 |