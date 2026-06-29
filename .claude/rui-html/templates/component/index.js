/**
 * <<COMPONENT_NAME>> Vue 3 组件
 * ----------------------------------------------------------------------
 * 通过 mountDocComponent() 注册为全局组件；i18n / 资源清理 /
 * AbortController 等契约由父层统一管理，本文件聚焦于：
 *   - 数据初始化
 *   - 远程拉取 / 错误处理
 *   - 计算属性 / 方法
 *   - mounted / beforeUnmount 资源回收
 *
 * 关键约束：
 *   - beforeUnmount 必须销毁 Chart 实例、清理 Timer、调用 AbortController.abort()
 *   - 父组件在语言切换重渲染前应显式调用 app.unmount() 防止内存泄漏
 */
var DOC_<<COMPONENT_NAME_UPPER>>_EXTRA = {
    data: function () {
        return {
            loading:  true,
            error:    false,
            payload:  null,
            _abortCtrl: null,
            _timer:     null
        };
    },

    computed: {
        renderedBody: function () {
            return this.description || '';
        }
    },

    methods: {
        fetchPayload: function () {
            var self = this;
            if (!this.apiUrl) { this.loading = false; this.error = true; return; }
            var ctrl = new AbortController();
            this._abortCtrl = ctrl;
            this._timer = setTimeout(function () { ctrl.abort(); }, 8000);
            fetch(this.apiUrl, { signal: ctrl.signal })
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    if (self._timer) { clearTimeout(self._timer); self._timer = null; }
                    self.payload = data;
                    self.loading  = false;
                    self.error    = false;
                })
                .catch(function (err) {
                    if (self._timer) { clearTimeout(self._timer); self._timer = null; }
                    if (err && err.name === 'AbortError') return;
                    console.warn('[<<COMPONENT_NAME>>] fetch failed:', err);
                    self.loading = false;
                    self.error   = true;
                });
        },

        retry: function () {
            this.loading = true;
            this.error   = false;
            this.fetchPayload();
        }
    },

    mounted: function () {
        if (this.refreshMs && this.refreshMs > 0) {
            var self = this;
            this._timer = setInterval(function () { self.fetchPayload(); }, this.refreshMs);
        } else {
            this.fetchPayload();
        }
    },

    beforeUnmount: function () {
        if (this._timer)     { clearTimeout(this._timer);  this._timer = null; }
        if (this._abortCtrl) { this._abortCtrl.abort();   this._abortCtrl = null; }
    }
};