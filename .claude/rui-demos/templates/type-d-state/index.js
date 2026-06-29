/**
 * __CARD_NAME__ · State Machine Demo (Type D)
 *
 * 通过共享 helper `assets/demo-mount.js` 启动。
 */
mountDemoApp({
    data: function () {
        var mock = window.DEMO_MOCK_DATA || {};
        var states = mock.states || [];
        return {
            states:         states,
            currentStateId: mock.initial || (states[0] && states[0].id) || '',
            history:        []
        };
    },
    computed: {
        currentState: function () {
            var self = this;
            return this.states.find(function (s) { return s.id === self.currentStateId; })
                || { label: '?', transitions: [] };
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