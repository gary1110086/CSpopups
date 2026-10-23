(() => {
  'use strict';
  const render = C => {
    const {root,params,t,esc,url,read,write}=C;
    const items=window.STILLWALL_ITEMS||[], asset=i=>'../wallpapers/'+i.asset;
    const loadSaved=()=>{const raw=read('wall-saved',[]);return Array.isArray(raw)?raw.filter(id=>items.some(i=>i.id===id)):[];};
    let saved=loadSaved();
    const cats={all:t('Discover','发现'),nature:t('Nature','自然'),abstract:t('Abstract','抽象'),illustration:t('Illustration','插画'),city:t('City','城市')};
    const view=params.get('view'),q=(params.get('q')||'').trim().slice(0,120),cat=params.get('category')||'all';
    const byId=id=>items.find(i=>i.id===id), item=byId(params.get('id'));
    const title=i=>i.title[C.lang],desc=i=>i.description[C.lang];
    const link=(query={})=>url('wallpaper.html',query);
    const card=i=>`<article class="swb-card"><a href="${link({id:i.id})}"><img src="${asset(i)}" alt="${esc(title(i))}" loading="lazy"><div><span><b>${esc(title(i))}</b><small>${cats[i.category]} · ${i.width} × ${i.height}</small></span><span>↗</span></div></a><button class="swb-save" data-save="${i.id}" aria-label="${esc(t('Save ','收藏 ')+title(i))}" aria-pressed="${saved.includes(i.id)}">${saved.includes(i.id)?'♥':'♡'}</button></article>`;
    document.body.classList.add('swb-page');
    document.title=(item?title(item):t('Wallpapers for a quieter screen','让屏幕安静一些'))+' · Stillwall';
    const header=`<div class="swb-note">${t('A little room to breathe. Original wallpapers, made for your everyday.','给桌面一点呼吸的空间。为日常创作的原创壁纸。')}</div><header class="swb-header"><a class="swb-logo" href="${link()}"><span>◒</span> stillwall</a><nav aria-label="${t('Main navigation','主导航')}"><a href="${link()}">${t('Explore','探索')}</a><a href="${link({view:'saved'})}">${t('Your collection','我的收藏')} <span data-save-count>${saved.length}</span></a><a href="${link({view:'license'})}">${t('Our story','关于我们')}</a></nav><a class="swb-lang" href="${link({lang:C.lang==='zh'?'en':'zh',id:item?.id,view,q,category:cat})}">${C.lang==='zh'?'EN':'中文'}</a></header>`;
    const footer=`<footer class="swb-footer"><a class="swb-logo" href="${link()}">◒ stillwall</a><p>${t('Made slowly. Kept simply.','慢慢创作，简单拥有。')}</p><div><a href="${link({view:'license'})}">${t('License & story','许可与故事')}</a><a href="${url('guide.html')}">${t('About this experience','关于此体验')}</a></div><small>© 2026 Stillwall · Original artwork</small></footer>`;
    const sponsor=`<aside class="swb-sponsor"><span>${t('SPONSORED','赞助')}</span><div class="swb-sponsor-shape">◒</div><h3>${t('Make space for<br>your best ideas.','为好想法，<br>留一个位置。')}</h3><p>Form & Field<br>${t('Thoughtful pieces for the everyday desk.','为日常桌面挑选的好物。')}</p><a data-br-ad="desk">${t('Find your corner','找到你的角落')} ↗</a></aside>`;
    let main='';
    if(view==='license') {
      main=`<main class="swb-story"><p class="swb-kicker">OUR SMALL CORNER OF THE INTERNET</p><h1>${t('A quieter screen.<br>A better beginning.','安静的屏幕，<br>更好的开始。')}</h1><img src="${asset(items[0])}" alt="Alpine dawn"><div><h2>${t('Room for the things that matter','给重要的事留一点空间')}</h2><p>${t('Stillwall is a small collection of original digital landscapes, illustrations and colour studies. Choose a piece, try it on your screen and come back whenever you need a change.','Stillwall 收录原创数字风景、插画和色彩习作。选一张，放到屏幕上；想换个心情时，再回来看看。')}</p><h2>${t('A straightforward license','简单的使用许可')}</h2><p>${t('All eight works in this collection were created for this project. You may download them for personal use, including your desktop, phone or a personal presentation. Please credit Stillwall when sharing. The collection does not contain third-party stock photographs.','本合集八幅作品均为此项目原创。你可以下载用于个人桌面、手机或个人演示；分享时请注明 Stillwall。合集不包含第三方图库照片。')}</p><a class="swb-button" href="${link()}">${t('Back to the collection','返回作品集')} ↗</a></div></main>`;
    } else if (params.has('id') && !item) {
      main=`<main class="swb-empty"><h1>${t('This wallpaper wandered off.','这张壁纸暂时找不到了。')}</h1><a href="${link()}">${t('Explore the collection','浏览作品集')} ↗</a></main>`;
    } else if(item) {
      main=`<main class="swb-detail"><div class="swb-crumb"><a href="${link()}">${t('Wallpapers','壁纸')}</a> / <a href="${link({category:item.category})}">${cats[item.category]}</a> / ${esc(title(item))}</div><div class="swb-detail-grid"><div><a class="swb-preview" href="${asset(item)}" target="_blank" rel="noopener"><img src="${asset(item)}" alt="${esc(title(item))}"><span>${t('Open full preview','打开完整预览')} ↗</span></a><div class="swb-palette">${item.colors.map(c=>`<button data-color="${c}" aria-label="${t('Copy colour','复制颜色')} ${c}" style="--swatch:${c}"><span></span>${c}</button>`).join('')}</div><p class="swb-meta">${t('An original Stillwall artwork · Landscape · 16:9','Stillwall 原创作品 · 横向 · 16:9')}</p></div><aside class="swb-detail-info"><p class="swb-kicker">${cats[item.category].toUpperCase()} / STILLWALL ORIGINAL</p><h1>${esc(title(item))}</h1><p class="swb-description">${esc(desc(item))}</p><div class="swb-tags">${item.tags.slice(0,4).map(tag=>`<a href="${link({q:tag})}">${esc(tag)}</a>`).join('')}</div><label for="swb-size">${t('Choose your size','选择尺寸')}</label><select id="swb-size"><option value="2560">Desktop · 2560 × 1440</option><option value="1920">Full HD · 1920 × 1080</option><option value="3840">4K · 3840 × 2160</option></select><button class="swb-button" id="swb-download">↓ ${t('Download wallpaper','下载壁纸')}</button><p class="swb-download-note">${t('JPG · Free for personal use · No account needed','JPG · 可供个人使用 · 无需账号')}</p><button class="swb-save-detail" data-save="${item.id}" aria-pressed="${saved.includes(item.id)}">${saved.includes(item.id)?'♥':'♡'} ${t('Save to collection','加入收藏')}</button><p id="swb-status" role="status" aria-live="polite"></p>${sponsor}</aside></div><section class="swb-related"><h2>${t('A few more you might like','你可能还会喜欢')}</h2><div class="swb-grid">${items.filter(i=>i.id!==item.id).slice(0,3).map(card).join('')}</div></section></main>`;
    } else {
      const filtered=items.filter(i=>(view!=='saved'||saved.includes(i.id))&&(cat==='all'||!cats[cat]||i.category===cat)&&(!q||[i.title.en,i.title.zh,i.description.en,...i.tags].join(' ').toLowerCase().includes(q.toLowerCase())));
      main=`<main><section class="swb-hero"><div><p class="swb-kicker">A CHANGE OF SCENERY</p><h1>${view==='saved'?t('Your little<br>collection.','你的专属，<br>小小收藏。'):t('Find your<br>quiet place.','找一个，<br>安静的角落。')}</h1><p>${t('Original wallpapers for the screen you look at every day.','用原创壁纸，换一个每天都想看的桌面。')}</p><form action="wallpaper.html" method="get" class="swb-search"><label for="swb-search" class="swb-sr">${t('Search wallpapers','搜索壁纸')}</label><input id="swb-search" name="q" value="${esc(q)}" placeholder="${t('Try mountains, ocean, or green…','试试山、海，或者绿色…')}"><button type="submit" aria-label="${t('Search','搜索')}">↗</button></form><small>${t('Browse slowly. Download freely.','慢慢逛，自由下载。')}</small></div><a class="swb-hero-art" href="${link({id:'alpine-dawn'})}"><img src="${asset(items[0])}" alt="${esc(title(items[0]))}"><span>01 / Alpine dawn <b>↗</b></span></a></section><section class="swb-browse"><div class="swb-filter">${Object.entries(cats).map(([id,name])=>`<a class="${id===cat?'active':''}" href="${link({category:id,view:view==='saved'?'saved':null})}">${name}</a>`).join('')}</div><div class="swb-section-title"><h2>${q?t('Results for ','搜索结果：')+'“'+esc(q)+'”':view==='saved'?t('Kept close','留在身边'):t('Fresh perspectives','换个视角')}</h2><span>${filtered.length} ${t('wallpapers','张壁纸')}</span></div><div class="swb-grid">${filtered.map(card).join('')}</div>${!filtered.length?`<div class="swb-empty"><p>${view==='saved'?t('Keep a few favourites using the heart on any wallpaper.','点击壁纸上的爱心，把喜欢的作品留在这里。'):t('No matches this time. Try a different word.','这次没有匹配结果，试试其他关键词。')}</p><a href="${link()}">${t('View all wallpapers','查看全部壁纸')} ↗</a></div>`:''}<div class="swb-bottom-row"><div><p class="swb-kicker">PICKED FOR YOUR DESKTOP</p><h2>${t('Small change.<br>Different feeling.','小小改变，<br>不一样的心情。')}</h2><p>${t('Every piece includes desktop, Full HD and 4K sizes. Choose the one that fits your day.','每幅作品都有桌面、Full HD 和 4K 尺寸，选一张适合今天的。')}</p><a href="${link({view:'license'})}">${t('Meet Stillwall','认识 Stillwall')} ↗</a></div>${sponsor}</div></section></main>`;
    }
    root.innerHTML=header+main+footer;
    const refreshSaved=()=>{
      root.querySelectorAll('[data-save-count]').forEach(el=>el.textContent=String(saved.length));
      if(view==='saved'&&!item){
        const filtered=items.filter(i=>saved.includes(i.id)&&(cat==='all'||!cats[cat]||i.category===cat)&&(!q||[i.title.en,i.title.zh,i.description.en,...i.tags].join(' ').toLowerCase().includes(q.toLowerCase())));
        const box=root.querySelector('.swb-grid');if(box)box.innerHTML=filtered.map(card).join('');
        const count=root.querySelector('.swb-section-title>span');if(count)count.textContent=filtered.length+' '+t('wallpapers','张壁纸');
      }
      root.querySelectorAll('[data-save]').forEach(el=>{el.setAttribute('aria-pressed',String(saved.includes(el.dataset.save)));el.textContent=(saved.includes(el.dataset.save)?'♥':'♡')+(el.classList.contains('swb-save-detail')?' '+t('Save to collection','加入收藏'):'');});
    };
    root.addEventListener('click',event=>{
      const b=event.target.closest('[data-save]');if(!b||!root.contains(b))return;
      const id=b.dataset.save;saved=loadSaved();saved=saved.includes(id)?saved.filter(v=>v!==id):[...saved,id];write('wall-saved',saved);refreshSaved();
    });
    window.addEventListener('pageshow',event=>{if(event.persisted){saved=loadSaved();refreshSaved();}});
    root.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.color); b.lastChild.textContent=t('Copied','已复制');setTimeout(()=>{b.lastChild.textContent=b.dataset.color;},1800);}catch{const status=root.querySelector('#swb-status');if(status) status.textContent=b.dataset.color;}}));
    const download=root.querySelector('#swb-download');
    download?.addEventListener('click',async()=>{
      const status=root.querySelector('#swb-status');download.disabled=true;status.textContent=t('Preparing your wallpaper…','正在准备壁纸…');
      try{
        const img=new Image();img.src=asset(item);await img.decode();const w=Number(root.querySelector('#swb-size').value),h=Math.round(w*9/16);
        const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(img,0,0,w,h);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.95));if(!blob)throw Error('export');
        const href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download=`stillwall-${item.id}-${w}x${h}.jpg`;a.click();setTimeout(()=>URL.revokeObjectURL(href),10000);
        status.textContent=t('Your wallpaper is ready. Enjoy the new view.','壁纸已准备好，享受新的风景。');C.complete('Wallpaper downloaded');
      }catch{status.textContent=t('We could not prepare this file. Please try again.','暂时无法生成文件，请再试一次。');}finally{download.disabled=false;}
    });
  };
  window.BROWSE_SCENES=Object.assign(window.BROWSE_SCENES||{},{wallpapers:render});
})();
