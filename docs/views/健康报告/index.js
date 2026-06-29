/**
 * 代码健康报告 Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * i18n: true 透明处理语言切换——模板无需修改。
 */
mountDocComponent({
    name: 'DocHealthReport',
    templateId: 'health-report-template',
    dataKey: 'HEALTH_REPORT_CONFIG',
    i18n: true,
    extra: {
        data: function () {
            return {
                /* SVG chart data — language-independent, rendering-only */
                svg: {
                    /* D1 bar chart file sizes */
                    d1Files: [
                        { name: 'sidebar_setting.py', lines: 365, color: '#f85149' },
                        { name: 'prompts.py', lines: 364, color: '#f85149' },
                        { name: '_1_ytdlp.py', lines: 291, color: '#d29922' },
                        { name: 'download_video_section.py', lines: 287, color: '#d29922' },
                        { name: 'st.py', lines: 271, color: '#d29922' },
                        { name: '_10_gen_audio.py', lines: 232, color: '#d29922' },
                        { name: 'install.py', lines: 263, color: '#d29922' },
                        { name: 'setup_env.py', lines: 222, color: '#d29922' },
                        { name: 'sf_fishtts.py', lines: 220, color: '#d29922' }
                    ],
                    /* D4 nest depth top 5 */
                    d4Top5: [
                        { name: 'tts_main.py', depth: 11, color: '#f85149' },
                        { name: 'sidebar_setting', depth: 9, color: '#f85149' },
                        { name: 'split_by_connector', depth: 8, color: '#f85149' },
                        { name: 'download_video', depth: 7, color: '#d29922' },
                        { name: 'batch_processor', depth: 7, color: '#d29922' }
                    ],
                    /* D5 top functions */
                    d5TopFuncs: [
                        { name: 'page_setting', lines: 302, color: '#f85149', note: '(6.0x)' },
                        { name: '_render_download_ui', lines: 202, color: '#f85149', note: '(4.0x)' },
                        { name: 'main (install)', lines: 118, color: '#d29922', note: '' },
                        { name: 'download_video_ytdlp', lines: 116, color: '#d29922', note: '' },
                        { name: 'transcribe_audio', lines: 89, color: '#d29922', note: '' },
                        { name: 'process_srt', lines: 82, color: '#d29922', note: '' }
                    ]
                }
            };
        },
        methods: {
            /** Compute SVG radar polygon points for 7 dimensions */
            radarPoints: function (scores) {
                var r = 150;
                var cx = 280, cy = 200;
                var angles = [270, 321.4, 12.9, 64.3, 115.7, 167.1, 218.6];
                var points = scores.map(function (s, i) {
                    var rad = (angles[i] * Math.PI) / 180;
                    var dist = (s / 100) * r;
                    return (cx + dist * Math.cos(rad)).toFixed(1) + ',' + (cy + dist * Math.sin(rad)).toFixed(1);
                });
                return points.join(' ');
            }
        }
    }
});
