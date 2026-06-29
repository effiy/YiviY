/* ═══════════════════════════════════════════════════════════════════════════
   YrY CDN — YryTagChip · Vue 3 标签芯片组件 (单文件入口)

   适用: 卡片内的标签行 (tags-row) · 状态徽标 · 角色分类

   本文件职责:
     1) 通过 createAsyncMountAPI 暴露 window.YryTagChip 占位 { mount } (异步期间可调用入队)
     2) 通过 yryBootstrapFromCurrentScript 自动加载 ../shared/yry-loader.js 并传入 callerSrc
     3) 由 yryLoadComponent 注入 index.css + 加载 data.js + 派发 ready/error 事件
     4) 首次初始化时 fetch 同目录的 index.html, DOMParser 提取
        <script type="text/x-template" id="yry-tag-chip-tpl"> 作为 Vue template
     5) 模板就绪后通过 mountAPI.setComponentOptions 将 window.YryTagChip 替换为 Vue 组件 options

   页面使用方式 (宿主页面):
     <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
     <script src="../../../../cdn/yry-tag-chip/index.js"></script>
     <div id="tag-row"></div>
     <script>
       // 方式 1: 直接 createApp
       Vue.createApp(window.YryTagChip, { text: '自建', modifier: 'accent' }).mount('#tag-row');

       // 方式 2: 异步安全 (推荐)
       window.YryTagChip.mount({ text: '...', modifier: '...' }, '#tag-row').then(app => { ... });
     </script>
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var COMPONENT_NAME = 'YryTagChip';
    var SELF_SRC = (document.currentScript && document.currentScript.src) || '';
    var mountAPI = null;

    /* ── 统一失败处理 ────────────────────────────────────────── */
    function _fail(ctx, err) {
        console.error('[' + COMPONENT_NAME + ']', err);
        if (ctx && typeof ctx.dispatchError === 'function') ctx.dispatchError(err);
        if (mountAPI) mountAPI.rejectMountQueue(err);
    }

    /* ── onReady: 配置就绪后由 yryLoadComponent 调用 ─────────── */
    function _onReady(cfg, ctx) {
        ctx.fetchTemplate(cfg.templateId, cfg.loadTimeoutMs)
            .then(function (tpl) {
                mountAPI.setComponentOptions({
                    name: COMPONENT_NAME,
                    template: tpl,
                    props: {
                        /* 必填: 标签文本 */
                        text:     { type: String, required: true },
                        /* 可选: 颜色变体 (accent | info | cyan | green | purple | red | warn | blue) */
                        modifier: { type: String, default: function () { return cfg.defaults.modifier; } },
                        /* 可选: 提供则渲染为 <a>, 否则渲染为 <span> */
                        href:     { type: String, default: '' }
                    }
                });
                ctx.dispatchReady();
                mountAPI.flushMountQueue();
            })
            .catch(function (err) { _fail(ctx, err); });
    }

    /* ── bootstrap: loader 就绪后才执行 (createAsyncMountAPI 等需要 window 全局) ── */
    function _bootstrap() {
        mountAPI = createAsyncMountAPI({ apiNamespace: COMPONENT_NAME });

        yryBootstrapFromCurrentScript({
            configKey:     'YRY_TAG_CHIP_CONFIG',
            cssMarker:     'yry-tag-chip-css',
            readyEvent:    'yry-tag-chip-ready',
            errorEvent:    'yry-tag-chip-error',
            componentName: COMPONENT_NAME,
            callerSrc:     SELF_SRC,
            defaultConfig: {
                templateId:    'yry-tag-chip-tpl',
                loadTimeoutMs: 5000,
                defaults: { modifier: 'info' }
            },
            onReady: _onReady
        }, function () {
            /* yry-loader.js 加载失败 (例如 404): 让所有挂队的 mount() Promise reject */
            _fail(null, new Error('yry-loader.js 未加载'));
        });
    }

    /* ── bootstrap: loader 已就绪则直接调用（loader 由 docs/index.html 预加载） ── */
    _bootstrap();
})();