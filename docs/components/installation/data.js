window.INSTALLATION_CONFIG={
en: {
        title: 'Installation Details',
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
                    {
                        platform: 'Windows',
                        command: 'choco install ffmpeg',
                        via: 'Chocolatey'
                    },
                    {
                        platform: 'macOS',
                        command: 'brew install ffmpeg',
                        via: 'Homebrew'
                    },
                    {
                        platform: 'Linux',
                        command: 'sudo apt install ffmpeg',
                        via: 'Debian/Ubuntu'
                    }
                ]
            }
        },
        systemRequirements: [
            {
                component: 'RAM',
                min: '8 GB',
                recommended: '16 GB+'
            },
            {
                component: 'GPU (local WhisperX)',
                min: '8 GB VRAM',
                recommended: '12 GB+ VRAM'
            },
            {
                component: 'Disk',
                min: '5 GB',
                recommended: '20 GB+ (for model cache)'
            },
            {
                component: 'OS',
                min: 'macOS 12+ / Windows 10+ / Ubuntu 20.04+',
                recommended: '',
                colspan: !0
            }
        ],
        dependencies: [
            {
                name: 'streamlit',
                purpose: 'Web UI'
            },
            {
                name: 'yt-dlp',
                purpose: 'YouTube video download'
            },
            {
                name: 'whisperx',
                purpose: 'Word-level speech recognition'
            },
            {
                name: 'spacy',
                purpose: 'NLP sentence segmentation'
            },
            {
                name: 'demucs',
                purpose: 'Vocal separation (optional)'
            },
            {
                name: 'ruamel.yaml',
                purpose: 'Config file management'
            }
        ],
        methods: {
            uv: {
                title: 'Method 1: Using uv (Recommended)',
                intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> auto-downloads Python 3.10 and creates an isolated env — no manual Python or Anaconda install needed.' },
                steps: [
                    {
                        desc: 'Clone the repo',
                        command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo'
                    },
                    {
                        desc: 'One-click install (uv + Python 3.10 + all deps)',
                        command: 'python setup_env.py'
                    },
                    {
                        desc: 'Start the app',
                        command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux',
                        multiline: !0
                    }
                ],
                alt: 'Or double-click OneKeyStart_uv.bat on Windows.'
            },
            conda: {
                title: 'Method 2: Using Conda',
                warning: '⚠️ Not recommended. This method will no longer be maintained — please use uv (Method 1) above.',
                summary: 'Click to expand Conda install steps',
                steps: [
                    {
                        desc: 'Clone the repo',
                        command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo'
                    },
                    {
                        desc: 'Install deps (requires python=3.10)',
                        command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py'
                    },
                    {
                        desc: 'Start the app',
                        command: 'streamlit run st.py'
                    }
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
        }
    },
'zh-CN': {
        title: '安装详情',
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
                    {
                        platform: 'Windows',
                        command: 'choco install ffmpeg',
                        via: 'Chocolatey'
                    },
                    {
                        platform: 'macOS',
                        command: 'brew install ffmpeg',
                        via: 'Homebrew'
                    },
                    {
                        platform: 'Linux',
                        command: 'sudo apt install ffmpeg',
                        via: 'Debian/Ubuntu'
                    }
                ]
            }
        },
        systemRequirements: [
            {
                component: '内存',
                min: '8 GB',
                recommended: '16 GB+'
            },
            {
                component: 'GPU (本地 WhisperX)',
                min: '8 GB VRAM',
                recommended: '12 GB+ VRAM'
            },
            {
                component: '硬盘',
                min: '5 GB',
                recommended: '20 GB+（模型缓存）'
            },
            {
                component: '操作系统',
                min: 'macOS 12+ / Windows 10+ / Ubuntu 20.04+',
                recommended: '',
                colspan: !0
            }
        ],
        dependencies: [
            {
                name: 'streamlit',
                purpose: 'Web 界面'
            },
            {
                name: 'yt-dlp',
                purpose: 'YouTube 视频下载'
            },
            {
                name: 'whisperx',
                purpose: '词级语音识别'
            },
            {
                name: 'spacy',
                purpose: 'NLP 句子分割'
            },
            {
                name: 'demucs',
                purpose: '人声分离（可选）'
            },
            {
                name: 'ruamel.yaml',
                purpose: '配置文件管理'
            }
        ],
        methods: {
            uv: {
                title: '方式一：使用 uv（推荐，无需安装 Anaconda）',
                intro: { html: '<a href="https://docs.astral.sh/uv/" target="_blank">uv</a> 会自动下载 Python 3.10 并创建隔离环境，你不需要自己安装 Python 或 Anaconda。' },
                steps: [
                    {
                        desc: '克隆仓库',
                        command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo'
                    },
                    {
                        desc: '一键安装（自动安装 uv + Python 3.10 + 所有依赖）',
                        command: 'python setup_env.py'
                    },
                    {
                        desc: '启动应用',
                        command: '.venv\\Scripts\\streamlit run st.py        # Windows\n.venv/bin/streamlit run st.py            # macOS / Linux',
                        multiline: !0
                    }
                ],
                alt: '或者在 Windows 上双击 OneKeyStart_uv.bat。'
            },
            conda: {
                title: '方式二：使用 Conda',
                warning: '⚠️ 不推荐。 此方式今后将不再维护，请使用上方的 uv（方式一）。',
                summary: '点击展开 Conda 安装步骤',
                steps: [
                    {
                        desc: '克隆仓库',
                        command: 'git clone https://github.com/Huanshere/VideoLingo.git && cd VideoLingo'
                    },
                    {
                        desc: '安装依赖（需要 python=3.10）',
                        command: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py'
                    },
                    {
                        desc: '启动应用',
                        command: 'streamlit run st.py'
                    }
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
        }
    },
};