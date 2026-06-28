/**
 * Sidebar Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 *
 * 状态收敛：
 *   - 侧栏展开/收起 (.open) 完全由 Vue 的 isOpen 控制
 *   - 移动端点击外部关闭的逻辑也由 Vue mounted() 钩子内部监听 document.click
 *     完成，main.js 不再直接操作 #sidebar DOM。
 */
mountDocComponent({
    name: 'DocSidebar',
    templateId: 'sidebar-template',
    dataKey: 'SIDEBAR_CONFIG',
    extra: {
        data: function () {
            var cfg = window.SIDEBAR_CONFIG || {};
            return {
                isOpen: false,
                logo: cfg.logo || {},
                groups: cfg.groups || [],
                footerLinks: cfg.footerLinks || []
            };
        },
        methods: {
            toggleMobileMenu: function () {
                this.isOpen = !this.isOpen;
            }
        },
        mounted: function () {
            var self = this;
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
        }
    }
});