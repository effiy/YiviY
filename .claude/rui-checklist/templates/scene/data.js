/**
 * CHECKLIST_CONFIG
 *   constants: scene-level metadata (sceneName, generatedAt, totals)
 *   cards:     per-card checklist entries (each with checks[])
 *
 * Each check has:
 *   id        - stable identifier
 *   category  - structural | tag-quality | link-hygiene | standard | human
 *   label     - human-readable description
 *   status    - pass | fail | warn | pending
 *   evidence  - one-line evidence string
 */
window.CHECKLIST_CONFIG = {
    constants: {
        sceneName:   '__SCENE_NAME__',
        scenePath:   '__SCENE_PATH__',
        sourceFile:  'data.js',
        language:    'en',
        generatedAt: '__GENERATED_AT__',
        totalCards:  __TOTAL_CARDS__,
        summary:     __SUMMARY_JSON__
    },
    cards: __CARDS_JSON__
};