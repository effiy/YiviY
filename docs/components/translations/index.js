/**
 * Translations Vue 3 组件
 * ----------------------------------------------------------------------
 * 多语言 README 渲染器。语言切换由全局 VL_LANG 管理，
 * 通过 mountDocComponent 的 i18n:true 选项实现透明切换——
 * 当前语言的内容属性由 wrapI18n 在语言变更时自动替换到 Vue 实例。
 *
 * 模板直接访问扁平字段（如 languages.inputTitle），无需中间 computed。
 *
 * 视觉过渡：切换语言时短暂添加 `is-lang-switching` body 类，由
 * docs/styles/transitions.css 定义 180ms 的淡出过渡，
 * 避免多语言内容替换时出现视觉跳变。
 *
 * 备注（2026-06-29）：演示视频 Demo 章节已上移至 docs/components/intro/
 * （紧随 overview 之后），URL 常量同步迁入 INTRO_CONFIG.constants.demoVideos。
 */

mountDocComponent({
    name: 'DocTranslations',
    templateId: 'translations-template',
    dataKey: 'TRANSLATIONS_CONTENT',
    i18n: true,
    extra: {
        mounted: function () {
            var self = this;

            /* 订阅全局语言变更，触发 180ms 视觉过渡 */
            document.addEventListener('vl-lang-changed', function (e) {
                if (!e.detail || !e.detail.lang) return;
                if (e.detail.lang === self.currentLang) return;

                document.body.classList.add('is-lang-switching');
                setTimeout(function () {
                    document.body.classList.remove('is-lang-switching');
                }, 180);
            });
        }
    }
});