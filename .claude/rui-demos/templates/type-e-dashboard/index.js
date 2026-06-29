/**
 * __CARD_NAME__ · Dashboard Demo (Type E)
 *
 * 资源管理：必须在 beforeUnmount 中销毁 Chart 实例，否则会泄漏。
 */
(function mountTypeEDashboardDemo() {
    if (!window.Vue || !window.YrySceneCard) { return; }
    var card = window.DEMO_CARD_DATA || {};
    var mock = window.DEMO_MOCK_DATA || {};

    var app = Vue.createApp({
        data: function () { return {
            metrics:  mock.metrics  || [],
            chartCfg: mock.charts   || {},
            _charts:  []
        }; },
        mounted: function () {
            var self = this;
            this.$nextTick(function () {
                self._initCharts();
            });
        },
        methods: {
            _initCharts: function () {
                if (typeof Chart === 'undefined') return;
                var c1 = this.$refs.chart1;
                var c2 = this.$refs.chart2;
                if (c1 && this.chartCfg.chart1) {
                    this._charts.push(new Chart(c1, this.chartCfg.chart1));
                }
                if (c2 && this.chartCfg.chart2) {
                    this._charts.push(new Chart(c2, this.chartCfg.chart2));
                }
            }
        },
        beforeUnmount: function () {
            // 必须销毁 Chart 实例并断开引用
            this._charts.forEach(function (c) { if (c) c.destroy(); });
            this._charts = [];
        }
    });
    app.mount('#demo-app');

    if (window.YrySceneCard.mount) {
        window.YrySceneCard.mount(card, document.getElementById('scene-card'));
    }
})();