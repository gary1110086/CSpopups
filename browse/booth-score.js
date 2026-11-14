/* Pure scoring for a finished booth round. No storage, no DOM, no globals read. */
(() => {
  'use strict';
  const CONFIG = Object.freeze({TASK_MAX: 40});
  const taskScore = assessment => {
    const checks = Array.isArray(assessment?.checks) ? assessment.checks : [];
    const total = checks.length, met = checks.filter(c => c?.met === true).length;
    return {score: total ? Math.round(CONFIG.TASK_MAX * met / total) : 0, met, total};
  };
  window.BROWSE_BOOTH_SCORE = Object.freeze({CONFIG, taskScore});
})();
