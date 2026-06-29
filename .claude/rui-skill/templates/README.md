# rui-skill · Templates

创建与评估技能所需的脚手架。

| 模板 | 用途 |
|------|------|
| `SKILL.md`         | SKILL.md 骨架（含 frontmatter + 章节占位） |
| `evals.json`       | 评估用例 JSON（含断言） |
| `agents-grader.md` | 评分代理指令（写入 `grading.json`） |
| `agents-analyzer.md` | 分析代理指令（识别失败模式） |

## 用法

```bash
# 1. 复制 SKILL.md 骨架
cp .claude/rui-skill/templates/SKILL.md .claude/my-skill/SKILL.md

# 2. 编写 evals
cp .claude/rui-skill/templates/evals.json .claude/my-skill/evals/evals.json
# 编辑 prompts + assertions

# 3. 运行评估
python -m scripts.run_eval --target-skill my-skill

# 4. （可选）调用 grader/analyzer 模板生成的代理
```