# Culture scenes — release verification

24 October 2026, Chrome via Playwright against the local HTTP preview. Browser plugin not available in the listed skills, so regular Playwright was used. No production publication is implied by these local checks.

- **91 functional assertions passed**, with zero page errors or missing HTTP resources.
- All 20 Folio editions opened their actual selected source passages; all 24 Met records opened with their correct accession metadata.
- Six concrete task journeys were exercised: `book-alice`, `book-detective`, `book-voyage`, `museum-cypresses`, `museum-water`, `museum-wave`.
- Native GET filters combined correctly and retained language, visit seed, release version and task. Alice narrowed to one record; Verne returned two language editions; Spanish returned the original-language Cervantes record; the Japanese print material/culture intersection returned The Great Wave.
- Actual download payloads checked: Alice excerpt TXT contained the White Rabbit and source record; reading-list TXT contained the saved Irene Adler note; exhibition TXT contained both correct dates and a saved observation; Great Wave placard contained Hokusai and ca. 1830–32. Cypresses JPG decoded as **2400 × 1910** pixels, matching the displayed delivered dimensions.
- Reader font size and dark paper persisted through reload. The excerpt-read marker persisted. Save/remove repaint retained keyboard focus in a final independent spot-check.
- Native Back/Forward-cache restoration was verified using Chrome launched without Playwright's default BFCache-disabling flag and `goBack({waitUntil:'commit'})`. The actual persisted pageshow event occurred and the restored catalogue reflected a detail-page save.
- Museum zoom increased actual image-stage width and height by the selected factor; it did not substitute a different thumbnail or a generated preview.
- No horizontal document overflow at **320, 390 and 1440px** for book detail, reader, museum detail, comparison and zoom routes. Catalogue views additionally checked at 320 and 390px. Desktop and mobile screenshots were inspected, including real Great Wave detail and the dark Alice reader.
- Malformed reading-list, exhibition and comparison session values were safe. An HTML-like search query remained inert and produced a normal empty result.
- Syntax checks passed for `culture-scenes.js`, both data files and `culture-tasks.js`.

Temporary verification scripts are `culture-functional.cjs`, `culture-initial.cjs`, `culture-mobile.cjs` and `culture-market-review.cjs` in the local TEMP directory; screenshots also remain there. They are not runtime dependencies or release assets.

The manifest contains 44 source records with source and delivered dimensions, rights, credits, file sizes and SHA256 hashes. All images are local, around 32.2 MiB including thumbnails and the manifest. Source acquisition details and excluded inaccessible sources are recorded in [culture-SOURCES.md](culture-SOURCES.md).
