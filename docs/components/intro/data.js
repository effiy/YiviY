/**
 * Intro 数据源
 * ----------------------------------------------------------------------
 * 抽离 intro 的展示数据，与模板/样式解耦，便于后续维护。
 * 通过 window 暴露，供 Vue 组件读取。
 *
 * cards 字段对齐 YrySceneCard props：
 *   - icon          卡片图标/字符（占位，当前 YrySceneCard 模板未渲染）
 *   - iconModifier  skill | agent | rule | ref · 占位字段，保留以保持卡片视觉风格约定
 *   - name          卡片主标题
 *   - nameHref      标题点击跳转（站内 #fragment 或 views/* 相对路径）
 *   - nameTarget    链接打开方式，'' 表示当前窗口（避免 _blank 把片段链接丢到新标签页）
 *   - badge         可选 · 标题后小徽标（如 "新" / "报告"）
 *   - desc          描述文字（支持 HTML，由 YrySceneCard 内部 v-html 渲染）
 *   - tags          可选 · 标签芯片数组，每项 { text, modifier, href? }
 *   - meta          可选 · 底部元信息（纯文本，常用于日期 / 标识）
 *
 *     ▸ tags.modifier 取值见 cdn/yry-tag-chip/index.css：
 *       accent | info | cyan | green | purple | red | warn | blue
 *
 *     ▸ 跳转目标：
 *       - 站内锚点  → nameHref = '#workflow' 等（同窗口跳转）
 *       - 项目报告  → nameHref = 'views/<报告目录>/index.html'（同窗口跳转）
 *                     当前已挂载：views/健康报告  views/架构报告
 */

window.INTRO_TITLE = 'VideoLingo Documentation Center';

window.INTRO_LEAD = 'All-in-one video translation, localization, and dubbing — Netflix-quality subtitles, one click.';

window.INTRO_CARDS = [
    {
        icon: '🚀',
        iconModifier: 'skill',
        name: 'Quick Start',
        nameHref: '#quick-start',
        nameTarget: '',
        desc: 'Get running in 3 minutes with uv or Docker'
    },
    {
        icon: '⚙️',
        iconModifier: 'rule',
        name: 'Configuration',
        nameHref: '#config',
        nameTarget: '',
        desc: 'Understand every knob in config.yaml'
    },
    {
        icon: '🔑',
        iconModifier: 'agent',
        name: 'API Setup',
        nameHref: '#api-config',
        nameTarget: '',
        desc: 'LLM, Whisper, TTS — all API providers explained'
    },
    {
        icon: '🎤',
        iconModifier: 'ref',
        name: 'Dubbing Guide',
        nameHref: '#dubbing',
        nameTarget: '',
        desc: '9 TTS engines compared with pro tips'
    },
    {
        icon: '🩺',
        iconModifier: 'rule',
        name: 'Troubleshooting',
        nameHref: '#troubleshooting',
        nameTarget: '',
        desc: 'Common issues and their solutions'
    },
    {
        icon: '🔄',
        iconModifier: 'skill',
        name: 'Pipeline Deep Dive',
        nameHref: '#workflow',
        nameTarget: '',
        desc: 'Step-by-step: download → transcribe → translate → dub'
    },
    /* ── 项目评估报告 · 独立 views/* 页面 · 同窗口跳转 ────────────── */
    {
        icon: '🩺',
        iconModifier: 'rule',
        name: '代码健康报告',
        nameHref: 'views/健康报告/index.html',
        nameTarget: '',
        badge: '报告',
        desc: '7 维度静态分析 · 量化评分 · 26 项改进 · 56h 治理路线图',
        tags: [
            { text: '58 / 100',   modifier: 'warn' },
            { text: '7 维度评分',  modifier: 'info' },
            { text: '26 改进行动', modifier: 'cyan' }
        ],
        meta: '评估日期 2026-06-28 · Technical Due Diligence'
    },
    {
        icon: '🏗️',
        iconModifier: 'skill',
        name: '架构分析报告',
        nameHref: 'views/架构报告/index.html',
        nameTarget: '',
        badge: '报告',
        desc: 'ATAM 方法 · 8 维度加权评分 · 10 行动项 · 5 周落地排期',
        tags: [
            { text: '5.6 → 7.9',     modifier: 'red' },
            { text: 'ATAM 方法',     modifier: 'purple' },
            { text: '10 行动项',     modifier: 'cyan' }
        ],
        meta: 'v3.0.0 → v3.1.0 · 评估日期 2026-06-28'
    }
];

window.INTRO_CALLOUT = {
    icon: '💡',
    strong: 'New here?',
    text: 'VideoLingo takes a YouTube URL and turns it into a perfectly subtitled + dubbed video in your target language. Jump to ',
    linkText: 'Quick Start',
    linkHref: '#quick-start'
};