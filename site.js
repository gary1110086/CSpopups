(() => {
  "use strict";
  const {ui, scenarios} = window.POPUP_CONTENT;
  const $ = (s, root=document) => root.querySelector(s);
  const params = new URLSearchParams(location.search);
  const page = document.body.dataset.page;
  const read = (key, fallback) => { try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Browsing works without storage. */ } };
  const lang = params.get("lang") === "zh" ? "zh" : params.get("lang") === "en" ? "en" : read("ld-language", "en");
  const settings = {lang: ["en", "zh"].includes(lang) ? lang : "en", pace:"standard"};
  write("ld-language", settings.lang);
  document.documentElement.lang = settings.lang === "zh" ? "zh-Hans" : "en";
  const zh = settings.lang === "zh";
  const t = key => ui[settings.lang][key] ?? ui.en[key] ?? key;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const findScenario = id => scenarios.find(s => s.id === id);
  const textOf = s => s[settings.lang];
  const button = (label, action, cls="primary-button", attrs="") => `<button class="${cls}" data-action="${action}" ${attrs}>${esc(label)}</button>`;
  const closeButton = id => `<button class="close-control" data-action="${findScenario(id)?.fakeClose ? "fake-close" : "dismiss"}" data-id="${id}" aria-label="${esc(t("close"))}">${icon("close")}</button>`;
  const initial = () => ({startedAt: Date.now(), activeSeconds:0, fired:[], popups:[], records:[], z:1});
  function normalizeVisit(value) {
    const clean = initial();
    if (!value || !Number.isFinite(value.startedAt) || value.startedAt <= 0) return clean;
    clean.startedAt = value.startedAt;
    clean.activeSeconds = Number.isFinite(value.activeSeconds) ? Math.max(0, value.activeSeconds) : 0;
    clean.fired = Array.isArray(value.fired) ? [...new Set(value.fired.filter(findScenario))] : [];
    clean.popups = Array.isArray(value.popups) ? value.popups.filter(p => p && findScenario(p.id)).slice(-4).map((p,i) => ({id:p.id,parent:"article",z:i+1,info:false})) : [];
    clean.records = Array.isArray(value.records) ? value.records.filter(r => r && typeof r.id === "string").slice(-500) : [];
    clean.z = clean.popups.length + 1;
    return clean;
  }
  const visit = normalizeVisit(read("ld-visit", null));
  const state = {popups:visit.popups.filter(p => findScenario(p.id)), activeTab:"article"};
  const persist = () => { visit.popups = state.popups; write("ld-visit", visit); };
  const record = (id, action) => { visit.records.push({id, action, at:Date.now()}); persist(); };
  const elapsed = () => (Date.now()-visit.startedAt)/1000;
  const url = (file, query={}) => { const u = new URL(file, location.href); u.searchParams.set("lang",settings.lang); Object.entries(query).forEach(([k,v])=> { if(v!==null && v!==undefined && v!=="") u.searchParams.set(k,String(v)); }); return u.href; };
  const link = (label, file, query={}, cls="", extra="") => `<a class="${cls}" href="${esc(url(file,query))}" ${extra}>${label}</a>`;
  const articleLink = (label, cls="outline-button") => link(esc(label),"article.html",{},cls);
  function anchor(control, file, query={}, newTab=false) {
    const a=document.createElement("a");
    for(const attr of control.attributes) a.setAttribute(attr.name,attr.value);
    a.innerHTML=control.innerHTML; a.href=url(file,query);
    if(newTab) { a.target="_blank"; a.rel="noopener"; }
    control.replaceWith(a); return a;
  }
  function languageLinks() {
    return `<div class="site-language" aria-label="Language">${["en","zh"].map(l => {const u=new URL(location.href);u.searchParams.set("lang",l);return `<a href="${esc(u.href)}" ${settings.lang===l?'aria-current="true"':''}>${l==="en"?"EN":"中文"}</a>`;}).join("")}</div>`;
  }
  function footer() { return `<footer class="site-footer"><span>© 2026 Little Daily</span>${link(zh?"关于与隐私":"About & privacy","about.html")}${link("Nightroom ↗","nightroom.html",{},"",'target="_blank" rel="noopener"')}${languageLinks()}</footer>`; }
  let toastTimer;
  function toast(message) { const el=$("#toast"); el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3500); }
  let dialogFocus;
  function dialog(title, message) {
    dialogFocus=document.activeElement;
    $("#overlay-root").innerHTML=`<div class="site-dialog"><section role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button class="close-control" data-action="dialog-close" aria-label="${esc(t("close"))}">×</button><h2 id="dialog-title">${esc(title)}</h2><p>${esc(message)}</p>${button(zh?"知道了":"Got it","dialog-close")}</section></div>`;
    $("#site-content").inert=true;
    if($("#popup-layer")) $("#popup-layer").inert=true;
    document.documentElement.classList.add("has-dialog");
    $(".site-dialog button").focus();
  }
  function closeDialog() { $("#overlay-root").replaceChildren();$("#site-content").inert=false;if($("#popup-layer"))$("#popup-layer").inert=false;document.documentElement.classList.remove("has-dialog");dialogFocus?.focus(); }
  const paths = {
    close: "M6 6l12 12M18 6L6 18",
    arrow: "M5 12h14m-5-5l5 5-5 5",
    back: "M19 12H5m5-5l-5 5 5 5",
    pause: "M9 5v14m6-14v14",
    play: "m8 5 11 7-11 7V5Z",
    exit: "M10 5H5v14h5m4-14h5v14h-5m-3-7h7m-3-3 3 3-3 3",
    reload: "M19 8a8 8 0 1 0 1 7M19 3v5h-5",
    lock: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z",
    info: "M12 11v6m0-10v.1M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0",
    bell: "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zm5 3h4",
    mail: "M3 5h18v14H3zm0 0 9 8 9-8",
    parcel: "m3 7 9-5 9 5v11l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v11M7.5 4.5l9 5",
    gift: "M3 9h18v4H3zm2 4v9h14v-9M12 9v13M12 9C4 9 5 1 9 3c3 1 3 6 3 6s0-5 3-6c4-2 5 6-3 6Z",
    download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
    shield: "m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3Zm-4 10 3 3 5-6",
    bank: "m2 8 10-6 10 6H2Zm1 13h18M5 10v8m5-8v8m4-8v8m5-8v8",
    clipboard: "M8 5H4v17h16V5h-4M8 2h8v6H8zm0 11h8m-8 4h6",
    message:
      "M21 15a3 3 0 0 1-3 3H8l-5 4V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10ZM7 8h10M7 12h7",
    headphones:
      "M4 14v-3a8 8 0 0 1 16 0v3M4 12h3v9H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm16 0h-3v9h3a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Z",
    cookie: "M21 12a9 9 0 1 1-9-9 5 5 0 0 0 9 9ZM7 8v.1m5 5v.1m-5 3v.1m9 1v.1",
    search: "M21 21l-5.5-5.5M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0",
    sound: "M11 4 6 8H2v8h4l5 4V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",
    mute: "M11 4 6 8H2v8h4l5 4V4Zm5 5 6 6m0-6-6 6",
    fullscreen: "M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6",
    check: "m5 12 4 4L19 6",
    chevron: "m6 9 6 6 6-6",
    leaf: "M20 3C8 1 2 9 5 15s13 5 15-12ZM4 21 16 8",
    triangle: "m5 3 15 9-15 9V3Z",
    settings: "M4 7h16M4 17h16M9 4v6m6 4v6",
  };
  const icon = (name, cls = "") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.info}"/></svg>`;
  function renderArticle() {
    $("#article-page").innerHTML = `
      <div class="masthead-border"><header class="site-header">
        <button class="site-logo" data-action="article-top">Little Daily</button>
        <nav aria-label="Little Daily">${["home", "living", "food", "money"].map((name) => `<button data-action="site-nav" data-section="${name}" class="${name === "living" ? "active" : ""}">${esc(t(name))}</button>`).join("")}</nav>
        <button class="icon-button site-search" data-action="search" aria-label="${esc(t("search"))}">${icon("search")}</button>
      </header></div>
      <div id="article-search"></div>
      <div class="editorial-layout"><article class="article">
        <p class="breadcrumb">${esc(t("breadcrumb"))}</p>
        <h1>${esc(t("articleTitle")).replace(", ", ",<br>")}</h1><p class="standfirst">${esc(t("articleSub"))}</p>
        <div class="byline"><span class="avatar" aria-hidden="true">AT</span><div>${esc(t("byline"))}<time datetime="2026-10-12">${esc(t("articleDate"))}</time></div></div>
        <img class="article-photo" src="assets/sunday-room.png" alt="${settings.lang === "zh" ? "阳光照进公寓，绿色沙发旁有植物，木桌上放着一杯咖啡。" : "A sunlit apartment, a green sofa, plants, and coffee on a wooden table."}" draggable="false">
        <div class="photo-caption">Little Daily studio</div>
        <div class="article-body"><p class="lead">${esc(t("articleLead"))}</p>
        ${[1, 2, 3].map((n) => `<h2>${esc(t("articleH" + n))}</h2><p>${esc(t("articleP" + n))}</p>`).join("")}
        <aside class="sunday-note"><span>${esc(t("articleNote"))}</span><blockquote>${esc(t("articleQuote"))}</blockquote></aside><p>${esc(t("articleClosing"))}</p>
        <div class="related"><h3>${esc(t("moreStories"))}</h3>${[1, 2, 3].map((n) => `<button data-action="story" data-story="${n}">${esc(t("story" + n))}${icon("arrow")}</button>`).join("")}</div></div>
      </article><aside class="ad-rail"><p class="ad-label">${esc(t("ad"))}</p><section class="telecom-ad" id="telecom-ad" aria-label="${esc(t("ad"))}">
        <div class="ad-controls"><button data-action="rail-info" aria-label="${esc(t("adInfoTitle"))}">${icon("info")}</button><button data-action="rail-close" aria-label="${esc(t("adInfoClose"))}">${icon("close")}</button></div>
        <div class="telecom-brand">${icon("leaf")}${esc(t("mobileBrand"))}</div><h2>${esc(t("mobileTitle"))}</h2><p>${esc(t("mobileSub"))}</p><div class="ad-price">${esc(t("mobilePrice"))}</div><button class="outline-button" data-action="ordinary-shop" data-product="mobile">${esc(t("findOut"))}${icon("arrow")}</button>
      </section><div class="rail-note"><h3>${esc(t("articleClosing"))}</h3><p>${esc(t("articleLead"))}</p></div></aside></div>
      <footer class="site-footer"><span>© 2026 Little Daily</span><span>${esc(t("privacy"))}</span></footer>`;
  }

  function offerButtons(s) {
    const text = textOf(s);
    return `<div class="button-row"><button class="blue-button" data-action="offer" data-id="${s.id}" data-offer="${esc(s.domain)}">${esc(text[2])}</button><button class="secondary-button" data-action="dismiss" data-id="${s.id}">${esc(text[3])}</button></div>`;
  }

  function popupBody(s) {
    const text = textOf(s);
    const origin = `<div class="popup-origin"><b>${esc(s.brand)}</b><br>${esc(s.domain)}</div>`;
    const close = closeButton(s.id);
    switch (s.id) {
      case "cookie":
        return `${close}<h2>${esc(t("cookieTitle"))}</h2><p>${esc(t("cookieBody"))}</p><div class="cookie-options">${button(t("cookieReject"), "dismiss", "primary-button", 'data-id="cookie"')}${button(t("cookieAccept"), "cookie-accept", "secondary-button")}</div>${button(t("cookieLink"), "cookie-settings", "text-button")}`;
      case "earbuds":
        return `<img class="earbuds-thumb" src="assets/earbuds.png" alt="${settings.lang === "zh" ? "白色无线耳机" : "White wireless earbuds"}"><div><p class="earbuds-copy">${esc(t("earbudsBrand"))}</p><h2>${esc(t("earbudsTitle"))}<br>${esc(t("earbudsPrice"))}</h2></div><button class="blue-button" data-action="offer" data-id="earbuds" data-offer="soundandco.example">${esc(t("shop"))}</button><div class="ad-controls"><button class="ad-choice" data-action="ad-info" data-id="earbuds" aria-label="${esc(t("adInfoTitle"))}">AdChoices ${icon("triangle")}</button><button data-action="dismiss" data-id="earbuds" aria-label="${esc(t("adInfoClose"))}">${icon("close")}</button></div>`;
      case "newsletter":
        return `${close}<div class="popup-icon">${icon("mail")}</div><h2>${esc(t("newsletterTitle"))}</h2><p>${esc(t("newsletterBody"))}</p>${button(t("newsletterCta"), "newsletter", "primary-button")}${button(t("newsletterSkip"), "dismiss", "text-button", 'data-id="newsletter"')}<div class="newsletter-fine">${esc(t("newsletterFine"))}</div>`;
      case "notification":
        return `${close}<h2>${esc(text[0])}</h2><div class="permission-request">${icon("bell")}<span>${esc(text[1])}</span></div><div class="button-row">${button(text[3], "block", "outline-button", 'data-id="notification"')}${button(text[2], "allow", "blue-button", 'data-id="notification"')}</div>`;
      case "parcel":
      case "bank":
        return `${close}<div class="popup-icon">${icon(s.icon)}</div><div class="popup-main"><h2>${esc(text[0])}</h2><p>${esc(text[1])}</p>${origin}${offerButtons(s)}</div>`;
      case "voucher":
        return `<div class="voucher-band">${icon("gift")}${esc(s.brand)}</div>${close}<div class="voucher-value"><small>RM</small>500</div><div class="voucher-content"><h2>${esc(text[0])}</h2><p>${esc(text[1])}</p>${origin}${offerButtons(s)}</div>`;
      case "update":
        return `${close}<div class="update-head">${icon("download")}${esc(s.brand)}</div><h2>${esc(text[0])}</h2><p>${esc(text[1])}</p>${origin}${offerButtons(s)}`;
      case "captcha":
        return `${close}<h2>${esc(text[0])}</h2><p>${esc(text[1])}</p><button class="captcha-check" data-action="allow" data-id="captcha" aria-label="${esc(text[2])}"><span class="captcha-box"></span><span>${settings.lang === "zh" ? "我不是机器人" : "I’m not a robot"}</span><span class="captcha-mark">${icon("shield")}</span></button>${origin}<div class="button-row">${button(text[2], "allow", "blue-button", 'data-id="captcha"')}${button(text[3], "dismiss", "text-button", 'data-id="captcha"')}</div>`;
      case "security":
        return `${close}<div class="security-brand">${icon("shield")}${esc(s.brand)}</div><h2>${esc(text[0])}</h2><p>${esc(text[1])}</p><div class="security-result"><i></i>${settings.lang === "zh" ? "检测完成 · 3 项待处理" : "Check complete · 3 items to review"}</div>${origin}${offerButtons(s)}`;
      case "download":
        return `<div class="video-preview">${icon("play")}</div>${close}<h2>${esc(text[0])}</h2><p>${esc(text[1])}</p>${origin}${offerButtons(s)}`;
      case "survey":
        return `${close}<p class="popup-topline">${esc(s.brand)}</p><div class="survey-dots"><i></i><i></i><i></i></div><h2>${esc(text[0])}</h2><p>${esc(text[1])}</p>${origin}${offerButtons(s)}`;
      case "support":
        return `${close}<div class="support-identity"><i></i>${esc(s.brand)}</div><h2>${esc(text[0])}</h2><p>${esc(text[1])}</p>${origin}${offerButtons(s)}`;
      default:
        return `${close}<h2>${esc(text[0])}</h2><p>${esc(text[1])}</p>${offerButtons(s)}`;
    }
  }

  function renderPopups() {
    $("#popup-layer").innerHTML = state.popups
      .filter((p) => p.parent === state.activeTab)
      .map((p) => {
        const s = findScenario(p.id);
        return `<section class="popup popup-${s.format}" data-popup="${s.id}" style="z-index:${p.z}" aria-label="${esc(s.brand)}">${popupBody(s)}${p.info ? `<div class="popup-info"><h2>${esc(t("adInfoTitle"))}</h2><p>${esc(t("adInfoBody"))}</p>${button(t("adInfoClose"), "dismiss", "text-button", `data-id="${s.id}"`)}</div>` : ""}</section>`;
      })
      .join("");
  }


  function wirePopups() {
    document.querySelectorAll('#popup-layer [data-action="offer"], #popup-layer [data-action="fake-close"]').forEach(el=>anchor(el,"offer.html",{case:el.dataset.id},true));
  }
  const originalRenderPopups = renderPopups;
  renderPopups = function() { originalRenderPopups();wirePopups(); };
  function dismiss(id, action="closed") { record(id,action);state.popups=state.popups.filter(p=>p.id!==id);persist();renderPopups(); }
  function article() {
    renderArticle();
    document.title = `${t("articleTitle")} | Little Daily`;
    document.querySelectorAll('[data-action="article-top"]').forEach(el=>anchor(el,"article.html"));
    document.querySelectorAll('[data-action="site-nav"]').forEach(el=> {const key=el.dataset.section;const a=anchor(el,"article.html",{section:key});a.classList.toggle("active",key===(params.get("section")||"living"));});
    document.querySelectorAll('[data-action="story"]').forEach(el=>anchor(el,"story.html",{id:el.dataset.story}));
    document.querySelectorAll('[data-action="ordinary-shop"]').forEach(el=>anchor(el,"offer.html",{case:"earbuds",product:el.dataset.product},true));
    $(".site-header").insertAdjacentHTML("beforeend",languageLinks());
    $(".site-footer").outerHTML=footer();
    const section=params.get("section");
    const story=params.get("id");
    const query=params.get("q");
    if(page==="story") {
      const n=["1","2","3"].includes(story)?Number(story):1;
      $(".article h1").textContent=t("story"+n);
      $(".standfirst").textContent=t("articleP"+n);
      $(".article-body").innerHTML=`<p class="lead">${esc(t("articleP"+n))}</p><h2>${esc(t("articleH"+n))}</h2><p>${esc(t("articleLead"))}</p>${articleLink(zh?"返回周日文章":"Read the Sunday story")}`;
      document.title=`${t("story"+n)} | Little Daily`;
    } else if(section && section!=="living") {
      $(".article").innerHTML=`<p class="breadcrumb">Little Daily / ${esc(t(section))}</p><h1>${esc(["home","food","money"].includes(section)?t(section):t("home"))}</h1><p class="standfirst">${esc(t("articleSub"))}</p><div class="related">${link(esc(t("articleTitle")),"article.html")}${[1,2,3].map(n=>link(esc(t("story"+n)),"story.html",{id:n})).join("")}</div>`;
      document.title=`${["home","food","money"].includes(section)?t(section):t("home")} | Little Daily`;
    }
    if(query!==null) showSearch(query);
    persist();renderPopups();
    const order=["cookie","earbuds","newsletter","notification","parcel","voucher","update","captcha","bank","security","download","survey","support"];
    const fractions=[0,.075,.16,.235,.31,.405,.49,.565,.64,.715,.79,.865,.935];
    // This measures reading time only to pace advertisements, not to end a round.
    // Flush at visibility/navigation boundaries so a background tab never catches up
    // with a burst, and native Back does not add time spent on another document.
    let pacingMark = performance.now();
    let pacingActive = !document.hidden;
    const advancePacing = () => {
      const now = performance.now();
      if (pacingActive) visit.activeSeconds += Math.max(0, (now-pacingMark)/1000);
      pacingMark = now;
      pacingActive = !document.hidden && !$(".site-dialog");
      persist();
    };
    document.addEventListener("visibilitychange", advancePacing);
    window.addEventListener("pagehide", () => { advancePacing(); pacingActive=false; });
    window.addEventListener("pageshow", () => { pacingMark=performance.now(); pacingActive=!document.hidden; });
    const tick=()=>{
      advancePacing();
      if(!pacingActive) return;
      for(let i=0;i<order.length;i++) {
        const id=order[i];
        if(!visit.fired.includes(id) && visit.activeSeconds>=fractions[i]*60) {
          visit.fired.push(id);record(id,"seen");
          if(state.popups.length>=4)state.popups.shift();
          state.popups.push({id,parent:"article",z:++visit.z,info:false});
          persist();renderPopups();break;
        }
      }
    };
    tick();setInterval(tick,500);
  }
  function showSearch(query="") {
    $("#article-search").innerHTML=`<form class="site-search-form" action="article.html" method="get"><input type="hidden" name="lang" value="${settings.lang}"><label class="sr-only" for="q">${esc(t("search"))}</label><input id="q" name="q" value="${esc(query)}" placeholder="${esc(t("searchPlaceholder"))}"><button aria-label="${esc(t("search"))}">${icon("search")}</button></form>`;
    if(params.has("q")) {
      const items=[{label:t("articleTitle"),file:"article.html",q:{}},...[1,2,3].map(n=>({label:t("story"+n),file:"story.html",q:{id:n}}))].filter(i=>!query||i.label.toLowerCase().includes(query.toLowerCase()));
      $("#article-search").insertAdjacentHTML("beforeend",`<div class="site-search-results">${items.map(i=>link(esc(i.label),i.file,i.q)).join("")||`<p>${esc(t("searchNone"))}</p>`}</div>`);
    }
  }
  function verification() {
    document.title=zh?"正在检查连接 · Little Daily":"Checking your connection | Little Daily";
    const render=phase=>{
      $("#site-content").innerHTML=`<section class="human-verification"><div class="human-content"><h1>${esc(location.host||"Little Daily")}</h1><p class="human-lead">${esc(t("humanLead"))}</p><div class="human-widget"><button class="human-control" data-action="verify-human" ${phase!=="idle"?"disabled":""}><span class="human-indicator ${phase}" aria-hidden="true">${phase==="passed"?icon("check"):""}</span><span aria-live="polite">${esc(t(phase==="idle"?"humanVerify":phase==="checking"?"humanChecking":"humanPassed"))}</span></button><div class="human-brand"><strong>Little Daily</strong><small>Connection check</small></div></div><p class="human-context">${esc(t(phase==="passed"?"humanContinue":"humanContext"))}</p></div><footer class="human-footer">${link(zh?"关于此演示":"About this demo","about.html")}${languageLinks()}</footer></section>`;
    };
    render("idle");
    document.addEventListener("click",e=>{
      if(!e.target.closest('[data-action="verify-human"]'))return;
      if($(".human-control").disabled)return;
      render("checking");setTimeout(()=>{render("passed");setTimeout(()=>{persist();location.replace(url("article.html"));},450);},1100);
    });
  }
  function offer() {
    const s=findScenario(params.get("case"));
    if(!s) { $("#site-content").innerHTML=`<section class="site-message"><h1>${zh?"页面不存在":"Page not found"}</h1>${articleLink(zh?"返回 Little Daily":"Back to Little Daily")}</section>`;return; }
    const ordinary=s.kind==="ordinary";
    const product=params.get("product")==="mobile"?"mobile":"earbuds";
    const key=s.destination||"Ordinary", lower=key.charAt(0).toLowerCase()+key.slice(1);
    const done=params.get("step")==="complete";
    document.title=`${s.brand} | ${t(done?"requestDone":`destination${key}`)}`;
    $("#site-content").innerHTML=`<section class="destination"><div class="destination-brand">${icon(s.icon)}${esc(product==="mobile"?t("mobileBrand"):s.brand)}</div><h1>${esc(t(done?"requestDone":`destination${key}`))}</h1><p class="destination-copy">${esc(t(done?"requestExplain":ordinary?"ordinaryProduct":`${lower}Request`))}</p>${ordinary?`<img class="product-photo" src="assets/${product==="mobile"?"mobile-plan":"earbuds"}.png" alt="${esc(s.brand)}">`:done?"":`<div class="demo-details">${icon("lock")}${esc(t("demoFields"))}</div>`}<div class="destination-actions">${!ordinary&&!done?link(esc(t(`${lower}Commit`)),"offer.html",{case:s.id,step:"complete"},"blue-button",'data-action="offer-commit"'):""}${articleLink(zh?"返回 Little Daily":"Return to Little Daily")}</div><footer class="destination-footer">${esc(t("demoNotice"))}<br>${link(zh?"关于与隐私":"About & privacy","about.html")}</footer></section>`;
  }
  let night;
  let nightReturnAction;
  function nightroom() {
    const cached=read("ld-night",null);
    const saved = cached && typeof cached === "object" ? cached : {};
    const clipIds = value => Array.isArray(value) ? [...new Set(value.filter(id => Number.isInteger(id) && id>=0 && id<12))] : [];
    night=Object.assign(window.NIGHTROOM.initial(), {
      liked:clipIds(saved.liked), saved:clipIds(saved.saved),
      adHidden:saved.adHidden===true, chatHidden:saved.chatHidden===true,
      reported:Number.isInteger(saved.reported) ? saved.reported : undefined,
    });
    night.notice=null;night.phase="ready";
    night.view=params.get("view")==="watch"?"watch":"browse";
    night.video=Math.max(0,Math.min(11,Number(params.get("video"))||0));
    night.filter=["studio","interview","behind"].includes(params.get("filter"))?params.get("filter"):"all";
    night.sort=["top","latest"].includes(params.get("sort"))?params.get("sort"):"featured";
    night.query=(params.get("q")||"").slice(0,80);night.page=Math.max(1,Number(params.get("page"))||1);
    renderNight();
  }
  function renderNight() {
    const previousAction = document.activeElement?.dataset.action;
    document.title=night.view==="watch"?"Watch | Nightroom":"Nightroom | Videos";
    $("#site-content").innerHTML=window.NIGHTROOM.render(night,settings.lang);
    document.querySelectorAll('[data-action="night-watch"]').forEach(el=>anchor(el,"nightroom.html",{view:"watch",video:el.dataset.video}));
    document.querySelectorAll('[data-action="night-browse"]').forEach(el=>anchor(el,"nightroom.html"));
    document.querySelectorAll('[data-action="night-filter"]').forEach(el=>anchor(el,"nightroom.html",["top","latest"].includes(el.dataset.filter)?{sort:el.dataset.filter}:{filter:el.dataset.filter}));
    document.querySelectorAll('[data-action="night-page"]').forEach(el=>anchor(el,"nightroom.html",{page:el.dataset.page,filter:night.filter,sort:night.sort,q:night.query}));
    document.querySelectorAll('[data-action="night-channel"]').forEach(el=>anchor(el,"nightroom.html",{q:el.dataset.channel}));
    const form=$("#night-search");form.action="nightroom.html";form.method="get";$("#night-query").name="q";form.insertAdjacentHTML("beforeend",`<input type="hidden" name="lang" value="${settings.lang}">`);
    $(".nr-footer").innerHTML=`<span>© 2026 Nightroom</span><span>${articleLink(zh?"返回 Little Daily":"Little Daily","")}${link(zh?"关于与隐私":"About & privacy","about.html")}</span>`;
    const prompt = $(".nr-prompt");
    document.documentElement.classList.toggle("has-dialog", !!prompt);
    if (prompt) {
      prompt.setAttribute("aria-modal", "true");
      for (const child of $(".night-site").children) child.inert = !child.classList.contains("nr-prompt-backdrop");
      $("button", prompt)?.focus();
    } else {
      const restore = ["night-dismiss", "night-block", "night-allow", "night-join", "night-install"].includes(previousAction) ? nightReturnAction : previousAction;
      [...document.querySelectorAll("[data-action]")].find(el => el.dataset.action === restore)?.focus({preventScroll:true});
    }
    write("ld-night",night);
  }
  function about() {
    document.title=zh?"关于与隐私 | Little Daily":"About & privacy | Little Daily";
    $("#site-content").innerHTML=`<section class="site-message"><h1>${zh?"关于这个网站":"About this website"}</h1><p>${zh?"这是社区防诈骗活动的浏览体验原型。Little Daily、Nightroom 和广告品牌是虚构教学场景。页面之间会真实跳转，但没有付款、安装、系统通知授权或个人资料收集。":"This is a browsing prototype for a community scam-awareness activity. Little Daily, Nightroom and the advertisers are fictional teaching scenarios. Links navigate to real pages, while payments, installations and permission requests remain demonstrations."}</p><p>${zh?"本版本没有倒计时或自动结束。浏览记录只保存在当前标签的会话存储里，不会上传。GitHub Pages 上线后会由 GitHub 处理网站访问请求。关闭此标签即可结束本次体验。":"This prototype has no countdown or automatic ending. Interaction records stay in this tab’s session storage and are not uploaded. If hosted on GitHub Pages, GitHub handles the website requests. Close this tab to end your visit."}</p>${articleLink(zh?"进入 Little Daily":"Visit Little Daily")}${languageLinks()}</section>`;
  }
  document.addEventListener("click",event=>{
    const control=event.target.closest("[data-action]");if(!control)return;
    const {action,id}=control.dataset;
    if(control.tagName==="A") {
      if(action==="offer"||action==="fake-close"||action==="ordinary-shop")record(id||"earbuds","clicked");
      if(action==="offer-commit")record(params.get("case"),"committed");
      return;
    }
    if(action==="dismiss"||action==="block")dismiss(id,action==="block"?"blocked":"closed");
    else if(action==="allow") {dismiss(id,"allowed");toast(t("permissionToast"));}
    else if(action==="cookie-accept")dismiss("cookie","accepted");
    else if(action==="cookie-settings")dialog(t("cookieTitle"),t("cookieSettings"));
    else if(action==="newsletter") {dismiss("newsletter","accepted");toast(t("newsletterDone"));}
    else if(action==="ad-info"||action==="rail-info")dialog(t("adInfoTitle"),t("adInfoBody"));
    else if(action==="rail-close")$("#telecom-ad").hidden=true;
    else if(action==="search") {showSearch();$("#q").focus();}
    else if(action==="dialog-close")closeDialog();
    else if(action.startsWith("night-") && night) {
      const name=action.slice(6);
      if (["premium", "chat", "download", "play"].includes(name)) nightReturnAction=action;
      window.NIGHTROOM.act(night,name,control.dataset,elapsed());renderNight();
      if(name==="play")setTimeout(()=>{if(night.phase==="loading"){night.notice="update";renderNight();}},900);
    }
  });
  document.addEventListener("keydown",e=>{
    const modal = $(".site-dialog [role=dialog], .nr-prompt");
    if(!modal)return;
    if(e.key==="Escape") {
      e.preventDefault();
      if (modal.classList.contains("nr-prompt")) { window.NIGHTROOM.act(night,"dismiss",{},elapsed());renderNight(); }
      else closeDialog();
      return;
    }
    if(e.key==="Tab") {const nodes=[...modal.querySelectorAll("button,a[href],input")].filter(el=>!el.disabled);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  // Native Back may restore a frozen document. Reconcile with the newer visit
  // saved by the page we just left instead of reviving dismissed advertisements.
  window.addEventListener("pageshow", event => {
    if (!event.persisted || !["article", "story"].includes(page)) return;
    const latest = read("ld-visit", null);
    if (!latest || !Array.isArray(latest.popups)) return;
    Object.assign(visit, normalizeVisit(latest));
    state.popups = visit.popups;
    renderPopups();
  });
  if(page==="verify")verification();
  else if(page==="article"||page==="story")article();
  else if(page==="offer")offer();
  else if(page==="nightroom")nightroom();
  else about();
})();
