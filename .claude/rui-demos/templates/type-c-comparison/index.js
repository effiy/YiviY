/**
 * __CARD_NAME__ · Comparison Showcase Demo (Type C)
 */
(function mountTypeCComparisonDemo() {
    if (!window.Vue || !window.YrySceneCard) {
        console.warn('[Type-C demo] Vue or YrySceneCard not loaded yet; aborting mount.');
        return;
    }
    var card = window.DEMO_CARD_DATA || {};
    var mock = window.DEMO_MOCK_DATA || {};

    var app = Vue.createApp({
        data: function () { return {
            variants:        mock.variants || [],
            selectedVariant: 0
        }; },
        computed: {
            currentVariant: function () {
                return this.variants[this.selectedVariant] || null;
            }
        },
        beforeUnmount: function () { /* no resources to clean */ }
    });
    app.mount('#demo-app');

    if (window.YrySceneCard.mount) {
        window.YrySceneCard.mount(card, document.getElementById('scene-card'));
    }
})();