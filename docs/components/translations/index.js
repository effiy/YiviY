/**
 * Translations Vue 3 组件
 * ----------------------------------------------------------------------
 * 多语言 README 渲染器：默认展示 7 种语言之一，用户切换后写入
 * localStorage，下次访问自动恢复。配置数据由 data.js 注入到
 * window.TRANSLATIONS_CONFIG 后被 data() 展开。
 *
 * 数据 schema（data.js 内）：
 *   - available           语言列表（code/native/emoji/label）
 *   - default             默认语言 code
 *   - storageKey          localStorage key
 *   - constants           跨语言常量（URL / shell / thanks）
 *   - demoVideos          演示视频 URL 列表（标题按语言翻译）
 *   - content[code]       各语言完整 README 内容
 *
 * 计算属性 `langContent` 返回当前语言的扁平 content（避开与数据字段 `content` 的命名冲突）。
 */

(function () {
    'use strict';

    /**
     * 从 localStorage / 浏览器语言 / 默认值 推断初始语言。
     * 独立于 Vue 组件（data() 阶段 methods 尚未绑定）。
     */
    function resolveInitialLang(cfg) {
        if (!cfg) return 'en';
        try {
            var saved = localStorage.getItem(cfg.storageKey);
            if (saved && cfg.content && cfg.content[saved]) return saved;
        } catch (e) { /* localStorage 不可用 */ }

        if (cfg.content) {
            var navLang = (navigator.language || '').toLowerCase();
            if (navLang.indexOf('zh-tw') === 0 || navLang.indexOf('zh-hk') === 0) return 'zh-TW';
            if (navLang.indexOf('zh') === 0) return 'zh-CN';
            var primary = navLang.split('-')[0];
            if (cfg.content[primary]) return primary;
        }
        return cfg.default || 'en';
    }

    mountDocComponent({
        name: 'DocTranslations',
        templateId: 'translations-template',
        dataKey: 'TRANSLATIONS_CONFIG',
        extra: {
            data: function () {
                var cfg = window.TRANSLATIONS_CONFIG || {};
                return Object.assign({}, cfg, {
                    currentLang: resolveInitialLang(cfg)
                });
            },
            computed: {
                // 当前语言对应的 content 对象；缺失时回落到默认语言
                langContent: function () {
                    var map = this.content || {};
                    return map[this.currentLang] || map[this.default] || {};
                }
            },
            methods: {
                setLanguage: function (code) {
                    if (this.content && this.content[code]) {
                        this.currentLang = code;
                        try {
                            localStorage.setItem(this.storageKey, code);
                        } catch (e) { /* ignore */ }
                    }
                }
            }
        }
    });
})();