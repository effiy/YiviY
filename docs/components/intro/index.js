/**
 * Intro Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * 语言切换由 i18n: true 透明处理——模板无需修改。
 *
 * 渲染分工：本组件只渲染 #intro-feature-N / #intro-card-N 占位 div，
 *          由 mounted() 钩子遍历调用 window.YrySceneCard.mount() 注入
 *          实际卡片内容（依赖 cdn/yry-scene-card）。
 *          语言切换后通过 $nextTick 重新挂载卡片，并在挂载前先 unmount 旧 app，
 *          避免 YrySceneCard 的 Vue 实例随切换次数线性泄漏。
 */
mountDocComponent({
    name: 'DocIntro',
    templateId: 'intro-template',
    dataKey: 'INTRO_CONFIG',
    i18n: true,
    extra: {
        mounted: function () {
            var self = this;
            /* 追踪所有挂载的 YrySceneCard app 实例,语言切换/卸载时统一 unmount。
               挂载到组件实例上以便 beforeUnmount 生命周期钩子访问。 */
            this._mountedApps = [];

            function unmountAll() {
                (self._mountedApps || []).forEach(function (app) {
                    try { if (app && typeof app.unmount === 'function') app.unmount(); }
                    catch (e) { /* 静默忽略:Vue 内部已自动回收 */ }
                });
                self._mountedApps = [];
            }

            /* 挂载 feature 卡片网格 + site 卡片网格 */
            function mountAll() {
                unmountAll();
                mountSceneCards(self.overview.features || [], '.intro-feature-slot', self._mountedApps);
                mountSceneCards(self.cards || [],                  '.intro-card-slot',    self._mountedApps);
            }
            mountAll();

            /* 语言切换后 DOM 被 Vue 重建,重新挂载所有卡片 */
            document.addEventListener('vl-lang-changed', function () {
                self.$nextTick(mountAll);
            });
        },
        /* Vue 3 生命周期: 组件卸载时清理所有 YrySceneCard 子 app */
        beforeUnmount: function () {
            (this._mountedApps || []).forEach(function (app) {
                try { if (app && typeof app.unmount === 'function') app.unmount(); }
                catch (e) { /* 静默忽略 */ }
            });
            this._mountedApps = [];
        }
    }
});

/**
 * 把一组卡片 props 数组挂载到对应 slot 元素上。
 *  - slotSelector:  在 #intro 内查找 slot 的 CSS 选择器
 *  - appsCollector: 数组,每次成功的 mount() Promise resolve 时把 app 实例推入,
 *                   用于宿主在语言切换/卸载时统一 unmount
 *  - YrySceneCard 已暴露占位 mount(): 直接调用,模板未就绪会内部入队
 *  - YrySceneCard 还没就绪: 监听 yry-scene-card-ready 事件,ready 后再挂载
 */
function mountSceneCards(items, slotSelector, appsCollector) {
    var slots = document.querySelectorAll('#intro ' + slotSelector);
    if (!slots.length || !items.length) return;

    function mountAll() {
        items.forEach(function (item, i) {
            if (!slots[i]) return;
            // 清空可能残留的旧内容(语言切换时 Vue 会重新生成 slot)
            slots[i].innerHTML = '';
            var ret = window.YrySceneCard.mount(item, slots[i]);
            // YrySceneCard.mount() 返回 Promise<app>,resolve 后收集以备清理
            if (ret && typeof ret.then === 'function' && appsCollector) {
                ret.then(function (app) { appsCollector.push(app); }, function () { /* 静默忽略挂载失败 */ });
            }
        });
    }

    if (window.YrySceneCard) {
        mountAll();
        return;
    }
    document.addEventListener('yry-scene-card-ready', function once() {
        document.removeEventListener('yry-scene-card-ready', once);
        if (window.YrySceneCard) mountAll();
    });
}
