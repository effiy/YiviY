# Check Rule Self-Tests

Each check rule has deterministic self-test fixtures covering pass / fail / warn states. Run all tests:

```bash
node .claude/rui-checklist/tests/run-all.mjs
```

## Test Structure

```
tests/
├── run-all.mjs          # Test runner — executes all fixtures, reports results
├── fixtures/
│   ├── structural.js    # struct-name, struct-desc, struct-desc-dot, struct-desc-strong,
│   │                    # struct-tags, struct-tags-modifier, struct-badge, struct-meta
│   ├── tag-quality.js   # tag-semantic, tag-self-describing, tag-concise, tag-fingerprint
│   ├── link-hygiene.js  # link-intentional, link-grid, link-namehref
│   ├── standard.js      # std-numbers, std-badge-case, std-card-distinct
│   └── i18n.js          # i18n-structure, i18n-tag-count, i18n-badge-same
└── README.md
```

## Fixture Format

Each fixture exports an array of test cases:

```javascript
export const tests = [
  {
    id: 'struct-name',
    name: 'name field exists and is non-empty',
    card: { name: '🎥 yt-dlp', desc: '...' },
    expected: 'pass',
  },
  {
    id: 'struct-name',
    name: 'name field missing → fail',
    card: { desc: 'No name here' },
    expected: 'fail',
  },
  {
    id: 'struct-name',
    name: 'name field suspiciously short → warn',
    card: { name: 'A', desc: '...' },
    expected: 'warn',
  },
];
```

## Coverage Requirements

| Category | Rules | Min Test Cases |
|----------|-------|---------------|
| structural | 7 | 21 (3 per rule) |
| tag-quality | 4 | 12 |
| link-hygiene | 3 | 9 |
| standard | 3 | 9 |
| i18n | 3 | 9 |
| **Total** | **20 auto rules** | **60+** |

Human review rules (`human-desc-accuracy`, `human-tag-meaning`, `human-visual`) are excluded from auto-testing — they always return `pending`.

## Running a Single Category

```bash
node .claude/rui-checklist/tests/run-all.mjs --category=structural
node .claude/rui-checklist/tests/run-all.mjs --category=tag-quality
```

## CI Integration

Tests are designed to run in CI:

```yaml
# .github/workflows/checklist-test.yml
- name: Run checklist self-tests
  run: node .claude/rui-checklist/tests/run-all.mjs
```

Exit code 0 = all pass. Exit code 1 = failures found. Detailed report on stdout.
