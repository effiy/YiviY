/**
 * <<COMPONENT_NAME>> 配置数据
 * ----------------------------------------------------------------------
 * i18n: true 时启用多语言切换（lang.js 会按当前语言挑选 labels 分支）。
 * constants 内的键值会被 mountDocComponent 直接复制到 Vue 实例，
 * 模板内可直接访问（如 {{ sceneName }}）。
 *
 * 字段说明：
 *   - constants: 全局静态值（场景名、API URL 等非语言敏感数据）
 *   - labels:    文案（每种语言独立维护）
 *   - props:     行为/视觉配置（颜色 token、节流时长等可调参数）
 */
window.<<COMPONENT_CONFIG_NAME>> = {
    constants: {
        sceneName: '<<SCENE_NAME>>',
        apiUrl:    '',
        refreshMs: 0   // 0 = 不自动刷新
    },

    i18n: true,
    en: {
        labels: {
            title:       '<<TITLE_EN>>',
            description: '<<DESCRIPTION_EN>>',
            loading:     'Loading…',
            error:       'Failed to load data.',
            retry:       'Retry'
        },
        props: {
            accentToken:  '--yry-accent',
            borderRadius: 'medium'   // small | medium | large
        }
    },

    'zh-CN': {
        labels: {
            title:       '<<TITLE_ZH>>',
            description: '<<DESCRIPTION_ZH>>',
            loading:     '加载中…',
            error:       '数据加载失败。',
            retry:       '重试'
        },
        props: {
            accentToken:  '--yry-accent',
            borderRadius: 'medium'
        }
    }
};