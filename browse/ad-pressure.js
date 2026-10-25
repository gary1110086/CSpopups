/* Dense commercial placements. The caller owns time, popup scheduling and Escape. */
(() => {
  'use strict';
  const controllers = new WeakMap();
  window.BROWSE_AD_PRESSURE = ({root, lang='en', t, esc, adURL, adOffer, campaignSite, read, write} = {}) => {
    if (!root?.ownerDocument || typeof adURL !== 'function') throw new TypeError('An advertisement root and URL function are required.');
    controllers.get(root)?.destroy();
    const doc=root.ownerDocument;
    const tr=typeof t==='function'?t:(en,zh)=>lang==='zh'?zh:en;
    const escape=typeof esc==='function'?esc:value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const key='ad-pressure-v1', ids=['ticker','leaderboard','rail','inline-desk','inline-stock'];
    let destroyed=false, activeMs=0, quietUntil=0;
    const featuredSite=['corn','desk','stock','game','security','player','software','prize','coupon','parcel'].includes(campaignSite)?campaignSite:'coupon';
    const featured=()=>typeof adOffer==='function'?adOffer(featuredSite,0):{brand:'Perk Basket',title:tr('A RM100 voucher could be yours','了解 RM100 购物券'),cta:tr('See offer','查看优惠'),eyebrow:tr('Member perks','会员优惠'),description:tr('Explore shopping rewards and member offers.','浏览购物奖励与会员优惠。')};
    let featuredSignature='';
    const glyph={corn:'▶',desk:'F&F',stock:'▧',game:'▦',security:'!',player:'▶',software:'ZIP',prize:'✦',coupon:'RM100',parcel:'↗'}[featuredSite];
    const state=()=>{
      let raw;try{raw=read?.(key,{});}catch{raw={};}
      const values=raw&&typeof raw==='object'&&!Array.isArray(raw)&&raw.dismissedUntil&&typeof raw.dismissedUntil==='object'?raw.dismissedUntil:{};
      const dismissedUntil={};
      for(const id of ids)if(Number.isFinite(values[id])&&values[id]>=0)dismissedUntil[id]=values[id];
      return {dismissedUntil};
    };
    const link=(site,text,cls='')=>`<a class="${cls}" href="${escape(adURL(site))}" target="_blank" rel="noopener">${text}</a>`;
    const close=id=>`<button class="br-pressure-close" type="button" data-pressure-close="${id}" aria-label="${escape(tr('Dismiss this advertisement','关闭这条广告'))}">×</button>`;
    const label=()=>`<small class="br-pressure-disclosure">${tr('Advertisement','广告')}</small>`;
    const credits={
      desk:{file:'assets/real-shop-stand-thumb.webp',credit:'Craft Kitties / Unsplash',license:'Unsplash License',licenseUrl:'https://unsplash.com/license',sourceUrl:'https://unsplash.com/photos/a-laptop-on-a-table-IW8Off25VKQ'},
      ocean:{file:'assets/real-wall-blue-current-thumb.webp',credit:'Austin Schmid',license:'CC0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',sourceUrl:'https://commons.wikimedia.org/wiki/File:Blue_ocean_wave_(Unsplash).jpg'}
    };
    const picture=(name,cls='')=>{const m=credits[name];return `<img class="${cls}" src="${m.file}" alt="${escape(name==='desk'?tr('Reference photograph of a work desk','工作桌参考照片'):tr('Blue ocean wave','蓝色海浪'))}" loading="lazy" width="160" height="100">`;};
    const credit=name=>{const m=credits[name];return `<span class="br-pressure-credit">${tr('Reference photo','参考照片')}: <a href="${escape(m.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(m.credit)}</a> · <a href="${escape(m.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(m.license)}</a></span>`;};
    const host=doc.createElement('div');host.className='br-pressure';host.hidden=true;
    host.innerHTML=`<aside class="br-pressure-ticker" data-pressure-surface="ticker" aria-label="${escape(tr('Shopping promotion','购物推广'))}">
      ${label()}<b class="br-pressure-ticker-brand">${escape(featured().brand)}</b><span class="br-pressure-ticker-copy">${escape(featured().title)}</span>${link(featuredSite,escape(featured().cta)+' ↗','br-pressure-ticker-cta')}${close('ticker')}
    </aside>
    <aside class="br-pressure-leaderboard" data-pressure-surface="leaderboard" aria-label="${escape(tr('Desk accessories promotion','桌面用品推广'))}">
      <div class="br-pressure-leader-photo">${picture('desk')}${credit('desk')}</div>
      <div class="br-pressure-leader-brand"><b>FORM<br><i>&</i> FIELD</b><span>${tr('THE WORKSPACE EDIT','桌面精选系列')}</span></div>
      <div class="br-pressure-leader-copy">${label()}<strong>${tr('MAKE ROOM. <br>WORK BETTER.','腾出空间。<br>让工作更顺手。')}</strong><p>${tr('Desk accessories from RM39. Find your next everyday essential.','桌面用品 RM39 起，发现日常办公好物。')}</p></div>
      <div class="br-pressure-leader-action"><span>${tr('FROM','低至')} <b>RM39</b></span>${link('desk',tr('Shop the range ↗','立即选购 ↗'),'br-pressure-cta')}</div>${close('leaderboard')}
    </aside>
    <aside class="br-pressure-rail" data-pressure-surface="rail" data-campaign-site="${featuredSite}" aria-label="${escape(tr('Sponsored recommendation','赞助推荐'))}">
      <header>${label()}${close('rail')}</header><b class="br-pressure-orbit">${escape(featured().brand)}</b><span class="br-pressure-rail-kicker">${escape(featured().eyebrow)}</span><div class="br-pressure-player-icon" aria-hidden="true">${glyph}</div><h2>${escape(featured().title)}</h2><p>${escape(featured().description)}</p>${link(featuredSite,escape(featured().cta)+' ↗','br-pressure-cta')}<small class="br-pressure-rail-foot">${tr('A LITTLE MORE TO EXPLORE','再看一点新内容')}</small>
    </aside>`;
    doc.body.insertBefore(host,doc.body.firstChild);
    let inlineGroup=null;
    const mountInline=()=>{
      if(inlineGroup&&root.contains(inlineGroup))return;
      inlineGroup?.remove();inlineGroup=doc.createElement('section');inlineGroup.className='br-pressure-inline-group';
      inlineGroup.setAttribute('aria-label',tr('Sponsored offers','赞助推广'));
      inlineGroup.innerHTML=`<aside class="br-pressure-inline br-pressure-inline-desk" data-pressure-surface="inline-desk" data-campaign-site="${featuredSite}"><div class="br-pressure-inline-photo">${featuredSite==='desk'?picture('desk')+credit('desk'):featuredSite==='stock'?picture('ocean')+credit('ocean'):`<div class="br-pressure-campaign-visual" aria-hidden="true"><span>${glyph}</span><b>${escape(featured().brand)}</b></div>`}</div><div class="br-pressure-inline-copy">${label()}<b>${escape(featured().brand)}</b><h2>${escape(featured().title)}</h2><p>${escape(featured().description)}</p>${link(featuredSite,escape(featured().cta)+' ↗','br-pressure-inline-link')}</div>${close('inline-desk')}</aside>
      <aside class="br-pressure-inline br-pressure-inline-stock"><div class="br-pressure-inline-photo">${picture('ocean')}${credit('ocean')}</div><div class="br-pressure-inline-copy">${label()}<b>FRAMEKIND / IMAGES</b><h2>${tr('Give your next idea a view.','让下一个灵感，有画面。')}</h2><p>${tr('Search photographs, compare collections and find a new direction for your project.','检索照片、比较素材合集，为项目找到新的视觉方向。')}</p>${link('stock',tr('Browse image collections ↗','浏览图片合集 ↗'),'br-pressure-inline-link')}</div>${close('inline-stock')}</aside>`;
      inlineGroup.lastElementChild.dataset.pressureSurface='inline-stock';
      const main=root.querySelector('main')||root;
      // Keep advertisements outside catalogue grids and item lists.
      const footer=Array.from(main.children).find(node=>node.tagName==='FOOTER');
      main.insertBefore(inlineGroup,footer||null);inlineGroup.addEventListener('click',onClick);
      featuredSignature='';
    };
    const refreshCampaign=()=>{
      const offer=featured(),signature=JSON.stringify(offer);if(signature===featuredSignature)return;featuredSignature=signature;
      host.querySelector('.br-pressure-ticker-brand').textContent=offer.brand;
      host.querySelector('.br-pressure-ticker-copy').textContent=offer.title;
      const tickerLink=host.querySelector('.br-pressure-ticker-cta');tickerLink.textContent=offer.cta+' ↗';tickerLink.href=adURL(featuredSite);
      const rail=host.querySelector('.br-pressure-rail');rail.querySelector('.br-pressure-orbit').textContent=offer.brand;rail.querySelector('.br-pressure-rail-kicker').textContent=offer.eyebrow;rail.querySelector('h2').textContent=offer.title;rail.querySelector('p').textContent=offer.description;
      const railLink=rail.querySelector('.br-pressure-cta');railLink.textContent=offer.cta+' ↗';railLink.href=adURL(featuredSite);
      const inline=inlineGroup?.querySelector('.br-pressure-inline-desk .br-pressure-inline-copy');
      if(inline){inline.querySelector('b').textContent=offer.brand;inline.querySelector('h2').textContent=offer.title;inline.querySelector('p').textContent=offer.description;const a=inline.querySelector('a');a.textContent=offer.cta+' ↗';a.href=adURL(featuredSite);}
    };
    function onClick(event){
      const button=event.target.closest?.('[data-pressure-close]');if(!button||destroyed)return;
      const id=button.dataset.pressureClose;if(!ids.includes(id))return;
      const fresh=state();fresh.dismissedUntil[id]=activeMs+10000;
      try{write?.(key,fresh);}catch{}
      apply();
      window.dispatchEvent(new CustomEvent('browse:ad-dismiss',{detail:{site:'ambient'}}));
    }
    host.addEventListener('click',onClick);
    const apply=()=>{
      if(destroyed)return;
      const visible=activeMs>=1000&&quietUntil<=activeMs, current=state();
      host.hidden=!visible;if(inlineGroup)inlineGroup.hidden=!visible;
      for(const contextual of root.querySelectorAll('[data-context-ad]'))contextual.hidden=!visible;
      for(const node of [...host.querySelectorAll('[data-pressure-surface]'),...(inlineGroup?inlineGroup.querySelectorAll('[data-pressure-surface]'):[])])node.hidden=!visible||(current.dismissedUntil[node.dataset.pressureSurface]||0)>activeMs;
      const ticker=host.querySelector('[data-pressure-surface="ticker"]');
      host.style.height=visible&&!ticker.hidden?'36px':'0px';
    };
    const update=({activeMs:clock=0,quietUntil:quiet=0,active=false,modalOpen=false}={})=>{
      if(destroyed)return;
      activeMs=Number.isFinite(clock)?Math.max(0,clock):0;
      quietUntil=Number.isFinite(quiet)?Math.max(0,quiet):0;
      host.inert=Boolean(modalOpen);host.classList.toggle('br-pressure-paused',!active);
      if(activeMs>=1000)mountInline();
      if(inlineGroup){inlineGroup.classList.toggle('br-pressure-paused',!active);inlineGroup.inert=Boolean(modalOpen);}
      refreshCampaign();
      apply();
    };
    const destroy=()=>{
      if(destroyed)return;destroyed=true;host.removeEventListener('click',onClick);host.remove();
      inlineGroup?.removeEventListener('click',onClick);inlineGroup?.remove();
      if(controllers.get(root)===api)controllers.delete(root);
    };
    const api={update,destroy};controllers.set(root,api);return api;
  };
})();
