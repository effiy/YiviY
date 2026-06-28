/**
 * YryToast · 配置数据源
 * ----------------------------------------------------------------------
 * 抽离 toast 的静态配置（图标 / 默认值 / 类型别名），与运行时逻辑解耦，
 * 便于后续单独维护。通过 window.YRY_TOAST_CONFIG 暴露，供 index.js 读取。
 *
 * 修改此处即可调整：
 *   - icons:        每种语义色对应的图标字符
 *   - defaults:     持续时间、上限数量、模板/容器元素 id、超时阈值
 *   - typeAliases:  类型归一化映射（如 warning → warn）
 */

window.YRY_TOAST_CONFIG = {
    icons: {
        default: 'ℹ',
        success: '✓',
        warn:    '⚠',
        warning: '⚠',
        error:   '✕',
        info:    'ℹ'
    },
    defaults: {
        duration:      3500,
        maxToasts:     5,
        templateId:    'yry-toast-tpl',
        hostId:        'yry-toast-host',
        loadTimeoutMs: 5000
    },
    typeAliases: {
        warning: 'warn'
    }
};