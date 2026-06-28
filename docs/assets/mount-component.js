/**
 * VideoLingo Docs — 公共 Vue 3 挂载工具
 * ----------------------------------------------------------------------
 * 每个 section 组件的 index.js 只需要传入 3 个参数即可挂载：
 *   - name:       组件显示名（如 'DocIntro'，作为 Vue devtools 标识与日志前缀）
 *   - templateId: 模板 <template id="..."> 的 DOM id（如 'intro-template'）
 *   - dataKey:    data.js 注入到 window 上的数据对象名（如 'INTRO_CONFIG'）
 *
 * 选填 extra：需要自定义 methods / mounted / data 等时，覆盖默认组件选项。
 *
 * 启动流程：
 *   1. 推导 SELF_DIR：优先读 document.currentScript 的 data-cs-dir
 *      （由 assets/include.js 在内联注入时写入），回退到 script.src。
 *   2. 若 SELF_DIR 下存在 index.css，自动 <link rel="stylesheet"> 幂等注入，
 *      实现「组件专属 CSS 随挂载自动加载」（替代 docs/index.html 显式 <link>）。
 *   3. 在 <template> 之前插入一个通用的 <div> 作为真实挂载目标
 *   4. createApp(...).mount(div) 由 Vue 把模板根渲染为该 div 的唯一子节点
 *
 * 注意：不要把 <template> 的内容节点直接克隆作为 mountEl，否则 Vue 渲染后
 * 会产生嵌套重复（例如外层 mountEl 与渲染根都是 <section id="intro">）。
 */

function mountDocComponent(opts) {
    'use strict';

    if (typeof Vue === 'undefined') {
        console.error('[' + opts.name + '] Vue is not loaded.');
        return;
    }

    var tpl = document.getElementById(opts.templateId);
    if (!tpl) {
        console.error('[' + opts.name + '] Template #' + opts.templateId + ' not found.');
        return;
    }

    // 模板根节点必须存在，否则说明组件模板写错了
    if (!tpl.content || !tpl.content.firstElementChild) {
        console.error('[' + opts.name + '] Template content is empty.');
        return;
    }

    /* ── 自动注入组件同目录的 index.css（幂等） ─────────────── */
    injectComponentStylesheet();

    // 用一个通用 <div> 作为挂载点，避免与模板根元素标签相同造成嵌套重复
    var mountEl = document.createElement('div');
    tpl.parentNode.insertBefore(mountEl, tpl);

    var Component = Object.assign({
        name: opts.name,
        template: '#' + opts.templateId,
        data: function () {
            return window[opts.dataKey] || {};
        }
    }, opts.extra || {});

    Vue.createApp(Component).mount(mountEl);
}

/**
 * 推导当前组件脚本所在目录 (SELF_DIR)，并在 <head> 中幂等注入同目录的
 * index.css（仅当该组件确实拥有同目录样式表时）。
 *
 * SELF_DIR 来源优先级：
 *   1. document.currentScript.dataset.csDir / getAttribute('data-cs-dir')
 *      （由 include.js 内联注入时写入，覆盖 docs/index.html 加载场景）
 *   2. document.currentScript.src 的 dirname
 *      （直接 <script src="...index.js"> 加载场景，如本地调试）
 *
 * 幂等策略：选择器 link[rel="stylesheet"][href="..."] 已存在即跳过，
 * 多次挂载同一组件不会重复插入。
 *
 * 存在性策略：通过静态白名单 `_COMPONENTS_WITH_CSS` 判定；只有当组件
 * 实际携带 index.css 时才注入 <link>。**绝不能**用 fetch HEAD 反查
 * —— 即便后续移除 link，浏览器仍会把 404 写进 Network/Console，
 * 沦为无法消除的噪声。新增「自带样式表」的组件时，在下方白名单追加
 * 组件目录名即可（保持与 docs/components/<name>/index.css 一一对应）。
 */
var _COMPONENTS_WITH_CSS = {
    'sidebar':       true,
    'intro':         true,
    'quick-start':   true,
    'workflow':      true,
    'translations':  true,
    'code-activity': true,
    'footer':        true
};

function injectComponentStylesheet() {
    var script = document.currentScript;
    if (!script) return;

    var scriptDir = '';
    if (typeof script.getAttribute === 'function') {
        scriptDir = script.getAttribute('data-cs-dir') || '';
    }
    if (!scriptDir && script.src) {
        scriptDir = script.src.substring(0, script.src.lastIndexOf('/') + 1);
    }
    if (!scriptDir) return;

    /* 通过白名单判定组件是否带 CSS（避免盲探产生 404 噪声） */
    var segs = scriptDir.split('/');
    var compName = '';
    for (var i = segs.length - 2; i >= 0; i--) {
        if (segs[i] === 'components' || segs[i] === 'cdn') {
            compName = segs[i + 1] || '';
            break;
        }
    }
    if (!compName || !_COMPONENTS_WITH_CSS[compName]) return;

    var cssPath = scriptDir + 'index.css';
    var already = document.querySelector('link[rel="stylesheet"][href="' + cssPath + '"]');
    if (already) return;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
}