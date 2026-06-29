/**
 * rui-demos · 共享 demo 启动器
 * ----------------------------------------------------------------------
 * 6 个类型模板（type-a..type-f）原本各自重复：
 *   1) IIFE 包装
 *   2) window.Vue || window.YrySceneCard 守卫
 *   3) 读取 window.DEMO_CARD_DATA / DEMO_MOCK_DATA
 *   4) YrySceneCard.mount(card, #scene-card)
 *
 * 该 helper 把 (1)-(4) 抽出，类型模板只需传入 Vue app options，
 * 例如：`mountDemoApp({ data: ..., methods: ..., beforeUnmount: ... })`。
 *
 * 用法（以 type-a 为例）：
 *   <script src="../../../../cdn/yry-scene-card/index.js"></script>
 *   <script src="../../../../assets/demo-mount.js"></script>
 *   <script src="index.js"></script>
 *
 *   // index.js
 *   mountDemoApp({
 *       data:     function () { return { input: '', running: false }; },
 *       methods:  { runTool: function () { ... } },
 *       beforeUnmount: function () { this.running = false; }
 *   });
 */
(function () {
    'use strict';

    /**
     * 等待 YrySceneCard 就绪后挂载；窗口已就绪则直接执行。
     * @param {HTMLElement} el
     * @param {object} cardData
     */
    function mountSceneCard(el, cardData) {
        function doMount() {
            if (el && window.YrySceneCard && cardData) {
                window.YrySceneCard.mount(cardData, el);
            }
        }
        if (window.YrySceneCard) { doMount(); return; }
        document.addEventListener('yry-scene-card-ready', function once() {
            document.removeEventListener('yry-scene-card-ready', once);
            doMount();
        });
    }

    /**
     * 启动 demo：挂载场景卡 + 创建并挂载 Vue 应用。
     * @param {object} appOptions - Vue 3 app options（data/methods/computed/mounted/beforeUnmount…）
     */
    window.mountDemoApp = function (appOptions) {
        if (!window.Vue || !window.YrySceneCard) {
            console.warn('[rui-demos] Vue or YrySceneCard not loaded yet; aborting mount.');
            return;
        }
        var cardEl = document.getElementById('scene-card');
        mountSceneCard(cardEl, window.DEMO_CARD_DATA);

        var app = window.Vue.createApp(appOptions || {});
        app.mount('#demo-app');
    };
})();