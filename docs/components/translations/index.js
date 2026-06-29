/**
 * Translations Vue 3 组件
 * ----------------------------------------------------------------------
 * 多语言 README 渲染器。语言切换由全局 VL_LANG 管理，
 * 本组件监听 vl-lang-changed 事件同步更新。
 *
 * 数据 schema（data.js 内）：
 *   - default             默认语言 code（回退用）
 *   - constants           跨语言常量（URL / shell / thanks）
 *   - demoVideos          演示视频 URL 列表（标题按语言翻译）
 *   - content[code]       各语言完整 README 内容
 *
 * 计算属性 `langContent` 返回当前语言的扁平 content。
 * 语言切换时通过 #translations 的 data-lang 属性 + CSS
 * transition 提供平滑视觉过渡。
 */

(function () {
    'use strict';

    mountDocComponent({
        name: 'DocTranslations',
        templateId: 'translations-template',
        dataKey: 'TRANSLATIONS_CONTENT',
        extra: {
            data: function () {
                var cfg = window.TRANSLATIONS_CONTENT || {};
                return Object.assign({}, cfg, {
                    currentLang: (window.VL_LANG && window.VL_LANG.current) || (cfg.default || 'en')
                });
            },
            computed: {
                langContent: function () {
                    var map = this.content || {};
                    return map[this.currentLang] || map[this.default] || {};
                }
            },
            mounted: function () {
                var self = this;

                /* 订阅全局语言变更 */
                document.addEventListener('vl-lang-changed', function (e) {
                    if (!e.detail || !e.detail.lang) return;
                    if (e.detail.lang === self.currentLang) return;

                    /* 短暂的视觉过渡：添加 switching 类 → 更新语言 → 移除 */
                    document.body.classList.add('is-lang-switching');
                    self.currentLang = e.detail.lang;

                    /* 过渡结束后清理 */
                    setTimeout(function () {
                        document.body.classList.remove('is-lang-switching');
                    }, 180);
                });
            }
        }
    });
})();
