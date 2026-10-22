/* Fictional, non-explicit catalogue. All interactions stay inside the game. */
window.NIGHTROOM = (() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clips = [
    ['After hours — the extended cut','深夜之后 · 加长版','Mia Studio','studio','28:14',824,96],
    ['A late check-in — full scene','深夜入住 · 完整片段','North Studio','studio','19:42',613,98],
    ['Unscripted: a private interview','没有剧本的一次访谈','Room Sessions','interview','42:08',1204,97],
    ['Last ride through the city','城市里的末班车','Night Shift','studio','16:55',436,93],
    ['Behind the scenes / vol. 08','幕后花絮 / 第 08 集','Mia Studio','behind','12:31',286,95],
    ['Midnight rain — full version','午夜的雨 · 完整版','Independent','studio','31:06',957,94],
    ['An evening with the cast','与演员们共度的夜晚','Room Sessions','interview','35:20',705,97],
    ['Sunday, uncut','周日 · 未剪辑版','Hana Official','behind','21:48',389,92],
    ['One more take: studio diary','再拍一次 · 工作室日记','Night Shift','behind','24:03',518,96],
    ['Room 308 — after the shoot','308 号房 · 拍摄结束后','Independent','studio','38:27',1108,98],
    ['Meet the cast: Lena','认识演员 Lena','Lena Channel','interview','18:09',659,95],
    ['The photographer’s session','摄影师的一次拍摄','Lena Channel','behind','27:36',743,97],
  ].map((v,i)=>({id:i,en:v[0],zh:v[1],channel:v[2],category:v[3],duration:v[4],views:v[5],rating:v[6]}));
  const words = {
    en:{search:'Search videos',premium:'Premium',upload:'Upload',all:'All videos',latest:'Latest',top:'Most viewed',studio:'Studio',interview:'Interviews',behind:'Behind the scenes',recommended:'Recommended for you',results:'Search results',sort:'Featured',advertisement:'ADVERTISEMENT',next:'Next',previous:'Previous',online:'ONLINE NOW',chat:'Start chat',adHeadline:'Your next favourite is here.',adText:'Full access. No interruptions.',adCta:'Try Premium',channel:'Verified channel',views:'views',more:'More videos',back:'Back to videos',playing:'Connecting to video server…',play:'Play video',quality:'1080p',updateTitle:'Video player update',updateText:'The current video format requires the latest player component. Update the player to continue.',update:'Update player',later:'Not now',premiumTitle:'Watch without limits',premiumText:'Try Premium for RM1. Get HD playback and access to the full catalogue.',join:'Start RM1 trial',notifyTitle:'nightroom.example wants to',notifyText:'Show notifications',allow:'Allow',block:'Block',doneTitle:'Request received',doneText:'Please wait while we prepare your access.',donePlayer:'This video is temporarily unavailable.',dismiss:'Close',empty:'No videos found. Try another search.',count:'videos',terms:'Terms',privacy:'Privacy',copyright:'Copyright',footer:'All rights reserved.',saved:'Saved',save:'Save',report:'Report',reportDone:'Report received',like:'Like',liked:'Liked',download:'Download',joinSmall:'Join now',adClose:'Close advertisement'},
    zh:{search:'搜索视频',premium:'高级会员',upload:'上传',all:'全部视频',latest:'最新',top:'最多观看',studio:'工作室',interview:'访谈',behind:'幕后花絮',recommended:'为你推荐',results:'搜索结果',sort:'精选',advertisement:'广告',next:'下一页',previous:'上一页',online:'当前在线',chat:'开始聊天',adHeadline:'发现你的下一个最爱。',adText:'完整观看，不受打扰。',adCta:'体验高级会员',channel:'认证频道',views:'次观看',more:'更多视频',back:'返回视频列表',playing:'正在连接视频服务器…',play:'播放视频',quality:'1080p',updateTitle:'视频播放器更新',updateText:'当前视频格式需要最新版播放组件。请更新播放器后继续。',update:'更新播放器',later:'暂不更新',premiumTitle:'畅看全部内容',premiumText:'RM1 体验高级会员，解锁高清播放与完整片库。',join:'开启 RM1 体验',notifyTitle:'nightroom.example 请求',notifyText:'显示通知',allow:'允许',block:'拒绝',doneTitle:'已收到请求',doneText:'正在为你准备访问权限，请稍候。',donePlayer:'此视频暂时无法播放。',dismiss:'关闭',empty:'没有找到视频，请换个关键词。',count:'个视频',terms:'使用条款',privacy:'隐私',copyright:'版权',footer:'保留所有权利。',saved:'已收藏',save:'收藏',report:'举报',reportDone:'已收到举报',like:'喜欢',liked:'已喜欢',download:'下载',joinSmall:'立即加入',adClose:'关闭广告'}
  };
  const initial = () => ({view:'browse',filter:'all',sort:'featured',query:'',video:0,phase:'ready',notice:null,adHidden:false,chatHidden:false,page:1,liked:[],saved:[],actions:[],redirectedAt:0,trigger:''});
  const thumb = (id, cls='') => `<span class="nr-thumb ${cls}" style="--thumb-x:${id%4/3*100}%;--thumb-y:${Math.floor(id/4)/2*100}%"></span>`;
  const button = (text,action,attrs='',cls='') => `<button type="button" class="${cls}" data-action="night-${action}" ${attrs}>${esc(text)}</button>`;
  function render(n,lang){
    const w=words[lang], title=c=>c[lang], current=clips[n.video];
    let list=clips.filter(c=>(n.filter==='all'||c.category===n.filter)&&`${title(c)} ${c.en} ${c.channel}`.toLowerCase().includes(n.query.toLowerCase()));
    if(n.sort==='top')list.sort((a,b)=>b.views-a.views); else if(n.sort==='latest')list.reverse();
    const pages=Math.max(1,Math.ceil(list.length/8)); n.page=Math.min(n.page,pages);
    const card=c=>`<article class="nr-card"><button class="nr-video-link" data-action="night-watch" data-video="${c.id}">${thumb(c.id)}<span class="nr-hd">HD</span><time>${c.duration}</time><span class="nr-hover-play">▶</span></button><button class="nr-title" data-action="night-watch" data-video="${c.id}">${esc(title(c))}</button><button class="nr-channel" data-action="night-channel" data-channel="${esc(c.channel)}">${esc(c.channel)} <span aria-label="${w.channel}">✓</span></button><div class="nr-stats"><span>${c.views>999?(c.views/1000).toFixed(1)+'M':c.views+'K'} ${w.views}</span><span>♥ ${c.rating}%</span></div></article>`;
    const grid = `<div class="nr-grid">${list.slice((n.page-1)*8,n.page*8).map(card).join('')||`<p class="nr-empty">${w.empty}</p>`}</div><div class="nr-pagination">${Array.from({length:pages},(_,i)=>button(i+1,'page',`data-page="${i+1}" aria-current="${n.page===i+1?'page':'false'}"`,n.page===i+1?'active':'')).join('')}</div>`;
    const player = `<div class="nr-watch"><button class="nr-back" data-action="night-browse">‹ ${w.back}</button><div class="nr-player">${thumb(current.id)}<div class="nr-player-shade"></div>${n.phase==='loading'?`<div class="nr-player-message"><span class="nr-spinner"></span>${w.playing}</div>`:n.phase==='unavailable'?`<div class="nr-player-message">${w.donePlayer}${button(w.more,'browse','','nr-orange')}</div>`:`<button class="nr-play" data-action="night-play" aria-label="${w.play}">▶</button>`}<div class="nr-player-controls"><span>▶ &nbsp; 0:00 / ${current.duration}</span><span>${w.quality} &nbsp; ⚙ &nbsp; ⛶</span></div></div><h1>${esc(title(current))}</h1><div class="nr-watch-meta"><span>${current.views}K ${w.views} · ${current.rating}%</span><div>${button(n.liked.includes(current.id)?w.liked:w.like,'like')}${button(n.saved.includes(current.id)?w.saved:w.save,'save')}${button(w.download,'download')}${button(n.reported===current.id?w.reportDone:w.report,'report')}</div></div><div class="nr-creator"><span class="nr-avatar">${current.channel[0]}</span><strong>${esc(current.channel)} <span>✓</span></strong>${button(w.joinSmall,'premium','','nr-orange')}</div><h2>${w.more}</h2><div class="nr-grid nr-related">${clips.filter(c=>c.id!==current.id).slice(0,4).map(card).join('')}</div></div>`;
    let prompt='';
    if(n.notice){
      const type=n.notice;
      const [heading,body,buttons] = type==='update'?[w.updateTitle,w.updateText,button(w.later,'dismiss')+button(w.update,'install','','nr-orange')]:type==='premium'?[w.premiumTitle,w.premiumText,button(w.later,'dismiss')+button(w.join,'join','','nr-orange')]:type==='notify'?[w.notifyTitle,w.notifyText,button(w.block,'block')+button(w.allow,'allow','','nr-orange')]:[w.doneTitle,w.doneText,button(w.dismiss,'dismiss','','nr-orange')];
      prompt=`<div class="nr-prompt-backdrop"><section class="nr-prompt" role="dialog" aria-labelledby="nr-prompt-title"><button class="nr-prompt-close" data-action="night-dismiss" aria-label="${w.dismiss}">×</button><div class="nr-prompt-icon">${type==='update'?'↓':type==='notify'?'♧':'★'}</div><h2 id="nr-prompt-title">${heading}</h2><p>${body}</p><div class="nr-prompt-actions">${buttons}</div><small>${type==='update'?'Web Player · v4.8.2':'nightroom.example'}</small></section></div>`;
    }
    return `<section class="night-site"><div class="nr-network"><span>VIDEO NETWORK</span><span>HD · 4K &nbsp; | &nbsp; EN / 中文 &nbsp; | &nbsp; 18+</span></div><header class="nr-header"><button class="nr-logo" data-action="night-browse">night<span>room</span><sup>18+</sup></button><form class="nr-search" id="night-search"><input id="night-query" aria-label="${w.search}" placeholder="${w.search}" value="${esc(n.query)}" autocomplete="off" maxlength="80"><button type="submit" aria-label="${w.search}">⌕</button></form>${button(w.premium,'premium','','nr-premium')}<button class="nr-account" data-action="night-premium" aria-label="Account">●</button></header><nav class="nr-nav">${[['all',w.all],['latest',w.latest],['top',w.top],['studio',w.studio],['interview',w.interview],['behind',w.behind]].map(([key,label])=>button(label,'filter',`data-filter="${key}"`,((key===n.filter&&n.sort==='featured')||key===n.sort)?'active':'')).join('')}</nav>
      <div class="nr-body">${!n.adHidden?`<div class="nr-ad-label">${w.advertisement}</div><aside class="nr-banner">${thumb(5)}<div><strong>${w.adHeadline}</strong><span>${w.adText}</span></div>${button(w.adCta,'premium','','nr-orange')}<button class="nr-ad-x" data-action="night-ad-close" aria-label="${w.adClose}">×</button></aside>`:''}<div class="nr-columns"><main class="nr-main">${n.view==='watch'?player:`<div class="nr-heading"><h1>${n.query?w.results:w.recommended}</h1><span>${list.length} ${w.count}</span></div><div class="nr-chips">${button(w.sort,'filter','data-filter="all"',n.sort==='featured'?'active':'')}${button(w.latest,'filter','data-filter="latest"',n.sort==='latest'?'active':'')}${button(w.top,'filter','data-filter="top"',n.sort==='top'?'active':'')}<span>HD <i>✓</i></span></div>${grid}`}</main><aside class="nr-rail"><div class="nr-ad-label">${w.advertisement}</div><button class="nr-live-ad" data-action="night-chat">${thumb(4)}<span class="nr-live-label"><i></i> LIVE</span><span class="nr-live-copy">Sofia <small>${w.online}</small><b>${w.chat} ›</b></span></button><div class="nr-rail-box"><strong>HD. EVERY DAY.</strong><p>${w.adText}</p>${button(w.joinSmall,'premium','','nr-orange')}</div><div class="nr-rail-tags">HD 1080p <span>4K</span> Verified channels</div></aside></div><footer class="nr-footer"><span>© 2026 Nightroom. ${w.footer}</span><span>${w.terms} · ${w.privacy} · ${w.copyright}</span></footer></div>
      ${!n.chatHidden?`<aside class="nr-chat"><button data-action="night-chat-close" class="nr-chat-x" aria-label="${w.dismiss}">×</button>${thumb(4)}<div><strong>Sofia <i></i></strong><small>${w.online}</small>${button(w.chat,'chat')}</div></aside>`:''}${prompt}</section>`;
  }
  function act(n,action,data,elapsed){
    const log=(kind)=>n.actions.push({kind,at:Math.round(elapsed)});
    switch(action){
      case 'browse': n.view='browse';n.notice=null;n.phase='ready';break;
      case 'watch': n.video=Math.max(0,Math.min(clips.length-1,Number(data.video)||0));n.view='watch';n.phase='ready';n.notice=null;log('watch');break;
      case 'play': n.phase='loading';n.loadAt=elapsed;log('play');break;
      case 'filter': n.view='browse';n.query='';n.page=1;n.sort=['top','latest'].includes(data.filter)?data.filter:'featured';n.filter=['studio','interview','behind'].includes(data.filter)?data.filter:'all';break;
      case 'channel': n.query=data.channel;n.filter='all';n.page=1;n.view='browse';break;
      case 'page': n.page=Number(data.page)||1;break;
      case 'premium': n.notice='premium';break;
      case 'chat': n.notice='notify';break;
      case 'download': n.notice='update';break;
      case 'install': n.notice=null;n.phase='unavailable';log('install');break;
      case 'join': n.notice='done';log('join');break;
      case 'allow': n.notice=null;n.chatHidden=true;log('allow');break;
      case 'block': n.notice=null;n.chatHidden=true;log('block');break;
      case 'dismiss': if(n.notice==='update')n.phase='ready';n.notice=null;log('dismiss');break;
      case 'ad-close': n.adHidden=true;log('ad-close');break;
      case 'chat-close': n.chatHidden=true;log('ad-close');break;
      case 'like': if(!n.liked.includes(n.video))n.liked.push(n.video);break;
      case 'save': if(!n.saved.includes(n.video))n.saved.push(n.video);break;
      case 'report': n.reported=n.video;break;
      default:return false;
    }
    return true;
  }
  function review(n,lang){
    if(!n)return '';
    const zh=lang==='zh';
    const labels=zh?{watch:'点开视频',play:'尝试播放',install:'接受播放器更新',join:'接受 RM1 会员体验',allow:'允许通知',block:'拒绝通知',dismiss:'关闭提示','ad-close':'关闭广告',leave:'关闭陌生标签',back:'返回原网页'}:{watch:'Opened a video',play:'Tried to play',install:'Accepted player update',join:'Accepted RM1 trial',allow:'Allowed notifications',block:'Blocked notifications',dismiss:'Dismissed prompt','ad-close':'Closed an ad',leave:'Closed unfamiliar tab',back:'Returned to original page'};
    return `<details class="review-item nr-review" open><summary><span>↗</span><span class="review-label">${zh?'中途意外跳转':'Unexpected mid-round redirect'}</span><span class="result-tag neutral">${zh?'点击被截走':'Redirected click'}</span></summary><div class="review-detail"><p class="domain">nightroom.example · ${n.redirectedAt}s</p><p>${zh?'你原本点击的是：':'You meant to click: '}${esc(n.trigger)}。${zh?'这次跳转本身不计为主动风险选择。':'The redirect itself is not counted as a deliberate risky choice.'}</p><ol>${n.actions.map(e=>`<li>${e.at}s · ${esc(labels[e.kind]||e.kind)}</li>`).join('')||`<li>${zh?'没有继续操作该页面。':'No further interaction on this page.'}</li>`}</ol><p>${zh?'意外打开页面后，重点是接下来接受了什么请求。更新播放器、支付验证费和开启通知都与关闭页面无关。可从浏览器标签关闭或后退离开。':'After an unexpected redirect, judge the next request. Updating a player, paying a verification fee or enabling notifications is not necessary to leave a page. Close the browser tab or go back.'}</p></div></details>`;
  }
  return {initial,render,act,review};
})();
