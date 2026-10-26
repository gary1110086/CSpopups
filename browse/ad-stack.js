/* Foreground-only overlapping advertisements. Native scene work stays in its document. */
(() => {
  'use strict';
  window.BROWSE_AD_STACK = C => {
    const {root,seed,t,esc,read,write,ads,adVisual,adDescription,adURL,wireAds,deck,chosen,adOffer,campaignSite}=C;
    const KEY='br-run-v8:'+seed, MISSING=Symbol('missing'), AUTO_MAX=30, ID_MAX=40, REVEAL_MS=10000;
    const GAPS=[2200,2800,2500,3200,2300,3000];
    const FORMATS=['bounce','tiny','dodge','drawer','panel','newsletter'];
    const hash=salt=>{let value=2166136261;for(const c of seed+salt)value=Math.imul(value^c.charCodeAt(0),16777619);return value>>>0;};
    const closeStyles=['visible','dual','ghost'].sort((a,b)=>hash('close:'+a)-hash('close:'+b));
    // Each ten-card cycle retains four conventional corners, five left corners
    // (one with a decoy), and one lower-right corner. The order is seed-shuffled.
    const closeLayouts=['top-right','top-left','top-right','top-left','decoy','top-right','top-left','bottom-right','top-left','top-right']
      .map((layout,index)=>({layout,order:hash('layout:'+index)})).sort((a,b)=>a.order-b.order).map(p=>p.layout);
    const collisionEnabled=hash('collision-session')/4294967296<.3,collisionPairs=new Map();
    const dodgeLimit=id=>4+hash('dodge:'+id)%3;
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
        if(!p||!Number.isInteger(p.id)||p.id<1||p.id>ID_MAX||ids.has(p.id)||!validSites.includes(p.site)||!FORMATS.includes(p.format))continue;
        if(modal(p)&&hasModal)continue;
        const closeStyle=['visible','dual','ghost'].includes(p.closeStyle)?p.closeStyle:'visible';
        const decoy=p.decoy===true,closeCorner=decoy?'top-left':['top-right','top-left','bottom-right'].includes(p.closeCorner)?p.closeCorner:'top-right';
        const extra=p.format==='dodge'?{dodgeLimit:Number.isInteger(p.dodgeLimit)&&p.dodgeLimit>=4&&p.dodgeLimit<=6?p.dodgeLimit:dodgeLimit(p.id)}:{};
        if(p.burst===true&&!modal(p))extra.burst=true;
        if(p.format==='dodge')extra.dodgeCount=Number.isInteger(p.dodgeCount)?Math.max(0,Math.min(extra.dodgeLimit,p.dodgeCount)):0;
        if(closeStyle==='ghost')extra.closeElapsedMs=Number.isFinite(p.closeElapsedMs)?Math.max(0,Math.min(REVEAL_MS,p.closeElapsedMs)):0;
        pending.push({id:p.id,site:p.site,format:p.format,closeStyle,closeCorner,decoy,...extra});ids.add(p.id);if(modal(p))hasModal=true;
        if(pending.length===10)break;
      }
      const shown=Math.max(Number.isInteger(obj.shown)?Math.max(0,Math.min(ID_MAX,obj.shown)):0,...pending.map(p=>p.id));
      const autoShown=Number.isInteger(obj.autoShown)?Math.max(0,Math.min(AUTO_MAX,shown,obj.autoShown)):Math.min(AUTO_MAX,shown);
      const quietUntil=Number.isFinite(obj.quietUntil)&&obj.quietUntil>=0&&obj.quietUntil<=activeMs+5000?obj.quietUntil:0;
      const nextAt=autoShown>=AUTO_MAX?null:Math.max(quietUntil,Number.isFinite(obj.nextAt)&&obj.nextAt>=0&&obj.nextAt<=activeMs+5000?obj.nextAt:activeMs+(shown?2500:3000));
      return {pacingVersion:8,activeMs,shown,autoShown,nextAt,quietUntil,burstUsed:obj.burstUsed===true||pending.some(p=>p.burst),pending};
    };
    const stored=readRun(KEY);
    let initial=stored;
    if(stored===MISSING){
      let legacy=readRun('br-run-v7:'+seed);if(legacy===MISSING)legacy=readRun('br-run-v6:'+seed);if(legacy===MISSING)legacy=readRun('br-run-v5:'+seed);if(legacy===MISSING)legacy=readRun('br-run-v4:'+seed);if(legacy===MISSING)legacy=readRun('br-run-v3:'+seed);if(legacy===MISSING)legacy=readRun('br-run-v2:'+seed);if(legacy===MISSING)legacy=readRun('br-run-v1:'+seed);
      const old=legacy&&typeof legacy==='object'&&!Array.isArray(legacy)?legacy:{};
      const shown=Number.isInteger(old.shown)?Math.max(0,Math.min(AUTO_MAX,old.shown)):0;
      initial=Array.isArray(old.pending)?old:{activeMs:old.activeMs,shown,pending:old.pending&&typeof old.pending==='object'?[{...old.pending,id:Math.max(1,shown)}]:[]};
    }
    const state=normalize(initial),entries=new Map();
    const overlayRoot=document.getElementById('interrupt-root')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'interrupt-root'}));
    overlayRoot.dataset.collisions=String(collisionEnabled);
    let suspended=false,last=performance.now(),lastOutsideFocus=null,modalId=null,externalModal=false;
    let restoreFrame=0,restoreGeneration=0,restoring=false,clearAfterRestore=false;
    const save=()=>{if(!suspended)C.rawWrite(KEY,state);};
    const burstActive=()=>state.pending.some(p=>p.burst===true);
    const phone=()=>matchMedia('(max-width: 640px)').matches;
    const limit=()=>burstActive()?(phone()?5:10):(phone()?2:4);
    const pressure=window.BROWSE_AD_PRESSURE({root,lang:C.lang,t,esc,adURL,read,write,adOffer,campaignSite});
    const foreground=()=>!suspended&&!externalModal&&!document.hidden&&document.hasFocus();
    const snapshot=()=>({activeMs:state.activeMs,quietUntil:state.quietUntil,active:foreground(),modalOpen:externalModal||modalId!==null,externalModal,suspended,restoring,shown:state.shown,pending:state.pending.length,burstUsed:state.burstUsed,burstActive:burstActive()});
    const observe=detail=>window.dispatchEvent(new CustomEvent('browse:review',{detail}));
    const pressureUpdate=()=>{const current=snapshot();overlayRoot.dataset.collisions=String(collisionEnabled||current.burstActive);pressure.update(current);C.onState?.(current);};
    const stopEntry=entry=>{entry.squeeze?.cancel();entry.motion?.stop();entry.motion=null;};
    const removeEntry=id=>{const entry=entries.get(id);if(!entry)return;stopEntry(entry);entry.stage.remove();entries.delete(id);};
    const stopAll=()=>{for(const entry of entries.values())stopEntry(entry);};
    const rememberFocus=()=>{const el=document.activeElement;if(el&&el!==document.body&&root.contains(el))lastOutsideFocus=el;};
    const returnFocus=()=>{if(lastOutsideFocus?.isConnected&&!lastOutsideFocus.inert)lastOutsideFocus.focus({preventScroll:true});};
    const viewport=()=>({left:visualViewport?.offsetLeft||0,top:visualViewport?.offsetTop||0,width:visualViewport?.width||innerWidth,height:visualViewport?.height||innerHeight});
    const closeReserves=p=>p.closeStyle==='visible'?{top:0,bottom:0}:p.closeCorner==='bottom-right'?{top:0,bottom:30}:{top:30,bottom:0};
    const burstSlots=[[.02,.06],[.72,.08],[.28,.48],[.97,.88],[.05,.94],[.64,.56],[.4,.02],[.98,.32],[.15,.44],[.5,.91]];
    const positionEntry=entry=>{
      const v=viewport(),reserve=closeReserves(entry.p);entry.card.style.setProperty('--br-motion-view-width',v.width+'px');entry.card.style.setProperty('--br-motion-view-height',v.height+'px');
      if(modal(entry.p)){
        const pad=phone()?12:16;
        Object.assign(entry.stage.style,{left:v.left+'px',top:v.top+'px',width:v.width+'px',height:v.height+'px',paddingTop:(pad+reserve.top)+'px',paddingBottom:(pad+reserve.bottom)+'px'});return;
      }
      if(entry.motion||entry.moving)return;
      const rect=entry.card.getBoundingClientRect(),slots=[[.04,.10],[.96,.16],[.07,.94],[.9,.88]],slot=entry.p.burst?burstSlots[(entry.p.id-1)%10]:slots[(entry.p.id-1)%4];
      entry.card.style.left=(v.left+4+Math.max(0,v.width-rect.width-8)*slot[0])+'px';
      entry.card.style.top=(v.top+4+reserve.top+Math.max(0,v.height-rect.height-8-reserve.top-reserve.bottom)*slot[1])+'px';
    };
    const applyModal=()=>{
      const current=state.pending.find(modal);modalId=current?.id??null;
      root.inert=externalModal||modalId!==null;
      const taskShell=document.querySelector('.br-task-shell');if(taskShell)taskShell.inert=externalModal||modalId!==null;
      for(const entry of entries.values()){
        const blocked=externalModal||(modalId!==null&&entry.p.id!==modalId);
        entry.stage.inert=blocked;
        const paused=blocked||entry.blockedLink||entry.revealed;
        if(entry.paused!==paused){entry.paused=paused;if(paused){entry.squeeze?.cancel();entry.motion?.pause();}else entry.motion?.resume();}
      }
      pressureUpdate();
    };
    const updateClose=entry=>{
      const revealed=entry.p.closeStyle==='ghost'&&entry.p.closeElapsedMs>=REVEAL_MS;
      entry.card.dataset.closeRevealed=String(revealed);
      if(entry.revealed===revealed)return;
      entry.revealed=revealed;
      if(revealed)observe({type:'close-reveal',id:entry.p.id,site:entry.p.site});
      if(revealed&&entry.moving)entry.card.querySelector('.br-motion-taunt').textContent=t('You can close this now.','现在可以关闭了。');
    };
    const trimToViewport=()=>{
      const count=limit();if(state.pending.length<=count)return;
      const current=state.pending.find(modal),others=state.pending.filter(p=>!modal(p));
      const keep=new Set([...(current?[current]:[]),...others.slice(-(count-(current?1:0)))].map(p=>p.id));
      state.pending=state.pending.filter(p=>keep.has(p.id));
      if(state.autoShown<AUTO_MAX)state.nextAt=Math.max(state.nextAt??0,state.activeMs+800,state.quietUntil);
    };
    const closeOne=(id,reason='dismiss')=>{
      if(suspended)return;
      const entry=entries.get(id),ownedFocus=entry?.card.contains(document.activeElement);
      state.pending=state.pending.filter(p=>p.id!==id);
      if(state.autoShown<AUTO_MAX)state.nextAt=Math.max(state.nextAt??0,state.activeMs+800,state.quietUntil);
      else state.nextAt=null;
      removeEntry(id);save();sync();
      if(ownedFocus&&modalId===null)returnFocus();
      if(entry&&reason==='dismiss'){
        observe({type:'ad-close',id:entry.p.id,site:entry.p.site,format:entry.p.format});
        window.dispatchEvent(new CustomEvent('browse:ad-dismiss',{detail:{site:entry.p.site}}));
      }
    };
    const closeAll=(duration=5000,reason='escape')=>{
      if(suspended){if(restoring)clearAfterRestore=true;return;}
      const ownedFocus=overlayRoot.contains(document.activeElement);
      for(const id of [...entries.keys()])removeEntry(id);
      const wait=Number.isFinite(duration)?Math.max(3000,Math.min(5000,duration)):5000;
      state.pending=[];state.quietUntil=state.activeMs+wait;state.nextAt=state.autoShown<AUTO_MAX?state.quietUntil:null;
      save();applyModal();if(ownedFocus)returnFocus();
      window.dispatchEvent(new CustomEvent('browse:quiet',{detail:{reason}}));
      observe({type:'quiet',reason});
    };
    const burst=()=>{
      if(suspended||restoring||externalModal||modalId!==null||state.burstUsed||state.activeMs<state.quietUntil)return false;
      state.burstUsed=true;
      const target=phone()?5:10,formats=['bounce','dodge','tiny','drawer'];
      for(let index=0;state.pending.length<target&&state.shown<ID_MAX;index++){
        const id=++state.shown,format=formats[index%formats.length],layout=closeLayouts[(id-1)%closeLayouts.length];
        const closeStyle=hash('burst-close:'+id)%3===0?'dual':'visible';
        const site=chosen||deck[(id-1)%deck.length];
        state.pending.push({id,site,format,closeStyle,closeCorner:layout==='decoy'?'top-left':layout,decoy:layout==='decoy',burst:true,...(format==='dodge'?{dodgeLimit:dodgeLimit(id),dodgeCount:0}:{})});
      }
      state.nextAt=state.autoShown<AUTO_MAX?Math.max(state.nextAt??0,state.activeMs+800):null;
      // Commit the once-per-seed trigger before mounting interactive cards.
      save();sync();C.onBurst?.();return true;
    };
    const taunts={bounce:[['Another little detour.','又来一小段绕路。'],['Yes, I am still here.','没错，我还在这里。'],['Your attention looks busy.','你的注意力好像很忙。'],['Room for one more offer?','还能再放一条优惠吗？']],dodge:[['Nearly! Try the other corner.','差一点！换个角落试试。'],['Oops. New address.','哎呀，我搬家啦。'],['You close. I relocate.','你要关，我就搬。'],['Still following me?','还在追我吗？']]};
    const collide=()=>{
      if(!(collisionEnabled||burstActive())||!foreground()||modalId!==null)return;
      const cards=[...entries.values()].filter(entry=>entry.motion&&!entry.paused),touched=new Set();
      for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){
        const a=cards[i],b=cards[j],pair=a.p.id+':'+b.p.id;
        if(touched.has(a.p.id)||touched.has(b.p.id)||state.activeMs-(collisionPairs.get(pair)??-Infinity)<(burstActive()?500:1200))continue;
        const ar=a.motion.snapshot(),br=b.motion.snapshot();if(!ar.canMove||!br.canMove)continue;
        const overlapX=Math.min(ar.x+ar.width,br.x+br.width)-Math.max(ar.x,br.x);
        const overlapY=Math.min(ar.y+ar.height,br.y+br.height)-Math.max(ar.y,br.y);
        if(overlapX<8||overlapY<8)continue;
        let dx=0,dy=0;
        if(overlapX<overlapY){dx=(ar.x+ar.width/2<br.x+br.width/2?-1:1)*Math.min(56,overlapX/2+9);}
        else{dy=(ar.y+ar.height/2<br.y+br.height/2?-1:1)*Math.min(56,overlapY/2+9);}
        let movedA=a.motion.nudge(dx,dy,{animate:true}),movedB=b.motion.nudge(-dx,-dy,{animate:true});
        // If both hit the viewport edge, try separating along the other axis.
        if(!movedA&&!movedB){
          if(dx){dx=0;dy=(ar.y+ar.height/2<br.y+br.height/2?-1:1)*Math.min(56,overlapY/2+9);}
          else{dy=0;dx=(ar.x+ar.width/2<br.x+br.width/2?-1:1)*Math.min(56,overlapX/2+9);}
          movedA=a.motion.nudge(dx,dy,{animate:true});movedB=b.motion.nudge(-dx,-dy,{animate:true});
        }
        collisionPairs.set(pair,state.activeMs);
        touched.add(a.p.id);touched.add(b.p.id);
        for(const entry of [a,b]){
          entry.card.dataset.collisionCount=String(Number(entry.card.dataset.collisionCount||0)+1);
          entry.card.dataset.collisionAxis=dx?'x':'y';
          entry.squeeze?.cancel();
          entry.squeeze=entry.card.querySelector('.br-ad-scroll').animate([{transform:'scale(1)'},{transform:dx?'scale(.94,1)':'scale(1,.94)',offset:.35},{transform:'scale(1)'}],{duration:300,easing:'ease-out'});
          const line=entry.card.querySelector('.br-motion-taunt');if(line)line.textContent=t('Excuse me. That was my corner!','借过，这个角落我先来的！');
        }
      }
    };
    const createEntry=p=>{
      rememberFocus();
      const a=ads[p.site],isModal=modal(p),moving=p.format==='bounce'||p.format==='dodge';
      const offer=typeof adOffer==='function'?adOffer(p.site,p.id):{brand:a[0],title:a[1],cta:a[2],eyebrow:a[3],description:adDescription(p.site)};
      const lower=p.closeCorner==='bottom-right';
      const genuine=`<button class="br-real-close${lower?' br-corner-close':''}" type="button" data-br-close ${p.closeStyle==='ghost'?'hidden':''} aria-label="${t('Dismiss advertisement','关闭广告')}">×</button>`;
      const stage=document.createElement('div');stage.className='br-interrupt '+(isModal?'br-ad-backdrop br-stack-modal-stage':'br-motion-stage br-stack-stage');
      stage.dataset.brEntry=String(p.id);stage.dataset.brBurst=String(p.burst===true);stage.style.zIndex=String(isModal?11000:9000+p.id);
      stage.innerHTML=`<section class="br-ad br-ad-${esc(p.format)} br-ad-${esc(p.site)} br-stack-card ${moving?'br-motion-card':''} ${isModal?'br-stack-modal':''}" data-close-style="${p.closeStyle}" data-close-corner="${p.closeCorner}" data-decoy="${p.decoy}" ${isModal?'role="dialog" aria-modal="true"':'role="region"'} aria-label="${esc(t('Sponsored message','赞助信息'))}" tabindex="-1">
        ${p.closeStyle!=='visible'?`<button class="br-ghost-close" type="button" data-br-close aria-label="${t('Dismiss advertisement','关闭广告')}">×</button>`:''}${lower?genuine:''}<div class="br-ad-scroll">
        <div class="br-ad-top"><span>${t('Sponsored','赞助内容')} · ${esc(offer.brand)}</span>${!lower?genuine:''}${p.decoy?`<a class="br-false-close br-decoy-close" data-br-ad="${p.site}" data-br-decoy aria-label="${t('Open sponsor offer','打开赞助推广')}">×</a>`:p.format==='panel'&&p.closeStyle!=='ghost'?`<a class="br-false-close" data-br-ad="${p.site}" aria-label="${t('Open sponsor offer','打开赞助推广')}">×</a>`:''}</div>
        ${moving?`<div class="br-motion-label">${p.format==='bounce'?t('↗ ONE MORE OFFER','↗ 再来一条优惠'):t('✦ CATCH ME FIRST','✦ 先追上我再说')}</div>`:''}
        ${adVisual(p.site)}<div class="br-ad-body"><span class="br-ad-eyebrow">${esc(offer.eyebrow)}</span><h2>${esc(offer.title)}</h2><p>${esc(offer.description)}</p>
        ${moving?`<p class="br-motion-taunt">${moving&&p.format==='dodge'?t('Looking for the ×?','在找那个 × 吗？'):t('Just passing through. Again.','只是路过，又路过。')}</p>`:''}
        <a class="br-ad-cta" data-br-ad="${p.site}">${esc(offer.cta)} →</a>${p.format==='newsletter'&&p.closeStyle!=='ghost'?`<button class="br-ad-decline" data-br-close>${t('Maybe another time','下次再说')}</button>`:''}</div>
        <div class="br-ad-bottom">${p.format==='tiny'&&p.closeStyle!=='ghost'?`<button data-br-close class="br-small-dismiss">${t('close ad','关闭广告')}</button>`:t('Advertisement','广告')}<span class="br-stack-hint">${t('Esc clears all offers','Esc 关闭全部广告')}</span></div>
        <p class="br-blocked" hidden>${t('This link opens in another tab.','链接将在另一个标签页打开。')} <a data-br-fallback target="_blank" rel="noopener" href="${adURL(p.site)}">${t('Open page','打开页面')} ↗</a></p></div></section>`;
      overlayRoot.append(stage);const card=stage.querySelector('.br-ad');
      const entry={p,stage,card,moving,motion:null,paused:false,blockedLink:false,revealed:false};entries.set(p.id,entry);positionEntry(entry);wireAds(stage);
      card.addEventListener('focusin',()=>entry.squeeze?.cancel());card.addEventListener('pointerdown',()=>entry.squeeze?.cancel(),{passive:true});
      observe({type:'ad-show',id:p.id,site:p.site,format:p.format,count:p.dodgeCount||0});
      stage.querySelectorAll('[data-br-close]').forEach(button=>button.addEventListener('click',()=>closeOne(p.id)));
      stage.querySelectorAll('[data-br-ad]').forEach(link=>link.addEventListener('click',event=>{
        if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
        event.preventDefault();const child=window.open(link.href,'_blank');
        observe({type:'ad-open',id:p.id,site:p.site,format:p.format,control:link.classList.contains('br-false-close')?'decoy':'cta',outcome:child?'opened':'blocked'});
        if(child){try{child.opener=null;}catch{}if(!link.hasAttribute('data-br-decoy'))closeOne(p.id,'advertiser');}
        else{stage.querySelector('.br-blocked').hidden=false;entry.blockedLink=true;entry.motion?.pause();positionEntry(entry);}
      }));
      if(!isModal){let line=0;const reserve=closeReserves(p);entry.motion=window.BROWSE_POPUP_MOTION({element:card,mode:moving?p.format:'static',slot:(p.id-1)%4,origin:p.burst?burstSlots[(p.id-1)%10]:moving?null:[[.04,.10],[.96,.16],[.07,.94],[.9,.88]][(p.id-1)%4],speed:1.25,topReserve:reserve.top,bottomReserve:reserve.bottom,dodgeLimit:p.dodgeLimit,dodgeCount:p.dodgeCount,isActive:()=>foreground()&&modalId===null&&state.pending.some(item=>item.id===p.id),onMove:meta=>{
        card.dataset.motionMoves=String(meta.count);card.dataset.motionReason=meta.reason;
        if(p.format==='dodge'){
          card.dataset.dodgeLimit=String(meta.dodgeLimit);card.dataset.dodgeCount=String(meta.dodgeCount);card.dataset.dodgeSettled=String(meta.settled);
          if(meta.reason==='dodge'){p.dodgeCount=meta.dodgeCount;save();observe({type:'dodge',id:p.id,site:p.site,count:meta.dodgeCount});}
          if(entry.revealed)return;
          if(meta.settled){card.querySelector('.br-motion-taunt').textContent=t('All right. I will stay here.','好啦，这次不跑了。');return;}
        }
        if(meta.reason===p.format)card.querySelector('.br-motion-taunt').textContent=t(...taunts[p.format][line++%taunts[p.format].length]);
      }});}
      if(isModal&&!externalModal)(card.querySelector('.br-real-close:not([hidden])')||card.querySelector('.br-ghost-close')).focus({preventScroll:true});
    };
    function sync(){
      trimToViewport();const ids=new Set(state.pending.map(p=>p.id));
      for(const id of [...entries.keys()])if(!ids.has(id))removeEntry(id);
      for(const p of state.pending)if(!entries.has(p.id))createEntry(p);
      for(const entry of entries.values()){updateClose(entry);positionEntry(entry);}
      applyModal();
    }
    overlayRoot.addEventListener('keydown',event=>{
      if(event.key!=='Tab'||modalId===null||externalModal)return;
      const dialog=entries.get(modalId)?.card;if(!dialog)return;
      const controls=[...dialog.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length);
      const first=controls[0],end=controls.at(-1);if(!first)return;
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();end.focus();}
      else if(!event.shiftKey&&document.activeElement===end){event.preventDefault();first.focus();}
    });
    document.addEventListener('focusin',event=>{if(root.contains(event.target))lastOutsideFocus=event.target;});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!externalModal){event.preventDefault();closeAll();}});
    const tick=()=>{
      const now=performance.now(),delta=Math.max(0,Math.min(1100,now-last));last=now;
      if(!foreground()){pressureUpdate();return;}
      state.activeMs+=delta;
      let justRevealed=false;
      for(const p of state.pending)if(p.closeStyle==='ghost'){
        const before=p.closeElapsedMs;p.closeElapsedMs=Math.min(REVEAL_MS,before+delta);
        if(before<REVEAL_MS&&p.closeElapsedMs>=REVEAL_MS)justRevealed=true;
      }
      if(justRevealed){for(const entry of entries.values())updateClose(entry);applyModal();save();}
      if(!burstActive()&&state.autoShown<AUTO_MAX&&state.shown<ID_MAX&&state.pending.length<limit()&&state.activeMs>=state.nextAt&&state.activeMs>=state.quietUntil){
        let format=FORMATS[state.autoShown%FORMATS.length];
        if((format==='panel'||format==='newsletter')&&state.pending.some(modal))format=state.autoShown%2?'dodge':'bounce';
        state.shown++;state.autoShown++;const closeStyle=closeStyles[(state.shown-1)%closeStyles.length],layout=closeLayouts[(state.shown-1)%closeLayouts.length];
        const recurring=validSites.includes(campaignSite)&&(state.autoShown-1)%6===0;
        const normalIndex=state.autoShown-1-(validSites.includes(campaignSite)?Math.ceil((state.autoShown-1)/6):0);
        const site=chosen||(recurring?campaignSite:deck[normalIndex%deck.length]);
        const p={id:state.shown,site,format,closeStyle,closeCorner:layout==='decoy'?'top-left':layout,decoy:layout==='decoy',...(closeStyle==='ghost'?{closeElapsedMs:0}:{}),...(format==='dodge'?{dodgeLimit:dodgeLimit(state.shown),dodgeCount:0}:{})};
        state.pending.push(p);
        state.nextAt=state.autoShown<AUTO_MAX?state.activeMs+GAPS[(state.autoShown-1)%GAPS.length]:null;
        sync();save();C.onArrival?.(p);
      }else pressureUpdate();
      collide();
    };
    setInterval(tick,250);setInterval(()=>{if(!suspended)save();},2000);
    const resetClock=()=>{last=performance.now();if(!foreground())for(const entry of entries.values())entry.squeeze?.cancel();if(!suspended)save();pressureUpdate();};
    document.addEventListener('visibilitychange',resetClock);window.addEventListener('blur',resetClock);window.addEventListener('focus',resetClock);
    const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    motionPreference.addEventListener('change',()=>{if(motionPreference.matches)for(const entry of entries.values())entry.squeeze?.cancel();});
    window.addEventListener('pagehide',()=>{
      const wasLive=!suspended;suspended=true;restoring=false;externalModal=false;restoreGeneration++;
      cancelAnimationFrame(restoreFrame);restoreFrame=0;stopAll();
      if(wasLive)C.rawWrite(KEY,state);
      pressureUpdate();
    });
    window.addEventListener('pageshow',event=>{
      last=performance.now();if(!event.persisted){suspended=false;return;}
      suspended=true;restoring=true;overlayRoot.hidden=true;overlayRoot.dataset.restoring='true';stopAll();
      cancelAnimationFrame(restoreFrame);const generation=++restoreGeneration;
      // A restored renderer can receive the previous page's sessionStorage write
      // after pageshow. Keep every writer suspended until the frame/task boundary.
      restoreFrame=requestAnimationFrame(()=>{
        restoreFrame=requestAnimationFrame(()=>{
          if(generation!==restoreGeneration||!restoring)return;
          restoreFrame=0;
          const current=readRun(KEY);Object.assign(state,normalize(current===MISSING?state:current));
          for(const id of [...entries.keys()])removeEntry(id);
          overlayRoot.hidden=false;
          sync();restoring=false;suspended=false;last=performance.now();
          delete overlayRoot.dataset.restoring;
          if(clearAfterRestore){clearAfterRestore=false;closeAll();}else{save();pressureUpdate();}
        });
      });
    });
    const resize=()=>{if(suspended)return;for(const entry of entries.values())entry.squeeze?.cancel();sync();save();};
    window.addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);visualViewport?.addEventListener('scroll',()=>{for(const entry of entries.values())positionEntry(entry);});
    sync();save();
    return {snapshot,burst,quiet:(duration)=>{if(suspended)return false;closeAll(duration,'event');return true;},setExternalModal:(value)=>{
      const next=value===true;if(next===externalModal)return;externalModal=next;last=performance.now();
      // Dialog cleanup must release the lock even after pagehide has suspended writers.
      applyModal();
    }};
  };
})();
