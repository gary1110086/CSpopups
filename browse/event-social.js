/* Scripted sponsor conversations. Timing and random selection belong to event-director. */
(() => {
  'use strict';
  window.BROWSE_EVENT_SOCIAL = C => {
    const {root,host,scene,t,esc,read,write}=C;
    const KEY='event-social-v1';
    const sites=['corn','desk','stock','game','security','player','software','prize','coupon','parcel'];
    const sponsors={corn:'Cornhub',desk:'Form & Field',stock:'Framekind',game:'Tiny Arcade',security:'SecureLane',player:'Orbit Player',software:'AppHarbor',prize:'Lucky Circle',coupon:'Perk Basket',parcel:'NorthPost'};
    const profiles={
      wallpapers:['Looking for a calmer desktop?','想让桌面清爽一点？','Something minimal','简洁一点','Sharper photographs','更清晰的照片','A new picture helps. A few desk upgrades might help even more.','换一张图片不错，再添一点桌面配件也许更好。','desk'],
      recipes:['Keeping lunch quick today?','今天想快一点解决午餐？','One quick lunch','一顿快捷午餐','Cooking for a few','多做几人份','There could be a member perk for your next grocery shop.','下次采购食材，也许可以用上会员优惠。','coupon'],
      tools:['Trying to meet an upload limit?','正在满足上传大小限制？','Make the file smaller','把文件变小','Keep it looking sharp','尽量保持清晰','One more file utility could make your next upload easier.','再添一个文件工具，下次上传也许更方便。','software'],
      movies:['Still choosing something to watch?','还在挑今晚看什么？','Something short','短一点的','A proper movie night','认真安排一场电影','A playback upgrade could get your movie night ready.','升级一下播放器，也许就能准备好今晚的观影。','player'],
      events:['Putting the weekend together?','正在安排周末？','Keep it inexpensive','预算少一点','Find something indoors','找室内活动','A little member voucher could go with your day out.','出游时，也许能顺便用上一张会员优惠券。','coupon'],
      books:['Found a book for your next quiet hour?','找到下一段安静时光要读的书了吗？','A familiar classic','熟悉的经典','Something different','想读点不一样的','A reading corner feels better with the right lamp beside it.','配上一盏合适的台灯，阅读角落会更舒服。','desk'],
      museum:['Looking for a piece worth a closer look?','想找一件值得仔细看的作品？','Show me more detail','想多看一些细节','A different collection','换一组作品','An image collection could give your next project a starting point.','一组图库素材，也许能给你的下个创作一个起点。','stock'],
      nature:['Got a bird in mind?','已经想到是哪一种鸟了吗？','Check its markings','核对外观特征','Compare another bird','比较另一种鸟','A nature image collection might help your next photo project.','自然图库，也许能帮上你的下个摄影项目。','stock'],
      travel:['Planning your next stop?','正在规划下一站？','Fewer changes','少换乘一点','A useful stop on the way','沿途顺便停一站','A shopping perk could give you another reason to stop along the way.','一张购物优惠券，也许能成为沿途停留的另一个理由。','coupon'],
      market:['Checking what comes with the camera?','正在检查相机附带什么吗？','Check the accessories','先检查配件','Compare another model','再比较一个型号','Your next photograph could use a place in a new collection.','你的下一张照片，也许可以加入一组新图库。','stock']
    };
    const profile=profiles[scene]||profiles.wallpapers;
    const int=(value,max=99)=>Number.isInteger(value)?Math.max(0,Math.min(max,value)):0;
    const load=()=>{const value=read(KEY,{}),data=value&&typeof value==='object'&&!Array.isArray(value)?value:{};return{chats:int(data.chats),notices:int(data.notices),declines:int(data.declines)};};
    let widget=null,kind=null,paused=false,departed=false,destroyed=false,focusBefore=null,tabPending=false,titleBefore=null,chatStep=0,chatHistory=[],tier=0,layoutFrame=0;
    const merge=patch=>{if(!departed&&!destroyed)write(KEY,{...load(),...patch});};
    const chooseSite=value=>typeof value==='string'&&sites.includes(value)?value:'coupon';
    const campaignSite=()=>chooseSite(C.campaignSite);
    const safeOffer=site=>{const value=C.adOffer?.(site);return value&&typeof value==='object'?value:{};};
    const brand=site=>{const value=safeOffer(site).brand;return typeof value==='string'&&value.trim()?value.slice(0,60):sponsors[site];};
    const link=(site,label,extra='')=>`<a class="br-social-offer ${extra}" data-br-event-link="${site}" href="${esc(C.adURL(site))}" target="_blank" rel="noopener">${esc(label)} <span aria-hidden="true">↗</span></a>`;
    const viewport=()=>{const v=window.visualViewport;return{x:v?.offsetLeft||0,y:v?.offsetTop||0,width:v?.width||innerWidth,height:v?.height||innerHeight};};
    const layout=()=>{
      if(!widget?.isConnected)return;
      const v=viewport(),gap=Math.min(108,Math.max(10,v.height*.12));
      widget.style.width=Math.max(1,Math.min(kind==='tab'?330:354,v.width-24))+'px';
      widget.style.maxWidth=Math.max(1,v.width-24)+'px';
      widget.style.maxHeight=Math.max(45,v.height-gap-12)+'px';
      const bounds=widget.getBoundingClientRect();
      widget.style.left=(v.x+Math.max(12,v.width-bounds.width-12))+'px';
      widget.style.top=(v.y+Math.max(12,v.height-gap-bounds.height))+'px';
    };
    const restoreTitle=()=>{if(titleBefore!==null){document.title=titleBefore;titleBefore=null;}tabPending=false;};
    const requestLayout=()=>{layout();cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(()=>{layoutFrame=0;layout();});};
    const removeWidget=restoreFocus=>{
      const hadFocus=widget?.contains(document.activeElement);
      cancelAnimationFrame(layoutFrame);layoutFrame=0;
      widget?.remove();widget=null;
      if(restoreFocus&&hadFocus&&focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
      focusBefore=null;
    };
    const reset=(restoreFocus=true)=>{restoreTitle();removeWidget(restoreFocus);kind=null;chatHistory=[];};
    const finish=()=>{const ended=kind;reset();if(ended)C.finish?.(ended);};
    const mount=(name,header,subhead,style)=>{
      kind=name;focusBefore=document.activeElement;
      widget=document.createElement('section');widget.className='br-event-widget br-social br-social-'+name+' '+style;
      widget.dataset.eventKind=name;widget.dataset.paused=String(paused);
      widget.setAttribute('role','region');widget.setAttribute('aria-label',t('Sponsored message','赞助信息'));
      widget.innerHTML=`<header class="br-social-head"><div class="br-social-avatar" aria-hidden="true">${name==='chat'?'m':name==='tab'?'1':'%'}</div><div class="br-social-identity"><strong>${esc(header)}</strong><span>${esc(subhead)}</span></div><button class="br-social-close" data-event-close type="button" aria-label="${t('Dismiss advertisement','关闭广告')}">×</button></header><div class="br-social-content"></div><footer class="br-social-foot">${t('Sponsored · Esc clears offers','赞助内容 · Esc 清除广告')}</footer>`;
      host.append(widget);
      widget.querySelector('[data-event-close]').addEventListener('click',()=>{if(!paused&&!departed)finish();});
      widget.addEventListener('click',event=>{
        if(paused||departed||destroyed)return;
        const reply=event.target.closest('[data-social-reply]');
        if(reply&&widget.contains(reply))replyChat(reply.dataset.socialReply==='other');
        const decline=event.target.closest('[data-social-decline]');
        if(decline&&widget.contains(decline))declineOffer();
        const end=event.target.closest('[data-social-end]');
        if(end&&widget.contains(end))finish();
      });
      requestLayout();return widget.querySelector('.br-social-content');
    };
    const replyChat=other=>{
      if(kind!=='chat'||chatStep>=2)return;
      chatHistory.push({who:'you',text:chatStep===0?t(profile[other?4:2],profile[other?5:3]):other?t('That is not quite what I asked.','这好像不是我想问的。'):t('Any other ideas?','还有别的建议吗？')});
      chatStep++;
      chatHistory.push({who:'mia',text:chatStep===1?t(profile[6],profile[7]):t('All right, one last idea: a mystery reward. It could be your next upgrade.','好吧，最后一个主意：神秘奖品。说不定刚好就是你的下一次升级。')});
      renderChat();
    };
    const renderChat=()=>{
      const content=widget?.querySelector('.br-social-content');if(!content)return;
      widget.dataset.socialStep=String(chatStep);
      content.innerHTML=`<div class="br-social-thread" role="log" aria-live="polite" aria-relevant="additions text">${chatHistory.map(message=>`<div class="br-social-message br-social-${message.who}"><span>${message.who==='you'?t('You','你'):'Mia'}</span><p>${esc(message.text)}</p></div>`).join('')}</div><div class="br-social-chat-actions">${chatStep===0?`<span class="br-social-reply-label">${t('Choose a reply','选择回复')}</span><button type="button" data-social-reply="first">${esc(t(profile[2],profile[3]))}</button><button type="button" data-social-reply="other">${esc(t(profile[4],profile[5]))}</button>`:chatStep===1?`${link(profile[8],t('Take a look','看一眼'))}<button type="button" data-social-reply="first">${t('Any other ideas?','还有别的建议吗？')}</button><button type="button" data-social-reply="other">${t('That is not what I asked','这不是我想问的')}</button>`:`${link('prize',t('See the mystery reward','看看神秘奖品'))}<button type="button" data-social-end>${t('No thanks — end chat','不用了，结束对话')}</button>`}</div>`;
      requestLayout();
      // Keep the next choices visible without moving keyboard focus away from the user.
      if(chatStep>0)content.scrollTop=content.scrollHeight;
    };
    const showChat=()=>{
      const site=campaignSite();mount('chat',t('Mia · shopping assistant','Mia · 购物助手'),t('Sponsored by ','赞助商：')+brand(site),'br-social-chat');
      chatStep=0;chatHistory=[{who:'mia',text:t(profile[0],profile[1])}];
      const data=load();merge({chats:Math.min(99,data.chats+1)});renderChat();return true;
    };
    const renderEscalation=()=>{
      if(!widget)return;
      widget.dataset.escalationTier=String(tier);
      const content=widget.querySelector('.br-social-content');
      const titles=[t('A little something before you go.','离开之前，送你一点小优惠。'),t('Could a better offer change your mind?','换个更好的优惠，会改变主意吗？'),t('Fine. One mystery box.','好吧，再送一个神秘礼盒。')];
      const labels=[t('WELCOME OFFER','新客优惠'),t('ONE MORE OFFER','再加一份优惠'),t('A SURPRISE FOR YOU','给你一个惊喜')];
      const copy=[t('Take 10% off your next member order. Have a look at the conditions before choosing.','下次会员订单九折。决定之前，先看看使用条件。'),t('Make that 20%. The member offer still has conditions, but the headline is getting bigger.','那就八折。会员优惠依然有条件，只是标题越来越大了。'),t('Your surprise is waiting at Lucky Circle. The next page will explain what claiming it involves.','你的惊喜正在 Lucky Circle 等待。下一页会说明领取需要经过哪些步骤。')];
      content.innerHTML=`<div class="br-social-offer-label">${esc(labels[tier])}</div><div class="br-social-amount" aria-hidden="true">${tier===0?'10<span>%</span>':tier===1?'20<span>%</span>':'?<span>BOX</span>'}</div><h2>${esc(titles[tier])}</h2><p>${esc(copy[tier])}</p>${link(tier===2?'prize':'coupon',tier===2?t('Look inside','打开看看'):t('View the member offer','查看会员优惠'))}<button class="br-social-pass" type="button" data-social-decline>${tier===2?t('No thanks, close this offer','不用了，关闭这个优惠'):tier===1?t('I will pass','还是算了'):t('Not today','今天先不用')}</button><small class="br-social-conditions">${t('Fictional promotion. Terms and recurring costs are shown on the offer page.','虚构推广。使用条件与续费费用在优惠页面说明。')}</small>`;
      requestLayout();
    };
    const declineOffer=()=>{
      if(kind!=='escalation')return;
      const data=load();merge({declines:Math.min(99,data.declines+1)});
      if(tier<2){tier++;renderEscalation();}else finish();
    };
    const showEscalation=payload=>{
      const declines=int(payload?.declines),data=load();tier=Math.min(2,Math.max(0,declines-2));
      merge({declines:Math.max(data.declines,declines)});
      mount('escalation','Perk Basket',t('A member offer, reconsidered','会员优惠，再考虑一下'),'br-social-escalation');renderEscalation();return true;
    };
    const returnNotice=()=>{
      if(!tabPending||paused||departed||destroyed||document.hidden||!document.hasFocus())return;
      const site=campaignSite(),offer=safeOffer(site);restoreTitle();
      const content=mount('tab',brand(site),t('One new sponsored message','一条新的赞助消息'),'br-social-notice');
      content.innerHTML=`<span class="br-social-notice-kicker">${t('WHILE YOU WERE AWAY','你离开的时候')}</span><h2>${t('We saved you a little something.','给你留了一点小惊喜。')}</h2><p>${esc(typeof offer.title==='string'?offer.title:t('Your next offer is still here.','你的下一份优惠还在这里。'))}</p>${link(site,t('View the offer','查看优惠'))}<button type="button" class="br-social-pass" data-social-end>${t('Back to what I was doing','继续刚才的任务')}</button>`;
      requestLayout();
    };
    const showTab=()=>{
      kind='tab';titleBefore=document.title;tabPending=true;
      const data=load(),count=Math.min(99,data.notices+1);merge({notices:count});
      document.title=t('('+count+') An offer is waiting for you','('+count+') 给你留了一份优惠');
      // The director calls this after a sponsored tab actually takes focus.
      // Background pause must leave this real-tab notification readable.
      return true;
    };
    const onReturn=()=>{if(tabPending)requestAnimationFrame(returnNotice);};
    const onHide=()=>{departed=true;reset(false);};
    const onShow=()=>{departed=false;};
    window.addEventListener('focus',onReturn);
    document.addEventListener('visibilitychange',onReturn);
    window.addEventListener('pagehide',onHide);
    window.addEventListener('pageshow',onShow);
    window.addEventListener('resize',layout);
    window.visualViewport?.addEventListener('resize',layout);
    window.visualViewport?.addEventListener('scroll',layout);
    return {
      show(name,payload={}){
        if(destroyed||departed||kind||widget||!['chat','tab','escalation'].includes(name)||(paused&&name!=='tab'))return false;
        if(name==='tab')return showTab();
        if(name==='chat')return showChat();
        return showEscalation(payload&&typeof payload==='object'?payload:{});
      },
      pause(value){paused=!!value;if(widget)widget.dataset.paused=String(paused);if(!paused){returnNotice();requestLayout();}},
      clear(){reset();},
      destroy(){reset(false);destroyed=true;window.removeEventListener('focus',onReturn);document.removeEventListener('visibilitychange',onReturn);window.removeEventListener('pagehide',onHide);window.removeEventListener('pageshow',onShow);window.removeEventListener('resize',layout);window.visualViewport?.removeEventListener('resize',layout);window.visualViewport?.removeEventListener('scroll',layout);}
    };
  };
})();
