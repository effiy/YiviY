/**
 * __CARD_NAME__ · Guide Walkthrough Demo (Type F)
 */
(function mountTypeFGuideDemo() {
    if (!window.Vue || !window.YrySceneCard) { return; }
    var card = window.DEMO_CARD_DATA || {};
    var mock = window.DEMO_MOCK_DATA || {};

    var app = Vue.createApp({
        data: function () { return {
            steps:       mock.steps || [],
            currentStep: 0
        }; },
        computed: {
            currentGuide: function () {
                return this.steps[this.currentStep] || null;
            }
        },
        methods: {
            goToStep: function (idx) { this.currentStep = idx; },
            prev:     function ()   { if (this.currentStep > 0) this.currentStep -= 1; },
            next:     function ()   { if (this.currentStep < this.steps.length - 1) this.currentStep += 1; }
        },
        beforeUnmount: function () { this.currentStep = 0; }
    });
    app.mount('#demo-app');

    if (window.YrySceneCard.mount) {
        window.YrySceneCard.mount(card, document.getElementById('scene-card'));
    }
})();