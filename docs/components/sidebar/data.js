/**
 * Sidebar 数据源
 * ----------------------------------------------------------------------
 * 抽离 sidebar 的展示数据（logo / 导航分组 / footer 链接），
 * 与模板/样式解耦，便于后续维护。
 * 通过 window.SIDEBAR_CONFIG 单一对象暴露，供 Vue 组件读取。
 *
 * 数据形态遵循 mount-component.js 的 i18n:true 约定：
 *   - 顶层 keys 中, 语言 code (en / zh-CN / ...) 对应各语言的 groups 切片
 *   - 非语言 code 的键（这里仅为 constants）由 resolveI18nData 自动注入,
 *     模板可通过 this.logo / this.langs / this.footerLinks 直接访问
 *   - 切换语言时, wrapI18n 自动把当前语言 slice 的属性替换到 Vue 实例,
 *     模板无需任何 i18n 监听代码
 *
 * 语言列表：直接读取 window.VL_LANG.available。
 * 加载顺序由 docs/index.html 保证——lang.js 永远在 sidebar 的
 * data.js 之前同步执行（lang.js 是顶层 <script>，sidebar 走
 * data-include 异步加载），因此此处可直接取，VL_LANG 必然已就绪。
 */

window.SIDEBAR_CONFIG = {
    /* ── 跨语言常量 ─────────────────────────────────── */
    constants: {
        logo: {
            icon:    'V',
            text:    'VideoLingo',
            version: 'Documentation v3.0'
        },

        langs: window.VL_LANG.available,

        footerLinks: [
            { label: 'GitHub',  href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'SaaS',    href: 'https://videolingo.io' },
            { label: 'AI Help', href: 'https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh' }
        ]
    },

    /* ── 多语言导航分组 ───────────────────────────────── */
    'en': {
        groups: [
            {
                title: 'Get Started',
                items: [
                    { label: 'Introduction',    href: '#intro',         active: true  },
                    { label: 'Quick Start',     href: '#quick-start',   active: false },
                    { label: 'Installation',    href: '#installation',  active: false }
                ]
            },
            {
                title: 'Core Workflow',
                items: [
                    { label: 'Pipeline Steps',  href: '#workflow',       active: false },
                    { label: 'Video Download',  href: '#download',       active: false },
                    { label: 'Transcription',   href: '#transcription',  active: false },
                    { label: 'Translation',     href: '#translation',    active: false },
                    { label: 'Dubbing',         href: '#dubbing',        active: false }
                ]
            },
            {
                title: 'Configuration',
                items: [
                    { label: 'config.yaml',     href: '#config',            active: false },
                    { label: 'API Setup',       href: '#api-config',        active: false },
                    { label: 'TTS Methods',     href: '#tts-methods',       active: false },
                    { label: 'YouTube Settings',href: '#youtube-settings',  active: false }
                ]
            },
            {
                title: 'Advanced',
                items: [
                    { label: 'Docker',           href: '#docker',           active: false },
                    { label: 'Batch Processing', href: '#batch',            active: false },
                    { label: 'Custom TTS',       href: '#custom-tts',       active: false },
                    { label: 'Troubleshooting',  href: '#troubleshooting',  active: false },
                    { label: 'Translations',     href: '#translations',     active: false },
                    { label: 'Code Activity',    href: '#code-activity',    active: false },
                    { label: 'License',         href: '#license',          active: false },
                    { label: 'Contact Us',      href: '#contact',          active: false }
                ]
            }
        ]
    },

    'zh-CN': {
        groups: [
            {
                title: '快速开始',
                items: [
                    { label: '项目介绍',       href: '#intro',         active: true  },
                    { label: '快速上手',       href: '#quick-start',   active: false },
                    { label: '安装指南',       href: '#installation',  active: false }
                ]
            },
            {
                title: '核心流程',
                items: [
                    { label: '流水线步骤',     href: '#workflow',       active: false },
                    { label: '视频下载',       href: '#download',       active: false },
                    { label: '语音转录',       href: '#transcription',  active: false },
                    { label: '文本翻译',       href: '#translation',    active: false },
                    { label: '配音生成',       href: '#dubbing',        active: false }
                ]
            },
            {
                title: '配置说明',
                items: [
                    { label: 'config.yaml',     href: '#config',           active: false },
                    { label: 'API 设置',        href: '#api-config',       active: false },
                    { label: 'TTS 方案对比',    href: '#tts-methods',      active: false },
                    { label: 'YouTube 设置',    href: '#youtube-settings', active: false }
                ]
            },
            {
                title: '高级功能',
                items: [
                    { label: 'Docker 部署',     href: '#docker',          active: false },
                    { label: '批量处理',        href: '#batch',           active: false },
                    { label: '自定义 TTS',      href: '#custom-tts',      active: false },
                    { label: '故障排除',        href: '#troubleshooting', active: false },
                    { label: '多语言翻译',      href: '#translations',    active: false },
                    { label: '代码活跃度',      href: '#code-activity',   active: false },
                    { label: '开源协议',        href: '#license',          active: false },
                    { label: '联系我们',        href: '#contact',          active: false }
                ]
            }
        ]
    },





};