/**
 * Quick Start 数据源
 * ----------------------------------------------------------------------
 * 抽离 quick-start 的展示数据（前置条件、FFmpeg 安装表、
 * 三种安装方式），便于统一维护。通过 window 暴露，
 * 供 Vue 组件读取。
 */

window.QUICK_START_CONFIG = {
    prerequisites: [
        { name: 'FFmpeg', desc: 'install via your package manager' },
        { name: 'Python 3.10', desc: 'auto-installed by uv — not needed separately' },
        { name: 'For GPU users', desc: 'CUDA 12.6 + cuDNN 9.3 (Windows NVIDIA only)' }
    ],
    ffmpegInstalls: [
        { os: 'macOS',   cmd: 'brew install ffmpeg' },
        { os: 'Windows', cmd: 'choco install ffmpeg', link: { label: 'Chocolatey', href: 'https://chocolatey.org/' } },
        { os: 'Linux',   cmd: 'sudo apt install ffmpeg' }
    ],
    installOptions: [
        {
            label: 'Option A: uv (Recommended)',
            body: '<code>uv</code> auto-downloads Python 3.10 and creates an isolated venv. No Anaconda needed.',
            code: 'git clone https://github.com/Huanshere/VideoLingo.git\ncd VideoLingo\npython setup_env.py\n\n# Start\n.venv/bin/streamlit run st.py          # macOS / Linux\n.venv\\Scripts\\streamlit run st.py       # Windows',
            extra: 'Or double-click <code>OneKeyStart_uv.bat</code> on Windows.'
        },
        {
            label: 'Option B: Docker',
            body: null,
            code: 'docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo',
            extra: 'Requires CUDA 12.4 + NVIDIA Driver >550. See the <a href="#docker">Docker section</a> for details.'
        },
        {
            label: 'Option C: Conda (Legacy)',
            body: null,
            code: 'conda create -n videolingo python=3.10.0 -y\nconda activate videolingo\npython install.py\nstreamlit run st.py',
            extra: null
        }
    ]
};
