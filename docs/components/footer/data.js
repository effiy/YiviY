/**
 * Footer 数据源
 * ----------------------------------------------------------------------
 * 抽离 footer 的展示数据（标签 + 链接 + 元信息），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.FOOTER_CONFIG = {
    tagline: 'VideoLingo — Connect the World, Frame by Frame',
    license: 'Apache 2.0 License',
    links: [
        { label: 'GitHub',      href: 'https://github.com/Huanshere/VideoLingo' },
        { label: 'videolingo.io', href: 'https://videolingo.io' }
    ],
    meta: 'Built with ❤️ by the VideoLingo team'
};
