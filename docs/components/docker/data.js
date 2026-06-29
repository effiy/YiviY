/**
 * Docker 数据源
 * ----------------------------------------------------------------------
 * 抽离 docker 的展示数据（命令 + 依赖 + compose yaml）。
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 * runCommand / composeCode 为 shell 命令，各语言相同。
 */

window.DOCKER_CONFIG={en:{title:'Docker',runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
        requirements: [
            'CUDA 12.4+',
            'NVIDIA Driver >550',
            'nvidia-container-toolkit'
        ],
        composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
    },
    'zh-CN':{title:'Docker 部署',runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
        requirements: [
            'CUDA 12.4 或更高版本',
            'NVIDIA 驱动 >550',
            'nvidia-container-toolkit'
        ],
        composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
    },
    'zh-TW': {
        runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
        requirements: [
            'CUDA 12.4 或更高版本',
            'NVIDIA 驅動 >550',
            'nvidia-container-toolkit'
        ],
        composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
    },
    ja: {
        runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
        requirements: [
            'CUDA 12.4 以上',
            'NVIDIA ドライバ >550',
            'nvidia-container-toolkit'
        ],
        composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
    },
    es: {
        runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
        requirements: [
            'CUDA 12.4+',
            'Controlador NVIDIA >550',
            'nvidia-container-toolkit'
        ],
        composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
    },
    ru: {
        runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
        requirements: [
            'CUDA 12.4+',
            'Драйвер NVIDIA >550',
            'nvidia-container-toolkit'
        ],
        composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
    },
    fr: {
        runCommand: "docker build -t videolingo .\ndocker run -d -p 8501:8501 --gpus all videolingo",
        requirements: [
            'CUDA 12.4+',
            'Pilote NVIDIA >550',
            'nvidia-container-toolkit'
        ],
        composeCode: "version: '3.8'\nservices:\n  videolingo:\n    build: .\n    ports:\n      - \"8501:8501\"\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n    volumes:\n      - ./output:/app/output\n      - ./config.yaml:/app/config.yaml"
    }
};
