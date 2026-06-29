# rui-skill · Templates

创建与评估技能所需的脚手架。

| 模板 | 用途 |
|------|------|
| `SKILL.md`         | SKILL.md 骨架（含 frontmatter + 章节占位） |
| `help.mjs`         | 帮助文本（技能概述、核心参数、特性演示）— **每个技能必需** |
| `evals.json`       | 评估用例 JSON（含断言） |
| `agents-grader.md` | 评分代理指令（写入 `grading.json`） |
| `agents-analyzer.md` | 分析代理指令（识别失败模式） |

## 用法

```bash
# 1. 复制 SKILL.md 骨架
cp .claude/rui-skill/templates/SKILL.md .claude/my-skill/SKILL.md

# 2. 生成 help.mjs（必需）
cp .claude/rui-skill/templates/help.mjs .claude/my-skill/help.mjs
# 编辑占位符：{{SKILL_NAME}}、{{SKILL_TITLE}}、{{TAGLINE}} 等

# 3. 编写 evals
cp .claude/rui-skill/templates/evals.json .claude/my-skill/evals/evals.json
# 编辑 prompts + assertions

# 4. 运行评估
python -m scripts.run_eval --target-skill my-skill

# 5. （可选）调用 grader/analyzer 模板生成的代理
```

### help.mjs 结构

每个技能的 `help.mjs` 必须包含以下章节：

| 章节 | 函数 | 内容 |
|------|------|------|
| 标题 | `bold("# skill-name — 标题")` | 技能名 + 一句话标题 |
| 副标题 | `dim("...")` | 核心能力标签行 |
| 快速入门 | `hdr("快速入门")` + `item(...)` | 2–4 条最常用命令 |
| 可执行入口 | `hdr("可执行入口: ...")` | 入口脚本路径 |
| 核心参数 | `subhdr("核心参数")` + `item(...)` | 所有 CLI 参数及说明 |
| 核心特性演示 | `hdr("核心特性演示")` + `scene(...)` + `item(...)` | 2–4 个典型使用场景，每个场景展示完整操作序列 |

导入依赖：
```js
import { bold, dim, cyan } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';
```

`-- 用法: node .claude/<skill-name>/help.mjs`