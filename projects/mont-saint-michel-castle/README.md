# 圣米歇尔山城堡 / Mont Saint-Michel Castle

## 中文概述

这是一个由魏允瀚独立设计并实现的第三人称类魂线性关卡。关卡以城堡的垂直高差为骨架，通过潜行、环境机关、战斗和 Boss 遭遇建立节奏变化，并使用构图、灯光、视线与地标进行弱引导。

## English Overview

This independently designed and implemented third-person soulslike level uses castle verticality as its structural backbone. Stealth, environmental mechanisms, combat, and a boss encounter create pacing changes, while composition, lighting, sightlines, and landmarks provide subtle guidance.

## 关卡设计重点 / Level-Design Focus

- 通过高差和垂直地标建立明确的线性目标
- 在狭窄通道、潜行空间和开阔战斗区之间切换压力
- 使用升降机、动态水位和单向门改变可通行路径
- 通过回环和捷径帮助玩家建立空间认知
- 以流程图和灰盒验证遭遇分布、路线、视线与节奏

## 技术实现 / Technical Implementation

- Unreal Engine 5.6.1 与 Blueprint
- 升降机、动态水位和单向门
- PawnSensing 敌人视野检测与材质反馈
- BlockoutTools 辅助灰盒搭建

## 项目材料 / Project Materials

- [11-slide level-design deck](assets/mont-saint-michel-castle-level-design.pptx)
- [Level preview](assets/level-preview.png)
- [Technical overview](technical-overview.md)
- [Public source-package notes](package-readme.md)
- [Web-optimized gameplay video](https://drive.google.com/file/d/1H597Gzs9OSItAag5ImkcHavJp5vWotrf/view?usp=sharing)
- [Clean Unreal Engine source package](https://drive.google.com/file/d/1dQWlbNv7zYbEpU1R3VkHe-fd6TZtpZ5d/view?usp=sharing)

玩法视频为从原始录屏生成的网页优化版；精简工程包仅包含本人制作且适合公开分发的项目文件，依赖说明见上方文档。

## 时间说明 / Date Note

当前记录为 2025 年 8 月，依据源文件时间推定，待本人确认。
