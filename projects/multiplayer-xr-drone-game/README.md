# 多人 XR 无人机游戏 / Multiplayer XR Drone Game

## 中文概述

这是一个在 UC Davis 2026 年春季学季完成的多人 XR 无人机游戏原型。系统使用 ZED 相机获取空间追踪数据，在 Unity 中完成尺度、偏航和真实地面校准，并通过 Photon PUN 将统一校准结果与游戏状态同步给多名玩家。

## English Overview

This multiplayer XR drone-game prototype was completed at UC Davis in Spring 2026. It uses ZED camera tracking to calibrate scale, yaw, and the real floor in Unity, then synchronizes a shared calibration result and gameplay state through Photon PUN.

## 技术与设计重点 / Technical and Design Focus

- Unity、C#、ZED Camera / SDK、Photon PUN 与 CUDA
- 稳健多锚点相似变换拟合，降低异常标定点的影响
- 在线校准修正与主机权威校准快照
- 将空间校准流程整合进可玩的无人机游戏循环

## 成果边界 / Current Scope

当前成果为使用 ZED 相机验证核心体验的可玩原型。报告明确指出实体无人机尚未稳定运行，因此实体无人机集成不作为已完成成果描述。

## 项目材料 / Project Materials

- [Final report](assets/multiplayer-xr-drone-game-final-report.pdf)
- [Demo 1](https://drive.google.com/file/d/1xxeWGSNKx0s91qBrPC__3XJ4tc_GEtFq/view?usp=drive_link)
- [Demo 2](https://drive.google.com/file/d/1jNFdSLS08G4SvIFyNn2V92enObmsLwWD/view?usp=sharing)
- [Demo 3](https://drive.google.com/file/d/18aeK2iHkyKFJPNtePuEJAAJN1gW3l3Zw/view?usp=sharing)

## 待补充 / Open Questions

- 团队人数与成员分工
- 可公开的源代码仓库
