/* A durable, explicit 60-second booth round. Ordinary website visits stay untimed. */
(() => {
  'use strict';
  const VERSION = 'corn1', PREFIX = 'br-booth-v1:', INDEX = 'br-booth-index-v1', LIMIT = 12, DURATION = 60000;
  const RULES = {
    'minute-wall-aurora': {scene:'wallpapers',file:'wallpaper.html',target:'orbital-aurora',key:'wall-saved'},
    'minute-recipe-lunch': {scene:'recipes',file:'recipe.html',target:'chickpea-salad',key:'bp-recipes-saved'},
    'minute-tool-webp': {scene:'tools',file:'tools.html',target:'city'},
    'minute-movie-steel': {scene:'movies',file:'movie.html',target:'steel',key:'frame-watchlist'},
    'minute-outing-museum': {scene:'events',file:'events.html',target:'museum-four-galleries',key:'bp-outings-saved'},
    'minute-book-alice': {scene:'books',file:'book.html',target:'alice',key:'culture-reading-list'},
    'minute-museum-wave': {scene:'museum',file:'museum.html',target:'56353',key:'culture-exhibition'},
    'minute-nature-cardinal': {scene:'nature',file:'nature.html',target:'cardinal',key:'nature-sightings'},
    'minute-travel-klcc': {scene:'travel',file:'travel.html',target:'klcc'},
    'minute-market-starter': {scene:'market',file:'market.html',target:'canon-good',key:'loop-saved'}
  };
  const FILES = new Set(Object.values(RULES).map(r => r.file));
  const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const finite = v => typeof v === 'number' && Number.isFinite(v);
  const time = v => finite(v) && v > 0 && v < 9000000000000000;
  const idOK = v => typeof v === 'string' && /^r_[a-f0-9]{24}$/.test(v);
  const seedOK = v => typeof v === 'string' && /^m_[a-f0-9]{24}$/.test(v);
  const taskData = id => (window.BROWSE_BOOTH_TASKS || []).find(t => t.id === id);
  const clone = v => JSON.parse(JSON.stringify(v));
  const escape = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const emptyEvidence = taskId => ({targetId:RULES[taskId].target,saved:false,found:false,servings:null,trip:null,exports:[],capturedAt:0});
  const validDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v+'T00:00:00Z')) && new Date(v+'T00:00:00Z').toISOString().slice(0,10) === v;
  const validTrip = v => isObject(v) && v.from === 'sentral-kj' && v.to === 'klcc' && v.time === '10:00' && validDate(v.date) && ['fastest','changes','walking'].includes(v.pref);
  const exportValue = value => {
    if (!isObject(value) || !['wallpaper','tool','book'].includes(value.kind) || !Number.isInteger(value.bytes) || value.bytes < 1 || value.bytes > 200000000) return null;
    if (value.kind === 'book') return typeof value.id === 'string' && /^[a-z0-9-]{1,70}$/.test(value.id) && value.format === 'text/plain' ? {kind:'book',id:value.id,format:'text/plain',bytes:value.bytes} : null;
    if (!Number.isInteger(value.width) || value.width < 1 || value.width > 20000 || !Number.isInteger(value.height) || value.height < 1 || value.height > 20000) return null;
    if (value.kind === 'wallpaper') return typeof value.id === 'string' && /^[a-z0-9-]{1,70}$/.test(value.id) && value.format === 'image/jpeg' ? {kind:'wallpaper',id:value.id,width:value.width,height:value.height,format:value.format,bytes:value.bytes} : null;
    if (!['image/jpeg','image/png','image/webp'].includes(value.format) || typeof value.sample !== 'string' || !/^[a-z0-9-]{1,70}$/.test(value.sample) || !(value.quality === null || Number.isInteger(value.quality) && value.quality >= 1 && value.quality <= 100)) return null;
    return {kind:'tool',sample:value.sample,width:value.width,height:value.height,format:value.format,quality:value.quality,bytes:value.bytes};
  };
  const normalizeEvidence = (v, record) => {
    const e = emptyEvidence(record.taskId);
    if (!isObject(v) || v.targetId !== e.targetId) return e;
    const through=record.endedAt || record.updatedAt;
    e.capturedAt = finite(v.capturedAt) && v.capturedAt >= record.startedAt && v.capturedAt < record.deadline && v.capturedAt <= through ? v.capturedAt : 0;
    if(e.capturedAt) {
      e.saved = v.saved === true;
      e.found = v.found === true;
      e.servings = record.taskId === 'minute-recipe-lunch' && [1,2,4,6].includes(v.servings) ? v.servings : null;
      if (record.taskId === 'minute-travel-klcc' && validTrip(v.trip)) e.trip = {from:v.trip.from,to:v.trip.to,date:v.trip.date,time:v.trip.time,pref:v.trip.pref,changes:0};
    }
    if (Array.isArray(v.exports)) e.exports = v.exports.slice(-12).map(x => {
      const out = exportValue(x);
      return out && time(x.at) && x.at >= record.startedAt && x.at < record.deadline && x.at <= through ? {...out,at:x.at} : null;
    }).filter(Boolean);
    return e;
  };
  const normalize = (v, requestedId) => {
    if (!isObject(v) || v.version !== 1 || !idOK(v.id) || v.id !== requestedId || !seedOK(v.seed) || !Object.hasOwn(RULES,v.taskId) || !['clean','ads'].includes(v.mode) || !['en','zh'].includes(v.lang) || !['armed','running','ended','void'].includes(v.status) || !time(v.createdAt) || !time(v.updatedAt) || v.updatedAt < v.createdAt || !['complete','partial','incomplete','unreviewed'].includes(v.judgement)) return null;
    const latest=Date.now()+1000;
    if(v.createdAt>latest||v.updatedAt>latest||v.startedAt>latest||v.endedAt>latest)return null;
    if (v.status === 'armed') {
      if (v.startedAt !== 0 || v.deadline !== 0 || v.endedAt !== 0 || v.reason !== null) return null;
    } else {
      if (!time(v.startedAt) || v.startedAt < v.createdAt || v.deadline !== v.startedAt + DURATION) return null;
      if (v.status === 'running' && (v.endedAt !== 0 || v.reason !== null)) return null;
      if (v.status === 'ended' && (!time(v.endedAt) || v.endedAt < v.startedAt || v.endedAt > v.deadline || !['timeout','submitted'].includes(v.reason) || v.reason === 'timeout' && v.endedAt !== v.deadline)) return null;
      if (v.status === 'void' && (!time(v.endedAt) || v.endedAt < v.startedAt || v.endedAt > v.deadline || v.reason !== 'void')) return null;
    }
    const out = {version:1,id:v.id,taskId:v.taskId,seed:v.seed,mode:v.mode,lang:v.lang,status:v.status,createdAt:v.createdAt,updatedAt:v.updatedAt,startedAt:v.startedAt,deadline:v.deadline,endedAt:v.endedAt,reason:v.reason,judgement:v.judgement};
    out.evidence = v.status === 'armed' ? emptyEvidence(v.taskId) : normalizeEvidence(v.evidence,out);
    return out;
  };
  const readRecord = id => {
    if (!idOK(id)) return null;
    try { const text = sessionStorage.getItem(PREFIX+id); return text && text.length <= 16000 ? normalize(JSON.parse(text),id) : null; } catch { return null; }
  };
  const store = record => {
    try { sessionStorage.setItem(PREFIX+record.id,JSON.stringify(record)); return true; } catch { return false; }
  };
  const readIndex = () => {
    try { const raw = JSON.parse(sessionStorage.getItem(INDEX) || '[]'); return Array.isArray(raw) ? [...new Set(raw.filter(idOK))].slice(0,LIMIT) : []; } catch { return []; }
  };
  const finalize = (record, reason, now) => {
    const current = readRecord(record.id);
    if (!current || current.status !== 'running') return current;
    const expired = now >= current.deadline;
    current.status = reason === 'void' && !expired ? 'void' : 'ended';
    current.reason = expired ? 'timeout' : reason;
    current.endedAt = expired ? current.deadline : Math.max(current.startedAt,now);
    current.updatedAt = Math.max(current.updatedAt,now);
    return store(current) ? current : null;
  };
  const get = id => {
    let record = readRecord(id);
    if (record?.status === 'running' && Date.now() >= record.deadline) record = finalize(record,'timeout',Date.now());
    return record ? clone(record) : null;
  };
  const makeToken = prefix => { const n = new Uint8Array(12); crypto.getRandomValues(n); return prefix + Array.from(n,v => v.toString(16).padStart(2,'0')).join(''); };
  const create = (taskId, mode, lang) => {
    if (!Object.hasOwn(RULES,taskId) || !taskData(taskId) || !['clean','ads'].includes(mode) || !['en','zh'].includes(lang)) return null;
    let id,seed; try { id=makeToken('r_');seed=makeToken('m_'); } catch { return null; }
    const now = Date.now(), record = {version:1,id,taskId,seed,mode,lang,status:'armed',createdAt:now,updatedAt:now,startedAt:0,deadline:0,endedAt:0,reason:null,judgement:'unreviewed',evidence:emptyEvidence(taskId)};
    if (!store(record)) return null;
    const previous=readIndex(),next=[id,...previous].slice(0,LIMIT);
    try { sessionStorage.setItem(INDEX,JSON.stringify(next)); } catch { try { sessionStorage.removeItem(PREFIX+id); } catch {} return null; }
    for (const old of previous) if (!next.includes(old)) { try { sessionStorage.removeItem(PREFIX+old); } catch {} }
    return clone(record);
  };
  const list = () => readIndex().map(get).filter(Boolean).sort((a,b) => b.createdAt-a.createdAt);
  const judge = (id, value) => {
    if (!['complete','partial','incomplete','unreviewed'].includes(value)) return null;
    const record=get(id);
    if (!record || !['ended','void'].includes(record.status)) return null;
    record.judgement=value;record.updatedAt=Math.max(record.updatedAt,Date.now());
    return store(record) ? clone(record) : null;
  };
  const pageURL = (file, record, extra={}) => {
    const u=new URL(file,location.href);
    u.searchParams.set('lang',record?.lang || 'zh');u.searchParams.set('v',VERSION);
    if (record) {u.searchParams.set('round',record.id);u.searchParams.set('mode',record.mode);}
    for (const [k,v] of Object.entries(extra)) u.searchParams.set(k,String(v));
    return u.href;
  };
  const entryURL = r => r && Object.hasOwn(RULES,r.taskId) ? pageURL(RULES[r.taskId].file,r,{seed:r.seed}) : pageURL('booth.html',null);
  const resultURL = r => r && idOK(r.id) ? pageURL('booth.html',r,{view:'result'}) : pageURL('booth.html',null);
  const reviewURL = r => r && idOK(r.id) && seedOK(r.seed) ? pageURL('review.html',r,{seed:r.seed}) : pageURL('booth.html',null);
  const assess = input => {
    const record = input && idOK(input.id) ? normalize(input,input.id) : null;
    if (!record) return {checks:[],allMet:false};
    const e=record.evidence,checks=[], add=(en,zh,met,detail='')=>checks.push({label:[en,zh],met:Boolean(met),detail});
    const saved=(en,zh)=>add(en,zh,e.saved,e.saved?'✓':'—');
    switch (record.taskId) {
      case 'minute-wall-aurora': saved('Required photograph saved','符合题目的照片已收藏'); add('2560 × 1440 JPG download dispatched','2560 × 1440 JPG 已发起下载',e.exports.some(x=>x.kind==='wallpaper'&&x.id==='orbital-aurora'&&x.width===2560&&x.height===1440&&x.format==='image/jpeg'),e.exports.filter(x=>x.kind==='wallpaper').map(x=>`${x.width} × ${x.height} · JPG · ${x.bytes} B`).join('; ')); break;
      case 'minute-recipe-lunch': saved('Correct chickpea salad saved','正确的鹰嘴豆沙拉已收藏');add('Recipe set to four servings','食谱设为4人份',e.servings===4,e.servings===null?'—':`${e.servings} · ${e.servings*120} g chickpeas / 鹰嘴豆`);break;
      case 'minute-tool-webp': {const out=e.exports.filter(x=>x.kind==='tool'),target=out.some(x=>x.sample==='city');add('Chinatown after dark example exported','已导出“唐人街入夜”示例',target,target?'✓':'—');add('WebP, width 1280, quality 75% download dispatched','WebP、宽1280、质量75%已发起下载',out.some(x=>x.sample==='city'&&x.width===1280&&x.height===853&&x.format==='image/webp'&&x.quality===75),out.map(x=>`${x.width} × ${x.height} · ${x.format} · ${x.quality}% · ${x.bytes} B`).join('; '));break;}
      case 'minute-movie-steel':saved('Required film added to watchlist','符合题目的电影已加入想看片单');break;
      case 'minute-outing-museum':saved('Required route added to weekend plan','符合题目的路线已加入周末计划');break;
      case 'minute-book-alice':saved('Required book added to reading list','符合题目的书籍已加入阅读清单');add('Required opening excerpt TXT download dispatched','所需开篇片段TXT已发起下载',e.exports.some(x=>x.kind==='book'&&x.id==='alice'&&x.format==='text/plain'),e.exports.filter(x=>x.kind==='book').map(x=>`TXT · ${x.bytes} B`).join('; '));break;
      case 'minute-museum-wave':saved('Required artwork added to My exhibition','符合题目的作品已加入我的展览');break;
      case 'minute-nature-cardinal':saved('Required bird added to observation list','符合题目的鸟类已加入观察清单');break;
      case 'minute-travel-klcc':add('Saved KL Sentral (KJ) → KLCC at 10:00','已保存KL Sentral（KJ）→ KLCC、10:00的行程',e.saved&&validTrip(e.trip),e.trip?`${e.trip.from} → ${e.trip.to} · ${e.trip.date} ${e.trip.time}`:'—');add('Direct route: zero changes','直达路线：0次换乘',Boolean(e.trip)&&e.trip.changes===0,e.trip?'0':'—');break;
      case 'minute-market-starter':saved('Required listing saved','符合题目的刊登已收藏');break;
    }
    return {checks,allMet:checks.length>0&&checks.every(c=>c.met)};
  };

  // Query validation is available before the engine chooses a seed or enables ads.
  const context = (params, scene) => {
    const p=params instanceof URLSearchParams?params:new URLSearchParams(params || location.search),requested=p.has('round');
    if (!requested) return {requested:false,valid:false,round:null,task:null,reason:null};
    const record=get(p.get('round')),task=record&&taskData(record.taskId);
    if (!record || !task) return {requested:true,valid:false,round:null,task:null,reason:'missing'};
    if (scene && RULES[record.taskId].scene!==scene) return {requested:true,valid:false,round:record,task,reason:'scene'};
    return {requested:true,valid:true,round:record,task,reason:null};
  };
  let active=null,suspended=false,restoring=false,generation=0,frame=0,ticker=0,bar=null,dialog=null,observer=null,redirecting=false;
  const emit = (name,detail) => window.dispatchEvent(new CustomEvent(name,{detail}));
  const translate = (en,zh) => active?.lang === 'zh' ? zh : en;
  const stopUI = () => { clearInterval(ticker);ticker=0; if(dialog?.open)dialog.close(); };
  const leave = record => {
    if (redirecting) return;
    redirecting=true;stopUI();
    emit('browse:booth-end',{roundId:record?.id || active?.id,seed:record?.seed || active?.seed,reason:record?.reason || 'invalid',mode:record?.mode || active?.mode});
    location.replace(record ? resultURL(record) : pageURL('booth.html',null,{notice:'expired-context'}));
  };
  const current = () => active ? readRecord(active.id) : null;
  const end = reason => {
    if (!active || suspended || restoring) return null;
    const record=current();
    if (!record) {leave(null);return null;}
    if (record.status !== 'running') {leave(record);return record;}
    // An early submission first captures current authoritative scene state. Expiry
    // deliberately keeps the last pre-deadline evidence instead of reading late DOM.
    if (Date.now()<record.deadline) capture(active.C);
    const result=finalize(record,reason,Date.now());leave(result);return result;
  };
  const canAct = () => {
    if (!active) {
      const p=new URLSearchParams(location.search);
      if (!p.has('round') || !FILES.has(location.pathname.split('/').pop())) return true;
      const ctx=context(p,document.body?.dataset.scene);
      return ctx.valid && ctx.round.status==='armed';
    }
    if (suspended || restoring || redirecting) return false;
    const record=current();
    if (!record || record.seed!==active.seed || record.taskId!==active.taskId) {leave(null);return false;}
    if (record.status!=='running' || Date.now()>=record.deadline) {end('timeout');return false;}
    return true;
  };
  const capture = C => {
    if (!active || C!==active.C || suspended || restoring || redirecting) return false;
    const now=Date.now(),record=current();
    if (!record || record.status!=='running' || now>=record.deadline || record.seed!==C.seed || RULES[record.taskId].scene!==C.scene) return false;
    const rule=RULES[record.taskId],e={...record.evidence,exports:record.evidence.exports.slice()},read=(key,fallback)=>{
      try {return C.read(key,fallback);} catch {return fallback;}
    };
    if (rule.key) {
      const values=read(rule.key,[]);
      e.saved=Array.isArray(values)&&values.some(x=>rule.key==='nature-sightings'?isObject(x)&&x.id===rule.target:x===rule.target);
    }
    if (record.taskId==='minute-recipe-lunch') {const value=read('bp-recipe-servings-chickpea-salad',2);e.servings=[1,2,4,6].includes(value)?value:2;}
    if (record.taskId==='minute-travel-klcc') {
      const values=read('travel-trips',[]),trip=Array.isArray(values)?values.find(validTrip):null;
      e.saved=Boolean(trip);e.trip=trip?{from:trip.from,to:trip.to,date:trip.date,time:trip.time,pref:trip.pref,changes:0}:null;
    }
    const selected=C.params?.get('id');
    e.found=e.found||selected===rule.target||record.taskId==='minute-tool-webp'&&C.params?.get('sample')==='city';
    e.capturedAt=now;
    record.evidence=e;record.updatedAt=Math.max(record.updatedAt,now);
    return store(record);
  };
  const recordExport = detail => {
    if (!active || !canAct()) return false;
    const item=exportValue({...detail,kind:detail?.kind || 'tool'}),record=current(),now=Date.now();
    if (!item || !record || now>=record.deadline) {if(record&&now>=record.deadline)end('timeout');return false;}
    const allowed=record.taskId==='minute-wall-aurora'&&item.kind==='wallpaper'||record.taskId==='minute-book-alice'&&item.kind==='book'||record.taskId==='minute-tool-webp'&&item.kind==='tool';
    if (!allowed) return false;
    record.evidence.exports=[...record.evidence.exports,{...item,at:now}].slice(-12);
    record.evidence.found=record.evidence.found||(item.id || item.sample)===RULES[record.taskId].target;
    record.updatedAt=Math.max(record.updatedAt,now);
    return store(record);
  };
  const decorate = value => {
    let u;try {u=new URL(value,location.href);} catch {return value;}
    const here=new URL(location.href),ctx=active?{round:current()}:context(new URLSearchParams(location.search));
    const record=ctx.round;
    if (!record || u.origin!==here.origin || u.pathname.slice(0,u.pathname.lastIndexOf('/')+1)!==here.pathname.slice(0,here.pathname.lastIndexOf('/')+1) || !FILES.has(u.pathname.split('/').pop())) return u.href;
    u.searchParams.set('round',record.id);u.searchParams.set('mode',record.mode);u.searchParams.set('seed',record.seed);u.searchParams.set('v',VERSION);
    return u.href;
  };
  const modalActive = () => {
    if (!active) return false;
    return Boolean(active.C.root?.inert) || Array.from(document.querySelectorAll('dialog[open]')).some(d=>d!==dialog) || Array.from(document.querySelectorAll('[aria-modal="true"]')).some(d=>d!==dialog&&!d.hidden&&!d.closest('[hidden]')&&d.getClientRects().length);
  };
  const syncControls = () => {
    if(!bar)return;
    const actions=bar.querySelector('.br-booth-actions'),blocked=suspended||restoring||modalActive();
    // The observer also sees this reflected attribute; avoid a self-triggered loop.
    if(actions.inert!==blocked)actions.inert=blocked;
  };
  const mount = record => {
    if (bar) return;
    const task=taskData(record.taskId),text=v=>Array.isArray(v)?v[record.lang==='zh'?1:0]:v;
    bar=document.createElement('aside');bar.id='br-booth-bar';bar.setAttribute('aria-label',translate('60-second challenge','60秒挑战'));
    bar.innerHTML=`<div class="br-booth-time"><small>${translate('TIME LEFT','剩余时间')}</small><strong data-booth-clock role="timer" aria-live="off">1:00</strong></div><div class="br-booth-current"><span>${record.mode==='clean'?translate('CLEAN ROUND','无广告挑战'):translate('AD CHALLENGE','广告挑战')}</span><b>${escape(text(task.title))}</b></div><div class="br-booth-actions"><button type="button" data-booth-task>${translate('View task','查看任务')}</button><button type="button" data-booth-submit>${translate('Submit','我完成了')}</button><button type="button" data-booth-void aria-label="${translate('Staff: void this round','工作人员：作废本轮')}">${translate('Staff','工作人员')}</button></div>`;
    dialog=document.createElement('dialog');dialog.id='br-booth-task-dialog';dialog.setAttribute('aria-labelledby','br-booth-dialog-title');
    const goals=task.goals || [];
    dialog.innerHTML=`<div class="br-booth-dialog-inner"><div class="br-booth-dialog-kicker">${translate('YOUR 60-SECOND TASK','你的60秒任务')}</div><h1 id="br-booth-dialog-title">${escape(text(task.title))}</h1><p>${escape(text(task.brief))}</p><ul>${goals.map(x=>`<li>${escape(text(x))}</li>`).join('')}</ul><p class="br-booth-dialog-rule">${translate('The clock continues while this task or another tab is open. Submission is checked by a staff member.','查看题目或打开其他标签页时，计时继续。交卷后由工作人员核对结果。')}</p><button type="button" data-booth-dialog-close>${translate('Continue challenge','继续挑战')}</button></div>`;
    document.body.append(bar,dialog);document.documentElement.classList.add('br-booth-running');document.documentElement.style.setProperty('--br-booth-offset','56px');
    bar.querySelector('[data-booth-task]').addEventListener('click',()=>{if(!canAct()||modalActive())return;emit('browse:booth-dialog',{open:true});dialog.showModal();});
    bar.querySelector('[data-booth-submit]').addEventListener('click',()=>{if(!modalActive()&&canAct())end('submitted');});
    bar.querySelector('[data-booth-void]').addEventListener('click',()=>{
      if(!canAct()||modalActive())return;
      // Staff confirmation lives inside the same native dialog; countdown never pauses.
      const node=dialog.querySelector('.br-booth-void-confirm');
      if(node)node.remove();
      const box=document.createElement('section');box.className='br-booth-void-confirm';box.innerHTML=`<h2>${translate('Staff: void this round','工作人员：作废本轮')}</h2><p>${translate('Use for loading or equipment problems. This round will not count as a failure.','用于加载或设备问题。作废不会记为任务失败。')}</p><button type="button" data-booth-confirm-void>${translate('Confirm void','确认作废')}</button>`;
      dialog.querySelector('.br-booth-dialog-inner').append(box);box.querySelector('button').addEventListener('click',()=>{if(canAct())end('void');});emit('browse:booth-dialog',{open:true});dialog.showModal();box.querySelector('button').focus();
    });
    dialog.querySelector('[data-booth-dialog-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{dialog.querySelector('.br-booth-void-confirm')?.remove();emit('browse:booth-dialog',{open:false});syncControls();});
    // The native dialog owns its focus rules. Ads retain their existing focus trap.
    observer=new MutationObserver(syncControls);observer.observe(document.body,{attributes:true,attributeFilter:['inert','open','hidden','aria-modal'],childList:true,subtree:true});
    syncControls();
  };
  const tick = () => {
    if (!active || suspended || restoring || redirecting) return;
    const record=current();
    if (!record || record.status!=='running') {leave(record);return;}
    const left=record.deadline-Date.now();
    if (left<=0) {end('timeout');return;}
    const seconds=Math.ceil(left/1000),clock=bar?.querySelector('[data-booth-clock]');
    if(clock)clock.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
    if(bar)bar.dataset.urgent=String(seconds<=10);
    syncControls();
  };
  const start = C => {
    const ctx=context(C.params,C.scene);
    if (!ctx.requested) return null;
    if (!ctx.valid) {location.replace(ctx.round&&ctx.reason==='scene'?entryURL(ctx.round):pageURL('booth.html',null,{notice:'expired-context'}));return null;}
    let record=ctx.round;
    if (C.seed!==record.seed || RULES[record.taskId].scene!==C.scene) {location.replace(entryURL(record));return null;}
    if (active) return active.id===record.id?get(record.id):null;
    active={id:record.id,seed:record.seed,taskId:record.taskId,lang:record.lang,C};
    if (record.status!=='armed'&&record.status!=='running') {leave(record);return null;}
    if (record.status==='armed') {
      const now=Date.now();record={...record,status:'running',startedAt:now,deadline:now+DURATION,updatedAt:now};
      if(!store(record)){leave(null);return null;}
    }
    suspended=false;restoring=false;mount(record);capture(C);tick();
    ticker=setInterval(tick,100);
    return get(record.id);
  };
  const hide = () => {
    if (!active) return;
    if (!suspended&&!restoring&&!redirecting) {
      if(canAct())capture(active.C);
    }
    suspended=true;restoring=false;generation++;cancelAnimationFrame(frame);frame=0;
    if(dialog?.open)dialog.close();syncControls();
  };
  const show = event => {
    if(!active||!event.persisted)return;
    suspended=true;restoring=true;const own=++generation;cancelAnimationFrame(frame);
    if(bar)bar.dataset.restoring='true';syncControls();
    // Chrome may deliver the departed renderer's storage write after pageshow.
    // No writer or action is allowed until two frames have reconciled that state.
    frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
      frame=0;if(own!==generation)return;
      const fresh=current();restoring=false;suspended=false;
      if(bar)delete bar.dataset.restoring;
      if(!fresh||fresh.status!=='running'||Date.now()>=fresh.deadline){end('timeout');return;}
      capture(active.C);tick();syncControls();
    });});
  };
  window.addEventListener('pagehide',hide);
  window.addEventListener('pageshow',show);
  window.addEventListener('focus',tick);
  document.addEventListener('visibilitychange',tick);
  window.addEventListener('browse:image-export',event=>recordExport(event.detail));
  // Catch an input dispatched just after the deadline before scene handlers run.
  for (const name of ['click','submit','input','change','drop','paste']) document.addEventListener(name,event=>{
    if(!active||bar?.contains(event.target)||dialog?.contains(event.target))return;
    if(!canAct()){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  window.BROWSE_BOOTH={create,get,list,judge,assess,entryURL,resultURL,reviewURL,context,start,capture,canAct,recordExport,decorate};
})();
