/**
 * yt-dlp Download Pipeline Diagram — Vue 3 组件
 *
 * 由 assets/mount-component.js 公共工具挂载。
 * i18n: true 启用透明语言切换——模板无需 t() 包裹，直接使用属性名。
 *
 * Standalone sub-page (rui-html W6):
 *   - CDN theme (tech-innovation) via --yry-* tokens
 *   - SVG diagram semantic colors preserved per rui-diagram palette
 *   - html2canvas + jsPDF export toolbar
 *   - Language toggle via VL_LANG.setLanguage()
 */
mountDocComponent({
    name: 'DocYtDlpDiagram',
    templateId: 'diagram-template',
    dataKey: 'DIAGRAM_CONFIG',
    i18n: true,

    extra: {
        /* ── Private reactive state ─────────────────────
           mountDocComponent 的 i18n wrapper 会将此 data()
           的返回值与语言 slice 合并——toolbarExpanded 和
           exportStatus 不受语言切换影响。                   */
        data: function () {
            return {
                toolbarExpanded: false,
                exportStatus: { copy: '', png: '', pdf: '' }
            };
        },

        /* ── Methods ──────────────────────────────────── */
        methods: {
            /**
             * 切换语言。VL_LANG.setLanguage 会派发 vl-lang-changed
             * 事件，mountDocComponent 的 i18n wrapper 自动应用新语言切片。
             */
            switchLang: function () {
                var newLang = this.currentLang === 'en' ? 'zh-CN' : 'en';
                if (window.VL_LANG) {
                    window.VL_LANG.setLanguage(newLang);
                }
            },

            /* ── Export helpers ──────────────────────── */

            _getReportRect: function () {
                // mountDocComponent 将模板渲染到 mount div，
                // this.$el 即为 mount div 的根节点
                var el = this.$el;
                var r = el.getBoundingClientRect();
                var pad = 32;
                return {
                    x: r.left + window.scrollX - pad,
                    y: r.top + window.scrollY - pad,
                    width: r.width + pad * 2,
                    height: r.height + pad * 2
                };
            },

            _captureCanvas: async function () {
                var rect = this._getReportRect();
                return await html2canvas(document.body, {
                    backgroundColor: '#020617',
                    scale: 2,
                    useCORS: true,
                    ignoreElements: function (e) {
                        return e.classList && (e.classList.contains('toolbar') || e.classList.contains('lang-toggle'));
                    },
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                });
            },

            _setStatus: function (key, text, duration) {
                var self = this;
                this.exportStatus[key] = text;
                if (duration) {
                    setTimeout(function () {
                        self.exportStatus[key] = '';
                    }, duration);
                }
            },

            /* ── Export toolbar ──────────────────────── */

            copyAsImage: async function () {
                this._setStatus('copy', '⏳ ...', 0);
                try {
                    var canvas = await this._captureCanvas();
                    var blob = await new Promise(function (r) { canvas.toBlob(r, 'image/png'); });
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    this._setStatus('copy', '✓ Copied!', 2000);
                } catch (e) {
                    this._setStatus('copy', '✗ Failed', 2000);
                }
            },

            downloadPNG: async function () {
                this._setStatus('png', '⏳ ...', 0);
                try {
                    var canvas = await this._captureCanvas();
                    var link = document.createElement('a');
                    link.download = 'yt-dlp-pipeline.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    this._setStatus('png', '✓ Done!', 2000);
                } catch (e) {
                    this._setStatus('png', '✗ Failed', 2000);
                }
            },

            downloadPDF: async function () {
                this._setStatus('pdf', '⏳ ...', 0);
                try {
                    var canvas = await this._captureCanvas();
                    var imgData = canvas.toDataURL('image/png');
                    var jsPDF = window.jspdf.jsPDF;
                    var orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';
                    var pdf = new jsPDF({
                        orientation: orientation,
                        unit: 'px',
                        format: [canvas.width, canvas.height],
                        hotfixes: ['px_scaling']
                    });
                    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                    pdf.save('yt-dlp-pipeline.pdf');
                    this._setStatus('pdf', '✓ Done!', 2000);
                } catch (e) {
                    this._setStatus('pdf', '✗ Failed', 2000);
                }
            }
        }
    }
});
