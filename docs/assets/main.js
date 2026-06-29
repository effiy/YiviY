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
        var sections = document.querySelectorAll('section[id]');

        /* ── Scroll Spy ──────────────────────────────────
           每次滚动事件重新查询 .nav-link，以兼容 Vue 语言
           切换时重建 DOM 节点的情况。                         */

        function updateActiveLink() {
            var current = '';
            sections.forEach(function (section) {
                var top = section.offsetTop - 100;
                if (window.scrollY >= top) current = section.id;
            });
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
           委托模式不受影响。                                 */

        var sidebar = document.getElementById('sidebar-root');
        if (sidebar) {
            sidebar.addEventListener('click', function (e) {
                var link = e.target.closest('.nav-link');
                if (!link) return;
                e.preventDefault();
                var target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        }

        /* 语言切换后触发一次 scroll spy 刷新 */
        document.addEventListener('vl-lang-changed', function () {
            updateActiveLink();
        });
    });
})();
