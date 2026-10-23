/* Browse: native documents, local state and gesture-opened advertiser tabs. */
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const lang = params.get('lang') === 'zh' ? 'zh' : 'en';
  const t = (en, zh) => lang === 'zh' ? zh : en;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const randomSeed = () => { const n = new Uint32Array(1); crypto.getRandomValues(n); return n[0].toString(36); };
  let seed = (params.get('seed') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
  if (!seed) {
    seed = randomSeed();
    const canonical = new URL(location.href); canonical.searchParams.set('seed',seed);
    history.replaceState(null,'',canonical.href);
    params.set('seed',seed);
  }
  const url = (file, query = {}) => {
    const u = new URL(file, location.href);
    u.searchParams.set('lang', lang); u.searchParams.set('seed', seed); u.searchParams.set('v', 'browse1');
    Object.entries(query).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') u.searchParams.set(k, String(v)); });
    return u.href;
  };
  const memory = {};
  const rawRead = (key, fallback) => { try { const raw = sessionStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch { return key in memory ? memory[key] : fallback; } };
  const rawWrite = (key, value) => { memory[key] = value; try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const read = (key, fallback) => rawRead('br-data-v1:' + seed + ':' + key, fallback);
  const write = (key, value) => rawWrite('br-data-v1:' + seed + ':' + key, value);
  const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const rng = salt => { let a = hash(seed + salt); return () => { a += 0x6D2B79F5; let n = a; n = Math.imul(n ^ n >>> 15, n | 1); n ^= n + Math.imul(n ^ n >>> 7, n | 61); return ((n ^ n >>> 14) >>> 0) / 4294967296; }; };
  const shuffle = (arr, salt) => { const out = [...arr], r = rng(salt); for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } return out; };
  const scenes = [
    ['wallpapers', 'wallpaper.html', 'Stillwall', t('Find a wallpaper for your desktop.', '选一张喜欢的桌面壁纸。'), 'wall'],
    ['recipes', 'recipe.html', 'Pantry & Plate', t('Find something good to cook tonight.', '找一道今晚想做的菜。'), 'food'],
    ['tools', 'tools.html', 'Pixelpress', t('Make an image smaller, without losing the feeling.', '把图片压小，保留喜欢的质感。'), 'tool'],
    ['movies', 'movie.html', 'Frame / by frame', t('Find your next movie-night watch.', '挑一部周末想看的电影。'), 'film'],
    ['events', 'events.html', 'Out There KL', t('Put together a weekend around town.', '安排一个周末出游计划。'), 'event']
  ];
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  const root = document.getElementById('site-root');
  const C = {root, params, lang, t, esc, url, read, write, complete(label) { write('last-completed', {label: String(label).slice(0,120), at: Date.now()}); }};
  const page = document.body.dataset.page;
  const taskKey = 'br-run-v1:' + seed;
  const validSites = ['corn','desk','stock','game','security','player','software','prize','coupon','parcel'];
  const sceneForSeed = scenes[Math.floor(rng('scene')() * scenes.length)];
  if (page === 'random') {
    location.replace(url(sceneForSeed[1]));
    return;
  }
  if (page === 'launch') {
    document.title = t('Browse — five ordinary afternoons', 'Browse · 五种日常浏览');
    root.innerHTML = `<main class="br-launch"><header class="br-launch-head"><a class="br-wordmark" href="${url('launch.html')}">browse<span> / field notes</span></a><a href="${url('launch.html',{lang:lang==='zh'?'en':'zh'})}">${lang==='zh'?'English':'中文'}</a></header><div class="br-launch-intro"><p class="br-kicker">FIVE ORDINARY AFTERNOONS</p><h1>${t('A little browsing.<br>A few unexpected turns.','从日常浏览，<br>走进意料之外。')}</h1><p>${t('Pick a small task. Browse at your own pace. The web has other plans.','选一个小任务，按自己的节奏浏览。互联网可能另有安排。')}</p><a class="br-start" href="${url('index.html',{seed:randomSeed()})}">${t('Start somewhere random','随机开始一次')} <span>↗</span></a></div><div class="br-scene-grid">${scenes.map((s,i)=>`<a class="br-scene-card br-scene-${s[4]}" href="${url(s[1],{seed:randomSeed()})}"><div class="br-scene-art"><span>0${i+1}</span><b>${['◒','✳','▧','▶','↗'][i]}</b></div><div><small>${['DESKTOPS','GOOD FOOD','IMAGE TOOLS','MOVIE NIGHT','THE WEEKEND'][i]}</small><h2>${s[2]}</h2><p>${s[3]}</p><span class="br-card-arrow">↗</span></div></a>`).join('')}</div><footer class="br-launch-foot"><p>${t('A fictional browsing experience. Your files and progress stay in this browser.','虚构浏览体验。文件和进度保留在此浏览器。')}</p><a href="${url('guide.html')}">${t('Facilitator notes & references','主持人说明与参考来源')} ↗</a></footer></main>`;
    return;
  }
  if (document.body.dataset.destination) { window.BROWSE_DESTINATIONS?.(C); return; }
  const scene = document.body.dataset.scene;
  const renderer = window.BROWSE_SCENES?.[scene];
  if (!renderer) { root.innerHTML = `<main class="br-guide"><h1>${t('This page could not be loaded.','此页面未能加载。')}</h1><a href="${url('launch.html')}">${t('Choose a website','选择网站')}</a></main>`; return; }
  renderer(C);
  // A seed is carried through native GET forms as well as anchors.
  for (const form of root.querySelectorAll('form')) {
    if ((form.method || 'get').toLowerCase() !== 'get') continue;
    for (const [name,value] of [['lang',lang],['seed',seed],['v','browse1']]) {
      if (form.querySelector(`[name="${name}"]`)) continue;
      const input = document.createElement('input'); input.type='hidden'; input.name=name; input.value=value; form.append(input);
    }
  }
  const old = rawRead(taskKey, {});
  const obj = old && typeof old === 'object' && !Array.isArray(old) ? old : {};
  const state = {
    activeMs: Number.isFinite(obj.activeMs) ? Math.max(0, Math.min(obj.activeMs, 14400000)) : 0,
    shown: Number.isInteger(obj.shown) ? Math.max(0, Math.min(obj.shown,4)) : 0,
    closedAt: Number.isFinite(obj.closedAt) ? Math.max(0,obj.closedAt) : 0,
    pending: obj.pending && typeof obj.pending==='object' && validSites.includes(obj.pending.site) && ['drawer','panel','tiny','newsletter'].includes(obj.pending.format) ? obj.pending : null
  };
  state.closedAt = Math.min(state.closedAt,state.activeMs);
  const save = () => rawWrite(taskKey, state);
  const deck = shuffle(validSites, 'destinations');
  const formats = shuffle(['drawer','panel','tiny','newsletter'], 'formats');
  const chosen = validSites.includes(params.get('ad')) ? params.get('ad') : null;
  const ads = {
    corn:['Cornhub',t('Your evening, on autoplay.','让今晚，自动播放。'),t('Explore channels','探索频道'),'After hours · Featured channel'],
    desk:['Form & Field',t('A calmer corner to work.','给工作，留一个安静角落。'),t('Shop the collection','浏览系列'),'Home & office'],
    stock:['Framekind',t('The right image changes everything.','好图片，让灵感发生。'),t('Browse the library','浏览图片库'),'Images for your next idea'],
    game:['Tiny Arcade',t('Just one more level.','再玩一关。'),t('Play free','免费试玩'),'Something for your break'],
    security:['SecureLane',t('Unusual activity detected','检测到异常活动'),t('Review device status','查看设备状态'),'Security notice'],
    player:['Orbit Player',t('A player update is required','需要更新播放器'),t('Update player','更新播放器'),'Playback support'],
    software:['AppHarbor',t('Your download is ready','下载已就绪'),t('Download now','立即下载'),'Fast file tools'],
    prize:['Lucky Circle',t('You have been selected','你已被选中'),t('Claim your reward','领取奖励'),'Visitor reward'],
    coupon:['Perk Basket',t('A little thank-you: a RM500 voucher','一份心意：RM500 礼券'),t('Take a short survey','参与简短问卷'),'Members offer'],
    parcel:['NorthPost',t('Delivery details need a quick update','派送信息需要更新'),t('View delivery','查看派送'),'Delivery notification']
  };
  const adURL = site => url('destination.html', {site, from:scene});
  const wireAds = node => { for (const a of node.querySelectorAll('[data-br-ad]')) { const id = validSites.includes(a.dataset.brAd) ? a.dataset.brAd : deck[0]; a.href=adURL(id); a.target='_blank'; a.rel='noopener'; } };
  wireAds(root);
  if (!root.querySelector('[data-br-ad]')) {
    const strip=document.createElement('aside'); strip.className='br-inline-ad'; strip.setAttribute('aria-label',t('Advertisement','广告'));
    const id=shuffle(['desk','stock','game'],'inline')[0], a=ads[id];
    strip.innerHTML=`<small>${t('ADVERTISEMENT','广告')}</small><div><span class="br-ad-glyph">${id==='desk'?'◒':id==='stock'?'▧':'✳'}</span><p><b>${a[0]}</b><br>${a[1]}</p><a data-br-ad="${id}">${a[2]} ↗</a></div>`; root.append(strip); wireAds(strip);
  }
  const overlayRoot=document.getElementById('interrupt-root') || document.body.appendChild(Object.assign(document.createElement('div'),{id:'interrupt-root'}));
  let previousFocus=null;
  const close = () => {
    state.pending=null; state.closedAt=state.activeMs; save(); overlayRoot.replaceChildren();
    root.inert=false;
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true}); previousFocus=null;
  };
  const renderAd = () => {
    const p=state.pending; if (!p) return;
    const a=ads[p.site], modal=p.format==='panel'||p.format==='newsletter';
    previousFocus=document.activeElement;
    root.inert=modal;
    overlayRoot.innerHTML=`<div class="br-interrupt ${modal?'br-ad-backdrop':''}" ${modal?'role="presentation"':''}><section class="br-ad br-ad-${esc(p.format)} br-ad-${esc(p.site)}" ${modal?'role="dialog" aria-modal="true"':'role="region"'} aria-label="${esc(t('Sponsored message','赞助信息'))}" tabindex="-1"><div class="br-ad-top"><span>${t('Sponsored','赞助内容')} · ${esc(a[0])}</span>${p.format==='panel'?`<a class="br-false-close" data-br-ad="${p.site}" aria-label="${t('Close promotion','关闭推广')}">×</a>`:''}<button class="br-real-close" type="button" data-br-close aria-label="${t('Dismiss advertisement','关闭广告')}">×</button></div><div class="br-ad-body"><span class="br-ad-eyebrow">${a[3]}</span><div class="br-ad-mark">${['security','player','parcel'].includes(p.site)?'!':p.site==='corn'?'▶':p.site==='prize'?'✦':'◒'}</div><h2>${a[1]}</h2><p>${p.site==='security'?t('Run a quick check to review recent warnings on this device.','快速检查此设备最近的提示。'):p.site==='parcel'?t('There is an outstanding delivery update for your address.','你的收件地址有一条待处理的派送更新。'):p.site==='player'?t('Continue watching in the latest supported player.','更新至支持的播放器后继续观看。'):t('A new find, selected for your day. See what is waiting.','为你的一天，带来一个新发现。')}</p><a class="br-ad-cta" data-br-ad="${p.site}">${a[2]} ↗</a>${p.format==='newsletter'?`<button class="br-ad-decline" data-br-close>${t('Maybe another time','下次再说')}</button>`:''}</div><div class="br-ad-bottom">${p.format==='tiny'?`<button data-br-close class="br-small-dismiss">${t('close ad','关闭广告')}</button>`:t('Advertisement','广告')}</div><p class="br-blocked" hidden>${t('This link opens in another tab.','链接将在另一个标签页打开。')} <a data-br-fallback target="_blank" rel="noopener" href="${adURL(p.site)}">${t('Open page','打开页面')} ↗</a></p></section></div>`;
    wireAds(overlayRoot);
    overlayRoot.querySelectorAll('[data-br-close]').forEach(b=>b.addEventListener('click',close));
    overlayRoot.querySelectorAll('[data-br-ad]').forEach(link=>link.addEventListener('click',e=>{
      if (e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey) return;
      e.preventDefault();
      const child=window.open(link.href,'_blank');
      if (child) { try { child.opener=null; } catch {} close(); }
      else overlayRoot.querySelector('.br-blocked').hidden=false;
    }));
    if (modal) overlayRoot.querySelector('.br-real-close').focus({preventScroll:true});
  };
  overlayRoot.addEventListener('keydown',e=>{
    const dialog=overlayRoot.querySelector('[aria-modal="true"]'); if (!dialog||e.key!=='Tab') return;
    const focusable=[...dialog.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length);
    if (!focusable.length) return;
    const first=focusable[0], last=focusable.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&state.pending){e.preventDefault();close();}
  });
  let last=performance.now();
  const tick=()=>{
    const now=performance.now(), delta=Math.max(0,Math.min(now-last,1100)); last=now;
    if(document.hidden||!document.hasFocus()) return;
    state.activeMs+=delta;
    if (!state.pending && state.shown<4 && state.activeMs >= [20000,45000,75000,110000][state.shown] && state.activeMs-state.closedAt>=12000) {
      state.pending={site:chosen||deck[state.shown],format:formats[state.shown]}; state.shown++; save(); renderAd();
    }
  };
  setInterval(tick,500); setInterval(save,2000);
  document.addEventListener('visibilitychange',()=>{last=performance.now();save();});
  window.addEventListener('blur',()=>{last=performance.now();save();});
  window.addEventListener('focus',()=>{last=performance.now();});
  window.addEventListener('pagehide',save);
  window.addEventListener('pageshow',event=>{
    last=performance.now();
    if (!event.persisted) return;
    const current=rawRead(taskKey,null);
    if(current && typeof current==='object' && !Array.isArray(current)) {
      if(Number.isFinite(current.activeMs)) state.activeMs=Math.max(state.activeMs,Math.min(14400000,current.activeMs));
      if(Number.isInteger(current.shown)) state.shown=Math.max(state.shown,Math.min(4,current.shown));
      state.closedAt=Number.isFinite(current.closedAt)?Math.max(0,Math.min(state.activeMs,current.closedAt)):0;
      state.pending=current.pending&&validSites.includes(current.pending.site)&&['drawer','panel','tiny','newsletter'].includes(current.pending.format)?current.pending:null;
      overlayRoot.replaceChildren();root.inert=false;
      if(state.pending) renderAd();
    }
  });
  if(state.pending) renderAd();
  save();
})();
