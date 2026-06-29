/**
 * Improvement Action Checkout — Vue 3 App
 * Tracks 36 actions from Code Health Report + Architecture Analysis Report.
 * Status persists in localStorage. Steps auto-propagate to action status.
 */
(function() {
    var cfg = window.CHECKOUT_CONFIG;
    if (!cfg) { console.error('CHECKOUT_CONFIG not found — data.js must load first'); return; }

    var LS_KEY = 'checkout_state_v2';
    var { createApp } = Vue;

    function loadState(actions) {
        try {
            var saved = JSON.parse(localStorage.getItem(LS_KEY));
            if (saved && saved.actions && saved.actions.length) {
                return actions.map(function(a) {
                    var sa = saved.actions.find(function(s) { return s.id === a.id; });
                    if (sa) {
                        var merged = Object.assign({}, a);
                        merged.status = sa.status || a.status;
                        merged.steps = a.steps.map(function(step) {
                            var ss = (sa.steps || []).find(function(s) { return s.id === step.id; });
                            return ss ? Object.assign({}, step, { status: ss.status || step.status }) : step;
                        });
                        return merged;
                    }
                    return a;
                });
            }
        } catch(e) { /* ignore corrupt localStorage */ }
        return actions;
    }

    function saveState(actions) {
        var state = {
            updatedAt: new Date().toISOString(),
            actions: actions.map(function(a) {
                return {
                    id: a.id,
                    status: a.status,
                    steps: a.steps.map(function(s) { return { id: s.id, status: s.status }; })
                };
            })
        };
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(state));
        } catch(e) { /* localStorage full or disabled */ }
    }

    createApp({
        data: function() {
            var actions = loadState(cfg.actions);
            // Build expanded state — expand critical path items by default
            var expanded = {};
            actions.forEach(function(a) {
                expanded[a.id] = a.criticalPath && a.status !== 'done';
            });

            return {
                generatedAt: cfg.constants.generatedAt,
                totalActions: cfg.constants.totalActions,
                totalHours: cfg.constants.totalHours,
                phases: cfg.phases,
                actions: actions,
                activeStatus: 'all',
                activeSource: 'all',
                activePhase: 'all',
                activePriority: 'all',
                criticalOnly: false,
                expandAll: false,
                expanded: expanded
            };
        },

        computed: {
            counts: function() {
                var c = { todo: 0, in_progress: 0, done: 0, blocked: 0 };
                this.actions.forEach(function(a) {
                    c[a.status] = (c[a.status] || 0) + 1;
                });
                return c;
            },
            donePercent: function() {
                return this.totalActions ? Math.round((this.counts.done / this.totalActions) * 100) : 0;
            },
            inProgressPercent: function() {
                return this.totalActions ? Math.round((this.counts.in_progress / this.totalActions) * 100) : 0;
            },
            blockedPercent: function() {
                return this.totalActions ? Math.round((this.counts.blocked / this.totalActions) * 100) : 0;
            },
            statusFilters: function() {
                return [
                    { key: 'all', label: 'All', count: this.totalActions },
                    { key: 'todo', label: 'Todo', count: this.counts.todo },
                    { key: 'in_progress', label: 'In Progress', count: this.counts.in_progress },
                    { key: 'done', label: 'Done', count: this.counts.done },
                    { key: 'blocked', label: 'Blocked', count: this.counts.blocked }
                ];
            },
            sourceCards: function() {
                var self = this;
                var meta = cfg.constants.sourceMeta;
                return Object.keys(meta).map(function(key) {
                    var m = meta[key];
                    var srcActions = self.actions.filter(function(a) { return a.source === key; });
                    var done = srcActions.filter(function(a) { return a.status === 'done'; }).length;
                    var pct = srcActions.length ? Math.round((done / srcActions.length) * 100) : 0;
                    var scoreClass = pct >= 50 ? 'score-good' : pct >= 25 ? 'score-warn' : 'score-bad';
                    return {
                        key: key,
                        label: m.labelZh || m.label,
                        current: m.score.current + m.score.unit,
                        target: m.score.target + m.score.unit,
                        grade: m.score.grade,
                        progressPercent: pct,
                        completedActions: done,
                        totalActions: srcActions.length,
                        scoreClass: scoreClass
                    };
                });
            },
            criticalPathItems: function() {
                return this.actions.filter(function(a) {
                    return a.criticalPath && a.status !== 'done';
                });
            },
            criticalPathUnlocks: function() {
                var allBlocks = [];
                this.criticalPathItems.forEach(function(a) {
                    allBlocks = allBlocks.concat(a.blocks);
                });
                // unique
                var unique = [];
                allBlocks.forEach(function(id) {
                    if (unique.indexOf(id) === -1) unique.push(id);
                });
                return unique.length;
            },
            phaseSummaries: function() {
                var self = this;
                return this.phases.map(function(p) {
                    var pa = self.actions.filter(function(a) { return a.phase === p.id; });
                    var done = pa.filter(function(a) { return a.status === 'done'; }).length;
                    return {
                        id: p.id,
                        label: p.labelZh || p.label,
                        total: pa.length,
                        done: done
                    };
                });
            },
            filteredActions: function() {
                var self = this;
                return this.actions.filter(function(a) {
                    if (self.activeStatus !== 'all' && a.status !== self.activeStatus) return false;
                    if (self.activeSource !== 'all' && a.source !== self.activeSource) return false;
                    if (self.activePhase !== 'all' && a.phase !== self.activePhase) return false;
                    if (self.activePriority !== 'all' && a.priority !== self.activePriority) return false;
                    if (self.criticalOnly && !a.criticalPath) return false;
                    return true;
                });
            }
        },

        methods: {
            toggleExpand: function(id) {
                this.expanded[id] = !this.expanded[id];
            },

            toggleStep: function(actionId, stepId) {
                var action = this.actions.find(function(a) { return a.id === actionId; });
                if (!action) return;

                var step = action.steps.find(function(s) { return s.id === stepId; });
                if (!step) return;

                // Toggle step
                step.status = step.status === 'done' ? 'todo' : 'done';

                // Auto-propagate to action status
                var allDone = action.steps.every(function(s) { return s.status === 'done'; });
                var anyDone = action.steps.some(function(s) { return s.status === 'done'; });

                if (allDone) {
                    action.status = 'done';
                } else if (anyDone && action.status === 'todo') {
                    action.status = 'in_progress';
                } else if (!anyDone && action.status === 'in_progress') {
                    action.status = 'todo';
                }

                saveState(this.actions);
            },

            setStatus: function(actionId, newStatus) {
                var action = this.actions.find(function(a) { return a.id === actionId; });
                if (!action) return;

                action.status = newStatus;

                // If marking done, mark all steps done too
                if (newStatus === 'done') {
                    action.steps.forEach(function(s) { s.status = 'done'; });
                }

                // If unblocking, check if blocked dependents should become todo
                if (newStatus === 'done') {
                    var self = this;
                    this.actions.forEach(function(a) {
                        if (a.status === 'blocked') {
                            var allDepsDone = a.dependencies.every(function(depId) {
                                var dep = self.actions.find(function(x) { return x.id === depId; });
                                return dep && dep.status === 'done';
                            });
                            if (allDepsDone) {
                                a.status = 'todo';
                            }
                        }
                    });
                }

                // If marking blocked, check dependencies aren't all done
                if (newStatus === 'blocked') {
                    var allDepsDone = action.dependencies.every(function(depId) {
                        var dep = this.actions.find(function(x) { return x.id === depId; });
                        return dep && dep.status === 'done';
                    }, this);
                    if (allDepsDone) {
                        // Don't allow blocking if all deps are done
                        action.status = 'todo';
                    }
                }

                saveState(this.actions);
            },

            getActionStatus: function(id) {
                var a = this.actions.find(function(x) { return x.id === id; });
                return a ? a.status : 'unknown';
            },

            getActionStatusIcon: function(id) {
                var status = this.getActionStatus(id);
                var icons = { todo: '○', in_progress: '◷', done: '✓', blocked: '⊘' };
                return icons[status] || '?';
            },

            getStepProgress: function(action) {
                var done = action.steps.filter(function(s) { return s.status === 'done'; }).length;
                return done + '/' + action.steps.length;
            },

            scrollToAction: function(id) {
                this.expanded[id] = true;
                var self = this;
                this.$nextTick(function() {
                    var el = document.getElementById('action-' + id);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Flash effect
                        el.classList.add('ac-flash');
                        setTimeout(function() { el.classList.remove('ac-flash'); }, 1500);
                    }
                });
            },

            statusLabel: function(s) {
                var map = { todo: 'Todo', in_progress: 'In Progress', done: 'Done', blocked: 'Blocked' };
                return map[s] || s;
            },

            statusIcon: function(s) {
                var map = { todo: '○', in_progress: '◷', done: '✓', blocked: '⊘' };
                return map[s] || '';
            },

            resetFilters: function() {
                this.activeStatus = 'all';
                this.activeSource = 'all';
                this.activePhase = 'all';
                this.activePriority = 'all';
                this.criticalOnly = false;
            }
        },

        watch: {
            expandAll: function(val) {
                var self = this;
                this.actions.forEach(function(a) {
                    self.expanded[a.id] = val;
                });
            }
        },

        mounted: function() {
            // Any post-mount initialization
        }
    }).mount('#checkout-app');
})();
