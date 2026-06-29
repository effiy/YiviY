/**
 * __CARD_NAME__ · Comparison Showcase Demo (Type C)
 *
 * 通过共享 helper `assets/demo-mount.js` 启动；
 * 无需 beforeUnmount：未持有任何 Timer/Chart/订阅资源。
 */
mountDemoApp({
    data: function () {
        var mock = window.DEMO_MOCK_DATA || {};
        return {
            variants:        mock.variants || [],
            selectedVariant: 0
        };
    },
    computed: {
        currentVariant: function () {
            return this.variants[this.selectedVariant] || null;
        }
    }
});