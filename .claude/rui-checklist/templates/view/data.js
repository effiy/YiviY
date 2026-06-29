/**
 * VIEW_CHECKLIST_CONFIG
 *   constants: { viewTitle, generatedAt }
 *   sections:  [{ id, title, items: [{ id, title, status, category, evidence }] }]
 *
 * Designed for aggregating multiple reports (health + architecture + security).
 */
window.VIEW_CHECKLIST_CONFIG = {
    constants: {
        viewTitle:   '__VIEW_TITLE__',
        generatedAt: '__GENERATED_AT__'
    },
    i18n: false,
    sections: __SECTIONS_JSON__
};