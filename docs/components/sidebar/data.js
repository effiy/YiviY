/**
 * Sidebar 数据源
 * ----------------------------------------------------------------------
 * 抽离 sidebar 的展示数据（logo / 导航分组 / footer 链接），
 * 与模板/样式解耦，便于后续维护。
 * 通过 window.SIDEBAR_CONFIG 单一对象暴露，供 Vue 组件读取。
 */

window.SIDEBAR_CONFIG = {
    logo: {
        icon: 'V',
        text: 'VideoLingo',
        version: 'Documentation v3.0'
    },
    groups: [
        {
            title: 'Get Started',
            items: [
                { label: 'Introduction', href: '#intro',        active: true  },
                { label: 'Quick Start',  href: '#quick-start',  active: false },
                { label: 'Installation', href: '#installation', active: false }
            ]
        },
        {
            title: 'Core Workflow',
            items: [
                { label: 'Pipeline Steps', href: '#workflow',      active: false },
                { label: 'Video Download', href: '#download',      active: false },
                { label: 'Transcription',  href: '#transcription', active: false },
                { label: 'Translation',    href: '#translation',   active: false },
                { label: 'Dubbing',        href: '#dubbing',      active: false }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'config.yaml',     href: '#config',           active: false },
                { label: 'API Setup',       href: '#api-config',       active: false },
                { label: 'TTS Methods',     href: '#tts-methods',      active: false },
                { label: 'YouTube Settings', href: '#youtube-settings', active: false }
            ]
        },
        {
            title: 'Advanced',
            items: [
                { label: 'Docker',           href: '#docker',          active: false },
                { label: 'Batch Processing', href: '#batch',           active: false },
                { label: 'Custom TTS',       href: '#custom-tts',      active: false },
                { label: 'Troubleshooting',  href: '#troubleshooting', active: false },
                { label: 'Translations',     href: '#translations',    active: false }
                /* Code Activity 现已嵌入到 Introduction 区域，由 intro 组件渲染，
                   不再保留独立 sidebar 入口，避免重复导航。 */
            ]
        }
    ],
    footerLinks: [
        { label: 'GitHub',  href: 'https://github.com/Huanshere/VideoLingo' },
        { label: 'SaaS',    href: 'https://videolingo.io' },
        { label: 'AI Help', href: 'https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh' }
    ]
};