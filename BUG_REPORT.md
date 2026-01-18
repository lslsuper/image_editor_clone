# 缺陷跟踪报告 (Bug Tracking Report)

## 1. 已修复缺陷列表

| ID | 缺陷描述 | 严重等级 | 状态 | 修复方案 | 验证结果 |
|----|----------|----------|------|----------|----------|
| BUG-001 | 错误提示使用原生 `alert`，阻塞 UI 且样式不统一 | Minor (UX) | Fixed | 引入 `sonner` 组件，替换所有 `alert()` 调用为 `toast.error()` | Pass |
| BUG-002 | Vitest 无法解析 `@/` 路径别名，导致测试无法运行 | Major (Dev) | Fixed | 更新 `vitest.config.ts` 中的 alias 配置 | Pass |
| BUG-003 | 测试代码中 `input[type="file"]` 选择器在 JSDOM 下无法定位 | Minor (Test) | Fixed | 优化测试选择器策略，直接通过 Label 关联获取 input 元素 | Pass |

## 2. 遗留缺陷
*当前版本无遗留 P0/P1 级功能缺陷。*

## 3. 建议
- **性能**: 对于大图片处理，建议在上传前在客户端进行压缩，以减少带宽消耗和后端处理时间。
- **功能**: 当前模型选择硬编码在前端，建议改为从后端动态获取支持的模型列表。
