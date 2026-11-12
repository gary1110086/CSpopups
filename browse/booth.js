/* Native activity entry; the durable clock and evidence belong to booth-round.js. */
(() => {
  'use strict';
  const VERSION = 'booth5';
  const app = document.getElementById('booth-app');
  const params = new URLSearchParams(location.search);
  const tasks = Array.isArray(window.BROWSE_BOOTH_TASKS) ? window.BROWSE_BOOTH_TASKS : [];
  const legacy = Array.isArray(window.BROWSE_BOOTH_LEGACY_TASKS) ? window.BROWSE_BOOTH_LEGACY_TASKS : [];
  const findTask = id => tasks.find(item => item.id === id) || legacy.find(item => item.id === id);
  const api = window.BROWSE_BOOTH;
  const lang = params.get('lang') === 'en' ? 'en' : 'zh';
  const li = lang === 'en' ? 0 : 1;
  const mode = params.get('mode') === 'clean' ? 'clean' : 'ads';
  const view = params.get('view') || 'choose';
  const taskId = params.get('task');
  const task = findTask(taskId);
  let starting = false;
  const t = (en, zh) => li === 0 ? en : zh;
  const txt = pair => Array.isArray(pair) ? String(pair[li] ?? pair[0] ?? '') : String(pair ?? '');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const status = value => { document.getElementById('booth-status').textContent = value; };
  function url(values = {}) {
    const next = new URL('booth.html', location.href);
    next.searchParams.set('lang', lang);
    next.searchParams.set('v', VERSION);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') next.searchParams.set(key, value);
    });
    if ((values.mode ?? mode) === 'clean') next.searchParams.set('mode', 'clean');
    else next.searchParams.delete('mode');
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
    const otherLang = lang === 'zh' ? 'en' : 'zh';
    return `<header class="booth-header">
      <a class="booth-brand" href="${esc(chooseURL())}"><span class="booth-brand-mark" aria-hidden="true">↗</span>${t('One Minute', '一分钟')}</a>
      <div class="booth-header-right"><span class="booth-stage">${esc(stage)}</span>
        <a class="booth-language" href="${esc(url({...values, lang:otherLang, mode:activeMode}))}" lang="${otherLang === 'en' ? 'en' : 'zh-Hans'}">${t('中文', 'English')}</a>
      </div>
    </header>`;
  }
  const modeName = value => value === 'ads' ? t('Ad challenge', '广告挑战') : t('Difficulty test · no ads', '难度测试 · 无广告');
  function taskCard(item) {
    return `<li><a class="booth-task-card" data-booth-task="${esc(item.id)}" href="${esc(url({view:'brief', task:item.id}))}">
      <img src="${esc(item.cover)}" alt="" loading="lazy" width="76" height="58">
      <span><strong>${esc(txt(item.title))}</strong><small>${esc(item.site)}${item.advanced ? ` · ${t('Advanced', '进阶')}` : ''}</small></span>
      <span class="booth-arrow" aria-hidden="true">→</span>
    </a></li>`;
  }
  function staffTask(item) {
    return `<div class="booth-staff-answer"><span class="booth-eyebrow">${t('ANSWER & CHECK', '答案与核对')}</span><p>${esc(txt(item.answer))}</p></div><h3>${t('A suggested route', '建议寻找路线')}</h3><ol class="booth-route">${item.route.map(step => `<li>${esc(txt(step))}</li>`).join('')}</ol><p class="booth-note">${t('This is one valid route, not a required sequence of clicks. Keep these details away from the participant until the round ends.', '这是一条可行路线，不限定参与者必须这样操作。挑战结束前，请勿向参与者展示。')}</p>`;
  }
  function staffHistory() {
    let records = [];
    try { records = api?.list?.() || []; } catch (_) { records = []; }
    return `<details class="booth-staff booth-history" id="booth-history"><summary>${t('Staff tools', '工作人员工具')}</summary><div class="booth-staff-body">
      <nav class="booth-staff-links" aria-label="${t('Staff tools', '工作人员工具')}">
        ${mode === 'ads' ? `<a href="${esc(url({mode:'clean'}))}">${t('Difficulty test · no ads', '难度测试 · 无广告')} ↗</a>` : `<a href="${esc(url({mode:'ads'}))}">${t('Return to the challenge', '返回正式挑战')} ↗</a>`}
        <a href="launch.html?lang=${lang}&amp;v=corn3">${t('Free browsing', '自由浏览')} ↗</a>
      </nav>
      <label class="booth-advanced"><input id="booth-include-advanced" type="checkbox"> ${t('Include advanced tasks in the draw', '随机抽题时加入进阶题')}</label>
      <h2>${t('Recent rounds', '最近轮次')}</h2>
      <p class="booth-note">${t('Records are stored in this browser tab.', '记录保存在当前浏览器标签页。')}</p>
      ${records.length ? `<ol class="booth-history-list">${records.map(record => {
      const item = findTask(record.taskId);
      return `<li><a href="${esc(localisedURL(api.resultURL(record)))}"><span>${esc(item ? txt(item.title) : t('Unavailable task', '题目不可用'))}<small>${esc(record.id)}</small></span><span>${esc(record.status === 'running' ? t('In progress', '进行中') : record.status === 'armed' ? t('Ready', '尚未开始') : record.status === 'void' ? t('Voided', '已作废') : t('Ended', '已结束'))} ↗</span></a></li>`;
    }).join('')}</ol>` : `<p>${t('No rounds have been started in this tab yet.', '此标签页还没有开始过的轮次。')}</p>`}</div></details>`;
  }
  function renderChoose() {
    document.title = mode === 'clean' ? t('Difficulty test · One Minute', '难度测试 · 一分钟') : t('One Minute · Web challenge', '一分钟 · 网页挑战');
    app.innerHTML = `${header(t('01 / Pick a task', '01 / 选题'))}
      <main id="booth-main" data-booth-view="choose" class="booth-main">
        <section class="booth-hero" aria-labelledby="booth-title">
          <div>
            <p class="booth-eyebrow">${mode === 'clean' ? t('Staff test · ads off', '工作人员测试 · 无广告') : t('Web challenge', '网页挑战')}</p>
            <h1 id="booth-title">${t('One minute.', '一分钟挑战')}</h1>
            <p>${mode === 'clean'
              ? t('Try a task without interruptions to check its difficulty.', '先关掉广告，试一试题目难不难。')
              : t('Find the right result in 60 seconds while simulated campus ads compete for your attention.', '在 60 秒内找对结果，同时应对模拟校园广告。')}</p>
            <button id="booth-random" class="booth-button booth-button-inverse" type="button">${t('Draw a task', '随机抽题')} <span aria-hidden="true">→</span></button>
          </div>
          <span class="booth-hero-clock" aria-hidden="true">1:00</span>
        </section>
        <section class="booth-collection" aria-labelledby="booth-task-heading">
          <div class="booth-collection-heading">
            <h2 id="booth-task-heading">${t('Or pick your own', '也可以自己选题')}</h2>
            <span>${tasks.length} ${t('tasks', '题')}</span>
          </div>
          <ul class="booth-task-grid">${tasks.map(taskCard).join('')}</ul>
        </section>
        ${staffHistory()}
      </main>`;
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
    document.title = `${txt(item.title)} · ${t('One Minute', '一分钟')}`;
    app.innerHTML = `${header(t('02 / Read the task', '02 / 读题'))}
      <main id="booth-main" data-booth-view="brief" class="booth-main booth-brief-main">
        <a class="booth-back" href="${esc(chooseURL())}">← ${t('Pick another task', '返回选题')}</a>
        <section class="booth-brief-layout" aria-labelledby="booth-title">
          <div class="booth-brief-copy">
            <p class="booth-eyebrow">${esc(item.site)}${item.advanced ? ` · ${t('Advanced', '进阶')}` : ''}${mode === 'clean' ? ` · ${esc(modeName(mode))}` : ''}</p>
            <h1 id="booth-title">${esc(txt(item.title))}</h1>
            <p class="booth-brief-text">${esc(txt(item.brief))}</p>
            ${item.hint ? `<aside class="booth-start-hint"><strong>${t('Start here', '从这里开始')}</strong><p>${esc(txt(item.hint))}</p></aside>` : ''}
            <div class="booth-goals">
              <h2>${t('What counts as finished', '完成条件')}</h2>
              <ol>${item.goals.map(goal => `<li>${esc(txt(goal))}</li>`).join('')}</ol>
            </div>
            <button id="booth-start" type="button" class="booth-button booth-button-primary">${t('Start the challenge', '开始挑战')} <span aria-hidden="true">→</span></button>
            <p id="booth-start-note" class="booth-note" role="status">${t('The 60 seconds start once the site is ready. Switching tabs does not pause the clock.', '网页就绪后开始 60 秒倒计时。切换标签页时照常计时。')}</p>
          </div>
          <img class="booth-brief-photo" src="${esc(item.cover)}" alt="" width="480" height="360">
        </section>
      </main>`;
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
    app.innerHTML = `${header(t('ROUND STATUS', '轮次状态'), round)}<main id="booth-main" data-booth-view="${armed ? 'armed' : 'running'}" class="booth-main booth-recovery"><p class="booth-eyebrow">${esc(item.site)} / ${esc(modeName(round.mode))}</p><h1 id="booth-title">${armed ? t('Ready, not started.', '已准备，尚未开始。') : t('Your round is still running.', '本轮仍在进行。')}</h1><p>${armed ? t('This round has no start time or result yet. Continue to the website to start the challenge once it is ready.', '本轮还没有开始时间，也没有结果。继续前往网站，页面准备好后才开始挑战。') : t('Opening this result page does not submit the round or reset its clock. Return to the task website to continue or submit.', '打开结果页不会交卷或重置计时。请回到任务网站继续，或在那里交卷。')}</p><div class="booth-recovery-task"><strong>${esc(txt(item.title))}</strong><span>${esc(txt(item.brief))}</span></div><a class="booth-button booth-button-primary" id="booth-resume" href="${esc(localisedURL(api.entryURL(round)))}">${armed ? t('Continue to the website', '继续前往网站') : t('Return to this round', '返回本轮任务')}<span aria-hidden="true">↗</span></a><a class="booth-text-link" href="${esc(chooseURL())}">${t('Back to task selection', '返回选题')}</a></main>`;
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
    app.innerHTML = `${header(t('03 / Results', '03 / 结果'), round)}
      <main id="booth-main" data-booth-view="result" class="booth-main booth-result-main">
        <section class="booth-result-hero" aria-labelledby="booth-title">
          <div>
            <p class="booth-eyebrow">${esc(modeName(round.mode))}</p>
            <h1 id="booth-title">${esc(reasonText(round))}</h1>
            <p>${esc(txt(item.title))} · ${esc(item.site)}</p>
          </div>
          <div class="booth-time-stamp"><span>${t('Time used', '用时')}</span><strong>${esc(elapsedText(round))}</strong></div>
        </section>
        <section class="booth-result-evidence" aria-labelledby="booth-evidence-title">
          <h2 id="booth-evidence-title">${t('Task record', '任务记录')}</h2>
          <ul class="booth-checks">${resultChecks(assessment)}</ul>
          <p class="booth-note">${round.status === 'void'
            ? t('Staff set this round aside.', '工作人员已将本轮作废。')
            : t('Staff will verify these records and any downloaded files.', '工作人员会核对记录和实际下载的文件。')}</p>
        </section>
        <div class="booth-result-actions">
          <strong id="booth-verdict">${esc(verdictText(round.judgement))}</strong>
          <a id="booth-review" class="booth-button booth-button-primary" href="${esc(localisedURL(api.reviewURL(round)))}">${t('Review this round', '查看本轮复盘')} <span aria-hidden="true">→</span></a>
        </div>
        <details class="booth-staff" id="booth-staff">
          <summary>${t('Staff · check and hand over', '工作人员 · 核对与交接')}</summary>
          <div class="booth-staff-body">
            <div class="booth-judgement-row">
              <label for="booth-judgement">${t('Task verdict', '任务判定')}</label>
              <select id="booth-judgement">
                <option value="unreviewed">${t('Awaiting review', '尚未核对')}</option>
                <option value="complete">${t('Complete', '已完成')}</option>
                <option value="partial">${t('Partly complete', '部分完成')}</option>
                <option value="incomplete">${t('Not complete', '未完成')}</option>
              </select>
            </div>
            ${staffTask(item)}
            <button id="booth-export" class="booth-text-link" type="button">${t('Export round record (TXT)', '导出本轮记录（TXT）')}</button>
            <div class="booth-handoff">
              <label><input id="booth-handoff" type="checkbox"> ${t('The extra ad tabs are closed.', '本轮打开的广告标签页已关好。')}</label>
              <button id="booth-next" class="booth-button booth-button-primary" type="button" disabled>${t('Next participant', '下一位')} <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </details>
      </main>`;
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
    app.innerHTML = `${header(t('LET’S RESET THE ENTRY', '重新找到入口'))}<main id="booth-main" data-booth-view="error" class="booth-main booth-recovery"><p class="booth-eyebrow">${t('NOT A RESULT', '这不是本轮结果')}</p><h1 id="booth-title">${unavailable ? t('The activity could not load.', '活动未能加载。') : t('We can’t find that round.', '找不到这轮记录。')}</h1><p>${unavailable ? t('The activity runtime is unavailable. Reload the page before starting. No challenge has started here.', '活动组件暂时不可用。请重新加载后再开始，这里尚未启动挑战。') : t('The link is missing, invalid or no longer stored in this tab. We will not guess a previous participant’s result or add more time to an old round.', '链接缺失、无效，或记录已不在此标签页中。这里不会猜测上一位的结果，也不会为旧轮次重开计时。')}</p><a class="booth-button booth-button-primary" href="${esc(chooseURL())}">${t('Return to task selection', '返回选题')}<span aria-hidden="true">↗</span></a>${unavailable ? `<button class="booth-text-link" type="button" id="booth-reload">${t('Reload page', '重新加载')}</button>` : ''}</main>`;
    document.getElementById('booth-reload')?.addEventListener('click', () => location.reload());
  }
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hans';
  if (!app) return;
  if (!api || !tasks.length) { renderError('runtime'); return; }
  if (view === 'result') {
    let round;
    try { round = params.get('round') ? api.get(params.get('round')) : null; } catch (_) { round = null; }
    const item = round && findTask(round.taskId);
    if (!round || !item) renderError('round'); else renderResult(round, item);
  } else if (view === 'brief') {
    if (task) renderBrief(task); else renderError('task');
  } else renderChoose();
})();
