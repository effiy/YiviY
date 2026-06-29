/**
 * yt-dlp Demos — Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * 语言切换由 i18n: true 透明处理——模板无需修改。
 *
 * 功能：
 *   - 类型筛选按钮（动态生成，仅显示有演示的分类）
 *   - 卡片网格（响应式 auto-fill）
 *   - 跨语言透明切换
 */
mountDocComponent({
    name: 'DocYtDlpDemos',
    templateId: 'yt-dlp-demos-template',
    dataKey: 'YT_DLP_DEMOS_CONFIG',
    i18n: true,

    extra: {
        data: function () {
            return {
                activeType: 'all'
            };
        },

        computed: {
            /**
             * 动态构建筛选按钮列表：先从 demos 中收集实际出现的类型，
             * 再映射为 { id, label } 数组（"全部" 始终在首位）。
             */
            types: function () {
                var self = this;
                var seen = {};
                var result = [{ id: 'all', label: this.allFilter }];

                (this.demos || []).forEach(function (d) {
                    if (!seen[d.type]) {
                        seen[d.type] = true;
                        result.push({
                            id: d.type,
                            label: self.typeLabels[d.type] || d.type
                        });
                    }
                });
                return result;
            },

            /**
             * 按当前筛选类型过滤演示列表。
             */
            filteredDemos: function () {
                if (this.activeType === 'all') return this.demos || [];
                var activeType = this.activeType;
                return (this.demos || []).filter(function (d) {
                    return d.type === activeType;
                });
            }
        },

        methods: {
            /**
             * 返回指定类型的演示数量（用于筛选按钮上的计数）。
             */
            countByType: function (typeId) {
                if (typeId === 'all') return (this.demos || []).length;
                return (this.demos || []).filter(function (d) {
                    return d.type === typeId;
                }).length;
            },

            /**
             * 根据类型 ID 返回展示标签。
             */
            typeLabelFor: function (typeId) {
                return this.typeLabels[typeId] || typeId;
            }
        }
    }
});
