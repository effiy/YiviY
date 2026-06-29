/* ════════════════════════════════════════════════════════════════════════
   rui-graph — yt-dlp Graph Data
   Generated from DIAGRAM_CONFIG + INTRO_CONFIG yt-dlp card.
   Source: docs/views/yt-dlp/diagram/data.js + docs/components/intro/data.js

   Regenerate this file when card data changes.
   ════════════════════════════════════════════════════════════════════════ */

window.GRAPH_DATA = {
  elements: [
    /* ═══════════════════════════════════════════════════════════════════
       CARD NODES
       ═══════════════════════════════════════════════════════════════════ */
    {
      data: {
        id: 'card:0', type: 'card',
        label: '🎥 yt-dlp',
        badge: 'OSS',
        desc: 'YouTube video download via yt-dlp · <strong>1,200+ sites</strong> · format selection · subtitle extraction',
        tags: [{ text: '1.2k sites', modifier: 'accent' }, { text: 'Python', modifier: 'info' }],
        links: [
          { label: '图解', href: 'views/yt-dlp/diagram/index.html', target: '' },
          { label: '源码', href: 'https://github.com/yt-dlp/yt-dlp', target: '_blank' },
          { label: '文档', href: 'https://github.com/yt-dlp/yt-dlp#readme', target: '_blank' },
          { label: 'Wiki', href: 'https://github.com/yt-dlp/yt-dlp/wiki', target: '_blank' },
          { label: 'Issues', href: 'https://github.com/yt-dlp/yt-dlp/issues', target: '_blank' }
        ],
        meta: 'MIT · v2024.12.01 · 1,200+ sites',
        richness: 6,
        href: 'views/yt-dlp/index.html'
      }
    },
    {
      data: {
        id: 'card:1', type: 'card',
        label: '📡 Supported Sources',
        badge: 'Sources',
        desc: '<strong>YouTube</strong> (watch / shorts / live / embed / playlist) · <strong>1,200+ sites</strong> via yt-dlp extractors · Local file upload as fallback · Audio → black_screen.mp4 conversion (FFmpeg)',
        tags: [
          { text: 'YouTube', modifier: 'accent' },
          { text: '1.2k sites', modifier: 'accent' },
          { text: 'Local file', modifier: 'info' },
          { text: 'FFmpeg', modifier: 'info' }
        ],
        links: [],
        richness: 4
      }
    },
    {
      data: {
        id: 'card:2', type: 'card',
        label: '⚡ Key Features',
        badge: 'Features',
        desc: 'Resolution: <strong>360p → 4K</strong> + best auto-detect · Format: video+audio / audio-only · <strong>Subtitle extraction</strong> (manual + auto, multi-lang) · Thumbnail download + FFmpeg post-process',
        tags: [
          { text: '360p→4K', modifier: 'accent' },
          { text: 'Format selection', modifier: 'info' },
          { text: 'Subtitle extraction', modifier: 'cyan' },
          { text: 'Thumbnail', modifier: 'info' }
        ],
        links: [],
        richness: 4
      }
    },
    {
      data: {
        id: 'card:3', type: 'card',
        label: '🔒 Reliability',
        badge: 'Reliability',
        desc: '<strong>5 retries</strong> + 3 fragment/file/extractor retries · Session-level yt-dlp auto-update + class cache · Filename sanitization post-download · <strong>Cookie + proxy</strong> support for restricted content',
        tags: [
          { text: 'Retry logic', modifier: 'warn' },
          { text: 'Auto-update', modifier: 'info' },
          { text: 'Filename sanitization', modifier: 'info' },
          { text: 'Cookie/Proxy', modifier: 'purple' }
        ],
        links: [],
        richness: 4
      }
    },

    /* ═══════════════════════════════════════════════════════════════════
       TAG NODES
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'tag:YouTube',              type: 'tag', label: 'YouTube',              modifier: 'accent', cooccurrence: 1 } },
    { data: { id: 'tag:1.2k_sites',           type: 'tag', label: '1.2k sites',           modifier: 'accent', cooccurrence: 2 } },
    { data: { id: 'tag:Local_file',           type: 'tag', label: 'Local file',           modifier: 'info',   cooccurrence: 1 } },
    { data: { id: 'tag:FFmpeg',               type: 'tag', label: 'FFmpeg',               modifier: 'info',   cooccurrence: 1 } },
    { data: { id: 'tag:360p_4K',              type: 'tag', label: '360p→4K',              modifier: 'accent', cooccurrence: 1 } },
    { data: { id: 'tag:Format_selection',     type: 'tag', label: 'Format selection',     modifier: 'info',   cooccurrence: 1 } },
    { data: { id: 'tag:Subtitle_extraction',  type: 'tag', label: 'Subtitle extraction',  modifier: 'cyan',   cooccurrence: 1 } },
    { data: { id: 'tag:Thumbnail',            type: 'tag', label: 'Thumbnail',            modifier: 'info',   cooccurrence: 1 } },
    { data: { id: 'tag:Retry_logic',          type: 'tag', label: 'Retry logic',          modifier: 'warn',   cooccurrence: 1 } },
    { data: { id: 'tag:Auto_update',          type: 'tag', label: 'Auto-update',          modifier: 'info',   cooccurrence: 1 } },
    { data: { id: 'tag:Filename_sanitization',type: 'tag', label: 'Filename sanitization',modifier: 'info',   cooccurrence: 1 } },
    { data: { id: 'tag:Cookie_Proxy',         type: 'tag', label: 'Cookie/Proxy',         modifier: 'purple', cooccurrence: 1 } },
    { data: { id: 'tag:Python',               type: 'tag', label: 'Python',               modifier: 'info',   cooccurrence: 1 } },

    /* ═══════════════════════════════════════════════════════════════════
       BADGE NODES
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'badge:OSS',         type: 'badge', label: 'OSS',         cardCount: 1 } },
    { data: { id: 'badge:Sources',     type: 'badge', label: 'Sources',     cardCount: 1 } },
    { data: { id: 'badge:Features',    type: 'badge', label: 'Features',    cardCount: 1 } },
    { data: { id: 'badge:Reliability', type: 'badge', label: 'Reliability', cardCount: 1 } },

    /* ═══════════════════════════════════════════════════════════════════
       LINK DESTINATION NODES
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'link_dest:github',   type: 'link_dest', label: 'GitHub',    url: 'https://github.com/yt-dlp/yt-dlp' } },
    { data: { id: 'link_dest:readme',   type: 'link_dest', label: 'Docs',      url: 'https://github.com/yt-dlp/yt-dlp#readme' } },
    { data: { id: 'link_dest:wiki',     type: 'link_dest', label: 'Wiki',      url: 'https://github.com/yt-dlp/yt-dlp/wiki' } },
    { data: { id: 'link_dest:issues',   type: 'link_dest', label: 'Issues',    url: 'https://github.com/yt-dlp/yt-dlp/issues' } },
    { data: { id: 'link_dest:diagram',  type: 'link_dest', label: 'Diagram',   url: 'views/yt-dlp/diagram/index.html' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — has_tag (card → tag)
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'edge:c0:tag:1.2k',    source: 'card:0', target: 'tag:1.2k_sites',          type: 'has_tag' } },
    { data: { id: 'edge:c0:tag:Python',  source: 'card:0', target: 'tag:Python',               type: 'has_tag' } },

    { data: { id: 'edge:c1:tag:YouTube',     source: 'card:1', target: 'tag:YouTube',              type: 'has_tag' } },
    { data: { id: 'edge:c1:tag:1.2k',        source: 'card:1', target: 'tag:1.2k_sites',           type: 'has_tag' } },
    { data: { id: 'edge:c1:tag:Local_file',  source: 'card:1', target: 'tag:Local_file',           type: 'has_tag' } },
    { data: { id: 'edge:c1:tag:FFmpeg',      source: 'card:1', target: 'tag:FFmpeg',               type: 'has_tag' } },

    { data: { id: 'edge:c2:tag:360p_4K',          source: 'card:2', target: 'tag:360p_4K',              type: 'has_tag' } },
    { data: { id: 'edge:c2:tag:Format_selection', source: 'card:2', target: 'tag:Format_selection',     type: 'has_tag' } },
    { data: { id: 'edge:c2:tag:Subtitle',         source: 'card:2', target: 'tag:Subtitle_extraction',  type: 'has_tag' } },
    { data: { id: 'edge:c2:tag:Thumbnail',        source: 'card:2', target: 'tag:Thumbnail',            type: 'has_tag' } },

    { data: { id: 'edge:c3:tag:Retry_logic',           source: 'card:3', target: 'tag:Retry_logic',           type: 'has_tag' } },
    { data: { id: 'edge:c3:tag:Auto_update',           source: 'card:3', target: 'tag:Auto_update',           type: 'has_tag' } },
    { data: { id: 'edge:c3:tag:Filename_sanitization', source: 'card:3', target: 'tag:Filename_sanitization', type: 'has_tag' } },
    { data: { id: 'edge:c3:tag:Cookie_Proxy',          source: 'card:3', target: 'tag:Cookie_Proxy',          type: 'has_tag' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — has_badge (card → badge)
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'edge:c0:badge:OSS',         source: 'card:0', target: 'badge:OSS',         type: 'has_badge' } },
    { data: { id: 'edge:c1:badge:Sources',     source: 'card:1', target: 'badge:Sources',     type: 'has_badge' } },
    { data: { id: 'edge:c2:badge:Features',    source: 'card:2', target: 'badge:Features',    type: 'has_badge' } },
    { data: { id: 'edge:c3:badge:Reliability', source: 'card:3', target: 'badge:Reliability', type: 'has_badge' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — shares_tag (card ↔ card)
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'edge:c0:c1:shares_tag:1.2k', source: 'card:0', target: 'card:1', type: 'shares_tag', shared: '1.2k sites' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — links_to (card → link dest)
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'edge:c0:link:github',  source: 'card:0', target: 'link_dest:github',  type: 'links_to' } },
    { data: { id: 'edge:c0:link:readme',  source: 'card:0', target: 'link_dest:readme',  type: 'links_to' } },
    { data: { id: 'edge:c0:link:wiki',    source: 'card:0', target: 'link_dest:wiki',    type: 'links_to' } },
    { data: { id: 'edge:c0:link:issues',  source: 'card:0', target: 'link_dest:issues',  type: 'links_to' } },
    { data: { id: 'edge:c0:link:diagram', source: 'card:0', target: 'link_dest:diagram', type: 'links_to' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — depends_on (LLM-inferred: category card → yt-dlp main)
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'edge:c1:c0:depends', source: 'card:1', target: 'card:0', type: 'depends_on' } },
    { data: { id: 'edge:c2:c0:depends', source: 'card:2', target: 'card:0', type: 'depends_on' } },
    { data: { id: 'edge:c3:c0:depends', source: 'card:3', target: 'card:0', type: 'depends_on' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — related_to (LLM-inferred: pipeline flow)
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'edge:c1:c2:related', source: 'card:1', target: 'card:2', type: 'related_to' } },
    { data: { id: 'edge:c2:c3:related', source: 'card:2', target: 'card:3', type: 'related_to' } },
    { data: { id: 'edge:c1:c3:related', source: 'card:1', target: 'card:3', type: 'related_to' } },
  ],

  meta: {
    nodeCount: 26,
    edgeCount: 30,
    cardCount: 4,
    tagCount: 13,
    badgeCount: 4,
    badges: ['OSS', 'Sources', 'Features', 'Reliability'],
    source: 'docs/views/yt-dlp/diagram/data.js → DIAGRAM_CONFIG + INTRO_CONFIG yt-dlp card',
  }
};
