# 精简工程包说明 / Clean Source Package Notes

公开工程包用于保存本人制作的关卡结构与项目配置，不是开箱即用的完整游戏构建。

## 包含 / Included

- Unreal Engine 项目描述文件与 Config 配置
- 本人制作的根级 Content 资源
- 关卡地图
- 与关卡地图匹配的 ExternalActors 与 ExternalObjects 记录

## 不包含 / Excluded

- Saved、Intermediate、DerivedDataCache、Binaries 与日志
- Content/Developers 中的个人临时内容
- Unreal Engine 基础角色、敌人 AI 与动作内容
- BlockoutTools 插件文件
- 未确认可重新分发的第三方内容

## 本地打开 / Opening Locally

1. 安装 Unreal Engine 5.6.1。
2. 准备项目所需的 Unreal Engine 基础内容。
3. 安装兼容版本的 BlockoutTools。
4. 解压工程包并打开项目描述文件。
5. 若编辑器提示资源缺失，请重新关联本地依赖；公开包不会复制这些依赖。
