/**
 * Footer Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * Footer 位于 <main> 之外，因此挂载点是 <div class="footer"> 而非
 * <section id>。Vue 仅负责渲染静态模板，无交互逻辑。
 */
mountDocComponent({
    name: 'DocFooter',
    templateId: 'footer-template',
    dataKey: 'FOOTER_CONFIG',
    i18n: true
});
