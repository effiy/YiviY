/* ════════════════════════════════════════════════════════════════════════
   yt-dlp — Code Dependency Graph Data
   Generated from AST analysis of site-packages/yt_dlp/ core files.
   Excludes: extractor/, downloader/, postprocessor/, compat/, test/

   Node types: file (round-rect), class (hexagon), function (ellipse), module (diamond)
   Edge types: imports, calls, inherits, contains, exports

   Regenerate this file when source structure changes.
   ════════════════════════════════════════════════════════════════════════ */

window.GRAPH_DATA = {
  elements: [
    /* ═══════════════════════════════════════════════════════════════════
       FILE NODES (20 files)
       type=file, shape=round-rectangle, color=#38bdf8 (sky blue)
       ═══════════════════════════════════════════════════════════════════ */

    // --- Core tier (>1000 lines) ---
    { data: { id: 'file:YoutubeDL.py',    type: 'file', label: 'YoutubeDL.py',    path: 'yt_dlp/YoutubeDL.py',    lines: 4542, tier: 'core',    module: 'yt_dlp' } },
    { data: { id: 'file:__init__.py',     type: 'file', label: '__init__.py',     path: 'yt_dlp/__init__.py',     lines: 1114, tier: 'core',    module: 'yt_dlp' } },
    { data: { id: 'file:options.py',      type: 'file', label: 'options.py',      path: 'yt_dlp/options.py',      lines: 2012, tier: 'core',    module: 'yt_dlp' } },
    { data: { id: 'file:utils/_utils.py', type: 'file', label: '_utils.py',       path: 'yt_dlp/utils/_utils.py', lines: 5732, tier: 'core',    module: 'utils' } },
    { data: { id: 'file:cookies.py',      type: 'file', label: 'cookies.py',      path: 'yt_dlp/cookies.py',      lines: 1420, tier: 'core',    module: 'yt_dlp' } },

    // --- Library tier (100–1000 lines) ---
    { data: { id: 'file:networking/common.py',    type: 'file', label: 'common.py',          path: 'yt_dlp/networking/common.py',    lines: 608,  tier: 'library', module: 'networking' } },
    { data: { id: 'file:networking/_urllib.py',   type: 'file', label: '_urllib.py',         path: 'yt_dlp/networking/_urllib.py',   lines: 445,  tier: 'library', module: 'networking' } },
    { data: { id: 'file:networking/_requests.py', type: 'file', label: '_requests.py',       path: 'yt_dlp/networking/_requests.py', lines: 418,  tier: 'library', module: 'networking' } },
    { data: { id: 'file:networking/_curlcffi.py', type: 'file', label: '_curlcffi.py',       path: 'yt_dlp/networking/_curlcffi.py', lines: 346,  tier: 'library', module: 'networking' } },
    { data: { id: 'file:networking/_helper.py',   type: 'file', label: '_helper.py',         path: 'yt_dlp/networking/_helper.py',   lines: 273,  tier: 'library', module: 'networking' } },
    { data: { id: 'file:utils/traversal.py',      type: 'file', label: 'traversal.py',       path: 'yt_dlp/utils/traversal.py',      lines: 477,  tier: 'library', module: 'utils' } },
    { data: { id: 'file:utils/networking.py',     type: 'file', label: 'networking.py',      path: 'yt_dlp/utils/networking.py',     lines: 256,  tier: 'library', module: 'utils' } },
    { data: { id: 'file:aes.py',                  type: 'file', label: 'aes.py',              path: 'yt_dlp/aes.py',                  lines: 552,  tier: 'library', module: 'yt_dlp' } },
    { data: { id: 'file:plugins.py',              type: 'file', label: 'plugins.py',          path: 'yt_dlp/plugins.py',              lines: 247,  tier: 'library', module: 'yt_dlp' } },
    { data: { id: 'file:networking/impersonate.py', type: 'file', label: 'impersonate.py',    path: 'yt_dlp/networking/impersonate.py', lines: 155, tier: 'library', module: 'networking' } },
    { data: { id: 'file:networking/exceptions.py', type: 'file',  label: 'exceptions.py',     path: 'yt_dlp/networking/exceptions.py', lines: 103,  tier: 'library', module: 'networking' } },
    { data: { id: 'file:utils/progress.py',       type: 'file', label: 'progress.py',         path: 'yt_dlp/utils/progress.py',       lines: 109,  tier: 'library', module: 'utils' } },

    // --- Utility tier (<100 lines) ---
    { data: { id: 'file:cache.py',      type: 'file', label: 'cache.py',      path: 'yt_dlp/cache.py',      lines: 91,  tier: 'utility', module: 'yt_dlp' } },
    { data: { id: 'file:globals.py',    type: 'file', label: 'globals.py',    path: 'yt_dlp/globals.py',    lines: 41,  tier: 'utility', module: 'yt_dlp' } },
    { data: { id: 'file:version.py',    type: 'file', label: 'version.py',    path: 'yt_dlp/version.py',    lines: 15,  tier: 'utility', module: 'yt_dlp' } },

    /* ═══════════════════════════════════════════════════════════════════
       MODULE NODES (3 packages)
       type=module, shape=diamond, color=#fbbf24 (amber)
       ═══════════════════════════════════════════════════════════════════ */
    { data: { id: 'module:yt_dlp',      type: 'module', label: 'yt_dlp',      path: 'yt_dlp/',            submoduleCount: 2 } },
    { data: { id: 'module:utils',       type: 'module', label: 'utils',       path: 'yt_dlp/utils/',      submoduleCount: 0 } },
    { data: { id: 'module:networking',  type: 'module', label: 'networking',  path: 'yt_dlp/networking/', submoduleCount: 0 } },

    /* ═══════════════════════════════════════════════════════════════════
       CLASS NODES (22 classes)
       type=class, shape=hexagon, color=#a78bfa (violet)
       ═══════════════════════════════════════════════════════════════════ */

    // --- YoutubeDL.py ---
    { data: { id: 'class:YoutubeDL',          type: 'class', label: 'YoutubeDL',          file: 'file:YoutubeDL.py',    methodCount: 69,  category: 'orchestrator' } },

    // --- networking/common.py ---
    { data: { id: 'class:RequestDirector',    type: 'class', label: 'RequestDirector',    file: 'file:networking/common.py',    methodCount: 4,  category: 'orchestrator' } },
    { data: { id: 'class:RequestHandler',     type: 'class', label: 'RequestHandler',     file: 'file:networking/common.py',    methodCount: 5,  category: 'abstract' } },
    { data: { id: 'class:Request',            type: 'class', label: 'Request',            file: 'file:networking/common.py',    methodCount: 6,  category: 'data' } },
    { data: { id: 'class:Response',           type: 'class', label: 'Response',           file: 'file:networking/common.py',    methodCount: 5,  category: 'data' } },
    { data: { id: 'class:Features',           type: 'class', label: 'Features',           file: 'file:networking/common.py',    methodCount: 0,  category: 'data' } },

    // --- networking handlers ---
    { data: { id: 'class:UrllibRH',           type: 'class', label: 'UrllibRH',           file: 'file:networking/_urllib.py',   methodCount: 8,  category: 'handler' } },
    { data: { id: 'class:RequestsRH',         type: 'class', label: 'RequestsRH',         file: 'file:networking/_requests.py', methodCount: 8,  category: 'handler' } },
    { data: { id: 'class:CurlCFFIRH',         type: 'class', label: 'CurlCFFIRH',         file: 'file:networking/_curlcffi.py', methodCount: 7,  category: 'handler' } },

    // --- networking/impersonate.py ---
    { data: { id: 'class:ImpersonateRequestHandler', type: 'class', label: 'ImpersonateRequestHandler', file: 'file:networking/impersonate.py', methodCount: 2, category: 'abstract' } },
    { data: { id: 'class:ImpersonateTarget',  type: 'class', label: 'ImpersonateTarget',  file: 'file:networking/impersonate.py', methodCount: 0,  category: 'data' } },

    // --- networking exceptions ---
    { data: { id: 'class:RequestError',       type: 'class', label: 'RequestError',       file: 'file:networking/exceptions.py', methodCount: 0,  category: 'data' } },
    { data: { id: 'class:NoSupportingHandlers', type: 'class', label: 'NoSupportingHandlers', file: 'file:networking/exceptions.py', methodCount: 0, category: 'data' } },
    { data: { id: 'class:TransportError',     type: 'class', label: 'TransportError',     file: 'file:networking/exceptions.py', methodCount: 0,  category: 'data' } },
    { data: { id: 'class:HTTPError',          type: 'class', label: 'HTTPError',          file: 'file:networking/exceptions.py', methodCount: 0,  category: 'data' } },

    // --- utils/_utils.py ---
    { data: { id: 'class:YoutubeDLError',     type: 'class', label: 'YoutubeDLError',     file: 'file:utils/_utils.py',   methodCount: 0,  category: 'data' } },
    { data: { id: 'class:ExtractorError',     type: 'class', label: 'ExtractorError',     file: 'file:utils/_utils.py',   methodCount: 0,  category: 'data' } },
    { data: { id: 'class:DownloadError',      type: 'class', label: 'DownloadError',      file: 'file:utils/_utils.py',   methodCount: 0,  category: 'data' } },
    { data: { id: 'class:DownloadCancelled',  type: 'class', label: 'DownloadCancelled',  file: 'file:utils/_utils.py',   methodCount: 0,  category: 'data' } },

    // --- Other ---
    { data: { id: 'class:Cache',              type: 'class', label: 'Cache',              file: 'file:cache.py',          methodCount: 4,  category: 'data' } },
    { data: { id: 'class:HTTPHeaderDict',     type: 'class', label: 'HTTPHeaderDict',     file: 'file:utils/networking.py', methodCount: 5, category: 'data' } },
    { data: { id: 'class:ProgressCalculator', type: 'class', label: 'ProgressCalculator', file: 'file:utils/progress.py',  methodCount: 2,  category: 'data' } },

    /* ═══════════════════════════════════════════════════════════════════
       FUNCTION NODES (23 functions/methods)
       type=function, shape=ellipse, color=#34d399 (emerald)
       ═══════════════════════════════════════════════════════════════════ */

    // --- YoutubeDL methods ---
    { data: { id: 'func:extract_info',       type: 'function', label: 'extract_info()',       file: 'file:YoutubeDL.py',  class: 'YoutubeDL', role: 'core_logic' } },
    { data: { id: 'func:download',           type: 'function', label: 'download()',           file: 'file:YoutubeDL.py',  class: 'YoutubeDL', role: 'entry_point' } },
    { data: { id: 'func:urlopen',            type: 'function', label: 'urlopen()',            file: 'file:YoutubeDL.py',  class: 'YoutubeDL', role: 'core_logic' } },
    { data: { id: 'func:process_video_result', type: 'function', label: 'process_video_result()', file: 'file:YoutubeDL.py', class: 'YoutubeDL', role: 'core_logic' } },
    { data: { id: 'func:process_info',       type: 'function', label: 'process_info()',       file: 'file:YoutubeDL.py',  class: 'YoutubeDL', role: 'core_logic' } },
    { data: { id: 'func:build_request_director', type: 'function', label: 'build_request_director()', file: 'file:YoutubeDL.py', class: 'YoutubeDL', role: 'core_logic' } },

    // --- RequestDirector methods ---
    { data: { id: 'func:RD_send',            type: 'function', label: 'send()',               file: 'file:networking/common.py', class: 'RequestDirector', role: 'core_logic' } },
    { data: { id: 'func:RD_add_handler',     type: 'function', label: 'add_handler()',        file: 'file:networking/common.py', class: 'RequestDirector', role: 'core_logic' } },

    // --- RequestHandler methods ---
    { data: { id: 'func:RH_send',            type: 'function', label: 'send()',               file: 'file:networking/common.py', class: 'RequestHandler', role: 'core_logic' } },
    { data: { id: 'func:RH_validate',        type: 'function', label: 'validate()',           file: 'file:networking/common.py', class: 'RequestHandler', role: 'core_logic' } },

    // --- __init__.py module-level ---
    { data: { id: 'func:_real_main',         type: 'function', label: '_real_main()',         file: 'file:__init__.py',   role: 'entry_point' } },
    { data: { id: 'func:main',               type: 'function', label: 'main()',               file: 'file:__init__.py',   role: 'entry_point' } },
    { data: { id: 'func:parse_options',      type: 'function', label: 'parse_options()',      file: 'file:__init__.py',   role: 'core_logic' } },

    // --- options.py module-level ---
    { data: { id: 'func:parseOpts',          type: 'function', label: 'parseOpts()',          file: 'file:options.py',    role: 'entry_point' } },

    // --- utils module-level ---
    { data: { id: 'func:traverse_obj',       type: 'function', label: 'traverse_obj()',       file: 'file:utils/traversal.py', role: 'utility' } },
    { data: { id: 'func:sanitize_filename',  type: 'function', label: 'sanitize_filename()',  file: 'file:utils/_utils.py',    role: 'utility' } },

    // --- cookies.py module-level ---
    { data: { id: 'func:load_cookies',       type: 'function', label: 'load_cookies()',       file: 'file:cookies.py',    role: 'core_logic' } },

    // --- plugins.py module-level ---
    { data: { id: 'func:load_all_plugins',   type: 'function', label: 'load_all_plugins()',   file: 'file:plugins.py',    role: 'core_logic' } },
    { data: { id: 'func:directories',        type: 'function', label: 'directories()',        file: 'file:plugins.py',    role: 'utility' } },

    // --- networking module-level ---
    { data: { id: 'func:register_rh',        type: 'function', label: 'register_rh()',        file: 'file:networking/common.py',  role: 'utility' } },
    { data: { id: 'func:make_ssl_context',   type: 'function', label: 'make_ssl_context()',   file: 'file:networking/_helper.py',  role: 'utility' } },
    { data: { id: 'func:select_proxy',       type: 'function', label: 'select_proxy()',       file: 'file:utils/networking.py',    role: 'utility' } },

    // --- aes.py ---
    { data: { id: 'func:aes_decrypt',        type: 'function', label: 'aes_decrypt()',        file: 'file:aes.py',         role: 'utility' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — contains (file → class/function)
       type=contains, solid no arrow, color=#475569, width=0.8
       ═══════════════════════════════════════════════════════════════════ */

    // YoutubeDL.py defines
    { data: { id: 'edge:YoutubeDL:YoutubeDL:contains',   source: 'file:YoutubeDL.py', target: 'class:YoutubeDL',          type: 'contains' } },
    { data: { id: 'edge:YoutubeDL:extract_info:contains', source: 'file:YoutubeDL.py', target: 'func:extract_info',       type: 'contains' } },
    { data: { id: 'edge:YoutubeDL:download:contains',    source: 'file:YoutubeDL.py', target: 'func:download',           type: 'contains' } },
    { data: { id: 'edge:YoutubeDL:urlopen:contains',     source: 'file:YoutubeDL.py', target: 'func:urlopen',            type: 'contains' } },
    { data: { id: 'edge:YoutubeDL:process_vid:contains', source: 'file:YoutubeDL.py', target: 'func:process_video_result', type: 'contains' } },
    { data: { id: 'edge:YoutubeDL:process_info:contains',source: 'file:YoutubeDL.py', target: 'func:process_info',       type: 'contains' } },
    { data: { id: 'edge:YoutubeDL:build_rd:contains',    source: 'file:YoutubeDL.py', target: 'func:build_request_director', type: 'contains' } },

    // networking/common.py defines
    { data: { id: 'edge:common:RD:contains',         source: 'file:networking/common.py', target: 'class:RequestDirector',   type: 'contains' } },
    { data: { id: 'edge:common:RH:contains',         source: 'file:networking/common.py', target: 'class:RequestHandler',    type: 'contains' } },
    { data: { id: 'edge:common:Request:contains',    source: 'file:networking/common.py', target: 'class:Request',           type: 'contains' } },
    { data: { id: 'edge:common:Response:contains',   source: 'file:networking/common.py', target: 'class:Response',          type: 'contains' } },
    { data: { id: 'edge:common:Features:contains',   source: 'file:networking/common.py', target: 'class:Features',          type: 'contains' } },
    { data: { id: 'edge:common:RD_send:contains',    source: 'file:networking/common.py', target: 'func:RD_send',            type: 'contains' } },
    { data: { id: 'edge:common:RD_add:contains',     source: 'file:networking/common.py', target: 'func:RD_add_handler',     type: 'contains' } },
    { data: { id: 'edge:common:RH_send:contains',    source: 'file:networking/common.py', target: 'func:RH_send',            type: 'contains' } },
    { data: { id: 'edge:common:RH_validate:contains',source: 'file:networking/common.py', target: 'func:RH_validate',        type: 'contains' } },
    { data: { id: 'edge:common:register_rh:contains',source: 'file:networking/common.py', target: 'func:register_rh',        type: 'contains' } },

    // networking handlers
    { data: { id: 'edge:_urllib:UrllibRH:contains',     source: 'file:networking/_urllib.py',   target: 'class:UrllibRH',     type: 'contains' } },
    { data: { id: 'edge:_requests:RequestsRH:contains', source: 'file:networking/_requests.py', target: 'class:RequestsRH',   type: 'contains' } },
    { data: { id: 'edge:_curlcffi:CurlCFFIRH:contains', source: 'file:networking/_curlcffi.py', target: 'class:CurlCFFIRH',   type: 'contains' } },
    { data: { id: 'edge:impersonate:IReqH:contains',    source: 'file:networking/impersonate.py', target: 'class:ImpersonateRequestHandler', type: 'contains' } },
    { data: { id: 'edge:impersonate:ITarget:contains',  source: 'file:networking/impersonate.py', target: 'class:ImpersonateTarget',        type: 'contains' } },

    // networking exceptions
    { data: { id: 'edge:exceptions:ReqErr:contains',       source: 'file:networking/exceptions.py', target: 'class:RequestError',         type: 'contains' } },
    { data: { id: 'edge:exceptions:NoSupp:contains',       source: 'file:networking/exceptions.py', target: 'class:NoSupportingHandlers',  type: 'contains' } },
    { data: { id: 'edge:exceptions:TransErr:contains',     source: 'file:networking/exceptions.py', target: 'class:TransportError',       type: 'contains' } },
    { data: { id: 'edge:exceptions:HTTPErr:contains',      source: 'file:networking/exceptions.py', target: 'class:HTTPError',            type: 'contains' } },

    // networking/_helper.py
    { data: { id: 'edge:_helper:ssl:contains',             source: 'file:networking/_helper.py',   target: 'func:make_ssl_context',    type: 'contains' } },

    // __init__.py defines
    { data: { id: 'edge:init:_real_main:contains',         source: 'file:__init__.py', target: 'func:_real_main',         type: 'contains' } },
    { data: { id: 'edge:init:main:contains',               source: 'file:__init__.py', target: 'func:main',               type: 'contains' } },
    { data: { id: 'edge:init:parse_options:contains',      source: 'file:__init__.py', target: 'func:parse_options',      type: 'contains' } },

    // options.py defines
    { data: { id: 'edge:options:parseOpts:contains',       source: 'file:options.py',    target: 'func:parseOpts',          type: 'contains' } },

    // utils/_utils.py defines
    { data: { id: 'edge:_utils:YTDLerr:contains',          source: 'file:utils/_utils.py',   target: 'class:YoutubeDLError',    type: 'contains' } },
    { data: { id: 'edge:_utils:ExtrErr:contains',          source: 'file:utils/_utils.py',   target: 'class:ExtractorError',    type: 'contains' } },
    { data: { id: 'edge:_utils:DownErr:contains',          source: 'file:utils/_utils.py',   target: 'class:DownloadError',     type: 'contains' } },
    { data: { id: 'edge:_utils:Cancel:contains',           source: 'file:utils/_utils.py',   target: 'class:DownloadCancelled', type: 'contains' } },
    { data: { id: 'edge:_utils:sanitize:contains',         source: 'file:utils/_utils.py',   target: 'func:sanitize_filename',  type: 'contains' } },

    // utils/traversal.py defines
    { data: { id: 'edge:traversal:traverse:contains',      source: 'file:utils/traversal.py',  target: 'func:traverse_obj',      type: 'contains' } },

    // Other file → class/function contains
    { data: { id: 'edge:cookies:load:contains',            source: 'file:cookies.py',       target: 'func:load_cookies',       type: 'contains' } },
    { data: { id: 'edge:plugins:load_all:contains',        source: 'file:plugins.py',       target: 'func:load_all_plugins',   type: 'contains' } },
    { data: { id: 'edge:plugins:dirs:contains',            source: 'file:plugins.py',       target: 'func:directories',        type: 'contains' } },
    { data: { id: 'edge:cache:Cache:contains',             source: 'file:cache.py',         target: 'class:Cache',             type: 'contains' } },
    { data: { id: 'edge:utils_net:Headers:contains',       source: 'file:utils/networking.py', target: 'class:HTTPHeaderDict',   type: 'contains' } },
    { data: { id: 'edge:utils_net:proxy:contains',         source: 'file:utils/networking.py', target: 'func:select_proxy',      type: 'contains' } },
    { data: { id: 'edge:progress:PC:contains',             source: 'file:utils/progress.py',   target: 'class:ProgressCalculator', type: 'contains' } },
    { data: { id: 'edge:aes:decrypt:contains',             source: 'file:aes.py',              target: 'func:aes_decrypt',         type: 'contains' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — imports (file → file)
       type=imports, solid arrow, color=#475569, width=1.5
       Based on actual Python import statements from AST analysis.
       ═══════════════════════════════════════════════════════════════════ */

    // YoutubeDL.py imports (the hub — imports from 14+ modules)
    { data: { id: 'edge:YoutubeDL:utils:imports',      source: 'file:YoutubeDL.py', target: 'file:utils/_utils.py',        type: 'imports' } },
    { data: { id: 'edge:YoutubeDL:common:imports',     source: 'file:YoutubeDL.py', target: 'file:networking/common.py',   type: 'imports' } },
    { data: { id: 'edge:YoutubeDL:cookies:imports',    source: 'file:YoutubeDL.py', target: 'file:cookies.py',             type: 'imports' } },
    { data: { id: 'edge:YoutubeDL:cache:imports',      source: 'file:YoutubeDL.py', target: 'file:cache.py',               type: 'imports' } },
    { data: { id: 'edge:YoutubeDL:plugins:imports',    source: 'file:YoutubeDL.py', target: 'file:plugins.py',             type: 'imports' } },
    { data: { id: 'edge:YoutubeDL:impersonate:imports',source: 'file:YoutubeDL.py', target: 'file:networking/impersonate.py', type: 'imports' } },
    { data: { id: 'edge:YoutubeDL:exceptions:imports', source: 'file:YoutubeDL.py', target: 'file:networking/exceptions.py', type: 'imports' } },
    { data: { id: 'edge:YoutubeDL:globals:imports',    source: 'file:YoutubeDL.py', target: 'file:globals.py',             type: 'imports' } },

    // __init__.py imports
    { data: { id: 'edge:init:YoutubeDL:imports',       source: 'file:__init__.py', target: 'file:YoutubeDL.py',             type: 'imports' } },
    { data: { id: 'edge:init:options:imports',         source: 'file:__init__.py', target: 'file:options.py',               type: 'imports' } },
    { data: { id: 'edge:init:cookies:imports',         source: 'file:__init__.py', target: 'file:cookies.py',               type: 'imports' } },
    { data: { id: 'edge:init:plugins:imports',         source: 'file:__init__.py', target: 'file:plugins.py',               type: 'imports' } },
    { data: { id: 'edge:init:_utils:imports',          source: 'file:__init__.py', target: 'file:utils/_utils.py',          type: 'imports' } },
    { data: { id: 'edge:init:impersonate:imports',     source: 'file:__init__.py', target: 'file:networking/impersonate.py', type: 'imports' } },
    { data: { id: 'edge:init:globals:imports',         source: 'file:__init__.py', target: 'file:globals.py',               type: 'imports' } },

    // options.py imports
    { data: { id: 'edge:options:cookies:imports',      source: 'file:options.py', target: 'file:cookies.py',               type: 'imports' } },
    { data: { id: 'edge:options:_utils:imports',       source: 'file:options.py', target: 'file:utils/_utils.py',          type: 'imports' } },

    // networking/common.py imports
    { data: { id: 'edge:common:_helper:imports',       source: 'file:networking/common.py', target: 'file:networking/_helper.py',    type: 'imports' } },
    { data: { id: 'edge:common:exceptions:imports',    source: 'file:networking/common.py', target: 'file:networking/exceptions.py', type: 'imports' } },
    { data: { id: 'edge:common:cookies:imports',       source: 'file:networking/common.py', target: 'file:cookies.py',               type: 'imports' } },
    { data: { id: 'edge:common:utils_net:imports',     source: 'file:networking/common.py', target: 'file:utils/networking.py',      type: 'imports' } },
    { data: { id: 'edge:common:_utils:imports',        source: 'file:networking/common.py', target: 'file:utils/_utils.py',          type: 'imports' } },

    // Handler files import from common + _helper
    { data: { id: 'edge:_urllib:common:imports',       source: 'file:networking/_urllib.py',   target: 'file:networking/common.py',    type: 'imports' } },
    { data: { id: 'edge:_urllib:_helper:imports',      source: 'file:networking/_urllib.py',   target: 'file:networking/_helper.py',   type: 'imports' } },
    { data: { id: 'edge:_urllib:exceptions:imports',   source: 'file:networking/_urllib.py',   target: 'file:networking/exceptions.py', type: 'imports' } },
    { data: { id: 'edge:_requests:common:imports',     source: 'file:networking/_requests.py', target: 'file:networking/common.py',    type: 'imports' } },
    { data: { id: 'edge:_requests:_helper:imports',    source: 'file:networking/_requests.py', target: 'file:networking/_helper.py',   type: 'imports' } },
    { data: { id: 'edge:_curlcffi:common:imports',     source: 'file:networking/_curlcffi.py', target: 'file:networking/common.py',    type: 'imports' } },
    { data: { id: 'edge:_curlcffi:_helper:imports',    source: 'file:networking/_curlcffi.py', target: 'file:networking/_helper.py',   type: 'imports' } },
    { data: { id: 'edge:_curlcffi:impersonate:imports',source: 'file:networking/_curlcffi.py', target: 'file:networking/impersonate.py', type: 'imports' } },

    // _helper.py imports
    { data: { id: 'edge:_helper:exceptions:imports',   source: 'file:networking/_helper.py',   target: 'file:networking/exceptions.py', type: 'imports' } },

    // impersonate.py imports
    { data: { id: 'edge:impersonate:common:imports',   source: 'file:networking/impersonate.py', target: 'file:networking/common.py',  type: 'imports' } },

    // _utils.py is imported by almost everything (shown above). Additional importers:
    { data: { id: 'edge:cookies:_utils:imports',       source: 'file:cookies.py',       target: 'file:utils/_utils.py',          type: 'imports' } },
    { data: { id: 'edge:plugins:_utils:imports',       source: 'file:plugins.py',       target: 'file:utils/_utils.py',          type: 'imports' } },
    { data: { id: 'edge:aes:_utils:imports',           source: 'file:aes.py',           target: 'file:utils/_utils.py',          type: 'imports' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — inherits (subclass → superclass)
       type=inherits, bold solid arrow, color=#a78bfa, width=2
       ═══════════════════════════════════════════════════════════════════ */

    // Networking handler hierarchy
    { data: { id: 'edge:UrllibRH:RH:inherits',         source: 'class:UrllibRH',      target: 'class:RequestHandler',             type: 'inherits' } },
    { data: { id: 'edge:RequestsRH:RH:inherits',       source: 'class:RequestsRH',    target: 'class:RequestHandler',             type: 'inherits' } },
    { data: { id: 'edge:CurlCFFIRH:IReqH:inherits',    source: 'class:CurlCFFIRH',    target: 'class:ImpersonateRequestHandler',   type: 'inherits' } },
    { data: { id: 'edge:IReqH:RH:inherits',            source: 'class:ImpersonateRequestHandler', target: 'class:RequestHandler',     type: 'inherits' } },

    // Error hierarchy (networking)
    { data: { id: 'edge:ReqErr:YTDLerr:inherits',      source: 'class:RequestError',       target: 'class:YoutubeDLError',    type: 'inherits' } },
    { data: { id: 'edge:NoSupp:ReqErr:inherits',       source: 'class:NoSupportingHandlers', target: 'class:RequestError',     type: 'inherits' } },
    { data: { id: 'edge:TransErr:ReqErr:inherits',     source: 'class:TransportError',     target: 'class:RequestError',      type: 'inherits' } },
    { data: { id: 'edge:HTTPErr:ReqErr:inherits',      source: 'class:HTTPError',          target: 'class:RequestError',      type: 'inherits' } },

    // Error hierarchy (core utils)
    { data: { id: 'edge:ExtrErr:YTDLerr:inherits',     source: 'class:ExtractorError',     target: 'class:YoutubeDLError',    type: 'inherits' } },
    { data: { id: 'edge:DownErr:YTDLerr:inherits',     source: 'class:DownloadError',      target: 'class:YoutubeDLError',    type: 'inherits' } },
    { data: { id: 'edge:Cancel:YTDLerr:inherits',      source: 'class:DownloadCancelled',  target: 'class:YoutubeDLError',    type: 'inherits' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — calls (caller → callee)
       type=calls, dashed arrow, color=#94a3b8, width=1
       Best-effort from AST analysis + manual key call paths.
       ═══════════════════════════════════════════════════════════════════ */

    // Entry point chain: main → _real_main → parse_options → parseOpts
    { data: { id: 'edge:main:real_main:calls',        source: 'func:main',          target: 'func:_real_main',          type: 'calls' } },
    { data: { id: 'edge:real_main:parse_options:calls', source: 'func:_real_main',  target: 'func:parse_options',       type: 'calls' } },
    { data: { id: 'edge:parse_options:parseOpts:calls', source: 'func:parse_options', target: 'func:parseOpts',         type: 'calls' } },

    // Download pipeline: download → extract_info → process_video_result → process_info
    { data: { id: 'edge:download:extract_info:calls', source: 'func:download',     target: 'func:extract_info',         type: 'calls' } },
    { data: { id: 'edge:extract_info:process_vid:calls', source: 'func:extract_info', target: 'func:process_video_result', type: 'calls' } },
    { data: { id: 'edge:process_vid:process_info:calls', source: 'func:process_video_result', target: 'func:process_info', type: 'calls' } },

    // urlopen chain: urlopen → RequestDirector.send → RequestHandler.send
    { data: { id: 'edge:urlopen:RD_send:calls',       source: 'func:urlopen',      target: 'func:RD_send',             type: 'calls' } },
    { data: { id: 'edge:RD_send:RH_send:calls',       source: 'func:RD_send',      target: 'func:RH_send',             type: 'calls' } },
    { data: { id: 'edge:RD_send:RH_validate:calls',   source: 'func:RD_send',      target: 'func:RH_validate',         type: 'calls' } },

    // Setup chain
    { data: { id: 'edge:_real_main:load_plugins:calls', source: 'func:_real_main', target: 'func:load_all_plugins',    type: 'calls' } },
    { data: { id: 'edge:build_rd:RD_add:calls',       source: 'func:build_request_director', target: 'func:RD_add_handler', type: 'calls' } },
    { data: { id: 'edge:build_rd:register_rh:calls',  source: 'func:build_request_director', target: 'func:register_rh',  type: 'calls' } },

    // Cookie loading
    { data: { id: 'edge:extract_info:load_cookies:calls', source: 'func:extract_info', target: 'func:load_cookies',    type: 'calls' } },

    // SSL context
    { data: { id: 'edge:RH_send:make_ssl:calls',      source: 'func:RH_send',      target: 'func:make_ssl_context',    type: 'calls' } },

    // Utility calls
    { data: { id: 'edge:download:sanitize:calls',     source: 'func:download',     target: 'func:sanitize_filename',   type: 'calls' } },

    /* ═══════════════════════════════════════════════════════════════════
       EDGES — exports (__init__.py → re-exported target file)
       type=exports, dotted arrow, color=#22d3ee, width=1
       ═══════════════════════════════════════════════════════════════════ */

    // utils/__init__.py re-exports from _utils.py, traversal.py, networking.py

    // networking/__init__.py re-exports from common.py (Request, Response, RequestDirector, RequestHandler)
    { data: { id: 'edge:net_init:common:exports',     source: 'file:networking/common.py', target: 'file:networking/_urllib.py',  type: 'exports', symbol: 'lazy_import' } },
  ],

  meta: {
    nodeCount: 68,
    edgeCount: 107,
    fileCount: 20,
    classCount: 22,
    functionCount: 23,
    moduleCount: 3,
    modules: ['yt_dlp', 'utils', 'networking'],
    source: 'site-packages/yt_dlp/ core files (excludes extractor/downloader/postprocessor/compat/test)',
  }
};
