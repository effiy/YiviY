/**
 * __CARD_NAME__ · State Machine Demo (Type D)
 */
(function mountTypeDStateDemo() {
    if (!window.Vue || !window.YrySceneCard) { return; }
    var card = window.DEMO_CARD_DATA || {};
    var mock = window.DEMO_MOCK_DATA || {};
    var states = mock.states || [];

    var app = Vue.createApp({
        data: function () { return {
            states:       states,
            currentStateId: mock.initial || (states[0] && states[0].id) || '',
            history:      []
        }; },
        computed: {
            currentState: function () {
                return this.states.find(function (s) { return s.id === this.currentStateId; }.bind(this)) || { label: '?', transitions: [] };
            }
        },
        methods: {
            triggerTransition: function (toId) {
                var from = this.currentStateId;
                this.currentStateId = toId;
                this.history.unshift({
                    from: from,
                    to:   toId,
                    time: new Date().toLocaleTimeString()
                });
            }
        },
        beforeUnmount: function () { this.history = []; }
    });
    app.mount('#demo-app');

    if (window.YrySceneCard.mount) {
        window.YrySceneCard.mount(card, document.getElementById('scene-card'));
    }
})();