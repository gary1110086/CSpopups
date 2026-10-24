/* Dense commercial placements. The caller owns time, popup scheduling and Escape. */
(() => {
  'use strict';
  const controllers = new WeakMap();
  window.BROWSE_AD_PRESSURE = ({root, lang='en', t, esc, adURL, read, write} = {}) => {
    if (!root?.ownerDocument || typeof adURL !== 'function') throw new TypeError('An advertisement root and URL function are required.');
    controllers.get(root)?.destroy();
    const doc=root.ownerDocument;
    const tr=typeof t==='function'?t:(en,zh)=>lang==='zh'?zh:en;
    const escape=typeof esc==='function'?esc:value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const key='ad-pressure-v1', ids=['ticker','leaderboard','rail','inline-desk','inline-stock'];
    let destroyed=false, activeMs=0, quietUntil=0;
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
      ${label()}<b class="br-pressure-ticker-brand">PERK BASKET</b><span class="br-pressure-ticker-copy">${tr('MEMBER PERKS · A RM100 voucher could be yours','会员优惠 · RM100 购物券等你了解')}</span>${link('coupon',tr('See offer ↗','查看优惠 ↗'),'br-pressure-ticker-cta')}${close('ticker')}
    </aside>
    <aside class="br-pressure-leaderboard" data-pressure-surface="leaderboard" aria-label="${escape(tr('Desk accessories promotion','桌面用品推广'))}">
      <div class="br-pressure-leader-photo">${picture('desk')}${credit('desk')}</div>
      <div class="br-pressure-leader-brand"><b>FORM<br><i>&</i> FIELD</b><span>${tr('THE WORKSPACE EDIT','桌面精选系列')}</span></div>
      <div class="br-pressure-leader-copy">${label()}<strong>${tr('MAKE ROOM. <br>WORK BETTER.','腾出空间。<br>让工作更顺手。')}</strong><p>${tr('Desk accessories from RM39. Find your next everyday essential.','桌面用品 RM39 起，发现日常办公好物。')}</p></div>
      <div class="br-pressure-leader-action"><span>${tr('FROM','低至')} <b>RM39</b></span>${link('desk',tr('Shop the range ↗','立即选购 ↗'),'br-pressure-cta')}</div>${close('leaderboard')}
    </aside>
    <aside class="br-pressure-rail" data-pressure-surface="rail" aria-label="${escape(tr('Player promotion','播放器推广'))}">
      <header>${label()}${close('rail')}</header><b class="br-pressure-orbit">◉ ORBIT</b><span class="br-pressure-rail-kicker">PLAYBACK SUPPORT</span><div class="br-pressure-player-icon" aria-hidden="true">▶<span>HD</span></div><h2>${tr('Ready for<br>your next watch?','准备好<br>继续观看了吗？')}</h2><p>${tr('Explore player support, features and available packages.','了解播放器支持、功能与可用程序包。')}</p>${link('player',tr('View player ↗','查看播放器 ↗'),'br-pressure-cta')}<small class="br-pressure-rail-foot">ORBIT PLAYER · DESKTOP</small>
    </aside>`;
    doc.body.insertBefore(host,doc.body.firstChild);
    let inlineGroup=null;
    const mountInline=()=>{
      if(inlineGroup&&root.contains(inlineGroup))return;
      inlineGroup?.remove();inlineGroup=doc.createElement('section');inlineGroup.className='br-pressure-inline-group';
      inlineGroup.setAttribute('aria-label',tr('Sponsored offers','赞助推广'));
      inlineGroup.innerHTML=`<aside class="br-pressure-inline br-pressure-inline-desk" data-pressure-surface="inline-desk"><div class="br-pressure-inline-photo">${picture('desk')}${credit('desk')}</div><div class="br-pressure-inline-copy">${label()}<b>FORM & FIELD</b><h2>${tr('A place for everything.','每件东西，各有其位。')}</h2><p>${tr('A calmer desk starts with the small things. Explore lighting, storage and everyday accessories.','从一盏灯、一份收纳开始，探索桌面用品与日常配件。')}</p>${link('desk',tr('Explore the workspace collection ↗','探索桌面系列 ↗'),'br-pressure-inline-link')}</div>${close('inline-desk')}</aside>
      <aside class="br-pressure-inline br-pressure-inline-stock"><div class="br-pressure-inline-photo">${picture('ocean')}${credit('ocean')}</div><div class="br-pressure-inline-copy">${label()}<b>FRAMEKIND / IMAGES</b><h2>${tr('Give your next idea a view.','让下一个灵感，有画面。')}</h2><p>${tr('Search photographs, compare collections and find a new direction for your project.','检索照片、比较素材合集，为项目找到新的视觉方向。')}</p>${link('stock',tr('Browse image collections ↗','浏览图片合集 ↗'),'br-pressure-inline-link')}</div>${close('inline-stock')}</aside>`;
      inlineGroup.lastElementChild.dataset.pressureSurface='inline-stock';
      const main=root.querySelector('main')||root;
      // Keep advertisements outside catalogue grids and item lists.
      const footer=Array.from(main.children).find(node=>node.tagName==='FOOTER');
      main.insertBefore(inlineGroup,footer||null);inlineGroup.addEventListener('click',onClick);
    };
    function onClick(event){
      const button=event.target.closest?.('[data-pressure-close]');if(!button||destroyed)return;
      const id=button.dataset.pressureClose;if(!ids.includes(id))return;
      const fresh=state();fresh.dismissedUntil[id]=activeMs+10000;
      try{write?.(key,fresh);}catch{}
      apply();
    }
    host.addEventListener('click',onClick);
    const apply=()=>{
      if(destroyed)return;
      const visible=activeMs>=1000&&quietUntil<=activeMs, current=state();
      host.hidden=!visible;if(inlineGroup)inlineGroup.hidden=!visible;
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
