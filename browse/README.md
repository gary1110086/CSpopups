# Browse / 五种日常浏览

Independent third version of CSpopups. The original Little Daily and the self-contained Stillwall experiment keep their own entry points and state.

Play: https://gary1110086.github.io/CSpopups/browse/?lang=en&v=browse2a

Scene selector: https://gary1110086.github.io/CSpopups/browse/launch.html?lang=en&v=browse2a

References and facilitator notes: https://gary1110086.github.io/CSpopups/browse/guide.html

## 内容 / Contents

Five task websites: wallpapers, recipes, image compression, film discovery and weekend outings. All use real document URLs, normal browser history and meaningful local interactions. Wallpaper download and image compression export real images. Food, film and route content is original; film listings and reviews are fictional. Outing guides are inspiration, not live schedules or ticket inventory.

Ten advertiser destinations: Cornhub, Form & Field, Framekind, Tiny Arcade, SecureLane, Orbit Player, AppHarbor, Lucky Circle, Perk Basket, NorthPost. Four represent ordinary irrelevant advertising, and six adapt documented fraud patterns. Every destination has multiple native query routes and interactions. Native advertiser tabs preserve the parent task.

## 随机与弹窗 / Randomization

`index.html` generates a seed and navigates directly to one of five scenes. The same seed gives the same scene and shuffled destination/format sequence. `launch.html` creates fresh seeds for its buttons. A facilitator can reproduce a combination by sharing a scene URL containing `seed=example`; the guide lists direct links to all destinations.

Shared scheduling starts after 20 seconds of active, focused scene browsing. Thresholds are 20/45/75/110 seconds, at most four interruptions per seed, one at a time, with at least 12 active seconds since dismissal. Hidden or unfocused documents do not advance this schedule. Closed advertisements and progress survive native navigation and refresh in the same tab. Browser Back/Forward restores the latest interruption state, including BFCache.

Four formats: dismissible corner card, a panel with a large misleading close-shaped advertiser link and a separate genuine small close button, a small low-prominence close card, and a conventional promotion with a decline option. Genuine dismissals and Escape remain available. Clicking an advertisement (including the misleading close-shaped link) opens a real new tab. If a browser blocks this, the card shows a normal fallback link. No mass tab opening, auto navigation on arbitrary content clicks, visible countdown or automatic ending is used in this version.

Native tab creation is subject to browser rules and installed extensions; the project cannot guarantee that every browser will permit it. Modifier clicks retain their ordinary browser behavior.

## 隐私 / Local state

`br-run-v1:<seed>` stores foreground pacing; `br-data-v1:<seed>:...` stores scene progress in sessionStorage. Destination modules use their own namespaced local session records. There is no account, backend, analytics, ad network or cross-device progress synchronization. Browser settings can prevent storage; the site remains usable with in-memory state until navigation.

Image processing happens locally. Work-in-progress uploaded image pixels remain in the open tab and are not persisted after leaving/reloading. Opening and closing an advertiser tab keeps that original document alive and retains its working image. Downloads that claim to install software and payments use a local educational endpoint with preset fictional data; no actual executable, payment, system permission or real credential collection is provided.

## References / attribution

See `guide.html`, `scene-references.json`, and `destination-references.json`. They separate legitimate layout references from documented scam cases and explicitly identify adaptations of SMS/email delivery vectors into browser advertisements. Ordinary advertising is not itself evidence of fraud. Third-party sites do not provide these ads or endorse the experience.

All eight Stillwall SVG works are original code-native artwork. Four additional wallpapers are original generated raster artwork (native1672×941), with lightweight WebP previews and native-size JPEG delivery. Larger raster wallpaper exports are resampled, not native4K. Film posters use project-owned generated contact-sheet crops with original title typography. The earlier geometric outing gallery has been replaced by a useful departure checklist. Non-explicit Cornhub covers are the project's existing generated contact sheet. `assets/recipe-photography.png`, `assets/outing-photography.png` and `assets/workspace-photography.png` are original eight-cell image sheets generated with the built-in ImageGen tool, 2026-10-23. Their prompts are recorded in `assets/ASSET-SOURCES.md`. No reference-site imagery or screenshots are bundled.

## Local preview / package

No build step. Serve repository root with `python -m http.server 5175 --bind 127.0.0.1`, then open `/browse/`. Relative paths support the GitHub Pages `/CSpopups/` prefix.

This folder intentionally shares `../wallpapers/assets/`, `../wallpapers/catalog.js` and `../assets/nightroom-contact-sheet.png`. Copying `browse/` alone is insufficient. The local release ZIP includes all of those dependencies. The original self-contained Stillwall ZIP remains separate.

For reproducible QA, append `ad=security` (or another destination ID) to a **scene** URL to pin the scheduled destinations. It never accelerates the real foreground timer. Normal launcher links omit this override. The guide is for facilitators and is separate from ordinary task pages.

## browse2 visual revision

This revision replaces the shared editorial concept style with category-specific layouts adapted from inspected primary sources: Wallhaven, Allrecipes, KLFoodie, Rotten Tomatoes, Squoosh/iLoveIMG, IKEA, itch.io,7-Zip/mpv and courier tracking conventions. See [DESIGN-NOTES.md](DESIGN-NOTES.md) for concrete structure changes and inspection limitations. No source-site code, logos or photographs are copied. Original entries outside browse/ remain separate.
