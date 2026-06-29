---
name: rui-theme
description: Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.
license: Complete terms in LICENSE.txt
lifecycle: default-pipeline
---


# Rui Theme Skill

This skill provides a curated collection of professional font and color themes themes, each with carefully selected color palettes and font pairings. Once a theme is chosen, it can be applied to any artifact.

## Purpose

To apply consistent, professional styling to presentation slide decks, use this skill. Each theme includes:
- A cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- A distinct visual identity suitable for different contexts and audiences

## Usage Instructions

To apply styling to a slide deck or other artifact:

1. **Show the theme showcase**: Display the `theme-showcase.pdf` file to allow users to see all available themes visually. Do not make any modifications to it; simply show the file for viewing.
2. **Ask for their choice**: Ask which theme to apply to the deck
3. **Wait for selection**: Get explicit confirmation about the chosen theme
4. **Apply the theme**: Once a theme has been chosen, apply the selected theme's colors and fonts to the deck/artifact

## Themes Available

The following 10 themes are available, each showcased in `theme-showcase.pdf`:

1. **Ocean Depths** - Professional and calming maritime theme
2. **Sunset Boulevard** - Warm and vibrant sunset colors
3. **Forest Canopy** - Natural and grounded earth tones
4. **Modern Minimalist** - Clean and contemporary grayscale
5. **Golden Hour** - Rich and warm autumnal palette
6. **Arctic Frost** - Cool and crisp winter-inspired theme
7. **Desert Rose** - Soft and sophisticated dusty tones
8. **Tech Innovation** - Bold and modern tech aesthetic
9. **Botanical Garden** - Fresh and organic garden colors
10. **Midnight Galaxy** - Dramatic and cosmic deep tones

## Theme Details

Each theme is defined in the `themes/` directory with complete specifications including:
- Cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- Distinct visual identity suitable for different contexts and audiences

## Application Process

After a preferred theme is selected:
1. Read the corresponding theme file from the `themes/` directory
2. Apply the specified colors and fonts consistently throughout the deck
3. Ensure proper contrast and readability
4. Maintain the theme's visual identity across all slides

## Create your Own Theme
To handle cases where none of the existing themes work for an artifact, create a custom theme. Based on provided inputs, generate a new theme similar to the ones above. Give the theme a similar name describing what the font/color combinations represent. Use any basic description provided to choose appropriate colors/fonts. After generating the theme, show it for review and verification. Following that, apply the theme as described above.

## 规则

- [token-contracts.md](./rules/token-contracts.md) — 10 套预设主题、自定义主题生成、`--yry-*` token 权威命名与所有权边界。

## 专业代理

- [palette-generator.md](./agents/palette-generator.md) — 自然语言描述 → 12 步色板 + 字体配对。
- [contrast-checker.md](./agents/contrast-checker.md) — 部署前 WCAG 对比度与状态色辨识度审计。

## Borders

### What this skill does

- Select one of 10 preset themes (`themes/<name>.md`) or generate a custom one via `scripts/generate-theme.py`
- Emit a `<name>.css` defining the canonical `--yry-*` token set (or output the tokens to stdout)
- Provide hex values, font pairings, and usage heuristics for each preset

### What this skill does NOT do

- **Inject CSS into pages** — page mounting is the caller's responsibility ([rui-html](../rui-html/SKILL.md), [rui-demos](../rui-demos/SKILL.md), [rui-diagram](../rui-diagram/SKILL.md), [rui-graph](../rui-graph/SKILL.md))
- **Maintain token names** — the `--yry-*` token set is fixed; this skill fills values, never renames
- **Replace [[rui-ui]] design intelligence** — rui-ui does BM25 search over a broader corpus; rui-theme is the authoritative color/font source
- **Provide dark/light toggle** — themes are full presets; per-page dark-mode toggling is out of scope

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-html]] | calls → rui-theme | `[IF-006](../INTERFACES.md#if-006)` |
| [[rui-demos]] | calls → rui-theme | `[IF-002](../INTERFACES.md#if-002)` |
| [[rui-graph]] | calls → rui-theme | `[IF-009](../INTERFACES.md#if-009)` |
| [[rui-diagram]] | consumes | references/themes mention rui-theme (color palette source) |

### Output ownership

| Path | Permission |
|------|-----------|
| `<this-skill-dir>/themes/` | read+write (owned — preset definitions) |
| `<this-skill-dir>/scripts/generate-theme.py` | read+write (owned) |
| `cdn/theme/<name>.css` | consumed by pages; rui-theme produces, pages reference |
| Theme CSS in any page | read-only from rui-theme's perspective |

### Invocation

Entry script lives alongside this SKILL.md:

```bash
python3 <this-skill-dir>/scripts/generate-theme.py "<description>" [-o output.css]
```

`<this-skill-dir>` is the directory containing this SKILL.md (typically `.claude/rui-theme/`).
