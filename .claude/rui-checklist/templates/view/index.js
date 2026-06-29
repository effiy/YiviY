/**
 * rui-checklist · View-Level Checklist
 * 用于聚合多份报告（健康 / 架构 / 安全等）的章节化清单。
 */
(function mountViewChecklist() {
    if (!window.Vue) { return; }
    var cfg = window.VIEW_CHECKLIST_CONFIG || { constants: {}, sections: [] };

    var app = Vue.createApp({
        data: function () { return {
            viewTitle:    cfg.constants.viewTitle    || '',
            generatedAt:  cfg.constants.generatedAt  || '',
            sections:     cfg.sections               || [],
            checked:      {}
        }; },
        computed: {
            totalSections: function () { return this.sections.length; },
            totalItems:    function () {
                var n = 0;
                this.sections.forEach(function (s) { n += s.items.length; });
                return n;
            }
        },
        methods: {
            toggle: function (id, value) { this.checked[id] = value; },
            statusIcon: function (status) {
                return { pass: '✓', fail: '✗', warn: '⚠', pending: '○' }[status] || '?';
            }
        },
        beforeUnmount: function () { this.checked = {}; }
    });

    if (window.mountDocComponent) {
        window.mountDocComponent({
            name:       'view-checklist',
            templateId: 'view-checklist-template',
            dataKey:    'VIEW_CHECKLIST_CONFIG',
            i18n:       !!cfg.i18n,
            extra:      app
        });
    } else {
        app.mount('#view-checklist');
    }
})();