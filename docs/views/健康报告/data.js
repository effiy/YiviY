/**
 * 代码健康报告 数据源
 * 7 维度静态分析 · 量化评分 · 根因诊断 · 治理路线图
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 */
window.HEALTH_REPORT_CONFIG = {
    constants: {
        meta: {
            fileCount: 63,
            loc: 6986,
            functions: 234,
            dimensions: 7,
            actions: 26,
            date: '2026-06-28'
        }
    },

    en: {
        cover: {
            tag: 'Technical Due Diligence',
            title: 'VideoLingo Code Health Report',
            subtitle: 'Multi-dimensional static analysis · Quantitative scoring · Root cause diagnosis · Governance roadmap',
            metaItems: [
                { num: '63', label: 'Python source files' },
                { num: '6,986', label: 'Total lines of code' },
                { num: '234', label: 'Functions/methods' },
                { num: '7', label: 'Evaluation dimensions' },
                { num: '26', label: 'Improvement actions' },
                { num: '2026-06-28', label: 'Assessment date' }
            ]
        },
        toc: {
            heading: 'Table of Contents',
            items: [
                { label: 'Overall Score: Seven-Dimension Dashboard', href: '#sec1' },
                { label: 'D1: File Size & Structure', href: '#sec2' },
                { label: 'D2: Code Duplication Rate', href: '#sec3' },
                { label: 'D3: Naming Semantics', href: '#sec4' },
                { label: 'D4: Nesting Depth & Cyclomatic Complexity', href: '#sec5' },
                { label: 'D5: Function Length & Responsibility', href: '#sec6' },
                { label: 'D6: Comments & Documentation', href: '#sec7' },
                { label: 'D7: Import Standards & Module Coupling', href: '#sec8' },
                { label: 'Root Cause Analysis: Problem Causal Chain', href: '#sec9' },
                { label: 'Improvement Plan & Implementation Schedule', href: '#sec10' },
                { label: 'Appendix: Toolchain Config & Baseline Snapshot', href: '#sec11' }
            ]
        },
        sec1: {
            heading: 'Overall Score: Seven-Dimension Dashboard',
            num: '1',
            score: {
                grade: 'C+',
                score: '58 / 100',
                description: 'Scoring model: 7 dimensions weighted sum. Grade mapping: A(85-100) B(70-84) C(50-69) D(30-49) F(0-29). Current grade <strong>C+</strong> indicates significant technical debt requiring planned governance.',
                metaItems: [
                    { val: 'F', valColor: '#f85149', lbl: 'Worst D7' },
                    { val: 'C', valColor: '#3fb950', lbl: 'Best D3' },
                    { val: '3', valColor: '#d29922', lbl: 'D-grade dims' },
                    { val: '56h', valColor: '#58a6ff', lbl: 'Est. governance hours' }
                ]
            },
            dimensionCards: [
                { name: 'D1 File Size', grade: 'D', score: '40', color: '#d29922' },
                { name: 'D2 Duplication', grade: 'D', score: '35', color: '#d29922' },
                { name: 'D3 Naming', grade: 'C', score: '55', color: '#3fb950' },
                { name: 'D4 Nesting', grade: 'D+', score: '42', color: '#d29922' },
                { name: 'D5 Func Length', grade: 'D', score: '38', color: '#d29922' },
                { name: 'D6 Comments', grade: 'D', score: '30', color: '#d29922' },
                { name: 'D7 Imports', grade: 'F', score: '15', color: '#f85149' }
            ],
            methodologyTitle: '1.2 Scoring Methodology',
            methodologyNote: 'D7 has the highest weight (18%) because star imports are a blocking risk preventing all static analysis tools from being introduced.',
            kpiTitle: '1.3 Key Risk Indicators (KPI)',
            radarTitle: 'Seven-Dimension Health Radar Chart',
            barTitle: 'Dimension Score Bar Chart',
            heatTitle: 'Risk Heat Distribution'
        },
        dimLabels: {
            d1: { name: 'File Size', score: '40/100 D', badgeStyle: 'badge-high' },
            d2: { name: 'Code Duplication', score: '35/100 D', badgeStyle: 'badge-high' },
            d3: { name: 'Naming Semantics', score: '55/100 C', badgeStyle: 'badge-medium' },
            d4: { name: 'Nesting Depth', score: '42/100 D+', badgeStyle: 'badge-high' },
            d5: { name: 'Function Length', score: '38/100 D', badgeStyle: 'badge-high' },
            d6: { name: 'Comments & Docs', score: '30/100 D', badgeStyle: 'badge-high' },
            d7: { name: 'Import Coupling', score: '15/100 F', badgeStyle: 'badge-critical' }
        },
        rootCause: {
            heading: 'Root Cause Analysis: Problem Causal Chain',
            num: '9',
            summaryTitle: 'Root Cause Summary'
        },
        improvement: {
            heading: 'Improvement Plan & Implementation Schedule',
            num: '10',
            priorityTitle: 'Priority Matrix (26 Actions)',
            ganttTitle: 'Gantt Chart Schedule',
            metricsTitle: 'Quantified Improvement Forecast',
            timelineTitle: 'Phase Details'
        },
        appendix: {
            heading: 'Appendix: Toolchain Config & Baseline Snapshot',
            num: '11',
            configTitle: 'Recommended pyproject.toml',
            baselineTitle: 'Baseline Snapshot (2026-06-28)',
            footer: 'VideoLingo Code Health Report v3.0 · 2026-06-28 · Scope: 63 Python source files · 7 Dimensions × 26 Sub-indicators · 26 Improvement Actions · 4 Phases × 56h Governance Roadmap · Methodology: AST Traversal + Pattern Matching + Dependency Graph Analysis + Manual Semantic Review'
        }
    },

    'zh-CN': {
        cover: {
            tag: 'Technical Due Diligence',
            title: 'VideoLingo 代码健康报告',
            subtitle: '多维度静态分析 · 量化评分 · 根因诊断 · 治理路线图',
            metaItems: [
                { num: '63', label: 'Python 源文件' },
                { num: '6,986', label: '总代码行' },
                { num: '234', label: '函数/方法' },
                { num: '7', label: '评估维度' },
                { num: '26', label: '改进行动项' },
                { num: '2026-06-28', label: '评估日期' }
            ]
        },
        toc: {
            heading: '目录',
            items: [
                { label: '综合评分：七维评估仪表盘', href: '#sec1' },
                { label: '维度 D1：文件规模与结构', href: '#sec2' },
                { label: '维度 D2：代码重复率', href: '#sec3' },
                { label: '维度 D3：命名语义化', href: '#sec4' },
                { label: '维度 D4：嵌套深度与圈复杂度', href: '#sec5' },
                { label: '维度 D5：函数长度与职责', href: '#sec6' },
                { label: '维度 D6：注释与文档化', href: '#sec7' },
                { label: '维度 D7：导入规范与模块耦合', href: '#sec8' },
                { label: '根因分析：问题因果链', href: '#sec9' },
                { label: '改进方案与落地排期', href: '#sec10' },
                { label: '附录：工具链配置与基线快照', href: '#sec11' }
            ]
        },
        sec1: {
            heading: '综合评分：七维评估仪表盘',
            num: '1',
            score: {
                grade: 'C+',
                score: '58 / 100',
                description: '评分模型：7 个维度加权求和。等级映射：A(85-100) B(70-84) C(50-69) D(30-49) F(0-29)。当前等级 <strong>C+</strong> 表示存在明显技术债务，需计划性治理。',
                metaItems: [
                    { val: 'F', valColor: '#f85149', lbl: '最差维度 D7' },
                    { val: 'C', valColor: '#3fb950', lbl: '最佳维度 D3' },
                    { val: '3', valColor: '#d29922', lbl: 'D 级维度' },
                    { val: '56h', valColor: '#58a6ff', lbl: '治理工时估算' }
                ]
            },
            dimensionCards: [
                { name: 'D1 文件规模', grade: 'D', score: '40', color: '#d29922' },
                { name: 'D2 代码重复', grade: 'D', score: '35', color: '#d29922' },
                { name: 'D3 命名语义化', grade: 'C', score: '55', color: '#3fb950' },
                { name: 'D4 嵌套深度', grade: 'D+', score: '42', color: '#d29922' },
                { name: 'D5 函数长度', grade: 'D', score: '38', color: '#d29922' },
                { name: 'D6 注释文档', grade: 'D', score: '30', color: '#d29922' },
                { name: 'D7 导入耦合', grade: 'F', score: '15', color: '#f85149' }
            ],
            methodologyTitle: '1.2 评分方法论',
            methodologyNote: 'D7 权重最高 (18%)，因为 star import 是阻止所有静态分析工具引入的阻塞性风险。',
            kpiTitle: '1.3 关键风险指标 (KPI)',
            radarTitle: '七维健康雷达图',
            barTitle: '各维度评分柱状图',
            heatTitle: '风险热力分布'
        },
        dimLabels: {
            d1: { name: '文件规模与结构', score: '40/100 D', badgeStyle: 'badge-high' },
            d2: { name: '代码重复率', score: '35/100 D', badgeStyle: 'badge-high' },
            d3: { name: '命名语义化', score: '55/100 C', badgeStyle: 'badge-medium' },
            d4: { name: '嵌套深度与圈复杂度', score: '42/100 D+', badgeStyle: 'badge-high' },
            d5: { name: '函数长度与职责', score: '38/100 D', badgeStyle: 'badge-high' },
            d6: { name: '注释与文档化', score: '30/100 D', badgeStyle: 'badge-high' },
            d7: { name: '导入规范与模块耦合', score: '15/100 F', badgeStyle: 'badge-critical' }
        },
        rootCause: {
            heading: '根因分析：问题因果链',
            num: '9',
            summaryTitle: '根因总结'
        },
        improvement: {
            heading: '改进方案与落地排期',
            num: '10',
            priorityTitle: '优先级矩阵 (26 项行动)',
            ganttTitle: '排期甘特图',
            metricsTitle: '预期效果量化',
            timelineTitle: '分阶段详情'
        },
        appendix: {
            heading: '附录：工具链配置与基线快照',
            num: '11',
            configTitle: '推荐 pyproject.toml',
            baselineTitle: '基线快照 (2026-06-28)',
            footer: 'VideoLingo 代码健康报告 v3.0 · 2026-06-28 · 评估范围：63 个 Python 源文件 · 7 维度 × 26 子指标 · 26 项改进行动 · 4 阶段 × 56h 治理路线图 · 方法论：AST 遍历 + 模式匹配 + 依赖图分析 + 人工语义审查'
        }
    }
};
