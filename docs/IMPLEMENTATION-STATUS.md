# Current implementation / 当前实现

15 November 2026. This page points to the current source. The older cleaner1 requirement check is preserved in [history](history/CLEANER1-IMPLEMENTATION.md).

| Area / 内容 | Current behaviour / 当前行为 | Source / 源码 |
| --- | --- | --- |
| Entry / 入口 | 13 bilingual tasks on 12 websites. Read before starting; the round begins when the task website is ready. | [Chooser](../browse/booth.js), [tasks](../browse/booth-tasks.js), [websites](../browse/scene-registry.js) |
| Deadline / 计时 | An absolute 60-second round, including other tabs and native navigation. Submission and timeout freeze the result. | [Round lifecycle](../browse/booth-round.js) |
| Sound / 声音 | Clock texture in the final 15 seconds, spoken ten-to-one countdown, separate timer mute and ad sound controls. | [Countdown](../browse/booth-countdown.js), [audio sources](../browse/assets/COUNTDOWN-AUDIO-SOURCES.md) |
| Result / 结果 | Task 40 + time 40 + resilience 20, using recorded evidence. Staff verdict is separate. | [Scoring](../browse/booth-score.js), [rules](SCORING.md) |
| Advertisements / 广告 | Campus-themed interruptions accumulate during the activity; genuine close, temporary Escape relief and native advertiser tabs remain. | [Activity ad policy](../browse/booth-ads.js), [ad stack](../browse/ad-stack.js), [motion](../browse/popup-motion.js) |
| Real interactions / 实际操作 | Search, filters, saved lists, comparisons and image/text/calendar exports. Media availability and credits are shown on the relevant pages. | [Browse overview](../browse/README.md), [sources](README.md#media-sources--素材来源) |
| Free browsing / 自由浏览 | Twelve normal websites and a separate library of 32 briefs, without an activity deadline unless a round was started. | [Chooser](../browse/launch.html), [task library](../browse/task-library.js) |
| Local state / 本地记录 | Round records, saved work and review remain in the current browser tab. | [Staff guide](MINUTE-BOOTH.md), [review log](../browse/review-log.js) |
| Earlier entries / 早期入口 | Root Little Daily URLs and independent Stillwall remain available. | [Little Daily](../prototypes/little-daily/README.md), [Stillwall](../wallpapers/README.md) |

The repository remains a static site with no build step. Serve the whole root with `python browse/preview-server.py --port 5175`; copying only `browse/` omits shared assets.

[README screenshots](images/README.md) show the current public interface. Automated demonstration rounds illustrate the UI; their times and scores are not participant study data. Historical test counts stay in their original records and are not presented as new verification.
