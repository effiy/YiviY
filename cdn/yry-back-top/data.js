/**
 * YryBackTop · 配置数据源
 * ----------------------------------------------------------------------
 * 抽离 back-top 组件的静态配置 (模板 ID / 超时 / 阈值 / 偏移量 / 图标 /
 * 可访问性标签 / 容器元素 id), 与运行时逻辑解耦, 便于后续单独维护。
 * 通过 window.YRY_BACK_TOP_CONFIG 暴露, 供 index.js 读取。
 *
 * 修改此处即可调整:
 *   - templateId:     <script type="text/x-template" id="..."> 的 DOM id
 *   - loadTimeoutMs:  fetch(index.html) 的超时阈值
 *   - defaults:       props 默认值 (Vue 组件 data() 初始化时使用)
 *       · threshold:      页面滚动多少像素后显示按钮, 默认 400
 *       · size:           按钮直径 (px), 默认 42
 *       · bottomOffset:   距视口底部的距离 (px), 默认 28
 *       · rightOffset:    距视口右侧的距离 (px), 默认 28
 *       · iconChar:       按钮内显示的字符, 默认 '↑' (上箭头)
 *       · ariaLabel:      无障碍标签, 默认 '回到顶部'
 *       · hostId:         Vue 应用挂载的宿主 div id, 默认 'yry-back-top-host'
 *       · zIndex:         按钮层级, 默认 100 (确保盖在一般内容之上)
 *
 * 注: readyEvent / errorEvent 由 shared/yry-loader.js 管理 (loader 内部派发),
 *     不在此处配置。
 */

window.YRY_BACK_TOP_CONFIG = {
    templateId:    'yry-back-top-tpl',
    loadTimeoutMs: 5000,
    defaults: {
        threshold:    400,
        size:         42,
        bottomOffset: 28,
        rightOffset:  28,
        iconChar:     '\u2191', // ↑
        ariaLabel:    '回到顶部',
        hostId:       'yry-back-top-host',
        zIndex:       100
    }
};
