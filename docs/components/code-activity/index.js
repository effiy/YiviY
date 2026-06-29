/**
 * Code Activity Vue 3 组件
 * ----------------------------------------------------------------------
 * 「最近一周代码量变化」图表组件，从 translations 组件中抽离得到。
 * 配置数据由 data.js 注入到 window.CODE_ACTIVITY_CONFIG 后被 data() 展开。
 * 语言切换由 i18n: true 透明处理。
 *
 * 两种加载方式：
 *   A. 独立 include（向后兼容）
 *   B. 嵌入其他组件（如 intro）
 *
 * 依赖（运行时全局）:
 *   - Vue    由 docs/index.html 通过 unpkg 加载
 *   - Chart  由 docs/index.html 通过 jsdelivr CDN 加载
 */

var DOC_CODE_ACTIVITY_EXTRA = {
    data: function () {
        return {
            loading:  true,
            error:    false,
            _abortCtrl: null,
            _chart:     null,
            _timer:     null
        };
    },
    methods: {
        _resolveLastWeek: function (data) {
            var last = data[data.length - 1];
            var days = (last && Array.isArray(last.days)) ? last.days : [];
            var chart = this.chart || {};
            var labels = chart.dayLabels || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var today = new Date().getDay();
            var orderedLabels = [];
            var orderedValues = [];
            for (var i = 0; i < 7; i++) {
                var idx = (today + i + 1) % 7;
                orderedLabels.push(labels[idx]);
                orderedValues.push(days[idx] || 0);
            }
            return { labels: orderedLabels, values: orderedValues };
        },
        fetchAndRender: function () {
            var self = this;
            if (!this.apiUrl) { this.loading = false; this.error = true; return; }
            var timeoutMs = (this.fetch || {}).timeoutMs || 8000;
            var ctrl = new AbortController();
            this._abortCtrl = ctrl;
            this._timer = setTimeout(function () { ctrl.abort(); }, timeoutMs);
            fetch(this.apiUrl, { signal: ctrl.signal })
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    clearTimeout(self._timer); self._timer = null;
                    if (!Array.isArray(data)) throw new Error('Invalid payload');
                    self._renderChart(data);
                    self.loading = false; self.error = false;
                })
                .catch(function (err) {
                    if (self._timer) { clearTimeout(self._timer); self._timer = null; }
                    if (err && err.name === 'AbortError') return;
                    console.warn('[DocCodeActivity] fetch failed:', err);
                    self.loading = false; self.error = true;
                });
        },
        _renderChart: function (data) {
            var canvas = this.$refs && this.$refs.canvas;
            if (!canvas || typeof Chart === 'undefined') return;
            if (this._chart) { this._chart.destroy(); this._chart = null; }
            var resolved = this._resolveLastWeek(data);
            var chartCfg = this.chart || {};
            var gradientCfg = chartCfg.gradient || {};
            var borderColor = chartCfg.borderColor || '#6366f1';
            var ctx = canvas.getContext('2d');
            var gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, gradientCfg.from || 'rgba(99,102,241,0.35)');
            gradient.addColorStop(1, gradientCfg.to   || 'rgba(99,102,241,0.02)');
            var gridColor     = chartCfg.gridColor     || 'rgba(255,255,255,0.06)';
            var axisTextColor = chartCfg.axisTextColor || '#94a3b8';
            var pointFill     = chartCfg.pointFill     || '#ffffff';
            this._chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: resolved.labels,
                    datasets: [{
                        label: chartCfg.datasetLabel || 'Commits',
                        data: resolved.values,
                        borderColor: borderColor,
                        backgroundColor: gradient,
                        borderWidth: 2.5, fill: true, tension: 0.4,
                        pointRadius: 5, pointBackgroundColor: borderColor,
                        pointBorderColor: pointFill, pointBorderWidth: 2, pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: true,
                    aspectRatio: chartCfg.aspectRatio || 2.2,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: axisTextColor, font: { size: 13 } } },
                        y: { beginAtZero: true, grid: { color: gridColor },
                            ticks: { color: axisTextColor, font: { size: 12 }, stepSize: 1,
                                callback: function (v) { return v === Math.floor(v) ? v : ''; } } }
                    }
                }
            });
        },
        destroy: function () {
            if (this._timer)     { clearTimeout(this._timer);     this._timer = null; }
            if (this._abortCtrl) { this._abortCtrl.abort();       this._abortCtrl = null; }
            if (this._chart)     { this._chart.destroy();         this._chart = null; }
        }
    },
    mounted: function () {
        var self = this;
        this.$nextTick(function () { self.fetchAndRender(); });
    },
    beforeUnmount: function () {
        this.destroy();
    }
};

window.DocCodeActivityComponent = Object.assign({
    name: 'DocCodeActivity',
    template: '#code-activity-template'
}, DOC_CODE_ACTIVITY_EXTRA);

if (typeof injectComponentStylesheet === 'function') {
    injectComponentStylesheet();
}

if (!window.__docCodeActivityEmbedded) {
    mountDocComponent({
        name: 'DocCodeActivity',
        templateId: 'code-activity-template',
        dataKey: 'CODE_ACTIVITY_CONFIG',
        i18n: true,
        extra: DOC_CODE_ACTIVITY_EXTRA
    });
}
