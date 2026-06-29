/**
 * yt-dlp Tool Demo — Data
 *
 * Card data: YrySceneCard-compatible props for the header card.
 * Mock data: Simulated data for the tool interface demo (never real API calls).
 */
window.DEMO_CARD_DATA = {
    name: "🎥 yt-dlp",
    desc: "YouTube / 1,200+ sites download engine · <strong>360p → 4K</strong> · format selection · subtitle extraction · progress hooks",
    tags: [
        { text: "1.2k sites", modifier: "cyan" },
        { text: "Python", modifier: "purple" },
        { text: "5 retries", modifier: "accent" }
    ],
    badge: "OSS",
    nameHref: "../../index.html"
};

window.DEMO_MOCK_DATA = {
    // Sample inputs used for placeholder text and demo hints
    sampleInputs: [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        'https://vimeo.com/123456789'
    ],
    placeholder: 'Paste a YouTube or video URL to simulate download...',

    // Staged progress simulation — mirrors the real yt-dlp pipeline
    progressStages: [
        { pct: 10, text: 'Extracting info (yt-dlp --dump-json)...', delay: 500 },
        { pct: 25, text: 'Building format string (resolution + codec)...', delay: 400 },
        { pct: 45, text: 'Downloading fragments (8 concurrent)...', delay: 700 },
        { pct: 65, text: 'Extracting subtitles (manual + auto)...', delay: 600 },
        { pct: 80, text: 'Downloading thumbnail...', delay: 350 },
        { pct: 95, text: 'FFmpeg post-process + filename sanitization...', delay: 450 },
        { pct: 100, text: 'Done!', delay: 200 }
    ],

    // Mock result structure (returned by generateMockResult)
    mockResults: [
        {
            title: 'Rick Astley — Never Gonna Give You Up',
            duration: '3:32',
            uploader: 'Rick Astley',
            viewCount: '1.4B',
            resolution: '1080p',
            format: 'mp4 (h264 + aac)',
            fileSize: '128 MB',
            savedAs: 'Rick_Astley_Never_Gonna_Give_You_Up.mp4',
            subs: { en: 'manual (vtt)', 'zh-CN': 'auto-translated (vtt)', ja: 'auto (vtt)' },
            thumbnail: 'maxresdefault.jpg (480×360)',
            extractedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
        },
        {
            title: 'Me at the zoo',
            duration: '0:19',
            uploader: 'jawed',
            viewCount: '330M',
            resolution: '360p',
            format: 'mp4 (h264 + aac)',
            fileSize: '1.2 MB',
            savedAs: 'Me_at_the_zoo.mp4',
            subs: { en: 'auto (vtt)' },
            thumbnail: 'default.jpg (120×90)',
            extractedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
        },
        {
            title: 'Big Buck Bunny',
            duration: '10:34',
            uploader: 'Blender Foundation',
            viewCount: '22M',
            resolution: '4K',
            format: 'mp4 (av1 + opus)',
            fileSize: '845 MB',
            savedAs: 'Big_Buck_Bunny_4K.mp4',
            subs: { en: 'manual (srt)', de: 'manual (srt)', fr: 'manual (srt)', ja: 'auto (vtt)' },
            thumbnail: 'maxresdefault.jpg (1280×720)',
            extractedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
        }
    ],

    // Reliability: retry simulation state
    retryDemo: {
        enabled: true,
        maxRetries: 5,
        currentRetry: 0
    },

    // Metadata
    _meta: { demoSlug: 'yt-dlp-tool', demoType: 'A', sceneName: 'yt-dlp', generatedAt: '2026-06-29T17:50:00Z' }
};
