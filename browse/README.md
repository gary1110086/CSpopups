# Browse · current websites

The current entry is [One Minute](https://gary1110086.github.io/CSpopups/browse/booth.html?lang=en&v=audio1): **13 bilingual tasks across 12 websites**, each with a 60-second deadline. [中文入口](https://gary1110086.github.io/CSpopups/browse/booth.html?lang=zh&v=audio1).

For the visitor's explanation, start with the [project README](../README.md) or [中文玩法](../README.zh-CN.md). For running a booth, use the [staff guide and answers](../docs/MINUTE-BOOTH.md).

## Entries

| Entry | Purpose |
| --- | --- |
| [booth.html](booth.html?lang=en&v=audio1) | Task selection, brief, timed round and result. Staff tools include clean mode and recent rounds. |
| [launch.html](launch.html?lang=en&v=audio1) | Choose one of the twelve websites without a round deadline. |
| [tasks.html](tasks.html?lang=en&v=audio1) | Separate library of 32 optional, untimed briefs. |
| [review.html](review.html?lang=en&v=audio1) | Read the local interaction record and export a discussion sheet. |
| [guide.html](guide.html?lang=en&v=audio1) | Website references, media sources and advertising mechanisms. |

## Websites

| Website | Main interaction |
| --- | --- |
| Stillwall | Find, compare and export wallpaper images. |
| Pantry & Plate | Filter recipes, scale servings and check ingredients. |
| Pixelpress | Resize and compress an image, then download it. |
| Frame Movies | Search films and manage a watchlist. |
| Folio | Compare editions, read excerpts and export text. |
| Open Collection | Inspect artwork dimensions, compare and save objects. |
| Field Guide | Compare bird descriptions and keep an observation list. |
| Out There | Filter attraction, food and accommodation guides; save an outing. |
| Trackside | Inspect stations and save a rail journey. |
| loop | Compare used-camera listings and their included accessories. |
| TrackMY | Track the sample parcel and reschedule its delivery. |
| Findline | Inspect search results and find the official local download page. |

## Running and changing it

From the repository root:

```sh
python browse/preview-server.py --port 5175
```

Serve the complete repository. This directory uses shared `assets/` and `wallpapers/` resources, and the included server supports HTTP byte ranges for media seeking. There is no build step.

`scene-registry.js` lists the normal websites. `booth-tasks.js` holds the thirteen activity tasks; `task-library.js` holds the separate untimed library. `engine.js` wires the task pages, with round, ad and review behaviour in their respective modules. Keep native links/GET forms and the repository URL prefix working.

Rounds, saved choices and review records use the participant tab's `sessionStorage`. They do not synchronize between computers. Genuine file exports remain available; advertised payments, installers and prizes are local demonstrations. Current development and acceptance target desktop browsers.

## Further reading

- [Current implementation map](../docs/IMPLEMENTATION-STATUS.md)
- [Scoring rules](../docs/SCORING.md)
- [Folder guide](../docs/FOLDERS.md)
- [Media sources](../docs/README.md#media-sources--素材来源)
- [Recorded verification and its limits](VERIFICATION.md)
- [Archived Browse development notes](../docs/history/BROWSE-DEVELOPMENT.md)

The `cleaner1` ZIP and the development notes under `docs/history/` describe earlier builds. They do not define the current one-minute activity.
