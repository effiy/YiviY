/**
 * Troubleshooting 数据源
 * ----------------------------------------------------------------------
 * 抽离 troubleshooting 的展示数据（issue + fix），便于统一维护。
 * 通过 window 暴露，供 Vue 组件读取。
 *
 * v2 改进（ui-ux-pro-max 审计）：
 *   - 移除 issue icon 字段（❌），使用 CSS ::before 伪元素标记
 *   - 移除 help link icon 字段中的 emoji（🆓🐛📧）
 */

window.TROUBLESHOOTING_CONFIG = {
    issues: [
        {
            title: '"CUDA out of memory"',
            fix: 'Switch to <code>whisper.runtime: cloud</code>, use <code>large-v3-turbo</code>, or reduce concurrent operations.'
        },
        {
            title: '"HTTP Error 403" on YouTube download',
            fix: 'YouTube is blocking the request. Set up a <a href="#youtube-settings">proxy</a> or use <a href="#youtube-settings">cookies</a>.'
        },
        {
            title: '"FFmpeg not found"',
            fix: 'Install FFmpeg via your package manager and ensure it\'s on your PATH.'
        },
        {
            title: 'LLM JSON parse errors',
            fix: 'Disable <code>api.llm_support_json</code> or switch to a model that reliably outputs JSON. Delete <code>output/</code> folder and retry.'
        },
        {
            title: 'Subtitle timing is off',
            fix: 'Enable <code>demucs: true</code>. Background noise can cause whisperX alignment to drift.'
        },
        {
            title: 'Translation quality is poor',
            fix: 'Use a stronger model (see <a href="#api-config">model recommendations</a>), enable <code>reflect_translate: true</code>, and review terminology with <code>pause_before_translate: true</code>.'
        }
    ],
    helpLinks: [
        { label: 'Free AI QA Agent', href: 'https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh' },
        { label: 'GitHub Issues',    href: 'https://github.com/Huanshere/VideoLingo/issues' },
        { label: 'Email: team@videolingo.io', href: 'mailto:team@videolingo.io' }
    ]
};