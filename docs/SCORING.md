# One Minute scoring / 一分钟计分规则

The desktop challenge totals **100 points: task 40 + time 40 + resilience 20**. Scores are derived from existing local round and interaction records. No new tracking or stored score is added.

桌面挑战满分 **100：任务 40＋时间 40＋抗干扰 20**。只读取现有本地记录，现场计算得分。

## Task / 任务：0–40

`round(40 × met / total)`

The existing automatically confirmable evidence checklist (`assess`) is unchanged. Only `met === true` counts. Empty evidence scores zero. Written conditions (`conditions`) remain a separate checklist; staff judgement is an optional note and never changes the score.

任务按已满足的自动记录证据占比计算，算法不变。工作人员判定不参与计分。

## Time / 时间：20–40

For a valid finished round:

```text
t = clamp((endedAt − startedAt) / 1000, 0, 60)
p = total > 0 ? met / total : 0
curve = t <= 30 ? 1 : 1 − log₂(t / 30)
speedBonus = round(20 × p × curve)
timeScore = 20 + speedBonus
```

时间基础分始终为 20；**全部完成且 30 秒内交卷，时间得满 40**。30–60 秒按对数曲线递减到 20。额外 0–20 分按**未四舍五入的任务完成比例**折算；完成一半得一半速度奖励，没有完成证据只得基础 20。

Time means the interval until **submission or timeout**, not an inferred first-completion timestamp. Submit when finished. Changing tabs does not pause the absolute 60-second deadline. A timed-out round receives exactly 20 time points, regardless of task progress. Invalid or unavailable timing shows `—`; a voided round shows no score.

用时截止于**交卷或超时**，并非系统猜测的首次完成时刻。完成后请点「交卷」。切换标签页照常计时，超时时间分固定 20；用时记录不可用则显示「—」，作废轮次不显示得分。

| Time used / 用时 | All evidence / 全部完成 | Half / 完成一半 | None / 未完成 |
| --- | ---: | ---: | ---: |
| ≤30 s | 40 | 30 | 20 |
| 35 s | 36 | 28 | 20 |
| 40 s | 32 | 26 | 20 |
| 45 s | 28 | 24 | 20 |
| 50 s | 25 | 23 | 20 |
| 55 s | 23 | 21 | 20 |
| 60 s | 20 | 20 | 20 |

The 30-second full-credit window and the 60-second floor are explicit game design limits. For full completion after 30 seconds, the curve is `40 − 20 × log₂(t / 30)`, rounded to an integer. There is no evidence yet to calibrate separate curves by task difficulty; different tasks should not be interpreted as an equivalent skill ranking.

前 30 秒满分、60 秒基础分是本游戏指定的边界，并非实测校准值。不同题目的难度并不完全相同，跨题得分不应当作严格的能力排名。

## Resilience / 抗干扰：0–20

```text
cleanCloses = closed
resilience = clamp(10 + 2×cleanCloses − decoys, 0, 20)
```

| Recorded behaviour / 行为 | Points / 分数 |
| --- | ---: |
| Base / 基础 | 10 |
| Clean close / 干净关闭 | +2 |
| False close / 假关闭 | −1 |
| Actual evasion chase / 实际闪避追逐 | 0 (record only / 仅记录) |
| 10-second close assist / 10 秒关闭辅助 | 0 (record only / 仅记录) |

`opened`, `dodges` and `revealed` are informational. Every recorded genuine close earns +2, including a close after the 10-second assist appears. The assist itself earns no points and removes none. A false-close click followed by a genuine close nets +1. Five genuine closes with no false-close clicks reach 20. Scores are clamped only after all rewards and penalties are added; genuine-close counters retain their existing deduplication.

打开广告标签页、闪避和辅助出现都仅作记录，不扣分。每次记录到真正关闭都 +2，辅助后正常关闭也照样加分；辅助出现本身不加不扣。先点假关闭再正常关闭，净 +1。不点假关闭，成功关闭 5 次即满 20。所有加减合计后再限制为 0–20；真正关闭沿用现有的去重记录。

## Missing data and examples / 边界与示例

- Clean rounds show `—` for resilience, so their attainable total is 80/100. No free resilience points are assigned.
- Missing or structurally corrupt ad records also show `—`. Valid zero-count records retain the neutral 10 points.
- A fully completed task at 30 seconds with 5 clean closes: `40 + 40 + 20 = 100`.
- A fully completed task at 45 seconds with 3 clean closes: `40 + 28 + 16 = 84`.
- A half-completed task at 30 seconds with 3 clean closes: `20 + 30 + 16 = 66`.
- A completed task at the 60-second timeout with 3 clean closes: `40 + 20 + 16 = 76`.
- Three genuine closes, including assisted closes, and any number of evasions: `10 + 2×3 = 16` resilience points.
- One false-close click followed by one genuine close: `10 − 1 + 2 = 11` resilience points.
- No task evidence at timeout and valid zero-count ad data: `0 + 20 + 10 = 30`.

## Basis and limits / 参考与限制

[NISTIR 7741, pp. 49–52](https://www.nist.gov/system/files/documents/2017/04/28/Guide_Final_Publication_Version.pdf) describes task success, time on task and errors as distinct usability measures. It does **not** prescribe this game's point weights or a logarithmic time-to-points conversion. The curve, progress weighting and thresholds above are explicit game design choices, not a standardized test or an empirically validated assessment.

NIST 的可用性指南分别测量任务成功、用时和错误；它没有规定本游戏的换分公式。本页曲线与权重是游戏设计选择，不是行业统一评分标准。
