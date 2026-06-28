/**
 * Dubbing 数据源
 * ----------------------------------------------------------------------
 * 抽离 dubbing 的展示数据（TTS 引擎对比表 + 速度调节表），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.DUBBING_CONFIG = {
    ttsMethods: [
        { method: 'azure_tts',     quality: '⭐⭐⭐⭐⭐', speed: 'Fast',   cost: '302.ai',      voiceClone: false },
        { method: 'openai_tts',    quality: '⭐⭐⭐⭐⭐', speed: 'Fast',   cost: '302.ai',      voiceClone: false },
        { method: 'edge_tts',      quality: '⭐⭐⭐⭐',   speed: 'Fast',   cost: 'Free',        voiceClone: false },
        { method: 'fish_tts',      quality: '⭐⭐⭐⭐',   speed: 'Medium', cost: '302.ai',      voiceClone: true  },
        { method: 'sf_fish_tts',   quality: '⭐⭐⭐⭐',   speed: 'Medium', cost: 'SiliconFlow', voiceClone: true  },
        { method: 'sf_cosyvoice2', quality: '⭐⭐⭐⭐⭐', speed: 'Medium', cost: 'SiliconFlow', voiceClone: true  },
        { method: 'gpt_sovits',    quality: '⭐⭐⭐⭐',   speed: 'Slow',   cost: 'Free (local)', voiceClone: true },
        { method: 'f5tts',         quality: '⭐⭐⭐',     speed: 'Medium', cost: '302.ai',      voiceClone: true  },
        { method: 'custom_tts',    quality: 'Custom',    speed: 'Custom', cost: 'Custom',     voiceClone: true  }
    ],
    speedFactors: [
        { key: 'speed_factor.min',     defaultValue: '1.0', meaning: 'Minimum speed (1:1)' },
        { key: 'speed_factor.accept',  defaultValue: '1.2', meaning: 'Max acceptable speed without quality loss' },
        { key: 'speed_factor.max',     defaultValue: '1.4', meaning: 'Absolute max speed (compressed)' }
    ]
};
