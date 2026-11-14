/* Local site information and recoverable media failures; no activity state. */
(() => {
  'use strict';
  window.BROWSE_SITE_SUPPORT = C => {
    const {root,t,esc,scene}=C;
    const brands={wallpapers:'Stillwall',recipes:'Pantry & Plate',tools:'Pixelpress',movies:'Frame Movies',events:'Out There',books:'Folio',museum:'Open Collection',nature:'Field Guide',travel:'Trackside',market:'loop',courier:'TrackMY',search:'Findline'};
    const help={
      wallpapers:['Search or filter the collection, open an image and choose an export size. Select up to three works to compare.','搜索或筛选图库，打开图片后选择导出尺寸。可选最多三张图片进行对比。'],
      recipes:['Choose a category or search a recipe. Open it to change servings, tick ingredients and save it. Prices are per serving; the selected-servings total is shown separately.','按分类或关键词找食谱。打开后可调整份量、勾选食材并收藏。单价按每份计，所选人数的总价另列。'],
      tools:['Choose your own image or an example. Set the format, width and quality in the right panel, then download the generated file. Keep your original image.','选择设备图片或示例图，在右侧设置格式、宽度和质量，再下载生成的文件。请保留原图。'],
      movies:['Use the catalogue filters or search a title. Open a film to read its details and add it to your watchlist. Playable previews are marked separately from catalogue-only entries.','使用目录筛选或搜索片名。打开影片可查看详情并加入想看片单。可播放预览与仅有条目的影片分别标注。'],
      events:['Choose a destination and combine budget, duration and indoor/outdoor conditions. Open a guide to save it, check departure plans or export your itinerary.','选择目的地，组合预算、用时和室内外条件。打开指南后可收藏、核对出发安排或导出计划。'],
      books:['Browse an author or subject, then check the edition language. Each book page has a reading excerpt and reading-list action. Available TXT excerpts can be downloaded.','浏览作者或主题，再核对版本语言。书籍详情有阅读片段与加入清单按钮，可下载已提供的 TXT 片段。'],
      museum:['Browse periods and materials or search an artist. Open an object to read its dimensions and sources. Selected objects can be compared or saved to My Exhibition.','浏览年代和材质，或搜索艺术家。打开作品可查看尺寸与来源；选中的作品可对比或加入我的展览。'],
      nature:['Browse the name index, colours and sizes. Species pages show field marks and body length. A call button appears only when a matching recording is available.','按名称索引、颜色和体型浏览。鸟种详情显示外观与体长；只有提供对应录音的鸟种才显示叫声按钮。'],
      travel:['Choose the origin and destination platforms, date, time and preference. Plan a journey, check its connections and save it. The network map also opens station menus. Times are illustrative.','选择出发与到达站台、日期、时间和偏好。查询后核对换乘并保存行程；网络图也可打开车站菜单。时刻仅作示例。'],
      market:['Compare prices, condition and included items before saving a listing. A model reference photo does not establish the condition of an individual camera. Enquiries are local drafts.','收藏刊登前先比较价格、状态和附带物品。型号参考照片不能证明某台相机的实际状况；询问内容仅为本地草稿。'],
      courier:['Select a sample parcel or enter its tracking number. Eligible parcels have a free redelivery form. Use only the supplied fictional addresses. No delivery is actually arranged.','选择示例包裹或输入单号。符合条件的包裹提供免费改约表单；请仅用给出的虚构地址，不会实际安排派送。'],
      search:['Read the source domain and sponsored label before opening a result. The local index includes a Pixelpress reference page with a free TXT guide. Sponsored entries are separate offers.','打开结果前核对来源域名与赞助标记。本地索引提供 Pixelpress 参考页和免费 TXT 说明；赞助条目为独立推广。']
    };
    const sections=[
      ['about',t('About','关于本站'),t(`${brands[scene]} is a practice website in the One Minute browsing activity. Its catalogue and demonstrations are for learning. Credits and source links remain beside the relevant content.`,`${brands[scene]} 是「一分钟」浏览活动的练习网站。内容与演示用于学习；相关署名和来源链接保留在各条内容旁。`)],
      ['privacy',t('Privacy','隐私说明'),t('Saved items and practice progress stay in this browser tab. This site has no account, payment or identity-verification service. Do not enter real personal details in practice forms.','收藏与练习进度保留在当前浏览器标签页。本网站不提供账户、支付或身份验证服务；请勿在练习表单填写真实个人资料。')],
      ['help',t('Help','使用帮助'),t(...(help[scene]||help.search))]
    ];
    const reconcile=()=>{
      if(root.querySelector('[data-site-support]'))return;
      let footer=root.querySelector('footer');
      if(!footer){footer=document.createElement('footer');root.append(footer);}
      const support=document.createElement('div');support.className='br-site-support';support.dataset.siteSupport='';
      support.innerHTML=`<div class="br-site-footline"><span>© 2026 ${esc(brands[scene])}</span><nav aria-label="${t('Site information','网站信息')}">${sections.map(([id,title])=>`<a href="#br-site-${id}" data-site-info="${id}">${title}</a>`).join('')}</nav></div><div class="br-site-information">${sections.map(([id,title,body])=>`<details id="br-site-${id}"><summary>${title}</summary><p>${esc(body)}</p></details>`).join('')}</div>`;
      footer.append(support);
    };
    const retries=new WeakMap();
    const mediaError=event=>{
      const element=event.target?.tagName==='SOURCE'?event.target.parentElement:event.target;
      if(!element?.matches?.('img,video,audio')||!element.getAttribute('src')&&!element.querySelector?.('source[src]'))return;
      const existing=retries.get(element);if(existing?.isConnected){existing.disabled=false;return;}
      const button=document.createElement('button');button.type='button';button.className='br-media-retry';button.textContent=t('Media could not load · Retry','媒体加载失败 · 重试');
      button.addEventListener('click',event=>{
        event.preventDefault();event.stopPropagation();button.disabled=true;
        if(element.tagName==='IMG'){
          const original=element.currentSrc||element.src,next=new URL(original,location.href);next.searchParams.set('retry',String(Date.now()));element.src=next.href;
        }else element.load();
      });
      element.addEventListener(element.tagName==='IMG'?'load':'loadedmetadata',()=>{button.remove();retries.delete(element);},{once:true});
      const anchor=element.closest('a');(anchor||element).insertAdjacentElement('afterend',button);retries.set(element,button);
    };
    const infoClick=event=>{
      const link=event.target.closest('[data-site-info]');if(!link)return;
      const details=root.querySelector('#br-site-'+link.dataset.siteInfo);if(!details)return;
      event.preventDefault();details.open=true;details.querySelector('summary').focus({preventScroll:true});details.scrollIntoView({block:'nearest'});
    };
    reconcile();
    // Include failures that arrived while the scene was being rendered.
    root.querySelectorAll('img[src]').forEach(img=>{if(img.complete&&!img.naturalWidth)mediaError({target:img});});
    const observer=new MutationObserver(reconcile);observer.observe(root,{childList:true,subtree:true});
    root.addEventListener('error',mediaError,true);root.addEventListener('click',infoClick);
    window.addEventListener('browse:booth-end',()=>{observer.disconnect();root.removeEventListener('error',mediaError,true);root.removeEventListener('click',infoClick);},{once:true});
  };
})();
