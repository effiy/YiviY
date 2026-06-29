/**
 * Intro Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * 语言切换由 i18n: true 透明处理——模板无需修改。
 *
 * 渲染分工：本组件只渲染 #intro-card-N 占位 div，由 mounted() 钩子遍历调用
 *          window.YrySceneCard.mount() 注入实际卡片内容（依赖 cdn/yry-scene-card）。
 *          语言切换后通过 $nextTick 重新挂载卡片。
 */
mountDocComponent({
    name: 'DocIntro',
    templateId: 'intro-template',
    dataKey: 'INTRO_CONFIG',
    i18n: true,
    extra: {
        mounted: function () {
            var self = this;

            /* 挂载所有 YrySceneCard */
            function mountCards() {
                var cards = self.cards || [];
                cards.forEach(function (card, i) {
                    mountYrySceneCard(card, '#intro-card-' + i);
                });
            }
            mountCards();

            /* 语言切换后 DOM 被 Vue 重建，重新挂载卡片 */
            document.addEventListener('vl-lang-changed', function () {
                self.$nextTick(mountCards);
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
