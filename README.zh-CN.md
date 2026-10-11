# Seedance for Activepieces

通过 Ace Data Cloud 创建 Seedance 文生视频任务，并按**同一个任务 ID**查询结果。Piece 提供 **Create Seedance video task** 与 **Get Seedance task** 两个动作。拿到任务 ID 不代表视频已经完成。[English](README.md)

**分发方式：**在 Activepieces 实例中将 `@acedatacloud/piece-seedance@0.1.0` 作为自定义 Piece 安装。公开 npm 包不会自动进入 Activepieces 共享目录。

## 安装与连接

Activepieces 0.92.2+ 中进入 **Platform Admin → Catalogue → Pieces → Install Piece → NPM Registry**，填写 `@acedatacloud/piece-seedance` 和版本 `0.1.0`。在流程中搜索 **Seedance by Ace Data Cloud**，核对 Logo 和两个动作。

创建连接时使用同时有 `/seedance/videos` 与 `/seedance/tasks` 权限的 Ace Data Cloud API Key。只填写 Key 本身，不加 `Bearer `；Key 留在连接中，不写入流程导出。生成前查看当前[价格](https://platform.acedata.cloud/models)与余额。

## 首次流程

1. 添加 **Create Seedance video task** 并填写文本描述。首次小样例可选 `doubao-seedance-2-0-mini-260615`、`480p`、4 秒、`16:9`，关闭 **Generate audio**。
2. **只运行一次**创建动作，保存输出的 `task_id`。动作使用 `callback_url` 异步提交，不设置 HTTP 重试。若超时或返回 5xx，先查请求历史再考虑重提；任务可能已被接收。
3. 添加 **Get Seedance task**，将 **Task ID** 映射为创建动作输出。只查询同一个 ID，直到 `status=succeeded` 或 `failed`。pending 时不展示最终视频链接。
4. 仅当 `success=true` 时打开 `media_urls`。查询不会再次创建视频或计费。

[无密钥首跑流程](https://raw.githubusercontent.com/AceDataCloud/SeedanceActivepieces/main/examples/seedance-quickstart.json) 导入后两个连接均为空，任务 ID 映射保留。运行前请配置自己的连接；样例已关闭创建动作的自动重试。

Piece 提供三个 Seedance 2.0 文生视频模型，以及通用的 `480p`/`720p`、4–15 秒选项。它尚未涵盖图片/视频/音频参考、编辑、延长等高级操作。音频生成与模型选择可能影响价格。

隔离的 Activepieces CE 0.92.2 实例已接受构建归档，并通过 **Get Seedance task** 查询既有完成任务；流程返回 `succeeded` 和 1 个最终视频 URL。本轮未通过创建动作提交新的付费视频任务。

## 排障

| 现象 | 处理 |
| --- | --- |
| 401 / 403 | 核对 Key、Seedance 权限和两个路径的 Allowed APIs。 |
| 400 | 核对模型、文本、时长、分辨率和画幅比例。 |
| `pending` | 等待并查询同一任务 ID，不重跑创建。 |
| 429 | 降低并发，避免自动重试付费创建。 |
| 创建超时或 5xx | 先检查请求历史，再考虑再次提交。 |
| `failed` | 用任务或 Trace ID 查失败原因。 |

Piece 只向 `https://api.acedata.cloud` 发送所选输入和 API Key，仅在终态返回媒体 URL，并过滤内部路由字段。[源码](https://github.com/AceDataCloud/SeedanceActivepieces) · [支持](https://github.com/AceDataCloud/SeedanceActivepieces/issues) · dev@acedata.cloud。
