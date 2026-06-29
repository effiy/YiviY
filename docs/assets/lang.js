/**
 * VideoLingo Docs — 全局语言状态管理器
 * ----------------------------------------------------------------------
 * 为独立 Vue 3 应用之间提供共享的语言状态。每个组件通过
 * mountDocComponent() 挂载为独立 App，无法使用 Vue 的
 * provide/inject 或 Pinia；因此采用 vanilla-JS 事件总线。
 *
 * 加载顺序：必须在 include.js 之前加载，确保所有组件的
 * data.js / index.js 执行时 window.VL_LANG 已就绪。
 *
 * API:
 *   VL_LANG.current           当前语言代码（只读）
 *   VL_LANG.available         语言列表 Array<{code, label, native, emoji}>
 *   VL_LANG.setLanguage(code) 切换语言 → 持久化 → 派发事件
 *   VL_LANG.onChange(fn)      注册监听器，返回取消订阅函数
 *
 * 事件:
 *   document 上派发 CustomEvent 'vl-lang-changed'
 *   event.detail = { lang: code }
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'vl-docs-lang';
    var DEFAULT_LANG = 'en';

    var AVAILABLE = [
        { code: 'en',    label: 'English',    native: 'English',   emoji: '🇬🇧' },
        { code: 'zh-CN', label: '简体中文',  native: '简体中文', emoji: '🇨🇳' },
        { code: 'zh-TW', label: '繁體中文',  native: '繁體中文', emoji: '🇭🇰' },
        { code: 'ja',    label: '日本語',    native: '日本語',   emoji: '🇯🇵' },
        { code: 'es',    label: 'Español',   native: 'Español',  emoji: '🇪🇸' },
        { code: 'ru',    label: 'Русский',   native: 'Русский',  emoji: '🇷🇺' },
        { code: 'fr',    label: 'Français',  native: 'Français', emoji: '🇫🇷' }
    ];

    /* 构建 code → item 查找表 */
    var LANG_MAP = {};
    AVAILABLE.forEach(function (lang) {
        LANG_MAP[lang.code] = lang;
    });

    /* ── 解析初始语言 ────────────────────────────────── */

    function resolveInitial() {
        /* 1. localStorage */
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && LANG_MAP[saved]) return saved;
        } catch (e) { /* localStorage 不可用 */ }

        /* 2. 浏览器语言 */
        var navLang = (navigator.language || '').toLowerCase();
        if (navLang.indexOf('zh-tw') === 0 || navLang.indexOf('zh-hk') === 0) return 'zh-TW';
        if (navLang.indexOf('zh') === 0) return 'zh-CN';
        var primary = navLang.split('-')[0];
        if (LANG_MAP[primary]) return primary;

        /* 3. 默认值 */
        return DEFAULT_LANG;
    }

    var _current = resolveInitial();
    var _listeners = [];

    /* ── 公开 API ────────────────────────────────────── */

    window.VL_LANG = {
        get current() {
            return _current;
        },

        get available() {
            return AVAILABLE;
        },

        setLanguage: function (code) {
            if (!LANG_MAP[code]) return;
            if (_current === code) return;
            _current = code;

            /* 持久化 */
            try {
                localStorage.setItem(STORAGE_KEY, code);
            } catch (e) { /* ignore */ }

            /* 通知所有监听器 */
            var event = new CustomEvent('vl-lang-changed', {
                detail: { lang: code }
            });
            document.dispatchEvent(event);

            /* 兼容旧式回调注册 */
            _listeners.forEach(function (fn) {
                try { fn(code); } catch (e) { /* 隔离错误 */ }
            });
        },

        onChange: function (fn) {
            if (typeof fn !== 'function') return function () {};
            _listeners.push(fn);
            return function unsubscribe() {
                var idx = _listeners.indexOf(fn);
                if (idx >= 0) _listeners.splice(idx, 1);
            };
        }
    };
})();
