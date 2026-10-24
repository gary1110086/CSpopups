/* Foreground-only overlapping advertisements. Native scene work stays in its document. */
(() => {
  'use strict';
  window.BROWSE_AD_STACK = C => {
    const {root,seed,t,esc,read,write,ads,adVisual,adDescription,adURL,wireAds,deck,chosen}=C;
    const KEY='br-run-v3:'+seed, MISSING=Symbol('missing'), MAX=30;
    const GAPS=[2200,2800,2500,3200,2300,3000];
    const FORMATS=['bounce','tiny','dodge','drawer','panel','newsletter'];
    const validSites=Object.keys(ads), modal=p=>p.format==='panel'||p.format==='newsletter';
    const readRun=key=>{
      try {const raw=sessionStorage.getItem(key);if(raw===null)return MISSING;try{return JSON.parse(raw);}catch{return {};}}
      catch {return C.rawRead(key,{});}
    };
    const normalize=raw=>{
      const obj=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
      const activeMs=Number.isFinite(obj.activeMs)?Math.max(0,Math.min(14400000,obj.activeMs)):0;
      const pending=[],ids=new Set();let hasModal=false;
      for(const p of Array.isArray(obj.pending)?obj.pending:[]){
        if(!p||!Number.isInteger(p.id)||p.id<1||p.id>MAX||ids.has(p.id)||!validSites.includes(p.site)||!FORMATS.includes(p.format))continue;
        if(modal(p)&&hasModal)continue;
        pending.push({id:p.id,site:p.site,format:p.format});ids.add(p.id);if(modal(p))hasModal=true;
        if(pending.length===4)break;
      }
      const shown=Math.max(Number.isInteger(obj.shown)?Math.max(0,Math.min(MAX,obj.shown)):0,...pending.map(p=>p.id));
      const quietUntil=Number.isFinite(obj.quietUntil)&&obj.quietUntil>=0&&obj.quietUntil<=activeMs+5000?obj.quietUntil:0;
      const nextAt=shown>=MAX?null:Math.max(quietUntil,Number.isFinite(obj.nextAt)&&obj.nextAt>=0&&obj.nextAt<=activeMs+5000?obj.nextAt:activeMs+(shown?2500:3000));
      return {pacingVersion:3,activeMs,shown,nextAt,quietUntil,pending};
    };
    const stored=readRun(KEY);
    let initial=stored;
    if(stored===MISSING){
      let legacy=readRun('br-run-v2:'+seed);if(legacy===MISSING)legacy=readRun('br-run-v1:'+seed);
      const old=legacy&&typeof legacy==='object'&&!Array.isArray(legacy)?legacy:{};
      const shown=Number.isInteger(old.shown)?Math.max(0,Math.min(MAX,old.shown)):0;
      initial={activeMs:old.activeMs,shown,pending:old.pending&&typeof old.pending==='object'&&!Array.isArray(old.pending)?[{...old.pending,id:Math.max(1,shown)}]:[]};
    }
    const state=normalize(initial),entries=new Map();
    const overlayRoot=document.getElementById('interrupt-root')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'interrupt-root'}));
    let suspended=false,last=performance.now(),lastOutsideFocus=null,modalId=null;
    const save=()=>C.rawWrite(KEY,state);
    const limit=()=>matchMedia('(max-width: 640px)').matches?2:4;
    const pressure=window.BROWSE_AD_PRESSURE({root,lang:C.lang,t,esc,adURL,read,write});
    const foreground=()=>!suspended&&!document.hidden&&document.hasFocus();
    const pressureUpdate=()=>pressure.update({activeMs:state.activeMs,quietUntil:state.quietUntil,active:foreground(),modalOpen:modalId!==null});
    const stopEntry=entry=>{entry.motion?.stop();entry.motion=null;};
    const removeEntry=id=>{const entry=entries.get(id);if(!entry)return;stopEntry(entry);entry.stage.remove();entries.delete(id);};
    const stopAll=()=>{for(const entry of entries.values())stopEntry(entry);};
    const rememberFocus=()=>{const el=document.activeElement;if(el&&el!==document.body&&root.contains(el))lastOutsideFocus=el;};
    const returnFocus=()=>{if(lastOutsideFocus?.isConnected&&!lastOutsideFocus.inert)lastOutsideFocus.focus({preventScroll:true});};
    const viewport=()=>({left:visualViewport?.offsetLeft||0,top:visualViewport?.offsetTop||0,width:visualViewport?.width||innerWidth,height:visualViewport?.height||innerHeight});
    const positionEntry=entry=>{
      const v=viewport();entry.card.style.setProperty('--br-motion-view-width',v.width+'px');entry.card.style.setProperty('--br-motion-view-height',v.height+'px');
      if(modal(entry.p)){
        Object.assign(entry.stage.style,{left:v.left+'px',top:v.top+'px',width:v.width+'px',height:v.height+'px'});return;
      }
      if(entry.moving)return;
      const rect=entry.card.getBoundingClientRect(),slots=[[.04,.10],[.96,.16],[.07,.94],[.9,.88]],slot=slots[(entry.p.id-1)%4];
      entry.card.style.left=(v.left+4+Math.max(0,v.width-rect.width-8)*slot[0])+'px';
      entry.card.style.top=(v.top+4+Math.max(0,v.height-rect.height-8)*slot[1])+'px';
    };
    const applyModal=()=>{
      const current=state.pending.find(modal);modalId=current?.id??null;
      root.inert=modalId!==null;
      const taskShell=document.querySelector('.br-task-shell');if(taskShell)taskShell.inert=modalId!==null;
      for(const entry of entries.values()){
        const blocked=modalId!==null&&entry.p.id!==modalId;
        entry.stage.inert=blocked;
        const paused=blocked||entry.blockedLink;
        if(entry.paused!==paused){entry.paused=paused;if(paused)entry.motion?.pause();else entry.motion?.resume();}
      }
      pressureUpdate();
    };
    const trimToViewport=()=>{
      const count=limit();if(state.pending.length<=count)return;
      const current=state.pending.find(modal),others=state.pending.filter(p=>!modal(p));
      const keep=new Set([...(current?[current]:[]),...others.slice(-(count-(current?1:0)))].map(p=>p.id));
      state.pending=state.pending.filter(p=>keep.has(p.id));
      if(state.shown<MAX)state.nextAt=Math.max(state.nextAt??0,state.activeMs+800,state.quietUntil);
    };
    const closeOne=id=>{
      const entry=entries.get(id),ownedFocus=entry?.card.contains(document.activeElement);
      state.pending=state.pending.filter(p=>p.id!==id);
      if(state.shown<MAX)state.nextAt=Math.max(state.nextAt??0,state.activeMs+800,state.quietUntil);
      else state.nextAt=null;
      removeEntry(id);save();sync();
      if(ownedFocus&&modalId===null)returnFocus();
    };
    const closeAll=()=>{
      const ownedFocus=overlayRoot.contains(document.activeElement);
      for(const id of [...entries.keys()])removeEntry(id);
      state.pending=[];state.quietUntil=state.activeMs+5000;state.nextAt=state.shown<MAX?state.quietUntil:null;
      save();applyModal();if(ownedFocus)returnFocus();
    };
    const taunts={bounce:[['Another little detour.','又来一小段绕路。'],['Yes, I am still here.','没错，我还在这里。'],['Your attention looks busy.','你的注意力好像很忙。'],['Room for one more offer?','还能再放一条优惠吗？']],dodge:[['Nearly! Try the other corner.','差一点！换个角落试试。'],['Oops. New address.','哎呀，我搬家啦。'],['You close. I relocate.','你要关，我就搬。'],['Still following me?','还在追我吗？']]};
    const createEntry=p=>{
      rememberFocus();
      const a=ads[p.site],isModal=modal(p),moving=p.format==='bounce'||p.format==='dodge';
      const stage=document.createElement('div');stage.className='br-interrupt '+(isModal?'br-ad-backdrop br-stack-modal-stage':'br-motion-stage br-stack-stage');
      stage.dataset.brEntry=String(p.id);stage.style.zIndex=String(isModal?11000:9000+p.id);
      stage.innerHTML=`<section class="br-ad br-ad-${esc(p.format)} br-ad-${esc(p.site)} br-stack-card ${moving?'br-motion-card':''} ${isModal?'br-stack-modal':''}" ${isModal?'role="dialog" aria-modal="true"':'role="region"'} aria-label="${esc(t('Sponsored message','赞助信息'))}" tabindex="-1">
        <div class="br-ad-top"><span>${t('Sponsored','赞助内容')} · ${esc(a[0])}</span>${p.format==='panel'?`<a class="br-false-close" data-br-ad="${p.site}" aria-label="${t('Close promotion','关闭推广')}">×</a>`:''}<button class="br-real-close" type="button" data-br-close aria-label="${t('Dismiss advertisement','关闭广告')}">×</button></div>
        ${moving?`<div class="br-motion-label">${p.format==='bounce'?t('↗ ONE MORE OFFER','↗ 再来一条优惠'):t('✦ CATCH ME FIRST','✦ 先追上我再说')}</div>`:''}
        ${adVisual(p.site)}<div class="br-ad-body"><span class="br-ad-eyebrow">${esc(a[3])}</span><h2>${a[1]}</h2><p>${adDescription(p.site)}</p>
        ${moving?`<p class="br-motion-taunt">${moving&&p.format==='dodge'?t('Looking for the ×?','在找那个 × 吗？'):t('Just passing through. Again.','只是路过，又路过。')}</p>`:''}
        <a class="br-ad-cta" data-br-ad="${p.site}">${a[2]} →</a>${p.format==='newsletter'?`<button class="br-ad-decline" data-br-close>${t('Maybe another time','下次再说')}</button>`:''}</div>
        <div class="br-ad-bottom">${p.format==='tiny'?`<button data-br-close class="br-small-dismiss">${t('close ad','关闭广告')}</button>`:t('Advertisement','广告')}<span class="br-stack-hint">${t('Esc clears all offers','Esc 关闭全部广告')}</span></div>
        <p class="br-blocked" hidden>${t('This link opens in another tab.','链接将在另一个标签页打开。')} <a data-br-fallback target="_blank" rel="noopener" href="${adURL(p.site)}">${t('Open page','打开页面')} ↗</a></p></section>`;
      overlayRoot.append(stage);const card=stage.querySelector('.br-ad');
      const entry={p,stage,card,moving,motion:null,paused:false,blockedLink:false};entries.set(p.id,entry);positionEntry(entry);wireAds(stage);
      stage.querySelectorAll('[data-br-close]').forEach(button=>button.addEventListener('click',()=>closeOne(p.id)));
      stage.querySelectorAll('[data-br-ad]').forEach(link=>link.addEventListener('click',event=>{
        if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
        event.preventDefault();const child=window.open(link.href,'_blank');
        if(child){try{child.opener=null;}catch{}closeOne(p.id);}
        else{stage.querySelector('.br-blocked').hidden=false;entry.blockedLink=true;entry.motion?.pause();positionEntry(entry);}
      }));
      if(moving){let line=0;entry.motion=window.BROWSE_POPUP_MOTION({element:card,mode:p.format,slot:(p.id-1)%4,speed:1.25,isActive:()=>foreground()&&modalId===null&&state.pending.some(item=>item.id===p.id),onMove:meta=>{
        card.dataset.motionMoves=String(meta.count);card.dataset.motionReason=meta.reason;
        if(meta.reason===p.format)card.querySelector('.br-motion-taunt').textContent=t(...taunts[p.format][line++%taunts[p.format].length]);
      }});}
      if(isModal)card.querySelector('.br-real-close').focus({preventScroll:true});
    };
    function sync(){
      trimToViewport();const ids=new Set(state.pending.map(p=>p.id));
      for(const id of [...entries.keys()])if(!ids.has(id))removeEntry(id);
      for(const p of state.pending)if(!entries.has(p.id))createEntry(p);
      for(const entry of entries.values())positionEntry(entry);
      applyModal();
    }
    overlayRoot.addEventListener('keydown',event=>{
      if(event.key!=='Tab'||modalId===null)return;
      const dialog=entries.get(modalId)?.card;if(!dialog)return;
      const controls=[...dialog.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length);
      const first=controls[0],end=controls.at(-1);if(!first)return;
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();end.focus();}
      else if(!event.shiftKey&&document.activeElement===end){event.preventDefault();first.focus();}
    });
    document.addEventListener('focusin',event=>{if(root.contains(event.target))lastOutsideFocus=event.target;});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeAll();}});
    const tick=()=>{
      const now=performance.now(),delta=Math.max(0,Math.min(1100,now-last));last=now;
      if(!foreground()){pressureUpdate();return;}
      state.activeMs+=delta;
      if(state.shown<MAX&&state.pending.length<limit()&&state.activeMs>=state.nextAt&&state.activeMs>=state.quietUntil){
        let format=FORMATS[state.shown%FORMATS.length];
        if((format==='panel'||format==='newsletter')&&state.pending.some(modal))format=state.shown%2?'dodge':'bounce';
        state.shown++;state.pending.push({id:state.shown,site:chosen||deck[(state.shown-1)%deck.length],format});
        state.nextAt=state.shown<MAX?state.activeMs+GAPS[(state.shown-1)%GAPS.length]:null;
        sync();save();
      }else pressureUpdate();
    };
    setInterval(tick,250);setInterval(()=>{if(!suspended)save();},2000);
    const resetClock=()=>{last=performance.now();if(!suspended)save();pressureUpdate();};
    document.addEventListener('visibilitychange',resetClock);window.addEventListener('blur',resetClock);window.addEventListener('focus',resetClock);
    window.addEventListener('pagehide',()=>{suspended=true;stopAll();save();pressureUpdate();});
    window.addEventListener('pageshow',event=>{
      last=performance.now();suspended=false;if(!event.persisted)return;
      const current=readRun(KEY);Object.assign(state,normalize(current===MISSING?state:current));
      for(const id of [...entries.keys()])removeEntry(id);
      sync();save();
    });
    const resize=()=>{sync();if(!suspended)save();};
    window.addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);visualViewport?.addEventListener('scroll',()=>{for(const entry of entries.values())positionEntry(entry);});
    sync();save();
  };
})();
