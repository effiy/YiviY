/**
 * Workflow 数据源
 * ----------------------------------------------------------------------
 * 抽离 workflow 的展示数据（两阶段处理步骤），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 */

window.WORKFLOW_CONFIG = {
    stages: [
        {
            title: 'Stage 1 — Text Processing',
            steps: [
                { title: 'WhisperX Transcription',          desc: 'Word-level speech recognition with forced alignment. Optionally runs Demucs vocal separation first.' },
                { title: 'NLP + LLM Sentence Segmentation', desc: 'spaCy connector-based splitting, then LLM semantic boundary refinement. Produces natural single-line sentences.' },
                { title: 'Summarization + Multi-Step Translation', desc: 'LLM summarizes scene context, extracts terminology, then does a 3-phase translate-reflect-adapt cycle for cinematic quality.' },
                { title: 'Subtitle Cutting & Alignment',    desc: 'Splits long subtitles, aligns timestamps, ensures Netflix-standard single-line output.' },
                { title: 'Merge Subtitles to Video',        desc: 'Burns subtitles into the video file using FFmpeg.' }
            ]
        },
        {
            title: 'Stage 2 — Audio Processing',
            steps: [
                { title: 'Audio Task Generation',            desc: 'Creates dubbing tasks and chunks based on subtitle timing.' },
                { title: 'Reference Audio Extraction',       desc: 'Extracts original audio segments to use as TTS voice reference (for GPT-SoVITS modes).' },
                { title: 'TTS Generation & Merge',           desc: 'Generates speech for each chunk and merges them together.' },
                { title: 'Final Audio-Video Merge',          desc: 'Combines the dubbed audio track with the original video.' }
            ]
        }
    ]
};
