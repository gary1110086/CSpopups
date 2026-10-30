/* Complete local advertiser experiences. State contains choices, never credentials. */
window.BROWSE_DESTINATION_EXPERIENCES = function (D) {
  'use strict';
  const {root,t,esc,get,site,view,id,href,a,read,write,section,offers,voucher,prizeNames,rewardArt,complete,stepbar}=D;
  const seed=String(get('seed')||'visit').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40);
  const action=(name,label,extra='')=>`<button type="button" data-experience="${name}" ${extra}>${label}</button>`;
  const hash=s=>{let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
  const contextFields=()=>Object.fromEntries(['seed','campaign','phase','interest','topic','from'].filter(k=>get(k)).map(k=>[k,get(k)]));
  const form=(fields,body)=>`<form class="dx-offer-filters" method="get" action="destination.html">${Object.entries({site,lang:D.lang,v:get('v')||'corn2',...contextFields(),...fields}).map(([k,v])=>`<input type="hidden" name="${esc(k)}" value="${esc(v)}">`).join('')}${body}<button>${t('Find offers','查找优惠')}</button></form>`;
  const safeIds=value=>Array.isArray(value)?[...new Set(value.filter(n=>Number.isInteger(n)&&n>=0&&n<4))].slice(0,3):[];
  const selectedIds=()=>safeIds(read('compare-v2:'+seed,[]));
  const money=n=>'RM'+Number(n).toFixed(2).replace(/\.00$/,'');
  const props=[
    {min:150,channel:'store',places:['PB Market · Bangsar','PB Market · Cheras'],days:30},
    {min:35,channel:'both',places:['Coffee Club · KL Sentral','Coffee Club · SS15'],days:14},
    {min:120,channel:'online',places:['Home & Daily online catalogue'],days:30},
    {min:90,channel:'store',places:['Wellness Club · Mid Valley','Wellness Club · PJ'],days:21}
  ];
  const channelName=c=>c==='online'?t('Online','线上'):c==='store'?t('In store','门店'):t('Online & in store','线上与门店');
  const table=rows=>`<dl class="dd-specs">${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  const offerCard=i=>{
    const chosen=selectedIds().includes(i);
    return `<article>${a('offer',voucher(i),'',{id:i})}<div><small>${t(offers[i][3],offers[i][4])} · ${t('Klang Valley','巴生谷')}</small><h2>${a('offer',t(offers[i][0],offers[i][1]),'',{id:i})}</h2><p>${t('Voucher value','优惠券价值')} <b>${offers[i][2]}</b> · ${t('Minimum spend','最低消费')} ${money(props[i].min)}</p><p class="d-offer-metadata">${channelName(props[i].channel)} · ${props[i].days} ${t('days after activation','天有效期（激活后）')}</p><div class="dx-offer-actions">${a('offer',t('View conditions →','查看条件 →'),'d-text-link',{id:i})}${action('compare',chosen?t('✓ In comparison','✓ 已加入比较'):t('+ Compare','+ 比较'),`data-item="${i}" aria-pressed="${chosen}"`)}</div></div></article>`;
  };
  function coupon(){
    if(['home','categories'].includes(view)){
      const q=String(get('q')||'').toLowerCase().trim(),cat=['all','0','1','2','3'].includes(get('category'))?get('category'):'all';
      const min=[0,25,50,80,100].includes(Number(get('min')))?Number(get('min')):0;
      const channel=['all','online','store'].includes(get('channel'))?get('channel'):'all';
      const sort=['recommended','value','spend'].includes(get('sort'))?get('sort'):'recommended';
      let list=offers.map((_,i)=>i).filter(i=>(cat==='all'||i===Number(cat))&&Number(offers[i][2].replace('RM',''))>=min&&(!q||offers[i].join(' ').toLowerCase().includes(q))&&(channel==='all'||props[i].channel==='both'||props[i].channel===channel));
      if(sort==='value')list.sort((x,y)=>Number(offers[y][2].slice(2))-Number(offers[x][2].slice(2)));
      if(sort==='spend')list.sort((x,y)=>props[x].min-props[y].min);
      const select=(name,label,opts,current)=>`<label>${label}<select name="${name}">${opts.map(([value,text])=>`<option value="${value}" ${String(value)===String(current)?'selected':''}>${text}</option>`).join('')}</select></label>`;
      return `<div class="d-deal-location">◉ ${t('Klang Valley','巴生谷')} · ${t('Member offer directory','会员优惠目录')}</div><div class="dx-coupon-intro"><div><small>PERK BASKET / ${t('NEAR YOU','你的附近')}</small><h1>${t('A little more from your everyday.','为日常，多一点福利。')}</h1><p>${t('Compare the value, minimum spend and where each offer can be used.','比较优惠金额、最低消费及适用地点。')}</p></div>${a('compare',t('Compare offers','比较优惠')+' ('+selectedIds().length+')','d-primary')}</div>${form({view:'home'},`<label class="dx-filter-search">${t('Search','搜索')}<input name="q" value="${esc(q)}" placeholder="${t('Coffee, grocery…','咖啡、生鲜…')}"></label>${select('category',t('Category','分类'),[['all',t('All categories','全部分类')],...offers.map((o,i)=>[i,t(o[3],o[4])])],cat)}${select('min',t('Voucher value','优惠券金额'),[[0,t('Any value','不限')],[25,'RM25+'],[50,'RM50+'],[80,'RM80+'],[100,'RM100+']],min)}${select('channel',t('Use it','使用方式'),[['all',t('Anywhere','不限')],['online',t('Online','线上')],['store',t('In store','门店')]],channel)}${select('sort',t('Sort','排序'),[['recommended',t('Recommended','推荐')],['value',t('Highest value','金额最高')],['spend',t('Lowest minimum spend','最低消费优先')]],sort)}`)}<div class="d-results-heading"><h2>${t('Matching offers','符合条件的优惠')}</h2><span>${list.length} ${t('offers','项优惠')}</span></div><div class="d-offer-grid">${list.map(offerCard).join('')}</div>${!list.length?`<div class="d-empty"><h2>${t('No offers match all those choices.','没有同时符合这些条件的优惠。')}</h2><p>${t('Try a lower voucher value or another use location.','试试降低金额要求，或更换使用方式。')}</p>${a('home',t('Reset filters','重设筛选'),'d-primary')}</div>`:''}<div class="dx-compare-bar"><span>${t('Your comparison','你的比较')}: <b data-dx-count>${selectedIds().length}</b>/3</span>${a('compare',t('Review side by side →','并排查看 →'),'d-text-link')}</div><p class="d-deal-conditions">${t('Fictional member offers. Activation RM4.90; membership renews at RM39.90/month after 7 days unless cancelled. Read each summary.','虚构会员优惠。激活费 RM4.90；除非取消，7天后会员按 RM39.90/月续费。请阅读各项摘要。')}</p>`;
    }
    if(view==='compare'){
      const ids=selectedIds();
      if(!ids.length)return `<div class="d-prose">${section('PERK BASKET',t('Which offer fits your plans?','哪个优惠更适合你？'))}<p>${t('Choose up to three offers using + Compare. Their terms will appear side by side here.','通过“＋比较”选择最多三项优惠，在这里并排查看条件。')}</p>${a('home',t('Choose offers','选择优惠'),'d-primary')}</div>`;
      const rows=[
        [t('Voucher value','优惠金额'),i=>offers[i][2]],
        [t('Minimum spend','最低消费'),i=>money(props[i].min)],
        [t('Where to use','使用方式'),i=>channelName(props[i].channel)],
        [t('Valid after activation','激活后有效期'),i=>props[i].days+' '+t('days','天')],
        [t('Activation fee','激活费'),()=> 'RM4.90'],
        [t('Membership renewal','会员续费'),()=>t('RM39.90/month after 7 days','7天后 RM39.90/月')]
      ];
      return `${section('PERK BASKET / COMPARE',t('The details, side by side.','并排看清每一个条件。'))}<div class="dx-comparison-scroll"><table class="dx-comparison"><caption>${t('Compare up to three fictional member offers','比较最多三项虚构会员优惠')}</caption><thead><tr><th scope="col">${t('Offer details','优惠资料')}</th>${ids.map(i=>`<th scope="col"><small>${t(offers[i][3],offers[i][4])}</small><h2>${t(offers[i][0],offers[i][1])}</h2>${action('compare',t('Remove','移除'),`data-item="${i}" aria-pressed="true"`)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${label}</th>${ids.map(i=>`<td>${value(i)}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">${t('Next step','下一步')}</th>${ids.map(i=>`<td>${action('select',t('Choose this offer','选择这个优惠'),`data-item="${i}" class="d-primary"`)}</td>`).join('')}</tr></tbody></table></div><div class="d-toolbar">${a('home',t('← Back to offers','← 返回优惠'),'d-text-link')}${action('compare-clear',t('Clear comparison','清空比较'))}</div>`;
    }
    if(view==='offer'){
      const i=id%4,selected=read('selected-v2:'+seed,-1)===i;
      return `<div class="d-detail-split">${voucher(i)}<article><small>${t(offers[i][3],offers[i][4])} / PERK BASKET</small><h1>${t(offers[i][0],offers[i][1])}</h1>${selected?`<p class="dx-selection-mark">✓ ${t('Your selected offer','你所选的优惠')}</p>`:''}<p>${t('Something extra for your next visit. Review the conditions before starting the three-question member survey.','为下一次消费加点福利。开始三道会员问卷前，请核对使用条件。')}</p>${table([[t('Voucher value','优惠金额'),offers[i][2]],[t('Minimum spend','最低消费'),money(props[i].min)],[t('Where to use','使用方式'),channelName(props[i].channel)],[t('Valid after activation','激活后有效期'),props[i].days+' '+t('days','天')]])}${a('survey',t('Continue to member survey','继续会员问卷'),'d-primary',{id:i,step:1})} ${action('compare',selectedIds().includes(i)?t('✓ In comparison','✓ 已加入比较'):t('+ Compare','+ 比较'),`data-item="${i}" aria-pressed="${selectedIds().includes(i)}"`)}</article></div><div class="d-two dx-offer-details"><article><h2>${t('Participating locations','适用地点')}</h2><ul>${props[i].places.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h2>${t('What is included','包含内容')}</h2><p>${t('One voucher per example member. Use in a single transaction; unused value is not returned as cash. Product availability and minimum spend apply. These are fictional locations and offers.','每个示例会员限一张，须在同一次交易使用，余额不兑换现金。商品名额及最低消费条件适用。地点及优惠均为虚构。')}</p></article><aside class="d-panel"><h2>${t('Read before activation','激活前阅读')}</h2><p>${t('The first payment shown later is RM4.90. The offer also includes a seven-day membership, followed by RM39.90 monthly renewal unless cancelled.','后续页面显示的首次费用为 RM4.90。优惠还包含七天会员，除非取消，之后按每月 RM39.90 续费。')}</p>${a('compare',t('Compare these terms','比较这些条件'),'d-text-link')}</aside></div>`;
    }
    return null;
  }

  const level=Math.max(0,Math.min(2,Math.floor(Number(get('level'))||0)));
  const levelNames=[['First light','初见微光'],['Across the path','穿过小径'],['The whole garden','整座花园']];
  const scrambles=[[4],[0,8],[1,4,6]];
  const flip=(tiles,n)=>{for(const k of [n,n-3,n+3,...(n%3?[n-1]:[]),...(n%3<2?[n+1]:[])])if(k>=0&&k<9)tiles[k]=!tiles[k];return tiles;};
  const initialTiles=n=>scrambles[n].reduce((tiles,i)=>flip(tiles,i),Array(9).fill(false));
  const validTiles=v=>Array.isArray(v)&&v.length===9&&v.every(x=>typeof x==='boolean');
  const freshLevel=n=>({tiles:initialTiles(n),moves:0,hints:0,history:[]});
  function loadSignal(){
    const raw=read('signal-v2:'+seed,null),levels=[];
    for(let n=0;n<3;n++){
      const s=raw?.levels?.[n];
      levels.push(s&&validTiles(s.tiles)?{tiles:s.tiles.slice(),moves:Number.isInteger(s.moves)?Math.max(0,Math.min(100000,s.moves)):0,hints:Number.isInteger(s.hints)?Math.max(0,Math.min(100000,s.hints)):0,history:Array.isArray(s.history)?s.history.filter(h=>h&&validTiles(h.tiles)&&Number.isInteger(h.moves)&&h.moves>=0&&h.moves<=100000).slice(-40).map(h=>({tiles:h.tiles.slice(),moves:h.moves})):[]}:freshLevel(n));
    }
    return {levels,best:Array.from({length:3},(_,n)=>Number.isInteger(raw?.best?.[n])&&raw.best[n]>=0&&raw.best[n]<=100000?raw.best[n]:null)};
  }
  let hint=-1,focusCell=4;
  const solve=tiles=>{
    let best=null;
    for(let mask=0;mask<512;mask++){
      const copy=tiles.slice(),moves=[];
      for(let i=0;i<9;i++)if(mask&(1<<i)){flip(copy,i);moves.push(i);}
      if(copy.every(x=>!x)&&(!best||moves.length<best.length))best=moves;
    }
    return best||[];
  };
  function signalBody(){
    const all=loadSignal(),s=all.levels[level],won=s.tiles.every(x=>!x),best=all.best[level];
    return `<div class="dx-signal-hud"><span>${t('GARDEN','花园')} ${level+1}/3 · ${t(...levelNames[level])}</span><b>${s.moves} ${t('presses','次点击')}</b></div><div class="dx-signal-scene"><div class="dx-signal-grid" role="group" aria-label="${t('Nine garden lights. Arrow keys move; Enter or Space toggles.','九盏花园灯。方向键移动，Enter 或空格切换。')}">${s.tiles.map((on,n)=>`<button type="button" data-experience="signal-tile" data-cell="${n}" class="${on?'lit':''} ${hint===n?'dx-hint':''}" aria-label="${t('Light','灯')} ${n+1}: ${on?t('on','亮'):t('off','灭')}" aria-pressed="${on}" tabindex="${n===focusCell&&!won?'0':'-1'}" ${won?'disabled':''}><span aria-hidden="true">${on?'✦':'·'}</span><small>${n+1}</small></button>`).join('')}</div><p class="dx-signal-status" role="status">${won?t('Garden restored. All nine lights are quiet.','花园已恢复，九盏灯都安静下来。'):hint>=0?t('Try the outlined light. It is part of a shortest solution.','试试描边的灯，它属于最短解的一步。'):t('Turn every light off. Each press flips its neighbours too.','让每盏灯熄灭。点击也会切换相邻的灯。')}</p></div>${won?`<div class="dx-signal-result"><span aria-hidden="true">✿</span><div><h2>${t('A little garden, connected.','小小花园，连在一起。')}</h2><p>${s.moves} ${t('presses','次点击')} · ${s.hints} ${t('hints used','次提示')}${best!==null?' · '+t('Best','最佳')+': '+best:''}</p></div>${level<2?a('play',t('Next garden →','下一座花园 →'),'d-primary',{id:0,level:level+1}):a('home',t('Explore other games →','探索其他游戏 →'),'d-primary')}</div>`:''}<div class="dx-signal-tools">${action('signal-undo',t('↶ Undo','↶ 撤回'),!s.history.length?'disabled':'')}${action('signal-hint',t('Show a hint','显示提示'),won?'disabled':'')}${action('signal-reset',t('Restart this garden','重玩这座花园'))}</div><nav class="dx-signal-levels" aria-label="${t('Choose a garden','选择花园')}">${levelNames.map((name,n)=>a('play',`${all.best[n]!==null?'✓ ':''}${n+1}. ${t(...name)}`,n===level?'active':'',{id:0,level:n})).join('')}</nav>`;
  }
  function signal(){
    if(id%6!==0)return null;
    if(view==='detail')return `<div class="dx-signal-detail"><div><small>LITTLE SIGNAL STUDIO / PUZZLE</small><h1>Signal Garden</h1><p>${t('Nine lights. One quiet garden.','九盏灯，一座安静的花园。')}</p>${a('play',t('▶ Play the first garden','▶ 开始第一座花园'),'d-primary',{id:0,level:0})}</div><div class="dx-signal-preview" aria-hidden="true">${initialTiles(0).map(on=>`<span class="${on?'lit':''}">${on?'✦':'·'}</span>`).join('')}</div></div><div class="d-two"><article><h2>${t('A tiny chain reaction','小小连锁反应')}</h2><p>${t('Press a light to switch it and its neighbours. Your goal is to turn all nine lights off. Three hand-built gardens introduce the rule, then ask you to see the bigger pattern.','点击一盏灯会切换它与相邻的灯。目标是让九盏灯全部熄灭。三座手工设计的花园从规则入门，逐步引向更大的图案。')}</p><h2>${t('Stay for a moment. Leave whenever.','停留片刻，随时离开。')}</h2><p>${t('Use a mouse, touch the lights, or move with arrow keys and press Enter. Undo and hints are always available. Every press is saved in this tab, including across game pages.','使用鼠标、触摸灯，或通过方向键移动并按 Enter。可撤回，也可看提示。每一步保存在本标签页，切换游戏页面后仍会保留。')}</p></article><aside class="d-panel">${table([[t('Gardens','花园'),'3'],[t('Controls','操作'),t('Mouse / touch / keyboard','鼠标／触摸／键盘')],[t('Time limit','限时'),t('None','无')],[t('Account / download','账户／下载'),t('Not required','无需')]])}</aside></div>`;
    if(view==='play')return `<div class="d-play-page"><div class="d-row-heading"><div><small>LITTLE SIGNAL STUDIO / THREE SMALL GARDENS</small><h1>Signal Garden</h1></div>${a('detail',t('← Game page','← 游戏详情'),'d-text-link',{id:0})}</div><div id="dx-signal-root" class="dx-signal-root">${signalBody()}</div><p class="d-fine">${t('Arrow keys move between lights. Enter / Space toggles. Number keys 1–9 work while the grid has focus. Progress saves automatically.','方向键在灯之间移动，Enter／空格切换。网格获得焦点时，可按数字键1–9。进度自动保存。')}</p></div>`;
    return null;
  }

  const spinRecord=()=>{const x=read('spin-v2:'+seed,null);return x&&Number.isInteger(x.reward)&&x.reward>=0&&x.reward<3?{reward:x.reward,segment:Number.isInteger(x.segment)&&x.segment>=0&&x.segment<6&&x.segment%3===x.reward?x.segment:x.reward}:null;};
  let spinTimer;
  function spinBody(){
    const won=spinRecord();
    if(won)return `<section class="dx-spin-award" aria-live="polite"><small>LUCKY CIRCLE / LC-2048</small><h2>${t('Your circle has landed.','转盘已停下。')}</h2><div class="d-prize-art prize-${won.reward}">${rewardArt(won.reward)}</div><h3>${prizeNames[won.reward][0]}</h3><p>${t('Illustrative reward value','示例奖品价值')}: <b>${prizeNames[won.reward][1]}</b></p>${a('claim',t('Review this reward →','查看这份奖励 →'),'d-primary',{id:won.reward})}<p class="d-fine">${t('Local simulation · No real prize has been won or reserved.','本地模拟 · 未获得或保留实际奖品。')}</p></section>`;
    return `<div class="dx-wheel-wrap"><div class="dx-wheel-pointer" aria-hidden="true">▼</div><div class="dx-wheel" aria-hidden="true">${Array.from({length:6},(_,n)=>`<span style="--slice:${n}"><b>${['499','800','699'][n%3]}</b><small>RM</small></span>`).join('')}<i>LC</i></div></div><div class="dx-spin-controls">${action('spin',t('Spin the circle','转动圆盘'),'class="d-primary"')}<p role="status" data-spin-status>${t('One local spin. See which reward the circle selects.','一次本地转盘，看看会选中哪一份奖励。')}</p><small>${t('Simulation only · Fictional rewards, no cash value.','仅为模拟 · 虚构奖励，无现金价值。')}</small></div>`;
  }
  function prize(){
    if(['home','spin'].includes(view))return `<div class="dx-spin-layout"><article><small>LUCKY CIRCLE / REWARD ALLOCATION</small><h1>${t('A little turn.<br>A little surprise.','轻轻一转。<br>一点惊喜。')}</h1><p>${t('A pair of headphones, a weekend away or a new watch. Give the circle a turn and explore the reward it selects.','一副耳机、一趟周末旅行，或一只新手表。转动圆盘，查看它选中的好礼。')}</p><ul class="dx-reward-list">${prizeNames.map(([name,value])=>`<li><span>${name}</span><b>${value}</b></li>`).join('')}</ul>${a('rewards',t('See the full reward catalogue →','查看完整奖励目录 →'),'d-text-link')}<p class="d-fine">${t('Interactive fictional promotion. The following claim pathway demonstrates a release-fee request. Nothing is purchased.','互动虚构推广，后续领取流程演示索取发放费的模式，不会产生购买。')}</p></article><div id="dx-spin-surface" class="dx-spin-surface">${spinBody()}</div></div><div class="d-rewards-process"><h2>${t('From circle to claim','从转盘到领取')}</h2><ol><li>${t('Spin once to select a local example reward.','转动一次，选出本地示例奖励。')}</li><li>${t('Review the selected item and its stated value.','核对所选物品及标示价值。')}</li><li>${t('Follow the delivery steps and read the release conditions.','沿配送步骤继续，阅读发放条件。')}</li></ol></div>`;
    if(view==='result')return `<div class="d-prose"><div id="dx-spin-surface" class="dx-spin-surface">${spinRecord()?spinBody():`<h1>${t('Your circle is waiting.','你的转盘还未开始。')}</h1>${a('spin',t('Open the circle','打开转盘'),'d-primary')}`}</div></div>`;
    return null;
  }
  const refreshSignal=(focusName=null)=>{
    const surface=root.querySelector('#dx-signal-root');if(!surface)return;
    surface.innerHTML=signalBody();
    const target=focusName?surface.querySelector(`[data-experience="${focusName}"]:not([disabled])`):surface.querySelector(`[data-cell="${focusCell}"]:not([disabled])`);
    (target||surface.querySelector('.dx-signal-result a')||surface.querySelector('[data-experience="signal-reset"]'))?.focus({preventScroll:true});
  };
  function signalMove(n){
    if(!Number.isInteger(n)||n<0||n>8)return;
    const all=loadSignal(),s=all.levels[level];if(s.tiles.every(x=>!x))return;
    s.history.push({tiles:s.tiles.slice(),moves:s.moves});s.history=s.history.slice(-40);flip(s.tiles,n);s.moves=Math.min(100000,s.moves+1);hint=-1;focusCell=n;
    if(s.tiles.every(x=>!x))all.best[level]=all.best[level]===null?s.moves:Math.min(all.best[level],s.moves);
    write('signal-v2:'+seed,all);refreshSignal();
  }
  root.addEventListener('click',event=>{
    const el=event.target.closest('[data-experience]');if(!el||!root.contains(el))return;
    const act=el.dataset.experience,n=Number(el.dataset.item);
    if(act==='compare'){
      if(!Number.isInteger(n)||n<0||n>3)return;
      let ids=selectedIds();if(ids.includes(n))ids=ids.filter(x=>x!==n);else if(ids.length<3)ids.push(n);else{const message=root.querySelector('.d-toast');if(message){message.textContent=t('Compare up to three offers. Remove one to add another.','最多比较三项，请先移除一项再添加。');message.classList.add('show');setTimeout(()=>message.classList.remove('show'),2600);}return;}
      write('compare-v2:'+seed,ids);
      if(view==='compare'){root.querySelector('.d-main').innerHTML=coupon();return;}
      root.querySelectorAll('[data-experience="compare"]').forEach(button=>{const on=ids.includes(Number(button.dataset.item));button.textContent=on?t('✓ In comparison','✓ 已加入比较'):t('+ Compare','+ 比较');button.setAttribute('aria-pressed',String(on));});
      root.querySelectorAll('[data-dx-count]').forEach(x=>x.textContent=ids.length);
      const compareLink=root.querySelector('.dx-coupon-intro a');if(compareLink)compareLink.textContent=t('Compare offers','比较优惠')+' ('+ids.length+')';
    }
    if(act==='compare-clear'){write('compare-v2:'+seed,[]);root.querySelector('.d-main').innerHTML=coupon();}
    if(act==='select'&&Number.isInteger(n)&&n>=0&&n<4){write('selected-v2:'+seed,n);location.assign(href('offer',{id:n}));}
    if(act==='signal-tile')signalMove(Number(el.dataset.cell));
    if(act==='signal-reset'){const all=loadSignal();all.levels[level]=freshLevel(level);write('signal-v2:'+seed,all);hint=-1;focusCell=4;refreshSignal();}
    if(act==='signal-undo'){const all=loadSignal(),s=all.levels[level],previous=s.history.pop();if(!previous)return;s.tiles=previous.tiles;s.moves=previous.moves;hint=-1;write('signal-v2:'+seed,all);refreshSignal('signal-undo');}
    if(act==='signal-hint'){const all=loadSignal(),s=all.levels[level];hint=solve(s.tiles)[0]??-1;s.hints=Math.min(100000,s.hints+1);write('signal-v2:'+seed,all);refreshSignal('signal-hint');}
    if(act==='spin'){
      if(spinRecord())return;
      const segment=hash(seed+':circle')%6,reward=segment%3;write('spin-v2:'+seed,{reward,segment});
      el.disabled=true;const wheel=root.querySelector('.dx-wheel'),status=root.querySelector('[data-spin-status]');
      status.textContent=t('The circle is turning…','圆盘转动中…');
      wheel.style.setProperty('--spin-end',(2160-segment*60)+'deg');wheel.classList.add('spinning');
      const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?100:2700;
      clearTimeout(spinTimer);spinTimer=setTimeout(()=>{const surface=root.querySelector('#dx-spin-surface');if(!surface)return;surface.innerHTML=spinBody();surface.querySelector('a')?.focus({preventScroll:true});},delay);
    }
  });
  root.addEventListener('keydown',event=>{
    const grid=event.target.closest('.dx-signal-grid');if(!grid)return;
    const n=Number(event.target.closest('[data-cell]')?.dataset.cell);
    if(!Number.isInteger(n))return;
    const row=Math.floor(n/3),col=n%3;let next;
    if(event.key==='ArrowLeft')next=row*3+(col+2)%3;
    if(event.key==='ArrowRight')next=row*3+(col+1)%3;
    if(event.key==='ArrowUp')next=((row+2)%3)*3+col;
    if(event.key==='ArrowDown')next=((row+1)%3)*3+col;
    if(next!==undefined){event.preventDefault();focusCell=next;grid.querySelectorAll('button').forEach(b=>b.tabIndex=Number(b.dataset.cell)===next?0:-1);grid.querySelector(`[data-cell="${next}"]`)?.focus();}
    if(/^[1-9]$/.test(event.key)){event.preventDefault();signalMove(Number(event.key)-1);}
  });
  return {
    render:()=>site==='game'?signal():site==='prize'?prize():site==='coupon'?coupon():null,
    afterRender:()=>{},
    resume:()=>{clearTimeout(spinTimer);hint=-1;},
    banner:()=>get('campaign')===site&&get('topic')?`<aside class="dx-context-note"><span>${t('YOUR BROWSING PICK','浏览推荐')}</span> ${esc(String(get('topic')).slice(0,100))} <small>· ${t('Explore this advertiser’s collection','探索这家广告商的内容')}</small></aside>`:''
  };
};
