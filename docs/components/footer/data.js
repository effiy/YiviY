/**
 * Footer 数据源
 * ----------------------------------------------------------------------
 * 抽离 footer 的展示数据（标签 + 链接 + 元信息）。
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 * links 为语言无关常量（URL），保持在语言 slice 内以简化模板。
 */

window.FOOTER_CONFIG = {
    en: {
        tagline: 'VideoLingo — Connect the World, Frame by Frame',
        license: 'Apache 2.0 License',
        links: [
            { label: 'GitHub',        href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'videolingo.io', href: 'https://videolingo.io' }
        ],
        meta: 'Built with ❤️ by the VideoLingo team'
    },
    'zh-CN': {
        tagline: 'VideoLingo — 连接世界每一帧',
        license: 'Apache 2.0 许可证',
        links: [
            { label: 'GitHub',        href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'videolingo.io', href: 'https://videolingo.io' }
        ],
        meta: '由 VideoLingo 团队用 ❤️ 构建'
    },
};
