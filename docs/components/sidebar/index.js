/**
 * Sidebar Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 *
 * 语言感知：
 *   - 通过 mountDocComponent 的 i18n:true 选项启用透明语言切换
 *   - groups 字段来自各语言 slice（en / zh-CN / ...），logo / langs /
 *     footerLinks 来自 constants，自动合并到 Vue 实例
 *   - 切换语言时由 wrapI18n 替换响应式属性，无需手动监听 vl-lang-changed
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
    i18n: true,
    extra: {
        data: function () {
            return {
                /* 组件私有状态：侧栏展开状态（与 i18n 数据无关） */
                isOpen: false
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
        }
    }
});