# Documentation / 文档索引

The current experience is **Browse reflect1**: 10 task websites, 30 assignments, 10 advertiser destinations and eight possible random encounters. 每次体验选取三种适合当前网站的事件，由相关浏览操作触发。

## Start / 开始

| Entry / 入口 | Links / 链接 |
| --- | --- |
| Website chooser / 选择网站 | [English](https://gary1110086.github.io/CSpopups/browse/launch.html?lang=en&v=reflect1) · [中文](https://gary1110086.github.io/CSpopups/browse/launch.html?lang=zh&v=reflect1) |
| Task library / 任务库 | [English](https://gary1110086.github.io/CSpopups/browse/tasks.html?lang=en&v=reflect1) · [中文](https://gary1110086.github.io/CSpopups/browse/tasks.html?lang=zh&v=reflect1) |
| Manual review / 主动复盘 | [Open on the participant browser](https://gary1110086.github.io/CSpopups/browse/review.html?lang=en&v=reflect1); records stay in that browser tab. |
| Local package / 本地运行包 | [Release and download](https://github.com/gary1110086/CSpopups/releases/tag/v-reflect1); extract everything and follow `START-HERE.txt`. |

## Project documents / 项目文档

| Document / 文档 | Contents / 内容 |
| --- | --- |
| [Project overview](../README.md) · [中文概览](../README.zh-CN.md) | How to play, current features, local setup, privacy and media credits. |
| [Release history / 版本记录](CHANGELOG.md) | Current changes and a compact history of the main development milestones. |
| [Browse implementation](../browse/README.md) | Scene capabilities, event triggers, storage, browser controls and packaging. |
| [Design references](../browse/DESIGN-NOTES.md) | Category-specific layouts and reference decisions. |
| [Verification record](../browse/VERIFICATION.md) | Recorded checks and their limits, including media, exports, native tabs and cached browser returns. |
| [Live reference and scam guide](https://gary1110086.github.io/CSpopups/browse/guide.html?lang=en&v=reflect1) | Benchmark websites and documented deceptive mechanisms. |
| [Little Daily runtime](../prototypes/little-daily/README.md) | Earlier article-site implementation and the root HTML routes that still use it. |
| [Standalone Stillwall](../wallpapers/README.md) | Independent wallpaper prototype, its runtime and original artwork. |

## Repository and existing URLs / 目录与旧网址

`browse/` is the current app. `prototypes/little-daily/` groups the earlier article site's six JavaScript/CSS files; its original root HTML entry URLs, including `index.html` and `article.html`, remain in place. The repository root website still opens Little Daily. Use the Browse chooser above for the current experience.

`wallpapers/` remains an independent prototype and supplies catalogue/artwork dependencies to Browse. `assets/` also contains shared resources. Serve the entire repository root, or use the complete release package; copying only `browse/` omits required files. Each experience keeps its own state, and sharing a URL does not synchronize progress across computers.

## Media sources / 素材来源

- [Real photographs and revised scene media](../browse/assets/REAL-MEDIA-SOURCES.md)
- [Film clips](../browse/assets/VIDEO-SOURCES.md) and [film stills](../browse/assets/OPEN-FILM-STILLS.md)
- [NASA photographs](../browse/assets/NASA-SOURCES.md)
- [Historical books and museum objects](../browse/culture-SOURCES.md)
- [Bird photographs, audio and rail references](../browse/journey-SOURCES.md)
- [Camera photographs](../browse/assets/MARKET-SOURCES.md)
- [Earlier generated assets](../browse/assets/ASSET-SOURCES.md) and [README screenshot credits](../assets/README-PREVIEW.md)

Individual media retain their source licences. The exercise's advertiser identities, simulated transactions and rewards are fictional; referenced creators and institutions do not endorse the project. 普通广告与骗局教学案例同时存在，真实的图片、文本和日历导出仍可使用。
