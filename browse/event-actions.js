/* Optional search sponsorship and post-completion offers. Real task controls stay native. */
(() => {
  'use strict';
  window.BROWSE_EVENT_ACTIONS = C => {
    const {root,host,t,esc,scene}=C;
    const suggestions={wallpapers:['Earthrise','forest','mountain'],recipes:['chickpea','tofu','rice'],tools:['compress','resize'],movies:['Sintel','Tears of Steel','Big Buck Bunny'],events:['museum','KLCC','rain'],books:['Alice','Dickens','Shelley'],museum:['Monet','landscape','Wheat Field'],nature:['Blue Jay','American Crow','sparrow'],travel:['KLCC','Pasar Seni','KL Sentral'],market:['Canon','Nikon','Olympus']};
    let active=null,paused=false,destroyed=false,frame=0,serial=0;
    const clean=(value,max=100)=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max):'';
    const viewport=()=>{const v=window.visualViewport;return {x:v?.offsetLeft||0,y:v?.offsetTop||0,width:v?.width||innerWidth,height:v?.height||innerHeight};};
    const clamp=(value,lo,hi)=>Math.max(lo,Math.min(value,Math.max(lo,hi)));
    const siteFor=kind=>kind==='reward'?(scene==='movies'||scene==='tools'?'prize':'coupon'):(['recipes','events','travel'].includes(scene)?'coupon':scene==='movies'?'player':scene==='books'?'desk':scene==='tools'?'software':'stock');
    const fallbackOffers={coupon:['Perk Basket',t('View the bonus offer','查看额外优惠')],prize:['Lucky Circle',t('See your visitor reward','查看访客奖励')],player:['Orbit Player',t('Explore playback options','查看播放选项')],desk:['Form & Field',t('Explore the reading corner','看看阅读角落')],software:['AppHarbor',t('Find another file tool','寻找文件工具')],stock:['Framekind',t('Find more images','寻找更多图片')]};
    const offerFor=site=>{
      let offer={};try{offer=C.adOffer?.(site)||{};}catch{}
      return {brand:clean(offer.brand)||fallbackOffers[site][0],cta:clean(offer.cta)||fallbackOffers[site][1]};
    };
    const link=(site,label,className)=>`<a class="${className}" href="${esc(C.adURL(site))}" target="_blank" rel="noopener" data-br-event-link="${site}">${esc(label)} <span aria-hidden="true">↗</span></a>`;
    const restoreInput=entry=>{
      if(!entry?.input)return;
      for(const [name,value] of entry.inputAttributes){if(value===null)entry.input.removeAttribute(name);else entry.input.setAttribute(name,value);}
    };
    const remove=(notify=false)=>{
      const entry=active;if(!entry)return;
      const focusBack=notify&&entry.node.contains(document.activeElement)?entry.input||entry.previousFocus:null;
      active=null;cancelAnimationFrame(frame);frame=0;
      entry.cleanup.forEach(fn=>fn());restoreInput(entry);entry.node.remove();
      if(focusBack?.isConnected&&focusBack!==document.body&&!focusBack.closest('[inert]'))focusBack.focus({preventScroll:true});
      if(notify)C.finish?.(entry.kind);
    };
    const position=()=>{
      frame=0;const entry=active;if(!entry||paused)return;
      if(entry.kind==='search'&&(!entry.input.isConnected||entry.input.form!==entry.form||!root.contains(entry.input))){remove(true);return;}
      const v=viewport(),margin=8;
      const width=Math.min(entry.kind==='search'?Math.max(280,entry.input.getBoundingClientRect().width):354,Math.max(1,v.width-margin*2));
      entry.node.style.width=width+'px';entry.node.style.maxHeight=Math.max(1,v.height-margin*2)+'px';
      const height=entry.node.getBoundingClientRect().height;
      let left=v.x+v.width-width-16,top=v.y+v.height-height-(v.height<420?margin:110);
      if(entry.kind==='search'){
        const r=entry.input.getBoundingClientRect(),below=v.y+v.height-r.bottom-margin,above=r.top-v.y-margin;
        left=r.left;top=below>=height||below>=above?r.bottom+5:r.top-height-5;
      }
      entry.node.style.left=clamp(left,v.x+margin,v.x+v.width-width-margin)+'px';
      entry.node.style.top=clamp(top,v.y+margin,v.y+v.height-height-margin)+'px';
    };
    const queuePosition=()=>{if(!frame&&active)frame=requestAnimationFrame(position);};
    const listen=(entry,target,type,fn,options)=>{target.addEventListener(type,fn,options);entry.cleanup.push(()=>target.removeEventListener(type,fn,options));};
    const base=(kind,html)=>{
      const node=document.createElement('aside');
      node.className='br-event-widget br-event-actions br-event-'+kind;node.dataset.eventKind=kind;
      node.setAttribute('aria-label',kind==='search'?t('Search suggestions with a sponsored offer','含赞助推广的搜索建议'):t('Sponsored bonus offer','额外赞助推广'));
      node.innerHTML=html;
      const entry={kind,node,cleanup:[],previousFocus:document.activeElement};active=entry;host.append(node);
      node.querySelectorAll('[data-event-close]').forEach(button=>listen(entry,button,'click',()=>remove(true)));
      listen(entry,window,'resize',queuePosition);listen(entry,window,'scroll',queuePosition,true);
      if(window.visualViewport){listen(entry,visualViewport,'resize',queuePosition);listen(entry,visualViewport,'scroll',queuePosition);}
      node.hidden=paused;node.inert=paused;
      return entry;
    };
    const closeButton=()=>`<button class="br-event-action-close" type="button" data-event-close aria-label="${t('Dismiss this offer','关闭这条推广')}">×</button>`;
    const chooseSuggestions=term=>{
      const values=suggestions[scene]||suggestions.wallpapers;
      const related=values.find(value=>value.toLowerCase().includes(term.toLowerCase())&&value.toLowerCase()!==term.toLowerCase());
      return [term,related||values.find(value=>value.toLowerCase()!==term.toLowerCase())||values[0]];
    };
    const submitSearch=(entry,value)=>{
      if(entry!==active||paused||!entry.input.isConnected)return;
      const {input,form}=entry;input.value=value;
      // Finish before native submit can leave the document. No advertisement is selected here.
      remove(true);
      input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
      const proto=input.ownerDocument.defaultView.HTMLFormElement.prototype;
      if(typeof proto.requestSubmit==='function')proto.requestSubmit.call(form);
      else proto.submit.call(form);
    };
    const updateSearch=entry=>{
      const term=clean(entry.input.value,90);if(term.length<2){remove(true);return;}
      const values=chooseSuggestions(term),buttons=[...entry.node.querySelectorAll('[data-event-suggestion]')];
      buttons.forEach((button,i)=>{button.dataset.eventSuggestion=values[i];button.querySelector('b').textContent=values[i];});
      queuePosition();
    };
    const showSearch=payload=>{
      const input=payload?.input;
      if(!(input instanceof HTMLInputElement)||!input.isConnected||!root.contains(input)||!input.form||input.disabled||input.readOnly||!['search','text'].includes(input.type))return false;
      const term=clean(input.value||payload?.term,90);if(term.length<2)return false;
      if(active?.kind==='search'&&active.input===input){updateSearch(active);return true;}
      remove();const site=siteFor('search'),offer=offerFor(site),id='br-event-suggestions-'+(++serial);
      const entry=base('search',`<div class="br-event-action-heading"><span>${t('Search suggestions','搜索建议')}</span>${closeButton()}</div><div class="br-event-action-scroll"><div class="br-event-query-options"><button type="button" data-event-suggestion><span aria-hidden="true">⌕</span><b></b><small>${t('Search','搜索')}</small></button><button type="button" data-event-suggestion><span aria-hidden="true">⌕</span><b></b><small>${t('Explore','探索')}</small></button></div><div class="br-event-search-sponsored"><small>${t('Sponsored','赞助')} · ${esc(offer.brand)}</small>${link(site,offer.cta,'br-event-search-offer')}<span>${t('A suggestion from an advertiser','来自广告商的推荐')}</span></div></div>`);
      entry.input=input;entry.form=input.form;entry.node.id=id;
      entry.inputAttributes=['aria-controls','aria-expanded'].map(name=>[name,input.getAttribute(name)]);
      input.setAttribute('aria-controls',id);input.setAttribute('aria-expanded','true');
      const buttons=[...entry.node.querySelectorAll('[data-event-suggestion]')];
      buttons.forEach(button=>listen(entry,button,'click',()=>submitSearch(entry,button.dataset.eventSuggestion)));
      listen(entry,input,'input',()=>updateSearch(entry));
      listen(entry,entry.form,'submit',()=>remove(true));
      const keydown=event=>{
        if(event.key==='Escape'){event.preventDefault();remove(true);return;}
        if(!['ArrowDown','ArrowUp'].includes(event.key))return;
        const index=buttons.indexOf(document.activeElement);
        if(document.activeElement!==input&&index===-1)return;
        event.preventDefault();
        if(document.activeElement===input){buttons[event.key==='ArrowDown'?0:buttons.length-1].focus({preventScroll:true});return;}
        if(index===-1)return;
        const next=index+(event.key==='ArrowDown'?1:-1);
        if(next<0||next>=buttons.length)input.focus({preventScroll:true});else buttons[next].focus({preventScroll:true});
      };
      listen(entry,input,'keydown',keydown);listen(entry,entry.node,'keydown',keydown);
      listen(entry,document,'pointerdown',event=>{if(event.target!==input&&!entry.node.contains(event.target))remove(true);},true);
      const focusout=()=>requestAnimationFrame(()=>{if(active===entry&&document.activeElement!==input&&!entry.node.contains(document.activeElement))remove(true);});
      listen(entry,input,'focusout',focusout);listen(entry,entry.node,'focusout',focusout);
      updateSearch(entry);position();return active===entry;
    };
    const showReward=payload=>{
      remove();const site=siteFor('reward'),offer=offerFor(site),label=clean(payload?.label,100);
      const entry=base('reward',`<div class="br-event-action-heading"><span>${t('Sponsored','赞助')} · ${esc(offer.brand)}</span>${closeButton()}</div><div class="br-event-action-scroll"><div class="br-event-reward-ticket"><span>${site==='coupon'?'RM100':t('VISITOR PICK','访客精选')}</span><small>${site==='coupon'?t('MEMBER BONUS','会员额外优惠'):t('A LITTLE EXTRA','额外惊喜')}</small></div><div class="br-event-reward-copy"><p class="br-event-reward-complete">✓ ${label?esc(label):t('Your action is complete','操作已完成')}</p><h2>${t('You unlocked a bonus.','你解锁了额外奖励。')}</h2><p>${t('Your task comes first. There is also an extra offer waiting if you would like a look.','先完成你的任务。如果想看一眼，这里还有一份额外推广。')}</p>${link(site,offer.cta,'br-event-reward-cta')}<button class="br-event-reward-return" type="button" data-event-close>${t('Continue my original task','继续原来的任务')}</button><small>${t('Member conditions apply.','须符合会员条件。')}</small></div></div>`);
      position();return active===entry;
    };
    return {
      show(kind,payload={}){if(destroyed)return false;return kind==='search'?showSearch(payload):kind==='reward'?showReward(payload):false;},
      pause(value){paused=Boolean(value);if(active){active.node.hidden=paused;active.node.inert=paused;if(!paused)queuePosition();}},
      clear(){remove();},
      reconcile(){if(active?.kind==='search'&&(!active.input.isConnected||active.input.form!==active.form))remove(true);else queuePosition();},
      destroy(){destroyed=true;remove();}
    };
  };
})();
