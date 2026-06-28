/**
 * Config 数据源
 * ----------------------------------------------------------------------
 * 抽离 config 的展示数据（basic + advanced 配置项），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.CONFIG_DATA = {
    basicSettings: [
        { key: 'display_language',         type: 'string', default: 'zh-CN',           desc: 'UI language. See <code>translations/</code> for supported locales.' },
        { key: 'api.key',                  type: 'string', default: '—',               desc: 'LLM API key' },
        { key: 'api.base_url',             type: 'string', default: 'api.deepseek.com', desc: 'OpenAI-compatible endpoint' },
        { key: 'api.model',                type: 'string', default: 'deepseek-v4-pro', desc: 'Model ID' },
        { key: 'api.llm_support_json',     type: 'bool',   default: 'true',            desc: 'Enable if model supports JSON mode' },
        { key: 'max_workers',              type: 'int',    default: '4',               desc: 'LLM parallel threads. Set to 1 for local LLM.' },
        { key: 'target_language',          type: 'string', default: '简体中文',          desc: 'Natural language description' },
        { key: 'demucs',                   type: 'bool',   default: 'true',            desc: 'Vocal separation before transcription' },
        { key: 'burn_subtitles',           type: 'bool',   default: 'true',            desc: 'Burn subtitles into output video' }
    ],
    advancedSettings: [
        { key: 'ffmpeg_gpu',               type: 'bool', default: 'false', desc: 'h264_nvenc GPU acceleration' },
        { key: 'summary_length',           type: 'int',  default: '8000',  desc: 'Summary context window (tokens)' },
        { key: 'max_split_length',         type: 'int',  default: '20',    desc: 'First-pass word split threshold' },
        { key: 'reflect_translate',        type: 'bool', default: 'true',  desc: '3-phase translation quality loop' },
        { key: 'pause_before_translate',   type: 'bool', default: 'false', desc: 'Manual terminology review' }
    ]
};
