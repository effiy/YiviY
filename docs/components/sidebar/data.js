/**
 * Sidebar 数据源
 * ----------------------------------------------------------------------
 * 抽离 sidebar 的展示数据（logo / 导航分组 / footer 链接），
 * 与模板/样式解耦，便于后续维护。
 * 通过 window.SIDEBAR_CONFIG 单一对象暴露，供 Vue 组件读取。
 *
 * 数据形态遵循 mount-component.js 的 i18n:true 约定：
 *   - 顶层 keys 中, 语言 code (en / zh-CN / ...) 对应各语言的 groups 切片
 *   - 非语言 code 的键（这里仅为 constants）由 resolveI18nData 自动注入,
 *     模板可通过 this.logo / this.langs / this.footerLinks 直接访问
 *   - 切换语言时, wrapI18n 自动把当前语言 slice 的属性替换到 Vue 实例,
 *     模板无需任何 i18n 监听代码
 *
 * 语言列表：直接读取 window.VL_LANG.available。
 * 加载顺序由 docs/index.html 保证——lang.js 永远在 sidebar 的
 * data.js 之前同步执行（lang.js 是顶层 <script>，sidebar 走
 * data-include 异步加载），因此此处可直接取，VL_LANG 必然已就绪。
 */

window.SIDEBAR_CONFIG = {
    /* ── 跨语言常量 ─────────────────────────────────── */
    constants: {
        logo: {
            icon:    'V',
            text:    'VideoLingo',
            version: 'Documentation v3.0'
        },

        langs: window.VL_LANG.available,

        footerLinks: [
            { label: 'GitHub',  href: 'https://github.com/Huanshere/VideoLingo' },
            { label: 'SaaS',    href: 'https://videolingo.io' },
            { label: 'AI Help', href: 'https://share.fastgpt.in/chat/share?shareId=066w11n3r9aq6879r4z0v9rh' }
        ]
    },

    /* ── 多语言导航分组 ───────────────────────────────── */
    'en': {
        groups: [
            {
                title: 'Get Started',
                items: [
                    { label: 'Introduction',    href: '#intro',         active: true  },
                    { label: 'Quick Start',     href: '#quick-start',   active: false },
                    { label: 'Installation',    href: '#installation',  active: false }
                ]
            },
            {
                title: 'Core Workflow',
                items: [
                    { label: 'Pipeline Steps',  href: '#workflow',       active: false },
                    { label: 'Video Download',  href: '#download',       active: false },
                    { label: 'Transcription',   href: '#transcription',  active: false },
                    { label: 'Translation',     href: '#translation',    active: false },
                    { label: 'Dubbing',         href: '#dubbing',        active: false }
                ]
            },
            {
                title: 'Configuration',
                items: [
                    { label: 'config.yaml',     href: '#config',            active: false },
                    { label: 'API Setup',       href: '#api-config',        active: false },
                    { label: 'TTS Methods',     href: '#tts-methods',       active: false },
                    { label: 'YouTube Settings',href: '#youtube-settings',  active: false }
                ]
            },
            {
                title: 'Advanced',
                items: [
                    { label: 'Docker',           href: '#docker',           active: false },
                    { label: 'Batch Processing', href: '#batch',            active: false },
                    { label: 'Custom TTS',       href: '#custom-tts',       active: false },
                    { label: 'Troubleshooting',  href: '#troubleshooting',  active: false },
                    { label: 'Translations',     href: '#translations',     active: false },
                    { label: 'Code Activity',    href: '#code-activity',    active: false }
                ]
            }
        ]
    },

    'zh-CN': {
        groups: [
            {
                title: '快速开始',
                items: [
                    { label: '项目介绍',       href: '#intro',         active: true  },
                    { label: '快速上手',       href: '#quick-start',   active: false },
                    { label: '安装指南',       href: '#installation',  active: false }
                ]
            },
            {
                title: '核心流程',
                items: [
                    { label: '流水线步骤',     href: '#workflow',       active: false },
                    { label: '视频下载',       href: '#download',       active: false },
                    { label: '语音转录',       href: '#transcription',  active: false },
                    { label: '文本翻译',       href: '#translation',    active: false },
                    { label: '配音生成',       href: '#dubbing',        active: false }
                ]
            },
            {
                title: '配置说明',
                items: [
                    { label: 'config.yaml',     href: '#config',           active: false },
                    { label: 'API 设置',        href: '#api-config',       active: false },
                    { label: 'TTS 方案对比',    href: '#tts-methods',      active: false },
                    { label: 'YouTube 设置',    href: '#youtube-settings', active: false }
                ]
            },
            {
                title: '高级功能',
                items: [
                    { label: 'Docker 部署',     href: '#docker',          active: false },
                    { label: '批量处理',        href: '#batch',           active: false },
                    { label: '自定义 TTS',      href: '#custom-tts',      active: false },
                    { label: '故障排除',        href: '#troubleshooting', active: false },
                    { label: '多语言翻译',      href: '#translations',    active: false },
                    { label: '代码活跃度',      href: '#code-activity',   active: false }
                ]
            }
        ]
    },

    'zh-TW': {
        groups: [
            {
                title: '快速開始',
                items: [
                    { label: '專案介紹',       href: '#intro',         active: true  },
                    { label: '快速上手',       href: '#quick-start',   active: false },
                    { label: '安裝指南',       href: '#installation',  active: false }
                ]
            },
            {
                title: '核心流程',
                items: [
                    { label: '管線步驟',       href: '#workflow',       active: false },
                    { label: '影片下載',       href: '#download',       active: false },
                    { label: '語音轉錄',       href: '#transcription',  active: false },
                    { label: '文字翻譯',       href: '#translation',    active: false },
                    { label: '配音生成',       href: '#dubbing',        active: false }
                ]
            },
            {
                title: '設定說明',
                items: [
                    { label: 'config.yaml',     href: '#config',           active: false },
                    { label: 'API 設定',        href: '#api-config',       active: false },
                    { label: 'TTS 方案對比',    href: '#tts-methods',      active: false },
                    { label: 'YouTube 設定',    href: '#youtube-settings', active: false }
                ]
            },
            {
                title: '進階功能',
                items: [
                    { label: 'Docker 部署',     href: '#docker',          active: false },
                    { label: '批次處理',        href: '#batch',           active: false },
                    { label: '自訂 TTS',        href: '#custom-tts',      active: false },
                    { label: '故障排除',        href: '#troubleshooting', active: false },
                    { label: '多語言翻譯',      href: '#translations',    active: false },
                    { label: '程式碼活躍度',    href: '#code-activity',   active: false }
                ]
            }
        ]
    },

    'ja': {
        groups: [
            {
                title: 'はじめに',
                items: [
                    { label: '概要',           href: '#intro',         active: true  },
                    { label: 'クイックスタート', href: '#quick-start',  active: false },
                    { label: 'インストール',   href: '#installation',  active: false }
                ]
            },
            {
                title: 'コアワークフロー',
                items: [
                    { label: 'パイプライン',   href: '#workflow',       active: false },
                    { label: '動画ダウンロード', href: '#download',      active: false },
                    { label: '文字起こし',     href: '#transcription',  active: false },
                    { label: '翻訳',           href: '#translation',    active: false },
                    { label: '吹き替え',       href: '#dubbing',        active: false }
                ]
            },
            {
                title: '設定',
                items: [
                    { label: 'config.yaml',     href: '#config',           active: false },
                    { label: 'API 設定',        href: '#api-config',       active: false },
                    { label: 'TTS 比較',        href: '#tts-methods',      active: false },
                    { label: 'YouTube 設定',    href: '#youtube-settings', active: false }
                ]
            },
            {
                title: '高度な機能',
                items: [
                    { label: 'Docker',          href: '#docker',          active: false },
                    { label: 'バッチ処理',      href: '#batch',           active: false },
                    { label: 'カスタム TTS',    href: '#custom-tts',      active: false },
                    { label: 'トラブルシューティング', href: '#troubleshooting', active: false },
                    { label: '多言語翻訳',      href: '#translations',    active: false },
                    { label: 'コードアクティビティ', href: '#code-activity', active: false }
                ]
            }
        ]
    },

    'es': {
        groups: [
            {
                title: 'Primeros pasos',
                items: [
                    { label: 'Introducción',    href: '#intro',         active: true  },
                    { label: 'Inicio rápido',   href: '#quick-start',   active: false },
                    { label: 'Instalación',     href: '#installation',  active: false }
                ]
            },
            {
                title: 'Flujo principal',
                items: [
                    { label: 'Pipeline',        href: '#workflow',       active: false },
                    { label: 'Descarga',        href: '#download',       active: false },
                    { label: 'Transcripción',   href: '#transcription',  active: false },
                    { label: 'Traducción',      href: '#translation',    active: false },
                    { label: 'Doblaje',         href: '#dubbing',        active: false }
                ]
            },
            {
                title: 'Configuración',
                items: [
                    { label: 'config.yaml',     href: '#config',           active: false },
                    { label: 'Config. API',     href: '#api-config',       active: false },
                    { label: 'Métodos TTS',     href: '#tts-methods',      active: false },
                    { label: 'Config. YouTube', href: '#youtube-settings', active: false }
                ]
            },
            {
                title: 'Avanzado',
                items: [
                    { label: 'Docker',           href: '#docker',          active: false },
                    { label: 'Procesamiento por lotes', href: '#batch',    active: false },
                    { label: 'TTS personalizado', href: '#custom-tts',     active: false },
                    { label: 'Solución de problemas', href: '#troubleshooting', active: false },
                    { label: 'Traducciones',     href: '#translations',    active: false },
                    { label: 'Actividad de código', href: '#code-activity', active: false }
                ]
            }
        ]
    },

    'ru': {
        groups: [
            {
                title: 'Начало работы',
                items: [
                    { label: 'Введение',        href: '#intro',         active: true  },
                    { label: 'Быстрый старт',   href: '#quick-start',   active: false },
                    { label: 'Установка',       href: '#installation',  active: false }
                ]
            },
            {
                title: 'Основной процесс',
                items: [
                    { label: 'Конвейер',        href: '#workflow',       active: false },
                    { label: 'Загрузка видео',  href: '#download',       active: false },
                    { label: 'Транскрипция',    href: '#transcription',  active: false },
                    { label: 'Перевод',         href: '#translation',    active: false },
                    { label: 'Озвучивание',     href: '#dubbing',        active: false }
                ]
            },
            {
                title: 'Настройка',
                items: [
                    { label: 'config.yaml',     href: '#config',           active: false },
                    { label: 'Настройка API',   href: '#api-config',       active: false },
                    { label: 'Методы TTS',      href: '#tts-methods',      active: false },
                    { label: 'Настройка YouTube', href: '#youtube-settings', active: false }
                ]
            },
            {
                title: 'Продвинутые',
                items: [
                    { label: 'Docker',           href: '#docker',          active: false },
                    { label: 'Пакетная обработка', href: '#batch',         active: false },
                    { label: 'Свой TTS',         href: '#custom-tts',      active: false },
                    { label: 'Устранение неполадок', href: '#troubleshooting', active: false },
                    { label: 'Переводы',         href: '#translations',    active: false },
                    { label: 'Активность кода',  href: '#code-activity',   active: false }
                ]
            }
        ]
    },

    'fr': {
        groups: [
            {
                title: 'Démarrage',
                items: [
                    { label: 'Introduction',    href: '#intro',         active: true  },
                    { label: 'Démarrage rapide',href: '#quick-start',   active: false },
                    { label: 'Installation',    href: '#installation',  active: false }
                ]
            },
            {
                title: 'Flux principal',
                items: [
                    { label: 'Pipeline',        href: '#workflow',       active: false },
                    { label: 'Téléchargement',  href: '#download',       active: false },
                    { label: 'Transcription',   href: '#transcription',  active: false },
                    { label: 'Traduction',      href: '#translation',    active: false },
                    { label: 'Doublage',        href: '#dubbing',        active: false }
                ]
            },
            {
                title: 'Configuration',
                items: [
                    { label: 'config.yaml',     href: '#config',           active: false },
                    { label: 'Config. API',     href: '#api-config',       active: false },
                    { label: 'Méthodes TTS',    href: '#tts-methods',      active: false },
                    { label: 'Paramètres YouTube', href: '#youtube-settings', active: false }
                ]
            },
            {
                title: 'Avancé',
                items: [
                    { label: 'Docker',              href: '#docker',          active: false },
                    { label: 'Traitement par lots', href: '#batch',           active: false },
                    { label: 'TTS personnalisé',    href: '#custom-tts',      active: false },
                    { label: 'Dépannage',           href: '#troubleshooting', active: false },
                    { label: 'Traductions',         href: '#translations',    active: false },
                    { label: 'Activité du code',    href: '#code-activity',   active: false }
                ]
            }
        ]
    }
};