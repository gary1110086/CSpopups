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
    u.searchParams.set('lang', lang); u.searchParams.set('seed', seed); u.searchParams.set('v', 'rescue2');
    if(params.has('task')&&['index.html',...(window.BROWSE_SCENE_INDEX||[]).map(s=>s.file)].includes(u.pathname.split('/').pop()))u.searchParams.set('task',params.get('task'));
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
  const scenes = (window.BROWSE_SCENE_INDEX||[]).map(s=>[s.id,s.file,s.name,s.brief[lang==='zh'?1:0],s.art,s.kicker[lang==='zh'?1:0],s.cover]);
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  const root = document.getElementById('site-root');
  const C = {root, params, lang, t, esc, url, read, write, complete(label) { write('last-completed', {label: String(label).slice(0,120), at: Date.now()}); window.dispatchEvent(new CustomEvent('browse:complete',{detail:String(label).slice(0,160)})); }};
  const page = document.body.dataset.page;
  const validSites = ['corn','desk','stock','game','security','player','software','prize','coupon','parcel'];
  if(params.get('task')==='random'&&window.BROWSE_TASKS?.length){const chosenTask=window.BROWSE_TASKS[Math.floor(rng('brief')()*window.BROWSE_TASKS.length)];params.set('task',chosenTask.id);}
  const brief=window.BROWSE_TASKS?.find(x=>x.id===params.get('task'));
  const sceneForSeed = brief?scenes.find(x=>x[0]===brief.scene):scenes[Math.floor(rng('scene')() * scenes.length)];
  if(page==='tasks'){window.BROWSE_TASK_UI?.renderLibrary(C);return;}
  if (page === 'random') {
    location.replace(url(sceneForSeed[1]));
    return;
  }
  if (page === 'launch') {
    document.title = t('Browse — choose a website', 'Browse · 选择网站');
    root.innerHTML = `<main class="br-launch"><header class="br-launch-head"><a class="br-wordmark" href="${url('launch.html')}">Browse<span> / website selection</span></a><a href="${url('launch.html',{lang:lang==='zh'?'en':'zh'})}">${lang==='zh'?'English':'中文'}</a></header><div class="br-launch-intro"><div><h1>${t('Choose a website','选择一个网站')}</h1><p>${t('Open a website below and complete its task. Or start with a randomly selected website.','打开下方网站并完成一个小任务，也可以随机开始。')}</p></div><a class="br-start" href="${url('index.html',{seed:randomSeed()})}">${t('Random website','随机开始')} →</a></div><p class="br-task-entry"><a href="${url('tasks.html')}">${t('Choose a specific search task','选择具体检索任务')} →</a> · <a href="${url('index.html',{task:'random',seed:randomSeed()})}">${t('Random task','随机任务')}</a></p><div class="br-scene-grid">${scenes.map((s,i)=>`<a class="br-scene-card br-scene-${s[4]}" href="${url(s[1],{seed:randomSeed()})}"><div class="br-scene-art" style="${s[6]?'background-image:url('+esc(s[6])+');background-size:cover;background-position:center;':''}" aria-hidden="true"></div><div><small>${s[5]}</small><h2>${s[2]}</h2><p>${s[3]}</p><span class="br-card-arrow">${t('Open website','打开网站')} →</span></div></a>`).join('')}</div><footer class="br-launch-foot"><p>${t('A fictional browsing experience. Your files and progress stay in this browser.','虚构浏览体验。文件和进度保留在此浏览器。')}</p><a href="${url('guide.html')}">${t('Facilitator notes & references','主持人说明与参考来源')} ↗</a></footer></main>`;
    return;
  }
  if (document.body.dataset.destination) { window.BROWSE_DESTINATIONS?.(C); return; }
  const scene = document.body.dataset.scene;
  const renderer = window.BROWSE_SCENES?.[scene];
  if (!renderer) { root.innerHTML = `<main class="br-guide"><h1>${t('This page could not be loaded.','此页面未能加载。')}</h1><a href="${url('launch.html')}">${t('Choose a website','选择网站')}</a></main>`; return; }
  renderer(C);
  // Keep briefs in the task library; website pages currently open without the task/notes panel.
  // A seed is carried through native GET forms as well as anchors.
  for (const form of root.querySelectorAll('form')) {
    if ((form.getAttribute('method') || 'get').toLowerCase() !== 'get') continue;
    for (const [name,value] of [['lang',lang],['seed',seed],['v','rescue2'],...(brief?[['task',brief.id]]:[])]) {
      if (form.querySelector(`[name="${name}"]`)) continue;
      const input = document.createElement('input'); input.type='hidden'; input.name=name; input.value=value; form.append(input);
    }
  }
  const deck = shuffle(validSites, 'destinations');
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
  const adVisual = site => `<div class="br-ad-visual br-visual-${site}" aria-hidden="true">${({corn:'<span>Corn<b>hub</b></span><i>▶</i>',desk:'<span>FROM <b>RM39</b></span>',stock:'<span>Framekind<br><b>STOCK IMAGES</b></span>',game:'<span>SIGNAL<br>GARDEN</span><i>▦</i>',security:'<span>!</span>',player:'<span>▶</span>',software:'<span>ZIP</span>',prize:'<span>REWARD<br><b>RM800</b></span>',coupon:'<span>RM<b>100</b><small>SHOPPING VOUCHER</small></span>',parcel:'<span>NorthPost<br><b>DELIVERY UPDATE</b></span>'})[site]}</div>`;
  const adURL = site => url('destination.html', {site, from:scene});
  const wireAds = node => { for (const a of node.querySelectorAll('[data-br-ad]')) { const id = validSites.includes(a.dataset.brAd) ? a.dataset.brAd : deck[0]; a.href=adURL(id); a.target='_blank'; a.rel='noopener'; } };
  wireAds(root);
  // Scene controls can redraw a document region (servings, saved filters, etc.).
  // Reconcile newly created native links/forms without replacing scene handlers.
  const ensureInlineAd=()=>{
    if(root.querySelector('[data-br-ad]'))return;
    const strip=document.createElement('aside');strip.className='br-inline-ad';strip.setAttribute('aria-label',t('Advertisement','广告'));
    const id=shuffle(['desk','stock','game'],'inline')[0],a=ads[id];
    strip.innerHTML=`<small>${t('ADVERTISEMENT','广告')}</small><div>${adVisual(id)}<p><b>${a[0]}</b><br>${a[1]}</p><a data-br-ad="${id}">${a[2]} →</a></div>`;
    (root.querySelector('main')||root).append(strip);wireAds(strip);
  };
  new MutationObserver(()=>{
    ensureInlineAd();
    wireAds(root);
    for(const form of root.querySelectorAll('form')){
      if((form.getAttribute('method')||'get').toLowerCase()!=='get')continue;
      for(const [name,value] of [['lang',lang],['seed',seed],['v','rescue2'],...(brief?[['task',brief.id]]:[])]){
        if(form.querySelector(`[name="${name}"]`))continue;
        const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.append(input);
      }
    }
  }).observe(root,{childList:true,subtree:true});
  ensureInlineAd();
  window.BROWSE_AD_STACK({...C,seed,ads,adVisual,adDescription,adURL,wireAds,deck,chosen,rawRead,rawWrite});
})();
