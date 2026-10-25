/* A delayed, once-per-website sponsored slot. Links remain ordinary native links. */
(() => {
  'use strict';
  window.BROWSE_LAYOUT_EVENT = C => {
    const {root,scene,seed,t,esc,read,write,adURL,adOffer,campaignSite,wireAds,stack}=C;
    if(!root||!scene)return null;
    const KEY='layout-v1:'+scene;
    const hash=salt=>{let h=2166136261;for(const c of seed+':'+scene+':'+salt)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
    const eligible=hash('eligible')/4294967296<.6,delay=8000+hash('delay')%4001;
    const sites=['corn','desk','stock','game','security','player','software','prize','coupon','parcel'];
    const site=sites.includes(campaignSite)?campaignSite:'stock';
    const defaults=()=>({version:1,elapsedMs:0,activated:false,dismissed:false});
    const normalize=raw=>{
      const value=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
      return {version:1,elapsedMs:Number.isFinite(value.elapsedMs)?Math.max(0,Math.min(12000,value.elapsedMs)):0,activated:value.activated===true,dismissed:value.dismissed===true};
    };
    const load=fallback=>normalize(read(KEY,fallback||defaults()));
    let state=load(),current=stack?.snapshot?.()||{},node=null,suspended=false,destroyed=false,restoring=false;
    let lastClock=null,wasLive=false,savedElapsed=state.elapsedMs,pointerHeld=false,frame=0,anchorFrame=0,generation=0,anchorRestore=null;
    const announce=(action,height=0)=>window.dispatchEvent(new CustomEvent('browse:review',{detail:{type:'layout',action,site,height:Math.round(Math.max(0,Math.min(1000,height)))}}));
    const writeState=()=>{if(!suspended&&!destroyed){write(KEY,state);savedElapsed=state.elapsedMs;}};
    const quiet=()=>Number.isFinite(current.quietUntil)&&Number.isFinite(current.activeMs)&&current.quietUntil>current.activeMs;
    const canAdvance=()=>!destroyed&&!suspended&&!restoring&&current.active===true&&!current.modalOpen&&!current.suspended&&!current.restoring&&!quiet();
    // Prefer the catalogue's outer boundary; never insert commercial markup in a
    // form, list, table row, or one of the existing sponsored components.
    const targets={
      wallpapers:['.swb-browse .swb-grid','.swb-detail-grid','.swb-story'],
      recipes:['.pp-grid','.pp-detail-layout','.pp-detail-heading'],
      tools:['.pp-editor-grid','.pp-drop','.pp-tool-heading'],
      movies:['.fm-grid','.fm-video-section','.fm-synopsis','.fm-film-hero'],
      events:['.ot-grid','.ot-practical','.ot-detail header'],
      books:['.folio-rows','.reader-text','.cu-detail-intro'],
      museum:['.oc-grid','.cu-detail-intro','.oc-comparison'],
      nature:['.jg-bird-grid','.jg-detail-heading','.jg-notebook'],
      travel:['.jt-route-cards','.jt-legs','.jt-planner-layout','.jt-station-layout'],
      market:['.lp-catalogue .lp-grid','.lp-detail','.lp-comparison']
    };
    const safe=target=>target?.isConnected&&root.contains(target)&&target.parentElement&&target.getBoundingClientRect().width>120&&target.getBoundingClientRect().height>0&&!target.closest('form,table,ul,ol,[data-br-layout],[data-context-ad],.br-pressure-inline-group,.br-inline-ad')&&!['TABLE','TBODY','THEAD','TFOOT','TR','UL','OL','SELECT','PICTURE'].includes(target.parentElement.tagName);
    const visible=target=>{const r=target.getBoundingClientRect(),top=window.visualViewport?.offsetTop||0,height=window.visualViewport?.height||innerHeight;return r.width>120&&r.height>0&&r.top>=top+44&&r.top<=top+height*.8;};
    const targetFor=first=>{
      for(const selector of [...(targets[scene]||[]),'main h2','main h1'])for(const target of root.querySelectorAll(selector))if(safe(target)&&(!first||visible(target)))return target;
      return null;
    };
    const make=()=>{
      const offer=adOffer?.(site)||{brand:'Framekind',title:t('Make room for your next idea.','为下一个灵感，留点空间。'),cta:t('Explore the collection','浏览精选内容')};
      const strap={stock:t('PHOTOGRAPHS & COLLECTIONS','照片与图库精选'),desk:t('WORKSPACE / FROM RM39','桌面配件 / RM39 起'),coupon:t('MEMBER OFFERS','会员优惠'),prize:t('VISITOR REWARDS','访客奖励'),software:t('FILE UTILITIES','文件工具'),player:t('PLAYBACK ESSENTIALS','播放工具'),corn:t('VIDEOS & CHANNELS','视频与频道'),game:t('PLAY IN YOUR BROWSER','浏览器即开即玩'),security:t('DEVICE PROTECTION','设备防护'),parcel:t('DELIVERY SERVICES','包裹派送服务')}[site];
      const aside=document.createElement('aside');aside.className='br-layout-ad br-layout-'+scene+' br-layout-site-'+site;
      aside.dataset.brLayout='true';aside.setAttribute('aria-label',t('Advertisement','广告'));
      aside.innerHTML=`<div class="br-layout-meta"><span>${t('ADVERTISEMENT','广告')} · ${esc(offer.brand)}</span><button type="button" data-layout-close aria-label="${t('Close this advertisement','关闭这条广告')}">×</button></div><div class="br-layout-body"><div class="br-layout-brand" aria-hidden="true"><b>${esc(offer.brand)}</b><span>${esc(strap)}</span></div><div class="br-layout-copy"><small>${t('A sponsored collection','赞助精选')}</small><strong>${esc(offer.title)}</strong></div><a class="br-layout-link" data-br-ad="${site}" href="${esc(adURL(site))}" target="_blank" rel="noopener">${esc(offer.cta)} <span aria-hidden="true">↗</span></a></div>`;
      aside.querySelector('[data-layout-close]').addEventListener('click',()=>{
        if(suspended||destroyed)return;
        // A different native document may have changed the record while cached.
        const fresh=load(state);state={...fresh,activated:true,dismissed:true,elapsedMs:Math.max(fresh.elapsedMs,state.elapsedMs)};writeState();
        const height=aside.getBoundingClientRect().height;aside.remove();if(node===aside)node=null;
        announce('dismissed',height);window.dispatchEvent(new CustomEvent('browse:ad-dismiss',{detail:{site}}));
      });
      wireAds?.(aside);return aside;
    };
    const finishAnchor=()=>{cancelAnimationFrame(anchorFrame);anchorFrame=0;if(anchorRestore){anchorRestore();anchorRestore=null;}};
    const insert=(target,first)=>{
      const aside=make(),x=scrollX,y=scrollY;
      if(first){
        finishAnchor();const html=document.documentElement,old=html.style.overflowAnchor;
        html.style.overflowAnchor='none';anchorRestore=()=>{html.style.overflowAnchor=old;};
      }
      target.insertAdjacentElement('beforebegin',aside);node=aside;apply();
      if(first){
        // Keep the viewport at the same document offset so late inventory really
        // moves content, rather than being silently corrected by scroll anchoring.
        if(scrollX!==x||scrollY!==y)scrollTo(x,y);
        const run=generation;anchorFrame=requestAnimationFrame(()=>{if(run!==generation||suspended){finishAnchor();return;}if(scrollX!==x||scrollY!==y)scrollTo(x,y);anchorFrame=requestAnimationFrame(finishAnchor);});
        state={...load(state),activated:true,dismissed:false,elapsedMs:Math.max(state.elapsedMs,delay)};writeState();
        announce('inserted',aside.getBoundingClientRect().height);
      }
    };
    const apply=()=>{
      if(!node)return;
      node.dataset.suppressed=String(suspended||restoring||current.suspended||current.restoring||quiet());
      node.inert=Boolean(current.modalOpen||suspended||restoring||current.suspended||current.restoring||quiet());
    };
    const reconcile=()=>{
      if(destroyed||suspended||restoring)return;
      if(node&&!node.isConnected)node=null;
      if(state.dismissed){node?.remove();node=null;return;}
      if(node){apply();return;}
      if(state.activated){const target=targetFor(false);if(target)insert(target,false);return;}
      if(!eligible||state.elapsedMs<delay||!canAdvance()||pointerHeld)return;
      const target=targetFor(true);if(target)insert(target,true);
    };
    function update(snapshot={}){
      if(destroyed)return;
      if(snapshot&&typeof snapshot==='object')current=snapshot;
      const clock=Number.isFinite(current.activeMs)?Math.max(0,current.activeMs):null,live=canAdvance();
      if(!suspended&&!restoring&&live&&wasLive&&clock!==null&&lastClock!==null&&!state.activated&&!state.dismissed&&eligible){
        state.elapsedMs=Math.min(12000,state.elapsedMs+Math.max(0,Math.min(1000,clock-lastClock)));
        if(state.elapsedMs-savedElapsed>=1000)writeState();
      }
      lastClock=clock;wasLive=live;apply();reconcile();
    }
    const onScroll=()=>{if(!suspended&&!destroyed&&!frame){const run=generation;frame=requestAnimationFrame(()=>{frame=0;if(run===generation)reconcile();});}};
    const onDown=()=>{pointerHeld=true;};
    const onUp=()=>{pointerHeld=false;onScroll();};
    const onHide=()=>{
      if(!suspended&&!destroyed)writeState();suspended=true;restoring=false;wasLive=false;lastClock=null;generation++;
      cancelAnimationFrame(frame);frame=0;finishAnchor();apply();
    };
    const onShow=event=>{
      if(!event.persisted){if(!destroyed){suspended=false;lastClock=null;wasLive=false;}return;}
      if(destroyed)return;suspended=true;restoring=true;generation++;cancelAnimationFrame(frame);finishAnchor();apply();
      const run=generation;frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
        frame=0;if(run!==generation||destroyed)return;
        state=load(state);savedElapsed=state.elapsedMs;node?.remove();node=null;pointerHeld=false;
        suspended=false;restoring=false;lastClock=null;wasLive=false;update(stack?.snapshot?.()||current);
      });});
    };
    const onQuiet=()=>{current=stack?.snapshot?.()||current;apply();};
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    document.addEventListener('pointerdown',onDown,true);window.addEventListener('pointerup',onUp,true);window.addEventListener('pointercancel',onUp,true);window.addEventListener('blur',onUp);
    window.addEventListener('pagehide',onHide);window.addEventListener('pageshow',onShow);window.addEventListener('browse:quiet',onQuiet);
    reconcile();
    return {update,reconcile,destroy(){
      if(destroyed)return;if(!suspended)writeState();destroyed=true;suspended=true;generation++;cancelAnimationFrame(frame);finishAnchor();node?.remove();node=null;
      window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);
      document.removeEventListener('pointerdown',onDown,true);window.removeEventListener('pointerup',onUp,true);window.removeEventListener('pointercancel',onUp,true);window.removeEventListener('blur',onUp);
      window.removeEventListener('pagehide',onHide);window.removeEventListener('pageshow',onShow);window.removeEventListener('browse:quiet',onQuiet);
    }};
  };
})();
