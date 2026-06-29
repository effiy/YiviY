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
    'zh-TW': {
        tagline: 'VideoLingo — 連接世界每一幀',
        license: 'Apache 2.0 授權條款',
        links: [
            { label: 'GitHub',        href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'videolingo.io', href: 'https://videolingo.io' }
        ],
        meta: '由 VideoLingo 團隊用 ❤️ 構建'
    },
    ja: {
        tagline: 'VideoLingo — フレームごとに世界をつなぐ',
        license: 'Apache 2.0 ライセンス',
        links: [
            { label: 'GitHub',        href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'videolingo.io', href: 'https://videolingo.io' }
        ],
        meta: 'VideoLingo チームが ❤️ を込めて作成'
    },
    es: {
        tagline: 'VideoLingo — Conecta el mundo, cuadro a cuadro',
        license: 'Licencia Apache 2.0',
        links: [
            { label: 'GitHub',        href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'videolingo.io', href: 'https://videolingo.io' }
        ],
        meta: 'Creado con ❤️ por el equipo de VideoLingo'
    },
    ru: {
        tagline: 'VideoLingo — Соединяем мир, кадр за кадром',
        license: 'Лицензия Apache 2.0',
        links: [
            { label: 'GitHub',        href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'videolingo.io', href: 'https://videolingo.io' }
        ],
        meta: 'Создано с ❤️ командой VideoLingo'
    },
    fr: {
        tagline: 'VideoLingo — Connectez le monde, image par image',
        license: 'Licence Apache 2.0',
        links: [
            { label: 'GitHub',        href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'videolingo.io', href: 'https://videolingo.io' }
        ],
        meta: 'Créé avec ❤️ par l\'équipe VideoLingo'
    }
};
