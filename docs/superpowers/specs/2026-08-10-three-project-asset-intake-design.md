# 三个项目材料归档与公开清理设计

日期：2026-08-10

## 目标

将无人机研究项目、NSFW 文本审核项目和《圣米歇尔山城堡》类魂关卡设计整理进公开的 `portfolio-content` 仓库，使简历和个人网站能够复用同一套事实、文案与链接；同时清除类魂材料中的招聘来源痕迹，并避免在 GitHub 中存放不适合版本管理的大文件或未经确认可再分发的第三方 UE 资产。

## 已确认来源

### 多人 XR 无人机游戏

- 原始文件：`Project_Report-4.pdf`，14 页，约 1.8 MB。
- 正式英文标题：`Development of a Multiplayer XR Drone Game in Unity Using ZED Camera`。
- 作者：Yunhan Wei；机构：University of California, Davis；时间：Spring 2026。
- 技术与成果：Unity、ZED Camera、Photon PUN、空间尺度与朝向校准、多锚点稳健相似变换、在线漂移修正、主机权威校准快照和可玩战斗循环。
- 报告中的三个 Google Drive 演示视频均已通过匿名访问检查。

### 可解释 NSFW 文本审核

- 原始文件：`Interpretable NSFW Text Moderation via RISE and Post-hoc Concept Bottleneck Models-3.pdf`，12 页，约 1.8 MB。
- 正式标题：`Interpretable NSFW Text Moderation via RISE and Post-hoc Concept Bottleneck Models`。
- 团队成员：Raymond Kang、Yunhan Wei。
- Yunhan Wei 的明确贡献边界：可视化与 UX、Streamlit 仪表板、前端实现、可用性研究工具。
- Raymond Kang 的明确贡献边界：基础模型微调、RISE 适配、概念头训练、数据与评估流程。
- 公开代码位于 `RaymondHKang/ECS289HFinalProject` 的 `raymondbranch`；仓库与分支均已核验为公开。

### 圣米歇尔山城堡

- 原始文件：约 490 MB 的 7z 包，包含 UE 5.6 工程、约 396 MB 演示视频、11 页 PPT、技术概览和预览图。
- 正式中文名：`圣米歇尔山城堡`。
- 正式英文名：`Mont Saint-Michel Castle`。
- 类型：第三人称动作线性关卡设计 / 类魂关卡设计。
- 时间依据：源文件时间为 2025-08，作为项目月份记录；若之后有更准确时间，可更新。
- PPT 可见内容未发现雷火、秋招、招聘、应聘、笔试、面试、岗位或题目等招聘措辞。已知招聘痕迹集中在原压缩包与顶层目录名称。

## 公开信息架构

新增三个项目 ID：

- `multiplayer-xr-drone-game`
- `interpretable-nsfw-text-moderation`
- `mont-saint-michel-castle`

每个项目包含：

1. `content/projects/<id>.json`：结构化中英文事实、职责、工具、简历文案、网站文案、来源与待确认问题。
2. `projects/<id>/README.md`：面向人工阅读的中英文项目页。
3. `projects/<id>/assets/`：适合 Git 追踪的小型公开材料。
4. `content/external-links.json`：Google Drive、GitHub 与其他外部资料的公开链接和匿名访问证据。

## 文件去向

### 进入 GitHub

- `projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf`
- `projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf`
- `projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx`
- `projects/mont-saint-michel-castle/assets/level-preview.png`
- `projects/mont-saint-michel-castle/technical-overview.md`

PDF 内容保持原样，只使用清晰稳定的文件名。PPT 保持原设计和 11 页结构，只删除招聘来源元数据或隐藏内容并改用稳定文件名。技术概览转换为 Markdown，修正明显文字错误，但不增加未经来源支持的技术主张。

### 进入 Google Drive

- `mont-saint-michel-castle-gameplay.mp4`
- `mont-saint-michel-castle-ue-project.zip`

两者放入新建公开文件夹 `Portfolio Assets / Mont Saint-Michel Castle`。上传后使用匿名检查确认无需登录即可访问，再将链接写入仓库。

### 不公开

- 原始招聘命名的 7z 文件。
- `Saved/`、`Intermediate/`、`DerivedDataCache/`、编译 `Binaries/`、崩溃日志、自动保存和个人开发缓存。
- 招聘来源文件名、目录名、文档属性、隐藏文本或备注。
- 无法确认可再分发授权的第三方二进制资产。

## UE 工程清理边界

公开包以“项目特定关卡源文件”而不是“原始完整工作目录”为目标。

1. 将顶层目录重命名为 `mont-saint-michel-castle-ue-project`。
2. 保留项目配置、关卡、项目自制蓝图和项目运行必需的自制内容。
3. 排除缓存、自动保存、构建产物和个人开发目录。
4. 检查 BlockoutTools 和 UE 模板资产的授权与来源说明。
5. 对无法确认再分发许可的第三方内容，排除实体文件，并在包内 README 中列出依赖与恢复方法。
6. 清理后扫描所有路径和可读文本，确认没有招聘来源关键词。
7. 清理包解压后应包含 `.uproject`、必要配置、项目特定内容和依赖说明；不承诺在缺少第三方依赖时开箱即用。

## 类魂 PPT 清理

源 PPT 是视觉模板，继续保留其主题、字体、版式、图片与 11 页叙事顺序。仅进行以下定点操作：

- 清理招聘相关的文档属性、隐藏文本、备注和文件路径痕迹。
- 保留项目标题、作者姓名、世界观、地图、流程、环境设计和玩法描述。
- 将输出文件改为 `mont-saint-michel-castle-level-design.pptx`。
- 若 TIFF 媒体导致兼容性问题，只在保持视觉一致的前提下转换为无损 PNG，并逐页对照源渲染。

不重做视觉风格，不加入招聘公司或岗位说明，也不把现有内容改写成招聘答题口吻。

## 文案边界

### 无人机项目

按“研究实验室中的个人工程项目”描述。可以陈述报告中由 Yunhan Wei 实现的校准、网络同步和可玩循环；同时说明无人机硬件尚未完全恢复，当前验证主要依赖 ZED Camera。

### NSFW 项目

按“两人课程/研究项目”描述。Yunhan Wei 的简历与网站文案聚焦 Streamlit 可视化、token saliency、concept activation、token-concept matrix 和 UX；模型训练及数据评估只作为团队系统背景，不归入个人贡献。

### 类魂关卡

按“个人关卡设计项目”描述，核心证据来自 PPT、技术概览、UE 工程和演示视频。重点包括线性关卡流程、弱引导、捷径、水位机制、潜行刺杀、正面战斗、敌人分区与圣米歇尔山叙事环境。

## 验证标准

### 内容

- 三个项目 JSON 通过仓库 schema 校验。
- 每个项目都有中英文 README、来源、个人贡献边界和未确认问题。
- 所有链接 ID 可解析，所有外部链接完成匿名检查。

### PDF

- 两份 PDF 页数分别保持 14 页和 12 页。
- 文件未加密、可正常渲染，复制前后 SHA-256 一致。

### PPT

- 最终文件保持 11 页。
- 逐页渲染检查无裁切、重叠、缺图、异常换行或字体替换造成的明显问题。
- PPT 文件名、可见文字、备注、文档属性和内部关系中不含招聘来源关键词。

### 类魂公开包

- 顶层目录和所有文件路径不含招聘来源关键词。
- 不包含缓存、自动保存、日志、构建产物和个人开发目录。
- 单独生成文件清单与 SHA-256。
- Google Drive 上传后匿名访问成功。

### 仓库

- `python3 scripts/check_content.py` 通过。
- `python3 -m unittest discover -s tests -v` 全部通过。
- `git diff --check` 无错误。
- 不提交原始 7z、396 MB 视频或清理后的大型 UE ZIP。

## 可更改性

所有项目事实保存在 JSON，面向读者的说明保存在项目 README，小型原始证据保存在项目 assets，大型材料保留为 Drive 链接。后续简历和网站只读取这些规范化内容；项目名称、日期、职责或链接发生变化时，只需更新内容仓库，不必分别修改多个成品。
