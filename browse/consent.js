/* A deliberately unequal cookie-choice flow; choices only affect this local exercise. */
(() => {
  'use strict';
  window.BROWSE_CONSENT = C => {
    const {root,scene,seed,t,esc,read,write,stack}=C;
    if(!root||!scene)return null;
    const KEY='consent-v1:'+scene, names={wallpapers:'Stillwall',recipes:'Pantry & Plate',tools:'Pixelpress',movies:'Frame Movies',events:'Out There KL',books:'Folio',museum:'Open Collection',nature:'Field Guide',travel:'Trackside',market:'loop'};
    const accents={wallpapers:'#718e36',recipes:'#ab482f',tools:'#2764a3',movies:'#bd7b16',events:'#a52b2a',books:'#685137',museum:'#242b32',nature:'#4c6941',travel:'#1e6179',market:'#327053'};
    const brand=names[scene]||'Browse';
    const hash=value=>{let n=2166136261;for(const char of value)n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0;};
    const eligible=hash(seed+':'+scene+':consent')%100<70;
    const blank=()=>({version:1,choice:null,preferences:false,measurement:false,advertising:false});
    const normalize=value=>{
      if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1||!['all','reject','custom',null].includes(value.choice))return blank();
      const next=blank();next.choice=value.choice;
      for(const key of ['preferences','measurement','advertising'])next[key]=value.choice==='all'||value.choice==='custom'&&value[key]===true;
      return next;
    };
    let repair=false;
    const load=()=>{const stored=read(KEY,null),normalized=normalize(stored);repair=stored!==null&&JSON.stringify(stored)!==JSON.stringify(normalized);return normalized;};
    let state=load(),current=stack?.snapshot?.()||{},baseline=Number.isFinite(current.activeMs)?current.activeMs:0;
    let suspended=false,restoring=false,destroyed=false,frame=0,generation=0,bannerRequested=false,shown=false,focusBefore=null;
    const host=document.createElement('div');host.id='br-consent-root';host.dataset.scene=scene;host.style.setProperty('--br-consent-accent',accents[scene]||'#285a6f');
    const banner=document.createElement('section');banner.className='br-consent-banner';banner.hidden=true;banner.setAttribute('aria-label',t('Cookie choices','Cookie 选择'));
    banner.innerHTML=`<div class="br-consent-banner-copy"><span class="br-consent-brand">${esc(brand)}</span><h2>${t('Your privacy choices','你的隐私选择')}</h2><p>${t('Choose how cookies and similar storage may be used for preferences, measurement and offers. You can review each purpose in settings.','选择偏好、统计和推广用途所使用的 Cookie 与类似存储。你可以在设置中逐项查看。')}</p></div><div class="br-consent-banner-actions"><button type="button" class="br-consent-primary" data-consent-accept>${t('Accept all','接受全部')}</button><button type="button" class="br-consent-manage" data-consent-manage>${t('Manage preferences','管理偏好')}</button></div>`;
    const dialog=document.createElement('dialog');dialog.className='br-consent-dialog';dialog.setAttribute('aria-labelledby','br-consent-title');dialog.setAttribute('aria-describedby','br-consent-description');
    dialog.innerHTML=`<div class="br-consent-dialog-shell"><header><div><span class="br-consent-brand">${esc(brand)}</span><h2 id="br-consent-title">${t('Privacy preference centre','隐私偏好设置')}</h2></div><button type="button" class="br-consent-x" data-consent-back aria-label="${t('Close privacy settings','关闭隐私设置')}">×</button></header><div class="br-consent-dialog-scroll"><p id="br-consent-description">${t('Review the purposes below. Essential storage keeps this website working; the other categories are optional.','查看下列用途。必要存储用于维持网站功能；其他类别均为可选。')}</p><p class="br-consent-demo">${t('Browsing exercise: these switches save a choice in this tab only. No advertising or measurement service is activated. Your saved items remain available whichever option you choose.','浏览练习：这些开关只在当前标签页保存选择，不会启用广告或统计服务。无论选择哪一项，已保存的内容都可继续使用。')}</p><div class="br-consent-categories"><section><div><h3>${t('Strictly necessary','绝对必要')}</h3><span class="br-consent-required">${t('Always active','始终启用')}</span></div><p>${t('Keep navigation, local files and saved choices available during this browsing session.','在本次浏览中保留导航、本地文件和已保存的选择。')}</p></section>${[['preferences',t('Preferences','偏好设置'),t('Remember display and content preferences within this website.','记住本网站的显示与内容偏好。')],['measurement',t('Audience measurement','访问统计'),t('Allow the proposed use of page and interaction statistics.','允许所提议的页面与互动统计用途。')],['advertising',t('Personalised offers','个性化推广'),t('Allow the proposed use of interests to tailor commercial recommendations.','允许所提议的兴趣信息用途，以调整商业推荐。')]].map(([key,title,description])=>`<section><div><label for="br-consent-${key}">${title}</label><input id="br-consent-${key}" type="checkbox" data-consent-category="${key}" role="switch"></div><p>${description}</p></section>`).join('')}</div></div><footer><button type="button" class="br-consent-reject" data-consent-reject>${t('Reject optional purposes','拒绝可选用途')}</button><button type="button" class="br-consent-primary" data-consent-save>${t('Save my choices','保存我的选择')}</button></footer></div>`;
    const preferences=document.createElement('div');preferences.className='br-consent-preferences';preferences.innerHTML=`<button type="button" data-consent-reopen>${t('Cookie settings','Cookie 设置')}</button>`;
    host.append(banner,dialog);document.body.append(host,preferences);
    const emit=action=>window.dispatchEvent(new CustomEvent('browse:review',{detail:{type:'consent',action,scene,optional:['preferences','measurement','advertising'].filter(key=>state[key]).length}}));
    const available=()=>!destroyed&&!suspended&&!restoring&&!current.suspended&&!current.restoring;
    const repairStorage=()=>{if(repair&&available()){write(KEY,state);repair=false;}};
    const quiet=()=>Number.isFinite(current.quietUntil)&&Number.isFinite(current.activeMs)&&current.quietUntil>current.activeMs;
    const sync=()=>{
      const visible=available()&&!dialog.open&&!current.modalOpen&&!quiet()&&bannerRequested;
      banner.hidden=!visible;
      preferences.inert=!available()||Boolean(current.modalOpen);
      if(visible&&!shown){shown=true;emit('shown');}
    };
    const release=restoreFocus=>{
      stack?.setExternalModal?.(false);
      if(restoreFocus&&focusBefore&&!stack?.snapshot?.()?.modalOpen){
        const target=focusBefore?.isConnected&&!focusBefore.closest('[inert]')&&focusBefore.getClientRects().length?focusBefore:preferences.querySelector('button');
        if(target&&!target.closest('[inert]'))target.focus({preventScroll:true});
      }
      focusBefore=null;
      if(!destroyed)sync();
    };
    const closeSettings=restoreFocus=>{
      if(dialog.open)dialog.close();
      release(restoreFocus);
    };
    const openSettings=()=>{
      if(!available()||current.modalOpen||dialog.open)return;
      focusBefore=document.activeElement;
      for(const input of dialog.querySelectorAll('[data-consent-category]'))input.checked=state[input.dataset.consentCategory];
      banner.hidden=true;
      stack?.setExternalModal?.(true);
      try{dialog.showModal();}catch{release(true);return;}
      emit('manage');
      dialog.querySelector('[data-consent-back]').focus({preventScroll:true});
    };
    const save=(choice,values={})=>{
      if(!available())return;
      state=normalize({version:1,choice,...values});write(KEY,state);
      bannerRequested=false;
      emit(choice==='all'?'accept':choice==='reject'?'reject':'save');
      closeSettings(true);sync();
    };
    const onClick=event=>{
      const button=event.target.closest?.('button');if(!button||!available())return;
      if(button.hasAttribute('data-consent-accept'))save('all');
      else if(button.hasAttribute('data-consent-manage')||button.hasAttribute('data-consent-reopen'))openSettings();
      else if(button.hasAttribute('data-consent-back'))closeSettings(true);
      else if(button.hasAttribute('data-consent-reject'))save('reject');
      else if(button.hasAttribute('data-consent-save'))save('custom',Object.fromEntries([...dialog.querySelectorAll('[data-consent-category]')].map(input=>[input.dataset.consentCategory,input.checked])));
    };
    const onCancel=event=>{event.preventDefault();closeSettings(true);};
    const onKey=event=>{
      // The native dialog owns Escape while open; the stack's trap must not handle it.
      if(dialog.open&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeSettings(true);}
    };
    const onClose=()=>{if(!dialog.open)release(!suspended&&!destroyed);};
    const onHide=()=>{suspended=true;restoring=false;generation++;cancelAnimationFrame(frame);frame=0;closeSettings(false);banner.hidden=true;preferences.inert=true;};
    const onShow=event=>{
      if(!event.persisted)return;
      suspended=true;restoring=true;const run=++generation;cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
        if(destroyed||run!==generation)return;
        frame=0;state=load();current=stack?.snapshot?.()||current;baseline=Number.isFinite(current.activeMs)?current.activeMs:0;
        suspended=false;restoring=false;bannerRequested=false;shown=false;repairStorage();sync();
      });});
    };
    host.addEventListener('click',onClick);preferences.addEventListener('click',onClick);dialog.addEventListener('cancel',onCancel);dialog.addEventListener('close',onClose);
    window.addEventListener('keydown',onKey,true);window.addEventListener('pagehide',onHide);window.addEventListener('pageshow',onShow);
    repairStorage();
    return {
      update(snapshot){
        if(destroyed)return;
        if(snapshot&&typeof snapshot==='object')current=snapshot;
        repairStorage();
        if(available()&&current.active===true&&!state.choice&&eligible&&Number.isFinite(current.activeMs)&&current.activeMs-baseline>=6500)bannerRequested=true;
        sync();
      },
      reconcile(){if(!destroyed&&!preferences.isConnected)document.body.append(preferences);},
      destroy(){
        if(destroyed)return;destroyed=true;suspended=true;generation++;cancelAnimationFrame(frame);closeSettings(false);
        host.removeEventListener('click',onClick);preferences.removeEventListener('click',onClick);dialog.removeEventListener('cancel',onCancel);dialog.removeEventListener('close',onClose);
        window.removeEventListener('keydown',onKey,true);window.removeEventListener('pagehide',onHide);window.removeEventListener('pageshow',onShow);host.remove();preferences.remove();
      }
    };
  };
})();
