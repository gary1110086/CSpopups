# Selected final15-second countdown

This audio is an adapted cue embedded in the One Minute game, not an original standalone sound-stock download. The recordings do not imply endorsement by their creators. No remote audio request is made while playing.

## Source recordings

- **Male voice countdown**, Mixkit, item917. Participant-selected file `mixkit-male-voice-countdown-917.wav`,44.1kHz stereo PCM,10.860590s. Source: https://mixkit.co/free-sound-effects/countdown/ (Male voice countdown). Licence: Mixkit Sound Effects Free License, https://mixkit.co/license/#sfxFree . Original SHA256: `8fb08d9224f5279af7daa6949ea8f27a01b5bdbca87291393b8ed6845778fd8a`.
- **Tense clock transition**, Tomáš Herudek / Tomas_Herudek, Pixabay item480613. Participant-selected file `tomas_herudek-tense-clock-transition-480613.mp3`,48kHz stereo MP3,62.952s. Source: https://pixabay.com/sound-effects/film-special-effects-tense-clock-transition-480613/ . Licence: Pixabay Content License, https://pixabay.com/service/license-summary/ and https://pixabay.com/service/terms/ . Original SHA256: `6afb22e0d887b33ba38b306ce518058171a2efce8e60d2ff5dbbff37c88177c1`.

Retrieved14 November2026. Both untouched originals and the reproducible mixing script remain in the local task evidence, outside the public site.

## Adaptation

`booth-countdown-mix1.mp3` is15.000s,44.1kHz stereo,192kbps MP3. Its0..5s clock entrance corresponds to15..10s remaining; original voice10..1 attacks are aligned at5..14s, one number per second. The source's trailing spoken zero is omitted so speech ends before the game expires. Each complete word is cut within surrounding silence, level-balanced, and edge-faded without changing its pitch. Background uses source43..60.625s with smoothly increasing playback rate0.8..1.55, fades in, builds and ducks under each spoken word. A short75ms terminal fade avoids a hard cut at zero.

The prepared mix reserves peak headroom; decodedMP3 is separately checked for clipping. Runtime gain only adds a12ms entrance when joining an already-running countdown. Reload/return/unmute follows current deadline position and waits out a word tail instead of starting halfway through a spoken number. Muting or leaving the foreground stops this cue; enabling it never resets game time.

Machine-readable input/output hashes, source/word ranges and processing measurements: [COUNTDOWN-AUDIO.json](COUNTDOWN-AUDIO.json).
