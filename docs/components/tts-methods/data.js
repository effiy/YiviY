/**
 * TTS Methods 数据源
 * ----------------------------------------------------------------------
 * 抽离 tts-methods 的展示数据（每个 TTS 引擎的 yaml 配置样例），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.TTS_METHODS_CONFIG = {
    methods: [
        {
            name: 'azure_tts',
            badge: null,
            code: "azure_tts:\n  api_key: 'YOUR_302_API_KEY'\n  voice: 'zh-CN-YunfengNeural'"
        },
        {
            name: 'edge_tts',
            badge: 'Free!',
            code: "edge_tts:\n  voice: 'zh-CN-XiaoxiaoNeural'"
        },
        {
            name: 'sf_fish_tts',
            badge: 'SiliconFlow FishTTS',
            code: "sf_fish_tts:\n  api_key: 'YOUR_SF_KEY'\n  voice: 'anna'\n  mode: 'preset'   # preset | custom | dynamic"
        },
        {
            name: 'gpt_sovits',
            badge: 'Local',
            code: "gpt_sovits:\n  character: 'Huanyuv2'\n  refer_mode: 3     # 1=fixed ref | 2=first audio | 3=per-segment"
        },
        {
            name: 'custom_tts',
            badge: null,
            code: null,
            note: 'Edit <code>core/tts_backend/custom_tts.py</code> to integrate any TTS engine.'
        }
    ]
};
