# Folio and Open Collection — sources and image records

Verified 24 October 2026. These are two independent catalogue websites within the Browse teaching experience. They do not represent or impersonate the source libraries or museum.

## Catalogue and layout references

- [Open Library](https://openlibrary.org/): reference for a practical library search, author links, catalogue rows and a reading list. An earlier text retrieval succeeded; a later verification request timed out. The layout and copy in Folio were implemented independently. No Open Library covers or member data are used.
- [Project Gutenberg](https://www.gutenberg.org/): reference for edition records, language metadata and multiple source formats. Each book record distinguishes first publication of the underlying work from the text edition and the image edition.
- [The Met collection search](https://www.metmuseum.org/art/collection/search): reference for a collection image grid and artist/date/material/culture facets. Open Collection has its own identity and original catalogue observations. It does not reproduce museum essays.

## Rights and local delivery

**Folio:** 18 distinct historical works, represented by 20 text editions: 18 English, one French and one Spanish. All excerpts are selected from the linked public-domain source text. Typographic spaces are normalized; library boilerplate, image captions and the surrounding full book are not included. Some source texts retain historical discriminatory language; the Huckleberry Finn record gives a brief contextual note. Download buttons supply a selected excerpt, never a falsely labelled complete book.

Illustrations and bindings are genuine scans reproduced in the linked Gutenberg image editions. They are not generated cover designs. Some are historical frontispieces or title pages instead of covers. English-edition illustrations are transparently reused for the French Verne and Spanish Cervantes text records; image and text sources are linked separately. The Alice image is an Arthur Rackham illustration from edition #28885. The Frankenstein image is the title page from the 1831 photo-reprint edition #42324; Robinson Crusoe uses a scan from the 1808 edition #12623; Sense and Sensibility uses Hugh Thomson's illustrated edition #21839; Just So Stories uses illustrated edition #32488. Gutenberg identifies the underlying editions as public domain in the USA. This is source attribution, not a claim of an unrestricted trademark licence or museum/library endorsement.

- [Gutenberg permission and source-credit guidance](https://www.gutenberg.org/policy/permission)
- [Gutenberg licence](https://www.gutenberg.org/policy/license)
- [Gutenberg terms of use](https://www.gutenberg.org/policy/terms_of_use.html)

**Open Collection:** 24 real Met objects. Each selected object returned `isPublicDomain: true` and a non-empty `primaryImage` in the official Met API when acquired. The Met's Open Access policy dedicates eligible images and basic collection metadata under CC0. The retained credit line describes the object's acquisition and remains shown in details, exports and the manifest.

- [Met image and data resources / Open Access policy](https://www.metmuseum.org/policies/image-resources)
- [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- [Official collection API](https://metmuseum.github.io/)

All runtime images are **local files**. Book scans are resized without upscaling to a maximum of 1500 × 1800 pixels; art JPGs are resized without upscaling to at most 2400 pixels on the longest edge. Separate WebP thumbnails make the catalogue faster. Detail pages state delivered dimensions and retain links to official full-size originals. Downloads provide these delivered JPGs. No image is advertised as a newly captured original or as higher resolution than the file actually contains.

The complete per-file record is [assets/culture-manifest.json](assets/culture-manifest.json). Its 44 records include title, source record, direct acquired image URL, text/image editions where relevant, rights, credit, original dimensions, delivered dimensions and local image filename. `culture-book-data.js` and `culture-art-data.js` hold the corresponding catalogue data and original bilingual notes. Source checks used targeted catalogue pages and official object API records; these pages do not depend on a live API to function.

## Text editions

| Local ID | Work / language | Text source | Separate image edition, if used |
| --- | --- | --- | --- |
| pride-prejudice | Pride and Prejudice / English | [1342](https://www.gutenberg.org/ebooks/1342) | same record |
| alice | Alice's Adventures in Wonderland / English | [11](https://www.gutenberg.org/ebooks/11) | [28885, Arthur Rackham](https://www.gutenberg.org/ebooks/28885) |
| sherlock | The Adventures of Sherlock Holmes / English | [1661](https://www.gutenberg.org/ebooks/1661) | same record |
| wizard-oz | The Wonderful Wizard of Oz / English | [55](https://www.gutenberg.org/ebooks/55) | same record |
| treasure-island | Treasure Island / English | [120](https://www.gutenberg.org/ebooks/120) | same record |
| christmas-carol | A Christmas Carol / English | [46](https://www.gutenberg.org/ebooks/46) | same record, first-edition binding |
| tom-sawyer | The Adventures of Tom Sawyer / English | [74](https://www.gutenberg.org/ebooks/74) | same record |
| huck-finn | Adventures of Huckleberry Finn / English | [76](https://www.gutenberg.org/ebooks/76) | same record |
| robinson-crusoe | Robinson Crusoe / English | [521](https://www.gutenberg.org/ebooks/521) | [12623, 1808 edition](https://www.gutenberg.org/ebooks/12623) |
| don-quixote | Don Quixote / English, John Ormsby translation | [996](https://www.gutenberg.org/ebooks/996) | same record |
| frankenstein | Frankenstein / English | [84](https://www.gutenberg.org/ebooks/84) | [42324, 1831 edition](https://www.gutenberg.org/ebooks/42324) |
| dracula | Dracula / English | [345](https://www.gutenberg.org/ebooks/345) | same record |
| great-expectations | Great Expectations / English | [1400](https://www.gutenberg.org/ebooks/1400) | same record |
| jane-eyre | Jane Eyre / English | [1260](https://www.gutenberg.org/ebooks/1260) | same record, illustration |
| sense-sensibility | Sense and Sensibility / English | [161](https://www.gutenberg.org/ebooks/161) | [21839, Hugh Thomson](https://www.gutenberg.org/ebooks/21839) |
| just-so | Just So Stories / English | [2781](https://www.gutenberg.org/ebooks/2781) | [32488, illustrated edition](https://www.gutenberg.org/ebooks/32488) |
| jungle-book | The Jungle Book / English | [236](https://www.gutenberg.org/ebooks/236) | same record |
| around-world | Around the World in Eighty Days / English | [103](https://www.gutenberg.org/ebooks/103) | same record |
| around-world-fr | Le tour du monde en quatre-vingts jours / French | [800](https://www.gutenberg.org/ebooks/800) | English #103 binding |
| don-quixote-es | Don Quijote de la Mancha / Spanish | [2000](https://www.gutenberg.org/ebooks/2000) | English #996 binding |

## Met objects

Each link resolves to the museum's own object record. Dates, dimensions, titles, medium and credit lines are taken from the official API, including approximate dates and the 1899 / reworked-by-1906 date for The Gulf Stream. Culture facets use `country`, `culture` or artist nationality when available; the UI explains that nationality does not necessarily identify the location of production. The Temple of Dendur and William are grouped under Ancient Egypt.

| Met ID | Title | Artist / maker |
| --- | --- | --- |
| [436535](https://www.metmuseum.org/art/collection/search/436535) | Wheat Field with Cypresses | Vincent van Gogh |
| [436533](https://www.metmuseum.org/art/collection/search/436533) | Shoes | Vincent van Gogh |
| [436528](https://www.metmuseum.org/art/collection/search/436528) | Irises | Vincent van Gogh |
| [436532](https://www.metmuseum.org/art/collection/search/436532) | Self-Portrait with a Straw Hat | Vincent van Gogh |
| [436534](https://www.metmuseum.org/art/collection/search/436534) | Roses | Vincent van Gogh |
| [56353](https://www.metmuseum.org/art/collection/search/56353) | Under the Wave off Kanagawa / The Great Wave | Katsushika Hokusai |
| [11132](https://www.metmuseum.org/art/collection/search/11132) | The Pioneer | Winslow Homer |
| [10154](https://www.metmuseum.org/art/collection/search/10154) | The Rocky Mountains, Lander's Peak | Albert Bierstadt |
| [11122](https://www.metmuseum.org/art/collection/search/11122) | The Gulf Stream | Winslow Homer |
| [10497](https://www.metmuseum.org/art/collection/search/10497) | The Oxbow | Thomas Cole |
| [437853](https://www.metmuseum.org/art/collection/search/437853) | Venice, from the Porch of Madonna della Salute | Joseph Mallord William Turner |
| [437430](https://www.metmuseum.org/art/collection/search/437430) | By the Seashore | Auguste Renoir |
| [437869](https://www.metmuseum.org/art/collection/search/437869) | Juan de Pareja | Diego Rodríguez de Silva y Velázquez |
| [435882](https://www.metmuseum.org/art/collection/search/435882) | Still Life with Apples and a Pot of Primroses | Paul Cézanne |
| [436947](https://www.metmuseum.org/art/collection/search/436947) | Boating | Edouard Manet |
| [544227](https://www.metmuseum.org/art/collection/search/544227) | Hippopotamus (William) | Ancient Egyptian makers |
| [547802](https://www.metmuseum.org/art/collection/search/547802) | The Temple of Dendur | Ancient Egyptian makers |
| [437879](https://www.metmuseum.org/art/collection/search/437879) | Study of a Young Woman | Johannes Vermeer |
| [436964](https://www.metmuseum.org/art/collection/search/436964) | Young Lady in 1866 | Edouard Manet |
| [436965](https://www.metmuseum.org/art/collection/search/436965) | The Monet Family in Their Garden at Argenteuil | Edouard Manet |
| [437903](https://www.metmuseum.org/art/collection/search/437903) | Marie Joséphine Charlotte du Val d'Ognes | Marie Denise Villers |
| [436944](https://www.metmuseum.org/art/collection/search/436944) | The Spanish Singer | Edouard Manet |
| [437549](https://www.metmuseum.org/art/collection/search/437549) | Wheat Fields | Jacob van Ruisdael |
| [436840](https://www.metmuseum.org/art/collection/search/436840) | Self-Portrait with Two Pupils | Adélaïde Labille-Guiard |

## Acquisition limits recorded honestly

The Met object API and official image host were reachable. Its search endpoint returned HTTP 410 during this acquisition, so selection used known object identifiers and verified each object individually. Some Monet records returned `isPublicDomain: false` with no primary image and were excluded; an artist's age alone was not treated as evidence that a particular hosted image was reusable. Art Institute metadata was reachable, but its IIIF image host returned HTTP 403; no AIC images are included. There are no remote-image fallbacks, scraped account information, copied proprietary whole articles, generated book covers or generated museum objects in these two scenes.

## Route and storage notes

- `book.html`: native GET `q`, `genre`, `author`, `era`, `language`, `length`, `sort`; detail `id`; `view=read`, `view=saved`, `view=about`.
- `museum.html`: native GET `q`, `artist`, `era`, `material`, `origin`, `subject`, `sort`; detail `id`; `view=image`, `view=compare`, `view=saved`, `view=about`.
- All navigation carries the shared `lang`, `seed`, `v` and assigned `task` via the engine URL contract. Local links work under a GitHub Pages repository prefix.
- Current-tab session state: `culture-reading-list`, `culture-exhibition`, `culture-comparison`, `culture-note-<scene>-<id>`, `culture-reader-<book-id>`, `culture-read-<book-id>`, each namespaced by the shared visit seed. Array mutations re-read authoritative state; persisted `pageshow` redraws saved indicators after genuine Back/Forward-cache restores.
- Six bilingual tasks: `book-alice`, `book-detective`, `book-voyage`, `museum-cypresses`, `museum-water`, `museum-wave`. Their facilitator answers are in `culture-tasks.js`.
- Session storage does not provide cross-computer synchronization. Staff must choose a fresh seed/new isolated tab for a new participant if a clean visit is needed. TXT/JPG exports can be retained outside the tab.
