/* ═══════════════════════════════════════════════════════════════════════════
   YrY CDN — YrySceneCard · Vue 3 资产卡片组件 (单文件入口)

   适用: 资产/技能/Agent/规则/参考 统一卡片展示

   本文件职责:
     1) 通过 createAsyncMountAPI 暴露 window.YrySceneCard 占位 { mount } (异步期间可调用入队)
     2) 通过 yryBootstrapFromCurrentScript 自动加载 ../shared/yry-loader.js 并传入 callerSrc
     3) 由 yryLoadComponent 注入 index.css + 加载 data.js + 派发 ready/error 事件
     4) onReady 内: 等待 YryTagChip 就绪, 再 fetch 同目录 index.html, DOMParser 提取
        <script type="text/x-template" id="yry-scene-card-tpl"> 作为 Vue template
     5) 模板就绪后通过 mountAPI.setComponentOptions 将 window.YrySceneCard 替换为 Vue options

   加载链机制: 即使本 <script> 在 yry-tag-chip/index.js 之后执行,
   YryTagChip 也是异步 fetch 完成才注册到 window.YryTagChip 的。
   所以这里必须等待 'yry-tag-chip-ready' 事件, 而不是直接检查 window.YryTagChip。

   props 简表:
     name          (必填) 卡片主标题
     nameHref      (可选) 主标题链接
     nameTarget    (可选) 链接打开方式, 默认 '_blank' (新窗口, 自带 rel="noopener noreferrer")
     badge         (可选) 主标题后的小徽标(如 "新")
     desc          (可选) 描述文字(支持 HTML, 经 v-html 渲染)
     tags          (可选) 标签数组 · 内部使用 <yry-tag-chip> 渲染
     meta          (可选) 底部元信息
     demo          (可选) 效果演示链接 URL · 自动作为 "演示" 入口追加入底部链接列 (去重)
     links         (可选) 底部链接数组, 每项 { icon, label, href, target }
                   · null/undefined (默认) → 回退到 data.js 的 defaults.defaultLinks
                                            (清单 / 架构 / 图谱 / 源码 / 测试 / 演示 / 审查 等默认全部可跳转)
                   · 显式传 []            → 不展示任何底部链接
                   · 显式传 [...]         → 用传入数组覆盖 defaultLinks
                   · href 中可用 {name} 占位, 运行时被 props.name (URL 编码) 替换

   页面使用方式 (宿主页面):
     <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
     <script src="../../../../cdn/yry-tag-chip/index.js"></script>
     <script src="../../../../cdn/yry-scene-card/index.js"></script>
     <div id="card"></div>
     <script>
       window.YrySceneCard.mount({
         name: 'yry-cdn-lib', nameHref: '...', badge: '新',
         desc: 'YrY 自建 CDN 共享库',
         tags: [{ text: '自建', modifier: 'accent' }],
         meta: 'shared/index.css + theme/index.css + ...'
       }, '#card').then(app => { ... });
     </script>
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var COMPONENT_NAME = 'YrySceneCard';
    var SELF_SRC = (document.currentScript && document.currentScript.src) || '';
    var mountAPI = null;

    /* ── 统一失败处理 (模板/依赖/loader 404 三条路径共用) ─────── */
    function _fail(ctx, err) {
        console.error('[' + COMPONENT_NAME + ']', err);
        if (ctx && typeof ctx.dispatchError === 'function') ctx.dispatchError(err);
        if (mountAPI) mountAPI.rejectMountQueue(err);
    }

    /* ── 构建 Vue 组件 options + 派发 ready + 排空队列 ─────────── */
    function _buildAndMount(tpl, ctx, cfg) {
        /* data.js 的 defaults.defaultLinks 作为组件级私有选项 _defaultLinks,
           供 computed.resolvedLinks 通过 this.$options._defaultLinks 访问。
           props.links 三态语义 (见上方 props.links 注释):
             · null/undefined (默认) → 回退到 _defaultLinks
             · []                  → 不展示任何底部链接
             · [...]               → 用传入数组覆盖 */
        mountAPI.setComponentOptions({
            name: COMPONENT_NAME,
            components: { YryTagChip: window.YryTagChip },
            props: {
                name:         { type: String, required: true },
                nameHref:     { type: String, default: '' },
                nameTarget:   { type: String, default: function () { return cfg.defaults.nameTarget; } },
                badge:        { type: String, default: '' },
                desc:         { type: String, default: '' },
                tags:         { type: Array,  default: function () { return []; } },
                meta:         { type: String, default: '' },
                demo:         { type: String, default: '' },
                links:        { type: Array,  default: null }
            },
            computed: {
                /* 解析后的底部链接列表:
                   · 未传 links (null) 时回退到 data.js 的 _defaultLinks
                   · 显式传 [] 时视为「不展示任何底部链接」(空数组,渲染时跳过)
                   · 显式传 [...] 时使用传入数组覆盖
                   · href 中的 {name} 占位符会被 props.name (URL 编码) 替换
                   · props.demo 非空时, 若列表里还没有 "演示" 入口, 则自动追加
                   · 每项统一规整为 { icon, label, href, target } 四元组 */
                resolvedLinks: function () {
                    var raw = Array.isArray(this.links)
                        ? this.links
                        : ((this.$options && this.$options._defaultLinks) || []);
                    var encodedName = encodeURIComponent(this.name || '');
                    var arr = raw.map(function (l) {
                        return {
                            icon:   l.icon   || '',
                            label:  l.label  || '',
                            href:   (l.href  || '').replace('{name}', encodedName),
                            target: l.target || '_blank'
                        };
                    });
                    var demo = this.demo;
                    if (demo && !arr.some(function (l) { return l.label === '演示'; })) {
                        arr.push({ label: '演示', href: demo, target: '_blank' });
                    }
                    return arr;
                }
            },
            /* 组件级私有选项: Vue 3 不会对 _ 前缀自定义字段发出 unknown option 警告 */
            _defaultLinks: (cfg.defaults && cfg.defaults.defaultLinks) || [],
            template: tpl
        });
        ctx.dispatchReady();
        mountAPI.flushMountQueue();
    }

    /* ── onReady: 配置就绪后由 yryLoadComponent 调用 ─────────── */
    function _onReady(cfg, ctx) {
        function proceed() {
            ctx.fetchTemplate(cfg.templateId, cfg.loadTimeoutMs)
                .then(function (tpl) { return _buildAndMount(tpl, ctx, cfg); })
                .catch(function (err) { _fail(ctx, err); });
        }

        function onTCReady() {
            clearTimeout(depTimer);
            proceed();
        }

        /* YryTagChip 的 createAsyncMountAPI 会在初始化早期立即暴露占位
           { mount }, 因此 window.YryTagChip 为 truthy 不代表组件已完全初始化。
           通过检查 .name 属性（由 setComponentOptions 注入）来区分占位与
           完整的 Vue 组件 options,避免将占位对象传给 components 注册表。 */
        if (window.YryTagChip && window.YryTagChip.name) {
            proceed();
        } else {
            /* YryTagChip 未就绪: 监听 'yry-tag-chip-ready' 事件, 带超时保护 */
            var depTimer = setTimeout(function () {
                document.removeEventListener('yry-tag-chip-ready', onTCReady);
                _fail(ctx, new Error('YryTagChip 依赖加载超时'));
            }, cfg.loadTimeoutMs || 5000);
            document.addEventListener('yry-tag-chip-ready', onTCReady, { once: true });
        }
    }

    /* ── bootstrap: loader 就绪后才执行 ──────────────────────── */
    function _bootstrap() {
        mountAPI = createAsyncMountAPI({ apiNamespace: COMPONENT_NAME });

        yryBootstrapFromCurrentScript({
            configKey:     'YRY_SCENE_CARD_CONFIG',
            cssMarker:     'yry-scene-card-css',
            readyEvent:    'yry-scene-card-ready',
            errorEvent:    'yry-scene-card-error',
            componentName: COMPONENT_NAME,
            callerSrc:     SELF_SRC,
            defaultConfig: {
                templateId:    'yry-scene-card-tpl',
                loadTimeoutMs: 5000
            },
            onReady: _onReady
        }, function () {
            /* yry-loader.js 加载失败 (例如 404): 让所有挂队的 mount() Promise reject */
            _fail(null, new Error('yry-loader.js 未加载'));
        });
    }

    /* ── bootstrap: loader 已就绪则直接调用（loader 由 docs/index.html 预加载） ── */
    _bootstrap();
})();