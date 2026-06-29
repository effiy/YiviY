/**
 * __CARD_NAME__ Demo — Vue 3 Application
 *
 * Demo type: __DEMO_TYPE_LABEL__
 * Interactivity: __DEMO_INTERACTIVITY_DESC__
 */
(function() {
    'use strict';

    var cardData = window.DEMO_CARD_DATA;
    var mockData = window.DEMO_MOCK_DATA;

    // ── Mount the rui-scene card ──────────────────
    // The card area uses YrySceneCard.mount() — NOT inline Vue templates.
    // cardData must be a valid YrySceneCard props object from data.js.
    // Links in cardData use { label, href, target } format.
    (function mountCard() {
        var el = document.getElementById('scene-card');
        function doMount() {
            if (el && window.YrySceneCard && cardData) {
                window.YrySceneCard.mount(cardData, el);
            }
        }
        if (window.YrySceneCard) { doMount(); return; }
        document.addEventListener('yry-scene-card-ready', function once() {
            document.removeEventListener('yry-scene-card-ready', once);
            doMount();
        });
    })();

    // ── Vue Demo App ─────────────────────────────
    var app = Vue.createApp({
        data: function() {
            return __DEMO_DATA__;
        },

        methods: {
            __DEMO_METHODS__
        },

        computed: {
            __DEMO_COMPUTED__
        },

        mounted: function() {
            __DEMO_MOUNTED__
        },

        beforeUnmount: function() {
            __DEMO_BEFORE_UNMOUNT__
        }
    });

    app.mount('#demo-app');
})();
