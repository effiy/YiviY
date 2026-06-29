/**
 * Custom TTS 数据源
 * ----------------------------------------------------------------------
 * 抽离 custom-tts 的展示数据（接口参数 + 示例代码）。
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 * params[].name 与 code 为语言无关常量（API 名称 / Python 代码）。
 */

window.CUSTOM_TTS_CONFIG={en:{title:'Custom TTS Integration',params: [
            { name: 'text',         desc: 'the subtitle text to speak' },
            { name: 'output_path',  desc: 'where to save the audio file (.wav/.mp3)' },
            { name: 'speed_factor', desc: 'target speed multiplier' }
        ],
        code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # Your TTS logic here\n    # ...\n    return output_path"
    },
    'zh-CN':{title:'自定义 TTS 集成',params: [
            { name: 'text',         desc: '要朗读的字幕文本' },
            { name: 'output_path',  desc: '音频文件保存路径（.wav/.mp3）' },
            { name: 'speed_factor', desc: '目标语速倍率' }
        ],
        code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # 在此编写你的 TTS 逻辑\n    # ...\n    return output_path"
    },
};
