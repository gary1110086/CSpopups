/* Local facilitator observations. No text inputs, files or browser history are recorded. */
(() => {
  'use strict';
  const PREFIX='br-review-v1:',INDEX='br-review-index-v1',MAX_EVENTS=200,MAX_REPORTS=12;
  const SCENES=['wallpapers','recipes','tools','movies','events','books','museum','nature','travel','market'];
  const SITES=['corn','desk','stock','game','security','player','software','prize','coupon','parcel'];
  const FORMATS=['bounce','tiny','dodge','drawer','panel','newsletter','inline','ambient','context','event','layout','fallback','document'];
  const TYPES=['visit','ad-open','ad-show','dodge','ad-close','close-reveal','event','layout','consent','quiet','complete'];
  const KINDS=['chat','tab','video','search','escalation','character','quiet','reward'];
  const COUNTERS=['visits','shown','opened','blocked','native','decoys','dodges','closed','revealed','events','layouts','layoutDismissed','consentShown','consentManaged','consentAccepted','consentRejected','consentSaved','quiet','completed'];
  const cache=new Map();
  const seedOf=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,40}$/.test(value)?value:null;
  const integer=(value,max=10000)=>Number.isInteger(value)?Math.max(0,Math.min(max,value)):0;
  const clock=value=>Number.isFinite(value)?Math.max(0,Math.min(14400000,value)):0;
  const timestamp=value=>Number.isFinite(value)?Math.max(0,Math.min(100000000000000,value)):0;
  const choice=(value,options)=>options.includes(value)?value:undefined;
  const readRaw=key=>{let raw;try{raw=sessionStorage.getItem(key);}catch{return cache.get(key)||null;}if(raw===null)return null;try{return JSON.parse(raw);}catch{return null;}};
  const writeRaw=(key,value)=>{cache.set(key,value);try{sessionStorage.setItem(key,JSON.stringify(value));}catch{}};
  const eventOf=value=>{
    if(!value||typeof value!=='object'||Array.isArray(value)||!TYPES.includes(value.type))return null;
    const e={type:value.type,at:clock(value.at),seq:integer(value.seq,1000000000)};
    for(const [key,list] of [['scene',SCENES],['site',SITES],['format',FORMATS],['control',['decoy','cta','fallback']],['outcome',['opened','blocked','native']],['kind',KINDS],['reason',['escape','event']],['action',['inserted','dismissed','shown','manage','accept','reject','save']]]){
      const v=choice(value[key],list);if(v!==undefined)e[key]=v;
    }
    if(Number.isInteger(value.id)&&value.id>=1&&value.id<=30)e.id=value.id;
    if(Number.isInteger(value.count))e.count=integer(value.count,6);
    if(Number.isInteger(value.optional))e.optional=integer(value.optional,3);
    if(Number.isFinite(value.height))e.height=Math.round(Math.max(0,Math.min(1000,value.height)));
    return e;
  };
  const taskOf=value=>typeof value==='string'&&(window.BROWSE_TASKS||[]).some(task=>task.id===value)?value:null;
  const normalize=(value,seed)=>{
    const r=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const counts={};for(const key of COUNTERS)counts[key]=integer(r.counts?.[key]);
    const ids=value=>[...new Set((Array.isArray(value)?value:[]).filter(id=>Number.isInteger(id)&&id>=1&&id<=30))].slice(0,30);
    const dodge={};for(let id=1;id<=30;id++){const count=integer(r.seen?.dodge?.[id],6);if(count)dodge[id]=count;}
    return {version:1,seed,created:timestamp(r.created),updated:timestamp(r.updated),activeMs:clock(r.activeMs),seq:integer(r.seq,1000000000),scene:choice(r.scene,SCENES)||null,scenes:[...new Set((Array.isArray(r.scenes)?r.scenes:[]).filter(s=>SCENES.includes(s)))].slice(0,10),task:taskOf(r.task),counts,seen:{shown:ids(r.seen?.shown),closed:ids(r.seen?.closed),revealed:ids(r.seen?.revealed),dodge,kinds:[...new Set((Array.isArray(r.seen?.kinds)?r.seen.kinds:[]).filter(k=>KINDS.includes(k)))].slice(0,8)},events:(Array.isArray(r.events)?r.events:[]).slice(-MAX_EVENTS).map(eventOf).filter(Boolean)};
  };
  const index=()=>{const stored=readRaw(INDEX);return [...new Set((Array.isArray(stored)?stored:[]).map(seedOf).filter(Boolean))].slice(0,MAX_REPORTS);};
  const get=seed=>{seed=seedOf(seed);if(!seed)return null;const raw=readRaw(PREFIX+seed);return raw&&typeof raw==='object'&&!Array.isArray(raw)?normalize(raw,seed):null;};
  const touch=(seed,value)=>{
    const previous=index(),next=[seed,...previous.filter(item=>item!==seed)].slice(0,MAX_REPORTS);
    writeRaw(PREFIX+seed,value);writeRaw(INDEX,next);
    for(const old of previous.filter(item=>!next.includes(item))){cache.delete(PREFIX+old);try{sessionStorage.removeItem(PREFIX+old);}catch{}}
  };
  const clear=seed=>{
    seed=seedOf(seed);if(!seed)return;
    cache.delete(PREFIX+seed);try{sessionStorage.removeItem(PREFIX+seed);}catch{}
    writeRaw(INDEX,index().filter(item=>item!==seed));
  };
  window.BROWSE_REVIEW_DATA=Object.freeze({read:get,index,clear,eventOf});
  window.BROWSE_REVIEW_LOG=C=>{
    const seed=seedOf(C.seed),scene=choice(C.scene,SCENES);if(!seed||!scene)return null;
    let suspended=false,destroyed=false,generation=0,frame=0,activeMs=0,lastClockSave=0;
    const fresh=()=>get(seed)||normalize({},seed);
    const save=r=>{if(!suspended&&!destroyed)touch(seed,r);};
    const increment=(r,key,amount=1)=>{r.counts[key]=Math.min(10000,r.counts[key]+amount);};
    const record=detail=>{
      if(suspended||destroyed)return false;
      const e=eventOf(detail);if(!e)return false;
      const r=fresh();r.activeMs=Math.max(r.activeMs,activeMs);e.at=r.activeMs;e.scene=scene;
      const once=(key)=>{if(!e.id)return true;if(r.seen[key].includes(e.id))return false;r.seen[key].push(e.id);return true;};
      if(e.type==='visit')increment(r,'visits');
      else if(e.type==='ad-show'){
        // A restored legacy card may already have used part of its dodge budget.
        // Establish that baseline without claiming those old moves were observed.
        const baseline=e.id&&e.format==='dodge'&&e.count>0&&e.count>(r.seen.dodge[e.id]||0);
        if(baseline)r.seen.dodge[e.id]=e.count;
        if(!once('shown')){if(baseline)save(r);return false;}increment(r,'shown');
      }
      else if(e.type==='ad-open'){
        if(!e.outcome)return false;increment(r,e.outcome);if(e.control==='decoy')increment(r,'decoys');
      }else if(e.type==='dodge'){
        if(!e.id||!e.count)return false;
        const previous=r.seen.dodge[e.id]||0;if(e.count<=previous)return false;
        increment(r,'dodges',e.count-previous);r.seen.dodge[e.id]=e.count;
      }else if(e.type==='ad-close'){if(!once('closed'))return false;increment(r,'closed');}
      else if(e.type==='close-reveal'){if(!once('revealed'))return false;increment(r,'revealed');}
      else if(e.type==='event'){
        if(!e.kind||r.seen.kinds.includes(e.kind))return false;r.seen.kinds.push(e.kind);increment(r,'events');
      }else if(e.type==='layout'){
        if(e.action==='inserted')increment(r,'layouts');else if(e.action==='dismissed')increment(r,'layoutDismissed');else return false;
      }else if(e.type==='consent'){
        const counter={shown:'consentShown',manage:'consentManaged',accept:'consentAccepted',reject:'consentRejected',save:'consentSaved'}[e.action];if(!counter)return false;increment(r,counter);
      }else if(e.type==='quiet')increment(r,'quiet');
      else if(e.type==='complete')increment(r,'completed');
      r.scene=scene;if(!r.scenes.includes(scene))r.scenes.push(scene);
      r.task=taskOf(C.params?.get('task'))||r.task;
      r.created=r.created||Date.now();r.updated=Date.now();r.seq=Math.min(1000000000,r.seq+1);e.seq=r.seq;
      r.events.push(e);r.events=r.events.slice(-MAX_EVENTS);save(r);return true;
    };
    const persistClock=()=>{
      if(suspended||destroyed)return;
      const r=fresh();if(activeMs<=r.activeMs)return;r.activeMs=activeMs;r.updated=Date.now();save(r);
    };
    const update=snapshot=>{
      if(suspended||destroyed||snapshot?.suspended||snapshot?.restoring)return;
      activeMs=Math.max(activeMs,clock(snapshot?.activeMs));
      if(activeMs-lastClockSave>=2000){lastClockSave=activeMs;persistClock();}
    };
    const observe=event=>record(event.detail),complete=()=>record({type:'complete'});
    const hide=()=>{if(!suspended)persistClock();suspended=true;generation++;cancelAnimationFrame(frame);frame=0;};
    const show=event=>{
      if(!event.persisted)return;
      suspended=true;const current=++generation;cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
        if(destroyed||current!==generation)return;frame=0;activeMs=Math.max(activeMs,fresh().activeMs);suspended=false;record({type:'visit'});
      });});
    };
    activeMs=fresh().activeMs;record({type:'visit'});
    window.addEventListener('browse:review',observe);window.addEventListener('browse:complete',complete);window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
    return {update,record,destroy(){if(destroyed)return;hide();destroyed=true;window.removeEventListener('browse:review',observe);window.removeEventListener('browse:complete',complete);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);}};
  };
})();
