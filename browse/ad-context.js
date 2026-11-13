/* Local, page-aware campaigns. Native page controls and downloads are untouched. */
(() => {
  'use strict';
  window.BROWSE_AD_CONTEXT = C => {
    const {root,params,scene,t,esc,read,write,url,ads,adDescription}=C;
    const KEY='ad-campaign-v1';
    const profiles={
      courier:['parcel','Delivery failed: pay RM3 to reschedule.','派送失败：支付 RM3 改约。','Parcel redelivery','包裹改约'],
      search:['software','Pixelpress high-speed download.','Pixelpress 高速下载。','Software downloads','软件下载'],
      wallpapers:['stock','Find the bigger picture.','发现更大的画面。','Desktop backgrounds','桌面背景'],
      recipes:['coupon','A little extra for your next shop.','给下一次采购，多一点优惠。','Kitchen & everyday shopping','厨房与日常采购'],
      tools:['software','One more tool for your files.','为你的文件，再添一个工具。','Image & file utilities','图片与文件工具'],
      movies:['player','Settle in for your next watch.','下一场观影，准备好了。','Playback & movie night','播放与观影'],
      events:['coupon','Room & attraction offers: 70% off with a deposit.','客房与景点优惠：付订金享三折。','Destination & food guides','目的地与餐饮指南'],
      books:['desk','Make a little room for reading.','为阅读，留出一小片空间。','The reading corner','阅读角落'],
      museum:['stock','Find an image worth looking at twice.','找一张值得多看一眼的图片。','Images & collections','图片与收藏'],
      nature:['stock','Bring the outside into your next project.','把自然，放进下一个创作。','Nature photography','自然摄影'],
      travel:['parcel','Transit card balance low: top up RM10.','交通卡余额不足：充值 RM10。','Rail routes & interchanges','轨道路线与换乘'],
      market:['stock','Give your next photograph a place.','为下一张照片，找到好位置。','Photography & creative work','摄影与创作']
    };
    const profile=profiles[scene]||profiles.wallpapers;
    const clean=value=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,90):'';
    const topic=()=>clean(params.get('q'))||clean(root.querySelector('main h1, h1')?.textContent)||t(profile[3],profile[4]);
    const load=()=>{
      const raw=read(KEY,{}),obj=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
      return {site:typeof obj.site==='string'&&Object.hasOwn(ads,obj.site)?obj.site:profile[0],visits:Number.isInteger(obj.visits)?Math.max(0,Math.min(999,obj.visits)):0,lastScene:clean(obj.lastScene),lastTopic:clean(obj.lastTopic)};
    };
    let current=load(),suspended=false,frame=0,generation=0;
    const visit=()=>{const fresh=load();current={...fresh,visits:Math.min(999,fresh.visits+1),lastScene:scene,lastTopic:topic()};write(KEY,current);};
    visit();
    const phase=()=>Math.min(3,Math.max(1,load().visits));
    const adOffer=(site,ordinal=0)=>{
      const data=ads[site]||ads[current.site],fresh=load(),related=site===fresh.site,stage=phase();
      let title=data[1],description=adDescription(site),eyebrow=data[3];
      if(related){
        const ownProfile=site===profile[0];
        title=ownProfile?t(profile[1],profile[2]):title;
        if(stage===2)title=t('Still choosing? Take another look.','还在挑选？再看一眼。');
        if(stage===3)title=t('One more look before you go.','离开之前，再看一眼。');
        const subject=topic();
        const intro=params.get('q')?t('Searching for “'+subject+'”? ','正在寻找“'+subject+'”？ '):t('For your '+t(profile[3],profile[4]).toLowerCase()+'. ','为你的'+t(profile[3],profile[4])+'。');
        description=intro+description;
        if(stage>1)description+=t(' The '+data[0]+' collection is still here to explore.',' '+data[0]+' 的精选内容仍可继续浏览。');
        eyebrow=stage===1?t('Selected for this page','本页相关推广'):stage===2?t('A second look','再看一眼'):t('From a familiar sponsor','来自熟悉的赞助商');
      }
      let cta=data[2];
      if(scene==='travel'&&['parcel','security'].includes(site)){
        title=site==='security'?t('Verify your account to claim a fare rebate.','验证账号，领取车资回扣。'):ordinal%2?t('Fare evasion notice: settle the penalty now.','逃票通知：立即缴清罚款。'):t('Transit card balance low: top up RM10.','交通卡余额不足：充值 RM10。');
        description=site==='security'?t('Account check required before this advertised rebate can be released.','此推广声称领取回扣前须完成账号检查。'):t('This sponsored notice asks for a payment before your next journey.','这条赞助通知要求你在下一趟行程前付款。');
        eyebrow=t('Sponsored transit offer','交通主题赞助');cta=site==='security'?t('Check account','检查账号'):t('Continue to payment','前往付款');
      }
      if(scene==='events'&&['coupon','prize','parcel'].includes(site)){
        title=site==='prize'?t('A free Penang or Taiwan trip: claim your draw.','免费槟城或台湾之旅：领取抽选资格。'):t('Room & attraction offers: 70% off with a deposit.','客房与景点优惠：付订金享三折。');
        description=t('An advertised offer alongside your destination search. Read its deposit, claim and renewal terms.','与目的地搜索一同出现的推广。查看其订金、领取和续费条款。');
        eyebrow=t('Sponsored travel offer','旅游主题赞助');cta=site==='prize'?t('View travel draw','查看旅行抽选'):t('View deposit offer','查看订金优惠');
      }
      return {brand:data[0],title,cta,eyebrow,description};
    };
    const adURLMeta=site=>({campaign:load().site,phase:String(phase()),interest:scene,topic:topic()});
    const destination=site=>url('destination.html',{site,from:scene,...adURLMeta(site)});
    const placements={
      courier:{detail:'.tm-reschedule',fallback:'.tm-main'},
      search:{fallback:'.fl-results'},
      wallpapers:{grid:'.swb-browse .swb-grid',detail:'.swb-detail-info',inside:true,fallback:'.swb-browse,.swb-story'},
      recipes:{grid:'.pp-grid',detail:'.pp-ingredient-heading',before:true,fallback:'.pp-main'},
      tools:{detail:'.pp-tool-heading',fallback:'.pp-main'},
      movies:{grid:'.fm-grid',detail:'.fm-video-section,.fm-synopsis',before:true,fallback:'.fm-main'},
      events:{grid:'.ot-grid',detail:'.ot-practical',fallback:'.ot-main'},
      books:{grid:'.folio-rows',detail:'.reader-end,.cu-detail-intro',before:true,fallback:'.cu-results,.culture-site main'},
      museum:{grid:'.oc-grid',detail:'.cu-detail-intro',fallback:'.cu-results,.culture-site main'},
      nature:{grid:'.jg-bird-grid',detail:'.jg-detail-heading',fallback:'.jg-main'},
      travel:{grid:'.jt-route-cards',detail:'.jt-legs,.jt-station-layout,.jt-planner-layout',fallback:'.jt-main'},
      market:{grid:'.lp-catalogue .lp-grid',detail:'.lp-price-panel',inside:true,fallback:'.lp-main'}
    };
    const reconcile=()=>{
      const plan=placements[scene];if(!plan)return;
      const fresh=load(),offer=adOffer(fresh.site),key=[fresh.site,phase(),topic()].join('|');
      const existing=root.querySelector('[data-context-ad]');if(existing?.dataset.contextKey===key)return;
      existing?.remove();
      const node=document.createElement('aside');node.className='br-context-ad br-context-'+scene;
      node.hidden=true;
      node.dataset.contextAd='true';node.dataset.contextKey=key;node.dataset.campaignSite=fresh.site;node.dataset.campaignPhase=String(phase());
      node.setAttribute('aria-label',t('Sponsored recommendation','赞助推荐'));
      const icon={stock:'▧',desk:'F&F',software:'ZIP',player:'▶',coupon:'RM100',game:'▦',corn:'▶',security:'!',prize:'✦',parcel:'↗'}[fresh.site]||'↗';
      node.innerHTML=`<div class="br-context-mark" aria-hidden="true">${icon}</div><div class="br-context-copy"><small>${t('Sponsored','赞助')} · ${esc(offer.brand)}</small><a class="br-context-title" data-br-ad="${fresh.site}" href="${esc(destination(fresh.site))}" target="_blank" rel="noopener">${esc(offer.title)}</a><p>${esc(offer.description)}</p><span class="br-context-domain">${esc(offer.brand)} / ${esc(t(profile[3],profile[4]))}</span></div><a class="br-context-cta" data-br-ad="${fresh.site}" href="${esc(destination(fresh.site))}" target="_blank" rel="noopener">${esc(offer.cta)} ↗</a>`;
      const grid=plan.grid&&root.querySelector(plan.grid),target=root.querySelector(plan.detail);
      const detailFirst=target&&(params.has('id')||['route','station','read'].includes(params.get('view'))||!grid);
      const placeDetail=()=>{if(plan.inside)target.append(node);else target.insertAdjacentElement(plan.before?'beforebegin':'afterend',node);node.dataset.contextPlacement='detail';};
      if(detailFirst)placeDetail();
      else if(grid&&grid.children.length){const children=[...grid.children];grid.insertBefore(node,children[Math.min(scene==='travel'?1:3,children.length)]||null);node.dataset.contextPlacement='results';}
      else if(target)placeDetail();
      else {const fallback=root.querySelector(plan.fallback)||root.querySelector('main')||root;fallback.append(node);node.dataset.contextPlacement='support';}
    };
    const restore=()=>{
      suspended=true;const run=++generation;cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{if(run!==generation||!suspended)return;frame=0;suspended=false;visit();reconcile();});});
    };
    window.addEventListener('pageshow',event=>{if(event.persisted)restore();});
    window.addEventListener('pagehide',()=>{suspended=true;generation++;cancelAnimationFrame(frame);frame=0;});
    return {campaignSite:current.site,adOffer,adURLMeta,reconcile,restore};
  };
})();
