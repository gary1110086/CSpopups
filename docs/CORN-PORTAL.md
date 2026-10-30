# Corn video portal / Corn 视频站

Corn is the fictional video advertiser in the Browse activity. This revision uses the visual grammar of a tube video portal: a compact black/orange header, wide search, content tabs, popular search terms, landscape thumbnail grids, native filters and a watch page with related content.

## Reference review

The design was informed by the following first-party interface descriptions. The dates below refer to those source articles, rather than a claim that every current screen was reproduced.

- [New Product Features to Enhance the Pornhub Experience](https://www.pornhub.lifestyle/blog/new-product-features-to-enhance-the-pornhub-experience),22 January2026: a denser video homepage, thumbnails, popular terms and channel subscriptions.
- [Updated Site Navigation](https://de.pornhub.lifestyle/blog/updated-site-navigation),17 July2022: compact navigation and account-menu structure.
- [Tablet Site Revamp](https://www.pornhub.lifestyle/blog/tablet-site-revamp): category navigation, sorting, search and playback-page actions.

Corn uses its own fictional brand, local implementation and existing project media. No third-party tube-site code is copied into the portal. The three official animation embeds load YouTube's player inside their frames; account and payment surfaces remain local demonstrations.

## Routes and interactions

The native destination URL remains `browse/destination.html?site=corn`. Search, categories, channels, favourites, sorting and time filters use native URLs/forms, preserving the activity's advertiser context. Real media watch pages retain playback, seeking and saved-state behaviour. Account/upload surfaces are local demonstrations.

## Media

The three user-supplied JPEGs remain unchanged. Each now appears once in the catalogue as an activity cover linking to an official regional animation player. The watch page names the actual animation and explains the illustrative cover. No duplicate close-up/portrait-crop records or invented animation durations remain. Old crop URLs open the corresponding video; old crop favourites merge into the canonical item without duplication. Licensed local film previews retain matching posters, playback and creator/source information. See [cover sources](../browse/assets/CORN-PORTRAITS.md), [regional animation sources](../browse/assets/REGIONAL-ANIMATION-SOURCES.md) and [local video sources](../browse/assets/VIDEO-SOURCES.md).

## Side live-room promotions (corn2)

Two independently dismissible floating cards sit beside the desktop catalogue, with pink lounge and violet screening-room treatments. They do not repeat the three supplied covers. On smaller screens they become compact lower-left/lower-right cards, with additional document space so content can scroll above them. Each genuine close dismisses only its own card; Escape dismisses both. Dismissals persist within the tab and are reconciled on native navigation, reload and BFCache render.

The native promotion anchors open isolated child tabs at `destination.html?site=corn&view=live&room=lounge|screening`. Each room has a working local licensed video, source credits and a native switch to the other room. The room explicitly identifies its footage as a preview rather than a real-time stream. No live account, camera, microphone or payment is required.

The three regional animations use online official YouTube embeds, with visible official-watch fallback links. These three videos require a connection to YouTube; the existing three local licensed clips and live-room previews remain self-hosted.

This change is limited to the Corn advertiser. The pure activity,60-second clock, per-round review and other advertising websites keep their existing flows.
