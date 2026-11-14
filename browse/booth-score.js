/* Pure scoring for a finished booth round. No storage, no DOM, no globals read. */
(() => {
  'use strict';
  const CONFIG = Object.freeze({
    TASK_MAX: 40, TIME_MAX: 40, TIME_BASE: 20,
    ROUND_MS: 60000, TIME_FULL_MS: 30000,
    RESILIENCE_MAX: 20, RESILIENCE_BASE: 10,
    CLEAN_CLOSE: 1, DECOY: -3, DODGE: -2, REVEAL: -1
  });
  const count = v => Number.isInteger(v) && v > 0 ? Math.min(10000, v) : 0;
  const taskScore = assessment => {
    const checks = Array.isArray(assessment?.checks) ? assessment.checks : [];
    const total = checks.length, met = checks.filter(c => c?.met === true).length;
    return {score: total ? Math.round(CONFIG.TASK_MAX * met / total) : 0, met, total};
  };
  const timeScore = (assessment, round) => {
    if (round?.status !== 'ended' || !Number.isFinite(round.startedAt) || round.startedAt <= 0
      || !Number.isFinite(round.endedAt) || round.endedAt < round.startedAt) return null;
    const elapsedMs = Math.min(CONFIG.ROUND_MS, round.endedAt - round.startedAt);
    const task = taskScore(assessment), completion = task.total ? task.met / task.total : 0;
    // Full speed credit through 30s, then a normalized logarithmic decline to
    // the 20-point floor at 60s. Only the bonus is weighted by task progress.
    const curve = elapsedMs <= CONFIG.TIME_FULL_MS ? 1
      : 1 - Math.log(elapsedMs / CONFIG.TIME_FULL_MS) / Math.log(CONFIG.ROUND_MS / CONFIG.TIME_FULL_MS);
    const bonus = Math.round((CONFIG.TIME_MAX - CONFIG.TIME_BASE) * completion * curve);
    return {score: CONFIG.TIME_BASE + bonus, base: CONFIG.TIME_BASE, bonus, elapsedMs, completion};
  };
  const resilienceScore = reviewData => {
    const c = reviewData?.counts;
    if (!c || typeof c !== 'object' || Array.isArray(c)) return null;
    const closed = count(c.closed), revealed = count(c.revealed), decoys = count(c.decoys), dodges = count(c.dodges);
    // Aggregate approximation: per-card ID sets could differ across cards. See the spec.
    const cleanCloses = Math.max(0, closed - revealed);
    const raw = CONFIG.RESILIENCE_BASE + CONFIG.CLEAN_CLOSE * cleanCloses
      + CONFIG.DECOY * decoys + CONFIG.DODGE * dodges + CONFIG.REVEAL * revealed;
    return {score: Math.max(0, Math.min(CONFIG.RESILIENCE_MAX, raw)),
      cleanCloses, closed, decoys, dodges, revealed, shown: count(c.shown), opened: count(c.opened)};
  };
  const compute = (assessment, reviewData, round) => {
    const task = taskScore(assessment), time = timeScore(assessment, round), resilience = resilienceScore(reviewData);
    return {task, time, resilience, total: task.score + (time ? time.score : 0) + (resilience ? resilience.score : 0)};
  };
  window.BROWSE_BOOTH_SCORE = Object.freeze({CONFIG, taskScore, timeScore, resilienceScore, compute});
})();
