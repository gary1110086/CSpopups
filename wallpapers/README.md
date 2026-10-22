# Stillwall — independent wallpaper browsing prototype

Public entry: https://gary1110086.github.io/CSpopups/wallpapers/?lang=en&v=wallpaper1

中文入口：https://gary1110086.github.io/CSpopups/wallpapers/?lang=zh&v=wallpaper1

## Experience

An ordinary wallpaper catalogue with eight original illustrations, real category/search/detail navigation, saved wallpapers and actual JPG downloads at 1920×1080, 2560×1440 or 3840×2160. Downloads are rendered from self-contained SVG artwork in the browser. No API or build step is required.

A single dismissible sponsored card appears after 12 seconds of active foreground browsing. At 20 seconds, only a plain click on a PicVault sponsored download link follows redirect.html to the local fictional Cornhub catalogue. Normal download, preview, save, navigation and ad-close controls remain normal. Before the threshold and after the one-time redirect, that sponsored link leads to a local advertiser demonstration page. Browser Back skips the 240ms relay and returns directly to the previous page.

Active time pauses when the document is hidden, unfocused, or a site modal is open. No timer, score, automatic ending or replay UI is displayed. Saved items and redirect state are per-tab session (sw-visit-v1, sw-cornhub-v1), independent of the original Little Daily experience. Closing the tab ends its session.

## Run or publish

Serve this folder over HTTP:

    python -m http.server 5173 --bind 127.0.0.1

Then open http://127.0.0.1:5173/ . Keep the entire folder structure when publishing. It works at a domain root or a GitHub Pages repository subdirectory. Stillwall-standalone.zip is distributed locally with these files at the ZIP root; extract it before hosting.

## Files and attribution

- assets/*.svg and catalog.js: eight original digital illustrations and bilingual catalogue metadata created for this prototype; personal wallpaper use permitted.
- app.js, app.css and the catalogue/detail/about/sponsor HTML pages: independent Stillwall UI and state.
- redirect.html, cornhub.html, cornhub.js, cornhub.css: standalone local relay and destination adapter.
- vendor/: project-owned Cornhub rendering/styles and non-explicit artwork copied from the existing CSpopups prototype, retained as a self-contained snapshot. Shared CSS's local background asset is included too. No third-party runtime libraries, fonts, advertisements, tracking scripts or remote image dependencies are loaded.

The brands Stillwall, PicVault, Deskfolk and Cornhub are fictional teaching scenarios. The Cornhub catalogue uses the existing non-explicit cinematic artwork. Payment, player installation and browser notification requests are demonstrations; no credentials are collected, no payments processed, and no system notification permission is requested. Session records are not uploaded; GitHub handles normal hosting requests.

## 中文说明

这是独立于 Little Daily 的壁纸站试验版。先正常选图、预览和下载；约 12 秒后出现一张可关闭的广告卡片。累计前台浏览满 20 秒后，点击广告中的下载入口才会触发一次真实页面跳转。正常的壁纸下载、收藏、查看原图和关闭广告不会触发跳转。

图片可以真实下载，提供 Full HD、QHD、4K 三种 JPG 尺寸。分类、搜索、中英文、收藏和浏览器返回可用。站点没有倒计时或自动结束，状态仅保存在当前标签页会话中。本目录包含全部依赖，可以单独托管，原版入口与状态不受影响。
