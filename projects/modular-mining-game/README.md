# 寻宝游戏 / Modular Mining Game

## 中文概述

《寻宝游戏》是一款 4-6 人实时风险决策游戏。玩家在探险中逐张选择继续或退出，并将单局收益带入私人报价、矿料加工和矿坑成长构成的长期循环。

## English Overview

Modular Mining Game is a 4-6 player real-time risk-decision game. Players repeatedly choose whether to continue or leave an expedition, then carry the result into private pricing, material processing, and long-term mine progression.

## 项目信息 / Project Facts

- 类型：个人项目，使用 Codex Agents 协作
- 职责：游戏设计、系统设计、程序开发、测试验证
- 工具：Go、SQLite、Godot Mod 设计、Codex Agents
- 状态：权威核心技术原型；Godot 客户端尚未完成

## 设计目标 / Design Goals

- 用公开风险与逐人私人报价制造玩家之间的决策张力。
- 让矿料加工和矿坑成长承接每次探险结算。
- 保护隐藏信息、幂等命令、结算一致性和质量守恒。

## 核心玩法 / Core Play

当前原型实现 35 张正式牌组、4-6 人房间、逐张继续或退出、个性化报价、原子支付与准备、房主开局、探险结算，以及可沿任意有效平面重复切割的矿料资产。

## 关键决策 / Key Decisions

- 房主、矿主与玩家身份彼此分离。
- 服务器只公开玩家允许观察的状态和矿料已暴露表面。
- 玩法测试矩阵明确区分已实现、未实现和需人工验证的内容。

## Links

- [GitHub repository](https://github.com/tuitui0415/modular-mining-game)

## Sources

Repository README, approved design specification, and confirmed gameplay scenario matrix.
