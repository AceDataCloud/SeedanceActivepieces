# Seedance for Activepieces

Create a Seedance text-to-video task and retrieve the **same task ID** through Ace Data Cloud. The Piece has two actions: **Create Seedance video task** and **Get Seedance task**. A task ID means the request was accepted, not that the video is ready. [中文指南](README.zh-CN.md)

**Distribution:** Install `@acedatacloud/piece-seedance@0.1.1` as a custom Piece in your Activepieces instance. A public npm package does not automatically enter the shared Activepieces catalog.

## Install and connect

In Activepieces 0.92.2+, open **Platform Admin → Catalogue → Pieces → Install Piece → NPM Registry**. Enter `@acedatacloud/piece-seedance` and version `0.1.1`. Search for **Seedance by Ace Data Cloud** when adding a flow action, then check the logo and both actions.

1. Register or sign in at [Ace Data Cloud Applications](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=seedance_activepieces_readme_api_key). If you have no General application, choose **Initialize General Application**.
2. Open a General application or an application with **Seedance** access. A General key can access the services your account is entitled to use; a service-specific key is limited to that service.
3. Use the application's copy button, or choose **Manage Keys → Create** to create a separate key named `Activepieces Seedance`. Set expiry and usage limits as needed. If you restrict **Allowed APIs**, include both `/seedance/videos` and `/seedance/tasks`, then copy the key.
4. Create an Activepieces connection and enter only the API key, without `Bearer `. A `platform-...` management token is not a generation API key. Keep the key in the connection, never in a flow export. Check current [pricing](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=seedance_activepieces_readme_pricing) and balance before generating.

## First flow

1. Add **Create Seedance video task**. Enter a text description. For a small first run, choose `doubao-seedance-2-0-mini-260615`, `480p`, 4 seconds, `16:9`, and leave **Generate audio** off.
2. Run creation **once** and save `task_id`. The action uses `callback_url` for asynchronous submission and has no HTTP retry. If a timeout or 5xx occurs, inspect [request history](https://platform.acedata.cloud/console/usages?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=seedance_activepieces_readme_request_history) before trying again: a task may already exist.
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

API requests verify HTTPS certificates and stay on `api.acedata.cloud`. Transport failures and HTTP errors are not retried automatically; inspect request history before resubmitting a creation. HTTPS proxy configuration is not supported by this transport.

## Visual setup references

![Copy a key or open Manage Keys: real redacted Ace console](docs/screenshots/get-api-key-en.png)
![Create a dedicated key: real redacted Ace console](docs/screenshots/create-api-key-en.png)
![Official Activepieces generic installation dialog](docs/screenshots/install-piece.png)

References reused on 2026-10-18; [fixed sources and limits](docs/screenshots/onboarding-source.json). The installation picture is an official generic reference, not proof this Piece is in the shared catalog. After administrator installation, search the service name, select **by Ace Data Cloud**, and keep the raw API key in the action connection. Source PR, immutable npm release, official shared-catalog acceptance and first use are separate stages.
