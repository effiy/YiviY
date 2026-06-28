/**
 * Code Activity Vue 3 组件
 * ----------------------------------------------------------------------
 * 独立从 translations 组件中抽离的「最近一周代码量变化」图表组件，
 * 由 assets/mount-component.js 公共工具挂载。配置数据由 data.js 注入
 * 到 window.CODE_ACTIVITY_CONFIG 后被 data() 展开。
 *
 * 行为契约:
 *   1. mounted() → $nextTick → 异步 fetch + Chart.js 渲染
 *   2. fetch 受 AbortController 控制: 超时自动取消 + 组件卸载时取消
 *   3. 错误统一收敛到 error 状态 (不再向 console.error 抛 — UI 可见即可)
 *   4. beforeUnmount 释放 AbortController + Chart 实例 (防止 canvas 句柄泄漏)
 *
 * 依赖 (运行时全局):
 *   - Vue                  由 docs/index.html 通过 unpkg 加载
 *   - Chart                由 docs/index.html 通过 jsdelivr CDN 加载
 *   - window.CODE_ACTIVITY_CONFIG  见 data.js
 */
mountDocComponent({
    name: 'DocCodeActivity',
    templateId: 'code-activity-template',
    dataKey: 'CODE_ACTIVITY_CONFIG',
    extra: {
        data: function () {
            var cfg = window.CODE_ACTIVITY_CONFIG || {};
            return {
                apiUrl:   cfg.apiUrl   || '',
                labels:   cfg.labels   || {},
                fetchCfg: cfg.fetch   || {},
                chartCfg: cfg.chart   || {},
                loading:  true,
                error:    false,
                /* 私有状态 (非 data.js 配置项, 不可序列化, 不参与响应式追踪) */
                _abortCtrl: null,
                _chart:     null,
                _timer:     null
            };
        },
        methods: {
            /**
             * 取一周 (7 天) 的 commit 计数并按「以今天为终点」倒序排列。
             * - 缺失的 bucket 视为 0 (GitHub 在某些时段会返回全 0)
             * - dayLabels 来自 chartCfg, 默认 Sun..Sat
             */
            _resolveLastWeek: function (data) {
                var last = data[data.length - 1];
                var days = (last && Array.isArray(last.days)) ? last.days : [];
                var labels = this.chartCfg.dayLabels || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

            /**
             * 拉取 commit_activity 数据并渲染 Chart.js 折线图。
             * - 超时由 AbortController 控制, 默认 8s (data.js 可调)
             * - 渲染前若已存在 chart 实例, 先 destroy() 释放 Canvas 引用
             * - 任何失败仅翻转 error 状态, 组件自身不再向上抛
             */
            fetchAndRender: function () {
                var self = this;
                if (!this.apiUrl) {
                    this.loading = false;
                    this.error = true;
                    return;
                }

                var timeoutMs = this.fetchCfg.timeoutMs || 8000;
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
                        if (!Array.isArray(data) || data.length === 0) {
                            throw new Error('Empty commit_activity payload');
                        }
                        self._renderChart(data);
                        self.loading = false;
                        self.error = false;
                    })
                    .catch(function (err) {
                        if (self._timer) { clearTimeout(self._timer); self._timer = null; }
                        /* AbortError 通常来自超时或卸载, 不当作业务错误展示 */
                        if (err && err.name === 'AbortError') return;
                        console.warn('[DocCodeActivity] fetch failed:', err);
                        self.loading = false;
                        self.error = true;
                    });
            },

            /**
             * 渲染 Chart.js 折线图。
             * - 渐变色按 canvas 高度动态创建 (此处固定 300, 与原 translations 行为一致)
             * - 所有视觉值回退到默认值, 保证 chartCfg 缺字段时不崩
             */
            _renderChart: function (data) {
                var canvas = this.$refs && this.$refs.canvas;
                if (!canvas || typeof Chart === 'undefined') return;

                /* 再次渲染前释放旧实例, 防止 canvas 句柄泄漏 */
                if (this._chart) { this._chart.destroy(); this._chart = null; }

                var resolved = this._resolveLastWeek(data);
                var chartCfg = this.chartCfg || {};
                var gradientCfg = chartCfg.gradient || {};
                var borderColor = chartCfg.borderColor || '#6366f1';
                var ctx = canvas.getContext('2d');
                var gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, gradientCfg.from || 'rgba(99, 102, 241, 0.35)');
                gradient.addColorStop(1, gradientCfg.to   || 'rgba(99, 102, 241, 0.02)');

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
                            borderWidth: 2.5,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 5,
                            pointBackgroundColor: borderColor,
                            pointBorderColor: pointFill,
                            pointBorderWidth: 2,
                            pointHoverRadius: 7
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: chartCfg.aspectRatio || 2.2,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: {
                                grid: { color: gridColor },
                                ticks: { color: axisTextColor, font: { size: 13 } }
                            },
                            y: {
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: {
                                    color: axisTextColor,
                                    font: { size: 12 },
                                    stepSize: 1,
                                    callback: function (v) { return v === Math.floor(v) ? v : ''; }
                                }
                            }
                        }
                    }
                });
            },

            /**
             * 释放本组件持有的全部资源 (Timer / AbortController / Chart 实例)。
             * - 由 Vue 的 beforeUnmount 自动调用
             * - 也可由外部显式调用 (例如父组件切换语言且不希望图表残留时)
             */
            destroy: function () {
                if (this._timer)     { clearTimeout(this._timer);     this._timer = null; }
                if (this._abortCtrl) { this._abortCtrl.abort();       this._abortCtrl = null; }
                if (this._chart)     { this._chart.destroy();         this._chart = null; }
            }
        },
        mounted: function () {
            var self = this;
            /* $nextTick: 等 Vue 把 <canvas> 实际插入 DOM 后再 new Chart */
            this.$nextTick(function () { self.fetchAndRender(); });
        },
        beforeUnmount: function () {
            this.destroy();
        }
    }
});
