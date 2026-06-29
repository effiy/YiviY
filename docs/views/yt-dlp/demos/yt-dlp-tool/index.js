/**
 * yt-dlp Tool Demo — Vue 3 Application
 *
 * Demo type: A — Tool Interface Demo
 * Interactivity: Paste a URL → simulated download pipeline with staged progress →
 *                 mock video info + subtitle extraction results + retry simulation
 */
(function() {
    'use strict';

    var cardData = window.DEMO_CARD_DATA;
    var mockData = window.DEMO_MOCK_DATA;

    // ── Mount the rui-scene card ──────────────────
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
            return {
                // Input state
                input: '',
                showOptions: false,

                // Format options (simulated ydl_opts)
                resolution: '1080p',
                audioOnly: false,
                extractSubtitles: true,
                downloadThumbnail: true,

                // Processing state
                processing: false,
                progress: 0,
                progressText: '',
                currentStage: 0,

                // Retry simulation
                retryCount: 0,
                showRetry: false,

                // Output
                result: null,

                // Card data for header
                card: cardData,
                sampleInputs: mockData.sampleInputs,
                placeholder: mockData.placeholder,

                // Result index for variety
                resultIndex: 0
            };
        },

        methods: {
            toggleOptions: function() {
                this.showOptions = !this.showOptions;
            },

            useSample: function(url) {
                this.input = url;
            },

            process: function() {
                if (!this.input.trim() || this.processing) return;

                this.processing = true;
                this.result = null;
                this.progress = 0;
                this.retryCount = 0;
                this.showRetry = false;

                // Simulate the yt-dlp download pipeline
                this.simulatePipeline();
            },

            simulatePipeline: function() {
                var self = this;
                var stages = mockData.progressStages;

                function runStage(i) {
                    if (i >= stages.length) {
                        // All stages done — generate result
                        self.progress = 100;
                        self.progressText = 'Complete!';
                        self.result = self.generateMockResult();
                        self.processing = false;

                        // Simulate a retry scenario ~15% of the time for realism
                        if (Math.random() < 0.15 && self.retryCount < mockData.retryDemo.maxRetries) {
                            self.retryCount++;
                            self.showRetry = true;
                        }
                        return;
                    }

                    var stage = stages[i];
                    self.currentStage = i;
                    self.progress = stage.pct;
                    self.progressText = stage.text;

                    // Simulate potential retry on fragment download stage (stage index 2)
                    if (i === 2 && self.retryCount === 0 && Math.random() < 0.2) {
                        self.retryCount = 1;
                        self.showRetry = true;
                        self.progressText = 'Fragment timeout — retrying (' + self.retryCount + '/' + mockData.retryDemo.maxRetries + ')...';
                        // Slightly longer delay for retry
                        setTimeout(function() { runStage(i); }, stage.delay + 400);
                        return;
                    }

                    setTimeout(function() { runStage(i + 1); }, stage.delay);
                }

                runStage(0);
            },

            generateMockResult: function() {
                // Pick a mock result based on input characteristics for variety
                var idx;
                var input = this.input.toLowerCase();
                if (input.indexOf('rick') >= 0 || input.indexOf('dqw4w9') >= 0) {
                    idx = 0; // Rick Astley
                } else if (input.indexOf('zoo') >= 0 || input.indexOf('jnqxac') >= 0) {
                    idx = 1; // Me at the zoo
                } else {
                    idx = 2; // Big Buck Bunny (default)
                    if (input.indexOf('vimeo') >= 0) idx = 1;
                }
                this.resultIndex = idx;

                var base = mockData.mockResults[idx];

                // Adjust based on selected options
                var result = Object.assign({}, base);

                if (this.audioOnly) {
                    result.format = 'm4a (aac)';
                    result.fileSize = Math.round(parseInt(result.fileSize) * 0.1) + ' MB';
                    result.savedAs = result.savedAs.replace('.mp4', '.m4a');
                    result.resolution = 'audio-only';
                } else if (this.resolution !== '1080p' && idx === 0) {
                    result.resolution = this.resolution;
                    result.fileSize = this.resolution === '4K' ? '512 MB' : this.resolution === '720p' ? '72 MB' : '24 MB';
                }

                if (!this.extractSubtitles) {
                    result.subs = {};
                }

                if (!this.downloadThumbnail) {
                    result.thumbnail = 'skipped';
                }

                result.extractedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

                return result;
            },

            reset: function() {
                this.input = '';
                this.processing = false;
                this.progress = 0;
                this.progressText = '';
                this.result = null;
                this.retryCount = 0;
                this.showRetry = false;
                this.currentStage = 0;
                this.showOptions = false;
            }
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
            resultItems: function() {
                if (!this.result) return [];
                return [
                    { label: 'Title', value: this.result.title },
                    { label: 'Uploader', value: this.result.uploader },
                    { label: 'Duration', value: this.result.duration },
                    { label: 'Views', value: this.result.viewCount },
                    { label: 'Resolution', value: this.result.resolution },
                    { label: 'Format', value: this.result.format },
                    { label: 'File Size', value: this.result.fileSize },
                    { label: 'Saved As', value: this.result.savedAs, mono: true },
                    { label: 'Thumbnail', value: this.result.thumbnail, mono: true },
                    { label: 'Extracted At', value: this.result.extractedAt, mono: true }
                ];
            }
        },

        mounted: function() {
            // Pre-focus the input for immediate interaction
            var self = this;
            this.$nextTick(function() {
                var inputEl = document.querySelector('.demo-area input[type="text"]');
                if (inputEl) {
                    inputEl.focus();
                }
            });
        },

        beforeUnmount: function() {
            // No timers to clean up (all use setTimeout which completes)
        }
    });

    app.mount('#demo-app');
})();
