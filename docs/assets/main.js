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
 */

(function () {
    'use strict';

    includeHTML().then(function () {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link');

        // Highlight active nav link on scroll
        function updateActiveLink() {
            var current = '';
            sections.forEach(function (section) {
                var top = section.offsetTop - 100;
                if (window.scrollY >= top) current = section.id;
            });
            navLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        }
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();

        // Smooth scroll for nav links
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    });
})();