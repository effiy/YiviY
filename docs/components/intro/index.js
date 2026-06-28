/**
 * Intro Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * 数据来源：window.INTRO_TITLE / INTRO_LEAD / INTRO_CARDS / INTRO_CALLOUT
 *          （多 key 由 extra.data 自定义 data() 收集）
 *
 * 渲染分工：
 *   - 卡片网格：本组件只渲染 #intro-card-N 占位 div，由 mounted() 钩子遍历调用
 *     window.YrySceneCard.mount() 注入实际卡片内容（依赖 cdn/yry-scene-card）。
 *   - 演示图表：本组件在模板末尾预留 #intro-code-activity-slot，由 mounted() 钩子
 *     在 code-activity 的 data.js + index.js 已经就绪后，调用
 *     Vue.createApp(window.DocCodeActivityComponent).mount(slot) 嵌入挂载；
 *     组件对象来自 components/code-activity/index.js（共享给嵌入与独立两种用法）。
 *
 * 卸载：本组件 beforeUnmount 时，若已嵌入挂载 code-activity 子应用，显式
 *       app.unmount() 释放 Chart.js / AbortController / Timer 等资源。
 */
mountDocComponent({
    name: 'DocIntro',
    templateId: 'intro-template',
    dataKey: 'INTRO_TITLE',
    extra: {
        data: function () {
            return {
                title: window.INTRO_TITLE || '',
                lead: window.INTRO_LEAD || '',
                cards: window.INTRO_CARDS || [],
                callout: window.INTRO_CALLOUT || null,
                /* 持有 code-activity 子 Vue 应用句柄，用于卸载时释放 */
                _codeActivityApp: null
            };
        },
        mounted: function () {
            var self = this;
            /* 1) 注入场景卡片（依赖 yry-scene-card，可能尚未就绪，见 mountYrySceneCard） */
            var cards = this.cards || [];
            cards.forEach(function (card, i) {
                mountYrySceneCard(card, '#intro-card-' + i);
            });

            /* 2) 嵌入挂载 code-activity 演示图表
             *    · 期望 window.DocCodeActivityComponent 已由
             *      ../code-activity/index.js 暴露（见 index.html 的脚本顺序）。
             *    · 若确实未就绪（例如本地 <script src> 调试时漏写了脚本顺序），
             *      留空 slot 即可，不向 console 抛错 —— 这是「父容器降级」行为。 */
            var slot = this.$refs && this.$refs.codeActivitySlot;
            if (!slot) return;

            var waitAndMount = function (attempt) {
                if (window.DocCodeActivityComponent && typeof Vue !== 'undefined') {
                    /* 独立持有 app 句柄，避免与未来可能的重复挂载冲突 */
                    self._codeActivityApp = Vue.createApp(window.DocCodeActivityComponent);
                    self._codeActivityApp.mount(slot);
                    return;
                }
                if (attempt >= 20) {
                    console.warn('[DocIntro] DocCodeActivityComponent 未就绪，跳过演示图表嵌入');
                    return;
                }
                setTimeout(function () { waitAndMount(attempt + 1); }, 50);
            };
            waitAndMount(0);
        },
        beforeUnmount: function () {
            /* 释放嵌入挂载的 code-activity 子应用 → 触发其 beforeUnmount →
               释放 Chart.js / AbortController / Timer 等资源。 */
            if (this._codeActivityApp) {
                this._codeActivityApp.unmount();
                this._codeActivityApp = null;
            }
        }
    }
});

/**
 * 把单张卡片挂载到指定 selector 的占位 div 上。
 *  - YrySceneCard 已暴露占位 mount()：直接调用，模板未就绪会内部入队
 *  - YrySceneCard 还没就绪：监听 yry-scene-card-ready 事件，ready 后再挂载
 */
function mountYrySceneCard(card, selector) {
    if (window.YrySceneCard) {
        window.YrySceneCard.mount(card, selector);
        return;
    }
    document.addEventListener('yry-scene-card-ready', function once() {
        document.removeEventListener('yry-scene-card-ready', once);
        if (window.YrySceneCard) {
            window.YrySceneCard.mount(card, selector);
        }
    });
}