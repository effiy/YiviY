/**
 * Docs 主页面交互逻辑
 * ----------------------------------------------------------------------
 * 依赖：
 *   - assets/include.js           (提供 includeHTML())
 *   - assets/mount-component.js   (Vue 组件挂载工具，由各组件 index.js 调用)
 *   - components/sidebar          (注入 #sidebar / #mobile-menu-btn / .nav-link)
 *                                 侧栏展开/收起与点击外部关闭均由 Vue 内部完成
 *   - 各 section 组件             (注入 <section id="..."> 节点)
 *
 * 启动流程：
 *   1. includeHTML() 拉取所有 data-include 占位并执行其脚本
 *   2. 等所有 Promise resolve 后再绑定 scroll spy / 平滑滚动
 *
 * 语言切换容错：
 *   - 侧栏导航链接在语言切换时由 Vue 重建，因此 scroll spy
 *     每次查询 .nav-link（而非缓存），点击使用事件委托。
 */

(function () {
    'use strict';

    includeHTML().then(function () {

        /* ── Scroll Spy ──────────────────────────────────
           每次滚动事件重新查询 section[id] 与 .nav-link，
           以兼容 Vue 组件异步挂载与语言切换导致的 DOM 变化。  */

        function updateActiveLink() {
            var current = '';
            var sections = document.querySelectorAll('section[id]');
            sections.forEach(function (section) {
                var top = section.offsetTop - 100;
                if (window.scrollY >= top) current = section.id;
            });

            /* 页面底部容错：若已滚动到接近页面底部，且最后一个 section
               未被阈值捕获（页面不够长，scrollIntoView 无法将其顶部
               推到视口上方），强制使用最后一个 section */
            var atBottom = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 10;
            if (atBottom && sections.length) {
                current = sections[sections.length - 1].id;
            }

            var navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        }
        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();

        /* ── Smooth Scroll ──────────────────────────────
           使用事件委托：绑定在侧栏容器上，点击 .nav-link
           时拦截并平滑滚动。语言切换后 Vue 重建 DOM 节点，
           委托模式不受影响。

           点击时立即更新 active 状态，避免依赖 scroll 事件
          （smooth-scroll 到页面底部的 section 时可能不触发
           足够多的 scroll 事件导致高亮丢失）。               */

        var sidebar = document.getElementById('sidebar-root');
        if (sidebar) {
            sidebar.addEventListener('click', function (e) {
                var link = e.target.closest('.nav-link');
                if (!link) return;
                e.preventDefault();
                var target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    /* 立即高亮被点击的链接，消除 scroll 事件延迟/丢失 */
                    var clickedHref = link.getAttribute('href');
                    var allLinks = document.querySelectorAll('.nav-link');
                    allLinks.forEach(function (l) {
                        l.classList.toggle('active', l.getAttribute('href') === clickedHref);
                    });
                }
            });
        }

        /* 语言切换后触发一次 scroll spy 刷新 */
        document.addEventListener('vl-lang-changed', function () {
            updateActiveLink();
        });
    });
})();
