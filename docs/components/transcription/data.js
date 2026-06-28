/**
 * Transcription 数据源
 * ----------------------------------------------------------------------
 * 抽离 transcription 的展示数据（Whisper 模型表 + 运行时选项 +
 * 支持语言），便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.TRANSCRIPTION_CONFIG = {
    whisperModels: [
        { name: 'large-v3',         speed: 'Standard', accuracy: 'Highest',  vram: '~10 GB' },
        { name: 'large-v3-turbo',   speed: 'Faster',   accuracy: 'Very good', vram: '~6 GB'  }
    ],
    runtimes: [
        { name: 'local',       requirement: '8+ GB GPU',         cost: 'Free' },
        { name: 'cloud',       requirement: '302.ai API key',    cost: 'Pay per use' },
        { name: 'elevenlabs',  requirement: 'ElevenLabs API key', cost: 'Pay per use' }
    ],
    languages: '🇺🇸 English · 🇷🇺 Russian · 🇫🇷 French · 🇩🇪 German · 🇮🇹 Italian · 🇪🇸 Spanish · 🇯🇵 Japanese · 🇨🇳 Chinese'
};
