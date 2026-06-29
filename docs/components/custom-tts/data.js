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
    'zh-TW': {
        params: [
            { name: 'text',         desc: '要朗讀的字幕文字' },
            { name: 'output_path',  desc: '音訊檔案儲存路徑（.wav/.mp3）' },
            { name: 'speed_factor', desc: '目標語速倍率' }
        ],
        code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # 在此編寫你的 TTS 邏輯\n    # ...\n    return output_path"
    },
    ja: {
        params: [
            { name: 'text',         desc: '読み上げる字幕テキスト' },
            { name: 'output_path',  desc: '音声ファイルの保存先（.wav/.mp3）' },
            { name: 'speed_factor', desc: '目標の話速倍率' }
        ],
        code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # ここに TTS ロジックを記述\n    # ...\n    return output_path"
    },
    es: {
        params: [
            { name: 'text',         desc: 'el texto del subtítulo a leer' },
            { name: 'output_path',  desc: 'dónde guardar el archivo de audio (.wav/.mp3)' },
            { name: 'speed_factor', desc: 'multiplicador de velocidad objetivo' }
        ],
        code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # Tu lógica TTS aquí\n    # ...\n    return output_path"
    },
    ru: {
        params: [
            { name: 'text',         desc: 'текст субтитров для озвучивания' },
            { name: 'output_path',  desc: 'путь для сохранения аудиофайла (.wav/.mp3)' },
            { name: 'speed_factor', desc: 'целевой множитель скорости' }
        ],
        code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # Ваша логика TTS здесь\n    # ...\n    return output_path"
    },
    fr: {
        params: [
            { name: 'text',         desc: 'le texte du sous-titre à lire' },
            { name: 'output_path',  desc: 'où enregistrer le fichier audio (.wav/.mp3)' },
            { name: 'speed_factor', desc: 'multiplicateur de vitesse cible' }
        ],
        code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # Votre logique TTS ici\n    # ...\n    return output_path"
    }
};
