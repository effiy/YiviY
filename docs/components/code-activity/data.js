/**
 * Code Activity 数据源
 * ----------------------------------------------------------------------
 * 抽离自 translations 组件的「最近一周代码量变化」图表配置，
 * 独立暴露为单点入口，供 Code Activity 组件读取。
 *
 * 数据契约 (window.CODE_ACTIVITY_CONFIG):
 *   - apiUrl    GitHub commit_activity 接口 URL (过去 52 周 × 7 天)
 *   - labels    多语言文案三件套 (title / loading / error)
 *   - fetch     fetch 控制项 · timeoutMs 超时后通过 AbortController 取消
 *   - chart     Chart.js 视觉配置 · 支持 axisTextColor / gradient.from→to / aspectRatio
 *
 * 组件行为约定 (见 index.js):
 *   - 自身完成 fetch + Chart.js 渲染，不依赖父组件传递 props；
 *   - 错误统一收敛到 error 状态，不向全局抛；
 *   - 卸载时 AbortController.abort() + Chart.destroy() 释放 canvas 引用。
 */

window.CODE_ACTIVITY_CONFIG = {

    /* ── 数据源 ─────────────────────────────────────── */
    apiUrl: 'https://api.github.com/repos/Huanshere/VideoLingo/stats/commit_activity',

    /* ── 多语言文案 ─────────────────────────────────── */
    labels: {
        title:   '📊 最近一周代码量变化',
        loading: '加载中...',
        error:   '加载失败，请稍后重试'
    },

    /* ── fetch 控制 ─────────────────────────────────── */
    fetch: {
        timeoutMs: 8000
    },

    /* ── Chart.js 视觉配置 ──────────────────────────── */
    chart: {
        aspectRatio: 2.2,
        borderColor: '#6366f1',
        gradient: {
            from: 'rgba(99, 102, 241, 0.35)',
            to:   'rgba(99, 102, 241, 0.02)'
        },
        axisTextColor: '#94a3b8',
        gridColor:     'rgba(255,255,255,0.06)',
        pointFill:     '#ffffff',
        dayLabels:     ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasetLabel:  'Commits'
    }
};
