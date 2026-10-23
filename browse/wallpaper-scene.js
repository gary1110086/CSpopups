(() => {
  'use strict';
  const render = C => {
    const {root,params,t,esc,url,read,write}=C;
    const items=window.BROWSE_WALLPAPERS||window.STILLWALL_ITEMS||[], asset=i=>i.localAsset||'../wallpapers/'+i.asset;
    const loadSaved=()=>{const raw=read('wall-saved',[]);return Array.isArray(raw)?raw.filter(id=>items.some(i=>i.id===id)):[];};
    let saved=loadSaved();
    const cats={all:t('Discover','发现'),nature:t('Nature','自然'),abstract:t('Abstract','抽象'),illustration:t('Illustration','插画'),city:t('City','城市')};
    const view=params.get('view'),q=(params.get('q')||'').trim().slice(0,120),cat=Object.hasOwn(cats,params.get('category'))?params.get('category'):'all',sort=params.get('sort')==='name'?'name':'latest';
    const byId=id=>items.find(i=>i.id===id), item=byId(params.get('id'));
    const title=i=>i.title[C.lang],desc=i=>i.description[C.lang];
    const link=(query={})=>url('wallpaper.html',query);
    const ordered=list=>sort==='name'?[...list].sort((a,b)=>title(a).localeCompare(title(b))):list;
    const card=i=>`<article class="swb-card"><a href="${link({id:i.id})}"><img src="${i.thumbnail||asset(i)}" alt="${esc(title(i))}" loading="lazy"><div><span><b>${esc(title(i))}</b><small>${cats[i.category]}</small></span><span class="swb-resolution">${i.width} × ${i.height}</span></div></a><button class="swb-save" data-save="${i.id}" aria-label="${esc(t('Save ','收藏 ')+title(i))}" aria-pressed="${saved.includes(i.id)}">${saved.includes(i.id)?'♥':'♡'}</button></article>`;
    document.body.classList.add('swb-page');
    document.title=(item?title(item):t('Desktop wallpapers','桌面壁纸'))+' - Stillwall';
    const header=`<header class="swb-header"><a class="swb-logo" href="${link()}">still<span>wall</span><small>DESKTOP WALLPAPERS</small></a><nav aria-label="${t('Main navigation','主导航')}"><a class="${!view?'active':''}" href="${link()}">${t('Latest','最新壁纸')}</a><a href="${link({category:'nature'})}">${t('Nature','自然')}</a><a href="${link({category:'abstract'})}">${t('Abstract','抽象')}</a><a class="${view==='saved'?'active':''}" href="${link({view:'saved'})}">${t('Favorites','我的收藏')} <span data-save-count>${saved.length}</span></a></nav><a class="swb-lang" href="${link({lang:C.lang==='zh'?'en':'zh',id:item?.id,view,q,category:cat,sort})}">${C.lang==='zh'?'English':'中文'}</a></header>`;
    const footer=`<footer class="swb-footer"><div><b>stillwall</b><span>${t('Original desktop wallpaper collection','原创桌面壁纸集')}</span></div><div><a href="${link({view:'license'})}">${t('License & downloads','许可与下载说明')}</a><a href="${url('guide.html')}">${t('About this experience','关于此体验')}</a></div><small>© 2026 Stillwall</small></footer>`;
    const sponsor=`<aside class="swb-sponsor"><span>${t('ADVERTISEMENT','广告')}</span><a data-br-ad="desk"><div class="swb-sponsor-photo"></div><div><b>FORM & FIELD</b><h3>${t('Desk accessories<br>from RM39','桌面配件<br>RM39 起')}</h3><p>${t('Lamps · Organizers · Desk mats','台灯 · 收纳 · 桌垫')}</p><strong>${t('Shop now','立即选购')} →</strong></div></a></aside>`;
    let main='';
    if(view==='license') {
      main=`<main class="swb-story"><div class="swb-crumb"><a href="${link()}">Stillwall</a> / ${t('Help','使用帮助')}</div><h1>${t('License & download information','许可与下载说明')}</h1><div><h2>${t('Personal use','个人使用')}</h2><p>${t('All twelve works in this collection were created for this project. You may download them for personal use, including your desktop, phone or a personal presentation. Please credit Stillwall when sharing. The collection does not contain third-party stock photographs.','本合集十二幅作品均为此项目原创。你可以下载用于个人桌面、手机或个人演示；分享时请注明 Stillwall。合集不包含第三方图库照片。')}</p><h2>${t('Available sizes','可下载尺寸')}</h2><table><thead><tr><th>${t('Format','格式')}</th><th>${t('Resolution','分辨率')}</th><th>${t('Aspect ratio','宽高比')}</th></tr></thead><tbody><tr><td>Full HD / JPG</td><td>1920 × 1080</td><td>16:9</td></tr><tr><td>Desktop / JPG</td><td>2560 × 1440</td><td>16:9</td></tr><tr><td>4K / JPG</td><td>3840 × 2160</td><td>16:9</td></tr></tbody></table><h2>${t('Downloading a wallpaper','如何下载')}</h2><p>${t('Open an image, select a resolution and click Download wallpaper. Your browser saves a JPG file. Favorites are saved in this tab; use the heart button on any image to add or remove it.','打开作品，选择分辨率，点击下载壁纸即可保存 JPG。收藏保留在此标签页中，点击图片上的爱心可添加或移除。')}</p><a class="swb-button" href="${link()}">${t('Browse wallpapers','浏览壁纸')}</a></div></main>`;
    } else if (params.has('id') && !item) {
      main=`<main class="swb-empty"><h1>${t('Wallpaper not found','未找到壁纸')}</h1><a href="${link()}">${t('Browse wallpapers','浏览壁纸')}</a></main>`;
    } else if(item) {
      main=`<main class="swb-detail"><div class="swb-crumb"><a href="${link()}">${t('Wallpapers','壁纸')}</a> / <a href="${link({category:item.category})}">${cats[item.category]}</a> / ${esc(title(item))}</div><div class="swb-detail-grid"><div class="swb-image-column"><a class="swb-preview" href="${asset(item)}" target="_blank" rel="noopener"><img src="${asset(item)}" alt="${esc(title(item))}"><span>${t('View original','查看原图')} ↗</span></a><div class="swb-palette">${item.colors.map(c=>`<button data-color="${c}" aria-label="${t('Copy colour','复制颜色')} ${c}" style="--swatch:${c}"><span></span>${c}</button>`).join('')}</div><p class="swb-meta">${item.localAsset?t('Original generated image · Landscape','原创生成图像 · 横向'):t('Original vector artwork · Landscape · 16:9','原创矢量作品 · 横向 · 16:9')}</p></div><aside class="swb-detail-info"><h1>${esc(title(item))}</h1><dl class="swb-info-table"><div><dt>${t('Category','分类')}</dt><dd><a href="${link({category:item.category})}">${cats[item.category]}</a></dd></div><div><dt>${t('Resolution','分辨率')}</dt><dd>${item.width} × ${item.height}</dd></div><div><dt>${t('Source','来源')}</dt><dd>Stillwall Original</dd></div><div><dt>${t('License','许可')}</dt><dd><a href="${link({view:'license'})}">${t('Personal use','个人使用')}</a></dd></div></dl><div class="swb-tags">${item.tags.slice(0,4).map(tag=>`<a href="${link({q:tag})}">#${esc(tag)}</a>`).join('')}</div><label for="swb-size">${t('Download resolution','下载分辨率')}</label><select id="swb-size"><option value="2560">2560 × 1440 (Desktop)</option><option value="1920">1920 × 1080 (Full HD)</option><option value="3840">3840 × 2160 (4K)</option></select><button class="swb-button" id="swb-download">↓ ${t('Download wallpaper','下载壁纸')}</button><p class="swb-download-note">JPG · ${t('No account required','无需注册')}${item.localAsset?'<br>'+t('Source:1672 × 941. Larger sizes are resampled.','原图1672 × 941，较大尺寸为重采样导出。'):''}</p><button class="swb-save-detail" data-save="${item.id}" aria-pressed="${saved.includes(item.id)}">${saved.includes(item.id)?'♥':'♡'} ${t('Save to collection','加入收藏')}</button><p id="swb-status" role="status" aria-live="polite"></p>${sponsor}</aside></div><section class="swb-related"><h2>${t('Related wallpapers','相关壁纸')}</h2><div class="swb-grid">${items.filter(i=>i.id!==item.id).slice(0,4).map(card).join('')}</div></section></main>`;
    } else {
      const filtered=ordered(items.filter(i=>(view!=='saved'||saved.includes(i.id))&&(cat==='all'||!cats[cat]||i.category===cat)&&(!q||[i.title.en,i.title.zh,i.description.en,...i.tags].join(' ').toLowerCase().includes(q.toLowerCase()))));
      main=`<main><section class="swb-search-area"><form action="wallpaper.html" method="get" class="swb-search"><label for="swb-search" class="swb-sr">${t('Search wallpapers','搜索壁纸')}</label><input id="swb-search" name="q" value="${esc(q)}" placeholder="${t('Search wallpapers…','搜索壁纸…')}">${view==='saved'?'<input type="hidden" name="view" value="saved">':''}<button type="submit">${t('Search','搜索')}</button></form><div class="swb-popular"><span>${t('Popular tags:','热门标签：')}</span>${['mountains','ocean','green','space','city','cat'].map(tag=>`<a href="${link({q:tag})}">#${tag}</a>`).join('')}</div></section><section class="swb-browse"><div class="swb-filter">${Object.entries(cats).map(([id,name])=>`<a class="${id===cat?'active':''}" href="${link({category:id,view:view==='saved'?'saved':null,q,sort})}">${name}</a>`).join('')}<span>16:9 · JPG · 4K</span></div><div class="swb-section-title"><h1>${q?t('Search: ','搜索：')+esc(q):view==='saved'?t('Favorite wallpapers','收藏的壁纸'):cat==='all'?t('Latest wallpapers','最新壁纸'):cats[cat]}</h1><span>${filtered.length} ${t('wallpapers','张壁纸')}</span><label class="swb-sort">${t('Sort:','排序：')}<select id="swb-sort"><option value="latest" ${sort==='latest'?'selected':''}>${t('Latest','最新')}</option><option value="name" ${sort==='name'?'selected':''}>${t('Name','名称')}</option></select></label></div><div class="swb-grid">${filtered.map(card).join('')}</div>${!filtered.length?`<div class="swb-empty"><p>${view==='saved'?t('Use the heart on an image to save it to Favorites.','点击图片上的爱心可加入收藏。'):t('No wallpapers found. Try another search.','没有找到壁纸，请换个关键词。')}</p><a href="${link()}">${t('View all wallpapers','查看全部壁纸')}</a></div>`:''}<div class="swb-bottom-row"><div><h2>${t('Desktop wallpaper downloads','桌面壁纸下载')}</h2><p>${t('12 original wallpapers. Download as Full HD, 1440p or 4K JPG. Click an image to view available sizes and colors.','12 张原创壁纸，可下载 Full HD、1440p 或 4K JPG。点击作品查看可选尺寸与配色。')}</p><a href="${link({view:'license'})}">${t('License information','许可说明')}</a></div>${sponsor}</div></section></main>`;
    }
    root.innerHTML=header+main+footer;
    const refreshSaved=()=>{
      root.querySelectorAll('[data-save-count]').forEach(el=>el.textContent=String(saved.length));
      if(view==='saved'&&!item){
        const filtered=items.filter(i=>saved.includes(i.id)&&(cat==='all'||!cats[cat]||i.category===cat)&&(!q||[i.title.en,i.title.zh,i.description.en,...i.tags].join(' ').toLowerCase().includes(q.toLowerCase())));
        const box=root.querySelector('.swb-grid');if(box)box.innerHTML=ordered(filtered).map(card).join('');
        const count=root.querySelector('.swb-section-title>span');if(count)count.textContent=filtered.length+' '+t('wallpapers','张壁纸');
        const empty=root.querySelector('.swb-browse>.swb-empty');
        if(filtered.length)empty?.remove();
        else if(!empty&&box)box.insertAdjacentHTML('afterend',`<div class="swb-empty"><p>${t('Use the heart on an image to save it to Favorites.','点击图片上的爱心可加入收藏。')}</p><a href="${link()}">${t('View all wallpapers','查看全部壁纸')}</a></div>`);
      }
      root.querySelectorAll('[data-save]').forEach(el=>{el.setAttribute('aria-pressed',String(saved.includes(el.dataset.save)));el.textContent=(saved.includes(el.dataset.save)?'♥':'♡')+(el.classList.contains('swb-save-detail')?' '+t('Save to collection','加入收藏'):'');});
    };
    root.addEventListener('click',event=>{
      const b=event.target.closest('[data-save]');if(!b||!root.contains(b))return;
      const id=b.dataset.save;saved=loadSaved();saved=saved.includes(id)?saved.filter(v=>v!==id):[...saved,id];write('wall-saved',saved);refreshSaved();
    });
    window.addEventListener('pageshow',event=>{if(event.persisted){saved=loadSaved();refreshSaved();}});
    root.querySelector('#swb-sort')?.addEventListener('change',event=>{location.href=link({category:cat,view,q,sort:event.target.value});});
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
