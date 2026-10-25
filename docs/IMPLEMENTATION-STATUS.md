# Implementation check / 功能核对

26 October 2026 · refine1. This checks the accepted requirements against the current implementation. 历史方案中后来被改掉的行为不作为缺失功能重新加回。

| Requirement / 要求 | Current implementation / 当前状态 |
| --- | --- |
| A shareable website, native pages and tabs / 可分享的真实网页 | Implemented. Static GitHub Pages routes, native anchors/GET forms and isolated advertiser tabs. Browser Back/Forward and reload retain session choices. |
| More ordinary task websites / 增加场景 | 10 websites and 30 bilingual assignments. Catalogue data, unique identifiers, task routes and 353 referenced local media files checked. |
| Useful depth and real media / 内容与互动深度 | Search, filters, details, saved lists/comparisons, book excerpts, bird calls, video previews, image processing and TXT/JPEG/ICS exports. Media and benchmark records remain linked from the guide. Not every film or bird has a playable clip. |
| Normal and scam-pattern advertising / 普通与骗局广告 | 10 distinct advertiser destinations. Four ordinary/irrelevant promotions and six documented teaching mechanisms, with reference/case records. |
| More overwhelming advertising / 增加密度 | First standard card at 3 focused seconds, further arrivals at 2.2–3.2s gaps, desktop maximum 4/mobile 2 concurrent, at most 30 arrivals. Ticker, leaderboard, rail and document placements remain. |
| Bouncing and full-screen evasion / 反弹与全屏闪避 | Implemented with viewport bounds and an edge preference. Each dodging card has a stable random 4–6 actual evasions, retained across reload/Back. |
| Faint, moved and fake closes / 透明、异位与假关闭 | Visible/dual/ghost styles and a shuffled close-layout deck. Includes upper-left, occasional lower-right, and fake upper-right with genuine upper-left. True controls dismiss only their own card. |
| Visible close after 10 seconds / 10秒显露关闭 | Ghost-only genuine close becomes conspicuous after 10 focused seconds and its card stops moving. Background and Cookie-dialog time do not count. |
| 30% moving-card collisions / 30%碰撞 | Implemented as a seeded session choice. Motion respects focus, touch, reduced motion, modals and the disclosed close. |
| Eight random encounters / 八种事件 | All eight implemented; each seed selects three applicable types. Chat, tab reminder, following video, search suggestions, escalating refusal offer, character, quiet/comeback and completion bonus depend on their relevant browsing actions. |
| Late ad displacement / 延迟挤位广告 | Implemented. Stable 60% site/session eligibility, 8–12 focused-second delay, no placeholder, persistent genuine dismissal. |
| Cookie choice maze / Cookie选择 | Implemented. Stable 70% automatic-banner eligibility after 6.5 focused seconds; footer settings on every scene, optional switches, real reject/custom saving. No tracking service is activated. |
| Manual facilitator review / 工作人员复盘 | Implemented with observed counts, a bounded timeline, discussion prompts, TXT export and separate deletion. Open manually in the participant's original tab. Typed text and image pixels are excluded. |
| Hide task panel and timer / 隐藏顶部任务栏与计时器 | Preserved. Briefs live in the separate task library; no automatic finish or correctness score. |
| Earlier Cornhub redirect / 早期Cornhub跳转 | Kept in the independent Little Daily/Stillwall prototypes. Current Browse opens advertiser tabs through ad controls and leaves genuine content navigation/downloads usable. |

## Fixes from this check / 本轮修复

- Frame Movies: revisiting a cached detail page now reloads the latest saved rating, rather than displaying the older document's value.
- loop: searching for a lens matches listings that actually include it; body-only listings no longer inherit the model's default-kit lens as a search term.
- Advertiser observation: middle-button opening now records one native/unconfirmed action while leaving the browser's tab-opening behaviour intact.
- Pixelpress: cancelling an image example while encoding prevents its unfinished continuation from restoring that cancelled example in the page address or status.
- Shared GET-form context wiring has one implementation for initial rendering and redraws. The facilitator guide now explains the new displacement/Cookie/review features and opens the latest local report without an unrelated seed.

See the [verification record](../browse/VERIFICATION.md) for checks and their practical limits. 本轮核对不等于逐项人工完成所有30道任务，也不代表所有浏览器都已测试。

[Open the chooser / 打开场景选择](https://gary1110086.github.io/CSpopups/browse/launch.html?lang=zh&v=refine1) · [Facilitator guide / 主持人说明](https://gary1110086.github.io/CSpopups/browse/guide.html?lang=zh&v=refine1)
