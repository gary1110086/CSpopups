(() => {
  "use strict";
  const items = window.STILLWALL_ITEMS || [];
  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") === "zh" ? "zh" : "en";
  const zh = lang === "zh";
  const L = (en, cn) => zh ? cn : en;
  const page = document.body.dataset.page;
  const key = "sw-visit-v1";
  const byId = id => items.find(item => item.id === id);
  const esc = text => String(text == null ? "" : text).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const $ = selector => document.querySelector(selector);
  const route = (file, query = {}) => {
    const url = new URL(file, location.href);
    url.searchParams.set("lang", lang);
    url.searchParams.set("v", "wallpaper1");
    Object.entries(query).forEach(([k,v]) => { if (v !== "" && v !== null && v !== undefined) url.searchParams.set(k,String(v)); });
    return url.href;
  };
  const names = {
    all:L("All wallpapers","全部壁纸"),
    nature:L("Nature","自然风景"),
    abstract:L("Abstract","抽象"),
    illustration:L("Illustration","插画"),
    city:L("City","城市")
  };
  const icon = name => {
    const paths = {
      search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
      heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
      download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
      arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
      external:'<path d="M14 3h7v7M21 3l-11 11M10 3H3v18h18v-7"/>',
      check:'<path d="m5 12 4 4L19 6"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name] || paths.arrow)+'</svg>';
  };
  function read() { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } }
  function normalize(value) {
    const valid = value && typeof value === "object" ? value : {};
    return {
      activeSeconds: Number.isFinite(valid.activeSeconds) ? Math.min(86400,Math.max(0,valid.activeSeconds)) : 0,
      redirected: valid.redirected === true,
      floatDismissed: valid.floatDismissed === true,
      saved: Array.isArray(valid.saved) ? [...new Set(valid.saved.filter(id => byId(id)))].slice(0,items.length) : [],
      lastDetail: byId(valid.lastDetail) ? valid.lastDetail : items[0]?.id,
      downloaded: Array.isArray(valid.downloaded) ? [...new Set(valid.downloaded.filter(id => byId(id)))].slice(0,items.length) : []
    };
  }
  let visit = normalize(read());
  const persist = () => { try { sessionStorage.setItem(key, JSON.stringify(visit)); } catch { /* Keep the current document usable when storage is unavailable. */ } };
  function languageLinks() {
    return '<div class="language" aria-label="Language">'+["en","zh"].map(code => {
      const url = new URL(location.href); url.searchParams.set("lang",code); url.searchParams.set("v","wallpaper1");
      return '<a href="'+esc(url.href)+'" lang="'+code+'" class="'+(lang===code?'active':'')+'"'+(lang===code?' aria-current="true"':'')+'>'+(code==="en"?"EN":"中文")+'</a>';
    }).join('')+'</div>';
  }
  function header() {
    const saved = params.get("saved")==="1";
    return '<header class="header"><div class="wrap header-inner"><a class="brand" href="'+esc(route("index.html"))+'" aria-label="Stillwall home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>stillwall</a><nav class="top-nav" aria-label="'+L("Main navigation","主导航")+'"><a class="'+(!saved&&page==="browse"?'active':'')+'" href="'+esc(route("index.html"))+'">'+L("Explore","发现")+'</a><a class="'+(saved?'active':'')+'" href="'+esc(route("index.html",{saved:1}))+'">'+L("Saved","收藏")+'</a></nav><form class="header-search" action="index.html" method="get" role="search"><button aria-label="'+L("Search wallpapers","搜索壁纸")+'">'+icon("search")+'</button><input name="q" type="search" maxlength="80" value="'+esc(params.get("q")||"")+'" placeholder="'+L("Search wallpapers…","搜索壁纸…")+'" aria-label="'+L("Search wallpapers","搜索壁纸")+'"><input type="hidden" name="lang" value="'+lang+'"><input type="hidden" name="v" value="wallpaper1"></form>'+languageLinks()+'</div></header>';
  }
  function footer() {
    return '<footer class="footer"><div class="wrap footer-inner"><span>© 2026 Stillwall · '+L("A little change of scenery.","给屏幕换个风景。")+'</span><nav class="footer-links" aria-label="'+L("Footer","页脚")+'"><a href="'+esc(route("about.html"))+'">'+L("About Stillwall","关于 Stillwall")+'</a><a href="'+esc(route("about.html"))+'#license">'+L("Image license","图片许可")+'</a><a href="'+esc(route("about.html"))+'#privacy">'+L("Privacy","隐私")+'</a></nav></div></footer>';
  }
  function saveButton(item, compact=true) {
    const saved = visit.saved.includes(item.id);
    return '<button type="button" class="'+(compact?'save':'')+'" data-save="'+esc(item.id)+'" aria-pressed="'+saved+'" aria-label="'+esc((saved?L("Unsave ","取消收藏："):L("Save ","收藏："))+item.title[lang])+'">'+icon("heart")+(compact?'':'<span>'+ (saved?L("Saved","已收藏"):L("Save wallpaper","收藏壁纸"))+'</span>')+'</button>';
  }
  function card(item) {
    return '<article class="wall-card"><div class="card-image"><a href="'+esc(route("wallpaper.html",{id:item.id}))+'" aria-label="'+esc(item.title[lang])+'"><img src="'+esc(item.asset)+'" alt="'+esc(item.description[lang])+'" width="2560" height="1440" loading="lazy"></a>'+saveButton(item)+'</div><div class="card-info"><div><h3><a href="'+esc(route("wallpaper.html",{id:item.id}))+'">'+esc(item.title[lang])+'</a></h3><p>'+names[item.category]+' · '+L("Up to 4K","最高 4K")+'</p></div><span class="swatches" aria-hidden="true">'+item.colors.map(color=>'<i style="--color:'+esc(color)+'"></i>').join('')+'</span></div></article>';
  }
  function ordinaryAd() {
    return '<aside class="catalogue-ad" aria-label="'+L("Advertisement","广告")+'"><div><span class="ad-label">'+L("ADVERTISEMENT","广告")+' · DESKFOLK</span><p>'+L("A calmer desk starts with a little space.","留一点空间，让桌面轻松一点。")+'</p></div><a class="text-link" href="'+esc(route("sponsor.html",{brand:"deskfolk"}))+'">'+L("Explore the collection","看看桌面好物")+' &nbsp; ↗</a></aside>';
  }
  function browse() {
    document.title = (params.get("saved")==="1"?L("Saved wallpapers","收藏的壁纸"):L("A fresh view, every day","每天换个新风景"))+" | Stillwall";
    const category = Object.hasOwn(names,params.get("category")) ? params.get("category") : "all";
    const saved = params.get("saved")==="1";
    const query = (params.get("q")||"").trim().slice(0,80);
    const sort = params.get("sort")==="name"?"name":"curated";
    let filtered = items.filter(item => (category==="all"||item.category===category)&&(!saved||visit.saved.includes(item.id))&&(!query||[item.title.en,item.title.zh,item.description.en,item.description.zh,...item.tags].join(" ").toLowerCase().includes(query.toLowerCase())));
    if(sort==="name") filtered = filtered.slice().sort((a,b)=>a.title[lang].localeCompare(b.title[lang],zh?"zh":"en"));
    const hero = !saved && !query && category==="all" ? '<section class="hero" aria-label="'+L("Featured wallpaper","精选壁纸")+'"><img src="'+esc(items[0].asset)+'" alt="'+esc(items[0].description[lang])+'" width="2560" height="1440" fetchpriority="high"><div class="hero-shade"></div><div class="hero-copy"><span class="eyebrow">'+L("THE STILLWALL SELECTION","STILLWALL 精选")+'</span><h1>'+L("A fresh view.<br>Every day.","换个风景，<br>换个好心情。")+'</h1><p>'+L("Original wallpapers for the space<br>you make your own.","一张喜欢的壁纸，<br>让每次打开屏幕都多一点期待。")+'</p><a class="hero-link" href="'+esc(route("wallpaper.html",{id:items[0].id}))+'">'+L("Discover this wallpaper","查看这张壁纸")+icon("arrow")+'</a></div><span class="hero-caption">'+esc(items[0].title[lang])+' &nbsp; / &nbsp; '+L('4K available','可下载 4K')+'</span></section>' : '';
    const heading = query?L('Results for “','搜索：“')+esc(query)+'”':saved?L("Your saved views","收藏的风景"):L("Find your next backdrop","找一张喜欢的壁纸");
    const queryFields = {category:category==="all"?null:category,saved:saved?1:null,q:query};
    const filters = Object.entries(names).map(([id,label])=>'<a class="filter '+(category===id?'active':'')+'"'+(category===id?' aria-current="page"':'')+' href="'+esc(route("index.html",{...queryFields,category:id==="all"?null:id,sort:sort==="name"?sort:null}))+'">'+label+'</a>').join('');
    const empty = '<div class="empty"><h2>'+L("Nothing here just yet.","这里暂时还没有壁纸。")+'</h2><p>'+ (saved?L("Tap the heart on a wallpaper to keep it here in this tab.","点击壁纸上的爱心，把它收藏在当前标签页。"):L("Try a different keyword or browse the collection.","换个关键词，或者看看全部壁纸。"))+'</p><a class="button primary" href="'+esc(route("index.html"))+'">'+L("Explore wallpapers","浏览壁纸")+'</a></div>';
    return '<main id="main" class="wrap">'+hero+'<section class="collection"><div class="section-heading"><div><'+(hero?'h2':'h1')+'>'+heading+'</'+(hero?'h2':'h1')+'><p>'+L("A small collection. Room for a new perspective.","小小的精选集，装得下新的视角。")+'</p></div><form class="sort" action="index.html"><span>'+L("Sort by","排序")+'</span><select name="sort" aria-label="'+L("Sort wallpapers","壁纸排序")+'" data-sort><option value="curated"'+(sort==="curated"?' selected':'')+'>'+L("Curated","精选顺序")+'</option><option value="name"'+(sort==="name"?' selected':'')+'>'+L("Name A–Z","按名称")+'</option></select><input type="hidden" name="lang" value="'+lang+'"><input type="hidden" name="v" value="wallpaper1">'+Object.entries(queryFields).filter(([,v])=>v!==null&&v!=="").map(([k,v])=>'<input type="hidden" name="'+k+'" value="'+esc(v)+'">').join('')+'</form></div><nav class="filters" aria-label="'+L("Wallpaper categories","壁纸分类")+'">'+filters+'<span class="filter-count">'+filtered.length+' '+L("wallpapers","张壁纸")+'</span></nav><div class="wall-grid">'+(filtered.map(card).join('')||empty)+'</div>'+ordinaryAd()+'</section></main>';
  }
  function sponsoredDownload() {
    return '<aside class="sponsor-download" aria-label="'+L("Advertisement from PicVault","PicVault 广告")+'"><div class="ad-label"><span>'+L("ADVERTISEMENT","广告")+'</span><span>PicVault</span></div><h3>'+L("Your next great view.","发现下一个好风景。")+'</h3><p>'+L("Discover more high-resolution backgrounds.","更多高清背景，等你发现。")+'</p><a class="ad-download" data-sponsored-download href="'+esc(route("sponsor.html"))+'">'+icon("download")+L("Start download","开始下载")+'</a><small>'+L("Sponsored link · picvault.example","赞助链接 · picvault.example")+'</small></aside>';
  }
  function detail() {
    const item = byId(params.get("id")||items[0]?.id);
    if(!item) {
      document.title=L("Wallpaper not found","未找到壁纸")+" | Stillwall";
      return '<main id="main" class="wrap"><section class="info-page"><h1>'+L("That view is not in this collection.","没有找到这张壁纸。")+'</h1><p>'+L("Browse the collection to find another wallpaper.","返回精选集看看其他壁纸。")+'</p><a class="button primary" href="'+esc(route("index.html"))+'">'+L("Back to wallpapers","返回壁纸库")+'</a></section></main>';
    }
    visit.lastDetail=item.id;persist();
    document.title=item.title[lang]+" | Stillwall";
    const selected = ["1920","2560","3840"].includes(params.get("width"))?params.get("width"):"2560";
    return '<main id="main" class="wrap"><nav class="breadcrumb" aria-label="'+L("Breadcrumb","当前位置")+'"><a href="'+esc(route("index.html"))+'">'+L("Wallpapers","壁纸")+'</a><span>›</span><a href="'+esc(route("index.html",{category:item.category}))+'">'+names[item.category]+'</a><span>›</span><span>'+esc(item.title[lang])+'</span></nav><div class="detail-heading"><div><h1>'+esc(item.title[lang])+'</h1><p>'+L("Original artwork by Stillwall · Desktop collection","Stillwall 原创插画 · 桌面壁纸精选")+'</p></div></div><div class="detail-layout"><section><div class="large-preview"><img src="'+esc(item.asset)+'" alt="'+esc(item.description[lang])+'" width="2560" height="1440" fetchpriority="high"></div><div class="preview-tools"><a href="'+esc(item.asset)+'" target="_blank" rel="noopener">'+icon("external")+L("Open original","查看原图")+'</a>'+saveButton(item,false)+'</div><p class="wall-description">'+esc(item.description[lang])+'</p><div class="tags">'+item.tags.filter(tag => zh?/[^\x00-\x7F]/.test(tag):!/[\u3400-\u9FFF]/.test(tag)).slice(0,5).map(tag=>'<a class="tag" href="'+esc(route("index.html",{q:tag}))+'">'+esc(tag)+'</a>').join('')+'</div></section><aside class="detail-aside"><section class="download-panel"><h2>'+L("Make it yours.","留住这个风景。")+'</h2><p>'+L("Choose a size that fits your screen.","选择适合你屏幕的尺寸。")+'</p><label class="select-label" for="resolution">'+L("Desktop resolution","桌面分辨率")+'</label><select id="resolution">'+[[1920,1080,"Full HD"],[2560,1440,"QHD"],[3840,2160,"4K"]].map(([w,h,n])=>'<option value="'+w+'"'+(selected===String(w)?' selected':'')+'>'+w+' × '+h+' · '+n+'</option>').join('')+'</select><button class="button primary" data-download="'+esc(item.id)+'">'+icon("download")+'<span>'+L("Download wallpaper","下载壁纸")+'</span></button><div class="download-fine">'+L("Free for personal use · No account needed","个人使用免费 · 无需注册")+'</div><div class="file-info"><span>JPG · 16:9</span><span>'+L("Original illustration","原创插画")+'</span></div></section>'+sponsoredDownload()+'</aside></div><section class="details-bottom"><h2>'+L("Another change of scenery","再看看其他风景")+'</h2><div class="wall-grid">'+items.filter(other=>other.id!==item.id).slice(0,3).map(card).join('')+'</div></section></main>';
  }
  function about() {
    document.title=L("About & image license","关于与图片许可")+" | Stillwall";
    return '<main id="main" class="wrap"><article class="info-page"><span class="label">ABOUT STILLWALL</span><h1>'+L("A little change<br>of scenery.","给屏幕<br>换个风景。")+'</h1><p>'+L("Stillwall is a small collection of original digital illustrations made for your desktop. Preview a wallpaper, choose a resolution, and save a JPG directly to your device.","Stillwall 收集了一组为桌面设计的原创数字插画。你可以预览图片、选择分辨率，并把 JPG 图片直接保存到自己的设备。")+'</p><h2 id="license">'+L("Image license","图片许可")+'</h2><p>'+L("The eight wallpapers in this collection were created for this project. You may download and use them as personal device backgrounds. JPG files are rendered locally in your browser at your chosen resolution.","本精选集的八张壁纸均为本项目创作。你可以下载并用作个人设备背景。JPG 文件由浏览器按你选择的分辨率在本地生成。")+'</p><h2>'+L("About this browsing experience","关于这次浏览体验")+'</h2><p>'+L("This independent prototype is part of a community scam-awareness activity. Stillwall, PicVault, Deskfolk and Cornhub are fictional brands. The ordinary wallpaper download works; certain sponsored download links demonstrate a misleading redirect after 20 seconds of active browsing. The redirect happens once per tab session.","这是社区防诈骗活动的独立浏览体验原型。Stillwall、PicVault、Deskfolk 和 Cornhub 均为虚构品牌。正常的壁纸下载可以使用；部分广告下载链接会在累计前台浏览 20 秒后演示一次误导跳转，每个标签页会话只触发一次。")+'</p><h2 id="privacy">'+L("Your visit stays in this tab","浏览状态只留在当前标签页")+'</h2><p>'+L("Saved wallpapers, browsing time and the one-time redirect marker are stored in this tab’s session storage. This prototype does not send those records to a server, load third-party ads, request notification permission, collect credentials, or process payments. GitHub Pages handles requests to the hosted site. Close the tab to end the session.","收藏、浏览时间及一次性跳转标记保存在当前标签页的会话存储中。本原型不会向服务器发送这些记录、加载第三方广告、请求系统通知授权、收集登录信息或处理付款。线上站点的访问请求由 GitHub Pages 处理。关闭标签页即可结束这次会话。")+'</p><a class="button primary" href="'+esc(route("index.html"))+'">'+L("Find a wallpaper","挑一张壁纸")+'</a></article></main>';
  }
  function sponsor() {
    const desk = params.get("brand")==="deskfolk";
    document.title=(desk?"Deskfolk":"PicVault")+" | "+L("A little more space","多一点空间");
    return '<main id="main" class="wrap"><section class="sponsor-hero"><span class="ad-label">'+L("SPONSORED CONTENT","赞助内容")+' · '+(desk?"DESKFOLK":"PICVAULT")+'</span><div class="sponsor-symbol" aria-hidden="true">'+(desk?'▤':'▧')+'</div><h1>'+(desk?L("A little space.<br>A clearer mind.","桌面留一点白，<br>思绪多一点空间。"):L("More room for<br>your favourite things.","给喜欢的东西，<br>多留一点空间。"))+'</h1><p>'+(desk?L("Thoughtful desk essentials for a more comfortable everyday workspace.","简单的桌面好物，让每天的工作空间更舒适。"):L("Bring your pictures together with PicVault. One collection, ready when you are.","用 PicVault 把喜欢的图片放在一起，随时找到想要的风景。"))+'</p><button class="button primary" data-offer>'+L("Explore the offer","查看优惠")+'</button><a class="text-link" href="'+esc(route("wallpaper.html",{id:visit.lastDetail}))+'">'+L("Back to your wallpaper","返回壁纸详情")+' →</a><p class="sponsor-note">'+L("Fictional advertiser in a browsing demonstration. No purchase or account is required.","浏览演示中的虚构广告商。无需购买或注册。")+'</p></section></main>';
  }
  function render() {
    $("#app").innerHTML=header()+(page==="detail"?detail():page==="about"?about():page==="sponsor"?sponsor():browse())+footer();
    document.documentElement.lang=zh?"zh-Hans":"en";
    $(".skip").textContent=L("Skip to content","跳至内容");
  }
  if(!items.length) {
    $("#app").textContent=L("The collection could not load. Please reload this page.","壁纸库未能加载，请刷新页面。");
    return;
  }
  render();
  const eligible = page==="browse"||page==="detail";
  const canCount = () => eligible && !document.hidden && document.hasFocus() && !$("#site-dialog").open;
  let mark=performance.now(), running=canCount(), toastTimer, downloading=false;
  function showFloatingAd() {
    const root=$("#floating-ad");
    if(!eligible || visit.floatDismissed || visit.redirected || visit.activeSeconds<12) { root.replaceChildren(); return; }
    if(root.firstChild) return;
    root.innerHTML='<aside class="float-ad" aria-label="'+L("Advertisement from PicVault","PicVault 广告")+'"><button class="ad-close" data-close-ad aria-label="'+L("Close advertisement","关闭广告")+'">×</button><span class="ad-label">'+L("ADVERTISEMENT","广告")+' · PICVAULT</span><strong>'+L("Looking for a fresh background?","想换一张新壁纸？")+'</strong><p>'+L("Your next favourite is one click away.","下一个喜欢的风景，就在眼前。")+'</p><a class="ad-download" data-sponsored-download href="'+esc(route("sponsor.html"))+'">'+icon("download")+L("Download now","立即下载")+'</a><small>'+L("Sponsored link · picvault.example","赞助链接 · picvault.example")+'</small></aside>';
  }
  function account() {
    const now=performance.now();
    if(running) visit.activeSeconds=Math.min(86400,visit.activeSeconds+Math.max(0,now-mark)/1000);
    mark=now;running=canCount();persist();showFloatingAd();
  }
  setInterval(account,500);
  document.addEventListener("visibilitychange",account);
  window.addEventListener("blur",account); window.addEventListener("focus",account);
  window.addEventListener("pagehide",()=>{account();running=false;});
  window.addEventListener("pageshow",event=>{
    if(event.persisted) {
      visit=normalize(read());render();
      if($("#site-dialog").open) $("#site-dialog").close();
      mark=performance.now();running=canCount();showFloatingAd();
    }
  });
  function toast(message) {
    const el=$("#toast");el.textContent=message;el.hidden=false;
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true;},4200);
  }
  async function download(item, button) {
    if(downloading) return;
    const width=Number($("#resolution").value), height=width*9/16;
    if(![1920,2560,3840].includes(width)) return;
    downloading=true;button.disabled=true;button.querySelector("span").textContent=L("Preparing JPG…","正在生成 JPG…");
    try {
      const img=new Image();
      img.src=new URL(item.asset,location.href).href;
      await img.decode();
      const canvas=document.createElement("canvas");
      canvas.width=width;canvas.height=height;
      const ctx=canvas.getContext("2d");
      if(!ctx) throw new Error("Canvas unavailable");
      ctx.fillStyle="#ffffff";ctx.fillRect(0,0,width,height);ctx.drawImage(img,0,0,width,height);
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("JPG unavailable")),"image/jpeg",.94));
      const objectURL=URL.createObjectURL(blob);
      const anchor=document.createElement("a");anchor.href=objectURL;anchor.download="stillwall-"+item.id+"-"+width+"x"+height+".jpg";
      document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(objectURL),60000);
      if(!visit.downloaded.includes(item.id))visit.downloaded.push(item.id);persist();
      toast(L("Your wallpaper is ready. Check your downloads.","壁纸已准备好，请查看浏览器下载。"));
    } catch {
      toast(L("The image could not be prepared. Try again or use Open original.","图片暂时无法生成，请重试，或使用「查看原图」。"));
    } finally {
      downloading=false;button.disabled=false;button.querySelector("span").textContent=L("Download wallpaper","下载壁纸");
    }
  }
  document.addEventListener("change",event=>{
    if(event.target.matches("[data-sort]")) event.target.form.requestSubmit();
  });
  document.addEventListener("click",event=>{
    const control=event.target.closest("a,button");
    if(!control) return;
    if(control.matches("[data-sponsored-download]")) {
      if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||document.hidden) return;
      account();
      if(visit.activeSeconds>=20 && !visit.redirected) {
        event.preventDefault();visit.redirected=true;persist();
        location.assign(route("redirect.html"));
      }
      return;
    }
    if(control.matches("[data-close-ad]")) {
      visit.floatDismissed=true;persist();$("#floating-ad").replaceChildren();return;
    }
    if(control.dataset.save) {
      const id=control.dataset.save;if(!byId(id))return;
      visit.saved=visit.saved.includes(id)?visit.saved.filter(value=>value!==id):[...visit.saved,id];
      persist();
      if(page==="browse"&&params.get("saved")==="1") { render();$("#main").setAttribute("tabindex","-1");$("#main").focus({preventScroll:true}); }
      else document.querySelectorAll("[data-save]").forEach(button=>{
        if(button.dataset.save!==id)return;
        const saved=visit.saved.includes(id);
        button.setAttribute("aria-pressed",String(saved));
        button.setAttribute("aria-label",(saved?L("Unsave ","取消收藏："):L("Save ","收藏："))+byId(id).title[lang]);
        const label=button.querySelector("span");if(label)label.textContent=saved?L("Saved","已收藏"):L("Save wallpaper","收藏壁纸");
      });
      return;
    }
    if(control.dataset.download) { const item=byId(control.dataset.download);if(item)download(item,control);return; }
    if(control.matches("[data-offer]")) {
      account();
      $("#site-dialog").innerHTML='<h2 id="dialog-title">'+L("This offer is a demonstration","这是一个演示优惠")+'</h2><p>'+L("No subscription, payment or account will be created. You can return to your wallpaper and use the Stillwall download button to save the actual image.","不会创建订阅、付款或账户。返回壁纸页面后，可使用 Stillwall 的下载按钮保存真正的图片。")+'</p><form method="dialog"><button class="button primary">'+L("Got it","知道了")+'</button></form>';
      $("#site-dialog").showModal();account();
    }
  });
  $("#site-dialog").addEventListener("close",account);
  showFloatingAd();
})();
