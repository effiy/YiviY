/* ═══════════════════════════════════════════════════════════════════════════
   YrY CDN — YryBackTop · Vue 3 回到顶部按钮 (单文件入口)

   适用: 任意需要回到顶部功能的页面 · 零配置自初始化

   本文件职责:
     1) 通过 yryBootstrapFromCurrentScript 自动加载 ../shared/yry-loader.js 并传入 callerSrc
     2) 由 yryLoadComponent 注入 index.css + 加载 data.js + 派发 ready/error 事件
     3) onReady 内 fetch 同目录 index.html, DOMParser 提取
        <script type="text/x-template" id="yry-back-top-tpl"> 作为 Vue template
     4) 自动创建宿主 <div id="yry-back-top-host"> 并挂载到 body (零配置, 调用方无需手动 mount)
     5) Vue 应用 mounted 时通过 AbortController 注册 scroll 监听;
        beforeUnmount 调用 controller.abort() 释放监听句柄, 防止重复挂载时泄漏

   设计原则:
     · 与 scene-card / breadcrumb / toast / tag-chip 共用 yryLoadComponent bootstrap 链,
       自动注入 index.css + 加载 data.js, 不再需要 demo 页面手动 <link> 样式。
     · 默认行为不变 (向下滚动超过 400px 显示, 点击平滑回顶), 但所有阈值/偏移/图标/标签
       通过 data.js 的 defaults 集中调整。
     · 入口处显式判断 window.yryBootstrapFromCurrentScript 是否就绪: 若本页是首个加载
       的 CDN 组件, shared loader 还未注入, 这里需要先加载它再调用 _bootstrap();

   页面使用方式 (宿主页面):
     <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
     <script src="../../../../cdn/yry-back-top/index.js"></script>

   无需写任何 JS 或 HTML — 脚本加载后自动创建按钮并绑定事件。
   进阶用法: 修改 data.js 的 defaults, 或在页面加载前通过
     window.YRY_BACK_TOP_CONFIG = { defaults: { threshold: 200, ... } };
   覆盖配置。
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var COMPONENT_NAME = 'YryBackTop';

    /* ── 抓取 SELF_SRC (script.onload 等异步回调中 document.currentScript 已为 null,
           故必须在 IIFE 顶层一次性捕获) ── */
    var SELF_SRC = (document.currentScript && document.currentScript.src) || '';

    /* ── 单例状态 (闭包内共享) ──────────────────────────────────── */
    var _app          = null;  // Vue app 实例 (单例)
    var _scrollCtrl   = null;  // AbortController 用于卸载时释放 scroll 监听
    var _cfg          = null;  // 当前配置 (data.js + defaultConfig 浅合并结果)
    var _loaderCtx    = null;  // yryLoadComponent 传入的 ctx (fetchTemplate/dispatchReady/...)
    var _loaderReady  = false; // data.js 是否已就绪

    /* ── 字段快捷访问 (data.js 的 runtime 配置嵌套在 defaults 中, 这里统一解包) ── */
    function _threshold()    { return _cfg.defaults.threshold;    }
    function _size()         { return _cfg.defaults.size;         }
    function _bottom()       { return _cfg.defaults.bottomOffset; }
    function _right()        { return _cfg.defaults.rightOffset;  }
    function _zIndex()       { return _cfg.defaults.zIndex;       }
    function _iconChar()     { return _cfg.defaults.iconChar;     }
    function _ariaLabel()    { return _cfg.defaults.ariaLabel;    }
    function _hostId()       { return _cfg.defaults.hostId;       }

    /* ── 懒挂载 Vue 应用 (template 已抓取后由 onReady 调用) ─────── */
    function _mountApp(templateHTML) {
        if (_app) return;  // 单例保护: 仅挂载一次
        if (!window.Vue) {
            throw new Error('Vue 3 未加载, 请先引入 vue.global.prod.js');
        }

        /* ── 创建并复用宿主 div (避免重复挂载时重复创建) ─── */
        var host = document.getElementById(_hostId());
        if (!host) {
            host = document.createElement('div');
            host.id = _hostId();
            document.body.appendChild(host);
        } else if (host._yryBackTopInstance) {
            /* 宿主 div 已被本组件实例占用, 直接复用 */
        }

        _app = window.Vue.createApp({
            template: templateHTML,
            data: function () {
                return {
                    visible:   window.scrollY > _threshold(),
                    icon:      _iconChar(),
                    ariaLabel: _ariaLabel()
                };
            },
            computed: {
                /* 内联样式 (位置/尺寸/层级) — 全部从 data.js 配置派生, 运行时可热改 */
                btnStyle: function () {
                    return {
                        width:        _size()         + 'px',
                        height:       _size()         + 'px',
                        right:        _right()        + 'px',
                        bottom:       _bottom()       + 'px',
                        zIndex:       _zIndex()
                    };
                }
            },
            methods: {
                scrollToTop: function () {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            },
            mounted: function () {
                var self = this;

                /* AbortController: 卸载时一次性中断所有监听, 避免重复挂载导致
                   监听器堆叠 / 资源泄漏 */
                _scrollCtrl = new AbortController();

                var ticking = false;
                function onScroll() {
                    if (ticking) return;
                    requestAnimationFrame(function () {
                        self.visible = window.scrollY > _threshold();
                        ticking = false;
                    });
                    ticking = true;
                }
                window.addEventListener('scroll', onScroll, {
                    passive: true,
                    signal:  _scrollCtrl.signal
                });

                /* 同步一次初始可见性 (应对页面刷新时已滚动到底部的情况) */
                this.visible = window.scrollY > _threshold();

                host._yryBackTopInstance = this; // 标记宿主已被本组件占用
            },
            beforeUnmount: function () {
                /* 释放 scroll 监听句柄 + 重置单例状态, 下次 onReady 重新挂载 */
                if (_scrollCtrl) {
                    _scrollCtrl.abort();
                    _scrollCtrl = null;
                }
                var h = document.getElementById(_hostId());
                if (h) h._yryBackTopInstance = null;
                _app = null;
            }
        });

        _app.mount(host);

        if (_loaderCtx) _loaderCtx.dispatchReady();
    }

    /* ── onReady: 配置就绪后由 yryLoadComponent 调用 ─────────── */
    function _onReady(cfg, ctx) {
        _cfg = cfg;
        _loaderCtx = ctx;
        _loaderReady = true;

        ctx.fetchTemplate(cfg.templateId, cfg.loadTimeoutMs)
            .then(_mountApp)
            .catch(function (err) {
                console.error('[' + COMPONENT_NAME + '] 模板加载失败:', err);
                ctx.dispatchError(err);
            });
    }

    /* ── bootstrap: loader 就绪后才执行 ──────────────────────── */
    function _bootstrap() {
        window.yryBootstrapFromCurrentScript({
            configKey:     'YRY_BACK_TOP_CONFIG',
            cssMarker:     'yry-back-top-css',
            readyEvent:    'yry-back-top-ready',
            errorEvent:    'yry-back-top-error',
            componentName: COMPONENT_NAME,
            callerSrc:     SELF_SRC,
            defaultConfig: {
                templateId:    'yry-back-top-tpl',
                loadTimeoutMs: 5000,
                defaults: {
                    threshold:    400,
                    size:         42,
                    bottomOffset: 28,
                    rightOffset:  28,
                    iconChar:     '\u2191', // ↑
                    ariaLabel:    '回到顶部',
                    hostId:       'yry-back-top-host',
                    zIndex:       100
                }
            },
            onReady: _onReady
        }, function () {
            /* yry-loader.js 加载失败 (例如 404) 时的回退:
               back-top 是 nice-to-have 功能, 与 reject queue 不同, 我们保留页面不崩溃,
               仅在控制台给出明确提示, 不主动渲染也无错误冒泡。 */
            console.error('[' + COMPONENT_NAME + '] yry-loader.js 未加载, 组件无法初始化');
        });
    }

    /* ── 入口: loader 已就绪则立即 bootstrap, 否则显式注入一次 ── */
    if (typeof window.yryBootstrapFromCurrentScript === 'function') {
        _bootstrap();
    } else {
        var loaderScript = document.createElement('script');
        loaderScript.src = SELF_SRC
            ? new URL('../shared/yry-loader.js', SELF_SRC).href
            : '../shared/yry-loader.js';
        loaderScript.onload = _bootstrap;
        loaderScript.onerror = function () {
            console.error('[' + COMPONENT_NAME + '] yry-loader.js 加载失败');
        };
        document.head.appendChild(loaderScript);
    }
})();
