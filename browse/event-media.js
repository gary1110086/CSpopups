/* Optional local media interruptions. The event director owns selection and timing. */
(() => {
  'use strict';
  window.BROWSE_EVENT_MEDIA = C => {
    const {root,host,scene,t,esc,adURL,finish}=C;
    const sites=['corn','desk','stock','game','security','player','software','prize','coupon','parcel'];
    const sponsor=sites.includes(C.campaignSite)?C.campaignSite:'coupon';
    const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let kind=null,card=null,slot=null,video=null,observer=null,mediaListeners=null,raf=0,resumeFrame=0;
    let paused=false,destroyed=false,seenInline=false,wantsPlayback=false,internalPause=false,reparenting=false;
    const link=(site,label,className='')=>`<a class="${className}" href="${esc(adURL(site))}" data-br-event-link="${site}" target="_blank" rel="noopener">${esc(label)}</a>`;
    const header=(brand,label)=>`<header class="br-event-media-head"><span><small>${t('Sponsored','赞助')}</small> · ${esc(brand)}<b>${esc(label)}</b></span><button type="button" data-event-close class="br-event-media-close" aria-label="${t('Dismiss advertisement','关闭广告')}">×</button></header>`;
    const focused=()=>!document.hidden&&(typeof document.hasFocus!=='function'||document.hasFocus());
    const stopVideo=()=>{
      if(!video||video.paused)return;
      internalPause=true;
      video.pause();
    };
    const playVideo=()=>{
      if(!video||paused||!focused()||!wantsPlayback||video.ended||card?.classList.contains('br-event-blocked')||(!seenInline&&card?.dataset.floating!=='true'))return;
      const playingVideo=video,playingCard=card,request=video.play();
      if(request?.catch)request.catch(error=>{if(error?.name==='NotAllowedError'&&card===playingCard&&video===playingVideo)card.dataset.autoplay='blocked';});
    };
    const clear=()=>{
      kind=null;wantsPlayback=false;
      cancelAnimationFrame(raf);cancelAnimationFrame(resumeFrame);raf=resumeFrame=0;
      observer?.disconnect();observer=null;
      mediaListeners?.abort();mediaListeners=null;
      stopVideo();
      if(video){video.removeAttribute('src');video.load();}
      card?.remove();slot?.remove();
      card=slot=video=null;seenInline=false;internalPause=false;reparenting=false;
    };
    const dismiss=()=>{const dismissed=kind;clear();if(dismissed)finish?.(dismissed);};
    const placement=()=>root.querySelector('[data-context-ad]')||root.querySelector('main')||root;
    const attachSlot=()=>{
      if(!slot||slot.isConnected)return;
      const anchor=placement();
      if(anchor.hasAttribute('data-context-ad'))anchor.insertAdjacentElement('afterend',slot);
      else anchor.prepend(slot);
    };
    const viewport=()=>({
      width:Math.max(1,window.visualViewport?.width||innerWidth),
      height:Math.max(1,window.visualViewport?.height||innerHeight),
      left:window.visualViewport?.offsetLeft||0,
      top:window.visualViewport?.offsetTop||0
    });
    const position=()=>{
      if(!card)return;
      const bounds=viewport();
      card.style.setProperty('--br-event-media-vw',bounds.width+'px');
      card.style.setProperty('--br-event-media-vh',bounds.height+'px');
      if(kind==='character'||card.dataset.floating==='true'){
        const rect=card.getBoundingClientRect();
        const base=bounds.height>480?102:8;
        card.style.left=Math.max(bounds.left+8,bounds.left+bounds.width-rect.width-12)+'px';
        card.style.top=Math.max(bounds.top+8,bounds.top+bounds.height-rect.height-base)+'px';
      }
    };
    const moveCard=target=>{
      if(!card||card.parentNode===target)return;
      const wasPlaying=!!video&&!video.paused;
      reparenting=true;
      stopVideo();
      target.append(card);
      cancelAnimationFrame(resumeFrame);
      resumeFrame=requestAnimationFrame(()=>{resumeFrame=0;reparenting=false;if(wasPlaying)playVideo();});
    };
    const dock=()=>{
      if(kind!=='video'||!slot||!card||paused||!focused())return;
      attachSlot();
      const bounds=viewport(),rect=slot.getBoundingClientRect();
      const visible=rect.bottom>bounds.top+40&&rect.top<bounds.top+bounds.height-35;
      if(visible){
        const firstView=!seenInline;seenInline=true;
        if(card.dataset.floating==='true'){
          card.dataset.floating='false';card.style.removeProperty('left');card.style.removeProperty('top');
          moveCard(slot);slot.style.removeProperty('min-height');
        }
        if(firstView)playVideo();
      }else if(seenInline&&card.dataset.floating!=='true'){
        slot.style.minHeight=Math.ceil(Math.max(1,rect.height))+'px';
        card.dataset.floating='true';moveCard(host);
      }
      position();
    };
    const schedule=()=>{
      if(raf||destroyed)return;
      raf=requestAnimationFrame(()=>{raf=0;if(kind==='video')dock();position();});
    };
    const returnInline=()=>{
      if(!slot||!card)return;
      attachSlot();seenInline=false;
      card.dataset.floating='false';card.style.removeProperty('left');card.style.removeProperty('top');
      moveCard(slot);slot.style.removeProperty('min-height');
      slot.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});
    };
    const showVideo=()=>{
      slot=document.createElement('div');slot.className='br-event-video-slot';slot.dataset.eventVideoSlot='true';
      card=document.createElement('section');
      card.className='br-event-widget br-event-media br-event-video';
      card.dataset.eventKind='video';card.dataset.floating='false';
      card.setAttribute('aria-label',t('Sponsored film preview','赞助影片预览'));
      card.innerHTML=header('Orbit Player',t('Featured film preview','精选影片预览'))+`<div class="br-event-media-body"><div class="br-event-video-frame"><video controls muted playsinline preload="metadata" poster="assets/video-sintel.jpg" src="assets/video-sintel.mp4" aria-label="${t('Sintel official trailer','Sintel 官方预告片')}"></video></div><div class="br-event-video-copy"><small>${t('OPEN FILM / OFFICIAL TRAILER','开放电影 / 官方预告片')}</small><h2>Sintel</h2><p>${t('A small preview before your next click.','下一次点击之前，先看一小段。')}</p><div class="br-event-video-actions"><button type="button" data-event-play>${t('Play preview','播放预览')}</button>${link('player',t('Explore the player offer ↗','查看播放器推广 ↗'))}</div><p class="br-event-video-credit">Sintel © 2010 Blender Foundation · <a href="https://durian.blender.org/about/" target="_blank" rel="noopener">${t('Film & source','影片与来源')}</a> · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a><br>${t('Official 52-second trailer, resized/re-encoded. Exercise sponsor; no filmmaker endorsement.','官方 52 秒预告片，经缩放及重新编码。推广为练习内容，创作者未作背书。')}</p></div></div><footer class="br-event-video-foot"><span>${t('Advertisement · sound off by default','广告 · 默认静音')}</span><button type="button" data-event-return>${t('Back to page position ↑','返回原位置 ↑')}</button></footer>`;
      slot.append(card);attachSlot();
      video=card.querySelector('video');video.muted=true;wantsPlayback=true;
      mediaListeners=new AbortController();const listen=(type,callback)=>video.addEventListener(type,callback,{signal:mediaListeners.signal});
      card.querySelector('[data-event-play]').addEventListener('click',()=>{
        if(!video||paused)return;
        if(video.paused){if(video.ended)video.currentTime=0;wantsPlayback=true;playVideo();}else{wantsPlayback=false;stopVideo();}
      });
      listen('pause',()=>{
        const control=card?.querySelector('[data-event-play]');if(control)control.textContent=t('Play preview','播放预览');
        if(internalPause){internalPause=false;return;}
        if(!paused&&!reparenting&&!document.hidden)wantsPlayback=false;
      });
      listen('play',()=>{
        if(paused||!focused()){stopVideo();return;}
        wantsPlayback=true;delete card.dataset.autoplay;
        card.querySelector('[data-event-play]').textContent=t('Pause preview','暂停预览');
      });
      listen('ended',()=>{wantsPlayback=false;const control=card?.querySelector('[data-event-play]');if(control)control.textContent=t('Play preview','播放预览');});
      listen('error',()=>{if(card){card.dataset.mediaError='true';card.querySelector('.br-event-video-copy>p').textContent=t('Preview unavailable. You can still explore the film offer.','预览暂不可用，仍可查看影片推广。');}});
      card.querySelector('[data-event-return]').addEventListener('click',returnInline);
      card.querySelector('[data-event-close]').addEventListener('click',dismiss);
      if('IntersectionObserver' in window){observer=new IntersectionObserver(schedule,{threshold:[0,.2,.7]});observer.observe(slot);}
      dock();playVideo();
      return true;
    };
    const cat=`<svg viewBox="0 0 180 140" aria-hidden="true"><path class="br-mascot-tail" d="M134 105c40 4 39-39 24-44" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round"/><ellipse cx="87" cy="105" rx="55" ry="24" fill="currentColor"/><path d="m37 73 1-48 29 17c18-5 30-5 44 0l28-17 2 48c0 28-25 41-51 41S38 101 37 73" fill="currentColor"/><path d="m46 41 16 9-15 8m68-8 15-9-1 17" fill="#e6ad94"/><path d="m60 73 12 1m37 0 12-1" stroke="#292e29" stroke-width="5" stroke-linecap="round"/><path d="m85 85 6 5 6-5m-6 5v7m0 0-10-3m10 3 10-3" fill="none" stroke="#534030" stroke-width="2.7" stroke-linecap="round"/><path d="m28 82 26 4m-25 10 25-4m73-6 25-4m-25 10 25 4" stroke="#534030" stroke-width="2"/><ellipse cx="61" cy="118" rx="16" ry="8" fill="#d2a15e"/><ellipse cx="114" cy="118" rx="16" ry="8" fill="#d2a15e"/></svg>`;
    const robot=`<svg viewBox="0 0 180 140" aria-hidden="true"><path d="M90 31V16" stroke="#496775" stroke-width="5"/><circle cx="90" cy="14" r="7" fill="#e29156"/><rect x="35" y="31" width="108" height="76" rx="17" fill="currentColor"/><rect x="45" y="42" width="88" height="48" rx="10" fill="#213e4a"/><circle cx="68" cy="64" r="8" fill="#e5f27f"/><circle cx="109" cy="64" r="8" fill="#e5f27f"/><path d="M72 84h35" stroke="#e5f27f" stroke-width="3" stroke-linecap="round"/><path class="br-mascot-arm" d="m143 76 18 11-7 15" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="m36 76-14 16m40 15-4 18m63-18 4 18" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><rect x="72" y="104" width="34" height="19" rx="5" fill="#658a95"/></svg>`;
    const profiles={
      wallpapers:['cat','This corner is mine.','这个角落归我了。','I brought another view. And one very small offer.','我带来了另一种风景，还有一条小小的推广。'],
      recipes:['cat','Psst. A little treat?','嘘，要不要一点小奖励？','I came for lunch. Somehow I found a voucher.','我是来找午餐的，不知怎么却找到一张优惠券。'],
      tools:['robot','One tiny detour.','绕一小段路。','Pixels under control. One optional offer on the side.','像素有序，旁边还多了一条可选推广。'],
      movies:['robot','A very short intermission.','非常短的中场休息。','The film can wait. This offer insists it cannot.','电影可以等，这条推广却说它不能等。'],
      events:['cat','Packed a little extra.','多带了一点东西。','A weekend plan, a spare umbrella, and this offer.','周末计划、备用雨伞，还有这条推广。'],
      books:['cat','I saved you a spot.','给你留了个位置。','A quiet reading corner. Plus a small sponsored detour.','安静的阅读角落，外加一次小小的赞助绕路。'],
      museum:['robot','An unexpected exhibit.','一件意外展品。','The artwork is in the collection. This offer is extra.','作品在藏品库中，这条推广属于额外内容。'],
      nature:['cat','Not in your field guide.','图鉴里找不到我。','I brought a small offer from outside the catalogue.','我从目录外带来了一条小推广。'],
      travel:['robot','A short detour?','要不要绕一点路？','Your route stays here. My offer goes somewhere else.','你的路线还在这里，我的推广会去另一个地方。'],
      market:['robot','Checking the accessories…','正在检查配件……','Camera, lens, strap. And an unsolicited offer.','机身、镜头、背带，还有一条主动送来的推广。']
    };
    const showCharacter=()=>{
      const profile=profiles[scene]||profiles.tools;
      const offer=C.adOffer?.(sponsor)||{};
      card=document.createElement('section');card.className='br-event-widget br-event-media br-event-character';
      card.dataset.eventKind='character';card.dataset.mascot=profile[0];
      card.setAttribute('aria-label',t('Sponsored mascot offer','赞助角色推广'));
      card.innerHTML=header(offer.brand||'Perk Basket',t('A small visitor','一位小访客'))+`<div class="br-event-media-body"><div class="br-event-mascot-scene"><a class="br-event-mascot-art" href="${esc(adURL(sponsor))}" data-br-event-link="${sponsor}" target="_blank" rel="noopener" aria-label="${t('See what I found','看看我找到了什么')}">${profile[0]==='cat'?cat:robot}</a><a class="br-event-mascot-coupon" href="${esc(adURL(sponsor))}" data-br-event-link="${sponsor}" target="_blank" rel="noopener"><small>${t('A LITTLE EXTRA','额外一点惊喜')}</small><b>${sponsor==='coupon'?'PERKS':sponsor==='stock'?'PICTURE THIS':'FOR YOU'}</b><i aria-hidden="true">✦</i></a></div><h2>${esc(t(profile[1],profile[2]))}</h2><p>${esc(t(profile[3],profile[4]))}</p>${link(sponsor,t('Follow the little detour ↗','看看这条小岔路 ↗'),'br-event-mascot-cta')}<small class="br-event-mascot-note">${t('Advertisement · your page stays here','广告 · 原页面会留在这里')}</small></div>`;
      host.append(card);card.querySelector('[data-event-close]').addEventListener('click',dismiss);position();
      return true;
    };
    const pause=value=>{
      paused=!!value;
      if(card)card.dataset.paused=String(paused);
      if(paused)stopVideo();else{dock();playVideo();}
    };
    const reconcile=()=>{
      if(destroyed||!kind||!card)return;
      if(kind==='video'){
        attachSlot();
        if(card.dataset.floating!=='true'&&!card.isConnected)slot.append(card);
        dock();
      }
      position();
    };
    const onVisibility=()=>{if(document.hidden)stopVideo();else if(!paused)playVideo();};
    const onBlur=()=>stopVideo();
    const onFocus=()=>{if(!paused)playVideo();};
    const onPageHide=()=>pause(true);
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
    window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);
    document.addEventListener('visibilitychange',onVisibility);window.addEventListener('blur',onBlur);window.addEventListener('focus',onFocus);window.addEventListener('pagehide',onPageHide);
    return {
      show(type){
        if(destroyed||kind||!['video','character'].includes(type))return false;
        kind=type;
        const result=type==='video'?showVideo():showCharacter();
        if(card)card.dataset.paused=String(paused);
        return result;
      },
      pause,clear,reconcile,
      destroy(){
        if(destroyed)return;clear();destroyed=true;
        window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
        window.visualViewport?.removeEventListener('resize',schedule);window.visualViewport?.removeEventListener('scroll',schedule);
        document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('blur',onBlur);window.removeEventListener('focus',onFocus);window.removeEventListener('pagehide',onPageHide);
      }
    };
  };
})();
