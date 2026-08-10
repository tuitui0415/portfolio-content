# 技术概览 / Technical Overview

## 环境 / Environment

- Unreal Engine 5.6.1
- Blueprint
- BlockoutTools
- PawnSensing

## 玩法实现 / Gameplay Implementation

- 升降机：碰撞区域触发 Z 轴位置变化，并配合动画表现移动过程。
- 单向门：碰撞触发开关门，同时调整触发区域的位置，使其只能从指定方向启动。
- 动态水位：沿 Z 轴移动水体，使用与升降机相近的触发逻辑改变可通行空间。
- 敌人侦测：使用 PawnSensing 判断玩家是否进入敌人视野，并以材质变化反馈侦测状态。

## 依赖说明 / Dependencies

角色、敌人 AI 与动作使用 Unreal Engine 基础内容；灰盒搭建使用 BlockoutTools。为避免重新分发依赖内容，公开精简工程包仅保留本人制作的关卡配置、地图与相关对象记录。使用者需在本地准备兼容的引擎内容与插件。
