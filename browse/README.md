# Browse — deep1

An independent, static multipage browsing exercise. The original Little Daily site and standalone Stillwall version keep their own runtime and entry points.

- **Task library:** https://gary1110086.github.io/CSpopups/browse/tasks.html?lang=en&v=deep1
- **Chinese task library:** https://gary1110086.github.io/CSpopups/browse/tasks.html?lang=zh&v=deep1
- **Random task:** https://gary1110086.github.io/CSpopups/browse/?task=random&lang=en&v=deep1
- **Free browsing:** https://gary1110086.github.io/CSpopups/browse/launch.html?lang=en&v=deep1
- **Facilitator answers:** tasks.html?mode=host&lang=zh&v=deep1
- **Benchmarks and documented scam cases:** guide.html

## Five task websites

| Website | Searchable material and working functions |
|---|---|
| Stillwall |24 works:8 original vectors,4 original generated artworks,12 historical NASA photographs. Combined word/exclusion search, source/colour/tone/minimum-width facets, three-image comparison, real source records, saved choices and local JPEG downloads at1920/2560/3840 widths. Fit preserves the complete image; Fill crops the edges, matching the preview. Larger raster outputs are resampled. |
| Pantry & Plate |24 original bilingual recipes with matching original imagery, ingredient search, diet/equipment/total-time/budget/allergen-exclusion facets. Detailed ingredients, scaled servings, checked pantry and cooking steps, storage/substitution tips, save, print and actual recipe TXT export. Budgets are estimates. |
| Out There KL |24 original evergreen outing guides. Area, budget, duration, weather, transport and walk filters; detailed stop order, transit, cost estimates, rain alternatives, access notes, preparation checks and primary venue links. Saved weekend planner exports TXT and ICS. Generated illustrations are labelled, not passed off as exact documentary photos. |
| Frame Movies |24 entries:12 explicitly fictional film concepts and12 real Blender open films. Collection/genre/language/year/runtime/playable facets, director search, detailed sources/crew and watchlist. Three matching films have real locally hosted MP4 excerpts/trailer with sound and native controls. Other real entries link official project sources. |
| Pixelpress |Real local image conversion, resize and compression,6 usable examples, presets, before/after views, dimensions and byte counts. Target-size mode searches for quality that meets an upload limit and reports failure honestly when it cannot. JPEG/PNG/WebP downloads contain actual processed pixels. |

## Fifteen concrete tasks

The task library gives participants constrained searches instead of merely asking them to look around. Examples: compare the1968 and1972 Earthrise photographs; find a vegan no-cook chickpea lunch under15minutes; identify an indoor rail-accessible museum route; find Ian Hubert's2012 open film; export a1280-pixel image below100KB.

Each assignment offers a collapsible brief, manual criteria, a local result notebook, current-page evidence and TXT note export. Notes survive native scene navigation, reload and Back/Forward, including BFCache. Downloads/video playback can add evidence, but task completion is participant-reported. There is no automatic correctness score, gamebar, visible clock or automatic ending.

A shared URL reproduces the scene and task on another computer. Notes, saved choices and uploaded image pixels **do not sync between computers**. Opening the same URL on another computer starts a fresh browser session.

## Ten advertiser destinations

Cornhub, Form & Field, Framekind, Tiny Arcade, SecureLane, Orbit Player, AppHarbor, Lucky Circle, Perk Basket and NorthPost use separate category-specific layouts and native query routes. The first four represent ordinary/irrelevant promotions; the last six adapt documented fraud mechanisms, referenced in the guide.

This version deepens the destinations:8 shop products with size/finish variants, comparisons, bag and order summary;12 original stock assets with real downloads;6 distinct playable games; three correctly attributed video clips; and persistent choices across six bounded teaching flows. Installers, payments, device scans, rewards and delivery records are fictional teaching endpoints. No real executable, card, password, permission request or credential collection is provided.

## Interruptions and browser behaviour

Only active, focused scene browsing advances the schedule. Thresholds remain20/45/75/110seconds, at most four interruptions per seed, one pending at a time, and at least12active seconds since dismissal. Hidden or unfocused documents pause the schedule. Navigation, refresh and Back/Forward reconcile the authoritative per-tab state.

Formats include a normal corner card, a panel with a large misleading close-shaped advertiser link and a separate small genuine close, a tiny-close card, and a promotion with a decline choice. Escape and true dismissals work. Modal formats make both the scene and assignment notebook inert and keep keyboard focus inside the dialog.

An advertiser click opens a real native tab from the gesture, clears opener, and keeps the original task document alive. A visible native fallback remains if the browser blocks the tab. Modifier clicks retain normal browser behaviour. Ordinary content links are not intercepted by this independent edition.

## Privacy and storage

No account, backend, analytics, advertising SDK or runtime third-party asset fetch is required. Image pixels are processed locally. They remain in the existing tool document while advertiser tabs open and close, but are cleared when leaving/reloading that image page. Other task selections and notebooks use sessionStorage; inaccessible storage falls back to memory for that document.

Keys: br-run-v1:<seed> for pacing; br-data-v1:<seed>:... for scene state/notebooks; destination records have separate prefixes. Seeds can be shared; saved work is local. The task library has a facilitator answer view and is not designed to hide answers from a determined participant.

## Media and attribution

- Original generated art and recipe/outing imagery: assets/ASSET-SOURCES.md and assets/DEEP-A-SOURCES.md.
- Twelve historical NASA photographs, original record IDs/dates/credits/files and usage guidance: assets/NASA-SOURCES.md.
- Actual Big Buck Bunny and Tears of Steel60-second excerpts, and the official52-second Sintel trailer: assets/VIDEO-SOURCES.md. CC BY3.0 footage, credited beside each player. Excerpt duration is separate from full-film runtime. Original sound retained; no captions are supplied.
- Nine additional real open-film stills, exact public source URLs and project license evidence: assets/OPEN-FILM-STILLS.md and movie-data.js.

All runtime media is served locally. Source/license/venue anchors may open the third-party source when deliberately clicked. Reference sites and creators do not endorse the experience. No proprietary site, article or media collection was copied wholesale.

## Run or package

There is no build step. From repository root, run:

    python browse/preview-server.py --port 5175

Open http://127.0.0.1:5175/browse/tasks.html?lang=en&v=deep1 . This dependency-free preview server supports byte ranges for video seeking. A basic `python -m http.server` can display the pages but may limit video seeking in this environment. A file:// double click is not a supported preview for image exports and media.

The release ZIP includes browse/ plus its shared dependencies: wallpapers/catalog.js, wallpapers/assets/*.svg, assets/nightroom-contact-sheet.png, favicon.svg and .nojekyll. Copying browse/ alone is insufficient. The package includes START-HERE.txt and a SHA256 source manifest.

## 中文使用说明

本版提供五个可检索、可操作的日常网站与15项具体任务。建议活动人员先打开任务库，给参与者一个明确目标，再让其自行检索、核对详情、收藏或导出。广告过程中打开真实标签，参与者可关闭广告标签并回到原任务。没有显示计时器，不会自动结束。

两位工作人员可分别负责说明任务与观察操作，以及在另一台设备查看主持人答案和资料、引导结束讨论。不要替参与者点击；观察他如何筛选、核对、识别误导控件，以及是否能恢复原来的工作。

跨电脑可以共享链接，不能共享已保存的进度。出游预算和路线时间是规划示例，真实出行前应打开场馆来源核实。食谱过敏原筛选按所列食材执行，不能替代包装标签核对。具体授权来源均可在详情页或素材记录中查看。
