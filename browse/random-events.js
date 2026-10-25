/* Three locally selected events per seed. No input contents or file pixels stored. */
(() => {
  'use strict';
  window.BROWSE_EVENTS=C=>{
    const {root,seed,scene,t,esc,read,write,stack}=C;
    if(!root||!stack?.snapshot)return null;
    const TYPES=['chat','tab','video','search','escalation','character','quiet','reward'],KEY='events-v1';
    const hash=salt=>{let n=2166136261;for(const char of seed+salt)n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0;};
    // These two scenes use file controls / station selects rather than text search.
    const eligible=TYPES.filter(kind=>kind!=='search'||!['tools','travel'].includes(scene));
    const selected=eligible.map(kind=>({kind,n:hash('event-plan:'+kind)})).sort((a,b)=>a.n-b.n).slice(0,3).map(item=>item.kind);
    const host=document.body.appendChild(Object.assign(document.createElement('div'),{id:'br-event-root'}));
    host.dataset.eventPlan=selected.join(',');host.dataset.eventScene=scene;
    let suspended=false,destroyed=false,restoring=false,generation=0,frame=0,clearing=false,cancelAfterRestore=false;
    let current=stack.snapshot(),activeKind=null,focusBefore=null,lastGestureAt=0,search=null,reward=null,processing=false;
    const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const bounded=(value,max=9999)=>Number.isInteger(value)?Math.max(0,Math.min(max,value)):0;
    const load=()=>{
      const value=object(read(KEY,{}));
      return {version:1,seen:[...new Set((Array.isArray(value.seen)?value.seen:[]).filter(x=>TYPES.includes(x)))],visits:bounded(value.visits),details:bounded(value.details),declines:bounded(value.declines),activity:bounded(value.activity),lastAt:Number.isFinite(value.lastAt)?Math.max(0,Math.min(current.activeMs,value.lastAt)):0,comeback:value.comeback===true};
    };
    let state=load();
    const save=()=>{if(!suspended&&!destroyed)write(KEY,state);};
    const visit=()=>{state=load();state.visits=Math.min(9999,state.visits+1);if(C.params.has('id')||['read','route','station'].includes(C.params.get('view')))state.details=Math.min(9999,state.details+1);if(cancelAfterRestore){state.comeback=false;cancelAfterRestore=false;}save();};
    visit();
    const restoreFocus=()=>{if(focusBefore?.isConnected&&!root.inert&&!focusBefore.disabled)focusBefore.focus({preventScroll:true});focusBefore=null;};
    let providers=[];
    const clear=(focus=true)=>{
      if(clearing)return;clearing=true;
      const owned=!!document.activeElement?.closest?.('.br-event-widget');
      for(const provider of providers)provider?.clear?.();
      host.querySelector('.br-event-comeback')?.remove();activeKind=null;
      if(focus&&owned)restoreFocus();clearing=false;
    };
    const finish=kind=>{
      if(clearing||suspended||destroyed)return;
      if(kind===activeKind){activeKind=null;state.lastAt=current.activeMs;save();restoreFocus();}
    };
    const shared={...C,host,finish};
    const social=window.BROWSE_EVENT_SOCIAL?.(shared),media=window.BROWSE_EVENT_MEDIA?.(shared),actions=window.BROWSE_EVENT_ACTIONS?.(shared);
    providers=[social,media,actions];
    const providerFor=kind=>['chat','tab','escalation'].includes(kind)?social:['video','character'].includes(kind)?media:actions;
    const suppressed=()=>suspended||restoring||current.suspended||current.modalOpen||current.quietUntil>current.activeMs;
    const allowed=kind=>!destroyed&&!suspended&&!restoring&&selected.includes(kind)&&!state.seen.includes(kind);
    const remember=kind=>{if(!state.seen.includes(kind))state.seen.push(kind);state.lastAt=current.activeMs;save();};
    const comeback=()=>{
      if(!state.comeback||activeKind||suppressed()||!current.active)return;
      state.comeback=false;activeKind='quiet';save();
      const node=document.createElement('aside');node.className='br-event-widget br-event-comeback';node.dataset.eventKind='quiet';
      node.setAttribute('aria-label',t('Sponsored return message','赞助回归消息'));
      node.innerHTML=`<header><span>${t('Sponsored · Perk Basket','赞助 · Perk Basket')}</span><button type="button" data-event-close aria-label="${t('Close advertisement','关闭广告')}">×</button></header><div><strong>${t('Enjoyed the break?','刚才清静了一会儿？')}</strong><p>${t('We’re back. One little offer before you carry on.','我们回来啦。继续之前，再看一条小优惠。')}</p><a href="${esc(C.adURL('coupon'))}" target="_blank" rel="noopener" data-br-event-link="coupon">${t('See this offer','查看这项优惠')} ↗</a></div>`;
      node.querySelector('button').addEventListener('click',()=>{node.remove();finish('quiet');});host.append(node);
    };
    const start=(kind,payload={})=>{
      if(!allowed(kind)||activeKind)return false;
      if(kind!=='tab'&&(suppressed()||!current.active))return false;
      focusBefore=root.contains(document.activeElement)?document.activeElement:null;
      activeKind=kind;
      if(kind==='quiet'){
        remember(kind);state.comeback=true;save();activeKind=null;
        stack.quiet(3000+hash('quiet-length')%2001);return true;
      }
      const displayed=providerFor(kind)?.show?.(kind,payload)===true;
      if(displayed){remember(kind);update(current);return true;}
      activeKind=null;return false;
    };
    function update(snapshot){
      if(destroyed)return;
      if(snapshot&&Number.isFinite(snapshot.activeMs))current=snapshot;
      const hide=suppressed(),pause=hide||!current.active;
      host.hidden=hide;host.inert=hide;
      document.body.classList.toggle('br-events-suppressed',hide);
      document.body.classList.toggle('br-events-paused',pause);
      for(const widget of root.querySelectorAll('.br-event-widget'))widget.inert=hide;
      const blocked=!!document.querySelector('.br-event-widget.br-event-blocked');
      for(const provider of providers)provider?.pause?.(pause||(provider===media&&blocked));
    }
    const activity=()=>{if(suspended||destroyed)return;state.activity=Math.min(9999,state.activity+1);save();};
    const plain=event=>event.button===0&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey;
    const onClick=event=>{
      if(suspended||destroyed)return;
      if(root.contains(event.target))activity();
      const anchor=event.target.closest?.('a[data-br-ad],a[data-br-event-link]');
      if(anchor&&plain(event))lastGestureAt=performance.now();
    };
    const titleOnDeparture=()=>{
      // A blocked popup leaves focus in the document, so it never earns a title notification.
      queueMicrotask(()=>{if(!suspended&&!destroyed&&performance.now()-lastGestureAt<1800&&lastGestureAt>0&&(!document.hasFocus()||document.hidden)&&!activeKind)start('tab');});
    };
    const openEvent=event=>{
      const anchor=event.target.closest?.('a[data-br-event-link]');if(!anchor||!plain(event)||suspended||destroyed)return;
      event.preventDefault();const child=window.open(anchor.href,'_blank');
      if(child){try{child.opener=null;}catch{}clear(false);titleOnDeparture();}
      else{
        const widget=anchor.closest('.br-event-widget');if(!widget||widget.querySelector('.br-event-fallback'))return;
        widget.classList.add('br-event-blocked');
        const notice=document.createElement('p');notice.className='br-event-fallback';notice.append(document.createTextNode(t('Your browser kept this tab here. ','浏览器保留了当前标签。')));
        const fallback=document.createElement('a');fallback.href=anchor.href;fallback.target='_blank';fallback.rel='noopener';fallback.textContent=t('Open the advertiser page ↗','打开广告页面 ↗');notice.append(fallback);(widget.querySelector('.br-event-action-scroll,.br-social-content,.br-event-media-body')||widget).append(notice);
        media?.pause?.(true);
      }
    };
    const onInput=event=>{
      const input=event.target;
      if(!root.contains(input)||!input.matches?.('input[name="q"],input[type="search"]')||input.type==='password')return;
      activity();search={input,at:current.activeMs+450};
    };
    const onComplete=event=>{
      if(suspended||destroyed)return;
      const label=typeof event.detail==='string'?event.detail.trim().slice(0,160):'';
      if(!label||/^(Removed |移除|已移除)/.test(label))return;
      activity();reward={label};
    };
    const onDismiss=()=>{if(suspended||destroyed)return;state.declines=Math.min(9999,state.declines+1);save();};
    const onQuiet=event=>{clear();search=null;reward=null;if(event.detail?.reason!=='event'){if(suspended||restoring)cancelAfterRestore=true;else{state.comeback=false;save();}}update(stack.snapshot());};
    const tick=()=>{
      update(stack.snapshot());if(suspended||destroyed||suppressed()||!current.active||processing)return;
      if(activeKind&&!document.querySelector('.br-event-widget')&&activeKind!=='tab')activeKind=null;
      comeback();if(activeKind||current.activeMs-state.lastAt<6500)return;
      processing=true;
      try{
        if(reward&&allowed('reward')){if(start('reward',reward))reward=null;return;}
        if(search&&allowed('search')&&current.activeMs>=search.at&&search.input.isConnected&&document.activeElement===search.input&&search.input.value.trim().length>=2){if(start('search',{input:search.input,term:search.input.value.trim().slice(0,80)}))search=null;return;}
        if(state.declines>=2&&allowed('escalation')){start('escalation',{declines:state.declines});return;}
        if((state.details>=2||state.visits>=3||state.activity>=6)&&state.activity>=3&&allowed('chat')){start('chat');return;}
        if(state.activity>=1&&current.activeMs>=8500&&allowed('video')){start('video');return;}
        if(current.activeMs>=11000&&(scrollY>120||state.activity>=2)&&allowed('character')){start('character');return;}
        if(current.activeMs>=24000&&state.activity>=3&&allowed('quiet'))start('quiet');
      }finally{processing=false;}
    };
    const onHide=()=>{
      suspended=true;restoring=false;generation++;cancelAnimationFrame(frame);clear(false);search=null;reward=null;
      update(stack.snapshot());
    };
    const onShow=event=>{
      if(!event.persisted){suspended=false;update(stack.snapshot());return;}
      suspended=true;restoring=true;clear(false);update(stack.snapshot());
      cancelAnimationFrame(frame);const restore=++generation;
      frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
        if(restore!==generation||destroyed)return;
        current=stack.snapshot();suspended=false;restoring=false;visit();update(current);
      });});
    };
    const reconcile=()=>{if(!suspended&&!destroyed)for(const provider of providers)provider?.reconcile?.();};
    const observer=new MutationObserver(reconcile);observer.observe(root,{childList:true,subtree:true});
    document.addEventListener('click',onClick,true);document.addEventListener('click',openEvent);
    root.addEventListener('input',onInput);window.addEventListener('browse:complete',onComplete);
    window.addEventListener('browse:ad-dismiss',onDismiss);window.addEventListener('browse:quiet',onQuiet);
    window.addEventListener('blur',titleOnDeparture);document.addEventListener('visibilitychange',titleOnDeparture);
    window.addEventListener('pagehide',onHide);window.addEventListener('pageshow',onShow);
    const interval=setInterval(tick,250);update(current);
    return {update,reconcile,destroy(){
      if(destroyed)return;suspended=true;clear(false);destroyed=true;generation++;cancelAnimationFrame(frame);clearInterval(interval);observer.disconnect();
      for(const provider of providers)provider?.destroy?.();host.remove();
      document.body.classList.remove('br-events-suppressed','br-events-paused');
      document.removeEventListener('click',onClick,true);document.removeEventListener('click',openEvent);root.removeEventListener('input',onInput);
      window.removeEventListener('browse:complete',onComplete);window.removeEventListener('browse:ad-dismiss',onDismiss);window.removeEventListener('browse:quiet',onQuiet);
      window.removeEventListener('blur',titleOnDeparture);document.removeEventListener('visibilitychange',titleOnDeparture);window.removeEventListener('pagehide',onHide);window.removeEventListener('pageshow',onShow);
    }};
  };
})();
