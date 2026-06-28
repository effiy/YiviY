/**
 * Translation 数据源
 * ----------------------------------------------------------------------
 * 抽离 translation 的展示数据（三阶段翻译流程 + 关键配置），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.TRANSLATION_CONFIG = {
    phases: [
        {
            title: 'Phase 1: Summarize',
            body: 'The LLM reads all subtitle lines to understand the full context. Extracts a scene-level summary and a terminology glossary. This contextual awareness prevents the "fragmented translation" problem common in line-by-line approaches.'
        },
        {
            title: 'Phase 2: Translate',
            body: 'Each line is translated with full context, terminology, and tone awareness. The LLM receives the summary + glossary + source lines, producing coherent translations that maintain narrative flow.'
        },
        {
            title: 'Phase 3: Reflect & Adapt',
            body: 'The LLM reviews its own translation with the <code>reflect_translate</code> flag. It compares source→target meaning fidelity and adjusts phrasing for natural target-language expression. This is what gives VideoLingo its "Netflix subtitle" quality.'
        }
    ],
    settings: [
        { key: 'target_language',        defaultValue: '简体中文', effect: 'Natural language description of target' },
        { key: 'summary_length',         defaultValue: '8000',     effect: 'Context window for summary' },
        { key: 'reflect_translate',      defaultValue: 'true',     effect: 'Enable 3-phase quality loop' },
        { key: 'pause_before_translate', defaultValue: 'false',    effect: 'Manual review of terminology' }
    ]
};
