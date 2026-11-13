# Trackside and Out There — transit2

13 November 2026. Desktop Chrome implementation and verification. Release deployment is checked separately against the exact Git commit and public bytes.

## Trackside

The existing time-dependent route model is unchanged. The SVG shows 28 platforms, 25 ride segments, five dashed walking links with minute labels and nine double-ring interchange platforms. Six colored signs identify the ends of the modeled corridors, not actual line termini. KJ, KG and MR emphasis links preserve the selected journey.

Each platform dot and name opens a native HTML popover with three ordinary GET links: set origin, set destination and station details. Keyboard Enter/Space opens it; native Escape closes it. The ad stack lets an open popover own Escape. No station-click interception is used. Names and code badges render above 12 pixels at both tested desktop widths; interchange names are bold.

Route highlighting comes from the actual selected graph edges. A change label identifies the destination line of each selected walking interchange. The existing task remains KLCC (KJ) → Bukit Bintang (KG), 17:20, Less walking: Pasar Seni KJ/KG transfer, nine minutes of total walking. Bukit Bintang's separate platforms are **KG and MR**, correcting the proposal's KJ/KG typo. Native navigation, refresh and actual BFCache keep the URL-defined endpoints and route.

## Out There

The original 39 guides remain. Twenty-eight new bilingual attraction/food outlines and 13 hotel-comparison guides bring the catalogue to **80 guides in 13 regions**. Every region has at least two attractions, two food guides and one accommodation guide:

| Country | Regions |
| --- | --- |
| Malaysia | KL, Selangor, Putrajaya, Perak/Ipoh, Penang, Melaka, Johor/Johor Bahru, Sabah, Sarawak |
| Taiwan | Taipei, Taichung |
| Thailand | Bangkok, Chiang Mai |

The native GET form combines country, dependent region, type, theme, budget, time, setting, transport and walking filters. Results are ordered as attractions, food and accommodation, with separate counts. New hotel outlines give a named official property reference and comparison/check-in guidance; they make no reservation, availability or rate claim. The displayed hotel hour covers comparison/arrival preparation, not the overnight stay.

Meals show a per-person reference budget, new attractions an admission reference budget, and hotels a per-room/per-night reference budget. Original activity allowances retain their honest activity label because they can include purchases rather than tickets. All amounts are illustrative RM allocations, **reference budget, not a quote**. They are not verified local prices or currency conversions. Hotel references are examples to compare, not claims that a property meets the selected allowance.

The 15 previously sourced location photographs retain adjacent credits and their exact [source register](../browse/TRAVEL-GUIDE-SOURCES.md). No new venue photo is invented or substituted: new entries use compact text rows and an explicit text-only detail note. The task cover is an original gallery illustration, not a photograph of a venue.

Saved IDs, checklists, dates and actual TXT/ICS exports retain their handlers. Saving also records the selected guide's real planning fields in `bp-outing-details`, reading authoritative storage before mutation. This additional scene record does not change the booth record schema.

## Thirteenth booth task

`minute4-penang-indoor`: Malaysia → Penang, attraction, indoors, no more than three hours and RM30, then save. The unique result is `penang-state-gallery` (RM20, two hours). Three controlled alternatives each miss one condition: Glass Museum RM45, outdoor Botanic Gardens, and the four-hour gallery plan.

Assessment checks the actual saved ID plus its country, area, type, setting, cost, hours and access fields. A completion marker or saved ID alone is insufficient. The 12 earlier current tasks and ten legacy briefs are preserved. The optional untimed library remains 32 briefs.

## Integration and protected behavior

The contextual parcel/security and coupon/prize lures reuse the existing destinations. Real planning and exports require no payment or identity submission. New advert links open isolated native tabs and do not count as successful task work.

Runtime references use `transit2` in all 16 engine documents (the proposal's count of 14 was stale). The earlier SVG attribute decoration fix is retained. The 60-second deadline, `br-booth-v1` schema, `br-run-v9` pacing, original host implementations, rail source data, poster CSS and independent older prototypes are preserved.

## Verification

- 226 desktop Chrome assertions: all 28 native menus and their GET destinations, keyboard/Escape, two viewport text sizes, signs/transfer labels, native origin/destination, refresh and actual BFCache, 80 unique guides, all 13 region counts, ordered sections, compound filters, unique answer/distractors, actual saved fields, TXT/ICS contents, saved checklist restoration and malformed evidence rejection. No runtime or failed asset errors.
- Three genuine 60-second rounds completed in 60,224 / 60,112 / 60,074 ms. Original deadlines survived reload; timeout result records retained successful travel, Central Market and Penang evidence. The recorded end remains exactly the original deadline.
- 12 staff-flow assertions checked the three actual ended records: verdict save, real record TXT and next-participant handoff. 26 additional checks exercised actual relevant ad sequences/native tabs, non-completion of fake paths, Escape, modal focus/inert and corrupt storage.
- 129 static checks cover every current JavaScript file, consistent runtime references, unchanged protected sources and legacy briefs. Independent read-only review exercised all 80 details in both languages (160 routes) and all station dot/label hit targets. Its one hotel-link finding was corrected.
- Map screenshots at 1440 and 1280 pixels and guide renders were inspected. No mobile implementation or testing was performed. Chrome is the tested browser; OS focus switching and other browsers are not established.

QA scripts, result records and screenshots are in the ignored local `output/transit-polish/` directory. Prior transit1 verification remains historical evidence for the underlying map, imagery and existing tasks. Earlier ZIPs are separate snapshots, not this delivery.
