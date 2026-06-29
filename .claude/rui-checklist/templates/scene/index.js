/**
 * rui-checklist · Scene Card Checklist (4-file Vue 3 page)
 *
 * Manages filter state, expanded sections, manual checkboxes,
 * and pass-rate computation. Status is purely derived from data.
 */
(function mountSceneChecklist() {
    if (!window.Vue) { return; }
    var cfg = window.CHECKLIST_CONFIG || { constants: {}, cards: [] };

    var app = Vue.createApp({
        data: function () { return {
            sceneName:       cfg.constants.sceneName    || '',
            generatedAt:     cfg.constants.generatedAt  || '',
            cards:           cfg.cards                  || [],
            activeFilter:    'all',
            selectedCard:    '',
            selectedCategory:'',
            expandedCards:   {},
            expandAll:       true,
            manualChecks:    {},
            filters: [
                { key: 'all',     label: 'All' },
                { key: 'pass',    label: 'Pass' },
                { key: 'fail',    label: 'Fail' },
                { key: 'warn',    label: 'Warn' },
                { key: 'pending', label: 'Manual' }
            ]
        }; },
        computed: {
            totalCards: function () { return this.cards.length; },
            counts: function () {
                var c = { pass: 0, fail: 0, warn: 0, pending: 0 };
                var self = this;
                this.cards.forEach(function (card) {
                    card.checks.forEach(function (chk) {
                        if (c[chk.status] !== undefined) c[chk.status] += 1;
                    });
                });
                this.filters.forEach(function (f) {
                    if (f.key === 'all') f.count = self.totalCards;
                    else                 f.count = c[f.key] || 0;
                });
                return c;
            },
            totalAutoChecks: function () {
                return this.counts.pass + this.counts.fail + this.counts.warn;
            },
            passRate: function () {
                var t = this.totalAutoChecks;
                return t === 0 ? 0 : Math.round((this.counts.pass / t) * 100);
            },
            filteredCards: function () {
                var self = this;
                return this.cards.filter(function (card) {
                    if (self.selectedCard && card.name !== self.selectedCard) return false;
                    if (self.activeFilter === 'all') return true;
                    return card.checks.some(function (c) { return c.status === self.activeFilter; });
                });
            }
        },
        methods: {
            setFilter: function (key) { this.activeFilter = key; },
            toggleCard: function (name) {
                this.expandedCards[name] = !(this.expandedCards[name] !== false);
            },
            toggleExpandAll: function () {
                this.expandAll = !this.expandAll;
                var v = this.expandAll;
                this.cards.forEach(function (c) { this.expandedCards[c.name] = v; }.bind(this));
            },
            toggleManual: function (cardName, checkId, value) {
                this.manualChecks[cardName + ':' + checkId] = value;
            },
            cardCounts: function (name) {
                var card = this.cards.find(function (c) { return c.name === name; });
                if (!card) return { pass: 0, fail: 0, warn: 0, pending: 0 };
                var c = { pass: 0, fail: 0, warn: 0, pending: 0 };
                card.checks.forEach(function (chk) { c[chk.status] += 1; });
                return c;
            },
            truncateDesc: function (desc) {
                if (!desc) return '';
                return desc.length > 120 ? desc.slice(0, 120) + '…' : desc;
            },
            checkIcon: function (status) {
                return { pass: '✓', fail: '✗', warn: '⚠', pending: '○' }[status] || '?';
            }
        },
        beforeUnmount: function () {
            this.expandedCards = {};
            this.manualChecks  = {};
        }
    });
    app.mount('#checklist-app');
})();