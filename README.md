# CSpopups

A browsing experience about attention, advertising and deceptive design. Complete an everyday task while ordinary promotions and misleading pop-ups compete for your attention.

**[Try the demo →](https://gary1110086.github.io/CSpopups/browse/launch.html?lang=en&v=events1)** · [中文说明](README.zh-CN.md)

![Stillwall wallpaper browsing interrupted by several advertisements](assets/readme-preview.png)

*An actual screenshot of Stillwall, one of the ten task websites. [Photograph credits](assets/README-PREVIEW.md).*

## How it works

1. **Pick a task.** Find a wallpaper, plan an outing, compare cameras or choose another everyday goal.
2. **Browse and decide.** Search, filter, read details, compare choices, save items or export a result.
3. **Handle the interruptions.** Dismiss ads or follow them into real browser tabs, then return to your original task.
4. **Reflect.** Discuss what attracted attention, which controls were misleading and how the task was recovered.

The current **Browse** experience includes **10 task websites, 30 task briefs and 10 advertiser destinations**. It uses the browser's own address bar, tabs, history and reload controls.

| Start here | What you get |
| --- | --- |
| [Choose a website](https://gary1110086.github.io/CSpopups/browse/launch.html?lang=en&v=events1) | Explore any of the ten scenes. |
| [Get a random task](https://gary1110086.github.io/CSpopups/browse/?task=random&lang=en&v=events1) | Open a randomly assigned task and website. |
| [Browse the task library](https://gary1110086.github.io/CSpopups/browse/tasks.html?lang=en&v=events1) | Read the briefs and expected outcomes before starting. |
| [Facilitator answers](https://gary1110086.github.io/CSpopups/browse/tasks.html?mode=host&lang=en&v=events1) | Use a separate device to check participants' results. |
| [References and scam cases](https://gary1110086.github.io/CSpopups/browse/guide.html?lang=en&v=events1) | Read the design references and documented mechanisms. |

Task briefs stay in the separate library; the top task/notebook panel is currently hidden on browsing pages. Sessions have no visible game timer, automatic score or automatic ending.

## Ten everyday websites

| Website | What you can do |
| --- | --- |
| **Stillwall** · wallpapers | Find photographs, inspect sources, compare images and download a JPEG. |
| **Pantry & Plate** · recipes | Filter by ingredients and diet, scale servings and export a recipe. |
| **Pixelpress** · image tools | Resize or compress an image locally, compare the result and save the processed file. |
| **Frame Movies** · films | Explore real open films and silent classics, build a watchlist and play selected previews. |
| **Out There KL** · outings | Compare weekend guides, check rain alternatives and export a plan or calendar file. |
| **Folio** · books | Explore historical editions, read passages and save books or excerpts. |
| **Open Collection** · museum | Inspect real artworks, compare objects and curate a small exhibition. |
| **Field Guide** · birds | Compare North American birds using photographs, field marks, habitat and available calls. |
| **Trackside** · rail journeys | Plan a KL rail journey, inspect interchanges and save a trip. |
| **loop** · used cameras | Compare fictional camera listings, check accessories and prepare a local enquiry draft. |

## The interruptions

Advertisements appear in search results, reading paths, banners and stacked floating cards. Copy responds to the current scene and search; a recurring sponsor follows visits through the site.

- **Movement:** bouncing cards, mouse-evading cards with a four-to-six-attempt budget, and occasional collisions in selected sessions.
- **Deceptive controls:** small or translucent closes, different close corners, and close-shaped links that open an advertiser.
- **A way out:** hidden-close cards reveal an obvious genuine close after ten seconds of focused viewing and stop moving.
- **More than a landing page:** advertiser tabs include shops, image downloads, playable games, a reward wheel and offer comparisons, alongside bounded scam demonstrations.

**Press Esc to clear ads temporarily.** Keyboard focus pauses moving cards; touch does not trigger evasion. Scheduling advances only while the scene is focused in the foreground.

Advertiser tabs preserve the original task page. Genuine downloads, saves and ordinary Browse navigation remain functional.

## Random encounters

Each session selects three applicable events from eight possibilities. They respond to browsing actions, so the same task can unfold differently:

- A sponsor assistant starts a conversation and gradually recommends unrelated offers.
- An advertiser departure changes the original browser tab title; returning reveals a sponsored message.
- A muted film banner becomes a following mini-player after it scrolls out of view.
- Search suggestions mix genuine query shortcuts with a separately labelled sponsored link.
- Rejected ads lead to an offer that grows from 10% to 20% and then a mystery box.
- A small animated character presents a scene-related promotion.
- A brief quiet spell ends with a sponsor's return message.
- A real save or export can be followed by an optional bonus offer.

## Run locally

The site is static HTML, CSS and JavaScript. Use Python 3 for the included preview server, which supports video seeking.

```sh
git clone https://github.com/gary1110086/CSpopups.git
cd CSpopups
python browse/preview-server.py --port 5175
```

Open [the local chooser](http://127.0.0.1:5175/browse/launch.html?lang=en&v=events1).

Serve the repository root: Browse also uses shared files in `assets/` and `wallpapers/`. A local `127.0.0.1` link works on the host computer; share the published demo link with other computers.

The public demo is hosted on GitHub Pages. Other static hosts can serve the same repository tree from its root.

## Project guide

| Location | Purpose |
| --- | --- |
| [`browse/`](browse/) | Current task websites, advertiser destinations and shared interaction modules. |
| [Browse documentation](browse/README.md) | Detailed behaviour, storage, controls and local packaging notes. |
| [Verification notes](browse/VERIFICATION.md) | Recorded checks and their limits, including native tabs, Back/Forward, media and exports. |
| [Design notes](browse/DESIGN-NOTES.md) | Layout references and design decisions. |

## Media and privacy

The experience includes ordinary ads as well as deceptive examples; advertising alone does not make something a scam. Website and advertiser identities in the exercise, along with their simulated transactions, are fictional. Software installation, device scans, payments, rewards and parcel claims are teaching demonstrations. Wallpaper, image, text and calendar exports are real local downloads.

There are no player accounts, advertising SDKs or application analytics. Image processing stays in the browser; preferences and saved choices use per-tab session storage. **Sharing a link does not synchronize progress between computers.** The hosting provider still receives normal web requests.

Real photographs, historical images, illustrations, audio and film clips retain their individual source licences. Some earlier generated assets remain for compatibility. Credits, changes and source records are documented here:

- [Landscape, recipe, location, film and workspace photographs](browse/assets/REAL-MEDIA-SOURCES.md)
- [Playable film clips](browse/assets/VIDEO-SOURCES.md) and [film stills](browse/assets/OPEN-FILM-STILLS.md)
- [NASA photographs](browse/assets/NASA-SOURCES.md)
- [Books and museum collections](browse/culture-SOURCES.md)
- [Birds, audio and rail references](browse/journey-SOURCES.md)
- [Camera photographs](browse/assets/MARKET-SOURCES.md) and [earlier generated assets](browse/assets/ASSET-SOURCES.md)

Referenced creators, institutions and services do not endorse the project. Rail times, commercial offers and camera listings include demonstration data.

## Earlier independent prototypes

| Prototype | Entry | Notes |
| --- | --- | --- |
| **Little Daily** | [Open the original site](https://gary1110086.github.io/CSpopups/) | Earlier article-browsing experience; still served at the repository's root URL. |
| **Standalone Stillwall** | [Open the wallpaper prototype](https://gary1110086.github.io/CSpopups/wallpapers/?lang=en&v=wallpaper1) | Separate wallpaper experiment; [documentation](wallpapers/README.md). |

These retain their own behaviour and session state. **Use the Browse demo at the top for the current experience.**
