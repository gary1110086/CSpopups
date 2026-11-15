# Round endings · ending3

The 60-second round has two endings:

- **Time runs out:** 1.5 seconds of air-raid siren, then a nuclear-style fireball,
  rising smoke and dust front with the supplied explosion recording. The explosion
  enters at full level while the siren is rapidly ducked to silence over 0.55 seconds.
- **Participant selects Submit / 我完成了 before the deadline:** dense fireworks,
  confetti and the supplied sustained crowd cheer at its original pitch/rate. This celebrates submission; it does not
  override the recorded evidence or assert that every task condition was met.

The durable round ends first. Existing score calculation and Station 2 submission
continue independently of the animation. A one-use session ticket selects the
ending on the result page. A click at or after the deadline remains a timeout.
Voids and ordinary visits have no ending; consumed tickets do not replay on reload.

The animation displays the actual computed total. Skip / View results and Escape
return to the detailed result. There is a 15-second escape hatch if the animation
cannot finish. Reduced-motion preferences bypass the large particle movement.

Sound follows the existing countdown-audio preference. When the browser blocks
automatic audio, Play sound is available inside the animation. Closing, skipping
or leaving stops playback.

## Assets and implementation

`browse/booth-ending.js` owns the result overlay. `browse/end-effects/` contains
the isolated player, original Canvas particles, procedural WebGL volume shader
and self-hosted sound assets. The earlier synthesized voice and synthesized
explosion have been replaced by these user-supplied files:

- `u_mojdif8pzp-crowd-cheering-yelling-525147.mp3`
- `lazychillzone-air-raid-siren-2-227377.mp3`
- `professionalsfx-nuclear-explosion-507442.mp3`

These names record the supplied files; no external licence/source URL was supplied.
No runtime asset CDN is used. Audio stops on skip/exit; the crowd/explosion tail
fades out near the end of the presentation. The alarm lead-in does not add playing
time or alter scores. The generated voice is retained only in the local archive.

The standalone source and Station 2 integration receive separate updates on 15 November 2026. Station-specific entry, SDK, participant and handover code are retained only in the Station 2 copy. These changes are prepared as separate source and Station 2 commits. No automated tests, regression or live checks
were run for this change, as requested. Earlier verification reports do not
cover ending1 or ending3.
