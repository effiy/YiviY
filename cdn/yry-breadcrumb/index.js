/* ═══════════════════════════════════════════════════════════════════════════
   YrY CDN — YryBreadcrumb · Vue 3 面包屑组件 (单文件入口)

   适用: 审查 · 测试面板 · 演示 · 计划清单 · 架构图 · 知识图谱

   本文件职责:
     1) 通过 createAsyncMountAPI 暴露 window.YryBreadcrumb 占位 { mount } (异步期间可调用入队)
     2) 通过 yryBootstrapFromCurrentScript 自动加载 ../shared/yry-loader.js 并传入 callerSrc
     3) 由 yryLoadComponent 注入 index.css + 加载 data.js + 派发 ready/error 事件
     4) 首次初始化时 fetch 同目录的 index.html, DOMParser 提取
        <script type="text/x-template" id="yry-breadcrumb-tpl"> 作为 Vue template
     5) 模板就绪后通过 mountAPI.setComponentOptions 将 window.YryBreadcrumb 替换为
        Vue 组件 options, 后续可直接 Vue.createApp(window.YryBreadcrumb, props).mount(sel)

   页面使用方式 (宿主页面):
     <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
     <script src="../../../../cdn/yry-breadcrumb/index.js"></script>
     <div id="bc-host"></div>
     <script>
       // 方式 1: 直接 createApp (需确保 yry-breadcrumb-ready 事件已触发)
       Vue.createApp(window.YryBreadcrumb, {
         items: [{ label: 'Home', href: '/' }, { label: 'Current' }]
       }).mount('#bc-host');

       // 方式 2: 异步安全 (推荐)
       window.YryBreadcrumb.mount({ items: [...] }, '#bc-host').then(app => { ... });
     </script>
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── 异步 mount API (立即暴露 window.YryBreadcrumb 占位, 模板就绪后切换为 Vue options) ── */
    var mountAPI = createAsyncMountAPI({ apiNamespace: 'YryBreadcrumb' });

    /* ── onReady: 配置就绪后由 yryLoadComponent 调用 ─────────── */
    function _onReady(cfg, ctx) {
        ctx.fetchTemplate(cfg.templateId, cfg.loadTimeoutMs)
            .then(function (tpl) {
                mountAPI.setComponentOptions({
                    name: 'YryBreadcrumb',
                    template: tpl,
                    props: {
                        items:     { type: Array,  required: true },
                        ariaLabel: { type: String, default: function () { return cfg.defaults.ariaLabel; } },
                        separator: { type: String, default: function () { return cfg.defaults.separator; } }
                    }
                });
                ctx.dispatchReady();
                mountAPI.flushMountQueue();
            })
            .catch(function (err) {
                console.error('[YryBreadcrumb] 模板加载失败:', err);
                ctx.dispatchError(err);
                mountAPI.rejectMountQueue(err);
            });
    }

    /* ── 启动: 通过 shared loader 提供的 bootstrap 工具注入 loader 并初始化 ── */
    yryBootstrapFromCurrentScript({
        configKey:     'YRY_BREADCRUMB_CONFIG',
        cssMarker:     'yry-breadcrumb-css',
        readyEvent:    'yry-breadcrumb-ready',
        errorEvent:    'yry-breadcrumb-error',
        componentName: 'YryBreadcrumb',
        defaultConfig: {
            templateId:    'yry-breadcrumb-tpl',
            loadTimeoutMs: 5000,
            defaults: {
                ariaLabel: '面包屑导航',
                separator: '/'
            }
        },
        onReady: _onReady
    }, function () {
        /* yry-loader.js 加载失败 (例如 404): 让所有挂队的 mount() Promise reject */
        mountAPI.rejectMountQueue(new Error('yry-loader.js 未加载'));
    });
})();