window.API_CONFIG_DATA={

    /* ── English ───────────────────────────────────── */
    en:{
        title:'API Setup',
        api: {
            title: 'API',
            intro: 'VideoLingo supports OpenAI-format APIs and various TTS interfaces:',
            llmLabel: 'LLM',
            llm:     { html: '<code>claude-sonnet-4.6</code>, <code>gpt-5.4</code>, <code>gemini-3.1-pro</code>, <code>deepseek-v3</code>, <code>grok-4.1</code>, ... (sorted by quality; budget options: <code>gemini-3-flash</code> or <code>gpt-5.4-mini</code>)' },
            whisperLabel: 'WhisperX',
            whisper:     'Run whisperX locally or use the 302.ai API',
            ttsLabel: 'TTS',
            tts:     { html: '<code>azure-tts</code>, <code>openai-tts</code>, <code>siliconflow-fishtts</code>, <strong><code>fish-tts</code></strong>, <code>GPT-SoVITS</code>, <code>edge-tts</code>, <code>*custom-tts</code> (you can modify your own TTS in custom_tts.py!)' },
            note:    { html: 'VideoLingo works with <a href="https://gpt302.saaslink.net/C2oHR9" target="_blank"><strong>302.ai</strong></a> — one API key for all services (LLM, WhisperX, TTS). Or run locally with Ollama and Edge-TTS for free, no API needed!' }
        },
        recommendedModels:[
            {tier:'Best',models:'claude-sonnet-4-6, gpt-5.4, gemini-3.1-pro'},
            {tier:'Great',models:'deepseek-v4-pro, grok-4.1'},
            {tier:'Budget',models:'gemini-3-flash, gpt-5.4-mini, deepseek-chat'}
        ],
        providers:[
            {name:'302.ai — Unified API',desc:'One API key covers LLM + WhisperX + TTS.',link:{label:'Get key →',href:'https://gpt302.saaslink.net/C2oHR9'},detail:'Configuration: set <code>api.base_url</code> to 302.ai endpoint, same key works for <code>whisperX_302_api_key</code> and TTS 302 APIs.',code:null},
            {name:'DeepSeek',desc:'Good balance of quality and price.',link:{label:'Get key →',href:'https://platform.deepseek.com/'},detail:null,code:"api:\n  key: 'sk-...'\n  base_url: 'https://api.deepseek.com'\n  model: 'deepseek-v4-pro'"},
            {name:'Free: Ollama + Edge-TTS',desc:'Run LLM locally with Ollama + edage_tts for a completely free pipeline.',link:{label:'Ollama',href:'https://ollama.com/'},detail:null,code:"api:\n  key: 'ollama'\n  base_url: 'http://localhost:11434'\n  model: 'qwen3'\n  llm_support_json: false\nmax_workers: 1\ntts_method: 'edage_tts'"}
        ]
    },

    /* ── Chinese Simplified ───────────────────────── */
    'zh-CN':{
        title:'API 设置',
        api: {
            title: 'API',
            intro: '本项目支持 OpenAI-Like 格式的 api 和多种配音接口：',
            llmLabel: 'LLM',
            llm:     { html: '<code>claude-sonnet-4.6</code>, <code>gpt-5.4</code>, <code>gemini-3.1-pro</code>, <code>deepseek-v3</code>, <code>grok-4.1</code>, ...（按质量排序；预算方案可尝试 <code>gemini-3-flash</code> 或 <code>gpt-5.4-mini</code>）' },
            whisperLabel: 'WhisperX',
            whisper:     '本地运行 WhisperX 或使用 302.ai API',
            ttsLabel: 'TTS',
            tts:     { html: '<code>azure-tts</code>, <code>openai-tts</code>, <code>siliconflow-fishtts</code>, <strong><code>fish-tts</code></strong>, <code>GPT-SoVITS</code>, <code>edge-tts</code>, <code>*custom-tts</code>(你可以在 custom_tts.py 中自定义 TTS!)' },
            note:    { html: 'VideoLingo 现已与 <a href="https://gpt302.saaslink.net/C2oHR9" target="_blank"><strong>302.ai</strong></a> 集成，<strong>一个 API KEY</strong> 即可同时支持 LLM、WhisperX 和 TTS！同时也支持完全本地部署，使用 Ollama 作为 LLM 和 Edge-TTS 作为配音，无需云端 API！' }
        },
        recommendedModels:[
            {tier:'最佳',models:'claude-sonnet-4-6, gpt-5.4, gemini-3.1-pro'},
            {tier:'优秀',models:'deepseek-v4-pro, grok-4.1'},
            {tier:'经济',models:'gemini-3-flash, gpt-5.4-mini, deepseek-chat'}
        ],
        providers:[
            {name:'302.ai — 统一 API',desc:'一个 API 密钥覆盖 LLM + WhisperX + TTS。',link:{label:'获取密钥 →',href:'https://gpt302.saaslink.net/C2oHR9'},detail:'配置方式：将 <code>api.base_url</code> 设置为 302.ai 端点，同一密钥可用于 <code>whisperX_302_api_key</code> 和 TTS 302 API。',code:null},
            {name:'DeepSeek',desc:'质量与价格的良好平衡。',link:{label:'获取密钥 →',href:'https://platform.deepseek.com/'},detail:null,code:"api:\n  key: 'sk-...'\n  base_url: 'https://api.deepseek.com'\n  model: 'deepseek-v4-pro'"},
            {name:'免费方案：Ollama + Edge-TTS',desc:'使用 Ollama 本地运行 LLM + edage_tts，实现完全免费的流水线。',link:{label:'Ollama',href:'https://ollama.com/'},detail:null,code:"api:\n  key: 'ollama'\n  base_url: 'http://localhost:11434'\n  model: 'qwen3'\n  llm_support_json: false\nmax_workers: 1\ntts_method: 'edage_tts'"}
        ]
    },

};