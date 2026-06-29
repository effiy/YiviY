# Scene Card Examples — Curated Catalogue

This file collects well-formed scene cards across common domains. Use these as reference when designing cards for similar content types.

## Domain: Reports / Audits

Reports benefit from score tags, methodology badges, dimension counts, and dated meta lines.

```javascript
// Code health / static analysis report
{
    name: 'Code Health Report',
    nameHref: 'views/health-report/index.html',
    nameTarget: '',
    badge: 'Report',
    desc: '7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap',
    tags: [
        { text: '58 / 100', modifier: 'warn' },
        { text: '7 dimensions', modifier: 'info' },
        { text: '26 actions', modifier: 'cyan' }
    ],
    meta: 'Assessment date 2026-06-28 · Technical Due Diligence'
}

// Architecture review report
{
    name: 'Architecture Report',
    nameHref: 'views/arch-report/index.html',
    nameTarget: '',
    badge: 'Report',
    desc: 'ATAM method · 8-dimension weighted scoring · <strong>10 action items</strong> · 5-week implementation plan',
    tags: [
        { text: '5.6 → 7.9', modifier: 'red' },
        { text: 'ATAM', modifier: 'purple' },
        { text: '10 actions', modifier: 'cyan' }
    ],
    meta: 'v3.0.0 → v3.1.0 · Assessment date 2026-06-28'
}

// Security audit report
{
    name: 'Security Audit',
    nameHref: 'views/security-audit/index.html',
    nameTarget: '',
    badge: 'Report',
    desc: 'OWASP Top 10 coverage · dependency scan · <strong>3 critical</strong> findings · 12 total vulnerabilities',
    tags: [
        { text: '3 critical', modifier: 'fail' },
        { text: 'OWASP', modifier: 'purple' },
        { text: '12 findings', modifier: 'warn' }
    ],
    meta: 'Scan date 2026-06-15 · SAST + SCA + DAST'
}

// Performance benchmark
{
    name: 'Performance Benchmark',
    nameHref: 'views/perf/index.html',
    nameTarget: '',
    badge: 'Report',
    desc: 'Lighthouse 95/100 · <strong>Core Web Vitals all green</strong> · 1.2s FCP · 0.08s CLS',
    tags: [
        { text: '95 / 100', modifier: 'pass' },
        { text: 'Lighthouse', modifier: 'purple' },
        { text: '1.2s FCP', modifier: 'info' }
    ],
    meta: 'Measured 2026-06-20 · Mobile 4G throttling'
}
```

## Domain: Product Features

Feature cards are typically rendered in grids. Keep descriptions tight, use `links: []` to suppress default links, and badge only the core features.

```javascript
// Core features with badges
[
    { name: '🎙️ WhisperX',     badge: 'Core', desc: 'Word-level and low-illusion subtitle recognition with WhisperX',                                        links: [] },
    { name: '📝 NLP Split',    badge: 'Core', desc: 'NLP and AI-powered subtitle segmentation for natural reading flow',                                      links: [] },
    { name: '📚 Term Base',    badge: 'Core', desc: 'Custom + AI-generated terminology database ensuring translation consistency',                             links: [] },
    { name: '🔄 3-Step T-R-A', badge: 'Core', desc: 'Translate → Reflect → Adapt pipeline for cinematic translation quality',                                   links: [] },
    { name: '✅ Netflix 1-Line',badge: 'Core', desc: 'Netflix-standard single-line subtitles only — no multi-line clutter',                                      links: [] },
    { name: '🗣️ Multi-TTS',    badge: 'Core', desc: 'Dubbing via GPT-SoVITS, Azure TTS, OpenAI TTS, Edge TTS, and more',                                        links: [] },
]

// Supporting features (no badge)
[
    { name: '🚀 One-Click Start', desc: 'Launch and process in Streamlit with a single command',                                                  links: [] },
    { name: '🌍 i18n UI',         desc: 'Multi-language support throughout the Streamlit interface',                                              links: [] },
    { name: '📝 Resume',          desc: 'Detailed logging with progress checkpointing — pause and resume anytime',                                 links: [] },
    { name: '🔍 Model Picker',    desc: 'Auto-fetch full model list from your provider API, with search and filter',                              links: [] },
    { name: '⏯️ Task Control',    desc: 'Pause, resume, or stop processing at any pipeline step',                                                   links: [] }
]
```

## Domain: Tools / CLI / Libraries

Tool cards should include language/ecosystem tags and links to source/docs.

```javascript
{
    name: 'yt-dlp Wrapper',
    nameHref: 'https://github.com/yt-dlp/yt-dlp',
    badge: 'OSS',
    desc: 'Feature-complete YouTube downloader — <strong>1,200+ supported sites</strong> · format selection · subtitle extraction · sponsorblock integration',
    tags: [
        { text: 'Python', modifier: 'info' },
        { text: 'CLI', modifier: 'info' },
        { text: '1.2k sites', modifier: 'accent' }
    ],
    meta: 'MIT · v2024.12.01 · 95k ★',
    links: [
        { label: '源码', href: 'https://github.com/yt-dlp/yt-dlp', target: '_blank' },
        { label: '文档', href: 'https://github.com/yt-dlp/yt-dlp#readme', target: '_blank' }
    ]
}
```

## Domain: Projects / Repositories

Project cards summarize a repo for discovery. Include license, stars, primary language tags.

```javascript
{
    name: 'VideoLingo',
    nameHref: 'https://github.com/Huanshere/VideoLingo',
    badge: 'OSS',
    desc: 'All-in-one video translation, localization & dubbing — <strong>Netflix-quality subtitles</strong> · AI dubbing · Streamlit UI · i18n support',
    tags: [
        { text: 'Python', modifier: 'info' },
        { text: 'Streamlit', modifier: 'info' },
        { text: 'AI/ML', modifier: 'accent' }
    ],
    meta: 'Apache 2.0 · Active Development',
    demo: 'https://videolingo.io',
    links: [
        { label: '源码', href: 'https://github.com/Huanshere/VideoLingo', target: '_blank' },
        { label: '文档', href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md', target: '_blank' },
        { label: 'CI/CD', href: 'https://github.com/Huanshere/VideoLingo/actions', target: '_blank' }
    ]
}
```

## Domain: Agents / Skills

Agent/skill cards describe what the agent does and how to use it.

```javascript
{
    name: 'Code Review Agent',
    badge: 'Agent',
    desc: 'Multi-dimension code review: <strong>correctness bugs</strong> · reuse/simplification · efficiency · security patterns',
    tags: [
        { text: 'Review', modifier: 'purple' },
        { text: 'Security', modifier: 'warn' },
        { text: '3 passes', modifier: 'info' }
    ],
    meta: 'Trigger: /code-review · Medium effort default',
    links: [
        { label: '使用指南', href: 'docs/agents/code-review.md', target: '' },
        { label: '示例', href: 'docs/agents/examples.md', target: '' }
    ]
}
```

## Domain: Documentation Pages

Doc page cards for navigation grids. Use `nameTarget: ''` for same-page fragment navigation.

```javascript
[
    { name: 'Quick Start',      nameHref: '#quick-start',  nameTarget: '', desc: 'Get running in 3 minutes with uv or Docker — from zero to translated video' },
    { name: 'Configuration',    nameHref: '#config',       nameTarget: '', desc: 'Every knob in config.yaml explained — LLM, Whisper, TTS, output settings' },
    { name: 'API Setup',        nameHref: '#api-config',   nameTarget: '', desc: 'LLM providers · Whisper variants · TTS engines — all APIs documented' },
    { name: 'Dubbing Guide',    nameHref: '#dubbing',      nameTarget: '', desc: '9 TTS engines compared side-by-side with quality assessments and pro tips' },
    { name: 'Troubleshooting',  nameHref: '#troubleshooting', nameTarget: '', desc: 'Common pitfalls and their fixes — dependency conflicts, API errors, CUDA issues' },
    { name: 'Pipeline Deep Dive', nameHref: '#workflow',   nameTarget: '', desc: 'Step-by-step walkthrough: download → transcribe → segment → translate → dub' }
]
```

## Domain: Dashboard / Metrics

Metric cards with large numbers and trend indicators.

```javascript
{
    name: 'Monthly Active Users',
    desc: 'Global MAU across all platforms — <strong>+23% MoM</strong> · iOS 45% · Android 38% · Web 17%',
    tags: [
        { text: '142K', modifier: 'accent' },
        { text: '+23% MoM', modifier: 'pass' },
        { text: '3 platforms', modifier: 'info' }
    ],
    meta: 'June 2026 · vs. 115K May 2026',
    links: [
        { label: '仪表盘', href: 'https://analytics.example.com', target: '_blank' },
        { label: '报告', href: 'https://docs.example.com/reports/june-2026', target: '_blank' }
    ]
}
```

## i18n Patterns

When generating multi-language data, keep structure identical and translate content. Match tags and badges to each language's conventions.

```javascript
// English
{ name: 'Quick Start', nameHref: '#quick-start', nameTarget: '', desc: 'Get running in 3 minutes with uv or Docker' }

// Chinese (zh-CN)
{ name: '快速上手', nameHref: '#quick-start', nameTarget: '', desc: '使用 uv 或 Docker 3 分钟快速启动' }

// Chinese Traditional (zh-TW)
{ name: '快速上手', nameHref: '#quick-start', nameTarget: '', desc: '使用 uv 或 Docker 3 分鐘快速啟動' }

// Japanese (ja)
{ name: 'クイックスタート', nameHref: '#quick-start', nameTarget: '', desc: 'uv または Docker で 3 分で起動' }

// Report card — note badge and tag text also translate
// en:    badge: 'Report',  tags: [{ text: '7 dimensions', ... }]
// zh-CN: badge: '报告',    tags: [{ text: '7 维度评分', ... }]
// ja:    badge: 'レポート', tags: [{ text: '7 次元', ... }]
```

## Common Mistakes to Avoid

### ❌ Vague descriptions
```javascript
desc: 'A tool for processing videos and making subtitles' // Too vague — no specifics
```

### ✅ Specific, scannable descriptions
```javascript
desc: 'All-in-one video translation — <strong>Netflix-quality subtitles</strong> · AI dubbing · multi-TTS · Streamlit UI'
```

### ❌ Tags as instructions
```javascript
tags: [{ text: 'View details', ... }, { text: 'Click here', ... }] // Instructs the viewer, not descriptive
```

### ✅ Tags as self-describing classifiers
```javascript
tags: [{ text: 'Python', modifier: 'info' }, { text: '7 dimensions', modifier: 'info' }]
```

### ❌ All tags using default modifier
```javascript
tags: [{ text: '58/100', modifier: 'info' }, { text: 'Critical', modifier: 'info' }] // No semantic color
```

### ✅ Semantic modifier usage
```javascript
tags: [{ text: '58/100', modifier: 'warn' }, { text: '3 critical', modifier: 'fail' }]
```

### ❌ Missing links: [] when defaults would be useful
```javascript
// A project repo card with links: [] — user has nowhere to go
{ name: 'MyProject', desc: '...', links: [] }
```

### ✅ Custom links for project cards
```javascript
{ name: 'MyProject', desc: '...', links: [
    { label: '源码', href: 'https://github.com/user/repo', target: '_blank' },
    { label: '文档', href: 'https://repo.readthedocs.io', target: '_blank' }
]}
```
