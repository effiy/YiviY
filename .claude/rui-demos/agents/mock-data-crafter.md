# Mock Data Crafter Agent

Generate client-side mock data that brings a demo card to life without any network calls.

## Role

Sits between Phase 3 (Content) of the rui-demos pipeline and the demo's `data.js`. The crafter produces `window.DEMO_MOCK_DATA` payloads that satisfy the demo type's required shape, run deterministically on reload, and respect the project-rule "no `fetch()` to a real endpoint". When type-specific guidance from `references/demo-types.md` is supplied, the crafter follows it; otherwise it falls back to the type templates defined here.

## Inputs

You receive:

- **demo_type**: One of A / B / C / D / E / F (the verdict from `type-classifier.md`)
- **card**: The originating `YrySceneCard` props
- **scene_name**: The scene directory name (e.g., `intro`, `tools`)
- **seed**: Optional deterministic seed; defaults to card name hash

## Process

### Step 1: Pick the Type Template

Match the demo type to the template table below; otherwise read `references/demo-types.md`.

### Step 2: Generate Seeded Determinism

Implement a small string-hash → integer (32-bit) function and use it for any random choices. Persist the seed in `_meta.mockSeed` so the same card produces the same mock data across reloads.

### Step 3: Build the Mock by Type

#### Type A — Tool Interface

```javascript
{
  inputs: {
    url: '',
    format: 'mp4',
    quality: 'best',
  },
  processing: { stage: 0, label: 'Idle' },
  output: {
    title: '<mock title derived from card.name>',
    formats: ['mp4', 'webm', 'mkv'],
    subtitles: ['en', 'zh-CN'],
    thumbnailGradient: 'linear-gradient(135deg, #1f2937, #0f172a)',
  },
  history: [],
}
```

Pre-populate `history` with 1–2 fake past runs to demonstrate state.

#### Type B — Pipeline

```javascript
{
  steps: [
    { id: 's1', label: 'Detect', status: 'done' },
    { id: 's2', label: 'Split', status: 'active' },
    { id: 's3', label: 'Translate', status: 'pending' },
    { id: 's4', label: 'Render', status: 'pending' },
  ],
  sample: 'The pipeline demonstrates sentence-boundary handling for the demo card.',
  timings: { 's1': 120, 's2': 80, 's3': 0, 's4': 0 },
}
```

Adjust step count to 3–6 based on card density. Set `status` deterministically by `seed`.

#### Type C — Comparison

```javascript
{
  variants: [
    { id: 'v1', label: 'Variant A', metrics: { score: 92, latency: 1.2 } },
    { id: 'v2', label: 'Variant B', metrics: { score: 87, latency: 0.9 } },
    { id: 'v3', label: 'Variant C', metrics: { score: 95, latency: 1.5 } },
  ],
  activeVariant: 'v2',
  criteria: ['Score', 'Latency', 'Cost'],
}
```

The number of variants equals the count parsed from any tag like `"6 engines"` or `"4 languages"`; default to 3.

#### Type D — State Machine

```javascript
{
  states: ['Idle', 'Downloading', 'Processing', 'Done', 'Failed'],
  current: 'Idle',
  transitions: [
    { from: 'Idle', to: 'Downloading', trigger: 'start' },
    { from: 'Downloading', to: 'Processing', trigger: 'fetched' },
    { from: 'Processing', to: 'Done', trigger: 'success' },
    { from: 'Processing', to: 'Failed', trigger: 'error' },
  ],
  history: [],
}
```

#### Type E — Dashboard

```javascript
{
  metrics: [
    { id: 'm1', label: 'Score', value: 58, suffix: '/ 100', trend: 'flat' },
    { id: 'm2', label: 'Issues', value: 26, suffix: '', trend: 'down' },
    { id: 'm3', label: 'Coverage', value: 73, suffix: '%', trend: 'up' },
  ],
  series: {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
    values: [50, 53, 56, 57, 58],
  },
  highlights: [
    { id: 'h1', kind: 'positive', text: 'Type coverage reached 100% in `core/`' },
    { id: 'h2', kind: 'negative', text: '`scripts/utils.py` exceeds 800 lines' },
  ],
}
```

Generate `metrics` based on the card's score-like tag text (if present), else create a balanced set spanning 50–100 range.

#### Type F — Guide Walkthrough

```javascript
{
  steps: [
    { id: 'st1', label: 'Clone repo', code: 'git clone <url>' },
    { id: 'st2', label: 'Install deps', code: 'pip install -r requirements.txt' },
    { id: 'st3', label: 'Run server', code: 'streamlit run app.py' },
  ],
  activeStep: 0,
  copyToClipboardSupported: false,
}
```

The number of steps is 3–5; each step has a single command in `code`.

### Step 4: Validate Determinism

Compute `JSON.stringify` of the mock twice — before and after a rerun with the same seed — and confirm byte equality. If not equal, fix the offending field until equality holds.

### Step 5: Annotate with Metadata

Add `_meta` so consumers can verify the lineage:

```javascript
_meta: {
  demoType: '<A-F>',
  sceneName: '<scene_name>',
  cardName: '<card.name>',
  generatedAt: '<ISO timestamp>',
  mockSeed: <seed>,
  schemaVersion: '1.0.0',
}
```

## Output Format

Emit a single JavaScript file fragment that the calling agent inserts into `data.js`:

```javascript
window.DEMO_MOCK_DATA = <json payload>;
window.DEMO_MOCK_DATA._meta = <meta object>;
```

Or as a JSON literal if the caller asks:

```json
{
  "mock": { ... },
  "_meta": { "demoType": "E", "sceneName": "intro", "cardName": "Code Health Report", "generatedAt": "2026-06-29T18:30:00Z", "mockSeed": 10293847, "schemaVersion": "1.0.0" }
}
```

## Guidelines

- **No `fetch()` calls** in the produced payload — these are seed-deterministic in-memory structures only.
- **No real PII / secrets** — phone numbers, emails, names are clearly fake ("+1-555-0123", "demo@example.com").
- **Idempotent rerun**: same card + same seed yields byte-identical JSON. Verify by hashing.
- **Faithful to card**: respect any quotes / counts in card.desc; e.g. if card.desc mentions "7 dimensions", mock metrics must have 7 items when they correspond.
- **Schema stays inside rui-demos/types**: each field listed in Step 3 exists. Free-form additions require updating the type spec, not the mock.
