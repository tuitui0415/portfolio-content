# 可解释的 NSFW 文本审核 / Interpretable NSFW Text Moderation

## 中文概述

该团队项目将 RoBERTa 分类器、RISE 特征归因与后验概念瓶颈模型组合为可解释文本审核系统。界面通过词元显著性热图、概念激活条形图和词元—概念矩阵，同时呈现局部文本证据与高层概念解释。

## English Overview

This team project combines a RoBERTa classifier, RISE feature attribution, and a post-hoc concept bottleneck model for interpretable text moderation. Its interface presents local text evidence and higher-level concepts through a token-saliency heatmap, concept-activation bars, and a token–concept matrix.

## 魏允瀚的贡献 / Yunhan Wei's Contribution

- 可视化与用户体验 / Visualization and UX
- Streamlit 仪表板设计与前端实现 / Streamlit dashboard design and front-end implementation
- 可用性研究工具设计 / Usability-study instruments
- 对解释可读性问题的整理 / Documentation of explanation-readability issues

## 团队成果与分工边界 / Team Results and Attribution

Raymond Kang 负责基础模型微调、RISE 适配、概念头训练、数据集、指标及研究执行。报告中的 0.8705 验证准确率属于团队系统成果，不作为魏允瀚个人模型训练成果。

Raymond Kang handled base-model fine-tuning, RISE adaptation, concept-head training, datasets, metrics, and study execution. The reported 0.8705 validation accuracy is a team-level system result and is not presented as Yunhan Wei's individual model-training result.

## 已知限制 / Known Limitations

- 分词器特殊符号与前导空格标记影响界面可读性
- “sexual content”概念存在样本不均衡
- 因时间限制，可用性研究尚未执行

## 项目材料 / Project Materials

- [Project report](assets/interpretable-nsfw-text-moderation-report.pdf)
- [Raymond Kang's public repository branch](https://github.com/RaymondHKang/ECS289HFinalProject/tree/raymondbranch)

## 待补充 / Open Questions

- 项目完成日期
- 可公开的在线演示或界面截图
