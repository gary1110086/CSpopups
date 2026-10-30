# Corn video portal / Corn 视频站

Corn is the fictional video advertiser in the Browse activity. This revision uses the visual grammar of a tube video portal: a compact black/orange header, wide search, content tabs, popular search terms, landscape thumbnail grids, native filters and a watch page with related content.

## Reference review

The design was informed by the following first-party interface descriptions. The dates below refer to those source articles, rather than a claim that every current screen was reproduced.

- [New Product Features to Enhance the Pornhub Experience](https://www.pornhub.lifestyle/blog/new-product-features-to-enhance-the-pornhub-experience),22 January2026: a denser video homepage, thumbnails, popular terms and channel subscriptions.
- [Updated Site Navigation](https://de.pornhub.lifestyle/blog/updated-site-navigation),17 July2022: compact navigation and account-menu structure.
- [Tablet Site Revamp](https://www.pornhub.lifestyle/blog/tablet-site-revamp): category navigation, sorting, search and playback-page actions.

Corn uses its own fictional brand, local implementation and existing project media. No third-party site scripts, tracking, live account or payment endpoints are embedded.

## Routes and interactions

The native destination URL remains `browse/destination.html?site=corn`. Search, categories, channels, favourites, sorting and time filters use native URLs/forms, preserving the activity's advertiser context. Real media watch pages retain playback, seeking and saved-state behaviour. Account/upload surfaces are local demonstrations.

## Media

The three user-supplied JPEGs remain unchanged. Landscape thumbnail crops are made with CSS; photo previews do not acquire invented video durations or false film identities. Licensed video previews retain matching posters, playback and creator/source information. See [portrait sources](../browse/assets/CORN-PORTRAITS.md) and [video sources](../browse/assets/VIDEO-SOURCES.md).

This change is limited to the Corn advertiser. The pure activity,60-second clock, per-round review and other advertising websites keep their existing flows.
