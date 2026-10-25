# Little Daily runtime

The earlier Little Daily article-browsing prototype has its scripts and styles grouped here. Its HTML routes remain at the repository root, so existing public links, browser history and session behaviour keep working.

- [Open Little Daily](https://gary1110086.github.io/CSpopups/?lang=en&v=cornhub3)
- [Open the earlier article](https://gary1110086.github.io/CSpopups/article.html?lang=en&v=cornhub3)
- [Open the current Browse experience](https://gary1110086.github.io/CSpopups/browse/launch.html?lang=en&v=events1a)

## Source and routes

| Location | Purpose |
| --- | --- |
| `site.js`, `site.css` | Little Daily page rendering, navigation and interruption behaviour. |
| `content.js`, `styles.css` | Shared original copy and base presentation. |
| `nightroom.js`, `nightroom.css` | Original video-site renderer, currently branded Cornhub. |
| Root HTML documents | Public entry points: `index.html`, `article.html`, `story.html`, `offer.html`, `cornhub.html` and `about.html`. The `redirect.html` relay and `nightroom.html` compatibility route also stay at the root. |
| Root `assets/` | Shared images and icons used by this prototype and other project entries. |

Root HTML documents load the implementation from this folder. JavaScript image paths such as `assets/sunday-room.png` resolve relative to those documents; CSS image paths use `../../assets/` because they resolve relative to the stylesheet. Keep that distinction when updating paths.

The local original-game comparison entry, `legacy.html`, also loads its shared scripts and styles from this folder. Local game files and old ZIP snapshots remain outside the published file whitelist.

The current ten-site Browse suite lives in [`../../browse/`](../../browse/). The separate Stillwall prototype remains in [`../../wallpapers/`](../../wallpapers/), including its own vendor snapshot. These entries retain their own runtime and session state.

Run the project from the repository root with `python browse/preview-server.py --port 5175`, then open the desired root HTML route or Browse chooser.
