/* ═══════════════════════════════════════════════════════════════════════════
   YrY CDN — YryToast · Vue 3 Toast 通知组件 (单文件入口)

   适用: 页面级消息通知 · 复制成功反馈 · 操作提示

   本文件职责:
     1) 通过 yryBootstrapFromCurrentScript 自动加载 ../shared/yry-loader.js 并传入 callerSrc
     2) 由 yryLoadComponent 注入 index.css + 加载 data.js + 派发 ready/error 事件
     3) 立即暴露 window.YryToast (loader 未就绪时调用自动入队, 加载完成后回放)
     4) 首次调用时 fetch 同目录 index.html, DOMParser 提取
        <script type="text/x-template" id="yry-toast-tpl"> 作为 Vue template
     5) 懒挂载 Vue 应用 (首次实际渲染时才创建)

   页面使用方式 (宿主页面):
     <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
     <script src="../../../../cdn/yry-toast/index.js"></script>
     <script>YryToast.success('已复制', '链接已复制');</script>

   注意: 在 loader/data.js 异步加载期间对 YryToast.* 的调用会被内部排队,
         加载完成后自动回放并渲染。
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── 单例状态 (闭包内共享, 跨越 placeholder 与首次渲染) ────── */
    var _app = null;          // Vue app instance (singleton)
    var _nextId = 1;          // toast id 自增
    var _pending = [];        // 模板未加载时缓存的 toast
    var _earlyQueue = [];     // loader 未就绪时缓存的 API 调用
    var _loaderReady = false; // loader (data.js) 是否已初始化
    var _loaderCtx = null;    // yryLoadComponent 传入的 ctx (fetchTemplate/dispatchReady/...)
    var _cfg = null;          // 当前配置 (data.js + defaultConfig 浅合并结果)

    /* ── 字段快捷访问 (data.js 把 runtime 配置嵌套在 defaults 中, 这里统一解包) ── */
    function _duration()       { return _cfg.defaults.duration; }
    function _maxToasts()      { return _cfg.defaults.maxToasts; }
    function _templateId()     { return _cfg.defaults.templateId; }
    function _hostId()         { return _cfg.defaults.hostId; }
    function _loadTimeoutMs()  { return _cfg.defaults.loadTimeoutMs; }

    /* ── 类型别名归一化 ─────────────────────────────────────────── */
    function normalizeType(type) {
        type = String(type || 'default');
        if (_cfg.typeAliases[type]) return _cfg.typeAliases[type];
        if (_cfg.icons[type] === undefined) return 'default';
        return type;
    }

    /* ── 懒挂载 Vue 应用 ─────────────────────────────────────────── */
    function mountApp(templateHTML) {
        if (_app) return _app;
        if (!window.Vue) {
            throw new Error('Vue 3 未加载, 请先引入 vue.global.prod.js');
        }

        var host = document.getElementById(_hostId());
        if (!host) {
            host = document.createElement('div');
            host.id = _hostId();
            document.body.appendChild(host);
        }

        var app = window.Vue.createApp({
            template: templateHTML,
            data: function () { return { items: [], icons: _cfg.icons }; },
            methods: {
                /* 统一 dismiss 入口: id 为 null/undefined 时清空全部, 否则按 id 移除 */
                dismiss: function (id) {
                    if (id == null) {
                        this.items.forEach(function (it) {
                            if (it._tid) clearTimeout(it._tid);
                        });
                        this.items = [];
                        return;
                    }
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i].id === id) {
                            if (this.items[i]._tid) clearTimeout(this.items[i]._tid);
                            this.items.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        });

        _app = app.mount(host);

        /* 派发 ready 事件 (供需要在挂载后做事的页面监听) */
        if (_loaderCtx) _loaderCtx.dispatchReady();

        /* 排空挂载前缓存的 toast */
        var q = _pending;
        _pending = [];
        q.forEach(_pushItem);

        return _app;
    }

    /* ── 推入 toast 到列表 (限长 + 自动消失, 定时器句柄存于 item._tid) ── */
    function _pushItem(item) {
        if (!_app) return;
        var data = _app;
        var items = data.items;

        /* 上限保护: 超出则丢弃最旧的 */
        while (items.length >= _maxToasts()) {
            var dropped = items.shift();
            if (dropped && dropped._tid) clearTimeout(dropped._tid);
        }
        items.push(item);

        /* 自动消失 (保存 timer id 用于手动 dismiss 时 clear) */
        if (item.duration > 0) {
            item._tid = setTimeout(function () {
                data.dismiss(item.id);
            }, item.duration);
        }
    }

    /* ── 构造 item 并执行实际渲染 (内部函数, 所有路径走这里) ────── */
    function _doShow(text, type, title, duration, preAssignedId) {
        var t = normalizeType(type);
        var d = typeof duration === 'number' ? duration : _duration();
        var item = {
            id: preAssignedId || _nextId++,
            type: t,
            text: String(text == null ? '' : text),
            title: title ? String(title) : '',
            duration: d,
            _tid: null
        };

        if (_app) {
            _pushItem(item);
            return item;
        }

        /* 模板未加载: 缓存后异步挂载 */
        _pending.push(item);
        _loaderCtx.fetchTemplate(_templateId(), _loadTimeoutMs())
            .then(mountApp)
            .catch(function (err) {
                console.error('[YryToast] 模板加载失败:', err);
                if (_loaderCtx) _loaderCtx.dispatchError(err);
                _pending = [];
            });
        return item;
    }

    /* ── 公开 API: show(text, type?, title?, duration?) ─────────── */
    function show(text, type, title, duration) {
        if (!_loaderReady) {
            /* loader 未就绪: 预留 id 占位返回, 加载完成后回放 */
            var id = _nextId++;
            _earlyQueue.push({ fn: _doShow, args: [text, type, title, duration, id] });
            return { id: id, _queued: true };
        }
        return _doShow(text, type, title, duration);
    }
    function success(text, title, duration) { return show(text, 'success', title, duration); }
    function error(text, title, duration)   { return show(text, 'error',   title, duration); }
    function warn(text, title, duration)    { return show(text, 'warn',    title, duration); }
    function info(text, title, duration)    { return show(text, 'info',    title, duration); }

    /* dismiss 走单一路径: 直接交给 Vue 方法处理 (null/undefined = 清空) */
    function dismiss(id) {
        if (!_app) return;
        _app.dismiss(id);
    }

    /* ── 立即暴露全局 API (异步加载期间早期调用也能正常入队) ──── */
    window.YryToast = {
        show:    show,
        success: success,
        error:   error,
        warn:    warn,
        info:    info,
        dismiss: dismiss
    };

    /* ── 排空 loader 未就绪期间的早期 API 调用 (直接调 _doShow, 保持预分配 id) ── */
    function _flushEarlyQueue() {
        var q = _earlyQueue;
        _earlyQueue = [];
        q.forEach(function (entry) {
            try {
                entry.fn.apply(null, entry.args);
            } catch (err) {
                console.error('[YryToast] 早期调用回放失败:', err);
            }
        });
    }

    /* ── onReady: 配置就绪后由 yryLoadComponent 调用 ─────────── */
    function _onReady(cfg, ctx) {
        _cfg = cfg;
        _loaderCtx = ctx;
        _loaderReady = true;
        _flushEarlyQueue();
    }

    /* ── 启动: 通过 shared loader 提供的 bootstrap 工具注入 loader 并初始化 ── */
    yryBootstrapFromCurrentScript({
        configKey:     'YRY_TOAST_CONFIG',
        cssMarker:     'yry-toast-css',
        readyEvent:    'yry-toast-ready',
        errorEvent:    'yry-toast-error',
        componentName: 'YryToast',
        defaultConfig: {
            icons: {
                default: 'ℹ', success: '✓', warn: '⚠', warning: '⚠', error: '✕', info: 'ℹ'
            },
            typeAliases: { warning: 'warn' },
            defaults: {
                duration:      3500,
                maxToasts:     5,
                templateId:    'yry-toast-tpl',
                hostId:        'yry-toast-host',
                loadTimeoutMs: 5000
            }
        },
        onReady: _onReady
    }, function () {
        /* yry-loader.js 加载失败 (例如 404) 时的回退:
           toast 是 nice-to-have 通知组件, 与其他组件 (reject queue) 不同,
           我们保留 API 调用路径不崩溃, 后续 show() 通过 stub fetchTemplate
           优雅失败 (实际渲染失败但不会抛异常污染调用方). */
        _onReady({
            icons: {
                default: 'ℹ', success: '✓', warn: '⚠', warning: '⚠', error: '✕', info: 'ℹ'
            },
            typeAliases: { warning: 'warn' },
            defaults: {
                duration:      3500,
                maxToasts:     5,
                templateId:    'yry-toast-tpl',
                hostId:        'yry-toast-host',
                loadTimeoutMs: 5000
            }
        }, {
            getTemplateUrl: function () { return null; },
            fetchTemplate:  function () { return Promise.reject(new Error('yry-loader.js 未加载')); },
            dispatchReady:  function () {},
            dispatchError:  function () {}
        });
    });
})();