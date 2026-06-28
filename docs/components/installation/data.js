/**
 * Installation 数据源
 * ----------------------------------------------------------------------
 * 抽离 installation 的展示数据（系统要求 + 依赖列表），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.INSTALLATION_CONFIG = {
    systemRequirements: [
        { component: 'RAM',                min: '8 GB',   recommended: '16 GB+' },
        { component: 'GPU (local WhisperX)', min: '8 GB VRAM', recommended: '12 GB+ VRAM' },
        { component: 'Disk',               min: '5 GB',   recommended: '20 GB+ (for model cache)' },
        { component: 'OS',                 min: 'macOS 12+ / Windows 10+ / Ubuntu 20.04+', recommended: '', colspan: true }
    ],
    dependencies: [
        { name: 'streamlit',   purpose: 'Web UI' },
        { name: 'yt-dlp',      purpose: 'YouTube video download' },
        { name: 'whisperx',    purpose: 'Word-level speech recognition' },
        { name: 'spacy',       purpose: 'NLP sentence segmentation' },
        { name: 'demucs',      purpose: 'Vocal separation (optional)' },
        { name: 'ruamel.yaml', purpose: 'Config file management' }
    ]
};
