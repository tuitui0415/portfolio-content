# Psychotherapy 项目档案更新设计

## 目标

在不改变现有项目详情页视觉体系的前提下，更新 Psychotherapy 的双语项目说明，并用用户提供的两张真实截图替换概念视觉、补充档案摘要中的可玩界面证据。

## 已确认内容

- 正式名称：`Psychotherapy`
- 时间：`2020-04` 至 `2020-06`
- 职责：程序开发 / Programming
- 工具：Ink
- 团队规模未知，不在公开页面中推断或展示
- 顶部主视觉使用 Ink 项目代码与文件结构截图
- 档案摘要下方使用网页互动叙事选择界面截图
- 保留公开试玩链接

## 页面结构

顶部项目主视觉继续使用现有 `.real-media` 组件，以 `contain` 模式完整显示代码截图。档案摘要中的正文和工具标签保持原有层级，其后新增一张横跨摘要网格的项目证据图，并附上简短、客观的双语说明。

移动端沿用现有单列布局。摘要证据图宽度始终不超过容器，保持原始比例，不裁切、不拉伸。

## 双语文案

中文：

> Psychotherapy 是一款使用 Ink 制作的网页互动叙事项目。玩家扮演精神科医生，通过与一名拥有四种人格的特殊患者交谈，在随机出现的人格片段中收集相互关联的线索，逐步整理患者身份、经历与问题并完成诊断。项目支持分支选择、重新开始、存档与读档。

English:

> Psychotherapy is a web-based interactive fiction project created with Ink. The player takes the role of a psychiatrist interviewing a patient with four personalities, collecting connected clues from randomly presented personality scenes to reconstruct the patient’s identity, history, and condition. The project supports branching choices, restart, save, and load.

## 验收标准

- 中英文详情页均显示正式名称和已确认介绍。
- 顶部代码截图完整显示且不使用概念视觉。
- 第二张可玩界面截图位于档案摘要和工具标签下方。
- 两张图片均使用无损 WebP，并保留原始像素内容。
- 桌面和移动端页面无横向溢出，图片不变形。
- 内容校验、单元测试、端到端测试和生产构建全部通过。

