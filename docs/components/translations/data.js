/**
 * Translations 数据源
 * ----------------------------------------------------------------------
 * 抽离 docs 站点的多语言内容（7 语言 × README 全量结构），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 *
 * 数据来源：
 *   - 根目录 README.md            → 'en'
 *   - translations/README.zh.md   → 'zh-CN'
 *   - translations/README.zh-TW.md → 'zh-TW'
 *   - translations/README.ja.md   → 'ja'
 *   - translations/README.es.md   → 'es'
 *   - translations/README.ru.md   → 'ru'
 *   - translations/README.fr.md   → 'fr'
 *
 * 设计原则：
 *   1. 顶部 constants 收集跨语言不变的 URL / shell 命令 / 第三方项目链接。
 *   2. 每种语言对应 content[code]，结构相同；只翻译文本，不翻译链接。
 *   3. 含 HTML 的文本使用 `{ html: '...' }` 包装，纯文本用 string。
 *   4. 命令块中跨语言不变的部分抽到 constants.shell。
 */

window.TRANSLATIONS_CONFIG = {

    /* ── 语言切换器元数据 ─────────────────────────────── */
    available: [
        { code: 'en',    label: 'English',    native: 'English',   emoji: '🇬🇧' },
        { code: 'zh-CN', label: '简体中文',  native: '简体中文', emoji: '🇨🇳' },
        { code: 'zh-TW', label: '繁體中文',  native: '繁體中文', emoji: '🇭🇰' },
        { code: 'ja',    label: '日本語',    native: '日本語',   emoji: '🇯🇵' },
        { code: 'es',    label: 'Español',   native: 'Español',  emoji: '🇪🇸' },
        { code: 'ru',    label: 'Русский',   native: 'Русский',  emoji: '🇷🇺' },
        { code: 'fr',    label: 'Français',  native: 'Français', emoji: '🇫🇷' }
    ],
    default: 'en',
    storageKey: 'vl-docs-lang',

    /* ── 跨语言常量（链接 / shell / 命令） ─────────────── */
    constants: {
        repo: {
            clone:     'git clone https://github.com/Huanshere/VideoLingo.git',
            cloneDir:  'cd VideoLingo',
            issues:    'https://github.com/Huanshere/VideoLingo/issues',
            pulls:     'https://github.com/Huanshere/VideoLingo/pulls',
            dockerDoc: 'docs/index.html#docker'
        },
        saas: {
            url:       'https://videolingo.io',
            helpAgent: 'https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh',
            partner302: 'https://gpt302.saaslink.net/C2oHR9'
        },
        social: {
            trendshift:    'https://trendshift.io/repositories/12200',
            twitter:       'https://twitter.com/Huanshere',
            email:         'team@videolingo.io'
        },
        tools: {
            cudaUrl: 'https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe',
            cudnnUrl: 'https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe',
            cudaPath: 'C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6',
            chocolatey: 'https://chocolatey.org/',
            homebrew:   'https://brew.sh/',
            uvDocs:     'https://docs.astral.sh/uv/'
        },
        thanks: [
            { name: 'whisperX',  url: 'https://github.com/m-bain/whisperX' },
            { name: 'yt-dlp',    url: 'https://github.com/yt-dlp/yt-dlp' },
            { name: 'json_repair', url: 'https://github.com/mangiucugna/json_repair' },
            { name: 'BELLE',     url: 'https://github.com/LianjiaTech/BELLE' }
        ],
        shell: {
            // 不变的 shell 命令块
            uvSetup: 'python setup_env.py',
            uvStartWin: '.venv\\Scripts\\streamlit run st.py        # Windows',
            uvStartUnix: '.venv/bin/streamlit run st.py            # macOS / Linux',
            condaCreate: 'conda create -n videolingo python=3.10.0 -y',
            condaActivate: 'conda activate videolingo',
            condaInstall: 'python install.py',
            condaStart: 'streamlit run st.py',
            dockerBuild: 'docker build -t videolingo .',
            dockerRun:   'docker run -d -p 8501:8501 --gpus all videolingo'
        }
    },

    /* ── 演示视频（URL 不变，标题按语言翻译） ─────────── */
    demoVideos: [
        { id: 'dualSubtitles',    url: 'https://github.com/user-attachments/assets/a5c3d8d1-2b29-4ba9-b0d0-25896829d951' },
        { id: 'cosyVoiceClone',   url: 'https://github.com/user-attachments/assets/e065fe4c-3694-477f-b4d6-316917df7c0a' },
        { id: 'gptSovitsDubbing', url: 'https://github.com/user-attachments/assets/47d965b2-b4ab-4a0b-9d08-b49a7bf3508c' }
    ],

    /* ── 多语言内容 ───────────────────────────────────── */
    content: {

        /* ════════════════════════════════════════════════ */
        'en': {
            hero: { title: 'Connect the World, Frame by Frame' },
            overview: {
                title: '🌟 Overview',
                cta:   'Try VL Now!',
                ctaHref: 'https://videolingo.io',
                lead:  'VideoLingo is an all-in-one video translation, localization, and dubbing tool aimed at generating Netflix-quality subtitles. It eliminates stiff machine translations and multi-line subtitles while adding high-quality dubbing, enabling global knowledge sharing across language barriers.',
                features: [
                    { html: '🎥 YouTube video download via yt-dlp' },
                    { html: '<strong>🎙️ Word-level and Low-illusion subtitle recognition with WhisperX</strong>' },
                    { html: '<strong>📝 NLP and AI-powered subtitle segmentation</strong>' },
                    { html: '<strong>📚 Custom + AI-generated terminology for coherent translation</strong>' },
                    { html: '<strong>🔄 3-step Translate-Reflect-Adaptation for cinematic quality</strong>' },
                    { html: '<strong>✅ Netflix-standard, Single-line subtitles Only</strong>' },
                    { html: '<strong>🗣️ Dubbing with GPT-SoVITS, Azure, OpenAI, and more</strong>' },
                    { html: '🚀 One-click startup and processing in Streamlit' },
                    { html: '🌍 Multi-language support in Streamlit UI' },
                    { html: '📝 Detailed logging with progress resumption' },
                    { html: '🔍 Model searchbox with API auto-fetch — search and filter from your provider\'s full model list' },
                    { html: '⏯️ Task control — pause, resume, or stop processing at any step' }
                ],
                tagline: { html: 'Difference from similar projects: <strong>Single-line subtitles only, superior translation quality, seamless dubbing experience</strong>' }
            },
            demo: {
                title: '🎥 Demo',
                items: {
                    dualSubtitles:    'Dual Subtitles',
                    cosyVoiceClone:   'Cosy2 Voice Clone',
                    gptSovitsDubbing: 'GPT-SoVITS Dubbing'
                }
            },
            languages: {
                title: 'Language Support',
                inputTitle: { html: '<strong>Input languages supported:</strong>' },
                inputLangs: [
                    { flag: '🇺🇸', name: 'English',    rating: '🤩' },
                    { flag: '🇷🇺', name: 'Russian',    rating: '😊' },
                    { flag: '🇫🇷', name: 'French',     rating: '🤩' },
                    { flag: '🇩🇪', name: 'German',     rating: '🤩' },
                    { flag: '🇮🇹', name: 'Italian',    rating: '🤩' },
                    { flag: '🇪🇸', name: 'Spanish',    rating: '🤩' },
                    { flag: '🇯🇵', name: 'Japanese',   rating: '😐' },
                    { flag: '🇨🇳', name: 'Chinese*',   rating: '😊' }
                ],
                inputNote: { html: '* Chinese currently uses a separate punctuation-enhanced whisper model...' },
                outputNote: 'Translation supports all languages; dubbing language depends on the chosen TTS method.'
            },
            install: {
                title: 'Installation',
                helpNote: { html: 'Encountered issues? Chat with our free online AI agent <a href="https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh" target="_blank">here</a>.' },
                cuda: {
                    label: 'Note:',
                    intro: 'Windows users with NVIDIA GPUs should complete these steps before installing:',
                    steps: [
                        { html: 'Install <a href="https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe" target="_blank">CUDA Toolkit 12.6</a>' },
                        { html: 'Install <a href="https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe" target="_blank">CUDNN 9.3.0</a>' },
                        { html: 'Add <code>C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6</code> to system PATH' },
                        { html: 'Restart your computer' }
                    ]
                },
                ffmpeg: {
                    label: 'Note:',
                    intro: 'FFmpeg is required. Install via package manager:',
                    installs: [
                        { platform: 'Windows', command: 'choco install ffmpeg', via: 'Chocolatey' },
                        { platform: 'macOS',   command: 'brew install ffmpeg',  via: 'Homebrew' },
                        { platform: 'Linux',   command: 'sudo apt install ffmpeg', via: 'Debian/Ubuntu' }
                    ]
                }
            },
            methods: {
                uv: {
                    title: 'Method 1: Using uv (Recommended)',
                    intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> auto-downloads Python 3.10 and creates an isolated env — no manual Python or Anaconda install needed.' },
                    steps: [
                        { desc: 'Clone the repo', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'One-click install (uv + Python 3.10 + all deps)', command: 'python setup_env.py' },
                        { desc: 'Start the app', command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux', multiline: true }
                    ],
                    alt: 'Or double-click OneKeyStart_uv.bat on Windows.'
                },
                conda: {
                    title: 'Method 2: Using Conda',
                    warning: '⚠️ Not recommended. This method will no longer be maintained — please use uv (Method 1) above.',
                    summary: 'Click to expand Conda install steps',
                    steps: [
                        { desc: 'Clone the repo', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'Install deps (requires python=3.10)', command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py' },
                        { desc: 'Start the app', command: 'streamlit run st.py' }
                    ]
                },
                docker: {
                    title: 'Docker',
                    intro: 'Alternatively, use Docker (requires CUDA 12.4 and NVIDIA Driver >550), see Docker docs:',
                    commands: [
                        'docker build -t videolingo .',
                        'docker run -d -p 8501:8501 --gpus all videolingo'
                    ]
                }
            },
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
            limitations: {
                title: 'Current Limitations',
                items: [
                    { html: 'WhisperX transcription performance can be affected by video background noise because it uses the wav2vec model for alignment. For videos with loud background music, enable vocal separation enhancement. Also, subtitles ending in digits or special characters may be truncated early because wav2vec cannot map digit characters (e.g. "1") to their spoken form ("one").' },
                    { html: 'Using weaker models may error mid-process due to strict JSON format requirements. If this happens, delete the <code>output</code> folder and retry with a different LLM — otherwise repeat execution will read the previous erroneous response and fail the same way.' },
                    { html: 'Due to differences in speech rate and intonation across languages, and the influence of the translation step, dubbing may not be 100% perfect. However, the project has done extensive engineering on speech rate to ensure the best dubbing result.' },
                    { html: '<strong>Multilingual video transcription will only retain the main language.</strong> This is because whisperX uses language-specific models for forced alignment at word level, and will drop unrecognized languages.' },
                    { html: '<strong>Cannot dub multiple speakers separately</strong>, as whisperX\'s speaker diarization is not reliable enough.' }
                ]
            },
            license: {
                title: '📄 License',
                content: 'This project is licensed under Apache 2.0. Special thanks to the following open-source projects:'
            },
            contact: {
                title: '📬 Contact',
                channels: [
                    { html: 'Submit <a href="https://github.com/Huanshere/VideoLingo/issues" target="_blank">Issues</a> or <a href="https://github.com/Huanshere/VideoLingo/pulls" target="_blank">Pull Requests</a> on GitHub' },
                    { html: 'DM me on Twitter: <a href="https://twitter.com/Huanshere" target="_blank">@Huanshere</a>' },
                    { html: 'Send email to: <a href="mailto:team@videolingo.io">team@videolingo.io</a>' }
                ]
            }
        },

        /* ════════════════════════════════════════════════ */
        'zh-CN': {
            hero: { title: '连接世界每一帧' },
            overview: {
                title: '🌟 简介',
                cta:   '在线体验！',
                ctaHref: 'https://videolingo.io',
                lead:  'VideoLingo 是一站式视频翻译本地化配音工具，能够一键生成 Netflix 级别的高质量字幕，告别生硬机翻，告别多行字幕，还能加上高质量的克隆配音，让全世界的知识能够跨越语言的障碍共享。',
                features: [
                    { html: '🎥 使用 yt-dlp 从 Youtube 链接下载视频' },
                    { html: '<strong>🎙️ 使用 WhisperX 进行单词级和低幻觉字幕识别</strong>' },
                    { html: '<strong>📝 使用 NLP 和 AI 进行字幕分割</strong>' },
                    { html: '<strong>📚 自定义 + AI 生成术语库，保证翻译连贯性</strong>' },
                    { html: '<strong>🔄 三步直译、反思、意译，实现影视级翻译质量</strong>' },
                    { html: '<strong>✅ 按照 Netflix 标准检查单行长度，绝无双行字幕</strong>' },
                    { html: '<strong>🗣️ 支持 GPT-SoVITS、Azure、OpenAI 等多种配音方案</strong>' },
                    { html: '🚀 一键启动，在 streamlit 中一键出片' },
                    { html: '🌍 多语言支持就绪的 streamlit UI' },
                    { html: '📝 详细记录每步操作日志，支持随时中断和恢复进度' },
                    { html: '🔍 模型搜索选择器，自动从 API 获取完整模型列表，支持搜索筛选' },
                    { html: '⏯️ 任务控制 — 处理过程中可随时暂停、继续或停止' }
                ],
                tagline: { html: '与同类项目相比的优势：<strong>绝无多行字幕，最佳的翻译质量，无缝的配音体验</strong>' }
            },
            demo: {
                title: '🎥 演示',
                items: {
                    dualSubtitles:    '双语字幕',
                    cosyVoiceClone:   'Cosy2 声音克隆',
                    gptSovitsDubbing: 'GPT-SoVITS 配音'
                }
            },
            languages: {
                title: '语言支持',
                inputTitle: { html: '<strong>输入语言支持：</strong>' },
                inputLangs: [
                    { flag: '🇺🇸', name: '英语', rating: '🤩' },
                    { flag: '🇷🇺', name: '俄语', rating: '😊' },
                    { flag: '🇫🇷', name: '法语', rating: '🤩' },
                    { flag: '🇩🇪', name: '德语', rating: '🤩' },
                    { flag: '🇮🇹', name: '意大利语', rating: '🤩' },
                    { flag: '🇪🇸', name: '西班牙语', rating: '🤩' },
                    { flag: '🇯🇵', name: '日语', rating: '😐' },
                    { flag: '🇨🇳', name: '中文*', rating: '😊' }
                ],
                inputNote: { html: '*中文使用单独的标点增强后的 whisper 模型...' },
                outputNote: '翻译语言支持所有语言，配音语言取决于选取的TTS。'
            },
            install: {
                title: '安装',
                helpNote: { html: '遇到问题？在<strong><a href="https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh" target="_blank">这里</a></strong>与我们的免费在线AI助手交流获取帮助。' },
                cuda: {
                    label: '注意:',
                    intro: '在 Windows 上使用 NVIDIA GPU 加速需要先完成以下步骤:',
                    steps: [
                        { html: '安装 <a href="https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe" target="_blank">CUDA Toolkit 12.6</a>' },
                        { html: '安装 <a href="https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe" target="_blank">CUDNN 9.3.0</a>' },
                        { html: '将 <code>C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6</code> 添加到系统环境变量 PATH 中' },
                        { html: '重启电脑' }
                    ]
                },
                ffmpeg: {
                    label: '注意:',
                    intro: 'FFmpeg 是必需的，请通过包管理器安装：',
                    installs: [
                        { platform: 'Windows', command: 'choco install ffmpeg',      via: 'Chocolatey' },
                        { platform: 'macOS',   command: 'brew install ffmpeg',       via: 'Homebrew' },
                        { platform: 'Linux',   command: 'sudo apt install ffmpeg',    via: 'Debian/Ubuntu' }
                    ]
                }
            },
            methods: {
                uv: {
                    title: '方式一：使用 uv（推荐，无需安装 Anaconda）',
                    intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> 会自动下载 Python 3.10 并创建隔离环境，你不需要自己安装 Python 或 Anaconda。' },
                    steps: [
                        { desc: '克隆仓库', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: '一键安装（自动安装 uv + Python 3.10 + 所有依赖）', command: 'python setup_env.py' },
                        { desc: '启动应用', command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux', multiline: true }
                    ],
                    alt: '或者在 Windows 上双击 OneKeyStart_uv.bat。'
                },
                conda: {
                    title: '方式二：使用 Conda',
                    warning: '⚠️ 不推荐。 此方式今后将不再维护，请使用上方的 uv（方式一）。',
                    summary: '点击展开 Conda 安装步骤',
                    steps: [
                        { desc: '克隆仓库', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: '安装依赖（需要 python=3.10）', command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py' },
                        { desc: '启动应用', command: 'streamlit run st.py' }
                    ]
                },
                docker: {
                    title: 'Docker',
                    intro: '还可以选择使用 Docker（要求 CUDA 12.4 和 NVIDIA Driver 版本 >550），详见 Docker 文档：',
                    commands: [
                        'docker build -t videolingo .',
                        'docker run -d -p 8501:8501 --gpus all videolingo'
                    ]
                }
            },
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
            limitations: {
                title: '当前限制',
                items: [
                    { html: 'WhisperX 转录效果可能受到视频背景声影响，因为使用了 wav2vac 模型进行对齐。对于背景音乐较大的视频，请开启人声分离增强。另外，如果字幕以数字或特殊符号结尾，可能会导致提前截断，这是因为 wav2vac 无法将数字字符（如"1"）映射到其发音形式（"one"）。' },
                    { html: '使用较弱模型时容易在中间过程报错，这是因为对响应的 json 格式要求较为严格。如果出现此错误，请删除 <code>output</code> 文件夹后更换 llm 重试，否则重复执行会读取上次错误的响应导致同样错误。' },
                    { html: '配音功能由于不同语言的语速和语调差异，还受到翻译步骤的影响，可能不能 100% 完美，但本项目做了非常多的语速上的工程处理，尽可能保证配音效果。' },
                    { html: '<strong>多语言视频转录识别仅仅只会保留主要语言</strong>，这是由于 whisperX 在强制对齐单词级字幕时使用的是针对单个语言的特化模型，会因为不认识另一种语言而删去。' },
                    { html: '<strong>无法多角色分别配音</strong>，whisperX 的说话人区分效果不够好用。' }
                ]
            },
            license: {
                title: '📄 许可证',
                content: '本项目采用 Apache 2.0 许可证，衷心感谢以下开源项目的贡献：'
            },
            contact: {
                title: '📬 联系',
                channels: [
                    { html: '加入 QQ 群寻求解答：875297969' },
                    { html: '在 GitHub 上提交 <a href="https://github.com/Huanshere/VideoLingo/issues" target="_blank">Issues</a> 或 <a href="https://github.com/Huanshere/VideoLingo/pulls" target="_blank">Pull Requests</a>' },
                    { html: '关注我的 Twitter：<a href="https://twitter.com/Huanshere" target="_blank">@Huanshere</a>' },
                    { html: '联系邮箱：<a href="mailto:team@videolingo.io">team@videolingo.io</a>' }
                ]
            }
        },

        /* ════════════════════════════════════════════════ */
        'zh-TW': {
            hero: { title: '連結世界，逐格前行' },
            overview: {
                title: '🌟 概述',
                cta:   '立即體驗 VL！',
                ctaHref: 'https://videolingo.io',
                lead:  'VideoLingo 是一個全方位的影片翻譯、本地化和配音工具，旨在生成 Netflix 品質的字幕。它消除了機器翻譯的生硬感和多行字幕，同時提供高品質配音，實現跨越語言障礙的全球知識共享。',
                features: [
                    { html: '🎥 通過 yt-dlp 下載 YouTube 影片' },
                    { html: '<strong>🎙️ 使用 WhisperX 進行詞級別和低幻覺字幕識別</strong>' },
                    { html: '<strong>📝 基於 NLP 和 AI 的字幕分段</strong>' },
                    { html: '<strong>📚 自定義 + AI 生成術語庫確保翻譯一致性</strong>' },
                    { html: '<strong>🔄 三步驟翻譯-反思-調適實現影院級品質</strong>' },
                    { html: '<strong>✅ Netflix 標準，僅單行字幕</strong>' },
                    { html: '<strong>🗣️ 使用 GPT-SoVITS、Azure、OpenAI 等進行配音</strong>' },
                    { html: '🚀 在 Streamlit 中一鍵啟動和處理' },
                    { html: '🌍 Streamlit UI 多語言支持' },
                    { html: '📝 詳細日誌記錄和進度恢復' },
                    { html: '🔍 模型搜尋選擇器，自動從 API 獲取完整模型清單，支援搜尋篩選' },
                    { html: '⏯️ 任務控制 — 處理過程中可隨時暫停、繼續或停止' }
                ],
                tagline: { html: '與類似項目的區別：<strong>僅單行字幕、更優質的翻譯、無縫配音體驗</strong>' }
            },
            demo: {
                title: '🎥 演示',
                items: {
                    dualSubtitles:    '雙語字幕',
                    cosyVoiceClone:   'Cosy2 聲音克隆',
                    gptSovitsDubbing: 'GPT-SoVITS 配音'
                }
            },
            languages: {
                title: '語言支持',
                inputTitle: { html: '<strong>輸入語言支持（更多語言即將推出）：</strong>' },
                inputLangs: [
                    { flag: '🇺🇸', name: '英語',   rating: '🤩' },
                    { flag: '🇷🇺', name: '俄語',   rating: '😊' },
                    { flag: '🇫🇷', name: '法語',   rating: '🤩' },
                    { flag: '🇩🇪', name: '德語',   rating: '🤩' },
                    { flag: '🇮🇹', name: '義大利語', rating: '🤩' },
                    { flag: '🇪🇸', name: '西班牙語', rating: '🤩' },
                    { flag: '🇯🇵', name: '日語',   rating: '😐' },
                    { flag: '🇨🇳', name: '中文*',  rating: '😊' }
                ],
                inputNote: { html: '*中文目前使用單獨的標點增強版 whisper 模型...' },
                outputNote: '翻譯支持所有語言，配音語言則取決於所選的 TTS 方法。'
            },
            install: {
                title: '安裝',
                helpNote: { html: '遇到任何問題？在<strong><a href="https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh" target="_blank">這裡</a></strong>與我們的免費在線 AI 助手聊天以獲取幫助。' },
                cuda: {
                    label: '注意：',
                    intro: 'Windows 用戶如使用 NVIDIA GPU，請在安裝前執行以下步驟：',
                    steps: [
                        { html: '安裝 <a href="https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe" target="_blank">CUDA Toolkit 12.6</a>' },
                        { html: '安裝 <a href="https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe" target="_blank">CUDNN 9.3.0</a>' },
                        { html: '將 <code>C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6</code> 添加到系統 PATH' },
                        { html: '重啟電腦' }
                    ]
                },
                ffmpeg: {
                    label: '注意：',
                    intro: '需要安裝 FFmpeg。請通過包管理器安裝：',
                    installs: [
                        { platform: 'Windows', command: 'choco install ffmpeg',   via: 'Chocolatey' },
                        { platform: 'macOS',   command: 'brew install ffmpeg',    via: 'Homebrew' },
                        { platform: 'Linux',   command: 'sudo apt install ffmpeg', via: 'Debian/Ubuntu' }
                    ]
                }
            },
            methods: {
                uv: {
                    title: '方式一：使用 uv（推薦）',
                    intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> 會自動下載 Python 3.10 並建立隔離環境，無需手動安裝 Python 或 Anaconda。' },
                    steps: [
                        { desc: '複製倉庫', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: '一鍵安裝（自動安裝 uv + Python 3.10 + 所有依賴）', command: 'python setup_env.py' },
                        { desc: '啟動應用', command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux', multiline: true }
                    ],
                    alt: '或在 Windows 上雙擊 OneKeyStart_uv.bat。'
                },
                conda: {
                    title: '方式二：使用 Conda',
                    warning: '⚠️ 不推薦。 此方式今後將不再維護，請使用上方的 uv（方式一）。',
                    summary: '點擊展開 Conda 安裝步驟',
                    steps: [
                        { desc: '複製倉庫', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: '安裝依賴（需要 python=3.10）', command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py' },
                        { desc: '啟動應用', command: 'streamlit run st.py' }
                    ]
                },
                docker: {
                    title: 'Docker',
                    intro: '或者，您可以使用 Docker（需要 CUDA 12.4 和 NVIDIA 驅動版本 >550），參見 Docker 文檔：',
                    commands: [
                        'docker build -t videolingo .',
                        'docker run -d -p 8501:8501 --gpus all videolingo'
                    ]
                }
            },
            api: {
                title: 'APIs',
                intro: 'VideoLingo 支持 OpenAI 格式的 API 和各種 TTS 接口：',
                llmLabel: 'LLM',
                llm:     { html: '`claude-sonnet-4.6`、`gpt-5.4`、`gemini-3.1-pro`、`deepseek-v3`、`grok-4.1`、...（按品質排序；預算方案可嘗試 `gemini-3-flash` 或 `gpt-5.4-mini`）' },
                whisperLabel: 'WhisperX',
                whisper:     '本地運行 whisperX 或使用 302.ai API',
                ttsLabel: 'TTS',
                tts:     { html: '`azure-tts`、`openai-tts`、`siliconflow-fishtts`、**`fish-tts`**、`GPT-SoVITS`、`edge-tts`、`*custom-tts`（您可以在 custom_tts.py 中修改自己的 TTS！）' },
                note:    { html: 'VideoLingo 與 <a href="https://gpt302.saaslink.net/C2oHR9" target="_blank"><strong>302.ai</strong></a> 合作 - 一個 API 密鑰即可使用所有服務（LLM、WhisperX、TTS）。或者使用 Ollama 和 Edge-TTS 在本地免費運行，無需 API！' }
            },
            limitations: {
                title: '當前限制',
                items: [
                    { html: 'WhisperX 轉錄性能可能受到視頻背景噪音影響，因為它使用 wav2vac 模型進行對齊。對於有大量背景音樂的視頻，請啟用語音分離增強。此外，由於 wav2vac 無法將數字字符（如"1"）映射到其口語形式（"one"），以數字或特殊字符結尾的字幕可能會提前截斷。' },
                    { html: '使用較弱的模型可能會由於對響應的嚴格 JSON 格式要求而在中間過程中出錯。如果出現此錯誤，請刪除 <code>output</code> 文件夾並使用不同的 LLM 重試，否則重複執行將讀取先前的錯誤響應導致相同錯誤。' },
                    { html: '由於語言之間的語速和語調差異，以及翻譯步驟的影響，配音功能可能無法 100% 完美。但是，本項目已經對語速進行了大量工程處理，以確保最佳的配音效果。' },
                    { html: '<strong>多語言視頻轉錄識別將只保留主要語言</strong>。這是因為 whisperX 在強制對齊詞級字幕時使用單一語言的專用模型，並會刪除無法識別的語言。' },
                    { html: '<strong>無法分別為多個角色配音</strong>，因為 whisperX 的說話人區分能力尚不夠可靠。' }
                ]
            },
            license: {
                title: '📄 許可證',
                content: '本項目採用 Apache 2.0 許可證。特別感謝以下開源項目的貢獻：'
            },
            contact: {
                title: '📬 聯繫我',
                channels: [
                    { html: '在 GitHub 上提交 <a href="https://github.com/Huanshere/VideoLingo/issues" target="_blank">Issues</a> 或 <a href="https://github.com/Huanshere/VideoLingo/pulls" target="_blank">Pull Requests</a>' },
                    { html: '在 Twitter 上私信我：<a href="https://twitter.com/Huanshere" target="_blank">@Huanshere</a>' },
                    { html: '發送郵件至：<a href="mailto:team@videolingo.io">team@videolingo.io</a>' }
                ]
            }
        },

        /* ════════════════════════════════════════════════ */
        'ja': {
            hero: { title: 'フレームごとに世界をつなぐ' },
            overview: {
                title: '🌟 概要',
                cta:   'VLを試す！',
                ctaHref: 'https://videolingo.io',
                lead:  'VideoLingoは、Netflixクオリティの字幕を生成することを目的とした、オールインワンの動画翻訳、ローカライゼーション、吹き替えツールです。機械的な翻訳や複数行の字幕を排除し、高品質な吹き替えを追加することで、言語の壁を越えた世界的な知識共有を可能にします。',
                features: [
                    { html: '🎥 yt-dlpによるYouTube動画のダウンロード' },
                    { html: '<strong>🎙️ WhisperXによる単語レベルの低誤認識字幕認識</strong>' },
                    { html: '<strong>📝 NLPとAIを活用した字幕セグメンテーション</strong>' },
                    { html: '<strong>📚 一貫性のある翻訳のためのカスタム＋AI生成用語</strong>' },
                    { html: '<strong>🔄 映画品質のための3ステップ（翻訳-反映-適応）プロセス</strong>' },
                    { html: '<strong>✅ Netflixスタンダードの1行字幕のみ</strong>' },
                    { html: '<strong>🗣️ GPT-SoVITS、Azure、OpenAIなどによる吹き替え</strong>' },
                    { html: '🚀 Streamlitでのワンクリック起動と処理' },
                    { html: '🌍 Streamlit UIの多言語サポート' },
                    { html: '📝 進捗再開機能付きの詳細なログ記録' },
                    { html: '🔍 モデル検索セレクター — APIからモデル一覧を自動取得、検索・フィルター対応' },
                    { html: '⏯️ タスクコントロール — 処理中いつでも一時停止・再開・中止が可能' }
                ],
                tagline: { html: '類似プロジェクトとの違い：<strong>1行字幕のみ、優れた翻訳品質、シームレスな吹き替え体験</strong>' }
            },
            demo: {
                title: '🎥 デモ',
                items: {
                    dualSubtitles:    'デュアル字幕',
                    cosyVoiceClone:   'Cosy2 ボイスクローン',
                    gptSovitsDubbing: 'GPT-SoVITS 吹き替え'
                }
            },
            languages: {
                title: '言語サポート',
                inputTitle: { html: '<strong>入力言語サポート（さらに追加予定）：</strong>' },
                inputLangs: [
                    { flag: '🇺🇸', name: '英語',     rating: '🤩' },
                    { flag: '🇷🇺', name: 'ロシア語', rating: '😊' },
                    { flag: '🇫🇷', name: 'フランス語', rating: '🤩' },
                    { flag: '🇩🇪', name: 'ドイツ語', rating: '🤩' },
                    { flag: '🇮🇹', name: 'イタリア語', rating: '🤩' },
                    { flag: '🇪🇸', name: 'スペイン語', rating: '🤩' },
                    { flag: '🇯🇵', name: '日本語',   rating: '😐' },
                    { flag: '🇨🇳', name: '中国語*',  rating: '😊' }
                ],
                inputNote: { html: '*中国語は現在、句読点を強化した別のwhisperモデルを使用しています...' },
                outputNote: '翻訳はすべての言語をサポートし、吹き替えの言語は選択したTTS方式に依存します。'
            },
            install: {
                title: 'インストール',
                helpNote: { html: '問題が発生しましたか？無料のオンラインAIエージェントに<strong><a href="https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh" target="_blank">こちら</a></strong>でお問い合わせください。' },
                cuda: {
                    label: '注意：',
                    intro: 'NVIDIA GPU搭載のWindowsユーザーは、インストール前に以下の手順を完了してください：',
                    steps: [
                        { html: '<a href="https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe" target="_blank">CUDA Toolkit 12.6</a>をインストール' },
                        { html: '<a href="https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe" target="_blank">CUDNN 9.3.0</a>をインストール' },
                        { html: '<code>C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6</code> をシステムPATHに追加' },
                        { html: 'コンピュータを再起動' }
                    ]
                },
                ffmpeg: {
                    label: '注意：',
                    intro: 'FFmpegが必要です。パッケージマネージャーでインストールしてください：',
                    installs: [
                        { platform: 'Windows', command: 'choco install ffmpeg',   via: 'Chocolatey' },
                        { platform: 'macOS',   command: 'brew install ffmpeg',    via: 'Homebrew' },
                        { platform: 'Linux',   command: 'sudo apt install ffmpeg', via: 'Debian/Ubuntu' }
                    ]
                }
            },
            methods: {
                uv: {
                    title: '方法1：uvを使用（推奨）',
                    intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> はPython 3.10を自動ダウンロードし、隔離環境を作成します。PythonやAnacondaを手動インストールする必要はありません。' },
                    steps: [
                        { desc: 'リポジトリをクローン', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'ワンクリックインストール（uv + Python 3.10 + すべての依存関係）', command: 'python setup_env.py' },
                        { desc: 'アプリを起動', command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux', multiline: true }
                    ],
                    alt: 'またはWindowsで OneKeyStart_uv.bat をダブルクリック。'
                },
                conda: {
                    title: '方法2：Condaを使用',
                    warning: '⚠️ 推奨されません。 この方法は今後メンテナンスされません。上記のuv（方法1）を使用してください。',
                    summary: 'クリックしてCondaインストール手順を展開',
                    steps: [
                        { desc: 'リポジトリをクローン', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: '依存関係をインストール（python=3.10が必要）', command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py' },
                        { desc: 'アプリを起動', command: 'streamlit run st.py' }
                    ]
                },
                docker: {
                    title: 'Docker',
                    intro: 'または、Dockerを使用することもできます（CUDA 12.4とNVIDIAドライバー>550が必要です）。Dockerドキュメントを参照してください：',
                    commands: [
                        'docker build -t videolingo .',
                        'docker run -d -p 8501:8501 --gpus all videolingo'
                    ]
                }
            },
            api: {
                title: 'API',
                intro: 'VideoLingoはOpenAI形式APIとさまざまなTTSインターフェースをサポートします：',
                llmLabel: 'LLM',
                llm:     { html: '<code>claude-sonnet-4.6</code>, <code>gpt-5.4</code>, <code>gemini-3.1-pro</code>, <code>deepseek-v3</code>, <code>grok-4.1</code>, ...（品質順；予算重視なら <code>gemini-3-flash</code> または <code>gpt-5.4-mini</code>）' },
                whisperLabel: 'WhisperX',
                whisper:     'whisperXをローカル実行、または302.ai APIを使用',
                ttsLabel: 'TTS',
                tts:     { html: '<code>azure-tts</code>, <code>openai-tts</code>, <code>siliconflow-fishtts</code>, <strong><code>fish-tts</code></strong>, <code>GPT-SoVITS</code>, <code>edge-tts</code>, <code>*custom-tts</code>（custom_tts.pyで独自のTTSをカスタマイズ可能！）' },
                note:    { html: 'VideoLingoは<a href="https://gpt302.saaslink.net/C2oHR9" target="_blank"><strong>302.ai</strong></a>と連携 — 1つのAPIキーですべてのサービス（LLM、WhisperX、TTS）を利用可能。また、OllamaとEdge-TTSでローカル無料実行、API不要！' }
            },
            limitations: {
                title: '現在の制限事項',
                items: [
                    { html: 'WhisperXの文字起こし性能は、整列にwav2vacモデルを使用しているため、ビデオの背景音の影響を受ける可能性があります。大きな背景音楽のあるビデオでは、ボーカル分離強化を有効にしてください。また、wav2vacは数字（例："1"）を発音形式（"いち"）にマッピングできないため、数字や特殊文字で終わる字幕が早期に切り取られる可能性があります。' },
                    { html: '弱いモデルを使用すると、JSON形式要件が厳しいため、処理途中でエラーが発生することがあります。このエラーが発生した場合は、<code>output</code>フォルダを削除して別のLLMで再試行してください。再実行すると前回エラーの応答が読み込まれて同じエラーになります。' },
                    { html: '言語間の話速やイントネーションの違い、翻訳ステップの影響により、吹き替えは100%完璧ではない可能性があります。しかし、本プロジェクトは最適な吹き替え結果を保証するため、話速に関する多くのエンジニアリングを行っています。' },
                    { html: '<strong>多言語ビデオの文字起こしでは、主要言語のみが保持されます。</strong>これは、whisperXが単語レベルの強制整列に単一言語特化モデルを使用しており、認識できない言語は削除されるためです。' },
                    { html: '<strong>複数の話者を別々に吹き替えることはできません。</strong>whisperXの話者ダイアライゼーションは十分に信頼できないためです。' }
                ]
            },
            license: {
                title: '📄 ライセンス',
                content: 'このプロジェクトはApache 2.0ライセンスの下で公開されています。以下のオープンソースプロジェクトに感謝します：'
            },
            contact: {
                title: '📬 お問い合わせ',
                channels: [
                    { html: 'GitHubで<a href="https://github.com/Huanshere/VideoLingo/issues" target="_blank">Issues</a> または <a href="https://github.com/Huanshere/VideoLingo/pulls" target="_blank">Pull Requests</a>を提出' },
                    { html: 'TwitterでDM：<a href="https://twitter.com/Huanshere" target="_blank">@Huanshere</a>' },
                    { html: 'メール送信：<a href="mailto:team@videolingo.io">team@videolingo.io</a>' }
                ]
            }
        },

        /* ════════════════════════════════════════════════ */
        'es': {
            hero: { title: 'Conectando el Mundo, Cuadro por Cuadro' },
            overview: {
                title: '🌟 Descripción General',
                cta:   '¡Prueba VL Gratis!',
                ctaHref: 'https://videolingo.io',
                lead:  'VideoLingo es una herramienta todo en uno para traducción, localización y doblaje de videos, diseñada para generar subtítulos de calidad Netflix. Elimina las traducciones mecánicas y los subtítulos de múltiples líneas mientras agrega doblaje de alta calidad, permitiendo compartir conocimiento globalmente a través de las barreras del idioma.',
                features: [
                    { html: '🎥 Descarga de videos de YouTube mediante yt-dlp' },
                    { html: '<strong>🎙️ Reconocimiento de subtítulos a nivel de palabra y baja ilusión con WhisperX</strong>' },
                    { html: '<strong>📝 Segmentación de subtítulos impulsada por NLP e IA</strong>' },
                    { html: '<strong>📚 Terminología personalizada + generada por IA para una traducción coherente</strong>' },
                    { html: '<strong>🔄 Proceso de 3 pasos Traducción-Reflexión-Adaptación para calidad cinematográfica</strong>' },
                    { html: '<strong>✅ Solo subtítulos de una línea, estándar Netflix</strong>' },
                    { html: '<strong>🗣️ Doblaje con GPT-SoVITS, Azure, OpenAI y más</strong>' },
                    { html: '🚀 Inicio y procesamiento con un clic en Streamlit' },
                    { html: '🌍 Soporte multilingüe en la interfaz de Streamlit' },
                    { html: '📝 Registro detallado con reanudación de progreso' },
                    { html: '🔍 Selector de modelos con búsqueda — obtiene automáticamente la lista completa de modelos desde tu API' },
                    { html: '⏯️ Control de tareas — pausa, reanuda o detén el procesamiento en cualquier paso' }
                ],
                tagline: { html: 'Diferencia con proyectos similares: <strong>Solo subtítulos de una línea, calidad superior de traducción, experiencia de doblaje perfecta</strong>' }
            },
            demo: {
                title: '🎥 Demo',
                items: {
                    dualSubtitles:    'Subtítulos Duales',
                    cosyVoiceClone:   'Clon de Voz Cosy2',
                    gptSovitsDubbing: 'Doblaje GPT-SoVITS'
                }
            },
            languages: {
                title: 'Soporte de Idiomas',
                inputTitle: { html: '<strong>Idiomas de entrada soportados (se añadirán más):</strong>' },
                inputLangs: [
                    { flag: '🇺🇸', name: 'Inglés',    rating: '🤩' },
                    { flag: '🇷🇺', name: 'Ruso',      rating: '😊' },
                    { flag: '🇫🇷', name: 'Francés',   rating: '🤩' },
                    { flag: '🇩🇪', name: 'Alemán',    rating: '🤩' },
                    { flag: '🇮🇹', name: 'Italiano',  rating: '🤩' },
                    { flag: '🇪🇸', name: 'Español',   rating: '🤩' },
                    { flag: '🇯🇵', name: 'Japonés',   rating: '😐' },
                    { flag: '🇨🇳', name: 'Chino*',    rating: '😊' }
                ],
                inputNote: { html: '*El chino actualmente usa un modelo whisper mejorado con puntuación separada...' },
                outputNote: 'La traducción soporta todos los idiomas; el idioma del doblaje depende del método TTS elegido.'
            },
            install: {
                title: 'Instalación',
                helpNote: { html: '¿Problemas? Chatea con nuestro agente de IA gratuito en línea <strong><a href="https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh" target="_blank">aquí</a></strong>.' },
                cuda: {
                    label: 'Nota:',
                    intro: 'Los usuarios de Windows con GPU NVIDIA deben completar estos pasos antes de instalar:',
                    steps: [
                        { html: 'Instalar <a href="https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe" target="_blank">CUDA Toolkit 12.6</a>' },
                        { html: 'Instalar <a href="https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe" target="_blank">CUDNN 9.3.0</a>' },
                        { html: 'Añadir <code>C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6</code> al PATH del sistema' },
                        { html: 'Reiniciar el equipo' }
                    ]
                },
                ffmpeg: {
                    label: 'Nota:',
                    intro: 'Se requiere FFmpeg. Instálalo vía gestor de paquetes:',
                    installs: [
                        { platform: 'Windows', command: 'choco install ffmpeg',   via: 'Chocolatey' },
                        { platform: 'macOS',   command: 'brew install ffmpeg',    via: 'Homebrew' },
                        { platform: 'Linux',   command: 'sudo apt install ffmpeg', via: 'Debian/Ubuntu' }
                    ]
                }
            },
            methods: {
                uv: {
                    title: 'Método 1: Usando uv (Recomendado)',
                    intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> descarga automáticamente Python 3.10 y crea un entorno aislado — no necesitas instalar Python o Anaconda manualmente.' },
                    steps: [
                        { desc: 'Clonar el repositorio', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'Instalación con un clic (uv + Python 3.10 + todas las dependencias)', command: 'python setup_env.py' },
                        { desc: 'Iniciar la aplicación', command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux', multiline: true }
                    ],
                    alt: 'O haz doble clic en OneKeyStart_uv.bat en Windows.'
                },
                conda: {
                    title: 'Método 2: Usando Conda',
                    warning: '⚠️ No recomendado. Este método ya no se mantendrá — por favor usa uv (Método 1) arriba.',
                    summary: 'Haz clic para expandir los pasos de instalación de Conda',
                    steps: [
                        { desc: 'Clonar el repositorio', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'Instalar dependencias (requiere python=3.10)', command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py' },
                        { desc: 'Iniciar la aplicación', command: 'streamlit run st.py' }
                    ]
                },
                docker: {
                    title: 'Docker',
                    intro: 'Alternativamente, usa Docker (requiere CUDA 12.4 y NVIDIA Driver >550), consulta la documentación de Docker:',
                    commands: [
                        'docker build -t videolingo .',
                        'docker run -d -p 8501:8501 --gpus all videolingo'
                    ]
                }
            },
            api: {
                title: 'API',
                intro: 'VideoLingo soporta APIs en formato OpenAI y varias interfaces TTS:',
                llmLabel: 'LLM',
                llm:     { html: '<code>claude-sonnet-4.6</code>, <code>gpt-5.4</code>, <code>gemini-3.1-pro</code>, <code>deepseek-v3</code>, <code>grok-4.1</code>, ... (ordenados por calidad; opciones económicas: <code>gemini-3-flash</code> o <code>gpt-5.4-mini</code>)' },
                whisperLabel: 'WhisperX',
                whisper:     'Ejecuta whisperX localmente o usa la API 302.ai',
                ttsLabel: 'TTS',
                tts:     { html: '<code>azure-tts</code>, <code>openai-tts</code>, <code>siliconflow-fishtts</code>, <strong><code>fish-tts</code></strong>, <code>GPT-SoVITS</code>, <code>edge-tts</code>, <code>*custom-tts</code> (¡puedes modificar tu propio TTS en custom_tts.py!)' },
                note:    { html: 'VideoLingo trabaja con <a href="https://gpt302.saaslink.net/C2oHR9" target="_blank"><strong>302.ai</strong></a> — una API key para todos los servicios (LLM, WhisperX, TTS). ¡O ejecuta localmente con Ollama y Edge-TTS gratis, sin API!' }
            },
            limitations: {
                title: 'Limitaciones Actuales',
                items: [
                    { html: 'El rendimiento de transcripción de WhisperX puede verse afectado por el ruido de fondo del video porque usa el modelo wav2vac para alineación. Para videos con música de fondo alta, activa la mejora de separación vocal. Además, los subtítulos que terminan en dígitos o caracteres especiales pueden truncarse antes porque wav2vac no puede mapear caracteres numéricos (ej. "1") a su forma hablada ("uno").' },
                    { html: 'Usar modelos más débiles puede causar errores durante el proceso debido a requisitos estrictos de formato JSON. Si esto ocurre, elimina la carpeta <code>output</code> y reintenta con otro LLM — de lo contrario, la ejecución repetida leerá la respuesta errónea previa y fallará igual.' },
                    { html: 'Debido a diferencias en velocidad e entonación entre idiomas, y la influencia del paso de traducción, el doblaje puede no ser 100% perfecto. Sin embargo, el proyecto ha realizado mucho trabajo en velocidad de habla para asegurar el mejor resultado de doblaje.' },
                    { html: '<strong>La transcripción de video multilingüe solo retendrá el idioma principal.</strong> Esto es porque whisperX usa modelos específicos del idioma para alineación forzada a nivel de palabra, y descartará idiomas no reconocidos.' },
                    { html: '<strong>No se puede doblar varios hablantes por separado</strong>, ya que la diarización de hablantes de whisperX no es lo suficientemente confiable.' }
                ]
            },
            license: {
                title: '📄 Licencia',
                content: 'Este proyecto está bajo la Licencia Apache 2.0. Gracias especiales a los siguientes proyectos de código abierto:'
            },
            contact: {
                title: '📬 Contacto',
                channels: [
                    { html: 'Enviar <a href="https://github.com/Huanshere/VideoLingo/issues" target="_blank">Issues</a> o <a href="https://github.com/Huanshere/VideoLingo/pulls" target="_blank">Pull Requests</a> en GitHub' },
                    { html: 'DM en Twitter: <a href="https://twitter.com/Huanshere" target="_blank">@Huanshere</a>' },
                    { html: 'Enviar email a: <a href="mailto:team@videolingo.io">team@videolingo.io</a>' }
                ]
            }
        },

        /* ════════════════════════════════════════════════ */
        'ru': {
            hero: { title: 'Объединяя Мир, Кадр за Кадром' },
            overview: {
                title: '🌟 Обзор',
                cta:   'Попробуйте VL бесплатно!',
                ctaHref: 'https://videolingo.io',
                lead:  'VideoLingo - это универсальный инструмент для перевода, локализации и дубляжа видео, направленный на создание субтитров качества Netflix. Он устраняет механические переводы и многострочные субтитры, добавляя высококачественный дубляж, что позволяет делиться знаниями по всему миру, преодолевая языковые барьеры.',
                features: [
                    { html: '🎥 Загрузка видео с YouTube через yt-dlp' },
                    { html: '<strong>🎙️ Пословное распознавание субтитров с низким уровнем искажений с помощью WhisperX</strong>' },
                    { html: '<strong>📝 Сегментация субтитров на основе NLP и ИИ</strong>' },
                    { html: '<strong>📚 Пользовательская + ИИ-генерируемая терминология для согласованного перевода</strong>' },
                    { html: '<strong>🔄 3-этапный процесс Перевод-Осмысление-Адаптация для кинематографического качества</strong>' },
                    { html: '<strong>✅ Только однострочные субтитры стандарта Netflix</strong>' },
                    { html: '<strong>🗣️ Дубляж с помощью GPT-SoVITS, Azure, OpenAI и других</strong>' },
                    { html: '🚀 Запуск и обработка в один клик в Streamlit' },
                    { html: '🌍 Многоязычная поддержка в интерфейсе Streamlit' },
                    { html: '📝 Подробное логирование с возможностью возобновления прогресса' },
                    { html: '🔍 Селектор моделей с поиском — автоматическое получение полного списка моделей от вашего API-провайдера' },
                    { html: '⏯️ Управление задачами — пауза, возобновление или остановка обработки на любом этапе' }
                ],
                tagline: { html: 'Отличие от похожих проектов: <strong>Только однострочные субтитры, превосходное качество перевода, безупречный опыт дубляжа</strong>' }
            },
            demo: {
                title: '🎥 Демонстрация',
                items: {
                    dualSubtitles:    'Двойные Субтитры',
                    cosyVoiceClone:   'Клонирование Голоса Cosy2',
                    gptSovitsDubbing: 'GPT-SoVITS с моим голосом'
                }
            },
            languages: {
                title: 'Поддержка языков',
                inputTitle: { html: '<strong>Поддержка входных языков (будет добавлено больше):</strong>' },
                inputLangs: [
                    { flag: '🇺🇸', name: 'Английский', rating: '🤩' },
                    { flag: '🇷🇺', name: 'Русский',    rating: '😊' },
                    { flag: '🇫🇷', name: 'Французский', rating: '🤩' },
                    { flag: '🇩🇪', name: 'Немецкий',   rating: '🤩' },
                    { flag: '🇮🇹', name: 'Итальянский', rating: '🤩' },
                    { flag: '🇪🇸', name: 'Испанский',  rating: '🤩' },
                    { flag: '🇯🇵', name: 'Японский',   rating: '😐' },
                    { flag: '🇨🇳', name: 'Китайский*', rating: '😊' }
                ],
                inputNote: { html: '*Китайский пока использует отдельную модель whisper с улучшенной пунктуацией...' },
                outputNote: 'Перевод поддерживает все языки, в то время как язык дубляжа зависит от выбранного метода TTS.'
            },
            install: {
                title: 'Установка',
                helpNote: { html: 'Возникли проблемы? Общайтесь с нашим бесплатным онлайн ИИ-агентом <strong><a href="https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh" target="_blank">здесь</a></strong>, который поможет вам.' },
                cuda: {
                    label: 'Примечание:',
                    intro: 'Пользователям Windows с GPU NVIDIA выполните следующие шаги перед установкой:',
                    steps: [
                        { html: 'Установите <a href="https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe" target="_blank">CUDA Toolkit 12.6</a>' },
                        { html: 'Установите <a href="https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe" target="_blank">CUDNN 9.3.0</a>' },
                        { html: 'Добавьте <code>C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6</code> в системный PATH' },
                        { html: 'Перезагрузите компьютер' }
                    ]
                },
                ffmpeg: {
                    label: 'Примечание:',
                    intro: 'Требуется FFmpeg. Установите его через менеджеры пакетов:',
                    installs: [
                        { platform: 'Windows', command: 'choco install ffmpeg',   via: 'Chocolatey' },
                        { platform: 'macOS',   command: 'brew install ffmpeg',    via: 'Homebrew' },
                        { platform: 'Linux',   command: 'sudo apt install ffmpeg', via: 'Debian/Ubuntu' }
                    ]
                }
            },
            methods: {
                uv: {
                    title: 'Вариант А: Используя uv (Рекомендуется)',
                    intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> автоматически загружает Python 3.10 и создает изолированную среду. Не нужно устанавливать Python или Anaconda вручную.' },
                    steps: [
                        { desc: 'Клонируйте репозиторий', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'Установка одной командой (устанавливает uv + Python 3.10 + все зависимости)', command: 'python setup_env.py' },
                        { desc: 'Запустите приложение', command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux', multiline: true }
                    ],
                    alt: 'Или дважды щелкните OneKeyStart_uv.bat в Windows.'
                },
                conda: {
                    title: 'Вариант Б: Используя Conda',
                    warning: '⚠️ Не рекомендуется. Этот метод больше не будет поддерживаться. Пожалуйста, используйте uv (Вариант А) выше.',
                    summary: 'Нажмите, чтобы развернуть шаги установки с Conda',
                    steps: [
                        { desc: 'Клонируйте репозиторий', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'Установите зависимости (требуется python=3.10)', command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py' },
                        { desc: 'Запустите приложение', command: 'streamlit run st.py' }
                    ]
                },
                docker: {
                    title: 'Docker',
                    intro: 'Альтернативно, вы можете использовать Docker (требуется CUDA 12.4 и версия драйвера NVIDIA >550), см. документацию Docker:',
                    commands: [
                        'docker build -t videolingo .',
                        'docker run -d -p 8501:8501 --gpus all videolingo'
                    ]
                }
            },
            api: {
                title: 'API',
                intro: 'VideoLingo поддерживает формат API, подобный OpenAI, и различные интерфейсы TTS:',
                llmLabel: 'LLM',
                llm:     { html: '<code>claude-sonnet-4.6</code>, <code>gpt-5.4</code>, <code>gemini-3.1-pro</code>, <code>deepseek-v3</code>, <code>grok-4.1</code>, ... (отсортировано по качеству; бюджетные варианты: <code>gemini-3-flash</code> или <code>gpt-5.4-mini</code>)' },
                whisperLabel: 'WhisperX',
                whisper:     'Запускайте whisperX локально или используйте API 302.ai',
                ttsLabel: 'TTS',
                tts:     { html: '<code>azure-tts</code>, <code>openai-tts</code>, <code>siliconflow-fishtts</code>, <strong><code>fish-tts</code></strong>, <code>GPT-SoVITS</code>, <code>edge-tts</code>, <code>*custom-tts</code>(Вы можете модифицировать свой собственный TTS в custom_tts.py!)' },
                note:    { html: 'VideoLingo работает с <a href="https://gpt302.saaslink.net/C2oHR9" target="_blank"><strong>302.ai</strong></a> - один API-ключ для всех сервисов (LLM, WhisperX, TTS). Или запускайте локально с Ollama и Edge-TTS бесплатно, без необходимости в API!' }
            },
            limitations: {
                title: 'Текущие ограничения',
                items: [
                    { html: 'Производительность транскрипции WhisperX может быть затронута фоновым шумом видео, так как для выравнивания используется модель wav2vac. Для видео с громкой фоновой музыкой включите Улучшение разделения голоса. Кроме того, субтитры, заканчивающиеся цифрами или специальными символами, могут быть обрезаны раньше из-за неспособности wav2vac сопоставлять цифровые символы (например, "1") с их произносимой формой ("один").' },
                    { html: 'Использование более слабых моделей может привести к ошибкам во время промежуточных процессов из-за строгих требований к формату JSON для ответов. Если возникает эта ошибка, удалите папку <code>output</code> и повторите попытку с другой LLM, иначе повторное выполнение прочитает предыдущий ошибочный ответ и снова завершится ошибкой.' },
                    { html: 'Из-за различий в скорости и интонации между языками, а также влияния этапа перевода, дубляж может быть не идеален на 100%. Однако проект провел значительную инженерную работу по скорости речи, чтобы обеспечить лучший результат дубляжа.' },
                    { html: '<strong>Многоязычная транскрипция видео сохранит только основной язык.</strong> Это потому что whisperX использует модели, специфичные для конкретного языка, для принудительного выравнивания на уровне слов, и будет удалять нераспознанные языки.' },
                    { html: '<strong>Невозможно дублировать нескольких говорящих отдельно</strong>, так как диаризация говорящих в whisperX недостаточно надежна.' }
                ]
            },
            license: {
                title: '📄 Лицензия',
                content: 'Этот проект лицензирован под Apache 2.0. Особая благодарность следующим проектам с открытым исходным кодом:'
            },
            contact: {
                title: '📬 Контакты',
                channels: [
                    { html: 'Отправляйте <a href="https://github.com/Huanshere/VideoLingo/issues" target="_blank">Issues</a> или <a href="https://github.com/Huanshere/VideoLingo/pulls" target="_blank">Pull Requests</a> на GitHub' },
                    { html: 'Напишите мне в Twitter: <a href="https://twitter.com/Huanshere" target="_blank">@Huanshere</a>' },
                    { html: 'Отправьте email: <a href="mailto:team@videolingo.io">team@videolingo.io</a>' }
                ]
            }
        },

        /* ════════════════════════════════════════════════ */
        'fr': {
            hero: { title: 'Connecter le Monde, Image par Image' },
            overview: {
                title: '🌟 Aperçu',
                cta:   'Essayez VL maintenant !',
                ctaHref: 'https://videolingo.io',
                lead:  'VideoLingo est un outil tout-en-un de traduction, de localisation et de doublage vidéo visant à générer des sous-titres de qualité Netflix. Il élimine les traductions automatiques rigides et les sous-titres multi-lignes tout en ajoutant un doublage de haute qualité, permettant le partage des connaissances à l\'échelle mondiale au-delà des barrières linguistiques.',
                features: [
                    { html: '🎥 Téléchargement de vidéos YouTube via yt-dlp' },
                    { html: '<strong>🎙️ Reconnaissance de sous-titres au niveau des mots et à faible illusion avec WhisperX</strong>' },
                    { html: '<strong>📝 Segmentation des sous-titres basée sur le NLP et l\'IA</strong>' },
                    { html: '<strong>📚 Terminologie personnalisée + générée par IA pour une traduction cohérente</strong>' },
                    { html: '<strong>🔄 Processus en 3 étapes : Traduction-Réflexion-Adaptation pour une qualité cinématographique</strong>' },
                    { html: '<strong>✅ Sous-titres uniquement sur une ligne, aux normes Netflix</strong>' },
                    { html: '<strong>🗣️ Doublage avec GPT-SoVITS, Azure, OpenAI et plus</strong>' },
                    { html: '🚀 Démarrage et traitement en un clic dans Streamlit' },
                    { html: '🌍 Support multi-langues dans l\'interface utilisateur Streamlit' },
                    { html: '📝 Journalisation détaillée avec reprise de la progression' },
                    { html: '🔍 Sélecteur de modèles avec recherche — récupère automatiquement la liste complète des modèles depuis votre API' },
                    { html: '⏯️ Contrôle des tâches — mettez en pause, reprenez ou arrêtez le traitement à n\'importe quelle étape' }
                ],
                tagline: { html: 'Différence par rapport aux projets similaires : <strong>Sous-titres sur une seule ligne uniquement, qualité de traduction supérieure, expérience de doublage transparente</strong>' }
            },
            demo: {
                title: '🎥 Démo',
                items: {
                    dualSubtitles:    'Sous-titres Doubles',
                    cosyVoiceClone:   'Clone de Voix Cosy2',
                    gptSovitsDubbing: 'Doublage GPT-SoVITS'
                }
            },
            languages: {
                title: 'Support des Langues',
                inputTitle: { html: '<strong>Langues d\'entrée prises en charge (d\'autres à venir) :</strong>' },
                inputLangs: [
                    { flag: '🇺🇸', name: 'Anglais',    rating: '🤩' },
                    { flag: '🇷🇺', name: 'Russe',      rating: '😊' },
                    { flag: '🇫🇷', name: 'Français',   rating: '🤩' },
                    { flag: '🇩🇪', name: 'Allemand',   rating: '🤩' },
                    { flag: '🇮🇹', name: 'Italien',    rating: '🤩' },
                    { flag: '🇪🇸', name: 'Espagnol',   rating: '🤩' },
                    { flag: '🇯🇵', name: 'Japonais',   rating: '😐' },
                    { flag: '🇨🇳', name: 'Chinois*',   rating: '😊' }
                ],
                inputNote: { html: '*Le chinois utilise actuellement un modèle whisper amélioré avec ponctuation séparée...' },
                outputNote: 'La traduction prend en charge toutes les langues ; la langue du doublage dépend de la méthode TTS choisie.'
            },
            install: {
                title: 'Installation',
                helpNote: { html: 'Des problèmes ? Discutez avec notre agent IA gratuit en ligne <strong><a href="https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh" target="_blank">ici</a></strong>.' },
                cuda: {
                    label: 'Note :',
                    intro: 'Les utilisateurs Windows avec GPU NVIDIA doivent compléter ces étapes avant l\'installation :',
                    steps: [
                        { html: 'Installer <a href="https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda_12.6.0_560.76_windows.exe" target="_blank">CUDA Toolkit 12.6</a>' },
                        { html: 'Installer <a href="https://developer.download.nvidia.com/compute/cudnn/9.3.0/local_installers/cudnn_9.3.0_windows.exe" target="_blank">CUDNN 9.3.0</a>' },
                        { html: 'Ajouter <code>C:\\Program Files\\NVIDIA\\CUDNN\\v9.3\\bin\\12.6</code> au PATH système' },
                        { html: 'Redémarrer l\'ordinateur' }
                    ]
                },
                ffmpeg: {
                    label: 'Note :',
                    intro: 'FFmpeg est requis. Installez-le via le gestionnaire de paquets :',
                    installs: [
                        { platform: 'Windows', command: 'choco install ffmpeg',   via: 'Chocolatey' },
                        { platform: 'macOS',   command: 'brew install ffmpeg',    via: 'Homebrew' },
                        { platform: 'Linux',   command: 'sudo apt install ffmpeg', via: 'Debian/Ubuntu' }
                    ]
                }
            },
            methods: {
                uv: {
                    title: 'Méthode 1 : Utiliser uv (Recommandé)',
                    intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> télécharge automatiquement Python 3.10 et crée un environnement isolé — aucune installation manuelle de Python ou Anaconda n\'est nécessaire.' },
                    steps: [
                        { desc: 'Cloner le dépôt', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'Installation en un clic (uv + Python 3.10 + toutes les dépendances)', command: 'python setup_env.py' },
                        { desc: 'Démarrer l\'application', command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux', multiline: true }
                    ],
                    alt: 'Ou double-cliquez sur OneKeyStart_uv.bat sous Windows.'
                },
                conda: {
                    title: 'Méthode 2 : Utiliser Conda',
                    warning: '⚠️ Non recommandé. Cette méthode ne sera plus maintenue — veuillez utiliser uv (Méthode 1) ci-dessus.',
                    summary: 'Cliquez pour développer les étapes d\'installation Conda',
                    steps: [
                        { desc: 'Cloner le dépôt', command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo' },
                        { desc: 'Installer les dépendances (nécessite python=3.10)', command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py' },
                        { desc: 'Démarrer l\'application', command: 'streamlit run st.py' }
                    ]
                },
                docker: {
                    title: 'Docker',
                    intro: 'Alternativement, utilisez Docker (nécessite CUDA 12.4 et NVIDIA Driver >550), voir la documentation Docker :',
                    commands: [
                        'docker build -t videolingo .',
                        'docker run -d -p 8501:8501 --gpus all videolingo'
                    ]
                }
            },
            api: {
                title: 'API',
                intro: 'VideoLingo prend en charge les API au format OpenAI et diverses interfaces TTS :',
                llmLabel: 'LLM',
                llm:     { html: '<code>claude-sonnet-4.6</code>, <code>gpt-5.4</code>, <code>gemini-3.1-pro</code>, <code>deepseek-v3</code>, <code>grok-4.1</code>, ... (triés par qualité ; options économiques : <code>gemini-3-flash</code> ou <code>gpt-5.4-mini</code>)' },
                whisperLabel: 'WhisperX',
                whisper:     'Exécutez whisperX localement ou utilisez l\'API 302.ai',
                ttsLabel: 'TTS',
                tts:     { html: '<code>azure-tts</code>, <code>openai-tts</code>, <code>siliconflow-fishtts</code>, <strong><code>fish-tts</code></strong>, <code>GPT-SoVITS</code>, <code>edge-tts</code>, <code>*custom-tts</code> (vous pouvez modifier votre propre TTS dans custom_tts.py !)' },
                note:    { html: 'VideoLingo fonctionne avec <a href="https://gpt302.saaslink.net/C2oHR9" target="_blank"><strong>302.ai</strong></a> — une clé API pour tous les services (LLM, WhisperX, TTS). Ou exécutez localement avec Ollama et Edge-TTS gratuitement, sans API !' }
            },
            limitations: {
                title: 'Limitations Actuelles',
                items: [
                    { html: 'Les performances de transcription WhisperX peuvent être affectées par le bruit de fond de la vidéo car il utilise le modèle wav2vac pour l\'alignement. Pour les vidéos avec une musique de fond forte, activez l\'amélioration de la séparation vocale. De plus, les sous-titres se terminant par des chiffres ou des caractères spéciaux peuvent être tronqués prématurément car wav2vac ne peut pas mapper les caractères numériques (ex. "1") à leur forme parlée ("un").' },
                    { html: 'L\'utilisation de modèles plus faibles peut entraîner des erreurs en cours de processus en raison d\'exigences strictes de format JSON. Si cela se produit, supprimez le dossier <code>output</code> et réessayez avec un autre LLM — sinon, l\'exécution répétée lira la réponse erronée précédente et échouera de la même manière.' },
                    { html: 'En raison des différences de vitesse et d\'intonation entre les langues, et de l\'influence de l\'étape de traduction, le doublage peut ne pas être parfait à 100 %. Cependant, le projet a réalisé beaucoup de travail d\'ingénierie sur la vitesse de la parole pour assurer le meilleur résultat de doublage.' },
                    { html: '<strong>La transcription vidéo multilingue ne conservera que la langue principale.</strong> Cela est dû au fait que whisperX utilise des modèles spécifiques à la langue pour l\'alignement forcé au niveau des mots, et supprimera les langues non reconnues.' },
                    { html: '<strong>Impossible de doubler plusieurs locuteurs séparément</strong>, car la diarisation des locuteurs de whisperX n\'est pas assez fiable.' }
                ]
            },
            license: {
                title: '📄 Licence',
                content: 'Ce projet est sous licence Apache 2.0. Remerciements particuliers aux projets open source suivants :'
            },
            contact: {
                title: '📬 Contact',
                channels: [
                    { html: 'Soumettre des <a href="https://github.com/Huanshere/VideoLingo/issues" target="_blank">Issues</a> ou <a href="https://github.com/Huanshere/VideoLingo/pulls" target="_blank">Pull Requests</a> sur GitHub' },
                    { html: 'DM sur Twitter : <a href="https://twitter.com/Huanshere" target="_blank">@Huanshere</a>' },
                    { html: 'Envoyer un email à : <a href="mailto:team@videolingo.io">team@videolingo.io</a>' }
                ]
            }
        }
    }
};