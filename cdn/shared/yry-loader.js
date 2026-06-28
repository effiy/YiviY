/* ═══════════════════════════════════════════════════════════════════════════
   YrY CDN · shared/yry-loader.js — 共享组件加载器 + 工具集

   职责 (供所有 cdn/* 组件复用,消除 ~150 行重复样板):
     1) yryLoadComponent       加载组件: SELF_SRC 推导 + CSS 注入 + data.js 自动加载
                                + 模板 fetch (AbortController) + ready/error 事件派发
     2) yryBootstrapFromCurrentScript 组件入口 bootstrap: 自动注入共享 loader, 自动传 callerSrc
     3) createAsyncMountAPI    异步 mount 队列管理: 给"需要 mount(props, selector) 异步安全 API"的组件用

   使用方式 (component 侧):
     // ── 方式 A: 有 mount() API 的组件 (breadcrumb / tag-chip / scene-card)
     var mountAPI = createAsyncMountAPI({ apiNamespace: 'YryBreadcrumb' });

     function _onReady(cfg, ctx) {
         ctx.fetchTemplate(cfg.templateId, cfg.loadTimeoutMs).then(function (tpl) {
             mountAPI.setComponentOptions({
                 name: 'YryBreadcrumb', template: tpl, props: { ... }
             });
             ctx.dispatchReady();
             mountAPI.flushMountQueue();
         }).catch(function (err) {
             ctx.dispatchError(err);
             mountAPI.rejectMountQueue(err);
         });
     }

     yryBootstrapFromCurrentScript({
         configKey:     'YRY_BREADCRUMB_CONFIG',
         cssMarker:     'yry-breadcrumb-css',
         readyEvent:    'yry-breadcrumb-ready',
         errorEvent:    'yry-breadcrumb-error',
         componentName: 'YryBreadcrumb',
         defaultConfig: { ... },
         onReady: _onReady
     }, function () {  // loader.js 404 fallback
         mountAPI.rejectMountQueue(new Error('yry-loader.js 未加载'));
     });

     // ── 方式 B: 自定义 API 的组件 (toast 等, 直接用 yryBootstrapFromCurrentScript + 自管队列)

   加载链:
     component/index.js  →  yryBootstrapFromCurrentScript 自动注入 ../shared/yry-loader.js
                          →  yryLoadComponent 注入 CSS + 加载 data.js
                          →  data.js 就绪 → 调用 onReady(cfg, ctx)
                          →  component 在 onReady 内 fetchTemplate + 挂载 Vue
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ════════════════════════════════════════════════════════════════════════
       工具 1: 异步 mount 队列 (createAsyncMountAPI)
       立即在 window[apiNamespace] 暴露 { mount } 占位, 模板就绪后 setComponentOptions
       切换为完整 Vue options, flushMountQueue 回放早前入队的 mount() Promise。
       ════════════════════════════════════════════════════════════════════════ */

    /**
     * @param {object} [opts]
     * @param {string} [opts.apiNamespace] 暴露占位 API 的 window key (如 'YryBreadcrumb')
     * @returns {{
     *   mount: function,
     *   setComponentOptions: function,
     *   flushMountQueue: function,
     *   rejectMountQueue: function,
     *   getComponentOptions: function
     * }}
     */
    function createAsyncMountAPI(opts) {
        opts = opts || {};
        var componentOptions = null;
        var mountQueue = [];

        /* ── mount(props, selector) → Promise ────────────────────
           · 模板就绪: 立即 createApp.mount 并 resolve
           · 模板未就绪: 入队, 等 flushMountQueue 统一处理 */
        function mount(props, selector) {
            return new Promise(function (resolve, reject) {
                if (componentOptions && window.Vue) {
                    try {
                        resolve(window.Vue.createApp(componentOptions, props).mount(selector));
                    } catch (err) { reject(err); }
                    return;
                }
                mountQueue.push({ props: props, selector: selector, resolve: resolve, reject: reject });
            });
        }

        /* ── 模板就绪后: 把 window 上的占位替换为完整 Vue options ──── */
        function setComponentOptions(newOptions) {
            componentOptions = newOptions;
            if (opts.apiNamespace) {
                /* 在 options 上挂一个非枚举的 .mount, 这样 window[ns] 始终保留
                   异步 mount API (Vue 的选项检查走 Object.keys + 已知白名单,
                   不会触发 "Invalid option: mount" 警告)。                 */
                Object.defineProperty(newOptions, 'mount', {
                    value:      mount,
                    enumerable: false,
                    configurable: true,
                    writable:   false
                });
                window[opts.apiNamespace] = newOptions;
            }
        }

        /* ── 排空早前入队的 mount() 调用 ──────────────────────── */
        function flushMountQueue() {
            var q = mountQueue;
            mountQueue = [];
            q.forEach(function (entry) {
                try {
                    entry.resolve(window.Vue.createApp(componentOptions, entry.props).mount(entry.selector));
                } catch (err) { entry.reject(err); }
            });
        }

        /* ── 模板加载失败时让所有挂队的 mount() Promise reject ── */
        function rejectMountQueue(err) {
            var q = mountQueue;
            mountQueue = [];
            q.forEach(function (entry) { entry.reject(err); });
        }

        /* ── 立即暴露占位 API (异步加载期间早期调用也能正常入队) ── */
        if (opts.apiNamespace) {
            window[opts.apiNamespace] = { mount: mount };
        }

        return {
            mount:               mount,
            setComponentOptions: setComponentOptions,
            flushMountQueue:     flushMountQueue,
            rejectMountQueue:    rejectMountQueue,
            getComponentOptions: function () { return componentOptions; }
        };
    }

    /* ════════════════════════════════════════════════════════════════════════
       工具 2: 组件入口 bootstrap (yryBootstrapFromCurrentScript)
       从 document.currentScript.src 抓 SELF_SRC, 动态注入 shared/yry-loader.js,
       自动传 callerSrc 给 yryLoadComponent, 消除 4 处重复样板。
       ════════════════════════════════════════════════════════════════════════ */

    /**
     * @param {object}   loadOptions 透传给 yryLoadComponent 的参数 (callerSrc 可显式传入)
     * @param {function} [onLoaderMissing] loader.js 加载失败 (404) 时的回退回调
     *
     * 关于 callerSrc 的优先级:
     *   1. loadOptions.callerSrc  (允许调用方显式传入, 用于组件从 loaderScript.onload
     *      等非脚本上下文调用本函数, 此时 document.currentScript 为 null)
     *   2. document.currentScript.src  (组件 IIFE 顶层直接调用时, 这是组件自己的 URL)
     *   3. '' (兜底, 此时 loader 与 data.js 路径解析会回退到相对 URL)
     */
    function yryBootstrapFromCurrentScript(loadOptions, onLoaderMissing) {
        var SELF_SRC = loadOptions.callerSrc
            || (document.currentScript && document.currentScript.src)
            || '';
        var componentName = loadOptions.componentName || 'component';

        var loaderScript = document.createElement('script');
        loaderScript.src = SELF_SRC
            ? new URL('../shared/yry-loader.js', SELF_SRC).href
            : '../shared/yry-loader.js';
        loaderScript.onload = function () {
            if (!loadOptions.callerSrc) loadOptions.callerSrc = SELF_SRC;
            window.yryLoadComponent(loadOptions);
        };
        loaderScript.onerror = function () {
            console.error('[' + componentName + '] yry-loader.js 加载失败');
            if (typeof onLoaderMissing === 'function') onLoaderMissing();
        };
        document.head.appendChild(loaderScript);
    }

    /* ════════════════════════════════════════════════════════════════════════
       核心: yryLoadComponent (加载组件 + 注入 CSS + 加载 data.js + 派发事件)
       ════════════════════════════════════════════════════════════════════════ */

    /**
     * 加载一个 cdn 组件,封装 SELF_SRC 推导、CSS 自注入、data.js 自动加载、
     * 模板 fetch (AbortController)、ready/error 事件派发等通用样板。
     *
     * @param {object} options
     * @param {string}   options.configKey     window 上的配置对象名 (data.js 设置 window[configKey])
     * @param {string}   options.cssMarker     data-* 幂等标记 (不含 data- 前缀)
     * @param {string}   options.readyEvent    ready 事件名 (在 document 上派发)
     * @param {string}   options.errorEvent    error 事件名 (在 document 上派发)
     * @param {string}   options.componentName 组件名 (日志前缀)
     * @param {string}   [options.callerSrc]  组件自身 URL (由 yryBootstrapFromCurrentScript 自动注入,
     *                                        无需手动传入)
     * @param {object}   [options.defaultConfig] 缺省配置 (data.js 缺省时回退; 浅合并语义)
     * @param {function(object, object)} options.onReady 配置就绪后调用 (cfg, ctx)
     */
    function yryLoadComponent(options) {
        var configKey     = options.configKey;
        var cssMarker     = options.cssMarker;
        var readyEvent    = options.readyEvent;
        var errorEvent    = options.errorEvent;
        var componentName = options.componentName;
        var defaultConfig = options.defaultConfig || {};
        var onReady       = options.onReady;

        /* ── 脚本位置推导 (用于自动加载 data.js 与 index.css) ──
           优先使用调用方传入的 callerSrc (由 yryBootstrapFromCurrentScript 自动从
           document.currentScript.src 捕获并注入), 这样无论组件是从何路径被 <script src>
           加载,data.js / index.css / 模板都能定位到组件自身所在目录,而不是 shared/ 这个
           加载器所在目录。 */
        var SELF_SRC = options.callerSrc
            || (document.currentScript && document.currentScript.src)
            || '';
        var SELF_DIR = SELF_SRC ? SELF_SRC.substring(0, SELF_SRC.lastIndexOf('/') + 1) : '';

        /* ── 自动注入 index.css (幂等:已存在则跳过) ───────────── */
        if (SELF_DIR && !document.querySelector('link[data-' + cssMarker + ']')) {
            var cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = SELF_DIR + 'index.css';
            cssLink.setAttribute('data-' + cssMarker, '');
            document.head.appendChild(cssLink);
        }

        /* ── 读取配置: 浅合并 defaultConfig <- window[configKey] ──
           ⚠️ 浅合并只在顶层 key 上生效; 嵌套对象 (如 defaults.*) 整体替换,
           不会递归合并子属性。这是 CDN 组件的预期语义 (data.js 的 defaults 整体
           覆盖 defaultConfig 中的同名对象,避免不一致的部分覆盖)。 */
        function resolveConfig() {
            var CFG = window[configKey] || {};
            var out = {};
            var k;
            for (k in defaultConfig) {
                if (Object.prototype.hasOwnProperty.call(defaultConfig, k)) out[k] = defaultConfig[k];
            }
            for (k in CFG) {
                if (Object.prototype.hasOwnProperty.call(CFG, k)) out[k] = CFG[k];
            }
            return out;
        }

        /* ── 模板 URL 推导 (基于 index.js 自身所在目录) ──────────── */
        function getTemplateUrl() {
            if (!SELF_SRC) return null;
            try {
                return new URL('index.html', SELF_SRC).href;
            } catch (e) {
                return null;
            }
        }

        /* ── 模板加载 (AbortController 超时取消) ───────────────── */
        function fetchTemplate(templateId, timeoutMs) {
            var url = getTemplateUrl();
            if (!url) return Promise.reject(new Error('[' + componentName + '] 无法推导 index.html URL (需要通过 <script> 引入)'));
            if (!templateId) return Promise.reject(new Error('[' + componentName + '] 缺少 templateId'));
            timeoutMs = timeoutMs || 5000;

            var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
            var tid = setTimeout(function () {
                if (controller) controller.abort();
            }, timeoutMs);

            var fetchOpts = { credentials: 'same-origin' };
            if (controller) fetchOpts.signal = controller.signal;

            return fetch(url, fetchOpts)
                .then(function (r) {
                    clearTimeout(tid);
                    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + r.statusText);
                    return r.text();
                })
                .then(function (htmlText) {
                    var doc = new DOMParser().parseFromString(htmlText, 'text/html');
                    var tpl = doc.getElementById(templateId);
                    if (!tpl) throw new Error('未找到 <script type="text/x-template" id="' + templateId + '">');
                    return tpl.innerHTML;
                })
                .catch(function (err) {
                    clearTimeout(tid);
                    if (err && err.name === 'AbortError') {
                        throw new Error('模板加载超时 (' + timeoutMs + 'ms): ' + url);
                    }
                    throw err;
                });
        }

        /* ── ready / error 事件派发 ───────────────────────────────
           设计意图 (注意两者不对称):
             · readyFired 保护: Vue 组件挂载是一次性事件, 重复派发会误导监听者认为组件
               多次初始化, 故用 readyFired 标志位只派发一次。
             · error 不加 fired 保护: 组件初始化链上有多个失败点 (template/dependency/
               data.js 等), 每个失败都应被外部监听器感知, 静默吞掉错误不利于调试。 */
        var readyFired = false;
        function dispatchReady() {
            if (readyFired) return;
            readyFired = true;
            document.dispatchEvent(new CustomEvent(readyEvent, {
                detail: { component: componentName }
            }));
        }
        function dispatchError(err) {
            document.dispatchEvent(new CustomEvent(errorEvent, {
                detail: { component: componentName, error: err }
            }));
        }

        /* ── 加载 data.js: 已被预加载则跳过,否则动态注入 <script> ── */
        function _initFromData() {
            var cfg = resolveConfig();
            try {
                onReady(cfg, {
                    getTemplateUrl: getTemplateUrl,
                    fetchTemplate:  fetchTemplate,
                    dispatchReady:  dispatchReady,
                    dispatchError:  dispatchError
                });
            } catch (err) {
                console.error('[' + componentName + '] onReady 抛出异常:', err);
                dispatchError(err);
            }
        }

        if (window[configKey]) {
            /* 已被宿主页面或 demo 路径提前加载 */
            _initFromData();
        } else if (SELF_DIR) {
            var dataScript = document.createElement('script');
            dataScript.src = SELF_DIR + 'data.js';
            dataScript.onload = _initFromData;
            dataScript.onerror = function () {
                console.error('[' + componentName + '] data.js 自动加载失败,回退到默认配置');
                _initFromData();
            };
            document.head.appendChild(dataScript);
        } else {
            /* 找不到 SELF_SRC (例如 inline 脚本),直接用默认配置 */
            _initFromData();
        }
    }

    /* 暴露全局 */
    window.yryLoadComponent               = yryLoadComponent;
    window.yryBootstrapFromCurrentScript  = yryBootstrapFromCurrentScript;
    window.createAsyncMountAPI            = createAsyncMountAPI;
})();