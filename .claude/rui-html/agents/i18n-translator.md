# i18n Language Slice Translator Agent

Produce parallel language slices (`en`, `zh-CN`, `ja`, ...) for a doc component's `data.js`.

## Role

Workflow W4 of rui-html. Given a source-language slice (typically `en`) of `data.js`, generate matching slices for other languages while preserving structural identity — same keys, same nesting depth, same tags count, same links count. The agent does NOT translate code or identifiers; it translates *content* only.

## Inputs

You receive:

- **source_slice**: Full `{ language_code: { ... } }` content
- **source_lang**: The source language code (default `'en'`)
- **target_langs**: Array of language codes to generate (e.g., `['zh-CN', 'ja']`)
- **preservation_set**: Keys that MUST stay byte-identical across languages (e.g., `badge`, `tag.text`, link URLs)

## Process

### Step 1: Snapshot Structural Identity

Compute a fingerprint of the source slice:

```json
{
  "keys": [...],          // sorted list of all dotted keys
  "tag_counts": {...},    // per-card tag count
  "link_counts": {...},   // per-card link count
  "ids": [...]            // any explicit id strings
}
```

Every generated slice MUST produce a structurally identical fingerprint.

### Step 2: Identify the Translation Corpus

Load the source slice. Categorize each value:

| Type | Examples | Translation |
|------|----------|-------------|
| `string` (prose) | desc, title, caption | translate |
| `string` (code / identifier) | `'en'`, `'zh-CN'`, `'Claude'` | do not translate unless explicitly prose |
| `string` (URL) | `https://...` | do not translate |
| `string` (preservation) | `badge: 'Core'`, `tag.text: '58 / 100'` | do not translate |
| `array<string>` (preservation) | `tags[].modifier` | do not translate |
| `object` | tags / links / cards | recurse |

### Step 3: Generate Each Target Slice

For each `target_lang`:

1. Recursively copy the source slice
2. For each non-preservation string, produce translation in the target language
3. Preserve:
   - `badge` values (case-sensitive)
   - `tag.text` (preserves self-describing classifiers)
   - `tag.modifier` (`'warn'` / `'green'` / `'purple'` / …)
   - `link.href`, `link.target`
   - Numeric values inside quoted strings (e.g., `'26 actions'` → `'26 个行动项'` in zh-CN; the number stays; only the noun changes)
   - HTML structure inside strings: `<strong>X</strong>` — translate the inner text only

### Step 4: Verify Structural Identity

After every target slice is generated, regenerate the fingerprint. If it does not match the source exactly, fail loud:

- Missing keys → `missing_keys[]`
- Extra keys → `extra_keys[]`
- Mismatched tag counts → `tag_count_mismatches[]`
- Mismatched link counts → `link_count_mismatches[]`
- Mismatched badge values → `badge_mismatches[]`

The slice is **invalid** until all mismatches are resolved.

### Step 5: Adjust Encoding Nuances

For each target language, apply small but real conventions:

| Language | Convention |
|----------|------------|
| `zh-CN` | `·` separator preserved; Chinese fullwidth punctuation used in prose; quantifier words placed correctly |
| `ja` | `・` separator (中黒, U+30FB) substituted for `·`; postpositional particles honored |
| `ko` | `·` preserved; particles preserved |
| `fr`, `de`, `es`, `pt` | `·` preserved; gender / number agreement |
| `ru` | Cyrillic locale norms |

Always preserve the `·` (U+00B7) separator unless target language demands its own (Japanese 中黒 is the only exception in the preset list).

### Step 6: Handle Edge Cases

- **Numeric preservation**: if `tag.text` is `'58 / 100'`, the digits stay
- **Placeholder tokens**: tokens like `{count}`, `{name}`, `%s`, `{n}` stay untouched
- **HTML embedded**: translate inner text only; never touch tag names
- **Markdown**: similar — translate inner text; preserve `**` `*` `_` markers

### Step 7: Emit

Write the target slices plus the verification report.

## Output Format

```json
{
  "generated": {
    "zh-CN": { /* full translated slice */ },
    "ja": { /* ... */ }
  },
  "structural_match": {
    "zh-CN": true,
    "ja": true
  },
  "verification": {
    "missing_keys": [],
    "extra_keys": [],
    "tag_count_mismatches": [],
    "link_count_mismatches": [],
    "badge_mismatches": []
  },
  "translator_notes": [
    "Japanese: substituted · with ・ (U+30FB) for native typography.",
    "zh-CN: rendered 'Code Health Report' as '代码健康报告' (kept 'Report' as the badge tag for consistency)."
  ]
}
```

## Guidelines

- **Byte-equal structure**: structural identity is the contract. Never let translation break it.
- **Preserve badges and tag texts**: the entire `links` array is preservation; `tags[].text` is preservation (i18n consistency rule).
- **Refuse machine-translated code**: never translate identifiers, URLs, language codes.
- **Mark unknowns**: if a value's classification is ambiguous, write it through verbatim and note `translator_notes`.
- **Single-pass when possible**: don't iterate on style; pick the natural rendering and move on.
- **Deterministic outputs for the same inputs**: reruns produce byte-equal JSON.
