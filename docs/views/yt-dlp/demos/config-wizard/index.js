/**
 * Config Wizard Demo — Vue 3 Application
 * =============================================================================
 * Type F: Guide Walkthrough — yt-dlp Configuration Wizard
 *
 * Features:
 *   - 4-step guided walkthrough with step dots + connectors
 *   - Each step: title → instruction → code snippet → result note
 *   - Copy-to-clipboard with "Copied!" feedback
 *   - Keyboard navigation (left/right arrow keys)
 *   - Cross-language i18n
 */
(function() {
    'use strict';

    var CONFIG = window.CONFIG_WIZARD_CONFIG || {};
    var cardSlot = document.getElementById('scene-card');

    /* ── i18n Helpers ───────────────────────────── */
    function getLang() {
        return (window.VL_LANG && window.VL_LANG.current) || 'en';
    }

    function resolveLang(lang) {
        var slice = CONFIG[lang] || CONFIG.en || {};
        var out = {};
        var k;
        for (k in CONFIG) {
            if (k !== 'en' && k !== 'zh-CN' && Object.prototype.hasOwnProperty.call(CONFIG, k)) {
                out[k] = CONFIG[k];
            }
        }
        for (k in slice) {
            if (Object.prototype.hasOwnProperty.call(slice, k)) out[k] = slice[k];
        }
        return out;
    }

    function mountCard(lang) {
        if (!cardSlot || !window.YrySceneCard) return;
        var slice = CONFIG[lang || getLang()];
        if (!slice || !slice.card) return;
        cardSlot.innerHTML = '';
        window.YrySceneCard.mount(slice.card, cardSlot);
    }

    function initCard() {
        if (!cardSlot) return;
        if (window.YrySceneCard) { mountCard(); return; }
        document.addEventListener('yry-scene-card-ready', function once() {
            document.removeEventListener('yry-scene-card-ready', once);
            mountCard();
        });
    }

    /* ── Vue 3 Application ──────────────────────── */
    var app = Vue.createApp({
        data: function() {
            var lang = getLang();
            var d = resolveLang(lang);
            var snippets = CONFIG.codeSnippets || {};
            return {
                lang: lang,
                langData: d,
                ui: d.ui || {},
                /* Step definitions */
                steps: [
                    {
                        title: d.ui.step1title,
                        instruction: d.ui.step1instr,
                        code: snippets.format ? snippets.format.code : '',
                        filename: snippets.format ? snippets.format.filename : '',
                        result: d.ui.step1result
                    },
                    {
                        title: d.ui.step2title,
                        instruction: d.ui.step2instr,
                        code: snippets.subs ? snippets.subs.code : '',
                        filename: snippets.subs ? snippets.subs.filename : '',
                        result: d.ui.step2result
                    },
                    {
                        title: d.ui.step3title,
                        instruction: d.ui.step3instr,
                        code: snippets.postproc ? snippets.postproc.code : '',
                        filename: snippets.postproc ? snippets.postproc.filename : '',
                        result: d.ui.step3result
                    },
                    {
                        title: d.ui.step4title,
                        instruction: d.ui.step4instr,
                        code: snippets.output ? snippets.output.code : '',
                        filename: snippets.output ? snippets.output.filename : '',
                        result: d.ui.step4result
                    }
                ],
                currentStep: 0,
                copyFeedback: d.ui.copyBtn || '📋 Copy',
                _copyTimer: null
            };
        },

        computed: {
            currentStepObj: function() {
                if (this.currentStep < 0 || this.currentStep >= this.steps.length) return null;
                return this.steps[this.currentStep];
            }
        },

        methods: {
            prevStep: function() {
                if (this.currentStep > 0) this.currentStep--;
            },
            nextStep: function() {
                if (this.currentStep < this.steps.length - 1) this.currentStep++;
            },

            copyCode: function() {
                var self = this;
                var code = this.currentStepObj ? this.currentStepObj.code : '';
                if (!code) return;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(function() {
                        self.showCopied();
                    }).catch(function() {
                        self.fallbackCopy(code);
                    });
                } else {
                    this.fallbackCopy(code);
                }
            },

            fallbackCopy: function(text) {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); this.showCopied(); } catch(e) {}
                document.body.removeChild(ta);
            },

            showCopied: function() {
                var self = this;
                this.copyFeedback = this.ui.copied || '✓ Copied!';
                if (this._copyTimer) clearTimeout(this._copyTimer);
                this._copyTimer = setTimeout(function() {
                    self.copyFeedback = self.ui.copyBtn || '📋 Copy';
                    self._copyTimer = null;
                }, 2000);
            },

            rebuildSteps: function() {
                var ui = this.ui;
                var snippets = CONFIG.codeSnippets || {};
                this.steps = [
                    { title: ui.step1title, instruction: ui.step1instr, code: snippets.format ? snippets.format.code : '', filename: snippets.format ? snippets.format.filename : '', result: ui.step1result },
                    { title: ui.step2title, instruction: ui.step2instr, code: snippets.subs ? snippets.subs.code : '', filename: snippets.subs ? snippets.subs.filename : '', result: ui.step2result },
                    { title: ui.step3title, instruction: ui.step3instr, code: snippets.postproc ? snippets.postproc.code : '', filename: snippets.postproc ? snippets.postproc.filename : '', result: ui.step3result },
                    { title: ui.step4title, instruction: ui.step4instr, code: snippets.output ? snippets.output.code : '', filename: snippets.output ? snippets.output.filename : '', result: ui.step4result }
                ];
            },

            applyLang: function(lang) {
                var d = resolveLang(lang);
                this.lang = lang;
                this.langData = d;
                this.ui = d.ui || {};
                this.copyFeedback = this.ui.copyBtn || '📋 Copy';
                this.rebuildSteps();
                mountCard(lang);
            },

            handleKey: function(e) {
                if (e.key === 'ArrowRight') this.nextStep();
                else if (e.key === 'ArrowLeft') this.prevStep();
            }
        },

        mounted: function() {
            var self = this;
            document.addEventListener('keydown', this.handleKey);
            document.addEventListener('vl-lang-changed', function(e) {
                var newLang = e && e.detail && e.detail.lang;
                if (newLang && newLang !== self.lang) self.applyLang(newLang);
            });
        },

        beforeUnmount: function() {
            document.removeEventListener('keydown', this.handleKey);
            if (this._copyTimer) clearTimeout(this._copyTimer);
        }
    });

    app.mount('#demo-app');
    initCard();
})();
