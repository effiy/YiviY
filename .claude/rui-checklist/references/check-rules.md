# Check Rules Reference

Detailed pass/fail/warn conditions for every automated check. Used by rui-checklist when analyzing scene card data.

## How Checks Work

Each check examines ONE card at a time (except fingerprint and i18n checks which compare across cards). Every check returns:

- `id` — stable identifier, same across all cards
- `category` — grouping: `structural`, `tag-quality`, `link-hygiene`, `standard`, `i18n`
- `label` — human description (localized)
- `status` — `pass` | `fail` | `warn` | `pending`
- `evidence` — brief string (max 80 chars) with specific finding

**Pass**: check condition is fully met.
**Fail**: check condition is clearly violated.
**Warn**: check condition is partially met OR the heuristic is uncertain (e.g., "tags present but only 1 — minimum is 2").
**Pending**: requires human judgment (always use this for subjective checks).

---

## Category: Structural Completeness

### `struct-name`

**What**: Card has a non-empty `name` field.

**Pass**: `name` is a string with length > 0.
**Fail**: `name` is missing, null, undefined, or empty string.
**Warn**: `name` exists but is unusually short (1 char) or unusually long (>80 chars).
**Evidence**: `"🎥 yt-dlp"` (show actual name, truncated to 40 chars).

### `struct-desc`

**What**: Card has a non-empty `desc` field.

**Pass**: `desc` is a string with length > 0.
**Fail**: `desc` is missing, null, undefined, or empty string.
**Warn**: `desc` exists but is very short (<20 chars) — may lack detail.
**Evidence**: `"21 chars, starts with 'YouTube video...'"`.

### `struct-desc-dot`

**What**: `desc` uses `·` (U+00B7 middle dot) as separator between features, not commas.

**Pass**: `desc` contains at least one `·` character AND does NOT contain commas between feature clauses (commas inside `<strong>`, `<code>`, or numeric values are fine).
**Fail**: `desc` has no `·` character. OR `desc` uses `,` or `、` as primary separators.
**Warn**: `desc` uses `·` but also has suspicious comma usage.
**Evidence**: `"found 3 · separators, 0 comma-separators"` or `"no · found; uses ', ' as separator"`.

**Heuristic for "comma-separator"**: look for `", "` or `"，"` (Chinese comma) patterns that are NOT inside HTML tags like `<strong>` or `<code>`. Split desc by `·` first — if the result is a single segment, count the desc as using commas if there are 2+ comma occurrences.

### `struct-desc-strong`

**What**: `desc` includes at least one `<strong>` tag for the key takeaway. Required for Rich and Standard tier cards.

**Pass**: `desc` contains at least one `<strong>...</strong>` pair.
**Fail**: No `<strong>` tag in `desc`.
**Warn**: Has `<strong>` but it wraps an empty or trivially short string (<3 chars).
**Evidence**: `"1 <strong> found: '26 improvements'"` or `"no <strong> in desc"`.

### `struct-tags`

**What**: Card has 2-4 tags. Tags give at-a-glance classification.

**Pass**: `tags` is an array with length 2, 3, or 4.
**Fail**: `tags` is missing, null, undefined, or empty.
**Warn**: `tags` has only 1 item (borderline — suggest adding more) or 5+ items (overkill).
**Evidence**: `"3 tags: 58/100, 7 dimensions, 26 actions"` or `"tags is null"`.

### `struct-tags-modifier`

**What**: Every tag has a semantic modifier that matches the tag's meaning. Not all tags should use `info`.

**Pass**: Every tag has a `modifier` field with a valid value (`info`, `accent`, `warn`, `red`, `purple`, `cyan`, `green`, `pass`). AND at least one tag uses a non-`info` modifier (unless all 2 tags are genuinely neutral).
**Fail**: A tag is missing `modifier` field. OR modifier value is not in the valid set.
**Warn**: All tags use `info` modifier — suggests tags weren't given semantic consideration. Exception: if only 2 tags and both are truly neutral (e.g., `'Python'`, `'Streamlit'`), this is a pass.
**Evidence**: `"3/3 tags have modifiers: warn, info, cyan"` or `"all 3 tags use 'info' — consider semantic modifiers"`.

### `struct-badge`

**What**: `badge` is a type classifier when used — uppercase-start, one word, scannable. Not every card needs a badge.

**Pass**: `badge` is absent (not needed), OR `badge` is a string that starts with uppercase and is <= 15 chars.
**Fail**: `badge` starts with lowercase. OR `badge` is > 30 chars (not a classifier).
**Warn**: `badge` starts with uppercase but contains spaces (multi-word — unusual for a badge).
**Evidence**: `"badge: 'Core' (valid)"` or `"no badge (acceptable)"` or `"badge: 'new feature!' starts lowercase"`.

### `struct-meta`

**What**: Rich tier cards should have `meta` for provenance (dates, versions, contexts).

**Pass**: `meta` is present as a non-empty string, OR card is Standard/Nav tier (badge absent or not `'Report'`).
**Fail**: Card has `badge: 'Report'` (Rich tier marker) but `meta` is missing.
**Warn**: Card has other Rich-tier signals (3+ tags, quantified desc, nameHref) but no `meta` — might benefit from provenance.
**Evidence**: `"meta: 'Assessment date 2026-06-28'"` or `"Rich tier card (badge: Report) missing meta"`.

---

## Category: Tag Quality

### `tag-semantic`

**What**: Tag modifier matches the tag's semantic meaning. Scores should use `warn`/`green`/`red`; counts should use `cyan`; methodology should use `purple`; highlighted features should use `accent`.

**Pass**: At least 50% of tags have modifiers that match their text semantics.
**Fail**: More than 50% of tags have mismatched modifier-vs-meaning.
**Warn**: 1-2 tags have questionable modifier choices.

**Semantic detection heuristics** (check tag text):
| Pattern | Expected Modifier | Regex Hint |
|---------|------------------|------------|
| Score (e.g., "58 / 100", "7.5/10", "95%") | `warn`, `green`, or `red` | `/\d+\s*\/\s*\d+/`, `/\d+%$/` |
| Count (e.g., "26 actions", "7 dimensions", "10 items") | `cyan` or `info` | `/^\d+\s+\w+/` |
| Methodology (e.g., "ATAM", "TDD", "AI-driven") | `purple` | all-caps acronyms, or contains "driven"/"based" |
| Language/Tech (e.g., "Python", "Streamlit") | `info` | single tech name |
| Status/Quality (e.g., "Verified", "Beta") | `green` (positive) or `accent` (neutral) | single adjective |
| Risk/Issue (e.g., "3 critical", "Known bugs") | `red` | contains "critical", "bug", "issue", "risk" |

**Evidence**: `"2/3 modifiers match semantics; '7 dimensions' uses info but suggests cyan (count)"` or `"all modifiers match semantics"`.

### `tag-self-describing`

**What**: Tags describe the card, not instruct the viewer. "7 dimensions" not "View details".

**Pass**: No tag text matches instructional patterns.
**Fail**: Any tag contains instructional phrases.
**Warn**: Tag text is ambiguous between self-describing and instructional.

**Instructional patterns to detect** (case-insensitive, also check Chinese):
- `view`, `click`, `learn`, `read`, `see`, `go to`
- `查看`, `点击`, `了解更多`, `阅读`, `详情`, `进入`
- `check`, `explore`, `discover`, `find out`
- `download`, `install`, `try`, `get started`

**Evidence**: `"tag 'View details' is instructional — suggest '7 dimensions'"` or `"all tags are self-describing"`.

### `tag-concise`

**What**: Tag text is concise — 2 to 20 characters.

**Pass**: Every tag `text` is between 2 and 20 characters.
**Fail**: Any tag is <2 chars (too short to be meaningful) or >30 chars (not a tag, more like a sentence).
**Warn**: Any tag is 21-30 chars (a bit long for a tag chip).
**Evidence**: `"tag lengths: 9, 13, 10 — all within 2-20"` or `"tag 'this is a very long tag description' is 37 chars"`.

### `tag-fingerprint`

**What**: No two cards in the same grid have identical tag configurations. Each card should have a distinct tag "fingerprint."

**Pass**: Card's set of tag `text` values (sorted) is unique among all cards in the same array.
**Fail**: Another card has the exact same set of tag texts.
**Evidence**: `"unique tag set"` or `"tag set duplicates card 'TTS Config' at index 5"`.

---

## Category: Link Hygiene

### `link-intentional`

**What**: `links` field shows intentional configuration — not accidentally omitted.

**Pass**: `links` is one of: `null` (use defaults), `[]` (intentionally hidden), or a non-empty array (custom).
**Fail**: `links` field exists but is `undefined` or an invalid type (string, number).
**Warn**: `links` is an empty array `[]` on a Rich-tier card that would benefit from navigation links.
**Evidence**: `"links: null (using defaults)"` or `"links: [] (hidden)"` or `"links: 3 custom items"`.

### `link-grid`

**What**: Feature grid cards should not duplicate the full 7-link default set. Use `links: null` or `links: []` for grid cards.

**Pass**: If card is part of a grid (3+ cards in the same array), `links` is NOT a 7-item array that matches the default link set. OR card is standalone/small group (<3 cards).
**Fail**: Card is in a grid AND has exactly 7+ links that appear to be the default set (contains 清单/架构/图谱/源码/测试/演示/审查 or the English equivalents).
**Warn**: Card is in a grid with 4+ custom links — consider if all are needed.
**Evidence**: `"grid card, links: [] — clean"` or `"grid card with 7 default links — should use links: null instead"`.

**Detection**: Compare link labels against the known default set: `['清单', '架构', '图谱', '测试', '源码', '演示', '审查']` or `['Checklist', 'Architecture', 'Graph', 'Test', 'Source', 'Demo', 'Review']`.

### `link-namehref`

**What**: If card has `nameHref`, the `nameTarget` should be set appropriately.

**Pass**: `nameHref` is absent, OR (`nameHref` present AND `nameTarget` is explicitly set to `''` or `'_blank'`).
**Fail**: `nameHref` is a same-site path (starts with `views/`, `components/`, `#`, `./`, `../`) but `nameTarget` is not `''` — external link behavior on internal page.
**Warn**: `nameHref` is external (starts with `http`) but `nameTarget` is `''` — opens external site in same window.
**Evidence**: `"nameHref: 'views/report/', nameTarget: '' — correct"` or `"nameHref is external but nameTarget is '' — consider _blank"`.

---

## Category: Standard Compliance

### `std-numbers`

**What**: Card descriptions use specific numbers, not vague qualifiers.

**Pass**: `desc` contains at least one digit (0-9).
**Fail**: `desc` has zero digits — likely uses vague language.
**Evidence**: `"found 4 digits in desc"` or `"no digits in desc — vague ('multiple', 'several')"`.

### `std-badge-case`

**What**: Badge is uppercase-start (title case for single word, Start Case for acronyms).

**Pass**: `badge` is absent, OR `badge[0]` is uppercase.
**Fail**: `badge[0]` is lowercase.
**Evidence**: `"badge: 'Core' — correct case"` or `"badge: 'new' — should be 'New'"`.

### `std-card-distinct`

**What**: Each card has at least one distinguishing feature — its `desc` or `name` should differ meaningfully from every other card.

**Pass**: Card differs from ALL other cards in at least one of: `name`, `desc` (first 60 chars), `badge`.
**Fail**: Another card has identical `name` AND identical `desc` (first 60 chars).
**Warn**: Card's `desc` first 60 chars matches another card (possible copy-paste with minor edits).
**Evidence**: `"distinct from all other cards"` or `"desc first 60 chars matches card 'TTS Config'"`.

---

## Category: i18n Consistency

Only apply these checks when the data.js has multiple language keys (`en`, `zh-CN`, etc.).

### `i18n-structure`

**What**: All language slices have identical object structure (same keys at same nesting levels).

**Pass**: `Object.keys(config.en)` sorted equals `Object.keys(config['zh-CN'])` sorted, and the same for card arrays within each slice.
**Fail**: Language slices have different keys at the top level, OR card arrays have different lengths across languages.
**Warn**: Keys match but nested structures differ (e.g., one language has `overview.features[3].meta` and another doesn't).
**Evidence**: `"en and zh-CN have identical structure"` or `"zh-CN missing 'overview.features' key"`.

### `i18n-tag-count`

**What**: Each card should have the same number of tags in every language.

**Pass**: For every card, `tags.length` is identical across all languages.
**Fail**: Tag count differs for any card across languages.
**Evidence**: `"yt-dlp: 3 tags in en, 3 in zh-CN — consistent"` or `"WhisperX: 2 tags in en, 3 in zh-CN — mismatch"`.

### `i18n-badge-same`

**What**: Badges are type classifiers and should NOT be translated — same value across languages.

**Pass**: For every card that has a badge, the `badge` value is identical across all languages.
**Fail**: Badge differs across languages (e.g., `'Core'` in en but `'核心'` in zh-CN).
**Evidence**: `"all badges consistent across languages"` or `"badge 'Core' translated to '核心' in zh-CN — should stay 'Core'"`.

---

## Category: Human Review (always `pending`)

These checks require domain knowledge or visual inspection. Auto-grade them as `pending` with a note for the reviewer.

### `human-desc-accuracy`

**What**: Does the description accurately reflect what the card is about? Is the `<strong>` on the right takeaway?

**Status**: Always `pending`.
**Evidence**: `"Review: does 'YouTube video download via yt-dlp · <strong>1,200+ sites</strong>' accurately describe the yt-dlp feature?"`.

### `human-tag-meaning`

**What**: Do the tag labels actually describe the card well? Are there missing dimensions that should be tagged?

**Status**: Always `pending`.
**Evidence**: `"Review: are tags ['Python', 'Streamlit', 'AI/ML'] the right classifiers for this card?"`.

### `human-visual`

**What**: Does the card render correctly? Are there layout issues, truncated text, or contrast problems?

**Status**: Always `pending`.
**Evidence**: `"Open the page containing this card and verify visual rendering"`.

---

## Check Application Logic

### Which cards get which checks?

| Card Tier | Required Checks |
|-----------|----------------|
| Rich (has `badge: 'Report'` or 3+ tags + meta + nameHref) | All structural, all tag quality, all link hygiene, all standard, all i18n (if multi-lang), all human |
| Standard (has tags with modifiers, desc with `·` + `<strong>`) | All structural, all tag quality, all link hygiene, all standard, i18n (if multi-lang), all human |
| Nav (has `nameHref` + `nameTarget`) | struct-name, struct-desc, struct-desc-dot, link-namehref, std-card-distinct, human-desc-accuracy |

### Tier Detection

To determine a card's tier, check in this order:
1. Has `badge: 'Report'` OR (`tags.length >= 3` AND `meta` present AND `nameHref` present) → **Rich**
2. Has `tags` with modifiers AND `desc` with `·` → **Standard**
3. Has `nameHref` + `nameTarget` → **Nav**
4. Fallback → **Standard** (apply full checks — flag issues as warns instead of fails where uncertain)

### Evidence Format

Evidence strings should be:
- **Concise**: max 80 characters
- **Specific**: include actual values, not just interpretations
- **Actionable**: tell the reviewer what to look at
- **Consistent**: use the same format for the same check across cards

Bad: `"looks good"`
Good: `"3 · separators, 1 <strong>: '26 improvements'"`
Bad: `"tags are wrong"`
Good: `"tag 'View details' is instructional; suggest a classifier like '7 dimensions'"`
