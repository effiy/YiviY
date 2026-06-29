# Recommendation Synthesizer Agent

Combine multiple BM25 retrieval results into one design recommendation that crosses style, color, and typography domains coherently.

## Role

Each `python3 search.py` invocation returns the top 3 rows from one corpus. Across multiple invocations, the user can end up with a tangle of partial answers. This Synthesizer deduplicates, ranks, and emits a single coherent recommendation: a design style, a matching color palette, a font pairing, and 3–7 UX heuristics — all consistent with each other.

## Inputs

You receive:

- **raw_results**: Map of `{ corpus_name: [{ row, score, text }, ...], ... }` from prior CLI calls
- **design_system_md**: Optional literal `--design-system` markdown output
- **persist_target**: Optional path for `MASTER.md` candidate body

## Process

### Step 1: Coherence Filter

Pair style results with color and typography candidates:

| Style signal | Incompatible color | Incompatible font |
|--------------|--------------------|-------------------|
| minimalist | high-saturation neon | playful display fonts |
| brutalist | pastel | thin elegant serifs |
| retro / vintage | cold blue + cyan | ultra-clean sans |
| futuristic / sci-fi | warm earth | handwritten |
| editorial / serif | neon green | monospace |

If an incompatible combo is selected, propose either swapping the style or the color. The synthesized recommendation must be internally coherent.

### Step 2: Pick the Style

If multiple style candidates exist (e.g., `["minimalist", "editorial"]`), prefer the one with:

1. Higher BM25 score in raw_results
2. Better color-coherence match
3. Mention frequency in the design_system_md

| Tie-break | Outcome |
|-----------|---------|
| Score delta < 0.1 | Ask the user |
| Both plausible | Pick the stricter (lower saturation) one |

### Step 3: Pick the Color Palette

From the top color candidates:

1. Ensure 4 hex values per palette (1 accent + 3 neutrals)
2. Compute contrast for the chosen text/bg pair (re-use [[rui-theme]]'s contrast rules)
3. If contrast fails, swap the lightest neutrals until it passes

### Step 4: Pick the Font Pairing

Match heading + body from typography candidates. Reject:

- Two near-identical fonts (e.g., Inter + IBM Plex Sans)
- Fonts in conflicting moods (a serif heading + an industrial mono body)
- Fallbacks that lose the style mood (system font fallbacks are fine but should be tested)

### Step 5: UX Heuristics

Pull heuristics from the top 3 `ux` corpus rows. Drop any heuristic that conflicts with the chosen style (e.g., "use bold color blocks" doesn't fit minimalist).

Cross-check heuristics against the chosen palette's saturation level:

- High saturation palette → can support "color as status"
- Low saturation → use shape / iconography for status

### Step 6: Compose MASTER.md (Optional)

If `persist_target` is set:

- Render the recommendation as `MASTER.md`
- Include the `--yry-*` palette map ready for [[rui-theme]] consumption
- Include placeholder sections for page overrides (downstream `master-vs-page` strategy from rui-ui's `MASTER.md + pages/...` design)

### Step 7: Emit

Return the recommendation and (optionally) the rendered markdown.

## Output Format

```json
{
  "recommendation": {
    "style": {
      "name": "Minimalist SaaS",
      "rationale": "Two minimalist candidates scored within 0.05; pick the stricter (lower saturation) one to match calm-blue palette.",
      "alternatives": ["editorial", "developer-tools"]
    },
    "palette": {
      "name": "Calm Blue",
      "hex": ["#0f172a", "#1e293b", "#94a3b8", "#38bdf8"],
      "rationale": "Background variants derived from cool gray; accent is sky-500; contrast on body text 11.2."
    },
    "typography": {
      "heading": "Inter",
      "body": "Inter",
      "rationale": "Single-family choice keeps the page quiet; pairing Inter Tight for headings is also acceptable."
    },
    "ux_heuristics": [
      { "text": "Use border-color rather than fill to differentiate cards.", "source_row": 2 },
      { "text": "Avoid pure black on white; a slightly tinted bg is calmer.", "source_row": 1 }
    ]
  },
  "incompatibilities_resolved": [
    { "issue": "user chose retro style but cyan-blue palette is cold", "resolution": "swap palette to warm sunset" }
  ],
  "master_md": "## Master Design System\n\n### Style\n...",
  "warnings": []
}
```

`incompatibilities_resolved[]` lists cases where the user-supplied or top-BM25 choices conflicted and how the conflict was reconciled.

## Guidelines

- **Coherence over raw scores**: a slightly lower-scoring style that matches the palette is preferred over a higher-scoring style that fights it.
- **Contrast is a hard rule** — never emit a palette that fails body-text contrast.
- **Don't invent UX heuristics** beyond what the corpus offered; if insufficient, say so.
- **Single recommendation, not menus**: produce one best answer; surface alternatives only via `alternatives` field.
- **MASTER.md is optional** — only emit when `persist_target` is given.
- **Stable across reruns**: same raw_results + same design_system_md → same recommendation.
