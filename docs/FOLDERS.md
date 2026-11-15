# 文件夹说明 / Folder guide

日常从 `browse/booth.html` 进入「一分钟挑战」。项目是静态网站，服务器要从整个项目根目录运行，不能只复制 `browse/`。

## 当前网站与资料

| 位置 | 用途 |
| --- | --- |
| `browse/` | 当前网站：一分钟挑战、十二个任务网站、广告页与自由浏览。 |
| `docs/` | 使用说明、任务答案、设计说明、版本记录。先看[文档索引](README.md)。 |
| `docs/images/` | 当前中英文实拍截图；早期截图在 `history/`。 |
| `docs/history/` | 旧版开发说明和核对记录，与当前玩法分开。 |
| `assets/` | 项目共享图片和图标，部分被当前网站引用。 |
| `wallpapers/` | 独立 Stillwall 原型，也为 Browse 提供部分目录和素材。 |
| `prototypes/little-daily/` | 较早的 Little Daily 文章站运行代码。 |
| 根目录公开 HTML | 保留 Little Daily 等旧入口；当前挑战是 `browse/booth.html`。 |

本地预览，在项目根目录运行：

```powershell
python browse/preview-server.py --port 5175
```

然后打开 [一分钟挑战](http://127.0.0.1:5175/browse/booth.html?lang=zh&v=audio1)。

## 本机归档

以下目录只在本地保留，不发布到公共仓库；新克隆的仓库不会带有这些文件。

| 位置 | 收纳内容 |
| --- | --- |
| `archives/releases/browse/` | Browse 各历史版本 ZIP；原文件名和内容保留。 |
| `archives/releases/little-daily/` | Just One Minute 早期文章站与游戏 ZIP。 |
| `archives/releases/stillwall/` | Stillwall 独立版 ZIP。 |
| `local/notes/` | 原根目录方案、规格、待办和迭代记录，按 booth/specs/ideas/plans 分类。 |
| `local/design/` | 原 `design/`：概念图、设计方向和早期研究。 |
| `local/qa/scoring/` | 原 `TEMP/`：评分检查脚本、截图、日志与冻结证据。 |
| `local/qa/scenes/` | 原 `output/`：场景验证、截图、发布记录与历史迁移脚本。 |
| `local/launchers/` | 原 `Start-game.cmd` / `Start-booth.cmd`，仍打开早期文章站。 |
| `local/organization/` | 本次整理的移动清单、整理前 SHA256、路径调整原稿与验证结果。 |
| `prototypes/legacy-booth/` | 已无当前页面引用的早期 `booth.js` / `booth.css`。 |
| 本机根目录 `legacy.html`、`app.js`、`booth.html` | 原版游戏和本地兼容入口；这些文件不在公共仓库中。 |

ZIP 是历史快照；`cleaner1` 也早于当前一分钟挑战，不应当作当前源码的安装包。归档不代表重新验证或发布了这些旧版本。

历史记录中的 `TEMP/...` 对应现在的 `local/qa/scoring/...`，`output/...` 对应 `local/qa/scenes/...`。冻结记录保留原文；顶层评分脚本已调整文件路径。旧脚本里的历史业务断言不因此成为当前验收标准。

## 后续文件放哪里

- 网站代码和被页面引用的素材，继续留在各自运行目录；不要按文件扩展名拆开。
- 对外说明放 `docs/`；内部方案放 `local/notes/`。
- 新截图、日志和检查结果放 `local/qa/<任务名>/`。
- 新 ZIP 放 `archives/releases/<系列>/`，保留版本名。
- `.git/`、`.claude/`、`.superpowers/` 是工具目录，保留原位；`AGENTS.md` 是本机项目交接。

The current app is in `browse/`. Shared assets and old HTML entry routes remain in place. Local ZIPs, working notes and QA records are grouped under `archives/` and `local/`; their original paths are mapped above. No build step is required.
