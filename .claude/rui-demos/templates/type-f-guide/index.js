/**
 * __CARD_NAME__ · Guide Walkthrough Demo (Type F)
 *
 * 通过共享 helper `assets/demo-mount.js` 启动；
 * 无需 beforeUnmount：未持有任何 Timer/Chart/订阅资源。
 */
mountDemoApp({
    data: function () {
        var mock = window.DEMO_MOCK_DATA || {};
        return {
            steps:       mock.steps || [],
            currentStep: 0
        };
    },
    computed: {
        currentGuide: function () {
            return this.steps[this.currentStep] || null;
        }
    },
    methods: {
        goToStep: function (idx) { this.currentStep = idx; },
        prev:     function ()   { if (this.currentStep > 0) this.currentStep -= 1; },
        next:     function ()   { if (this.currentStep < this.steps.length - 1) this.currentStep += 1; }
    }
});