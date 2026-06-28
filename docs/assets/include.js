function includeHTML() {
    var promises = [];
    var elements = document.querySelectorAll('[data-include]');
    elements.forEach(function (el) {
        var file = el.getAttribute('data-include');
        if (!file) return;
        // 解析被 include 文件的目录，作为其内部 <script src="..."> 等相对路径的基准
        var includeURL = new URL(file, window.location.href);
        var includeDir = includeURL.href.substring(0, includeURL.href.lastIndexOf('/') + 1);
        var p = fetch(file)
            .then(function (resp) {
                if (!resp.ok) throw new Error('Failed to load ' + file);
                return resp.text();
            })
            .then(function (html) {
                el.innerHTML = html;
                // 把包含的脚本逐个加载并按 DOM 顺序执行，避免经典脚本并发下载
                // 时较小的 index.js 先就绪先跑、超过 data.js 的顺序保证。
                return loadIncludedScriptsSequentially(el, includeDir);
            })
            .catch(function (err) {
                el.innerHTML = '<p style="color:red">Error loading ' + file + ': ' + err.message + '</p>';
            });
        promises.push(p);
    });
    return Promise.all(promises);
}

/**
 * 顺序执行被 include 的 HTML 片段里所有 <script>。
 *
 * 关键不变量：严格按 DOM 顺序执行 —— data.js 一定先于 index.js，
 * 这样 Vue 在 mount 时 window.xxx_CONFIG 必定已就绪，渲染期访问
 * data 字段（如 available[*].emoji、langContent.hero.title）不会再
 * 触发 TypeError。
 *
 * 实现说明：
 *  - 对外部脚本（src）改用 fetch + 内联注入，确保上一个脚本
 *    真正「加载 + 执行完毕」后，再加载下一个；
 *  - 对内联脚本保持直接注入，由浏览器按顺序同步执行。
 */
function loadIncludedScriptsSequentially(container, baseDir) {
    var oldScripts = Array.from(container.querySelectorAll('script'));
    return oldScripts.reduce(function (chain, oldScript) {
        return chain.then(function () {
            var newScript = document.createElement('script');
            var srcAttr = oldScript.getAttribute('src');
            if (srcAttr) {
                var absSrc = new URL(srcAttr, baseDir).href;
                return fetch(absSrc)
                    .then(function (resp) {
                        if (!resp.ok) throw new Error('Failed to load ' + absSrc);
                        return resp.text();
                    })
                    .then(function (code) {
                        // 内联注入，浏览器同步执行，与下一个脚本串行
                        newScript.textContent = code;
                        /* 把 include 文件所在目录写到 script 节点上,
                           供 index.js 内 mountDocComponent 推导自己的
                           SELF_DIR (用于自动注入 index.css 等同目录资源)。
                           见 docs/assets/mount-component.js。 */
                        newScript.setAttribute('data-cs-dir', baseDir);
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
            }
            // 内联脚本：浏览器在插入 DOM 时同步执行
            newScript.textContent = oldScript.textContent || '';
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }, Promise.resolve());
}
