# rui-diagram · Templates

架构图 SVG 模板与 Knowledge Graph 模式。

## HTML 模板

| 模板 | 用途 |
|------|------|
| `architecture-system.html` | 系统架构（UI / Service / Data / Infra / Auth 层） |
| `infrastructure.html`       | 基础设施（VPC / Subnet / DB tier） |
| `network-topology.html`    | 网络拓扑（LAN / WAN / VPN） |
| `cloud-architecture.html`  | 云架构（Compute / Storage / Messaging / IAM） |

每个模板都：
- 内置 `--diag-*` token（CSS 变量），从 `--yry-*` 派生
- 使用语义 class（`node-ui` / `node-service` / `node-data` ...）
- 不硬编码颜色（替换主题即可整体换肤）

## 共用资源

| 文件 | 用途 |
|------|------|
| `theme-bridge.css` | `--yry-*` → `--diag-*` 映射，必须在主题 CSS 之后引入 |

## 数据模式

| 文件 | 用途 |
|------|------|
| `knowledge-graph.schema.json` | KG JSON Schema，校验 `nodes` / `edges` / `metadata` 结构 |

## 用法

```bash
# 1. 选模板并复制
cp .claude/rui-diagram/templates/architecture-system.html docs/views/diagram/index.html

# 2. 替换 [PLACEHOLDER]
# 3. 引入主题与 bridge
# <link rel="stylesheet" href="cdn/theme/<preset>.css">
# <link rel="stylesheet" href="theme-bridge.css">
```