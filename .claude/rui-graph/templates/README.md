# rui-graph · Templates

代码依赖图谱的两种视图模板。

## 视图模式

| 模板 | 模式 | 节点类型 | 边类型 |
|------|------|----------|--------|
| `full-graph/` | Mode A · 全图 | file + class + function + module | 全部 |
| `module-only/` | Mode B · 模块级 | file + module | imports / depends_on |

每个视图包含：

| 文件 | 作用 |
|------|------|
| `index.html` | Cytoscape + 工具栏 + 侧边栏 + 检查器 |
| `index.js`   | Cytoscape 挂载、搜索、布局切换、检查器渲染 |
| `index.css`  | 视图专用样式（继承 `--graph-*` token） |
| `data.js`    | `window.GRAPH_DATA` + Cytoscape 样式表 |

## 共用资源

| 文件 | 用途 |
|------|------|
| `theme-bridge.css` | `--yry-*` → `--graph-*` 映射 |

## Cytoscape 样式覆盖

`data.js` 中的 `window.GRAPH_STYLES` 数组定义了节点/边的视觉规则。常见 selector：

| Selector | 含义 |
|----------|------|
| `node[type = "file"]` | 文件节点 |
| `node[type = "class"]` | 类节点 |
| `node[type = "function"]` | 函数节点 |
| `node[type = "module"]` | 模块节点（`__init__.py`） |
| `edge[type = "calls"]` | 函数调用边 |
| `edge[type = "inherits"]` | 继承边 |
| `.highlighted` | 搜索命中 |
| `.dimmed` | 搜索非命中（淡化） |