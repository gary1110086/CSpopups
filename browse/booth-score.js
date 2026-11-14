/* Pure scoring for a finished booth round. No storage, no DOM, no globals read. */
(() => {
  'use strict';
  const CONFIG = Object.freeze({
    TASK_MAX: 40, RESILIENCE_MAX: 60, RESILIENCE_BASE: 20,
    CLEAN_CLOSE: 2, DECOY: -6, DODGE: -4, REVEAL: -2
  });
  const count = v => Number.isInteger(v) && v > 0 ? Math.min(10000, v) : 0;
  const taskScore = assessment => {
    const checks = Array.isArray(assessment?.checks) ? assessment.checks : [];
    const total = checks.length, met = checks.filter(c => c?.met === true).length;
    return {score: total ? Math.round(CONFIG.TASK_MAX * met / total) : 0, met, total};
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
  const compute = (assessment, reviewData) => {
    const task = taskScore(assessment), resilience = resilienceScore(reviewData);
    return {task, resilience, total: task.score + (resilience ? resilience.score : 0)};
  };
  window.BROWSE_BOOTH_SCORE = Object.freeze({CONFIG, taskScore, resilienceScore, compute});
})();
