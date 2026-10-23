# Playable open-film media

Retrieved and verified against primary project pages on 23 October 2026. The local files include real moving footage and original sound, and use ordinary HTML5 video controls. They are loaded on demand rather than autoplaying. The clips are also usable from the packaged HTTP preview without contacting a third-party streaming provider.

All three source films are licensed under [Creative Commons Attribution3.0](https://creativecommons.org/licenses/by/3.0/). Filmmaker attribution, title, license link and source link appear alongside the player. These creators do not endorse this educational experience. The film excerpt is identified separately from the full film runtime. The source license remains applicable to the footage and frame grabs.

## Big Buck Bunny

- Credit: Big Buck Bunny ©2008 Blender Foundation / www.bigbuckbunny.org
- Primary license: https://peach.blender.org/about/
- Source download: https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v.zip
- `video-bunny.mp4`:60second excerpt,00:50–01:50,640×360, H.264 + AAC.
- `video-bunny.jpg`: frame at9seconds into that excerpt, encoded as a JPEG preview.
- Changes: excerpted and re-encoded for delivery; original soundtrack retained. Not the full film.

## Sintel

- Credit: Sintel ©2010 Blender Foundation / durian.blender.org
- Primary license: https://durian.blender.org/about/
- Source download: https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4
- `video-sintel.mp4`: entire official trailer,52.21seconds,960×540, H.264 + AAC.
- `video-sintel.jpg`: frame at9seconds, encoded as a JPEG preview.
- Changes: resized and re-encoded for delivery; original sound and trailer ending retained. The full film is14minutes48seconds.

## Tears of Steel

- Credit: Tears of Steel ©2012 Blender Foundation / mango.blender.org
- Primary license: https://mango.blender.org/about/
- Source download: https://download.blender.org/demo/movies/ToS/tears_of_steel_720p.mov
- `video-steel.mp4`:60second excerpt,00:45–01:45,960pixels wide, H.264 + AAC.
- `video-steel.jpg`: frame at9seconds into the excerpt, encoded as a JPEG preview.
- Changes: excerpted, resized and re-encoded; original film sound retained. Not a separately distributed standalone soundtrack. The download directory's copyright.txt applies specifically to the standalone soundtrack; the film license is documented on the primary project About page.
- Filmmakers recommend the original film for ages12+. Local clip access does not request an account or install.

## Playback checks and limitations

Metadata decoding, advancing currentTime, pause/resume and duration are checked in Chrome. Seeking is checked with an HTTP server that supports byte-range responses and on the published site. Python's basic SimpleHTTPServer does not offer byte ranges in this environment, which can limit seeking during that local preview. Captions are not supplied for these excerpts; native playback controls, volume, seek and fullscreen remain available. No generated fake captions or unrelated fictional trailers are used.
