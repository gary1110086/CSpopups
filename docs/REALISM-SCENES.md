# Everyday hosts — realism1

This source branch adds two everyday hosts to One Minute. It has 12 booth tasks, 12 host websites, and 32 optional untimed briefs. The existing 10 historical booth briefs and 30 library briefs remain available. GitHub Pages publication has not been verified for this branch.

## Preview

From the repository root run `python browse/preview-server.py --port 5175`.

- [Booth / 展台](http://127.0.0.1:5175/browse/booth.html?lang=zh&v=realism1)
- [TrackMY / 包裹查询](http://127.0.0.1:5175/browse/courier.html?lang=zh&v=realism1)
- [Findline / 搜索结果](http://127.0.0.1:5175/browse/search.html?q=Pixelpress&lang=zh&v=realism1)

Choose the two new tasks at the bottom of the booth list, or draw a task. Use Staff tools → ad-free mode for a baseline trial. Existing foreground ad density and the absolute 60-second activity deadline are unchanged.

## TrackMY: normal path and lure

Enter **TM24081301**. The logistics timeline ends in an attempted delivery; its sample dates are relative to today. Under the timeline choose tomorrow, **Afternoon / 14:00–18:00**, retain **Campus parcel desk, Sepang**, and save the free redelivery. The page confirms the saved local request at RM0.00. Other tracking examples are TM24081302 (another eligible parcel), TM24081303 (delivered) and TM24081304 (returned, no redelivery form).

The address field accepts only the listed fictional practice locations. No request reaches a carrier; there is no real booking, payment, identity collection or account login. Rates/branches are illustrative. The saved request remains after reload and native Back/Forward. Changing away from the requested date/window/address revokes the task evidence. Evidence reads the actual saved schedule, not the derived completion marker.

The first floating lure offers a separate **NorthPost** redelivery/verification at RM3; an ordinary storage advertisement and other simulated offers follow. A link opens the existing advertiser destination in an isolated native tab. It never changes the TrackMY delivery request. This fee contrast belongs to these fictional services; do not teach it as a universal rule about real carriers.

## Findline: normal path and lure

Search **Pixelpress**. Two sponsored text results use **pixelpress-download.example** and **pixelpress-check.example**; their links open the existing AppHarbor / SecureLane demonstrations. Read the domain and sponsored disclosure. In this task, the requested reference source is **pixelpress.example** in the organic result below them. Open it in the original tab and download **pixelpress-getting-started.txt**.

The official-reference page is local. The genuine download is a bilingual UTF-8 TXT guide, not an executable or installer. Domains use reserved `.example` labels; they are displayed teaching references, not live websites. The search is a deliberately small index with honest no-results states for other queries. Do not generalize the exercise to “all sponsored results are scams” or “every organic result is safe”; the task is to verify a requested source.

Only the normal official page and its dispatched TXT download provide task evidence. Sponsor clicks never complete the task. A dispatched download does not prove the user saved a file to disk; staff can inspect the actual file. Individual sponsor closes hide only that result; Escape clears them for that document and bubbles to the existing engine to clear other ads. Native Back can restore results with authoritative dismissal state. Valid ad-free rounds remove complete sponsor blocks.

## Implementation boundaries

New renderers use the existing `C` engine contract and `br-data-v1:<seed>:...` storage. Courier records are in `courier-reschedules`; search progress uses `search-official-visits` and `search-official-downloads`. These are local records, never network submissions. State mutations reread current storage. Both hosts suspend writes on pagehide, reconcile after two animation frames on cached pageshow, and stop handlers on round end.

`engine.js` retains only `[data-host-sponsored]` authored advertisements in an ad round, while clean rounds remove them. Shared native ad routing provides null opener and blocked-popup fallback. New scenes are in `scene-registry.js` and the review logger allowlist. All 16 engine documents load each renderer and stylesheet once. Cache tag: `realism1`; pacing remains `br-run-v9`, booth schema `br-booth-v1`. The ad stack, clock lifecycle, staff judgement/handoff, poster CSS, existing advertiser destinations, root site and independent wallpapers runtime are preserved.

The broader proposal's general-market reskin and optional account-security host remain future scope. No first-time-participant completion-time claim has been established.

## Verification on 13 November 2026

Actual installed Chrome: **83 checks** passed for the integrated routes, normal and false paths, real TXT contents, native advertiser tab/null opener, blocked fallback, Escape, native GET query/round context, real reload/Back/BFCache, stale marker and malformed storage, old 10 host smoke checks, and desktop 1440 plus phone 390/320 layouts. No application runtime errors or failed local assets in the passing run. Repository-prefix navigation was exercised through a local directory alias.

A separate **5-check real-time run** retained the original deadline after a reload at about 25 seconds, and reached timeout after **60,201 ms observed**, with **60,000 ms stored duration**. No accelerated-clock fixture is used as evidence for real expiry. These are per-run assertions, not 88 independent participant journeys. Independent spec and code-quality reviews passed. All 55 browse JS files passed syntax checks; 784 HTML local references resolved. Protected source/legacy comparisons passed.

Evidence and temporary runners are outside the repository in the Codex visualization workspace for this chat (`realism-qa-result.json`, `realism-expiry-result.json`, desktop/phone PNGs). Chrome only; other browsers, OS focus switching and first-time-player difficulty have not been established. Exact Pages deployment/public bytes are required before claiming publication.
