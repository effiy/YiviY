/**
 * <<PAGE_NAME>> 独立页配置
 * ----------------------------------------------------------------------
 * 与 components/<name>/ 不同，views/<name>/ 不挂载侧边栏，也不需要
 * data-include 跨依赖。可选地复用 4-file 组件模式 + mountDocComponent()。
 *
 * 字段说明：
 *   - constants: 全局静态值
 *   - en / zh-CN: 多语言文案（lang.js 自动挑选当前语言）
 */
window.<<PAGE_CONFIG_NAME>> = {
    constants: {
        pageName:   '<<PAGE_NAME>>',
        generatedAt: '<<GENERATED_AT>>'
    },

    i18n: true,
    en: {
        pageTitle:    '<<TITLE_EN>>',
        pageSubtitle: '<<SUBTITLE_EN>>'
    },

    'zh-CN': {
        pageTitle:    '<<TITLE_ZH>>',
        pageSubtitle: '<<SUBTITLE_ZH>>'
    }
};