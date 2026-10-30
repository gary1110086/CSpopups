/* Browse: native documents, local state and gesture-opened advertiser tabs. */
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const booth=window.BROWSE_BOOTH;
  const roundContext=booth?.context(params,document.body.dataset.scene);
  if(roundContext?.requested&&!roundContext.valid){
    const recover=new URL('booth.html',location.href);recover.searchParams.set('lang',params.get('lang')==='zh'?'zh':'en');recover.searchParams.set('mode','clean');recover.searchParams.set('notice','missing-round');location.replace(recover.href);return;
  }
  const round=roundContext?.round;
  if(round&&['ended','void'].includes(round.status)){location.replace(booth.resultURL(round));return;}
  // Restored pending cards mount before booth.start(). Reserve the strip before
  // either their scroll limits or motion controllers measure the viewport.
  if(round){document.documentElement.classList.add('br-booth-running');document.documentElement.style.setProperty('--br-booth-offset','56px');}
  if(round){params.set('seed',round.seed);params.set('mode',round.mode);params.set('lang',round.lang);}
  const clean=Boolean(round&&round.mode==='clean');
  if(clean)document.documentElement.classList.add('br-booth-clean');
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
    u.searchParams.set('lang', lang); u.searchParams.set('seed', seed); u.searchParams.set('v', 'corn2a');
    if(params.has('task')&&['index.html',...(window.BROWSE_SCENE_INDEX||[]).map(s=>s.file)].includes(u.pathname.split('/').pop()))u.searchParams.set('task',params.get('task'));
    Object.entries(query).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') u.searchParams.set(k, String(v)); });
    return round?booth.decorate(u.href):u.href;
  };
  const memory = {};
  const rawRead = (key, fallback) => { try { const raw = sessionStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch { return key in memory ? memory[key] : fallback; } };
  const rawWrite = (key, value) => { memory[key] = value; try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const read = (key, fallback) => rawRead('br-data-v1:' + seed + ':' + key, fallback);
  let C;
  const write = (key, value) => {
    if(booth?.canAct()===false)return false;
    rawWrite('br-data-v1:' + seed + ':' + key, value);
    if(C&&round)booth.capture(C);
    return true;
  };
  const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const rng = salt => { let a = hash(seed + salt); return () => { a += 0x6D2B79F5; let n = a; n = Math.imul(n ^ n >>> 15, n | 1); n ^= n + Math.imul(n ^ n >>> 7, n | 61); return ((n ^ n >>> 14) >>> 0) / 4294967296; }; };
  const shuffle = (arr, salt) => { const out = [...arr], r = rng(salt); for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } return out; };
  const scenes = (window.BROWSE_SCENE_INDEX||[]).map(s=>[s.id,s.file,s.name,s.brief[lang==='zh'?1:0],s.art,s.kicker[lang==='zh'?1:0],s.cover]);
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  const root = document.getElementById('site-root');
  C = {root, params, lang, t, esc, url, read, write, seed,scene:document.body.dataset.scene,complete(label) { if(write('last-completed', {label: String(label).slice(0,120), at: Date.now()})===false)return; window.dispatchEvent(new CustomEvent('browse:complete',{detail:String(label).slice(0,160)})); }};
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
    const reviewHref=new URL('review.html',location.href);reviewHref.searchParams.set('lang',lang);reviewHref.searchParams.set('v','corn2a');
    root.innerHTML = `<main class="br-launch"><header class="br-launch-head"><a class="br-wordmark" href="${url('launch.html')}">Browse<span> / website selection</span></a><a href="${url('launch.html',{lang:lang==='zh'?'en':'zh'})}">${lang==='zh'?'English':'中文'}</a></header><div class="br-launch-intro"><div><h1>${t('Choose a website','选择一个网站')}</h1><p>${t('Open a website below and complete its task. Or start with a randomly selected website.','打开下方网站并完成一个小任务，也可以随机开始。')}</p></div><a class="br-start" href="${url('index.html',{seed:randomSeed()})}">${t('Random website','随机开始')} →</a></div><p class="br-task-entry"><a href="${url('booth.html',{mode:'ads'})}">${t('60-second challenge','60秒任务挑战')} →</a> · <a href="${url('booth.html',{mode:'clean'})}">${t('Clean difficulty test','纯净难度测试')} →</a></p><p class="br-task-entry"><a href="${url('tasks.html')}">${t('Choose a specific search task','选择具体检索任务')} →</a> · <a href="${url('index.html',{task:'random',seed:randomSeed()})}">${t('Random task','随机任务')}</a></p><div class="br-scene-grid">${scenes.map((s,i)=>`<a class="br-scene-card br-scene-${s[4]}" href="${url(s[1],{seed:randomSeed()})}"><div class="br-scene-art" style="${s[6]?'background-image:url('+esc(s[6])+');background-size:cover;background-position:center;':''}" aria-hidden="true"></div><div><small>${s[5]}</small><h2>${s[2]}</h2><p>${s[3]}</p><span class="br-card-arrow">${t('Open website','打开网站')} →</span></div></a>`).join('')}</div><footer class="br-launch-foot"><p>${t('A fictional browsing experience. Your files and progress stay in this browser.','虚构浏览体验。文件和进度保留在此浏览器。')}</p><a href="${url('guide.html')}">${t('Facilitator notes & references','主持人说明与参考来源')} ↗</a><a href="${esc(reviewHref.href)}">${t('Review recent sessions','工作人员 · 浏览复盘')} →</a></footer></main>`;
    return;
  }
  if (document.body.dataset.destination) { window.BROWSE_DESTINATIONS?.(C); return; }
  const scene = document.body.dataset.scene;
  const renderer = window.BROWSE_SCENES?.[scene];
  if (!renderer) { root.innerHTML = `<main class="br-guide"><h1>${t('This page could not be loaded.','此页面未能加载。')}</h1><a href="${url('launch.html')}">${t('Choose a website','选择网站')}</a></main>`; return; }
  const review=window.BROWSE_REVIEW_LOG?.({...C,seed,scene});
  renderer(C);
  // Keep briefs in the task library; website pages currently open without the task/notes panel.
  // Native GET navigation carries the same context after a scene redraw.
  const wireForms = () => {
    for (const form of root.querySelectorAll('form')) {
      if ((form.getAttribute('method') || 'get').toLowerCase() !== 'get') continue;
      for (const [name,value] of [['lang',lang],['seed',seed],['v','corn2a'],...(brief?[['task',brief.id]]:[]),...(round?[['round',round.id],['mode',round.mode]]:[])]) {
        const existing=form.querySelector(`[name="${name}"]`);
        if (existing) {if(round&&existing.type==='hidden')existing.value=value;continue;}
        const input = document.createElement('input'); input.type='hidden'; input.name=name; input.value=value; form.append(input);
      }
    }
  };
  const wireRoundLinks=()=>{
    if(!round)return;
    for(const a of root.querySelectorAll('a[href]')){
      const next=booth.decorate(a.href);if(next!==a.href)a.href=next;
      const destination=new URL(a.href,location.href);
      // Supporting references open separately so the active task keeps its clock.
      if(/^https?:$/.test(destination.protocol)&&(destination.origin!==location.origin||destination.pathname!==location.pathname)&&!a.hasAttribute('download')){
        a.target='_blank';a.rel='noopener noreferrer';
      }
    }
  };
  wireForms();
  wireRoundLinks();
  if(clean){
    // Author-authored sponsor containers must also disappear after scene redraws.
    // Keep the filtering sidebar itself: only its nested commercial block is removed.
    const sanitize=()=>{
      root.querySelectorAll('.swb-sponsor,.pp-ad-banner,.ot-top-ad,.ot-ad-banner,.cu-sponsor,.lp-sponsored,.br-inline-ad,[data-context-ad],[data-br-ad]').forEach(node=>node.remove());
      wireForms();wireRoundLinks();
    };
    sanitize();
    const observer=new MutationObserver(sanitize);observer.observe(root,{childList:true,subtree:true});
    let suspended=false,last=performance.now(),activeMs=window.BROWSE_REVIEW_DATA?.read(seed)?.activeMs||0,generation=0;
    const clock=setInterval(()=>{const now=performance.now(),delta=Math.max(0,Math.min(1000,now-last));last=now;if(suspended||document.hidden||!document.hasFocus())return;activeMs+=delta;review?.update({activeMs,shown:0,pending:0,active:true});},250);
    window.addEventListener('pagehide',()=>{suspended=true;generation++;});
    window.addEventListener('pageshow',event=>{last=performance.now();if(!event.persisted){suspended=false;return;}const current=++generation;requestAnimationFrame(()=>requestAnimationFrame(()=>{if(current!==generation)return;activeMs=window.BROWSE_REVIEW_DATA?.read(seed)?.activeMs||activeMs;last=performance.now();suspended=false;sanitize();}));});
    window.addEventListener('browse:booth-end',()=>{suspended=true;generation++;clearInterval(clock);observer.disconnect();},{once:true});
    booth.start(C);return;
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
  const adVisual = site => `<div class="br-ad-visual br-visual-${site}" aria-hidden="true">${({corn:'<div class="br-corn-photo-strip"><img src="assets/corn-portrait-01.jpg" alt=""><img src="assets/corn-portrait-02.jpg" alt=""><img src="assets/corn-portrait-03.jpg" alt=""></div><span>Corn<b>hub</b></span><i>▶</i>',desk:'<span>FROM <b>RM39</b></span>',stock:'<span>Framekind<br><b>STOCK IMAGES</b></span>',game:'<span>SIGNAL<br>GARDEN</span><i>▦</i>',security:'<span>!</span>',player:'<span>▶</span>',software:'<span>ZIP</span>',prize:'<span>REWARD<br><b>RM800</b></span>',coupon:'<span>RM<b>100</b><small>SHOPPING VOUCHER</small></span>',parcel:'<span>NorthPost<br><b>DELIVERY UPDATE</b></span>'})[site]}</div>`;
  const campaign=window.BROWSE_AD_CONTEXT?.({...C,seed,scene,ads,adDescription});
  const adOffer=(site,ordinal)=>campaign?.adOffer(site,ordinal)||{brand:ads[site][0],title:ads[site][1],cta:ads[site][2],eyebrow:ads[site][3],description:adDescription(site)};
  const campaignSite=campaign?.campaignSite;
  const adURL = site => url('destination.html', {site, from:scene,...(campaign?.adURLMeta(site)||{})});
  const redirectURL = target => 'redirect-hop.html?'+new URLSearchParams({step:'1',target:['trip','shop','games'].includes(target)?target:'trip',lang,v:'corn2a'});
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
  let events=null,consent=null,layout=null,bait=null;
  const sound=window.BROWSE_AD_SOUND?.({...C,seed});
  const contentObserver=new MutationObserver(()=>{
    campaign?.reconcile();
    layout?.reconcile();
    consent?.reconcile();
    bait?.reconcile();
    ensureInlineAd();
    wireAds(root);
    wireForms();
    wireRoundLinks();
  });contentObserver.observe(root,{childList:true,subtree:true});
  campaign?.reconcile();
  ensureInlineAd();
  const stack=window.BROWSE_AD_STACK({...C,seed,ads,adVisual,adDescription,adOffer,campaignSite,adURL,redirectURL,wireAds,deck,chosen,rawRead,rawWrite,onState:state=>{
    review?.update(state);events?.update(state);layout?.update(state);consent?.update(state);sound?.update(state);bait?.update(state);
  },onArrival:item=>sound?.arrival(item),onBurst:()=>{sound?.burst();review?.record({type:'burst'});}});
  events=window.BROWSE_EVENTS?.({...C,seed,scene,ads,adURL,adOffer,campaignSite,stack});
  layout=window.BROWSE_LAYOUT_EVENT?.({...C,seed,scene,adURL,adOffer,campaignSite,wireAds,stack});
  consent=window.BROWSE_CONSENT?.({...C,seed,scene,stack});
  bait=window.BROWSE_CLEANER_BAIT?.({...C,seed,scene,stack});
  window.addEventListener('browse:booth-dialog',event=>stack.setExternalModal(event.detail?.open===true));
  window.addEventListener('browse:booth-end',()=>{contentObserver.disconnect();events?.destroy();layout?.destroy();consent?.destroy();bait?.destroy();sound?.destroy();stack.destroy?.();},{once:true});
  // Observe the actual outcome for document advertisements as well as floating cards.
  // Modifiers keep the browser's native action and are reported as unconfirmed intent.
  const observeAdLink=event=>{
    if(event.defaultPrevented)return;
    const anchor=event.target.closest?.('a[data-br-ad],a[data-br-event-link],a[data-br-cleaner],a[data-br-fallback],.br-event-fallback a');
    if(!anchor||anchor.closest('[inert]')||stack.snapshot().suspended)return;
    const observedSites=[...validSites,'cleaner'];
    let site=anchor.hasAttribute('data-br-cleaner')?'cleaner':anchor.dataset.brAd||anchor.dataset.brEventLink;
    if(!observedSites.includes(site)){try{const target=new URL(anchor.href);site=target.pathname.endsWith('/cleaner.html')?'cleaner':target.searchParams.get('site');}catch{return;}}
    if(!observedSites.includes(site))return;
    const card=anchor.closest('.br-ad');
    const cardFormat=card&&['bounce','tiny','dodge','drawer','panel','newsletter'].find(name=>card.classList.contains('br-ad-'+name));
    const format=cardFormat|| (anchor.closest('[data-br-cleaner-bait]')?'document':anchor.closest('.br-event-widget')?'event':anchor.closest('[data-br-layout]')?'layout':anchor.closest('[data-context-ad]')?'context':anchor.closest('.br-inline-ad')?'inline':'ambient');
    const control=anchor.classList.contains('br-false-close')||anchor.hasAttribute('data-br-decoy')?'decoy':anchor.hasAttribute('data-br-fallback')||anchor.closest('.br-event-fallback')?'fallback':'cta';
    const plain=event.button===0&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey;
    // A fallback must remain a real anchor: it is the way out when script-opened
    // windows were blocked. Its result cannot be synchronously observed here.
    if(!plain||control==='fallback'){review?.record({type:'ad-open',site,format,control,outcome:'native'});return;}
    event.preventDefault();let child=null;try{child=window.open(anchor.href,'_blank');}catch{}
    review?.record({type:'ad-open',site,format,control,outcome:child?'opened':'blocked'});
    if(child){try{child.opener=null;}catch{}return;}
    const owner=anchor.closest('aside,section')||anchor.parentElement;
    let fallback=owner.querySelector('.br-document-fallback');
    if(!fallback){fallback=document.createElement('p');fallback.className='br-blocked br-document-fallback';owner.append(fallback);}
    fallback.replaceChildren(document.createTextNode(t('Your browser kept this page here. ','浏览器保留了当前页面。')));
    const link=document.createElement('a');link.href=anchor.href;link.target='_blank';link.rel='noopener';link.dataset.brFallback='';link.textContent=t('Open advertiser page ↗','打开广告页面 ↗');fallback.append(link);
  };
  document.addEventListener('click',observeAdLink);
  document.addEventListener('auxclick',event=>{if(event.button===1)observeAdLink(event);});
  if(round)booth.start(C);
})();
