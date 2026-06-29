# rui-npm · Templates

个人 npm 包管理的发布文档模板。

| 模板 | 用途 |
|------|------|
| `package.json`     | 标准 ESM 包配置（含 exports、files、scripts） |
| `README.md`        | 包文档（Features / Install / Quick Start / API） |
| `CHANGELOG.md`     | Keep a Changelog 格式 |
| `release-notes.md` | GitHub Release notes（PR 链接 + breaking changes） |

## 使用方式

```bash
# 1. 复制模板到包根
cp .claude/rui-npm/templates/{package.json,README.md,CHANGELOG.md} ./my-package/

# 2. 替换 <占位> 与 __DOUBLE_BRACKET__ 占位
# 3. 编写实际代码 + tests
# 4. 通过 rui-npm 发布
node .claude/rui-npm/rui-npm.mjs publish ./my-package
```