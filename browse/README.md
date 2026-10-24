# Browse — motion1

An independent, static multipage browsing exercise. The original Little Daily site and standalone Stillwall version keep their own runtime and entry points.

- **Task library:** https://gary1110086.github.io/CSpopups/browse/tasks.html?lang=en&v=motion1
- **Chinese task library:** https://gary1110086.github.io/CSpopups/browse/tasks.html?lang=zh&v=motion1
- **Random task:** https://gary1110086.github.io/CSpopups/browse/?task=random&lang=en&v=motion1
- **Free browsing:** https://gary1110086.github.io/CSpopups/browse/launch.html?lang=en&v=motion1
- **Facilitator answers:** tasks.html?mode=host&lang=zh&v=motion1
- **Benchmarks and documented scam cases:** guide.html

## Ten task websites

| Website | Searchable material and working functions |
|---|---|
| Stillwall |24 real photographic works:12 reusable scene photographs and12 historical NASA photographs. Combined search/facets, comparison, source records, save and real JPEG export. Fit/Fill preview matches output; delivered source dimensions and resampling are explicit. |
| Pantry & Plate |24 original bilingual recipes. Ingredient/diet/equipment/time/budget/allergen filters; scaled servings, checked ingredients/steps, substitutions, storage and TXT exports. Real reusable photographs are credited with subject limitations. |
| Out There KL |24 evergreen KL guides with area/budget/duration/weather/transport/walk filters, detailed stop orders, rain alternatives and source links. Saved plans export TXT/ICS. Real location photographs do not imply live conditions. |
| Frame Movies |24 real films:12 Blender open works and12 silent-era classics, with corresponding stills/posters. Real metadata, combined filters, watchlist and personal ratings. Three matching works include locally hosted licensed MP4 previews. |
| Pixelpress |Real local JPEG/PNG/WebP processing with6 photographic examples, measured bytes/dimensions, presets, before/after view and target-size mode. Real processed files; original credits retained. |
| Folio |20 editions of18 historical works. Actual covers/frontispieces, author/language/era/genre filters, edition facts, passages, reading list, bookmarks and TXT excerpts. |
| Open Collection |24 real Met Open Access objects, actual CC0 images, provenance, artist/date/material facets, image study, comparisons, curated exhibition and TXT labels. |
| Field Guide |18 North American birds, reusable real photographs, field marks, colour/size/habitat search, comparisons, sound where supplied, sightings and exports. The region is labelled. |
| Trackside |28-node KL rail planner with actual station names and interchanges, route alternatives, stop lists, saved trips and TXT/ICS exports. Journey times and service windows are demonstration data. |
| loop |18 fictional used-camera listings based on6 real models and attributed photographs. Multi-facet search,3-item comparison, accessory checks, local enquiry drafts, saved items and TXT exports. No messages are sent. |

## Thirty concrete tasks

The task library gives participants constrained searches instead of merely asking them to look around. Examples: compare the1968 and1972 Earthrise photographs; find a vegan no-cook chickpea lunch under15minutes; identify an indoor rail-accessible museum route; find Ian Hubert's2012 open film; export a1280-pixel image below100KB.

The independent task library retains all assignment briefs and manual criteria. In motion1, website pages continue to open without the top task/notes panel. Its implementation and existing stored notes are retained for possible later restoration; task evidence collection is paused while the panel is inactive. Scene-specific notes, saved items and exports continue to work. There is no automatic correctness score, gamebar, visible clock or automatic ending.

A shared URL reproduces the scene and task on another computer. Notes, saved choices and uploaded image pixels **do not sync between computers**. Opening the same URL on another computer starts a fresh browser session.

## Ten advertiser destinations

Cornhub, Form & Field, Framekind, Tiny Arcade, SecureLane, Orbit Player, AppHarbor, Lucky Circle, Perk Basket and NorthPost use separate category-specific layouts and native query routes. The first four represent ordinary/irrelevant promotions; the last six adapt documented fraud mechanisms, referenced in the guide.

This version deepens the destinations:8 shop products with size/finish variants, comparisons, bag and order summary;12 credited real photographs with real downloads;6 distinct playable games; three correctly attributed video clips; and persistent choices across six bounded teaching flows. Installers, payments, device scans, rewards and delivery records are fictional teaching endpoints. No real executable, card, password, permission request or credential collection is provided.

## Interruptions and browser behaviour

Only active, focused scene browsing advances the schedule. For a fresh seed, the first interruption appears after 8 active seconds. Each dismissal starts the next relative wait: 12, 14, 12, 16, 14, 12, 16, 14 and 18 active seconds, in that order. One seed allows at most ten interruptions, with only one pending at a time. Hidden or unfocused documents pause the schedule. Navigation, refresh and Back/Forward reconcile the authoritative per-tab state.

Six formats include a normal corner card, a panel with a large misleading close-shaped advertiser link and a separate small genuine close, a tiny-close card, a promotion with a decline choice, a bouncing card and a dodging card. For a fresh seed, the first six interruptions cover all six formats; interruptions 1 and 3 use the two moving formats in a seeded order. The normal ten-destination deck does not repeat a destination within its first cycle.

The bouncing card reflects off the visible viewport edges. The dodging card moves away as a mouse approaches its genuine close button. Both are nonmodal, stay within the visible viewport and allow internal scrolling on short screens. Focusing a card control with the keyboard freezes its movement so the close button and advertiser link remain reachable. Touch does not trigger dodging; a reduced-motion preference keeps both formats still. Escape and true dismissals work in all six formats. Modal formats make the website inert and keep keyboard focus inside the dialog.

An advertiser click opens a real native tab from the gesture, clears opener, and keeps the original task document alive. A visible native fallback remains if the browser blocks the tab. Modifier clicks retain normal browser behaviour. Ordinary content links are not intercepted by this independent edition.

## Privacy and storage

No account, backend, analytics, advertising SDK or runtime third-party asset fetch is required. Image pixels are processed locally. They remain in the existing tool document while advertiser tabs open and close, but are cleared when leaving/reloading that image page. Other task selections and notebooks use sessionStorage; inaccessible storage falls back to memory for that document.

Keys: `br-run-v2:<seed>` for pacing; `br-data-v1:<seed>:...` remains unchanged for scene state/notebooks; destination records have separate prefixes. When the v2 pacing key is absent, the existing `br-run-v1:<seed>` record is imported once into the new schedule. Later loads use v2, so an older document cannot overwrite the new pacing record. Seeds can be shared; saved work is local. The task library has a facilitator answer view and is not designed to hide answers from a determined participant.

## Media and attribution

- Real landscape, recipe, location and other revised photographs: assets/REAL-MEDIA-SOURCES.md and real-media.js.
- Historical book illustrations, excerpts and Met CC0 artwork: culture-SOURCES.md and assets/culture-manifest.json.
- Bird photographs/audio and rail references: journey-SOURCES.md and journey-media.js.
- Camera-model photographs and share-alike derivative notices: assets/MARKET-SOURCES.md and market-data.js.
- Historical NASA records, original dates, credits and usage guidance: assets/NASA-SOURCES.md.
- Actual Big Buck Bunny/Tears of Steel60-second excerpts and official52-second Sintel trailer: assets/VIDEO-SOURCES.md. CC BY3.0 footage, original sound and credits beside each player.
- Film stills and historical posters: movie-data.js, real-media.js and the media source register. Source footage licences and original poster rights are distinguished.
- Earlier generated assets retained for compatibility are documented in assets/ASSET-SOURCES.md; they are not documentary evidence.

Runtime media is served locally. Source/license/venue links open their sources only when clicked. Fictional listings and commercial licence examples do not change the original media licence. Creators and referenced organisations do not endorse this experience.

## Run or package

There is no build step. From repository root, run:

    python browse/preview-server.py --port 5175

Open http://127.0.0.1:5175/browse/tasks.html?lang=en&v=motion1 . This dependency-free preview server supports byte ranges for video seeking. A basic `python -m http.server` can display the pages but may limit video seeking in this environment. A file:// double click is not a supported preview for image exports and media.

The release ZIP includes browse/ plus its shared dependencies: wallpapers/catalog.js, wallpapers/assets/*.svg, assets/nightroom-contact-sheet.png, favicon.svg and .nojekyll. Copying browse/ alone is insufficient. The package includes START-HERE.txt and a SHA256 source manifest.

## 中文使用说明

本版提供十个可检索、可操作的日常网站与30项具体任务。网站内的顶部任务说明及笔记栏暂不显示，任务可在独立任务库查看。建议活动人员先打开任务库，给参与者一个明确目标，再让其自行检索、核对详情、收藏或导出。广告过程中打开真实标签，参与者可关闭广告标签并回到原任务。没有显示计时器，不会自动结束。

弹窗现在有六种：普通角落卡、带假关闭广告链接及独立真关闭键的模态框、小关闭键卡、带拒绝选项的推广、屏幕内反弹卡和鼠标接近 × 时整卡躲避的卡片。新 seed 的首次弹窗在前台专注浏览约8秒后出现；每次关闭后，依次等待12、14、12、16、14、12、16、14、18秒前台专注时间。同一 seed 最多十次，一次只保留一个待处理弹窗。前六次覆盖全部格式，第1和第3次分别安排两种移动卡，先后顺序随 seed 确定；正常的十个广告目的地一轮不重复。

两种移动卡不锁住背景。用键盘聚焦卡片控件会暂停移动，触屏操作不会触发躲避；系统启用减少动态效果时，两种卡片都保持静止。真正的关闭键和 Esc 都可关闭广告。切到后台或失去窗口焦点会暂停计时，刷新和浏览器前进、后退保留同一 seed 的安排。节奏改用 br-run-v2；首次没有 v2 记录时从旧 br-run-v1 导入一次，原 br-data-v1 场景数据与已有笔记保持不变。

两位工作人员可分别负责说明任务与观察操作，以及在另一台设备查看主持人答案和资料、引导结束讨论。不要替参与者点击；观察他如何筛选、核对、识别误导控件，以及是否能恢复原来的工作。

跨电脑可以共享链接，不能共享已保存的进度。出游预算和路线时间是规划示例，真实出行前应打开场馆来源核实。食谱过敏原筛选按所列食材执行，不能替代包装标签核对。具体授权来源均可在详情页或素材记录中查看。
