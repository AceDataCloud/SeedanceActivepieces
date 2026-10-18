# Seedance for Activepieces

通过 Ace Data Cloud 创建 Seedance 文生视频任务，并按**同一个任务 ID**查询结果。Piece 提供 **Create Seedance video task** 与 **Get Seedance task** 两个动作。拿到任务 ID 不代表视频已经完成。[English](README.md)

**分发方式：**在 Activepieces 实例中将 `@acedatacloud/piece-seedance@0.1.1` 作为自定义 Piece 安装。公开 npm 包不会自动进入 Activepieces 共享目录。

## 安装与连接

Activepieces 0.92.2+ 中进入 **Platform Admin → Catalogue → Pieces → Install Piece → NPM Registry**，填写 `@acedatacloud/piece-seedance` 和版本 `0.1.1`。在流程中搜索 **Seedance by Ace Data Cloud**，核对 Logo 和两个动作。

1. 在 [Ace Data Cloud Applications](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=seedance_activepieces_readme_api_key) 注册或登录。若没有通用应用，点击 **Initialize General Application**。
2. 打开通用应用或具备 **Seedance** 权限的应用。通用 Key 可访问账号已获授权的服务；专用 Key 仅限对应服务。
3. 使用应用卡片的复制按钮，或通过 **Manage Keys → Create** 创建名为 `Activepieces Seedance` 的独立 Key，按需设置有效期与用量限制。若启用 **Allowed APIs**，应同时包含 `/seedance/videos` 与 `/seedance/tasks`，创建后复制 Key。
4. 创建 Activepieces 连接，只填写 API Key 本身，不加 `Bearer `。`platform-...` 管理 Token 不是生成 API Key。Key 留在连接中，不写入流程导出。生成前查看当前[价格](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=seedance_activepieces_readme_pricing)与余额。

## 首次流程

1. 添加 **Create Seedance video task** 并填写文本描述。首次小样例可选 `doubao-seedance-2-0-mini-260615`、`480p`、4 秒、`16:9`，关闭 **Generate audio**。
2. **只运行一次**创建动作，保存输出的 `task_id`。动作使用 `callback_url` 异步提交，不设置 HTTP 重试。若超时或返回 5xx，先查[请求历史](https://platform.acedata.cloud/console/usages?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=seedance_activepieces_readme_request_history)再考虑重提；任务可能已被接收。
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

API 请求验证 HTTPS 证书，且仅访问 `api.acedata.cloud`。网络失败与 HTTP 错误不自动重试；重新创建前先查请求历史。此传输方式不支持 HTTPS 代理配置。

## 图文配置参考

![复制 Key 或管理密钥：真实脱敏 Ace 控制台](docs/screenshots/get-api-key-en.png)
![创建独立 Key：真实脱敏 Ace 控制台](docs/screenshots/create-api-key-en.png)
![官方 Activepieces 通用安装弹窗](docs/screenshots/install-piece.png)

2026-10-18 复用的真实/官方参考图，[固定来源与边界](docs/screenshots/onboarding-source.json)保留。安装图不是本 Piece 已被官方共享目录收录的证明。管理员安装后按服务名搜索并核对 **by Ace Data Cloud**；Key 只放动作连接。源码 PR、npm 发版、官方目录收录与真实首用分别验收。
