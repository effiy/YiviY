/**
 * YouTube Settings 数据源
 * ----------------------------------------------------------------------
 * 抽离 youtube-settings 的展示数据（cookie 步骤 + 代理 +
 * 默认 yaml 配置），便于统一维护。通过 window 暴露，
 * 供 Vue 组件读取。
 */

window.YOUTUBE_SETTINGS_CONFIG = {
    cookieSteps: [
        'Install a browser extension like "Get cookies.txt LOCALLY"',
        'Log into YouTube in your browser',
        'Export cookies to a <code>cookies.txt</code> file',
        'Set <code>youtube.cookies_path</code> to the file path'
    ],
    proxyCode: "youtube:\n  proxy: 'http://127.0.0.1:7890'\n  # or SOCKS5:\n  # proxy: 'socks5://127.0.0.1:1080'",
    defaultCode: "youtube:\n  cookies_path: ''\n  proxy: ''\n  download_format: 'video+audio'   # or 'audio-only'\n  download_subtitles: false\n\nytb_resolution: '1080'   # 360 | 480 | 720 | 1080 | 1440 | 2160 | best"
};
