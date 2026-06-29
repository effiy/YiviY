/**
 * __CARD_NAME__ Demo — Data
 *
 * Card data: YrySceneCard props for the scene card at the top of the page.
 * Mock data: Simulated data for demo interactivity (never real API calls).
 */
window.DEMO_CARD_DATA = __CARD_DATA_JSON__;

window.DEMO_MOCK_DATA = __MOCK_DATA_JSON__;

/* ── Metadata (for tooling, not rendered) ────── */
if (!window.DEMO_MOCK_DATA._meta) {
    window.DEMO_MOCK_DATA._meta = {};
}
Object.assign(window.DEMO_MOCK_DATA._meta, {
    demoSlug: '__DEMO_SLUG__',
    demoType: '__DEMO_TYPE__',
    sceneName: '__SCENE_NAME__',
    generatedAt: '__GENERATED_AT__'
});
