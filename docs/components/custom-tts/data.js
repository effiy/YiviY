/**
 * Custom TTS 数据源
 * ----------------------------------------------------------------------
 * 抽离 custom-tts 的展示数据（接口参数 + 示例代码），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.CUSTOM_TTS_CONFIG = {
    params: [
        { name: 'text',         desc: 'the subtitle text to speak' },
        { name: 'output_path',  desc: 'where to save the audio file (.wav/.mp3)' },
        { name: 'speed_factor', desc: 'target speed multiplier' }
    ],
    code: "# core/tts_backend/custom_tts.py\ndef generate_audio(text, output_path, speed_factor=1.0):\n    # Your TTS logic here\n    # ...\n    return output_path"
};
