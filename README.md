# Seedance for Activepieces

Create a Seedance text-to-video task and retrieve the **same task ID** through Ace Data Cloud. The Piece has two actions: **Create Seedance video task** and **Get Seedance task**. A task ID means the request was accepted, not that the video is ready. [中文指南](README.zh-CN.md)

**Distribution:** Install `@acedatacloud/piece-seedance@0.1.0` as a custom Piece in your Activepieces instance. A public npm package does not automatically enter the shared Activepieces catalog.

## Install and connect

In Activepieces 0.92.2+, open **Platform Admin → Catalogue → Pieces → Install Piece → NPM Registry**. Enter `@acedatacloud/piece-seedance` and version `0.1.0`. Search for **Seedance by Ace Data Cloud** when adding a flow action, then check the logo and both actions.

Create a connection using an Ace Data Cloud API key with access to `/seedance/videos` and `/seedance/tasks`. Enter only the key, without `Bearer `. Keep it in the connection, never in a flow export. Check current [pricing](https://platform.acedata.cloud/models) and balance before generating.

## First flow

1. Add **Create Seedance video task**. Enter a text description. For a small first run, choose `doubao-seedance-2-0-mini-260615`, `480p`, 4 seconds, `16:9`, and leave **Generate audio** off.
2. Run creation **once** and save `task_id`. The action uses `callback_url` for asynchronous submission and has no HTTP retry. If a timeout or 5xx occurs, inspect request history before trying again: a task may already exist.
3. Add **Get Seedance task** and map **Task ID** from the creation output. Query that same ID until `status=succeeded` or `failed`. Pending media is not returned as final video.
4. Open a URL in `media_urls` only when `success=true`. A task lookup does not create or bill another video.

The [credential-free quickstart flow](https://raw.githubusercontent.com/AceDataCloud/SeedanceActivepieces/main/examples/seedance-quickstart.json) imports with both connections empty and the same task-ID mapping intact. Add your own connection before running. Creation retries are disabled in the sample.

The Piece offers three Seedance 2.0 text-to-video models and the common `480p`/`720p`, 4–15 second range. It does not claim to expose image/video/audio reference, edit, extend, or every advanced Seedance operation. Audio generation and model choice can change price.

An isolated Activepieces CE 0.92.2 instance accepted the build archive and ran **Get Seedance task** against an existing completed task. The flow returned `succeeded` and one final video URL. The creation action has not submitted a new paid video in this validation.

## Troubleshoot

| Result | Action |
| --- | --- |
| 401 / 403 | Check the API key, Seedance access, and Allowed APIs for both paths. |
| 400 | Check the model, text, duration, resolution, and ratio. |
| `pending` | Wait and query the same task ID; do not rerun creation. |
| 429 | Reduce concurrency and wait; avoid automatic paid retries. |
| Creation timeout or 5xx | Inspect request history before another submission. |
| `failed` | Use the task or trace ID to inspect the failed request. |

The Piece sends selected inputs and the API key only to `https://api.acedata.cloud`. It exposes final media URLs and removes internal routing fields from task output. [Source](https://github.com/AceDataCloud/SeedanceActivepieces) · [Support](https://github.com/AceDataCloud/SeedanceActivepieces/issues) · dev@acedata.cloud.
