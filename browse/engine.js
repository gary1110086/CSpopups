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
    u.searchParams.set('lang', lang); u.searchParams.set('seed', seed); u.searchParams.set('v', 'browse2a');
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
    ['tools', 'tools.html', 'Pixelpress', t('Compress an image and download the result.', '压缩一张图片并下载。'), 'tool'],
    ['movies', 'movie.html', 'Frame Movies', t('Find your next movie-night watch.', '挑一部周末想看的电影。'), 'film'],
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
    document.title = t('Browse — choose a website', 'Browse · 选择网站');
    root.innerHTML = `<main class="br-launch"><header class="br-launch-head"><a class="br-wordmark" href="${url('launch.html')}">Browse<span> / website selection</span></a><a href="${url('launch.html',{lang:lang==='zh'?'en':'zh'})}">${lang==='zh'?'English':'中文'}</a></header><div class="br-launch-intro"><div><h1>${t('Choose a website','选择一个网站')}</h1><p>${t('Open a website below and complete its task. Or start with a randomly selected website.','打开下方网站并完成一个小任务，也可以随机开始。')}</p></div><a class="br-start" href="${url('index.html',{seed:randomSeed()})}">${t('Random website','随机开始')} →</a></div><div class="br-scene-grid">${scenes.map((s,i)=>`<a class="br-scene-card br-scene-${s[4]}" href="${url(s[1],{seed:randomSeed()})}"><div class="br-scene-art" aria-hidden="true"></div><div><small>${[t('WALLPAPERS','桌面壁纸'),t('RECIPES','家常食谱'),t('IMAGE TOOLS','图片处理'),t('MOVIES','电影发现'),t('WEEKEND GUIDES','周末指南')][i]}</small><h2>${s[2]}</h2><p>${s[3]}</p><span class="br-card-arrow">${t('Open website','打开网站')} →</span></div></a>`).join('')}</div><footer class="br-launch-foot"><p>${t('A fictional browsing experience. Your files and progress stay in this browser.','虚构浏览体验。文件和进度保留在此浏览器。')}</p><a href="${url('guide.html')}">${t('Facilitator notes & references','主持人说明与参考来源')} ↗</a></footer></main>`;
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
    for (const [name,value] of [['lang',lang],['seed',seed],['v','browse2a']]) {
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
    corn:['Cornhub',t('Popular videos this week','本周热门视频'),t('Watch now','立即观看'),'Featured channel'],
    desk:['Form & Field',t('Upgrade your desk. From RM39.','桌面配件，RM39 起。'),t('Shop now','立即选购'),'Desk accessories'],
    stock:['Framekind',t('Find stock images for your next project','为下一个项目挑选图库素材'),t('Browse images','浏览图片'),'Photos & creative assets'],
    game:['Tiny Arcade',t('Quick games. No installation.','即开即玩，无需安装。'),t('Play free','免费试玩'),'Free browser games'],
    security:['SecureLane',t('Unusual activity detected','检测到异常活动'),t('Review device status','查看设备状态'),'Security notice'],
    player:['Orbit Player',t('A player update is required','需要更新播放器'),t('Update player','更新播放器'),'Playback support'],
    software:['AppHarbor',t('Your download is ready','下载已就绪'),t('Download now','立即下载'),'Fast file tools'],
    prize:['Lucky Circle',t('You have been selected','你已被选中'),t('Claim your reward','领取奖励'),'Visitor reward'],
    coupon:['Perk Basket',t('Unlock a RM100 shopping voucher','领取 RM100 购物券'),t('Take a short survey','参与简短问卷'),'Members offer'],
    parcel:['NorthPost',t('Delivery details need a quick update','派送信息需要更新'),t('View delivery','查看派送'),'Delivery notification']
  };
  const adDescription = site => ({corn:t('Browse new releases, channels and member picks.','浏览新片、频道及会员推荐。'),desk:t('Desk lamps, organizers and mats. Browse the new workspace range.','台灯、收纳与桌垫，查看最新办公桌系列。'),stock:t('Search photos, illustrations and image collections.','搜索照片、插画及素材合集。'),game:t('Try a quick round of Signal Garden in your browser.','直接在浏览器试玩 Signal Garden。'),security:t('Review recent device warnings and protection status.','查看设备近期提示及防护状态。'),player:t('Install the latest player package to continue playback.','安装新版播放器程序包以继续播放。'),software:t('Your file utility package is available. Choose a download.','文件工具程序包已就绪，请选择下载。'),prize:t('Your visitor reward is waiting. Check your eligibility.','访客奖励待领取，立即查看资格。'),coupon:t('Complete the member survey to view this offer.','填写会员问卷，查看优惠领取方式。'),parcel:t('Action required: confirm the delivery details for your parcel.','需要处理：请确认包裹派送资料。')}[site]);
  const adVisual = site => `<div class="br-ad-visual br-visual-${site}" aria-hidden="true">${({corn:'<span>Corn<b>hub</b></span><i>▶</i>',desk:'<span>FROM <b>RM39</b></span>',stock:'<span>Framekind<br><b>STOCK IMAGES</b></span>',game:'<span>SIGNAL<br>GARDEN</span><i>▦</i>',security:'<span>!</span>',player:'<span>▶</span>',software:'<span>ZIP</span>',prize:'<span>REWARD<br><b>RM800</b></span>',coupon:'<span>RM<b>500</b><small>SHOPPING VOUCHER</small></span>',parcel:'<span>NorthPost<br><b>DELIVERY UPDATE</b></span>'})[site]}</div>`;
  const adURL = site => url('destination.html', {site, from:scene});
  const wireAds = node => { for (const a of node.querySelectorAll('[data-br-ad]')) { const id = validSites.includes(a.dataset.brAd) ? a.dataset.brAd : deck[0]; a.href=adURL(id); a.target='_blank'; a.rel='noopener'; } };
  wireAds(root);
  if (!root.querySelector('[data-br-ad]')) {
    const strip=document.createElement('aside'); strip.className='br-inline-ad'; strip.setAttribute('aria-label',t('Advertisement','广告'));
    const id=shuffle(['desk','stock','game'],'inline')[0], a=ads[id];
    strip.innerHTML=`<small>${t('ADVERTISEMENT','广告')}</small><div>${adVisual(id)}<p><b>${a[0]}</b><br>${a[1]}</p><a data-br-ad="${id}">${a[2]} →</a></div>`; const main=root.querySelector('main');if(main)main.append(strip);else root.append(strip);wireAds(strip);
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
    overlayRoot.innerHTML=`<div class="br-interrupt ${modal?'br-ad-backdrop':''}" ${modal?'role="presentation"':''}><section class="br-ad br-ad-${esc(p.format)} br-ad-${esc(p.site)}" ${modal?'role="dialog" aria-modal="true"':'role="region"'} aria-label="${esc(t('Sponsored message','赞助信息'))}" tabindex="-1"><div class="br-ad-top"><span>${t('Sponsored','赞助内容')} · ${esc(a[0])}</span>${p.format==='panel'?`<a class="br-false-close" data-br-ad="${p.site}" aria-label="${t('Close promotion','关闭推广')}">×</a>`:''}<button class="br-real-close" type="button" data-br-close aria-label="${t('Dismiss advertisement','关闭广告')}">×</button></div>${adVisual(p.site)}<div class="br-ad-body"><span class="br-ad-eyebrow">${a[3]}</span><h2>${a[1]}</h2><p>${adDescription(p.site)}</p><a class="br-ad-cta" data-br-ad="${p.site}">${a[2]} →</a>${p.format==='newsletter'?`<button class="br-ad-decline" data-br-close>${t('Maybe another time','下次再说')}</button>`:''}</div><div class="br-ad-bottom">${p.format==='tiny'?`<button data-br-close class="br-small-dismiss">${t('close ad','关闭广告')}</button>`:t('Advertisement','广告')}</div><p class="br-blocked" hidden>${t('This link opens in another tab.','链接将在另一个标签页打开。')} <a data-br-fallback target="_blank" rel="noopener" href="${adURL(p.site)}">${t('Open page','打开页面')} ↗</a></p></section></div>`;
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
