/**
 * yt-dlp Tool Demo — Vue 3 Application
 * =============================================================================
 * Type A: Tool Interface Demo — Download Pipeline Simulator
 *
 * Architecture:
 *   - Manual i18n via window.YT_DLP_TOOL_CONFIG + VL_LANG event bus
 *   - YrySceneCard mount for the header card (standalone pattern)
 *   - Timer stack (_timers[]) with safe cleanup in beforeUnmount()
 *   - Graph deep-link helper: graphLink(nodeId) → ../../graph/?focus=...
 *   - Pipeline runner with configurable retry simulation
 *
 * Card area is OUTSIDE the Vue mount point (#demo-app); YrySceneCard
 * manages it independently with its own event-driven lifecycle.
 */
(function() {
    'use strict';

    var CONFIG = window.YT_DLP_TOOL_CONFIG || {};
    var cardSlot = document.getElementById('scene-card');

    /* ── i18n Helpers ───────────────────────────── */
    function getLang() {
        return (window.VL_LANG && window.VL_LANG.current) || 'en';
    }

    /**
     * Merge cross-language constants (top-level keys) with the
     * current language slice (en / zh-CN). Language-slice keys
     * override cross-language keys of the same name.
     */
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

    /* ── YrySceneCard Mount ─────────────────────── */
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
            return {
                lang: lang,
                langData: d,
                ui: d.ui || {},
                sampleInputs: CONFIG.sampleInputs || [],
                maxRetries: d.maxRetries || 5,

                /* Input + options state */
                input: '',
                showOptions: false,
                resolution: 'best',
                audioOnly: false,
                extractSubtitles: true,
                downloadThumbnail: true,

                /* Pipeline state */
                processing: false,
                progress: 0,
                progressText: '',
                currentStage: -1,
                currentStageInfo: null,
                stages: d.progressStages || [],
                retryCount: 0,
                showRetry: false,

                /* Result */
                result: null,

                /* Timer stack for cleanup */
                _timers: []
            };
        },

        computed: {
            hasResult: function() {
                return this.result !== null;
            },
            canProcess: function() {
                return this.input.trim().length > 0 && !this.processing;
            },
            progressPercent: function() {
                return this.progress + '%';
            },
            computedCmd: function() {
                var tmpl = (this.langData.cmdTemplate || '').replace('{url}', this.input.trim() || 'URL');
                var parts = [];
                if (this.resolution !== 'best') {
                    parts.push(' -f "bestvideo[height<=' + this.resolution.replace('K','000').replace('p','') + ']+bestaudio/best"');
                }
                if (!this.extractSubtitles) {
                    parts.push(' --no-write-subs --no-write-auto-subs');
                }
                if (!this.downloadThumbnail) {
                    parts.push(' --no-embed-thumbnail');
                }
                if (this.audioOnly) {
                    parts.push(' -x --audio-format best');
                }
                return (parts.length > 0) ? 'yt-dlp' + parts.join('') + ' URL' : tmpl;
            },
            resultItems: function() {
                if (!this.result) return [];
                var r = this.result;
                var u = this.langData.ui || {};
                return [
                    { label: u.resultLabelTitle,       value: r.title,       mono: false },
                    { label: u.resultLabelUploader,    value: r.uploader,    mono: false },
                    { label: u.resultLabelDuration,    value: r.duration,    mono: false },
                    { label: u.resultLabelViews,       value: r.viewCount,   mono: false },
                    { label: u.resultLabelResolution,  value: r.resolution,  mono: false },
                    { label: u.resultLabelFormat,      value: r.format,      mono: false },
                    { label: u.resultLabelFileSize,    value: r.fileSize,    mono: false },
                    { label: u.resultLabelSavedAs,     value: r.savedAs,     mono: true  },
                    { label: u.resultLabelThumbnail,   value: r.thumbnail,   mono: true  },
                    { label: u.resultLabelExtractedAt, value: r.extractedAt, mono: true  }
                ];
            }
        },

        methods: {
            /* ── i18n flat key lookup ──────────── */
            t: function(key) {
                var ui = this.langData.ui;
                return (ui && ui[key] != null) ? ui[key] : key;
            },

            /* ── Graph deep-link builder ────────── */
            graphLink: function(nodeId) {
                if (!nodeId) return '#';
                return '../../graph/index.html?focus=' + encodeURIComponent(nodeId);
            },

            /* ── Safe timer scheduling ──────────── */
            schedule: function(fn, delay) {
                var self = this;
                var h = setTimeout(function() {
                    var idx = self._timers.indexOf(h);
                    if (idx >= 0) self._timers.splice(idx, 1);
                    fn();
                }, delay);
                this._timers.push(h);
                return h;
            },

            /* ── Clear all pending timers ──────── */
            clearTimers: function() {
                var timers = this._timers || [];
                for (var i = 0; i < timers.length; i++) {
                    clearTimeout(timers[i]);
                }
                this._timers = [];
            },

            /* ── UI actions ────────────────────── */
            toggleOptions: function() { this.showOptions = !this.showOptions; },
            useSample: function(url) { this.input = url; },

            /* ── Main download pipeline ────────── */
            process: function() {
                if (!this.input.trim() || this.processing) return;
                this.processing = true;
                this.result = null;
                this.progress = 0;
                this.retryCount = 0;
                this.showRetry = false;
                this.currentStage = -1;
                this.currentStageInfo = null;
                // Reload stages for current language
                this.stages = resolveLang(getLang()).progressStages || [];
                this.runPipeline(0);
            },

            /**
             * Run the pipeline stage-by-stage. Each stage advances
             * after its delay. Configurable retry simulation on the
             * fragment download stage.
             */
            runPipeline: function(i) {
                var self = this;
                var stages = this.stages;
                var retryCfg = CONFIG.retryRate || {};
                var fragIdx = retryCfg.fragmentStageIndex != null ? retryCfg.fragmentStageIndex : 3;
                var fragRate = retryCfg.fragmentStage != null ? retryCfg.fragmentStage : 0.2;
                var postRate = retryCfg.postPipeline != null ? retryCfg.postPipeline : 0.15;
                var maxR = this.maxRetries;

                /* Pipeline complete */
                if (i >= stages.length) {
                    self.progress = 100;
                    self.currentStage = stages.length - 1;
                    self.currentStageInfo = stages[stages.length - 1];
                    self.progressText = self.t('complete');
                    self.result = self.buildResult();
                    self.processing = false;
                    /* Post-pipeline retry simulation */
                    if (Math.random() < postRate && self.retryCount < maxR) {
                        self.retryCount++;
                        self.showRetry = true;
                    }
                    return;
                }

                var s = stages[i];
                self.currentStage = i;
                self.currentStageInfo = s;
                self.progress = s.pct;
                self.progressText = s.text;

                /* Fragment retry simulation on the fragment stage */
                if (i === fragIdx && self.retryCount === 0 && Math.random() < fragRate) {
                    self.retryCount = 1;
                    self.showRetry = true;
                    self.progressText = self.t('retryInProgress') + ' (' + self.retryCount + '/' + maxR + ')...';
                    self.schedule(function() {
                        self.showRetry = false;
                        self.runPipeline(i);
                    }, s.delay + (retryCfg.extraDelayMs || 400));
                    return;
                }

                /* Advance to next stage after delay */
                self.schedule(function() { self.runPipeline(i + 1); }, s.delay);
            },

            /**
             * Build the mock result object from user options +
             * keyword-matched mock data.
             */
            buildResult: function() {
                var idx = this.resolveIdx(this.input);
                var results = this.langData.mockResults || [];
                var base = results[idx] || {};
                var r = {};
                var k;
                for (k in base) {
                    if (Object.prototype.hasOwnProperty.call(base, k)) r[k] = base[k];
                }
                var titles = this.langData.mockTitles || {};
                r.title = titles[base.titleKey] || base.titleKey;

                /* Apply option overrides */
                if (this.audioOnly) {
                    r.format = 'm4a (aac)';
                    r.fileSize = Math.round(parseInt(r.fileSize, 10) * 0.1) + ' MB';
                    r.savedAs = (r.savedAs || '').replace('.mp4', '.m4a');
                    r.resolution = 'audio-only';
                } else if (this.resolution !== 'best' && idx === 0) {
                    var sizes = CONFIG.resolutionSizes || {};
                    if (sizes[this.resolution]) {
                        r.resolution = this.resolution;
                        r.fileSize = sizes[this.resolution];
                    }
                }
                if (!this.extractSubtitles) r.subs = {};
                if (!this.downloadThumbnail) r.thumbnail = 'skipped';
                r.extractedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
                return r;
            },

            /**
             * Match user input URL to a mock result index via
             * keyword patterns.
             */
            resolveIdx: function(input) {
                var patterns = CONFIG.urlPatterns || [];
                var lower = String(input).toLowerCase();
                for (var i = 0; i < patterns.length; i++) {
                    var keys = patterns[i].keywords || [];
                    for (var j = 0; j < keys.length; j++) {
                        if (lower.indexOf(keys[j]) >= 0) {
                            return patterns[i].idx;
                        }
                    }
                }
                return CONFIG.defaultIdx || 0;
            },

            /* ── Reset ─────────────────────────── */
            reset: function() {
                this.clearTimers();
                this.input = '';
                this.processing = false;
                this.progress = 0;
                this.progressText = '';
                this.result = null;
                this.retryCount = 0;
                this.showRetry = false;
                this.currentStage = -1;
                this.currentStageInfo = null;
                this.showOptions = false;
            },

            /* ── Language switch ───────────────── */
            applyLang: function(lang) {
                var d = resolveLang(lang);
                this.lang = lang;
                this.langData = d;
                this.ui = d.ui || {};
                this.stages = d.progressStages || [];
                mountCard(lang);
            }
        },

        mounted: function() {
            var self = this;
            this.$nextTick(function() {
                var el = self.$refs.urlInput;
                if (el) el.focus();
            });
            document.addEventListener('vl-lang-changed', function(e) {
                var newLang = e && e.detail && e.detail.lang;
                if (newLang && newLang !== self.lang) self.applyLang(newLang);
            });
        },

        beforeUnmount: function() {
            this.clearTimers();
        }
    });

    app.mount('#demo-app');
    initCard();
})();
