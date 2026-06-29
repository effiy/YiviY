/**
 * __CARD_NAME__ Demo — Vue 3 Application
 *
 * Demo type: __DEMO_TYPE_LABEL__
 * Interactivity: __DEMO_INTERACTIVITY_DESC__
 *
 * 通过共享 helper `assets/demo-mount.js` 启动；该脚本已处理：
 *   - Vue / YrySceneCard 就绪守卫
 *   - 将 window.DEMO_CARD_DATA 挂载到 #scene-card
 *   - 创建 Vue 应用并挂载到 #demo-app
 */
mountDemoApp({
    data: function () {
        return __DEMO_DATA__;
    },

    methods: {
        __DEMO_METHODS__
    },

    computed: {
        __DEMO_COMPUTED__
    },

    mounted: function () {
        __DEMO_MOUNTED__
    },

    beforeUnmount: function () {
        __DEMO_BEFORE_UNMOUNT__
    }
});