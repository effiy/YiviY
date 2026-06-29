/**
 * Translations 数据源
 * ----------------------------------------------------------------------
 * 抽离 docs 站点的多语言内容（7 语言 × README 全量结构），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 *
 * 设计原则（i18n:true 约定）：
 *   1. 顶层 keys 中, 语言 code (en / zh-CN / ...) 对应各语言的扁平内容
 *   2. 跨语言不变的 URL / shell 命令 / 第三方项目链接抽到 constants
 *   3. 切换语言时由 mountDocComponent 的 wrapI18n 自动替换 Vue 实例属性
 *   4. 含 HTML 的文本使用 `{ html: '...' }` 包装，纯文本用 string
 */

window.TRANSLATIONS_CONTENT = {
constants: {
        repo: {
            clone: 'git clone https://github.com/Huanshere/VideoLingo.git',
            cloneDir: 'cd VideoLingo',
            issues: 'https://github.com/Huanshere/VideoLingo/issues',
            pulls: 'https://github.com/Huanshere/VideoLingo/pulls',
            dockerDoc: 'docs/index.html#docker'
        },
        saas: {
            url: 'https://videolingo.io',
            helpAgent: 'https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh',
            partner302: 'https://gpt302.saaslink.net/C2oHR9'
        },
        social: {
            trendshift: 'https://trendshift.io/repositories/12200',
            twitter: 'https://twitter.com/Huanshere',
            email: 'team@videolingo.io'
        },
        tools: {
            cudaUrl: 'https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe',
            cudnnUrl: 'https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe',
            cudaPath: 'C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6',
            chocolatey: 'https://chocolatey.org/',
            homebrew: 'https://brew.sh/',
            uvDocs: 'https://docs.astral.sh/uv/'
        }
    },
en: {
        languages: {
            title: 'Language Support',
            inputTitle: { html: '<strong>Input languages supported:</strong>' },
            inputLangs: [
                {
                    flag: '🇺🇸',
                    name: 'English',
                    rating: '🤩'
                },
                {
                    flag: '🇷🇺',
                    name: 'Russian',
                    rating: '😊'
                },
                {
                    flag: '🇫🇷',
                    name: 'French',
                    rating: '🤩'
                },
                {
                    flag: '🇩🇪',
                    name: 'German',
                    rating: '🤩'
                },
                {
                    flag: '🇮🇹',
                    name: 'Italian',
                    rating: '🤩'
                },
                {
                    flag: '🇪🇸',
                    name: 'Spanish',
                    rating: '🤩'
                },
                {
                    flag: '🇯🇵',
                    name: 'Japanese',
                    rating: '😐'
                },
                {
                    flag: '🇨🇳',
                    name: 'Chinese*',
                    rating: '😊'
                }
            ],
            inputNote: { html: '* Chinese currently uses a separate punctuation-enhanced whisper model...' },
            outputNote: 'Translation supports all languages; dubbing language depends on the chosen TTS method.'
        }
    },
'zh-CN': {
        languages: {
            title: '语言支持',
            inputTitle: { html: '<strong>输入语言支持：</strong>' },
            inputLangs: [
                {
                    flag: '🇺🇸',
                    name: '英语',
                    rating: '🤩'
                },
                {
                    flag: '🇷🇺',
                    name: '俄语',
                    rating: '😊'
                },
                {
                    flag: '🇫🇷',
                    name: '法语',
                    rating: '🤩'
                },
                {
                    flag: '🇩🇪',
                    name: '德语',
                    rating: '🤩'
                },
                {
                    flag: '🇮🇹',
                    name: '意大利语',
                    rating: '🤩'
                },
                {
                    flag: '🇪🇸',
                    name: '西班牙语',
                    rating: '🤩'
                },
                {
                    flag: '🇯🇵',
                    name: '日语',
                    rating: '😐'
                },
                {
                    flag: '🇨🇳',
                    name: '中文*',
                    rating: '😊'
                }
            ],
            inputNote: { html: '*中文使用单独的标点增强后的 whisper 模型...' },
            outputNote: '翻译语言支持所有语言，配音语言取决于选取的TTS。'
        }
    },
};
