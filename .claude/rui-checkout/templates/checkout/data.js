/**
 * CHECKOUT_CONFIG
 *   actions:     aggregated action items from health + architecture reports
 *   healthScore: { current, target }
 *   archScore:   { current, target }
 *
 * Each action:
 *   id          - stable identifier (e.g., "A7.1", "ARCH-3")
 *   title       - one-line action description
 *   priority    - P0 | P1 | P2 | P3
 *   source      - health | architecture
 *   phase       - free-form phase label (e.g., "Phase 1", "Week 2")
 *   before      - baseline metric description
 *   after       - expected post-action metric
 *   steps       - ordered list of verifiable sub-steps
 *   status      - default status: todo | in_progress | done | blocked
 *   critical    - boolean (part of critical path)
 */
window.CHECKOUT_CONFIG = {
    constants: {
        generatedAt: '__GENERATED_AT__',
        healthReportSource:  '__HEALTH_REPORT_PATH__',
        archReportSource:    '__ARCH_REPORT_PATH__'
    },
    healthScore: __HEALTH_SCORE_JSON__,
    archScore:   __ARCH_SCORE_JSON__,
    actions:     __ACTIONS_JSON__
};