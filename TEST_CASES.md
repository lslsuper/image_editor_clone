# 测试用例集 (Test Cases)

| 用例ID | 模块 | 测试场景 | 前置条件 | 操作步骤 | 预期结果 | 优先级 |
|--------|------|----------|----------|----------|----------|--------|
| TC-001 | Generator | 图片上传-正常 | 无 | 1. 点击上传区域<br>2. 选择一张 <10MB 的 JPG 图片 | 图片预览显示在列表中 | P0 |
| TC-002 | Generator | 图片上传-超大文件 | 无 | 1. 上传一张 >10MB 的图片 | 弹出 "File size must be less than 10MB" 警告，图片未添加 | P1 |
| TC-003 | Generator | 图片上传-非图片文件 | 无 | 1. 拖拽一个 .txt 文件到上传区 | 文件被忽略或提示格式错误 | P1 |
| TC-004 | Generator | 图片删除 | 已上传图片 | 1. 点击图片右上角的 X 按钮 | 图片从列表中移除 | P1 |
| TC-005 | Generator | 生成-缺少 Prompt | 已上传图片 | 1. 清空 Prompt 输入框<br>2. 点击 Generate Now | 弹出 "Please enter a prompt" 警告 | P1 |
| TC-006 | Generator | 生成-缺少图片 | 无图片 | 1. 输入 Prompt<br>2. 点击 Generate Now | 弹出 "Please upload at least one image" 警告 | P1 |
| TC-007 | Generator | 生成-正常流程 | 已上传图片，已输入 Prompt | 1. 点击 Generate Now | 1. 按钮显示 Loading 状态<br>2. API 请求成功<br>3. Output 区域显示生成的图片 | P0 |
| TC-008 | Generator | 生成-API失败 | 已上传图片，已输入 Prompt | 1. Mock API 返回 500 错误<br>2. 点击 Generate Now | 1. Loading 状态结束<br>2. 弹出错误提示 | P1 |
| TC-009 | Generator | 模型选择 | 无 | 1. 点击模型下拉框<br>2. 选择 "SeeDream 4" | 状态更新，API 请求体中 model 字段变化 | P2 |
| TC-010 | API | POST /api/generate 正常 | Mock OpenRouter 成功 | 发送包含 prompt 和 image 的 POST 请求 | 返回 200 和图片 URL 列表 | P0 |
| TC-011 | API | POST /api/generate 缺失参数 | 无 | 发送空 body 或缺失 prompt | 返回 400 错误 | P1 |
| TC-012 | API | POST /api/generate 第三方错误 | Mock OpenRouter 失败 | 模拟 OpenRouter 返回 502 | API 返回 502 并包含上游错误信息 | P2 |
