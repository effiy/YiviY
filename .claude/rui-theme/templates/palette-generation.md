# rui-theme · 主题生成流程

## 12 步色板生成流程（palette-generator）

1. **选择基调（mood）**: warm / cool / neutral / vibrant / muted
2. **确定背景**: dark / light
3. **生成主色（accent）**: HSL 空间 hue 选择
4. **派生 5 步色阶**: tint / tone / shade
5. **派生中性灰阶**: 7-9 阶
6. **派生状态色**: success / warn / error
7. **计算对比度**: WCAG AA 校验
8. **选择字体配对**: heading / body / mono
9. **写入主题文件**: themes/<name>.md
10. **CSS 输出**: 主题文件转换为 cdn/theme/<name>.css
11. **预览验证**: 渲染示例组件检查视觉一致性
12. **写入清单**: themes/MANIFEST.json 记录新增主题

## 对比度检查（contrast-checker）

部署前必须校验：
- 文本 vs 背景 ≥ 4.5:1 (AA) 或 7:1 (AAA)
- 大字号文本 ≥ 3:1
- 状态色辨识度（不仅依赖颜色，配合图标/文本）

详见 `agents/contrast-checker.md` 与 `rules/token-contracts.md`。