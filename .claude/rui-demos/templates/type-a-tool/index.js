/**
 * __CARD_NAME__ · Tool Interface Demo (Type A)
 *
 * Lifecycle: 数据初始化 → 用户输入 → 模拟处理 → 输出展示
 * Interactivity: 输入表单 / 进度条 / 结果区
 * Mock data: 模拟处理流程的阶段文案与结果片段（绝不真实 API 调用）
 */
(function mountTypeAToolDemo() {
    if (!window.Vue || !window.YrySceneCard) {
        console.warn('[Type-A demo] Vue or YrySceneCard not loaded yet; aborting mount.');
        return;
    }
    var card = window.DEMO_CARD_DATA || {};
    var mock = window.DEMO_MOCK_DATA || {};

    var app = Vue.createApp({
        data: function () { return {
            input:           '',
            running:         false,
            progress:        0,
            currentStage:    '',
            result:          '',
            stages:          mock.stages || ['Initializing…', 'Fetching…', 'Processing…', 'Done'],
            hasDiagram:      !!mock.hasDiagram,
            hasGraph:        !!mock.hasGraph,
            inputPlaceholder: mock.inputPlaceholder || 'Paste URL or text…'
        }; },
        methods: {
            runTool: function () {
                var self = this;
                if (this.running) return;
                this.running  = true;
                this.progress = 0;
                this.result   = '';
                var idx = 0;
                var tick = function () {
                    if (idx >= self.stages.length) {
                        self.result = self.formatResult();
                        self.running = false;
                        return;
                    }
                    self.currentStage = self.stages[idx];
                    self.progress     = Math.round(((idx + 1) / self.stages.length) * 100);
                    idx += 1;
                    setTimeout(tick, 600);
                };
                tick();
            },
            formatResult: function () {
                var raw = (mock.resultTemplate || '<strong>Done.</strong> Output for "{{input}}".')
                    .replace(/\{\{input\}\}/g, this.input || '(empty)');
                return raw;
            }
        },
        beforeUnmount: function () {
            this.running  = false;
            this.progress = 0;
        }
    });
    app.mount('#demo-app');

    // Mount scene card into card-area
    if (window.YrySceneCard.mount) {
        window.YrySceneCard.mount(card, document.getElementById('scene-card'));
    }
})();