/**
 * YryTagChip · 配置数据源
 * ----------------------------------------------------------------------
 * 抽离 tag-chip 组件的静态配置 (模板 ID / 超时 / props 默认值),
 * 与运行时逻辑解耦,便于后续单独维护。
 * 通过 window.YRY_TAG_CHIP_CONFIG 暴露,供 index.js 读取。
 *
 * 修改此处即可调整:
 *   - templateId:    <script type="text/x-template" id="..."> 的 DOM id
 *   - loadTimeoutMs: fetch(index.html) 的超时阈值
 *   - defaults:      modifier 的默认值
 */

window.YRY_TAG_CHIP_CONFIG = {
    templateId:    'yry-tag-chip-tpl',
    loadTimeoutMs: 5000,
    defaults: {
        modifier: 'info'
    }
};
