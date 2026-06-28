/**
 * API Config 数据源
 * ----------------------------------------------------------------------
 * 抽离 api-config 的展示数据（推荐模型 + 一键 Provider 卡片），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.API_CONFIG_DATA = {
    recommendedModels: [
        { tier: '🏆 Best',   models: 'claude-sonnet-4-6, gpt-5.4, gemini-3.1-pro' },
        { tier: '🥈 Great',  models: 'deepseek-v4-pro, grok-4.1' },
        { tier: '💰 Budget', models: 'gemini-3-flash, gpt-5.4-mini, deepseek-chat' }
    ],
    providers: [
        {
            icon: '🔗',
            name: '302.ai — Unified API',
            desc: 'One API key covers LLM + WhisperX + TTS.',
            link: { label: 'Get key →', href: 'https://gpt302.saaslink.net/C2oHR9' },
            detail: 'Configuration: set <code>api.base_url</code> to 302.ai endpoint, same key works for <code>whisperX_302_api_key</code> and TTS 302 APIs.',
            code: null
        },
        {
            icon: '🧠',
            name: 'DeepSeek',
            desc: 'Good balance of quality and price.',
            link: { label: 'Get key →', href: 'https://platform.deepseek.com/' },
            detail: null,
            code: "api:\n  key: 'sk-...'\n  base_url: 'https://api.deepseek.com'\n  model: 'deepseek-v4-pro'"
        },
        {
            icon: '🆓',
            name: 'Free: Ollama + Edge-TTS',
            desc: 'Run LLM locally with Ollama + edage_tts for a completely free pipeline.',
            link: { label: 'Ollama', href: 'https://ollama.com/' },
            detail: null,
            code: "api:\n  key: 'ollama'\n  base_url: 'http://localhost:11434'\n  model: 'qwen3'\n  llm_support_json: false\nmax_workers: 1\ntts_method: 'edage_tts'"
        }
    ]
};
