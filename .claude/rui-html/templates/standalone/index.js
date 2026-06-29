/**
 * <<PAGE_NAME>> 独立页 Vue 3 应用
 * ----------------------------------------------------------------------
 * 单页面模式：不嵌入侧边栏、不依赖 docs/include.js。
 * 直接挂载 #page-app 即可。
 */
var PAGE_<<PAGE_NAME_UPPER>>_APP = {
    data: function () {
        return {};
    },

    mounted: function () {
        // 在此挂载子组件、初始化图表等
    },

    beforeUnmount: function () {
        // 清理 Timer、Chart 实例、AbortController 等
    }
};