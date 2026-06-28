/**
 * YryBreadcrumb · 配置数据源
 * ----------------------------------------------------------------------
 * 抽离 breadcrumb 组件的静态配置 (模板 ID / 超时 / props 默认值),
 * 与运行时逻辑解耦,便于后续单独维护。
 * 通过 window.YRY_BREADCRUMB_CONFIG 暴露,供 index.js 读取。
 *
 * 修改此处即可调整:
 *   - templateId:    <script type="text/x-template" id="..."> 的 DOM id
 *   - loadTimeoutMs: fetch(index.html) 的超时阈值
 *   - defaults:      ariaLabel / separator 的默认值
 *
 * 注: readyEvent / errorEvent 现在由 shared/yry-loader.js 管理 (loader 内部派发),
 *     不再通过 data.js 配置。
 */

window.YRY_BREADCRUMB_CONFIG = {
    templateId:    'yry-breadcrumb-tpl',
    loadTimeoutMs: 5000,
    defaults: {
        ariaLabel: '面包屑导航',
        separator: '/'
    }
};