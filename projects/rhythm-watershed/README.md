# 节奏流域 / Rhythm Watershed

## 中文概述

《节奏流域》是一款模块化 3D 节奏钓鱼游戏。玩家从码头乘木舟进入相连的湖泊与河流，在持续的世界节拍中选择钓点，并通过鱼竿效果、环境节奏与鱼类性格完成捕获。

## English Overview

Rhythm Watershed is a modular 3D rhythm-fishing game. Players leave the dock by canoe, choose fishing locations across connected lakes and rivers, and combine rod effects, environmental rhythm, and fish personalities to complete each catch.

## 项目信息 / Project Facts

- 类型：个人项目，使用 Codex Agents 协作
- 职责：游戏设计、系统设计、程序开发、测试验证
- 工具：Godot 4.7、GDScript、GUT、Codex Agents
- 状态：可玩垂直切片；macOS 与 Windows 试玩包已发布

## 设计目标 / Design Goals

- 让玩家在五分钟内理解并完成首轮钓鱼闭环。
- 用水域 BPM、鱼类性格和鱼竿增益构成可读的区域差异。
- 保持节奏判定、表现和经济模块之间的清晰边界。

## 核心玩法 / Core Play

完整循环为码头准备、木舟航行、选择钓点、抛竿、等待、角力、收竿、出售和鱼竿升级。世界节拍在航行与钓鱼之间持续运行；抛竿后冻结本次环境快照，保证同一次钓鱼的规则稳定。

## 关键决策 / Key Decisions

- 用同一游戏时钟驱动输入判定、节奏卡、动画和音效。
- 让表现层只消费领域事件，不反向修改玩法结果。
- 用虚拟时间与固定种子测试节奏边界和随机行为。

## Links

- [GitHub repository and releases](https://github.com/tuitui0415/rhythm-watershed)

## Sources

Repository README, approved design specifications, and release `v0.1.0`.
