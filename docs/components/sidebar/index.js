/**
 * Sidebar Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 *
 * 语言感知：
 *   - 当前语言从全局 VL_LANG.current 读取
 *   - 语言切换通过 VL_LANG.setLanguage() 派发 vl-lang-changed 事件
 *   - 监听该事件以同步更新 sidebar 自身（导航标签更新）
 *
 * 状态收敛：
 *   - 侧栏展开/收起 (.open) 完全由 Vue 的 isOpen 控制
 *   - 移动端点击外部关闭的逻辑也由 Vue mounted() 钩子内部监听 document.click
 *     完成，main.js 不再直接操作 #sidebar DOM。
 */

function resolveSidebarGroups(cfg, lang) {
    var groupsMap = cfg.groups || {};
    return groupsMap[lang] || groupsMap['en'] || [];
}

mountDocComponent({
    name: 'DocSidebar',
    templateId: 'sidebar-template',
    dataKey: 'SIDEBAR_CONFIG',
    extra: {
        data: function () {
            var cfg = window.SIDEBAR_CONFIG || {};
            var currentLang = (window.VL_LANG && window.VL_LANG.current) || 'en';
            return {
                isOpen: false,
                logo: cfg.logo || {},
                currentLang: currentLang,
                langs: cfg.langs || [],
                groups: resolveSidebarGroups(cfg, currentLang),
                footerLinks: cfg.footerLinks || []
            };
        },
        methods: {
            toggleMobileMenu: function () {
                this.isOpen = !this.isOpen;
            },
            setLanguage: function (code) {
                if (window.VL_LANG) {
                    window.VL_LANG.setLanguage(code);
                }
            }
        },
        mounted: function () {
            var self = this;

            /* 移动端点击外部关闭侧栏 */
            document.addEventListener('click', function (e) {
                if (!self.isOpen) return;
                var sidebar = self.$refs.sidebarRef;
                var mobileBtn = document.getElementById('mobile-menu-btn');
                if (!sidebar) return;
                if (!sidebar.contains(e.target) &&
                    e.target !== mobileBtn &&
                    !(mobileBtn && mobileBtn.contains(e.target))) {
                    self.isOpen = false;
                }
            });

            /* 全局语言变更 → 更新导航标签 */
            document.addEventListener('vl-lang-changed', function (e) {
                self.currentLang = e.detail.lang;
                var cfg = window.SIDEBAR_CONFIG || {};
                self.groups = resolveSidebarGroups(cfg, e.detail.lang);
            });
        }
    }
});
