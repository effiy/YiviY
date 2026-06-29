/**
 * __CARD_NAME__ · Pipeline Visualization Demo (Type B)
 *
 * 交互：点击展开 / 自动播放 / 重置
 * 视觉：active / done / expanded 三态过渡
 *
 * 通过共享 helper `assets/demo-mount.js` 启动。
 */
mountDemoApp({
    data: function () {
        var mock = window.DEMO_MOCK_DATA || {};
        return {
            steps:        mock.steps || [],
            currentStep:  -1,
            expandedStep: -1,
            playing:      false,
            hasDiagram:   !!mock.hasDiagram,
            hasGraph:     !!mock.hasGraph
        };
    },
    methods: {
        selectStep: function (idx) {
            this.currentStep  = idx;
            this.expandedStep = this.expandedStep === idx ? -1 : idx;
        },
        autoPlay: function () {
            var self = this;
            if (this.playing) return;
            this.playing     = true;
            this.currentStep = -1;
            var i = 0;
            var advance = function () {
                if (i >= self.steps.length) { self.playing = false; return; }
                self.currentStep  = i;
                self.expandedStep = i;
                i += 1;
                setTimeout(advance, 900);
            };
            advance();
        },
        reset: function () {
            this.playing      = false;
            this.currentStep  = -1;
            this.expandedStep = -1;
        }
    },
    beforeUnmount: function () {
        this.playing = false;
    }
});