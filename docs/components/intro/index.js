/**
 * Intro Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * 数据来源：window.INTRO_TITLE / INTRO_LEAD / INTRO_CARDS / INTRO_CALLOUT
 *          （多 key 由 extra.data 自定义 data() 收集）
 *
 * 渲染分工：本组件只渲染 #intro-card-N 占位 div，由 mounted() 钩子遍历调用
 *          window.YrySceneCard.mount() 注入实际卡片内容（依赖 cdn/yry-scene-card）。
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
                callout: window.INTRO_CALLOUT || null
            };
        },
        mounted: function () {
            var cards = this.cards || [];
            cards.forEach(function (card, i) {
                mountYrySceneCard(card, '#intro-card-' + i);
            });
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