# Evidence Tracer Agent

Surface the supporting text inside a card's data.js so each checklist item points to its source.

## Role

rui-checklist emits per-card `checks[]` items with an `evidence` string. Most auto-graders fill that string from structural data ("`desc` contains 3 · separators"). For semantic checks (e.g., "tag text is descriptive") the evidence needs to come from the raw card source — the original `name`, `desc`, `tags`, `badge`, `meta`. This agent extracts the relevant slice of the source for each check, normalized so the grader cannot confuse what was looked at.

## Inputs

You receive:

- **source_path**: Absolute path to the original `data.js` (e.g., `docs/components/<scene>/data.js`)
- **card_source_key**: Dotted path to the card, e.g. `en.overview.features[0]`
- **check_id**: One of the structural / tag / link / standard check IDs from `references/check-rules.md`

## Process

### Step 1: Resolve the Card Slice

Walk the path components. For each component:

| Pattern | Action |
|---------|--------|
| `en` / `zh-CN` / `ja` | Language slice key; record the active language |
| Number in `[N]` | Array index — fetch via bracket access |
| Bare identifier | Object key — fetch via dotted access |

If any step fails, return `{ error: "path_unresolved", detail: "<component>" }`.

### Step 2: Project the Card Fields

Emit only the fields the check rules need. The default projection is:

```javascript
{
  name, desc, badge, tags, meta, links, nameHref, nameTarget, demo
}
```

Strip `_meta`, `*_internal`, or any field starting with `_` — those are not for review.

### Step 3: Slice by Check Family

For each `check_id`, produce a focused evidence object:

| Check Family | Sliced Fields |
|--------------|---------------|
| `struct-*` | The specific field under check (`name`, `desc`, `tags`, `badge`, `meta`) |
| `tag-*` | The full `tags` array, plus modifier mapping table |
| `link-*` | `links` (or its absence), `nameHref`, `nameTarget` |
| `std-*` | `desc`, `name`, `badge` |
| `i18n-*` | The card sliced from every language present |

### Step 4: Compute Derived Counts

When the check requires a count (e.g., "tags length is 2-4"):

```javascript
{
  derived: {
    tags_length: <n>,
    desc_char_count: <n>,
    middle_dot_count: <n>,
    strong_tag_count: <n>,
    digits_present: <bool>,
  }
}
```

These derived values are computed deterministically from the projection — never eyeballed.

### Step 5: Cite Source Location

Record the path + line range where the slice was read, so the reviewer can `Cmd+P` to it:

```
source_path + ":" + line_range_start + "-" + line_range_end
```

If the source is minified or single-line, return `line_range: "minified"`.

## Output Format

```json
{
  "source_path": "docs/components/intro/data.js",
  "language": "en",
  "card_source_key": "en.overview.features[3]",
  "card": {
    "name": "Code Health Report",
    "desc": "7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap",
    "tags": [
      { "text": "58 / 100", "modifier": "warn" },
      { "text": "7 dimensions", "modifier": "info" },
      { "text": "26 actions", "modifier": "cyan" }
    ],
    "badge": "Report",
    "meta": "Assessment date 2026-06-28 · Technical Due Diligence",
    "nameHref": "views/health-report/index.html",
    "nameTarget": "",
    "links": null
  },
  "derived": {
    "tags_length": 3,
    "desc_char_count": 142,
    "middle_dot_count": 3,
    "strong_tag_count": 1,
    "digits_present": true
  },
  "source_range": "docs/components/intro/data.js:L42-L58",
  "for_check_id": "tag-fingerprint"
}
```

When `for_check_id` is set, the projection can be narrower (only the fields the check reads). When omitted, return the full projection.

## Guidelines

- **Never mutate** the source file — read-only access.
- **Never assume** the card's location — if the path resolves with missing segments, return `path_unresolved`.
- **Counts are real**: `middle_dot_count` is computed by counting the literal `·` character (U+00B7), not by guessing.
- **Output is JSON-only**: no Markdown wrappers; downstream tools consume it directly.
- **Single-language by default**: if the caller passes a `language`, project only that slice. If they pass no language and the source is multi-language, project `en` and note `language_fallback: "en"`.
