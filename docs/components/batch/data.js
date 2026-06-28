/**
 * Batch 数据源
 * ----------------------------------------------------------------------
 * 抽离 batch 的展示数据（目录树 + 使用指南 + 注意事项），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 *
 * 设计原则：
 *   1. 顶层按语义分块（meta / overview / guide / steps / considerations）。
 *   2. 步骤 / 注意事项携带 `id` 语义键，供锚点 / 追踪使用。
 *   3. 含 HTML 的文本使用 `{ html: '...' }` 包装，与纯文本明确区分。
 *   4. 表格列与示例列分离，避免渲染时再拆分。
 *
 * 数据来源：原 batch/README.md（已迁移至 docs 单入口管理）。
 */

window.BATCH_CONFIG = {
    /* ── 元信息 ──────────────────────────────────────── */
    meta: {
        source: 'batch/README.md',
        migratedAt: '2026-06-27'
    },

    /* ── 总览 ────────────────────────────────────────── */
    overview: {
        title: 'Batch Processing',
        emoji: '📊',
        description: 'Batch mode is designed for processing video playlists or local video directories in sequence. Each video goes through the full text+dubbing pipeline automatically.',
        dirTree: [
            'batch/',
            '├── utils/',
            '│   ├── batch_processor.py    # Batch orchestration',
            '│   ├── video_processor.py    # Single video processor',
            '│   └── settings_check.py     # Config validation',
            '└── ...'
        ].join('\n')
    },

    /* ── 使用指南 ────────────────────────────────────── */
    guide: {
        prerequisite: { html: 'Before utilizing the batch mode, ensure you have used the Streamlit mode and properly configured the parameters in <code>config.yaml</code>.' },
        warning: {
            severity: 'warning', // 对应 docs/styles/components.css 中的 .callout-{severity}
            html: 'Keep <code>tasks_setting.xlsx</code> closed during execution to prevent interruptions due to file access conflicts.'
        }
    },

    /* ── 步骤 ────────────────────────────────────────── */
    steps: [
        {
            id: 'prepare-videos',
            title: '1. Video File Preparation',
            instructions: [
                { html: 'Place your video files in the <code>input</code> folder' },
                { html: 'YouTube links can be specified in the next step' }
            ]
        },
        {
            id: 'configure-tasks',
            title: '2. Task Configuration',
            intro: { html: 'Edit the <code>tasks_setting.xlsx</code> file:' },
            // 字段定义：label 展示名 / key 标识 / description / constraints
            fields: [
                {
                    key: 'video_file',
                    label: 'Video File',
                    description: { html: 'Video filename (without <code>input/</code> prefix) or YouTube URL' },
                    constraints: { html: '-' }
                },
                {
                    key: 'source_language',
                    label: 'Source Language',
                    description: { html: 'Source language' },
                    constraints: { html: '<code>en</code>, <code>zh</code>, ... or leave empty for default' }
                },
                {
                    key: 'target_language',
                    label: 'Target Language',
                    description: { html: 'Translation language' },
                    constraints: { html: 'Use natural language description, or leave empty for default' }
                },
                {
                    key: 'dubbing',
                    label: 'Dubbing',
                    description: { html: 'Enable dubbing' },
                    constraints: { html: '0 or empty: no dubbing; 1: enable dubbing' }
                }
            ],
            example: {
                title: 'Example:',
                columns: ['Video File', 'Source Language', 'Target Language', 'Dubbing'],
                rows: [
                    ['https://www.youtube.com/xxx', '', 'German', ''],
                    ['Kungfu Panda.mp4',            '', '',       '1']
                ]
            }
        },
        {
            id: 'execute',
            title: '3. Executing Batch Processing',
            instructions: [
                { html: 'Double-click to run <code>OneKeyBatch.bat</code>' },
                { html: 'Output files will be saved in the <code>output</code> folder' },
                { html: 'Task status can be monitored in the <code>Status</code> column of <code>tasks_setting.xlsx</code>' }
            ]
        }
    ],

    /* ── 注意事项 ────────────────────────────────────── */
    considerations: [
        {
            id: 'interruptions',
            title: 'Handling Interruptions',
            description: { html: 'If the command line is closed unexpectedly, language settings in <code>config.yaml</code> may be altered. Check settings before retrying.' }
        },
        {
            id: 'error-management',
            title: 'Error Management',
            behaviors: [
                { html: 'Failed files will be moved to the <code>output/ERROR</code> folder' },
                { html: 'Error messages are recorded in the <code>Status</code> column of <code>tasks_setting.xlsx</code>' }
            ],
            recovery: {
                title: 'To retry:',
                steps: [
                    { html: 'Move the single video folder from <code>ERROR</code> to the root directory' },
                    { html: 'Rename it to <code>output</code>' },
                    { html: 'Use Streamlit mode to process again' }
                ]
            }
        }
    ]
};