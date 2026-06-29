/**
 * Card Quality Checklist — index.js
 * Vue 3 interactive logic: filtering, checkbox toggle, summary compute, localStorage persistence.
 */
(function() {
    var cfg = window.CHECKLIST_CONFIG;
    if (!cfg) { console.error('CHECKLIST_CONFIG not found'); return; }

    var { createApp } = Vue;

    createApp({
        data: function() {
            var expandedCards = {};
            cfg.cards.forEach(function(c) { expandedCards[c.name] = true; });

            return {
                sceneName: cfg.constants.sceneName,
                totalCards: cfg.constants.totalCards,
                generatedAt: formatDate(cfg.constants.generatedAt),
                cards: cfg.cards,
                activeFilter: 'all',
                selectedCard: '',
                selectedCategory: '',
                expandAll: true,
                expandedCards: expandedCards,
                checkedItems: loadCheckedItems()
            };
        },

        computed: {
            /* ── Global counts ── */
            counts: function() {
                var result = { pass: 0, fail: 0, warn: 0, pending: 0 };
                this.cards.forEach(function(card) {
                    card.checks.forEach(function(check) {
                        if (result[check.status] !== undefined) {
                            result[check.status]++;
                        }
                    });
                });
                return result;
            },

            totalAutoChecks: function() {
                return this.counts.pass + this.counts.fail + this.counts.warn;
            },

            totalChecks: function() {
                return this.totalAutoChecks + this.counts.pending;
            },

            passRate: function() {
                if (this.totalAutoChecks === 0) return 0;
                return Math.round((this.counts.pass / this.totalAutoChecks) * 100);
            },

            /* ── Filter buttons ── */
            filters: function() {
                return [
                    { key: 'all', label: 'All', count: this.totalChecks },
                    { key: 'pass', label: 'Pass', count: this.counts.pass },
                    { key: 'fail', label: 'Fail', count: this.counts.fail },
                    { key: 'warn', label: 'Warn', count: this.counts.warn },
                    { key: 'pending', label: 'Manual', count: this.counts.pending }
                ];
            },

            /* ── Filtered cards ── */
            filteredCards: function() {
                var self = this;
                var result = this.cards;

                // Filter by selected card
                if (this.selectedCard) {
                    result = result.filter(function(c) { return c.name === self.selectedCard; });
                }

                // Filter: only show cards that have at least one check matching the active filter
                if (this.activeFilter !== 'all' || this.selectedCategory) {
                    result = result.filter(function(card) {
                        return card.checks.some(function(check) {
                            var statusMatch = self.activeFilter === 'all' || check.status === self.activeFilter;
                            var catMatch = !self.selectedCategory || check.category === self.selectedCategory;
                            return statusMatch && catMatch;
                        });
                    });
                }

                return result;
            }
        },

        methods: {
            /* ── Filter controls ── */
            setFilter: function(key) {
                this.activeFilter = key;
            },

            showCheck: function(check) {
                var statusMatch = this.activeFilter === 'all' || check.status === this.activeFilter;
                var catMatch = !this.selectedCategory || check.category === this.selectedCategory;
                return statusMatch && catMatch;
            },

            resetFilters: function() {
                this.activeFilter = 'all';
                this.selectedCard = '';
                this.selectedCategory = '';
            },

            /* ── Expand / collapse ── */
            toggleCard: function(name) {
                this.expandedCards[name] = this.expandedCards[name] === false ? true : false;
                // Update expandAll state
                var allExpanded = true;
                for (var key in this.expandedCards) {
                    if (this.expandedCards[key] === false) { allExpanded = false; break; }
                }
                this.expandAll = allExpanded;
            },

            toggleExpandAll: function() {
                this.expandAll = !this.expandAll;
                var self = this;
                Object.keys(this.expandedCards).forEach(function(key) {
                    self.expandedCards[key] = self.expandAll;
                });
            },

            /* ── Checkbox state ── */
            isChecked: function(cardName, checkId) {
                return !!this.checkedItems[cardName + '|' + checkId];
            },

            toggleCheck: function(cardName, checkId) {
                var key = cardName + '|' + checkId;
                this.checkedItems[key] = !this.checkedItems[key];
                saveCheckedItems(this.checkedItems);
            },

            /* ── Per-card stats ── */
            cardCounts: function(cardName) {
                var card = this.cards.find(function(c) { return c.name === cardName; });
                if (!card) return { pass: 0, fail: 0, warn: 0, pending: 0 };
                var result = { pass: 0, fail: 0, warn: 0, pending: 0 };
                card.checks.forEach(function(check) {
                    if (result[check.status] !== undefined) {
                        result[check.status]++;
                    }
                });
                return result;
            },

            /* ── Helpers ── */
            truncateDesc: function(desc) {
                if (!desc) return '';
                // Strip HTML tags for preview, keep text
                var text = desc.replace(/<[^>]*>/g, '');
                return text.length > 120 ? text.substring(0, 120) + '…' : text;
            }
        },

        watch: {
            selectedCard: function(val) {
                if (val) {
                    var self = this;
                    this.$nextTick(function() {
                        // Expand only the selected card
                        Object.keys(self.expandedCards).forEach(function(key) {
                            self.expandedCards[key] = (key === val);
                        });
                        self.expandAll = false;
                    });
                }
            }
        }
    }).mount('#checklist-app');

    /* ── Helpers ── */

    function formatDate(iso) {
        if (!iso) return '—';
        var d = new Date(iso);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    function loadCheckedItems() {
        try {
            var raw = localStorage.getItem('checklist_checked_' + cfg.constants.sceneName);
            return raw ? JSON.parse(raw) : {};
        } catch(e) { return {}; }
    }

    function saveCheckedItems(items) {
        try {
            localStorage.setItem('checklist_checked_' + cfg.constants.sceneName, JSON.stringify(items));
        } catch(e) { /* localStorage may be full or disabled */ }
    }
})();
