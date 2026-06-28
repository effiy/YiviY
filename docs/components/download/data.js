/**
 * Download 数据源
 * ----------------------------------------------------------------------
 * 抽离 download 的展示数据（分辨率选项 + 下载格式），
 * 便于统一维护。通过 window 暴露，供 Vue 组件读取。
 *
 * v2 改进（ui-ux-pro-max 审计）：
 *   - 移除 format icon 字段中的 emoji（🎬🎵）
 */

window.DOWNLOAD_CONFIG = {
    resolutions: [
        { option: '360p',        height: '360',  useCase: 'Quick test / low bandwidth' },
        { option: '480p',        height: '480',  useCase: 'Standard definition' },
        { option: '720p',        height: '720',  useCase: 'HD, balanced quality/speed' },
        { option: '1080p',       height: '1080', useCase: 'Full HD (default)' },
        { option: '1440p (2K)',  height: '1440', useCase: 'High quality' },
        { option: '2160p (4K)',  height: '2160', useCase: 'Ultra HD' },
        { option: 'Best',        height: '—',    useCase: 'Highest available' }
    ],
    formats: [
        { name: 'Video + Audio', desc: 'Full video with merged audio track, MP4 output' },
        { name: 'Audio Only',    desc: 'Best audio quality, no video. Useful for podcast-style content' }
    ]
};