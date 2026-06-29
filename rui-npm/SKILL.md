---
name: rui-npm
description: >-
  Personal npm package manager — search, install, update, list, info,
  uninstall, publish local files/directories, npx run, audit, CDN lookup,
  login, my-packages, deprecate, and unpublish. Every npm interaction in
  one skill.
---

# rui-npm

Personal npm package manager. When the user asks to do anything with npm
packages — searching, installing, updating, auditing, publishing, CDN
lookup, account management — you use this skill. Never run raw npm
commands on your own; always apply the pre-checks and structured output
conventions below.

## When to use

This skill triggers when the user requests any of these actions:

| What the user says | Corresponding action |
|---|---|
| "search for <keyword>" | `/rui-npm search <keyword>` |
| "install <pkg>" / "add <pkg>" | `/rui-npm install <pkg>[@version]` |
| "update <pkg>" / "upgrade <pkg>" | `/rui-npm update <pkg>` |
| "list packages" / "what's installed" | `/rui-npm list [--depth N]` |
| "info <pkg>" / "tell me about <pkg>" | `/rui-npm info <pkg>` |
| "uninstall <pkg>" / "remove <pkg>" | `/rui-npm uninstall <pkg>` |
| "publish this file/dir" | `/rui-npm publish <path>` |
| "npx <pkg>" / "run <pkg> without installing" | `/rui-npm npx <pkg>` |
| "audit" / "check vulnerabilities" | `/rui-npm audit` |
| "cdn link for <pkg>" | `/rui-npm cdn <pkg>` |
| "login to npm" | `/rui-npm login --token <token>` |
| "my packages" / "packages I own" | `/rui-npm my-packages` |
| "deprecate <pkg>" | `/rui-npm deprecate <pkg> "<msg>"` |
| "unpublish <pkg>" / "delete <pkg> from npm" | `/rui-npm unpublish <pkg> [--force]` |
| `/rui-npm --help` or `/rui-npm -h` | Print the help summary (at end of this doc) |

## Core workflow (for every request)

Before running any npm command, always:

1. **Check npm exists** — run `npm --version`. If it fails: tell the user to install Node.js from https://nodejs.org. If the major version is < 7: warn that npm is old and suggest an upgrade.
2. **Route the sub-command** — match the user's intent to one of the 14 sub-commands below.
3. **Run the pre-checks** specific to that sub-command.
4. **Execute** the npm command.
5. **Format output** — tables by default, JSON only when `--json` is passed.

## Sub-commands

### search — Search npm registry

**When**: user wants to find packages by keyword.

```bash
npm search <keyword> --json --long
```

1. Require a non-empty keyword. If missing, tell the user: `用法: /rui-npm search <keyword>`.
2. If the search fails (network error): tell the user the registry may be unreachable, and give them the manual URL: `https://www.npmjs.com/search?q=<keyword>`.
3. Sort results by `downloads.weekly` descending.
4. Slice to the `--limit` count (default 20).
5. If `--json`: output the raw JSON array.
6. Otherwise output a markdown table:

```
## npm 搜索结果 — "<keyword>"（YYYY-MM-DD HH:MM）

| # | 包名 | 版本 | 周下载量 | 描述 |
|---|------|------|---------|------|
| 1 | react | 18.2.0 | 21000k/w | A JavaScript library for building user interfaces |
```

7. Always print a footer with total count: `> 共 N 条结果，展示前 M 条。使用 --json 查看完整数据。`

### install — Install a package

**When**: user wants to add a package to the project.

```bash
npm install [--save-dev] [--global] <pkg>[@version]
```

1. Require a non-empty package name.
2. If NOT using `--global`: verify `package.json` exists. If missing, tell the user to run `npm init` first.
3. Pass `--save-dev` when `--dev` / `-D` is set.
4. Pass `-g` when `--global` / `-g` is set, and skip the package.json check.
5. After install, run `npm list <pkgName> --json --depth 0` to confirm the installed version.
6. On failure: suggest `/rui-npm search <pkgName>` to verify the package name.

### update — Update a package

**When**: user wants to upgrade a package to the latest compatible version.

```bash
npm list <pkg> --json --depth 0   # get current version
npm update <pkg>                   # perform the update
npm list <pkg> --json --depth 0   # get new version
```

1. Require a non-empty package name.
2. Verify `package.json` exists.
3. Record the version BEFORE and AFTER the update.
4. Output: `✅ <pkg>: <beforeVer> → <afterVer>` if changed, or `✅ <pkg>@<ver> 已是最新兼容版本` if unchanged.

### list — List installed packages

**When**: user wants to see what's installed in the project.

```bash
npm list --json [--depth <N>]
```

1. Verify `package.json` exists.
2. Default `--depth` is 0 (top-level only). Pass `--depth <N>` if specified.
3. If `--json`: output the raw JSON.
4. Otherwise flatten the dependency tree and output a table:

```
## 已安装依赖（N 个包）

| 包名 | 版本 | 层级 |
|------|------|------|
| react | 18.2.0 | 0 |
| ... | ... | ... |
```

### info — Package metadata

**When**: user wants details about a specific npm package.

```bash
npm view <pkg> --json
```

1. Require a non-empty package name.
2. If the package doesn't exist: suggest `/rui-npm search <pkg>`.
3. If `--json`: output the raw JSON.
4. Otherwise output a structured summary table:

```
## <pkgName> — 包信息

| 字段 | 值 |
|------|-----|
| 名称 | <name> |
| 描述 | <description> |
| 最新版本 | <version> |
| 许可证 | <license> |
| 主页 | <homepage> |
| 仓库 | <repository.url> |
| 维护者 | <maintainer names, comma-separated> |
| 关键词 | <keywords, comma-separated, max 10> |
| 最近版本 | <last 10 versions> |
| 依赖 (N) | <dependencies, comma-separated, max 10> |
```

### uninstall — Remove a package

**When**: user wants to remove a package from the project.

```bash
npm uninstall <pkg>
```

1. Require a non-empty package name.
2. Verify `package.json` exists.
3. On failure: tell the user to confirm the package is actually installed.

### publish — Publish a local file or directory

**When**: user wants to publish a local `.js`/`.mjs` file or directory as an npm package.

**Pre-flight checks:**

1. Verify the path exists on disk.
2. Verify npm login: `npm whoami`. If not logged in, tell the user to run `/rui-npm login --token <token>` first.
3. Check for name conflicts: `npm view <pkgName> version`. If the package already exists and the current user is NOT a maintainer, reject with a clear error and suggest `--name` to pick a different name.

**File mode** (path is a file):
1. Create a temp directory under `$TMPDIR`.
2. Copy the file as `index.js` (or `index.mjs` for `.mjs` files).
3. Generate a `package.json`:

```json
{
  "name": "<derived from filename or --name>",
  "version": "<--version or 1.0.0>",
  "description": "<--description or auto-generated>",
  "main": "index.js",
  "bin": { "<name>": "./index.js" },
  "license": "MIT"
}
```

**Directory mode** (path is a directory):
1. If `package.json` exists in that directory: use it, overriding name/version from `--name`/`--version`.
2. If not: generate one interactively (ask the user for name and version).

**Publish step**:
```bash
npm publish [--access public] [--dry-run]
```

1. Use `--dry-run` to preview without uploading.
2. Pass `--access public` for scoped packages (@scope/pkg) that should be public.
3. Clean up temp directories after publishing (or on failure).
4. On success, print:
```
✅ <pkgName>@<version> 发布成功
   安装: npm install <pkgName>
   运行: npx <pkgName>
```

### npx — Run a package without installing

**When**: user wants to execute an npm package via npx.

```bash
npx --yes <pkg>[@version] [-- args...]
```

1. Require a non-empty package name.
2. Use `--yes` to skip the install prompt.
3. Any arguments after `--` are passed to the package.
4. Stream the output (inherit stdio).

### audit — Security audit

**When**: user wants to check dependencies for known vulnerabilities.

```bash
npm audit --json
```

1. Verify `package.json` exists.
2. Parse the JSON output. Extract `vulnerabilities` map.
3. Tally by severity: `critical`, `high`, `moderate`, `low`, `info`.
4. If `--json`: output the raw JSON.
5. Otherwise output a summary table:

```
## 安全审计结果 — YYYY-MM-DD HH:MM

| 严重级别 | 数量 |
|---------|------|
| 💀 Critical | 0 |
| 🔴 High     | 2 |
| 🟡 Moderate | 5 |
| 🟢 Low      | 3 |

✅ 未发现已知漏洞。
```
Or if vulnerabilities exist, add a detailed table:

```
| 包名 | 严重级别 | 影响范围 | 漏洞来源 | 可修复 |
|------|---------|---------|---------|--------|
| ... | ... | ... | ... | ✅/❌ |

### 修复建议
- `npm audit fix` — 自动修复兼容的漏洞
- `npm audit fix --force` — 强制修复（可能包含破坏性变更）
```

### cdn — CDN reference URLs

**When**: user wants CDN URLs for a package (for browser `<script>` or `import`).

```bash
npm view <pkgName> version   # get the latest version
```

1. Parse `pkg@version` — if no version is given, use the latest from npm.
2. Generate three CDN URLs:

| CDN | URL pattern | Best for |
|-----|-------------|---------|
| unpkg | `https://unpkg.com/<pkg>@<ver>/` | Raw file browsing, debugging |
| jsDelivr | `https://cdn.jsdelivr.net/npm/<pkg>@<ver>/` | Production `<script>` tags |
| esm.sh | `https://esm.sh/<pkg>@<ver>` | ESM `import` / `<script type="module">` |

3. Output as a markdown table:

```
## <pkg>@<ver> — CDN 引用地址

| CDN | URL |
|-----|-----|
| unpkg    | https://unpkg.com/... |
| jsDelivr | https://cdn.jsdelivr.net/npm/... |
| esm.sh   | https://esm.sh/... |
```

### login — npm authentication

**When**: user needs to set up npm registry authentication via Access Token.

```bash
npm config set //registry.npmjs.org/:_authToken <token>
npm whoami   # verify
```

1. Get the token from `--token <token>` or the `NPM_TOKEN` environment variable.
2. If neither is provided: tell the user to provide one. Point them to https://www.npmjs.com/settings/<user>/tokens for token creation. Recommend "Automation" type.
3. Validate token length ≥ 20 characters. Reject if shorter.
4. After setting the token, run `npm whoami` to verify.
5. If verification fails: clear the token (`npm config delete //registry.npmjs.org/:_authToken`) and report common causes (expired, wrong type, revoked).
6. NEVER echo the full token. Always mask: show only first 4 + last 4 characters (e.g. `npm_****abcd`).

### my-packages — List packages owned by the current user

**When**: user wants to see all npm packages they own.

1. Verify login: `npm whoami`. If not logged in, prompt to login first.
2. Try the registry search API first:
   ```bash
   curl -s "https://registry.npmjs.org/-/v1/search?text=maintainer:<username>&size=<limit>"
   ```
3. If the registry API is unreachable, fall back to:
   ```bash
   npm access ls-packages
   ```
4. Sort by weekly downloads descending.
5. If `--json`: output raw JSON.
6. Otherwise output a table:

```
## <username> 的 npm 包（N 个） — YYYY-MM-DD HH:MM

| # | 包名 | 版本 | 周下载量 | 描述 |
|---|------|------|---------|------|
| 1 | ... | ... | ... | ... |
```

### deprecate — Mark a package or version as deprecated

**When**: user wants to mark a package version as deprecated (preferred over unpublish).

```bash
npm deprecate <pkg>[@version] "<message>"
```

1. Require both package name and a deprecation message.
2. Verify login: `npm whoami`.
3. Verify ownership: `npm view <pkg> maintainers --json`. Parse to confirm the current user is in the maintainers list. If not, reject with the list of current maintainers.
4. Execute the deprecate command.
5. On success, provide a link to the package page: `https://www.npmjs.com/package/<pkgName>[/v/<version>]`

### unpublish — Remove a package or version from the registry

**When**: user wants to permanently delete a package or version from npm. ⚠️ This is IRREVERSIBLE.

```bash
npm unpublish <pkg>[@version] [--force]
```

1. Require a package name.
2. Verify login: `npm whoami`.
3. Verify ownership: `npm view <pkg> maintainers --json`.
4. **BEFORE executing, always display a safety warning:**

```
⚠️  ═══════════════════════════════════════
⚠️  即将从 npm registry 删除: <target>
⚠️  包现有版本数: <N>
⚠️
⚠️  注意事项:
⚠️  - 删除后 72 小时内可联系 npm support 恢复
⚠️  - 超过 72 小时的版本删除可能被拒绝（需 --force）
⚠️  - 删除后该包名可能被他人注册
⚠️  - npm 官方建议优先使用 deprecate 而非 unpublish
⚠️  ═══════════════════════════════════════
```

5. After the warning, proceed with the unpublish.
6. `--force` is required for packages older than 72 hours.
7. On success, remind the user: `72 小时内可联系 npm support 恢复: https://www.npmjs.com/support`

## Common arguments

| Flag | Applies to | Meaning |
|------|-----------|---------|
| `--json` | search, list, info, audit, cdn, my-packages | Output raw JSON instead of tables |
| `--dev` / `-D` | install | Install as devDependency |
| `--global` / `-g` | install | Install globally |
| `--depth <N>` | list | Dependency tree depth (default 0) |
| `--limit <N>` | search, my-packages | Max results (default 20 / 100) |
| `--name <name>` | publish | Override package name |
| `--version <ver>` | publish | Override package version (default 1.0.0) |
| `--description <desc>` | publish | Package description |
| `--access public` | publish | Publish scoped package as public |
| `--dry-run` | publish | Preview without uploading |
| `--token <token>` | login | npm Access Token |
| `--force` / `-f` | unpublish | Force-delete (bypass 72h limit) |
| `-- args...` | npx | Arguments forwarded to the npx package |

## Degradation strategies

| Situation | What to do |
|-----------|------------|
| `npm` not installed | Tell the user to install Node.js: https://nodejs.org |
| npm major version < 7 | Warn: `npm 版本过旧，建议升级至 7.x+` |
| npm registry unreachable | Show the error details + direct the user to https://www.npmjs.com/ |
| Not logged in (write ops) | Prompt: `/rui-npm login --token <token>` |
| No `package.json` (install/update/uninstall/list/audit) | Prompt: `当前目录无 package.json，请先执行 npm init` |
| No `package.json` (publish directory mode) | Offer to generate one interactively |
| `npm audit` fails (no network) | Skip and note: `无网络连接，跳过安全审计` |
| deprecate/unpublish — not the owner | Show current maintainers, reject the operation |
| unpublish — package > 72h old without `--force` | Explain `--force` is needed, suggest using `deprecate` instead |
| my-packages — registry API unreachable | Fall back to `npm access ls-packages` |

## Output formatting rules

1. **Tables by default** — every list/search/info result is a markdown table. Only use `--json` when the user explicitly requests it.
2. **Chinese labels** for UI text (column headers, section titles, error messages) since the user's locale is Chinese.
3. **Timestamps** on search, list, audit, and my-packages output: `YYYY-MM-DD HH:MM` format.
4. **Mask tokens** — tokens in error/output messages show only first 4 + last 4 characters.
5. **Always show recovery paths** in error messages — never just say "error", always say what to try next.

## Help summary

When the user invokes `/rui-npm --help`, `/rui-npm -h`, or `/rui-npm help`, print this concise command overview:

```
# rui-npm — 个人 npm packages 管理器
搜索 · 安装 · 更新 · 列表 · 信息 · 卸载 · 本地发布 · npx 执行 · 安全审计 · CDN 引用 · 账号级管理

子命令:
  /rui-npm search <keyword>              按关键词搜索 npm registry
  /rui-npm install <pkg>[@version]       安装包到当前项目
  /rui-npm update <pkg>                  更新指定包
  /rui-npm list [--depth N]              列出已安装依赖
  /rui-npm info <pkg>                    查看包元数据
  /rui-npm uninstall <pkg>               卸载包
  /rui-npm publish <path>                发布本地文件/目录
  /rui-npm npx <pkg>[@version]           npx 运行包（不安装）
  /rui-npm audit                         安全漏洞审计
  /rui-npm cdn <pkg>[@version]           查看 CDN 引用地址
  /rui-npm login [--token <token>]       npm 认证
  /rui-npm my-packages [--limit N]       列出我所有的包
  /rui-npm deprecate <pkg> "<msg>"       废弃包版本
  /rui-npm unpublish <pkg> [--force]     删除包/版本

常用参数:
  --json          JSON 输出
  --dev, -D       安装为 devDependency
  --global, -g    全局安装
  --depth <N>     依赖树深度
  --limit <N>     结果数量限制
  --name <name>   指定发布包名
  --dry-run       模拟发布
  --force, -f     强制操作

使用场景:
  场景 1 — 搜索并安装:  search react → info react → install react
  场景 2 — 本地即发即用:  publish ./script.js --name my-util → npx my-util
  场景 3 — 依赖审计更新:  audit → update lodash → list
  场景 4 — 查看清理依赖:  list → info moment → uninstall moment
  场景 5 — 账号级包管理:  login --token <t> → my-packages → deprecate ... → unpublish ...

获取 Access Token: https://www.npmjs.com/settings/<user>/tokens → Generate New Token → "Automation"
```
