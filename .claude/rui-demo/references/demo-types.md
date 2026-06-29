# Demo Types Reference

Full specification for each demo type: when to use it, what it looks like, and how to build it.

## Table of Contents

- [4-File Output Structure](#4-file-output-structure)
- [Type A: Tool Interface Demo](#type-a-tool-interface-demo)
- [Type B: Pipeline Visualization](#type-b-pipeline-visualization)
- [Type C: Comparison Showcase](#type-c-comparison-showcase)
- [Type D: State Machine Demo](#type-d-state-machine-demo)
- [Type E: Dashboard Demo](#type-e-dashboard-demo)
- [Type F: Guide Walkthrough](#type-f-guide-walkthrough)
- [Classification Quick Reference](#classification-quick-reference)

---

## 4-File Output Structure

Every generated demo consists of exactly four files — no more, no less. This section documents which file contains what and how the type-specific templates below map to the four files.

### File Map

| File | Contains | This document refers to it as |
|------|----------|-------------------------------|
| `index.html` | HTML structure: three-area layout, CDN references, Vue template directives | **DOM Structure** section |
| `index.js` | Vue 3 app: `data()`, `methods`, `computed`, `mounted()`, card mounting IIFE | **Vue App Template** section |
| `index.css` | Demo-specific styles: layout, type-specific, responsive; all using `--yry-*` variables | **Styling Notes** section |
| `data.js` | `window.DEMO_CARD_DATA` + `window.DEMO_MOCK_DATA` + metadata | **Mock Data Shape** section |

### Where Each Code Block Lives

In the type specifications below:

- **DOM Structure** → goes in `index.html`, inside `<section class="demo-area" id="demo-app">`
- **Vue App Template** → goes in `index.js`, inside `Vue.createApp({ ... })`
- **Styling Notes** → goes in `index.css`, under `/* ── Demo Type Specific Styles ── */`
- **Mock Data Shape** → goes in `data.js`, assigned to `window.DEMO_MOCK_DATA`

The card data (`window.DEMO_CARD_DATA`) is the original `YrySceneCard` props object from the source and does not appear in the type specifications — it is passed through unchanged from the card source.

Use the scaffold templates at `assets/scaffold-index.html`, `assets/scaffold-index.js`, `assets/scaffold-index.css`, and `assets/scaffold-data.js` as the starting point for each demo. Fill in the `__PLACEHOLDER__` markers with the type-specific content from this reference.

---

## Type A: Tool Interface Demo

### When to Use

Cards that represent external tools or libraries with their own ecosystem. Signals:
- `links` is a custom array with 3+ external links (GitHub, docs, wiki, etc.)
- `badge` is absent, `'OSS'`, or `'Core'`
- `desc` mentions the tool's primary function (download, transcribe, recognize)
- Card has `nameHref` pointing to an external URL or a detail page

### Demo Concept

A simulated tool interface that lets the user "use" the tool in a simplified way. Think: a form that submits, a search that filters, an upload that processes — all with mock data and simulated delays.

### DOM Structure

```html
<section class="demo-area">
    <!-- Input Section -->
    <div class="demo-input">
        <label>{tool action prompt}</label>
        <div class="input-group">
            <input v-model="input" placeholder="{contextual placeholder}" @keyup.enter="process">
            <button @click="process" :disabled="processing">{action verb}</button>
        </div>
        <!-- Optional: additional options (format select, quality toggle, etc.) -->
        <div class="demo-options" v-if="showOptions">
            <!-- tool-specific options -->
        </div>
    </div>

    <!-- Progress Section (shown during processing) -->
    <div class="demo-progress" v-if="processing">
        <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="progress-text">{{ progressText }}</p>
    </div>

    <!-- Output Section (shown after processing) -->
    <div class="demo-output" v-if="result">
        <!-- tool-specific output display -->
    </div>
</section>
```

### Vue App Template

```javascript
const app = Vue.createApp({
    data() {
        return {
            input: '',
            processing: false,
            progress: 0,
            progressText: '',
            result: null,
            // tool-specific state
        }
    },
    methods: {
        async process() {
            if (!this.input.trim() || this.processing) return
            this.processing = true
            this.result = null
            // Simulate processing with staged progress updates
            await this.simulateProgress([
                { pct: 20, text: 'Connecting...', delay: 400 },
                { pct: 50, text: 'Processing...', delay: 600 },
                { pct: 80, text: 'Finalizing...', delay: 400 },
                { pct: 100, text: 'Done!', delay: 200 },
            ])
            this.result = this.generateMockResult()
            this.processing = false
        },
        async simulateProgress(stages) {
            for (const stage of stages) {
                await new Promise(r => setTimeout(r, stage.delay))
                this.progress = stage.pct
                this.progressText = stage.text
            }
        },
        generateMockResult() {
            // Return simulated output appropriate to the tool
        }
    }
})
app.mount('#demo-app')
```

### Styling Notes

- Input group: flex row, rounded input + accent button, max-width 640px
- Progress bar: full-width, 4px height, `var(--yry-accent)` fill, `var(--yry-border)` track
- Output: monospace pre block or card grid, dark background with border

### Mock Data Shape

`data.js` — assigned to `window.DEMO_MOCK_DATA`:

```javascript
window.DEMO_MOCK_DATA = {
    // Sample inputs used for placeholder text and demo hints
    sampleInputs: ['https://www.youtube.com/watch?v=example', 'https://vimeo.com/12345'],
    placeholder: 'Paste a URL to get started...',

    // Staged progress simulation
    progressStages: [
        { pct: 20, text: 'Connecting...', delay: 400 },
        { pct: 50, text: 'Processing...', delay: 600 },
        { pct: 80, text: 'Finalizing...', delay: 400 },
        { pct: 100, text: 'Done!', delay: 200 },
    ],

    // Mock result structure (returned by generateMockResult)
    mockResult: {
        title: 'Example Video Title',
        duration: '12:34',
        format: '1080p · mp4',
        size: '245 MB',
        subtitles: ['en', 'zh-CN', 'ja'],
        extractedAt: '2026-06-29 14:30 UTC',
    },

    // Metadata
    _meta: { demoSlug: '__DEMO_SLUG__', demoType: 'A', sceneName: '__SCENE_NAME__', generatedAt: '__GENERATED_AT__' }
};
```

### Example: yt-dlp Card

**Card signals**: External links (5 custom), desc "download via yt-dlp", tags "1.2k sites" + "Python"
**Demo concept**: Paste a YouTube URL → progress bar simulates download stages → shows mock video info + extracted subtitles
**Key interaction**: URL input → staged progress → result panel with format info

---

## Type B: Pipeline Visualization

### When to Use

Cards that describe multi-step processes or algorithms. Signals:
- Tags include `purple` modifier (methodology/approach)
- `desc` contains "pipeline", "steps", "stages", "flow", or numbered phases
- Card describes a transformation process (input → processing → output)
- `badge` is often `'Core'`

### Demo Concept

An animated flow diagram showing data moving through stages. Each stage is a clickable node that expands to show details. An "auto-play" button animates the full sequence.

### DOM Structure

```html
<section class="demo-area">
    <!-- Pipeline Controls -->
    <div class="pipeline-controls">
        <button @click="autoPlay" :disabled="playing">▶ Auto Play</button>
        <button @click="reset">↺ Reset</button>
        <span class="step-indicator">Step {{ currentStep }} / {{ steps.length }}</span>
    </div>

    <!-- Pipeline Visualization -->
    <div class="pipeline">
        <template v-for="(step, i) in steps" :key="i">
            <!-- Step Node -->
            <div class="pipeline-node"
                 :class="{ active: i === currentStep, done: i < currentStep }"
                 @click="selectStep(i)">
                <span class="node-icon">{{ step.icon }}</span>
                <span class="node-label">{{ step.label }}</span>
            </div>
            <!-- Connector Arrow -->
            <div class="pipeline-arrow" v-if="i < steps.length - 1"
                 :class="{ active: i < currentStep }">
                →
            </div>
        </template>
    </div>

    <!-- Step Detail Panel -->
    <div class="step-detail" v-if="currentStep !== null">
        <h3>{{ steps[currentStep].label }}</h3>
        <p>{{ steps[currentStep].description }}</p>
        <div class="step-demo-content">
            <!-- Step-specific demo (input preview, intermediate output, etc.) -->
        </div>
    </div>

    <!-- Input/Output preview (optional, for end-to-end demos) -->
    <div class="pipeline-io" v-if="showIO">
        <div class="io-panel input-panel">
            <h4>Input</h4>
            <div class="io-content">{{ sampleInput }}</div>
        </div>
        <div class="io-arrow">→</div>
        <div class="io-panel output-panel" v-if="pipelineOutput">
            <h4>Output</h4>
            <div class="io-content">{{ pipelineOutput }}</div>
        </div>
    </div>
</section>
```

### Vue App Template

```javascript
const app = Vue.createApp({
    data() {
        return {
            steps: [
                { icon: '1', label: 'Step Name', description: 'What happens here', ... },
                // 3-6 steps
            ],
            currentStep: null,
            playing: false,
            sampleInput: '...',
            pipelineOutput: null,
        }
    },
    methods: {
        selectStep(i) { this.currentStep = i; this.playing = false },
        async autoPlay() {
            this.playing = true
            for (let i = 0; i < this.steps.length; i++) {
                this.currentStep = i
                await new Promise(r => setTimeout(r, 1500))
                if (!this.playing) break
            }
            if (this.playing) this.pipelineOutput = this.generateOutput()
            this.playing = false
        },
        reset() {
            this.playing = false
            this.currentStep = null
            this.pipelineOutput = null
        },
        generateOutput() { /* produce mock output */ }
    }
})
app.mount('#demo-app')
```

### Styling Notes

- Pipeline nodes: flex row, circles (48px) for icons, labels below, `var(--yry-accent)` when active
- Connector arrows: `var(--yry-text-muted)` by default, `var(--yry-accent)` when active, animated dash on play
- Step detail: card with left border accent, smooth height transition
- I/O panels: side-by-side cards, monospace content

### Mock Data Shape

`data.js` — assigned to `window.DEMO_MOCK_DATA`:

```javascript
window.DEMO_MOCK_DATA = {
    // Pipeline steps definition
    steps: [
        { icon: '1', label: 'Step Name', description: 'What happens in this step', detail: 'Expanded explanation...' },
        { icon: '2', label: 'Step Two', description: 'Second stage processing', detail: '...' },
        { icon: '3', label: 'Step Three', description: 'Final transformation', detail: '...' },
        // 3-6 steps total
    ],

    // Sample data for I/O preview
    sampleInput: 'Raw text or data that enters the pipeline...',
    expectedOutput: 'Transformed output after pipeline processing...',

    // Animation timing (ms per step during auto-play)
    stepDelay: 1500,

    // Metadata
    _meta: { demoSlug: '__DEMO_SLUG__', demoType: 'B', sceneName: '__SCENE_NAME__', generatedAt: '__GENERATED_AT__' }
};
```

### Example: NLP Split Card

**Card signals**: Tags "AI-driven" (purple) + "sentence-aware" (info), desc "segmentation · sentence-boundary"
**Demo concept**: Shows sample text flowing through NLP detection → sentence boundary identification → split output
**Key interaction**: Auto-play walks through the split pipeline; clicking a step shows the intermediate state

---

## Type C: Comparison Showcase

### When to Use

Cards that compare or enumerate multiple variants/options. Signals:
- Tags include counts ("6 engines", "4 languages", "3 stages")
- `desc` contains lists of variants or comparison language
- Card's value is in the variety of options it supports
- Tags include `cyan` modifier (count/action)

### Demo Concept

A side-by-side or tabbed comparison of the variants the card describes. Each variant has a card/callout showing its characteristics. An interactive switcher lets the user explore differences.

### DOM Structure

```html
<section class="demo-area">
    <!-- Variant Selector -->
    <div class="variant-tabs">
        <button v-for="(variant, i) in variants" :key="i"
                :class="{ active: selected === i }"
                @click="selected = i">
            {{ variant.name }}
        </button>
    </div>

    <!-- Variant Detail -->
    <div class="variant-detail" v-if="selected !== null">
        <div class="variant-card">
            <h3>{{ variants[selected].name }}</h3>
            <p>{{ variants[selected].description }}</p>
            <div class="variant-highlights">
                <span v-for="h in variants[selected].highlights" class="highlight-tag">
                    {{ h }}
                </span>
            </div>
        </div>
    </div>

    <!-- Comparison Table (optional, for richer demos) -->
    <div class="comparison-table" v-if="showTable">
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    <th v-for="v in variants">{{ v.name }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in comparisonRows">
                    <td>{{ row.feature }}</td>
                    <td v-for="v in row.values" :class="{ highlight: v.highlight }">
                        {{ v.value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
```

### Styling Notes

- Variant tabs: flex row, pill-shaped buttons, `var(--yry-accent)` for active
- Variant card: bordered card with highlight tags inside
- Comparison table: dark background, zebra striping with `var(--yry-bg-secondary)`, highlight column with accent
- Side-by-side layout at ≥768px, stacked at <768px

### Mock Data Shape

`data.js` — assigned to `window.DEMO_MOCK_DATA`:

```javascript
window.DEMO_MOCK_DATA = {
    // Variants to compare
    variants: [
        { name: 'Variant A', description: 'Key characteristics...', highlights: ['Fast', 'Accurate'] },
        { name: 'Variant B', description: 'Key characteristics...', highlights: ['Cheap', 'Flexible'] },
        { name: 'Variant C', description: 'Key characteristics...', highlights: ['Simple', 'Reliable'] },
    ],

    // Comparison table data
    comparisonRows: [
        { feature: 'Feature Name', values: [{ value: '✓', highlight: true }, { value: '✗' }, { value: '~' }] },
    ],

    // Metadata
    _meta: { demoSlug: '__DEMO_SLUG__', demoType: 'C', sceneName: '__SCENE_NAME__', generatedAt: '__GENERATED_AT__' }
};
```

### Example: Multi-TTS Card

**Card signals**: Tags "6 engines" (cyan) + "voice-clone" (accent), desc lists engine names
**Demo concept**: Tabs for each TTS engine showing its characteristics; comparison table for quality/speed/languages
**Key interaction**: Switching tabs shows per-engine details; table highlights best-in-class values

---

## Type D: State Machine Demo

### When to Use

Cards that describe control flows, state management, or lifecycle features. Signals:
- Tags mention "real-time", "3 states", "checkpoint", "recovery", "search", "auto-fetch"
- `desc` contains "pause", "resume", "stop", "transition", "state"
- Card is about controlling or managing a process

### Demo Concept

An interactive state machine diagram where the user clicks to trigger state transitions. A visual status indicator shows the current state. The demo simulates a real system responding to user control actions.

### DOM Structure

```html
<section class="demo-area">
    <!-- Status Display -->
    <div class="status-display" :class="currentState">
        <div class="status-indicator"></div>
        <span class="status-text">{{ stateLabel }}</span>
    </div>

    <!-- State Machine Diagram -->
    <div class="state-machine">
        <div v-for="(state, i) in states" :key="i"
             class="state-node"
             :class="{ active: currentState === state.id, reachable: canTransitionTo(state.id) }"
             @click="transitionTo(state.id)">
            <span class="state-icon">{{ state.icon }}</span>
            <span class="state-name">{{ state.label }}</span>
        </div>
        <!-- SVG transition arrows between states -->
        <svg class="state-edges">
            <line v-for="edge in edges" ... />
        </svg>
    </div>

    <!-- Control Buttons -->
    <div class="demo-controls">
        <button v-for="action in availableActions"
                @click="doAction(action.id)"
                :disabled="!action.enabled">
            {{ action.label }}
        </button>
    </div>

    <!-- Action Log -->
    <div class="action-log">
        <div v-for="entry in log" class="log-entry">
            <span class="log-time">{{ entry.time }}</span>
            <span class="log-msg">{{ entry.message }}</span>
        </div>
    </div>
</section>
```

### Styling Notes

- State nodes: flex/grid layout, circles with icons, `var(--yry-accent)` for active, `var(--yry-success)` for reachable
- SVG edges: simple `<line>` elements with arrow markers, animated dash when transitioning
- Status display: large pill with pulsing indicator dot, color changes with state
- Action log: monospace, scrollable, newest at bottom, auto-scroll

### Mock Data Shape

`data.js` — assigned to `window.DEMO_MOCK_DATA`:

```javascript
window.DEMO_MOCK_DATA = {
    // State definitions
    states: [
        { id: 'state1', icon: '▶', label: 'State One', description: 'What this state represents' },
        { id: 'state2', icon: '⏸', label: 'State Two', description: 'What this state represents' },
        { id: 'state3', icon: '⏹', label: 'State Three', description: 'What this state represents' },
    ],

    // Transition rules: from which states can you go to which states
    transitions: {
        state1: ['state2', 'state3'],
        state2: ['state1', 'state3'],
        state3: ['state1'],
    },

    // Available actions per state
    actions: {
        state1: [{ id: 'pause', label: 'Pause', target: 'state2' }],
        state2: [{ id: 'resume', label: 'Resume', target: 'state1' }, { id: 'stop', label: 'Stop', target: 'state3' }],
        state3: [{ id: 'restart', label: 'Restart', target: 'state1' }],
    },

    // Initial state ID
    initialState: 'state1',

    // Sample log entries
    initialLog: [
        { time: '14:30:01', message: 'System initialized' },
    ],

    // Metadata
    _meta: { demoSlug: '__DEMO_SLUG__', demoType: 'D', sceneName: '__SCENE_NAME__', generatedAt: '__GENERATED_AT__' }
};
```

### Example: Task Control Card

**Card signals**: Tags "real-time" (accent) + "3 states" (cyan), desc "pause, resume, stop"
**Demo concept**: Three-state machine (Running → Paused → Stopped) with clickable transitions; simulated task progress in the background
**Key interaction**: Click states to transition; action log shows transition history

---

## Type E: Dashboard Demo

### When to Use

Cards that present reports, metrics, or scored assessments. Signals:
- `badge` is `'Report'`
- Tags include scores ("58 / 100"), dimensions ("7 dimensions"), action counts ("26 actions")
- Tags use `warn` and `red` modifiers (scores and gaps)
- `meta` field is present with dates/contexts

### Demo Concept

A dashboard layout with metric cards, a radar/bar chart, and expandable recommendation cards. The dashboard visualizes the report's data in an interactive, explorable format.

### DOM Structure

```html
<section class="demo-area">
    <!-- Metric Cards Row -->
    <div class="metrics-row">
        <div v-for="metric in metrics" class="metric-card" :class="metric.trend">
            <span class="metric-value">{{ metric.value }}</span>
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-change" v-if="metric.change">{{ metric.change }}</span>
        </div>
    </div>

    <!-- Chart Area -->
    <div class="chart-area">
        <canvas id="demo-chart"></canvas>
    </div>

    <!-- Dimension Breakdown -->
    <div class="dimension-list">
        <div v-for="dim in dimensions" class="dimension-item">
            <div class="dim-header">
                <span class="dim-name">{{ dim.name }}</span>
                <span class="dim-score" :class="scoreClass(dim.score)">{{ dim.score }}</span>
            </div>
            <div class="dim-bar">
                <div class="dim-bar-fill" :style="{ width: dim.score + '%' }"
                     :class="scoreClass(dim.score)"></div>
            </div>
            <p class="dim-note">{{ dim.note }}</p>
        </div>
    </div>

    <!-- Recommendations (expandable) -->
    <div class="recommendations">
        <div v-for="rec in recommendations" class="rec-card"
             @click="rec.expanded = !rec.expanded">
            <div class="rec-header">
                <span class="rec-priority" :class="rec.priority">{{ rec.priority }}</span>
                <span class="rec-title">{{ rec.title }}</span>
                <span class="rec-effort">{{ rec.effort }}</span>
            </div>
            <div class="rec-detail" v-if="rec.expanded">
                <p>{{ rec.description }}</p>
            </div>
        </div>
    </div>
</section>
```

### Chart.js Setup

Only Type E needs Chart.js. Load it conditionally:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
```

```javascript
// Mount Chart.js in Vue mounted() hook
mounted() {
    this.$nextTick(() => {
        const ctx = document.getElementById('demo-chart')
        if (!ctx) return
        new Chart(ctx, {
            type: 'radar',  // or 'bar' for dimension breakdowns
            data: {
                labels: this.dimensions.map(d => d.name),
                datasets: [{
                    label: 'Score',
                    data: this.dimensions.map(d => d.score),
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    borderColor: '#38bdf8',
                }]
            },
            options: {
                scales: { r: { min: 0, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.15)' }, pointLabels: { color: '#e2e8f0' } } },
                plugins: { legend: { display: false } }
            }
        })
    })
}
```

### Styling Notes

- Metric cards: 3-4 in a row, large value + small label, trend arrow
- Chart: full-width canvas, dark background, accent-colored data
- Dimension bars: horizontal progress bars with color coding (green > 80, yellow > 50, red < 50)
- Recommendations: accordion cards, priority badges (P0 red, P1 orange, P2 blue)

### Mock Data Shape

`data.js` — assigned to `window.DEMO_MOCK_DATA`:

```javascript
window.DEMO_MOCK_DATA = {
    // Metric cards at the top of the dashboard
    metrics: [
        { value: '58', label: 'Overall Score', change: '+3', trend: 'up' },
        { value: '7', label: 'Dimensions', change: null, trend: 'neutral' },
        { value: '26', label: 'Actions', change: null, trend: 'neutral' },
        { value: '56h', label: 'Est. Effort', change: null, trend: 'neutral' },
    ],

    // Dimension scores for bar chart + radar chart
    dimensions: [
        { name: 'Dimension A', score: 72, note: 'Above average' },
        { name: 'Dimension B', score: 45, note: 'Needs attention' },
        { name: 'Dimension C', score: 88, note: 'Excellent' },
        // 4-10 dimensions
    ],

    // Chart configuration
    chartType: 'radar',  // 'radar' or 'bar'
    chartMax: 100,

    // Expandable recommendation cards
    recommendations: [
        {
            priority: 'P0', title: 'Critical Fix', effort: '8h',
            description: 'Detailed explanation of what to fix and why.',
            expanded: false
        },
        {
            priority: 'P1', title: 'Important Improvement', effort: '16h',
            description: 'Detailed explanation...',
            expanded: false
        },
    ],

    // Metadata
    _meta: { demoSlug: '__DEMO_SLUG__', demoType: 'E', sceneName: '__SCENE_NAME__', generatedAt: '__GENERATED_AT__' }
};
```

### Example: Code Health Report Card

**Card signals**: Badge 'Report', tags "58/100" (warn) + "7 dimensions" (info) + "26 actions" (cyan)
**Demo concept**: Dashboard with overall score, radar chart of 7 dimensions, expandable improvement recommendations
**Key interaction**: Hover chart for dimension scores; click recommendations to expand details

---

## Type F: Guide Walkthrough

### When to Use

Cards that serve as navigation to documentation sections or tutorials. Signals:
- `badge` is `'Guide'`
- `nameHref` contains `#fragment` anchors
- `desc` contains instructional language ("Get running", "step-by-step")
- Tags are simple classifiers ("5 min", "yaml", "FAQ")

### Demo Concept

A step-by-step interactive walkthrough with code snippets and checkpoints. Each step has a brief instruction and a copyable code block or config snippet. User clicks through steps and can copy snippets.

### DOM Structure

```html
<section class="demo-area">
    <!-- Step Progress -->
    <div class="walkthrough-progress">
        <div v-for="(step, i) in steps" class="step-dot"
             :class="{ active: i === currentStep, done: i < currentStep }"
             @click="currentStep = i">
            {{ i < currentStep ? '✓' : i + 1 }}
        </div>
    </div>

    <!-- Current Step Content -->
    <div class="walkthrough-step" v-if="currentStep !== null">
        <h3>{{ steps[currentStep].title }}</h3>
        <p>{{ steps[currentStep].instruction }}</p>

        <!-- Code/Config Snippet -->
        <div class="code-block" v-if="steps[currentStep].code">
            <div class="code-header">
                <span>{{ steps[currentStep].filename || 'terminal' }}</span>
                <button @click="copyCode(steps[currentStep].code)">📋 Copy</button>
            </div>
            <pre><code>{{ steps[currentStep].code }}</code></pre>
        </div>

        <!-- Step Result Preview -->
        <div class="step-result" v-if="steps[currentStep].result">
            {{ steps[currentStep].result }}
        </div>
    </div>

    <!-- Navigation -->
    <div class="walkthrough-nav">
        <button @click="prevStep" :disabled="currentStep <= 0">← Previous</button>
        <span>{{ currentStep + 1 }} / {{ steps.length }}</span>
        <button @click="nextStep" :disabled="currentStep >= steps.length - 1">Next →</button>
    </div>
</section>
```

### Styling Notes

- Step dots: horizontal row, connected by lines, `var(--yry-accent)` for active, checkmark for done
- Code block: dark background (`var(--yry-bg-tertiary)`), monospace, syntax highlighting with accent colors
- Copy button: `navigator.clipboard.writeText()`, brief "Copied!" feedback
- Navigation: flex row, accent buttons, disabled state with reduced opacity

### Mock Data Shape

`data.js` — assigned to `window.DEMO_MOCK_DATA`:

```javascript
window.DEMO_MOCK_DATA = {
    // Walkthrough steps
    steps: [
        {
            title: 'Step 1: Install',
            instruction: 'Run the install command to get started.',
            code: 'pip install example-tool',
            filename: 'terminal',
            result: 'Successfully installed example-tool v2.0.0',
        },
        {
            title: 'Step 2: Configure',
            instruction: 'Set up your configuration file with the required settings.',
            code: 'example-tool init --output config.yaml',
            filename: 'terminal',
            result: 'Configuration written to config.yaml',
        },
        {
            title: 'Step 3: Run',
            instruction: 'Start the application and verify it works.',
            code: 'example-tool run --config config.yaml',
            filename: 'terminal',
            result: 'Server listening on http://localhost:8080',
        },
    ],

    // Copy feedback text
    copyFeedback: 'Copied!',

    // Metadata
    _meta: { demoSlug: '__DEMO_SLUG__', demoType: 'F', sceneName: '__SCENE_NAME__', generatedAt: '__GENERATED_AT__' }
};
```

### Example: Quick Start Card

**Card signals**: Badge 'Guide', nameHref '#quick-start', tags "5 min" + "uv/Docker"
**Demo concept**: 3-step walkthrough: install → configure → run, with copyable shell commands
**Key interaction**: Click through steps, copy each command, see expected output

---

## Classification Quick Reference

| Signal | → Type |
|--------|--------|
| `links` is custom array (3+ items) | **A** (Tool Interface) |
| Tags with `purple` modifier | **B** (Pipeline) |
| `desc` contains "pipeline" / "steps" / "stages" / "flow" | **B** (Pipeline) |
| Tags with count values ("6 engines", "4 languages") | **C** (Comparison) |
| `desc` lists variants ("Azure · OpenAI · Edge") | **C** (Comparison) |
| Tags mention "real-time" / "3 states" / "checkpoint" / "search" | **D** (State Machine) |
| `desc` contains "pause" / "resume" / "stop" / "transition" | **D** (State Machine) |
| `badge` is `'Report'` | **E** (Dashboard) |
| Tags with `warn` or `red` modifiers + score values | **E** (Dashboard) |
| `badge` is `'Guide'` | **F** (Walkthrough) |
| `nameHref` contains `#fragment` + no external links | **F** (Walkthrough) |

### Tie-breaking

When a card matches multiple types, use this priority:

1. **E (Dashboard)** if `badge === 'Report'` — reports always get dashboards
2. **F (Walkthrough)** if `badge === 'Guide'` — guides always get walkthroughs
3. **A (Tool Interface)** if `links` is custom array with external URLs — tools win over features
4. **D (State Machine)** if the card is about controlling/managing (interactive state is the richest demo)
5. **B (Pipeline)** if `purple` tag present or desc mentions process steps — pipeline visualizations are more engaging than static comparisons
6. **C (Comparison)** if tag count > 2 variants — fallback for variety-focused cards
