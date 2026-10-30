/* Native activity entry; the durable clock and evidence belong to booth-round.js. */
(() => {
  'use strict';
  const VERSION = 'corn1a';
  const app = document.getElementById('booth-app');
  const params = new URLSearchParams(location.search);
  const tasks = Array.isArray(window.BROWSE_BOOTH_TASKS) ? window.BROWSE_BOOTH_TASKS : [];
  const api = window.BROWSE_BOOTH;
  const lang = params.get('lang') === 'en' ? 'en' : 'zh';
  const li = lang === 'en' ? 0 : 1;
  const mode = params.get('mode') === 'ads' ? 'ads' : 'clean';
  const view = params.get('view') || 'choose';
  const taskId = params.get('task');
  const task = tasks.find(item => item.id === taskId);
  let starting = false;
  const t = (en, zh) => li === 0 ? en : zh;
  const txt = pair => Array.isArray(pair) ? String(pair[li] ?? pair[0] ?? '') : String(pair ?? '');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const status = value => { document.getElementById('booth-status').textContent = value; };
  function url(values = {}) {
    const next = new URL('booth.html', location.href);
    next.searchParams.set('mode', mode);
    next.searchParams.set('lang', lang);
    next.searchParams.set('v', VERSION);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') next.searchParams.set(key, value);
    });
    return next.pathname + next.search;
  }
  const chooseURL = () => url();
  function localisedURL(raw) {
    try {
      const next = new URL(raw, location.href);
      if (next.origin !== location.origin) return chooseURL();
      next.searchParams.set('lang', lang);
      return next.pathname + next.search;
    } catch (_) { return chooseURL(); }
  }
  function header(stage, record) {
    const values = {view: view === 'choose' ? null : view, task: taskId, round: params.get('round')};
    const activeMode = record?.mode || mode;
    return `<header class="booth-header">
      <a class="booth-brand" href="${esc(chooseURL())}" aria-label="${esc(t('One Minute · activity home', '一分钟 · 活动首页'))}"><span class="booth-brand-mark" aria-hidden="true">1m<span>↗</span></span><span>${t('ONE MINUTE', '一分钟')}<small>${t('THE WEB TASK CHALLENGE', '网页任务挑战')}</small></span></a>
      <div class="booth-header-right"><span class="booth-stage">${esc(stage)}</span><nav class="booth-language" aria-label="${esc(t('Language', '语言'))}"><a href="${esc(url({...values, lang:'zh', mode:activeMode}))}" lang="zh-Hans" ${lang === 'zh' ? 'aria-current="true"' : ''}>中文</a><a href="${esc(url({...values, lang:'en', mode:activeMode}))}" lang="en" ${lang === 'en' ? 'aria-current="true"' : ''}>EN</a></nav></div>
    </header>`;
  }
  function footer() {
    return `<footer class="booth-footer"><span>${t('ONE TASK. A LITTLE ATTENTION.', '一项任务，留意每一次点击。')}</span><a href="launch.html?lang=${lang}&v=${VERSION}">${t('Free browsing ↗', '自由浏览 ↗')}</a></footer>`;
  }
  function modePicker() {
    const common = {view: view === 'brief' ? 'brief' : null, task: view === 'brief' ? taskId : null};
    return `<div class="booth-mode-block"><div><span class="booth-eyebrow">${t('CHOOSE THE SETTING', '选择体验环境')}</span><p>${t('The same task and the same 60 seconds.', '任务相同，都是60秒。')}</p></div><nav class="booth-mode" aria-label="${esc(t('Activity setting', '活动环境'))}"><a id="booth-mode-clean" href="${esc(url({...common, mode:'clean'}))}" ${mode === 'clean' ? 'aria-current="true"' : ''}><span aria-hidden="true">○</span>${t('Clean · no ads', '清净版 · 无广告')}</a><a id="booth-mode-ads" href="${esc(url({...common, mode:'ads'}))}" ${mode === 'ads' ? 'aria-current="true"' : ''}><span aria-hidden="true">✳</span>${t('With interruptions', '广告干扰版')}</a></nav></div>`;
  }
  const number = index => String(index + 1).padStart(2, '0');
  const modeName = value => value === 'ads' ? t('With interruptions', '广告干扰版') : t('Clean · no ads', '清净版 · 无广告');
  function taskCard(item, index) {
    return `<a class="booth-task-card" data-booth-task="${esc(item.id)}" href="${esc(url({view:'brief', task:item.id}))}"><div class="booth-task-image"><img src="${esc(item.cover)}" alt="" loading="lazy" width="640" height="400"><span class="booth-task-no">${number(index)}</span><span class="booth-level${item.advanced ? ' is-advanced' : ''}">${item.advanced ? t('ADVANCED', '进阶') : t('STANDARD', '标准')}</span></div><div class="booth-task-copy"><span class="booth-site">${esc(item.site)}</span><h3>${esc(txt(item.title))}</h3><p>${esc(txt(item.brief))}</p><span class="booth-card-link">${t('Read the brief', '查看题目')}<span aria-hidden="true">↗</span></span></div></a>`;
  }
  function staffTask(item) {
    return `<div class="booth-staff-answer"><span class="booth-eyebrow">${t('ANSWER & CHECK', '答案与核对')}</span><p>${esc(txt(item.answer))}</p></div><h3>${t('A suggested route', '建议寻找路线')}</h3><ol class="booth-route">${item.route.map(step => `<li>${esc(txt(step))}</li>`).join('')}</ol><p class="booth-note">${t('This is one valid route, not a required sequence of clicks. Keep these details away from the participant until the round ends.', '这是一条可行路线，不限定参与者必须这样操作。挑战结束前，请勿向参与者展示。')}</p>`;
  }
  function staffHistory() {
    let records = [];
    try { records = api?.list?.() || []; } catch (_) { records = []; }
    return `<details class="booth-staff booth-history" id="booth-history"><summary><span>${t('Staff desk', '工作人员区域')}</span><small>${t('Recent local rounds', '查看本机最近轮次')}</small><span class="booth-plus" aria-hidden="true">+</span></summary><div class="booth-staff-body"><p class="booth-note">${t('Records stay in this browser tab. Open a specific round to review it; starting a new participant does not erase these records.', '记录保留在此浏览器标签页中。请打开指定轮次查看；新参与者不会覆盖这些记录。')}</p>${records.length ? `<ol class="booth-history-list">${records.map(record => {
      const item = tasks.find(candidate => candidate.id === record.taskId);
      return `<li><a href="${esc(localisedURL(api.resultURL(record)))}"><span>${esc(item ? txt(item.title) : t('Unavailable task', '题目不可用'))}<small>${esc(record.id)}</small></span><span>${esc(record.status === 'running' ? t('In progress', '进行中') : record.status === 'armed' ? t('Ready', '尚未开始') : record.status === 'void' ? t('Voided', '已作废') : t('Ended', '已结束'))} ↗</span></a></li>`;
    }).join('')}</ol>` : `<p>${t('No rounds have been started in this tab yet.', '此标签页还没有开始过的轮次。')}</p>`}</div></details>`;
  }
  function renderChoose() {
    document.title = t('One Minute · Choose a task', '60秒任务挑战 · 选择题目');
    app.innerHTML = `${header(t('01 / CHOOSE', '01 / 选题'))}<main id="booth-main" data-booth-view="choose" class="booth-main"><section class="booth-hero" aria-labelledby="booth-title"><div class="booth-hero-copy"><p class="booth-eyebrow">${t('A SMALL CHALLENGE IN AN EVERYDAY WEB', '在日常网页里，完成一个小挑战')}</p><h1 id="booth-title">${t('One task.<br>One minute.', '一个任务。<br>一分钟。')}</h1><p class="booth-intro">${t('Find, save, make or explore. Choose a task, take your time reading, then see how far you get in 60 seconds.', '寻找、收藏、制作或探索。先选一题，慢慢读完，再看看60秒内能走到哪一步。')}</p><div class="booth-hero-foot"><span class="booth-dot" aria-hidden="true"></span>${t('Read first. The clock starts on the website.', '读题不计时，到达网站后才开始。')}</div></div><div class="booth-ticket" aria-label="${esc(t('60 seconds · 1 task · 10 websites', '60秒 · 1项任务 · 10个网站'))}"><div class="booth-ticket-top"><span>${t('ADMIT ONE', '一人一轮')}</span><span aria-hidden="true">↗</span></div><div class="booth-sixty" aria-hidden="true">60<span>SEC</span></div><div class="booth-ticket-bottom"><span>${t('1 TASK', '1项任务')}</span><span>${t('10 WEBSITES', '10个网站')}</span></div><div class="booth-ticket-tear" aria-hidden="true"><span></span> ONE MINUTE / OPEN WEB <span></span></div></div></section>${modePicker()}<section class="booth-collection" aria-labelledby="booth-task-heading"><div class="booth-collection-heading"><div><p class="booth-eyebrow">${t('THE TASK COLLECTION', '本轮任务，由你选择')}</p><h2 id="booth-task-heading">${t('Pick your starting point.', '从这里，选一题。')}</h2></div><div class="booth-random"><label><input id="booth-include-advanced" type="checkbox">${t('Include 2 advanced tasks', '随机时加入2道进阶题')}</label><button id="booth-random" class="booth-button booth-button-dark" type="button"><span aria-hidden="true">⚄</span>${t('Draw a task', '随机抽一题')}<span aria-hidden="true">↗</span></button></div></div><div class="booth-task-grid">${tasks.map(taskCard).join('')}</div></section>${staffHistory()}</main>${footer()}`;
    document.getElementById('booth-random').addEventListener('click', () => {
      const pool = tasks.filter(item => !item.advanced || document.getElementById('booth-include-advanced').checked);
      if (!pool.length) { status(t('No tasks are available.', '暂无可用题目。')); return; }
      const values = new Uint32Array(1);
      if (window.crypto?.getRandomValues) crypto.getRandomValues(values); else values[0] = Math.floor(Math.random() * 4294967296);
      const item = pool[values[0] % pool.length];
      location.assign(url({view:'brief', task:item.id}));
    });
  }
  function renderBrief(item) {
    const index = tasks.indexOf(item);
    document.title = `${txt(item.title)} · ${t('One Minute', '60秒任务挑战')}`;
    app.innerHTML = `${header(t('02 / READ', '02 / 读题'))}<main id="booth-main" data-booth-view="brief" class="booth-main booth-brief-main"><a class="booth-back" href="${esc(chooseURL())}">← ${t('Choose a different task', '换一道题')}</a><section class="booth-brief-layout" aria-labelledby="booth-title"><div class="booth-brief-photo"><img src="${esc(item.cover)}" alt="" width="800" height="1000"><div><span>${esc(item.site)}</span><span>${number(index)} / 10</span></div><span class="booth-photo-word" aria-hidden="true">ONE<br>MINUTE.</span></div><div class="booth-brief-copy"><p class="booth-eyebrow">${t('YOUR TASK', '你的挑战')} <span class="booth-inline-level">${item.advanced ? t('ADVANCED', '进阶') : t('STANDARD', '标准')}</span></p><h1 id="booth-title">${esc(txt(item.title))}</h1><p class="booth-brief-text">${esc(txt(item.brief))}</p><div class="booth-goals"><h2>${t('What to complete', '需要完成')}</h2><ol>${item.goals.map(goal => `<li>${esc(txt(goal))}</li>`).join('')}</ol></div><div class="booth-rule"><strong>60<span>${t('seconds', '秒')}</span></strong><p>${t('The clock begins when the website is ready. It keeps running through tabs, ads and reloads. Finish early or let the round end automatically.', '网站可操作后开始计时。切换标签、进入广告、刷新都不会暂停。可以提前交卷，或等时间到自动结束。')}</p></div><button id="booth-start" type="button" class="booth-button booth-button-lime">${t('Start the 60-second challenge', '开始60秒挑战')}<span aria-hidden="true">↗</span></button><p id="booth-start-note" class="booth-note" role="status">${t('Ready when you are. Reading this page uses none of your time.', '准备好了再开始，读题不占用挑战时间。')}</p></div></section>${modePicker()}<details class="booth-staff" id="booth-staff"><summary><span>${t('Staff only · route & answer', '工作人员 · 路线与答案')}</span><small>${t('Keep closed while briefing', '读题时请保持收起')}</small><span class="booth-plus" aria-hidden="true">+</span></summary><div class="booth-staff-body">${staffTask(item)}</div></details></main>${footer()}`;
    document.getElementById('booth-start').addEventListener('click', () => {
      if (starting) return;
      const button = document.getElementById('booth-start');
      const note = document.getElementById('booth-start-note');
      starting = true;
      button.disabled = true;
      try {
        if (!api || typeof api.create !== 'function') throw new Error('runtime');
        const round = api.create(item.id, mode, lang);
        if (!round || round.status !== 'armed') throw new Error('storage');
        location.assign(api.entryURL(round));
      } catch (_) {
        starting = false;
        button.disabled = false;
        note.textContent = t('This round could not be prepared. Allow this site’s session storage, then try again. Your challenge has not started.', '未能准备本轮。请允许此网站的会话存储，再试一次。挑战尚未开始。');
        note.classList.add('is-error');
        status(note.textContent);
      }
    });
  }
  function elapsedText(round) {
    if (!Number.isFinite(round.startedAt) || !Number.isFinite(round.endedAt) || round.startedAt <= 0) return '—';
    const seconds = Math.max(0, Math.min(60, (round.endedAt - round.startedAt) / 1000));
    return `${seconds.toFixed(1)} ${t('sec', '秒')}`;
  }
  function reasonText(round) {
    if (round.status === 'void') return t('Round voided', '本轮已作废');
    return ['timeout','expired','deadline','time'].includes(round.reason) ? t('Time is up', '时间到') : t('Round submitted', '本轮已交卷');
  }
  function verdictText(value) {
    return ({complete:t('Complete', '已完成'), partial:t('Partly complete', '部分完成'), incomplete:t('Not complete', '未完成'), unreviewed:t('Awaiting staff review', '等待工作人员核对')})[value] || t('Awaiting staff review', '等待工作人员核对');
  }
  function validAssessment(round) {
    try {
      const result = api.assess(round);
      if (result && Array.isArray(result.checks)) return result;
    } catch (_) { /* A broken assessment must not become a successful result. */ }
    return {checks:[], allMet:false};
  }
  function resultChecks(assessment) {
    return assessment.checks.length ? assessment.checks.map(check => `<li data-booth-check data-met="${check.met === true}"><span class="booth-check-symbol" aria-hidden="true">${check.met === true ? '✓' : '—'}</span><div><strong>${esc(txt(check.label))}</strong>${check.detail ? `<p>${esc(txt(check.detail))}</p>` : ''}</div><span class="booth-check-state">${check.met === true ? t('Recorded', '有记录') : t('Not confirmed', '未确认')}</span></li>`).join('') : `<li data-booth-check data-met="false"><span class="booth-check-symbol" aria-hidden="true">—</span><div><strong>${t('No task evidence is available.', '暂无可用的任务证据。')}</strong><p>${t('Ask the participant and inspect the actual output. No success is inferred.', '请询问参与者并检查实际产物；系统不会据此推断成功。')}</p></div></li>`;
  }
  function renderPending(round, item) {
    const armed = round.status === 'armed';
    document.title = t('This round is not finished · One Minute', '本轮尚未结束 · 60秒任务挑战');
    app.innerHTML = `${header(t('ROUND STATUS', '轮次状态'), round)}<main id="booth-main" data-booth-view="${armed ? 'armed' : 'running'}" class="booth-main booth-recovery"><p class="booth-eyebrow">${esc(item.site)} / ${esc(modeName(round.mode))}</p><h1 id="booth-title">${armed ? t('Ready, not started.', '已准备，尚未开始。') : t('Your round is still running.', '本轮仍在进行。')}</h1><p>${armed ? t('This round has no start time or result yet. Continue to the website to start the challenge once it is ready.', '本轮还没有开始时间，也没有结果。继续前往网站，页面准备好后才开始挑战。') : t('Opening this result page does not submit the round or reset its clock. Return to the task website to continue or submit.', '打开结果页不会交卷或重置计时。请回到任务网站继续，或在那里交卷。')}</p><div class="booth-recovery-task"><strong>${esc(txt(item.title))}</strong><span>${esc(txt(item.brief))}</span></div><a class="booth-button booth-button-lime" id="booth-resume" href="${esc(localisedURL(api.entryURL(round)))}">${armed ? t('Continue to the website', '继续前往网站') : t('Return to this round', '返回本轮任务')}<span aria-hidden="true">↗</span></a><a class="booth-text-link" href="${esc(chooseURL())}">${t('Back to task selection', '返回选题')}</a></main>${footer()}`;
  }
  function exportResult(round, item) {
    const assessment = validAssessment(round);
    const lines = [t('ONE MINUTE — ROUND RECORD', '一分钟 — 本轮记录'), '', `${t('Round', '轮次')}: ${round.id}`, `Seed: ${round.seed}`, `${t('Task', '题目')}: ${txt(item.title)} (${item.id})`, `${t('Website', '网站')}: ${item.site}`, `${t('Mode', '环境')}: ${modeName(round.mode)}`, `${t('Status', '状态')}: ${reasonText(round)}`, `${t('Time used', '实际用时')}: ${elapsedText(round)}`, `${t('Staff verdict', '工作人员判定')}: ${verdictText(round.judgement)}`, '', txt(item.brief), '', t('RECORDED CHECKS — not an automatic verdict', '任务证据 — 不等于自动判定'), ...assessment.checks.map(check => `${check.met === true ? '[✓]' : '[ ]'} ${txt(check.label)}${check.detail ? ': ' + txt(check.detail) : ''}`), '', t('STAFF REFERENCE', '工作人员参考'), txt(item.answer), ...item.route.map((step, index) => `${index + 1}. ${txt(step)}`), '', `${t('This round’s review', '本轮复盘')}: ${new URL(api.reviewURL(round), location.href).href}`, '', t('Generated locally. A download record shows that the browser was asked to download a generated file; staff should verify files on disk where needed.', '本地生成。导出记录代表文件已生成并向浏览器发起下载；需要时由工作人员核对磁盘上的实际文件。')];
    let objectURL;
    try {
      objectURL = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\r\n')], {type:'text/plain;charset=utf-8'}));
      const anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = `one-minute-${String(round.id).replace(/[^a-zA-Z0-9_-]/g, '').slice(0,80)}.txt`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      status(t('The round record download has been requested.', '已发起本轮记录下载。'));
      setTimeout(() => URL.revokeObjectURL(objectURL), 1500);
    } catch (_) {
      if (objectURL) URL.revokeObjectURL(objectURL);
      status(t('The file could not be generated. Try exporting again.', '未能生成文件，请重新导出。'));
    }
  }
  function renderResult(round, item) {
    if (round.status === 'armed' || round.status === 'running') { renderPending(round, item); return; }
    const assessment = validAssessment(round);
    document.title = `${reasonText(round)} · ${t('One Minute', '60秒任务挑战')}`;
    app.innerHTML = `${header(t('03 / REFLECT', '03 / 回看'), round)}<main id="booth-main" data-booth-view="result" class="booth-main booth-result-main"><section class="booth-result-hero" aria-labelledby="booth-title"><div><p class="booth-eyebrow">${t('ONE MINUTE / ROUND RECORD', '一分钟 / 本轮记录')}</p><h1 id="booth-title">${esc(reasonText(round))}<span aria-hidden="true">↗</span></h1><p>${round.status === 'void' ? t('This attempt was set aside. It does not count as a task failure.', '本轮已作废，不记作任务失败。') : t('Take a breath. Let’s look at what you did.', '先缓一缓，一起看看完成了哪些事。')}</p></div><div class="booth-time-stamp"><span>${t('TIME USED', '实际用时')}</span><strong>${esc(elapsedText(round))}</strong><small>${esc(modeName(round.mode))}</small></div></section><div class="booth-result-grid"><section class="booth-result-evidence" aria-labelledby="booth-evidence-title"><div class="booth-result-task"><img src="${esc(item.cover)}" alt="" width="160" height="120"><div><span class="booth-site">${esc(item.site)}</span><h2 id="booth-evidence-title">${esc(txt(item.title))}</h2></div></div><p class="booth-result-brief">${esc(txt(item.brief))}</p><h3 class="booth-eyebrow">${t('TASK EVIDENCE AT THE END', '结束时的任务证据')}</h3><ul class="booth-checks">${resultChecks(assessment)}</ul><p class="booth-note">${t('These are local records, not an automatic score. A missing record is not proof that nothing was done. Staff will check the task and any downloaded files.', '这些是本地记录，不是自动评分；缺少记录不代表什么都没做。工作人员会核对任务与实际下载文件。')}</p></section><aside class="booth-result-next" aria-labelledby="booth-review-title"><span class="booth-eyebrow">${t('THE CONVERSATION CONTINUES', '接下来，一起复盘')}</span><h2 id="booth-review-title">${t('Where did your attention go?', '注意力，去了哪里？')}</h2><p>${t('Open this round’s timeline to talk about the page, the choices and any interruptions. Misclicks do not decide whether the task was completed.', '打开本轮时间线，回看网页、选择与干扰。误点次数不决定任务是否完成。')}</p><div class="booth-verdict-display"><span>${t('Staff verdict', '工作人员判定')}</span><strong id="booth-verdict">${esc(verdictText(round.judgement))}</strong></div><a id="booth-review" class="booth-button booth-button-dark" href="${esc(localisedURL(api.reviewURL(round)))}">${t('Review this round', '进入本轮复盘')}<span aria-hidden="true">↗</span></a><button id="booth-export" type="button" class="booth-button booth-button-outline">${t('Export round record · TXT', '导出本轮记录 · TXT')}<span aria-hidden="true">↓</span></button><p class="booth-round-id">${t('ROUND', '轮次')} <span>${esc(round.id)}</span></p></aside></div><details class="booth-staff" id="booth-staff"><summary><span>${t('Staff desk · verify this task', '工作人员 · 核对本轮任务')}</span><small>${t('Answer, route & verdict', '答案、路线与判定')}</small><span class="booth-plus" aria-hidden="true">+</span></summary><div class="booth-staff-body"><div class="booth-judgement-row"><div><label for="booth-judgement">${t('Your task verdict', '任务判定')}</label><p>${t('Check the evidence with the participant before choosing.', '与参与者核对证据后再选择。')}</p></div><select id="booth-judgement"><option value="unreviewed">${t('Awaiting review', '尚未核对')}</option><option value="complete">${t('Complete', '已完成')}</option><option value="partial">${t('Partly complete', '部分完成')}</option><option value="incomplete">${t('Not complete', '未完成')}</option></select></div><div class="booth-goals"><h3>${t('Completion conditions', '完成条件')}</h3><ol>${item.goals.map(goal => `<li>${esc(txt(goal))}</li>`).join('')}</ol></div>${staffTask(item)}</div></details><section class="booth-handoff" aria-labelledby="booth-handoff-title"><div><p class="booth-eyebrow">${t('BEFORE THE NEXT PERSON', '交给下一位之前')}</p><h2 id="booth-handoff-title">${t('A fresh start.', '准备好，再交接。')}</h2><p>${t('Return to this task or review tab, then close any advertising tabs opened during this round. Manage downloaded files as needed.', '回到本轮任务或复盘标签页，关闭本轮打开的广告标签，并按现场流程整理下载文件。')}</p><label class="booth-handoff-check"><input id="booth-handoff" type="checkbox"><span>${t('Staff check: this tab is ready and the extra tabs have been closed.', '工作人员确认：已回到本标签，额外打开的标签已关闭。')}</span></label></div><button id="booth-next" class="booth-button booth-button-lime" type="button" disabled>${t('Next participant', '下一位参与者')}<span aria-hidden="true">↗</span></button></section></main>${footer()}`;
    const select = document.getElementById('booth-judgement');
    select.value = ['complete','partial','incomplete'].includes(round.judgement) ? round.judgement : 'unreviewed';
    select.addEventListener('change', () => {
      try {
        const updated = api.judge(round.id, select.value);
        const current = api.get(round.id);
        if (!updated || !current || current.judgement !== select.value) throw new Error('save');
        round = current;
        document.getElementById('booth-verdict').textContent = verdictText(round.judgement);
        status(t('Staff verdict saved for this round.', '本轮工作人员判定已保存。'));
      } catch (_) {
        select.value = round.judgement || 'unreviewed';
        status(t('The verdict could not be saved. Try again.', '未能保存判定，请重试。'));
      }
    });
    document.getElementById('booth-export').addEventListener('click', () => exportResult(api.get(round.id) || round, item));
    document.getElementById('booth-handoff').addEventListener('change', event => { document.getElementById('booth-next').disabled = !event.target.checked; });
    document.getElementById('booth-next').addEventListener('click', () => {
      if (document.getElementById('booth-handoff').checked) location.assign(chooseURL());
    });
  }
  function renderError(kind) {
    const unavailable = kind === 'runtime';
    document.title = t('Round unavailable · One Minute', '轮次不可用 · 60秒任务挑战');
    app.innerHTML = `${header(t('LET’S RESET THE ENTRY', '重新找到入口'))}<main id="booth-main" data-booth-view="error" class="booth-main booth-recovery"><p class="booth-eyebrow">${t('NOT A RESULT', '这不是本轮结果')}</p><h1 id="booth-title">${unavailable ? t('The activity could not load.', '活动未能加载。') : t('We can’t find that round.', '找不到这轮记录。')}</h1><p>${unavailable ? t('The activity runtime is unavailable. Reload the page before starting. No challenge has started here.', '活动组件暂时不可用。请重新加载后再开始，这里尚未启动挑战。') : t('The link is missing, invalid or no longer stored in this tab. We will not guess a previous participant’s result or add more time to an old round.', '链接缺失、无效，或记录已不在此标签页中。这里不会猜测上一位的结果，也不会为旧轮次重开计时。')}</p><a class="booth-button booth-button-lime" href="${esc(chooseURL())}">${t('Return to task selection', '返回选题')}<span aria-hidden="true">↗</span></a>${unavailable ? `<button class="booth-text-link" type="button" id="booth-reload">${t('Reload page', '重新加载')}</button>` : ''}</main>${footer()}`;
    document.getElementById('booth-reload')?.addEventListener('click', () => location.reload());
  }
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hans';
  if (!app) return;
  if (!api || !tasks.length) { renderError('runtime'); return; }
  if (view === 'result') {
    let round;
    try { round = params.get('round') ? api.get(params.get('round')) : null; } catch (_) { round = null; }
    const item = round && tasks.find(candidate => candidate.id === round.taskId);
    if (!round || !item) renderError('round'); else renderResult(round, item);
  } else if (view === 'brief') {
    if (task) renderBrief(task); else renderError('task');
  } else renderChoose();
})();
