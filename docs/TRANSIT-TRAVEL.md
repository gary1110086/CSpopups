# Trackside and Out There — transit1

Local source revision, 13 November 2026. This document does not establish a Pages deployment. The project now targets desktop use; this revision was checked in Chrome at 1440×960 and 1280×800.

## Trackside

The existing planner, time-dependent routing model and rail data remain in place. Its inline SVG now shows all 28 platform records, 25 ride segments and five dashed walking links. Nine interchange platforms use double rings. The selected route highlights its actual graph edges; other segments fade. Line controls emphasize KJ, KG or MR without changing the selected route preference.

Platform circles and labels are native station links, including keyboard navigation. Platform pages retain their existing origin/destination controls. The complete text station and interchange list remains below the diagram. The map is a schematic of three modeled corridors, not a geographical map or the complete Klang Valley network.

The existing KLCC (KJ) → Bukit Bintang (KG), 17:20, Less walking task retains its original answer and assessment. Its route instructions now refer to the map and line codes. The model still selects the Pasar Seni KJ/KG connection and nine minutes of total walking.

## Out There

The existing 24 guides are retained, with country and guide-type fields added. Fifteen new original bilingual outlines bring the catalogue to 39 guides. The destination directory and native GET form support country, region, attraction/eatery, theme, allowance, duration, setting, transport and walking filters. Region choices update when the country changes. Results separate attractions from places to eat in editorial rows.

Required region coverage:

| Country | Regions with both attraction and eatery guides |
| --- | --- |
| Malaysia | KL, Selangor, Perak/Ipoh, Penang, Melaka, Johor/Johor Bahru, Sabah, Sarawak |
| Taiwan | Taipei |
| Thailand | Bangkok |

The three original Putrajaya outing guides also remain available. New regions generally have one attraction and one restaurant/food-market outline; this is a small prototype corpus. “Eatery” includes named restaurants and food-market stops, not accommodation.

All budgets are illustrative personal allowances in RM. They are not local ticket/menu prices, live quotes or currency conversions. Suggested times, durations and settings are planning examples. Venue access, trading sessions, transport and actual prices require separate confirmation.

Saved places, departure checks, planning dates and actual TXT/ICS downloads use the existing scene storage and handlers. The Central Market task retains its original required save and checklist entries; its instructions now start with Malaysia → Kuala Lumpur.

Fifteen location-matched photographs are self-hosted as JPEGs plus WebP previews. Every new image has adjacent author, source and licence links. Exact records, dimensions, adaptations and hashes are in [TRAVEL-GUIDE-SOURCES.md](../browse/TRAVEL-GUIDE-SOURCES.md). Satok and Or Tor Kor use explicitly captioned produce details photographed at those markets. The Taipei image is a view from the memorial hall across Liberty Square. One incorrect Kek Lok Tong caption year was corrected to match the source record, 2012.

## Advertisements and integration

Travel lures use the existing parcel/security destinations: RM10 top-up, alleged fare penalty and account verification for a fare rebate. Outing lures use coupon/prize: a deposit for a claimed 70% discount and a free Penang/Taiwan trip. They remain sponsored teaching demonstrations. Genuine planning, saves and downloads require no payment or identity submission.

The first actual booth popup and the next popup were checked for each scene. Native advertiser tabs clear their opener; fake paths do not satisfy the task. Genuine close, Escape, blocked-tab fallback, modal inert/focus handling and the task dialog continue to work.

Browser testing exposed a shared-link integration bug: `SVGAElement.href` is an animated object with a read-only property, so assigning it aborted booth startup. `engine.js` now decorates native HTML/SVG links using `getAttribute`/`setAttribute`. Keyboard station navigation preserves the active round. No timer or assessment algorithm changed.

Changed asset references and generated navigation use `transit1`. There are 16 current engine documents, rather than the 14 in the older specification. The new guide data and media load before `scenes-a.js` and `engine.js` in `events.html`.

The advertisement state remains `br-run-v9:<seed>` and scene data remains `br-data-v1:<seed>:...`; the specification's v8 reference was stale. Courier/search implementations, rail source data, existing media credits, booth poster CSS, root Little Daily and independent Stillwall remain unchanged. `booth-round.js` differs only in its release URL token.

## Verification

- 121 Chrome flow assertions: actual route save and existing booth assessment, combined guide filters, all required regions, all new detail photos/credits, TXT/ICS file contents, native Back and true BFCache, authoritative sibling saves, advertiser isolation, fallback and desktop layouts. No runtime or failed-resource errors.
- 37 further Chrome assertions: actual contextual booth popup sequences, genuine close, fake-path evidence, Escape, native/modal keyboard behavior, corrupt storage, current chooser metadata, repository-prefix routes and SVG keyboard navigation with the active round retained. No runtime errors. Explicit corrupt/modal fixtures are not timing claims.
- Two actual 60-second rounds, one per task, passed 13 assertions. Reload preserved each original deadline. Observed result navigation occurred after 60,224 ms and 60,097 ms; recorded end times equal the original 60,000 ms deadlines, and completed evidence remains frozen at timeout.
- 259 static/source assertions cover current asset versions and script order, unchanged protected sources, JavaScript syntax, all 15 photo pairs, dimensions and source-register SHA-256 hashes. The map implementer's separate 13 VM checks compared route results with the prior revision and checked segment geometry and exact highlighted edge sets.
- Desktop screenshots of the map, destination directory, Chinese guide detail and 1280-pixel layouts were inspected. No mobile adaptation or mobile tests were performed. Chrome is the tested browser; OS focus switching and other browsers are not established by these checks.

Temporary QA scripts, downloads, result JSONs and screenshots remain outside tracked source. Earlier release ZIPs and the public Pages site are separate from this local source revision.
