/**
 * YrySceneCard · 配置数据源
 * ----------------------------------------------------------------------
 * 抽离 scene-card 组件的静态配置 (模板 ID / 超时 / props 默认值 /
 * 默认底部链接清单), 与运行时逻辑解耦, 便于后续单独维护。
 * 通过 window.YRY_SCENE_CARD_CONFIG 暴露, 供 index.js 读取。
 *
 * 修改此处即可调整:
 *   - templateId:    <script type="text/x-template" id="..."> 的 DOM id
 *   - loadTimeoutMs: fetch(index.html) 的超时阈值
 *                     (同时用作 YryTagChip 依赖等待超时)
 *   - defaults:      props 默认值
 *       · nameTarget:   链接打开方式, 默认 '_blank' (新窗口)
 *       · defaultLinks: 卡片底部默认链接清单
 *                       (清单 / 架构 / 图谱 / 源码 / 测试 / 演示 / 审查 ...)
 *                       每项 = { icon, label, href, target }
 *                         - href 中可用 {name} 占位, 运行时被 props.name (URL 编码) 替换
 *                         - target 缺省回退到 '_blank'
 *                       props.links 非空时优先使用 props.links 覆盖
 *
 * 注: YryTagChip 依赖通过 'yry-tag-chip-ready' 事件等待,
 *     不在此处配置 (loader 内部管理 ready/error 事件名)。
 */

window.YRY_SCENE_CARD_CONFIG = {
    templateId:    'yry-scene-card-tpl',
    loadTimeoutMs: 5000,
    defaults: {
        nameTarget:   '_blank',
        defaultLinks: [
            /* ── 7 个通用入口 · 默认全部可跳转 · 仅保留文本标签 ── */
            { label: '清单', href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md',           target: '_blank' },
            { label: '架构', href: 'docs/components/workflow/index.html',                                  target: '_blank' },
            { label: '图谱', href: 'https://github.com/Huanshere/VideoLingo/network/dependents',            target: '_blank' },
            { label: '测试', href: 'https://github.com/Huanshere/VideoLingo/actions',                       target: '_blank' },
            { label: '源码', href: 'https://github.com/Huanshere/VideoLingo',                                target: '_blank' },
            { label: '演示', href: 'https://videolingo.io',                                                 target: '_blank' },
            { label: '审查', href: 'https://github.com/Huanshere/VideoLingo/pulls',                         target: '_blank' }
        ]
    }
};