/**
 * yt-dlp Demos — Vue 3 Application
 * =============================================================================
 * Mounted by assets/mount-component.js via mountDocComponent().
 * Language switching handled transparently by i18n: true.
 *
 * Features:
 *   - Dynamic type filter chips (only show types with demos)
 *   - Responsive card grid with hover effects
 *   - Cross-language i18n via VL_LANG event bus
 *   - Complexity badges on cards
 */
mountDocComponent({
    name: 'DocYtDlpDemos',
    templateId: 'yt-dlp-demos-template',
    dataKey: 'YT_DLP_DEMOS_CONFIG',
    i18n: true,

    extra: {
        data: function () {
            return {
                activeType: 'all'
            };
        },

        computed: {
            /**
             * Build filter chip list dynamically from demos data.
             * "All" is always first; remaining chips only for types
             * that actually appear in the demos array.
             */
            types: function () {
                var self = this;
                var seen = {};
                var result = [{ id: 'all', label: this.allFilter }];

                this.demos.forEach(function (d) {
                    if (!seen[d.type]) {
                        seen[d.type] = true;
                        result.push({
                            id: d.type,
                            label: self.typeLabelFor(d.type)
                        });
                    }
                });
                return result;
            },

            /**
             * Filter demos by the currently active type chip.
             */
            filteredDemos: function () {
                if (this.activeType === 'all') return this.demos;
                var activeType = this.activeType;
                return this.demos.filter(function (d) {
                    return d.type === activeType;
                });
            }
        },

        methods: {
            /**
             * Count how many demos belong to a given type.
             */
            countByType: function (typeId) {
                if (typeId === 'all') return this.demos.length;
                return this.demos.filter(function (d) {
                    return d.type === typeId;
                }).length;
            },

            /**
             * Map a type ID to its display label (e.g., 'A' → '🛠️ Tool Demos').
             */
            typeLabelFor: function (typeId) {
                return this.typeLabels[typeId] || typeId;
            }
        }
    }
});
