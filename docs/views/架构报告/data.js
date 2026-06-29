/**
 * 架构分析报告 数据源
 * ATAM 方法 · 8 维度加权评分 · 10 行动项 · 5 周落地排期
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 */
window.ARCH_REPORT_CONFIG = {
    constants: {
        meta: {
            date: '2026-06-28',
            version: 'v3.0.0 → v3.1.0',
            method: 'ATAM 方法',
            scope: '10 行动项 · 5 周落地'
        }
    },

    en: {
        header: {
            title: 'VideoLingo Architecture Analysis Report',
            subtitle: 'Scoring → Analysis → Visualization · Evolvability-oriented full-stack architecture audit',
            metaItems: [
                { label: '2026-06-28', emoji: '' },
                { label: 'v3.0.0 → v3.1.0', emoji: '' },
                { label: 'ATAM Method', emoji: '' },
                { label: '10 Actions · 5 Week Plan', emoji: '' }
            ]
        },
        toc: {
            heading: 'Table of Contents',
            items: [
                { label: 'Comprehensive Scorecard', href: '#s1' },
                { label: 'KPI Dashboard', href: '#s2' },
                { label: 'Background & Assessment Goals', href: '#s3' },
                { label: 'Architecture Status Overview', href: '#s4' },
                { label: 'Layered Architecture Deep Analysis', href: '#s5' },
                { label: 'Data Flow & Pipeline', href: '#s6' },
                { label: 'Service Backend Pluggability', href: '#s7' },
                { label: 'Config · i18n · Documentation Site', href: '#s8' },
                { label: 'Root Cause Analysis', href: '#s9' },
                { label: 'Improvement Plan', href: '#s10' },
                { label: 'Architecture Comparison Diagrams', href: '#s11' },
                { label: 'Action Items & Schedule', href: '#s12' }
            ]
        },
        s1: {
            heading: 'Comprehensive Scorecard',
            description: 'Based on an <strong>8-dimension weighted scoring system</strong>, weights reflect each dimension\'s impact on long-term project evolution. Current composite score <strong style="color:#dc2626;">5.6 / 10</strong>, target <strong style="color:#059669;">7.9 / 10</strong>, gap <strong>-2.3</strong>.',
            dimensions: [
                { label: 'Layered Compliance', score: '8.0', width: '80%', cls: 'sb--a' },
                { label: 'Module Cohesion', score: '7.0', width: '70%', cls: 'sb--b' },
                { label: 'Extensibility', score: '5.0', width: '50%', cls: 'sb--d' },
                { label: 'Robustness', score: '7.0', width: '70%', cls: 'sb--b' },
                { label: 'Testability', score: '2.0', width: '20%', cls: 'sb--d' },
                { label: 'Performance', score: '6.0', width: '60%', cls: 'sb--c' },
                { label: 'Maintainability', score: '6.0', width: '60%', cls: 'sb--c' },
                { label: 'Security', score: '4.0', width: '40%', cls: 'sb--d' }
            ],
            gauges: [
                { label: 'Testability', val: '2.0', cls: 'gr--bad', note: 'Biggest gap · -5 pts' },
                { label: 'Extensibility', val: '5.0', cls: 'gr--bad', note: '2nd biggest · -3 pts' },
                { label: 'Security', val: '4.0', cls: 'gr--bad', note: '3rd biggest · -3 pts' },
                { label: 'Weighted Score', val: '5.6', cls: 'gr--warn', note: 'Medium risk · -2.3 from target' }
            ]
        },
        s2: {
            heading: 'KPI Dashboard',
            description: 'The following 20 quantifiable metrics cover four key areas: extensibility, testing, performance, and security — serving as baselines for measuring improvement effectiveness.',
            gauges: [
                { val: '4', cls: 'gr--bad', label: 'Files to add TTS', note: 'Target ≤1 · P1' },
                { val: '2-N', cls: 'gr--bad', label: 'Files to add pipeline step', note: 'Target ≤1 · P2' },
                { val: 'No', cls: 'gr--bad', label: 'TTS Registry Pattern', note: 'Target Yes · P1' },
                { val: '2 vs 4', cls: 'gr--warn', label: 'TTS Signature Consistency', note: 'Target Unified · P1' },
                { val: '0', cls: 'gr--bad', label: 'Unit Test Files', note: 'Target ≥5 · P1' },
                { val: '0', cls: 'gr--bad', label: 'Integration Test Files', note: 'Target ≥2 · P2' },
                { val: '0%', cls: 'gr--bad', label: 'Core Module Coverage', note: 'Target ≥60% · P1' },
                { val: 'None', cls: 'gr--bad', label: 'CI/CD Pipeline', note: 'Target Yes · P2' },
                { val: '0%', cls: 'gr--bad', label: 'load_key Cache Hit Rate', note: 'Target ≥90% · P0' },
                { val: 'None', cls: 'gr--bad', label: 't() Translation Cache', note: 'Target Yes · P0' },
                { val: 'Serial', cls: 'gr--bad', label: 'Batch Task Parallelism', note: 'Target ≥4 · P2' },
                { val: 'Yes', cls: 'gr--good', label: 'LLM Response Cache', note: 'Implemented' },
                { val: 'Plaintext YAML', cls: 'gr--bad', label: 'API Key Storage', note: 'Target env var · P0' },
                { val: 'None', cls: 'gr--bad', label: 'Env Var Fallback', note: 'Target Yes · P0' },
                { val: 'None', cls: 'gr--bad', label: 'Streamlit Auth', note: 'Target Basic · P2' },
                { val: 'Yes', cls: 'gr--good', label: '.gitignore Coverage', note: 'Implemented' }
            ]
        },
        s3: {
            heading: 'Background & Assessment Goals',
            introTitle: '3.1 Project Overview',
            introText: 'VideoLingo is an open-source <strong>video translation & dubbing automation tool</strong> (Apache-2.0), initiated by <code>Huanshere</code>, now at v3.0.0. Core capability: transcribe any language video to text, translate to target language, and generate target language dubbing — covering the complete 15-step pipeline from YouTube download to final dubbed video output. Tech stack centered on Python, Streamlit UI, WhisperX ASR, 8 TTS backends, unified LLM access via OpenAI SDK.',
            triggerTitle: '3.2 Audit Triggers',
            goalsTitle: '3.3 Strategic Goals'
        },
        s4: {
            heading: 'Architecture Status Overview',
            scaleTitle: '4.1 Project Scale',
            styleTitle: '4.2 Architecture Style Assessment',
            styleText: 'VideoLingo is a <strong>pipeline-filter + layered architecture</strong> hybrid: 15-step serial data flow passes state through file system intermediate artifacts; presentation/application/domain/infrastructure/backend five layers with top-down one-way dependencies.',
            stackTitle: '4.3 Tech Stack Matrix'
        },
        s5: {
            heading: 'Layered Architecture Deep Analysis',
            archTitle: '5.1 Complete Five-Layer Architecture',
            complianceTitle: '5.2 Layer Compliance Check',
            couplingTitle: '5.3 Module Coupling Heatmap'
        },
        s6: {
            heading: 'Data Flow & Pipeline Analysis',
            pipelineTitle: '6.1 Complete Pipeline Data Flow',
            qualityTitle: '6.2 Pipeline Quality Assessment',
            cards: {
                good1: { title: 'Excellent: Checkpoint Resume — @check_file_exists decorator implements idempotency', desc: 'Each pipeline step writes output to file before exit; next run the decorator auto-skips completed steps. If LLM API fails mid-way, fix and rerun with zero waste. <strong>Only 10 lines of code, significant effect.</strong>' },
                good2: { title: 'Excellent: LLM Response Cache — Prompt-level dedup saves cost', desc: '<code>ask_gpt.py</code> persists every LLM call prompt+response to <code>output/gpt_log/{title}.json</code>. Debug and rerun hits cache directly, also facilitates LLM output quality review. Uses <code>json_repair</code> library to fix malformed JSON, improving parse success rate.' },
                good3: { title: 'Excellent: Two-Stage Translation Pipeline — Faithfulness → Expressiveness', desc: 'Translation does not use single "translate+polish" prompt, but splits into two stages: stage one strictly faithful to source (<code>get_prompt_faithfulness</code>), stage two optimizes naturalness on top of faithful translation (<code>get_prompt_expressiveness</code>). Staged strategy produces higher quality than single-pass prompting.' },
                bad1: { title: 'Defect: Global output/ Singleton — Multi-task mutual exclusion', desc: '<code>models.py</code> defines hardcoded path constants (<code>_4_2_TRANSLATION = "output/log/translation_results.xlsx"</code>), all 15 steps share the same directory. Consequences: two tasks cannot run concurrently (latter overwrites former intermediate files); testing requires mocking entire filesystem; module signatures do not declare data dependencies.' },
                bad2: { title: 'Defect: Numeric-Prefix Module Naming — Impedes pipeline evolution', desc: 'Names like <code>_3_1_split_nlp.py</code>, <code>_8_2_dub_chunks.py</code> encode pipeline order, but inserting a new step requires renaming all subsequent files (e.g., insert after step 4 → rename <code>_5</code> through <code>_12</code>), and numbers do not convey module responsibilities.' }
            }
        },
        s7: {
            heading: 'Service Backend Pluggability Analysis',
            ttsTitle: '7.1 TTS Backend Panorama',
            goodCard: { title: 'Excellent: TTS Three-Tier Fallback Chain — Fail→Retry→GPT Fix→Retry→Silence Placeholder', desc: '<code>tts_main.py</code> implements complete failure handling: first 2 retries directly on TTS, 3rd attempt calls GPT to fix text (removing TTS-unfriendly characters like &reg;&trade;&copy;) then retries, if all fail generates 100ms silence audio placeholder. <strong>Pipeline does not abort due to single audio generation failure.</strong>' },
            badCard: { title: 'Defect: if-elif Dispatch + Inconsistent Signatures → Violates Open-Closed Principle', desc: 'Adding a new TTS backend requires modifying <strong>4 files</strong>: new TTS file + tts_main.py (if-elif) + config.yaml (config section) + sidebar_setting.py (UI options). Some backend function signatures have 2 params, some have 4. Should use registry pattern with unified interface.' }
        },
        s8: {
            heading: 'Config · i18n · Documentation Site',
            configTitle: '8.1 Configuration System',
            i18nTitle: '8.2 i18n System',
            docsTitle: '8.3 Documentation Site Architecture',
            docsText: 'The documentation site uses a <strong>Vue 3 CDN + data-include declarative component</strong> architecture. 18 components follow the triad pattern (index.html + data.js + index.js), unified design language via CSS variables (--vl-doc-*).',
            badCard: { title: 'Common Defect: load_key() / t() read disk on every call', desc: '<code>load_key()</code> does <code>open() → yaml.load() → traverse nested dict</code> every call, <code>t()</code> does <code>open() → json.load() → dict.get()</code> every call. In a 500-sentence translation scenario, just these two produce 500+ redundant disk I/Os. Need in-process cache (TTL 2s + write invalidation).' }
        },
        s9: {
            heading: 'Root Cause Analysis',
            summaryTitle: 'Root Cause Summary'
        },
        s10: {
            heading: 'Improvement Plan'
        },
        s11: {
            heading: 'Architecture Comparison Diagrams — Current vs Target',
            ttsTitle: '11.1 TTS Dispatch Mechanism: Current vs Target',
            workspaceTitle: '11.2 Task Isolation: Current vs Target',
            radarTitle: '11.3 Quality Radar — 8 Dimensions Current vs Target',
            roadmapTitle: '11.4 Three-Phase Evolution Roadmap'
        },
        s12: {
            heading: 'Action Items & Implementation Schedule',
            actionsTitle: '12.1 Action Item List',
            ganttTitle: '12.2 Gantt Chart — 5-Week Implementation Schedule',
            milestonesTitle: '12.3 Milestone Definitions',
            riskTitle: '12.4 Risks & Rollback'
        },
        footer: {
            line1: 'VideoLingo Architecture Report · 2026-06-28 · v3.0.0 → v3.1.0',
            line2: 'Repository: github.com/Huanshere/VideoLingo',
            line3: 'This report is based on simplified ATAM methodology + full codebase static analysis. All improvement plans follow the principles of incremental evolution, backward compatibility, and batch delivery.'
        }
    },

    'zh-CN': {
        header: {
            title: 'VideoLingo 架构分析报告',
            subtitle: '评分 → 分析 → 可视化 · 面向可演进性的全栈架构审计',
            metaItems: [
                { label: '2026-06-28', emoji: '' },
                { label: 'v3.0.0 → v3.1.0', emoji: '' },
                { label: 'ATAM 方法', emoji: '' },
                { label: '10 行动项 · 5 周落地', emoji: '' }
            ]
        },
        toc: {
            heading: '目录',
            items: [
                { label: '综合评分卡', href: '#s1' },
                { label: 'KPI 仪表盘', href: '#s2' },
                { label: '背景与评估目标', href: '#s3' },
                { label: '架构现状总览', href: '#s4' },
                { label: '分层架构深度分析', href: '#s5' },
                { label: '数据流与管道', href: '#s6' },
                { label: '服务后端可插拔性', href: '#s7' },
                { label: '配置 · i18n · 文档站', href: '#s8' },
                { label: '问题根因分析', href: '#s9' },
                { label: '改进方案', href: '#s10' },
                { label: '架构对比图', href: '#s11' },
                { label: '行动项与落地排期', href: '#s12' }
            ]
        },
        s1: {
            heading: '综合评分卡',
            description: '基于<strong>8 维度加权评分体系</strong>，权重分配反映各维度对项目长期演进的影响程度。当前综合得分 <strong style="color:#dc2626;">5.6 / 10</strong>，目标 <strong style="color:#059669;">7.9 / 10</strong>，差距 <strong>-2.3</strong>。',
            dimensions: [
                { label: '分层合规性', score: '8.0', width: '80%', cls: 'sb--a' },
                { label: '模块内聚度', score: '7.0', width: '70%', cls: 'sb--b' },
                { label: '可扩展性', score: '5.0', width: '50%', cls: 'sb--d' },
                { label: '健壮性', score: '7.0', width: '70%', cls: 'sb--b' },
                { label: '可测试性', score: '2.0', width: '20%', cls: 'sb--d' },
                { label: '性能', score: '6.0', width: '60%', cls: 'sb--c' },
                { label: '可维护性', score: '6.0', width: '60%', cls: 'sb--c' },
                { label: '安全性', score: '4.0', width: '40%', cls: 'sb--d' }
            ],
            gauges: [
                { label: '可测试性', val: '2.0', cls: 'gr--bad', note: '最大短板 · -5 分' },
                { label: '可扩展性', val: '5.0', cls: 'gr--bad', note: '第二大短板 · -3 分' },
                { label: '安全性', val: '4.0', cls: 'gr--bad', note: '第三大短板 · -3 分' },
                { label: '加权综合', val: '5.6', cls: 'gr--warn', note: '中等风险 · 距目标 -2.3' }
            ]
        },
        s2: {
            heading: 'KPI 仪表盘',
            description: '以下 20 个可量化指标覆盖可扩展性、测试、性能、安全四个关键领域，作为改进效果的衡量基线。',
            gauges: [
                { val: '4', cls: 'gr--bad', label: '新增 TTS 需改文件数', note: '目标 ≤1 · P1' },
                { val: '2-N', cls: 'gr--bad', label: '新增管道步需改文件数', note: '目标 ≤1 · P2' },
                { val: '否', cls: 'gr--bad', label: 'TTS 注册表模式', note: '目标 是 · P1' },
                { val: '2 vs 4', cls: 'gr--warn', label: 'TTS 函数参数一致性', note: '目标 统一 · P1' },
                { val: '0', cls: 'gr--bad', label: '单元测试文件数', note: '目标 ≥5 · P1' },
                { val: '0', cls: 'gr--bad', label: '集成测试文件数', note: '目标 ≥2 · P2' },
                { val: '0%', cls: 'gr--bad', label: '核心模块覆盖率', note: '目标 ≥60% · P1' },
                { val: '无', cls: 'gr--bad', label: 'CI/CD 流水线', note: '目标 有 · P2' },
                { val: '0%', cls: 'gr--bad', label: 'load_key 缓存命中率', note: '目标 ≥90% · P0' },
                { val: '无', cls: 'gr--bad', label: 't() 翻译查找缓存', note: '目标 有 · P0' },
                { val: '串行', cls: 'gr--bad', label: '批处理任务级并行', note: '目标 ≥4 并发 · P2' },
                { val: '有', cls: 'gr--good', label: 'LLM 响应缓存', note: '已实现' },
                { val: '明文 YAML', cls: 'gr--bad', label: 'API Key 存储方式', note: '目标 env var · P0' },
                { val: '无', cls: 'gr--bad', label: '环境变量 Fallback', note: '目标 有 · P0' },
                { val: '无', cls: 'gr--bad', label: 'Streamlit 认证', note: '目标 基础认证 · P2' },
                { val: '已覆盖', cls: 'gr--good', label: '.gitignore 覆盖 config', note: '已实现' }
            ]
        },
        s3: {
            heading: '背景与评估目标',
            introTitle: '3.1 项目简介',
            introText: 'VideoLingo 是一款开源的<strong>视频翻译与配音自动化工具</strong>（Apache-2.0），由 <code>Huanshere</code> 发起，现已迭代至 v3.0.0。核心能力是将任意语言视频转录为文本、翻译为目标语言、并生成目标语言配音 — 覆盖从 YouTube 下载到最终配音视频输出的完整 15 步链路。技术栈以 Python 为核心，Streamlit 做 UI，WhisperX 做 ASR，8 种 TTS 后端可选，通过 OpenAI SDK 统一调用 LLM。',
            triggerTitle: '3.2 审计触发因素',
            goalsTitle: '3.3 战略目标'
        },
        s4: {
            heading: '架构现状总览',
            scaleTitle: '4.1 项目规模',
            styleTitle: '4.2 架构风格判断',
            styleText: 'VideoLingo 是<strong>管道-过滤器 + 分层架构</strong>的混合体：15 步串联数据流通过文件系统中间产物传递状态；展示/应用/领域/基础设施/后端五层自上而下单向依赖。',
            stackTitle: '4.3 技术栈矩阵'
        },
        s5: {
            heading: '分层架构深度分析',
            archTitle: '5.1 五层完整架构图',
            complianceTitle: '5.2 层次合规性检查',
            couplingTitle: '5.3 模块耦合度热力图'
        },
        s6: {
            heading: '数据流与管道分析',
            pipelineTitle: '6.1 完整管道数据流',
            qualityTitle: '6.2 管道质量评估',
            cards: {
                good1: { title: '优秀：断点续跑 — @check_file_exists 装饰器实现幂等', desc: '每个管道步骤退出前将产物写入文件，下次运行时装饰器自动跳过已完成步骤。若 LLM API 中途失败，修复后重跑零浪费。<strong>仅 10 行代码，效果显著。</strong>' },
                good2: { title: '优秀：LLM 响应缓存 — Prompt 级去重节省费用', desc: '<code>ask_gpt.py</code> 将每次 LLM 调用的 prompt+response 持久化到 <code>output/gpt_log/{title}.json</code>。调试和重跑时直接命中缓存，同时便于审查 LLM 输出质量。配合 <code>json_repair</code> 库修复不合规 JSON，提高解析成功率。' },
                good3: { title: '优秀：翻译两阶段流水线 — 忠实度→表现力', desc: '翻译不采用单次 "翻译+优化" prompt，而是分两阶段：第一阶段严格忠实原文 (<code>get_prompt_faithfulness</code>)，第二阶段在忠实译文上优化表达自然度 (<code>get_prompt_expressiveness</code>)。分阶段策略比单次 prompt 产出质量更高。' },
                bad1: { title: '缺陷：全局 output/ 单例 — 多任务互斥', desc: '<code>models.py</code> 定义硬编码路径常量 (<code>_4_2_TRANSLATION = "output/log/translation_results.xlsx"</code>)，全部 15 步共享同一目录。后果：两个任务无法并发（后者覆盖前者中间文件）；测试需 mock 完整文件系统；模块签名不声明数据依赖。' },
                bad2: { title: '缺陷：数字前缀模块命名 — 阻碍管道演进', desc: '<code>_3_1_split_nlp.py</code>、<code>_8_2_dub_chunks.py</code> 等命名编码了管道顺序，但插入新步骤需重命名后续所有文件（如第 4 步后插入 → <code>_5</code> ~ <code>_12</code> 全部改名），且数字不传达模块职责。' }
            }
        },
        s7: {
            heading: '服务后端可插拔性分析',
            ttsTitle: '7.1 TTS 后端全景',
            goodCard: { title: '优秀：TTS 三级降级链 — 失败→重试→GPT 修正→重试→静默占位', desc: '<code>tts_main.py</code> 实现了完整的失败处理：前 2 次直接重试 TTS，第 3 次调用 GPT 修正文本（去除 &reg;&trade;&copy; 等 TTS 不友好字符）后重试，全部失败生成 100ms 静默音频占位。<strong>管道不因单个音频生成失败而中断。</strong>' },
            badCard: { title: '缺陷：if-elif 分发 + 签名不一致 → 违反开闭原则', desc: '新增 TTS 后端需修改 <strong>4 个文件</strong>：新 TTS 文件 + tts_main.py (if-elif) + config.yaml (配置段) + sidebar_setting.py (UI 选项)。部分后端函数签名 2 参数，部分 4 参数。应使用注册表模式统一接口。' }
        },
        s8: {
            heading: '配置 · i18n · 文档站',
            configTitle: '8.1 配置体系',
            i18nTitle: '8.2 i18n 体系',
            docsTitle: '8.3 文档站架构',
            docsText: '文档站采用 <strong>Vue 3 CDN + data-include 声明式组件</strong> 架构。18 个组件遵循三元组模式 (index.html + data.js + index.js)，通过 CSS 变量 (--vl-doc-*) 统一设计语言。',
            badCard: { title: '共同缺陷：load_key() / t() 每次调用都读磁盘', desc: '<code>load_key()</code> 每次调用都 <code>open() → yaml.load() → 遍历嵌套字典</code>，<code>t()</code> 每次调用都 <code>open() → json.load() → dict.get()</code>。翻译 500 句场景下，仅此两项就产生 500+ 次冗余磁盘 I/O。需引入进程内缓存（TTL 2s + 写失效）。' }
        },
        s9: {
            heading: '问题根因分析',
            summaryTitle: '根因总结'
        },
        s10: {
            heading: '改进方案'
        },
        s11: {
            heading: '架构对比图 — 现状 vs 目标',
            ttsTitle: '11.1 TTS 分发机制：现状 vs 目标',
            workspaceTitle: '11.2 任务隔离：现状 vs 目标',
            radarTitle: '11.3 质量雷达图 — 8 维当前 vs 目标',
            roadmapTitle: '11.4 三阶段演进路线图'
        },
        s12: {
            heading: '行动项与落地排期',
            actionsTitle: '12.1 行动项清单',
            ganttTitle: '12.2 甘特图 — 5 周落地排期',
            milestonesTitle: '12.3 里程碑定义',
            riskTitle: '12.4 风险与回滚'
        },
        footer: {
            line1: 'VideoLingo 架构报告 · 2026-06-28 · v3.0.0 → v3.1.0',
            line2: '仓库地址: github.com/Huanshere/VideoLingo',
            line3: '本报告基于 ATAM 简化方法 + 全量代码静态分析生成。所有改进方案遵循「渐进演进、向下兼容、可分批落地」原则。'
        }
    }
};
