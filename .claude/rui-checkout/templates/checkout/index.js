/**
 * rui-checkout · Improvement Checkout (Vue 3 page)
 *
 * Aggregates actions from health + architecture reports.
 * Tracks per-action status, per-step completion, and computes
 * progress toward target scores. State is persisted in localStorage.
 */
(function mountCheckout() {
    if (!window.Vue) { return; }
    var cfg = window.CHECKOUT_CONFIG || { actions: [], healthScore: { current: 0, target: 0 }, archScore: { current: 0, target: 0 } };

    var STORAGE_KEY = 'rui-checkout-state-v1';
    var persisted = (function () {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch (_) { return {}; }
    })();

    var app = Vue.createApp({
        data: function () { return {
            actions:           cfg.actions || [],
            healthScore:       cfg.healthScore || { current: 0, target: 0 },
            archScore:         cfg.archScore   || { current: 0, target: 0 },
            selectedPriority:  '',
            selectedSource:    '',
            selectedPhase:     '',
            criticalOnly:      false,
            statusFilter:      'all',
            stepStates:        persisted.stepStates || {},
            actionStates:      persisted.actionStates || {}
        }; },
        computed: {
            totalActions: function () { return this.actions.length; },
            phases:       function () { return Array.from(new Set(this.actions.map(function (a) { return a.phase; }).filter(Boolean))); },
            counts: function () {
                var c = { done: 0, in_progress: 0, todo: 0, blocked: 0 };
                var self = this;
                this.actions.forEach(function (a) {
                    var status = self.actionStates[a.id] || a.status || 'todo';
                    if (c[status] !== undefined) c[status] += 1;
                });
                return c;
            },
            healthProgress: function () {
                var t = this.healthScore.target || 1;
                return Math.min(100, Math.round((this.healthScore.current / t) * 100));
            },
            archProgress: function () {
                var t = this.archScore.target || 1;
                return Math.min(100, Math.round((this.archScore.current / t) * 100));
            },
            filteredActions: function () {
                var self = this;
                return this.actions.filter(function (a) {
                    var status = self.actionStates[a.id] || a.status || 'todo';
                    if (self.statusFilter !== 'all' && status !== self.statusFilter) return false;
                    if (self.selectedPriority && a.priority !== self.selectedPriority) return false;
                    if (self.selectedSource   && a.source   !== self.selectedSource)   return false;
                    if (self.selectedPhase    && a.phase    !== self.selectedPhase)    return false;
                    if (self.criticalOnly     && !a.critical) return false;
                    return true;
                });
            }
        },
        methods: {
            setActionStatus: function (id, status) {
                this.actionStates[id] = status;
                this._persist();
            },
            toggleStep: function (actionId, stepIdx, value) {
                this.stepStates[actionId + ':' + stepIdx] = value;
                this._persist();
            },
            setStatusFilter: function (key) { this.statusFilter = key; },
            statusLabel: function (status) {
                return { todo: 'Todo', in_progress: 'In Progress', done: 'Done', blocked: 'Blocked' }[status] || status;
            },
            _persist: function () {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({
                        stepStates:   this.stepStates,
                        actionStates: this.actionStates
                    }));
                } catch (_) { /* quota exceeded; ignore */ }
            }
        },
        beforeUnmount: function () {
            this.stepStates   = {};
            this.actionStates = {};
        }
    });
    app.mount('#checkout-app');
})();