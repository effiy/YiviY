/**
 * Docker 数据源
 * ----------------------------------------------------------------------
 * 抽离 docker 的展示数据（命令 + 依赖 + compose yaml），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.DOCKER_CONFIG = {
    runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
    requirements: [
        'CUDA 12.4+',
        'NVIDIA Driver >550',
        'nvidia-container-toolkit'
    ],
    composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
};
