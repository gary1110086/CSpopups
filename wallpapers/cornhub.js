/* Isolated adapter: navigation belongs to the browser; prompts are local demos. */
(() => {
  "use strict";
  const STORAGE = "sw-cornhub-v1";
  const VERSION = "wallpaper1";
  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") === "zh" ? "zh" : "en";
  const zh = lang === "zh";
  const root = document.getElementById("cornhub-content");
  const catalogue = window.NIGHTROOM;
  if (!catalogue || !root) return;
  document.documentElement.lang = zh ? "zh-Hans" : "en";

  function read() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE)); }
    catch { return null; }
  }
  const raw = read();
  const cached = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const clipIds = value => Array.isArray(value)
    ? [...new Set(value.filter(id => Number.isInteger(id) && id >= 0 && id < 12))]
    : [];
  const boundedInteger = (value, fallback, min, max) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= min && number <= max ? number : fallback;
  };
  const startedAt = Number.isFinite(cached.startedAt) && cached.startedAt > 0 && cached.startedAt <= Date.now()
    ? cached.startedAt : Date.now();
  const knownActions = new Set(["watch", "play", "install", "join", "allow", "block", "dismiss", "ad-close"]);
  const state = Object.assign(catalogue.initial(), {
    liked: clipIds(cached.liked),
    saved: clipIds(cached.saved),
    adHidden: cached.adHidden === true,
    chatHidden: cached.chatHidden === true,
    reported: Number.isInteger(cached.reported) && cached.reported >= 0 && cached.reported < 12 ? cached.reported : undefined,
    actions: Array.isArray(cached.actions) ? cached.actions.filter(item => item && knownActions.has(item.kind) && Number.isFinite(item.at) && item.at >= 0).slice(-100) : [],
    view: params.get("view") === "watch" ? "watch" : "browse",
    video: boundedInteger(params.get("video"), 0, 0, 11),
    page: boundedInteger(params.get("page"), 1, 1, 100),
    filter: ["studio", "interview", "behind"].includes(params.get("filter")) ? params.get("filter") : "all",
    sort: ["top", "latest"].includes(params.get("sort")) ? params.get("sort") : "featured",
    query: (params.get("q") || "").slice(0, 80),
  });
  let returnAction = null;
  let loadingTimer = null;
  const elapsed = () => Math.max(0, (Date.now() - startedAt) / 1000);
  function save() {
    state.actions = state.actions.slice(-100);
    try { sessionStorage.setItem(STORAGE, JSON.stringify({ ...state, startedAt })); }
    catch { /* Browsing continues when storage is disabled or full. */ }
  }
  function url(file, values = {}) {
    const destination = new URL(file, location.href);
    destination.search = new URLSearchParams({ lang, v: VERSION, ...values }).toString();
    return destination.href;
  }
  function anchor(button, values = {}) {
    const link = document.createElement("a");
    link.href = url("cornhub.html", values);
    link.className = button.className;
    link.innerHTML = button.innerHTML;
    for (const name of ["aria-label", "aria-current"]) {
      if (button.hasAttribute(name)) link.setAttribute(name, button.getAttribute(name));
    }
    button.replaceWith(link);
  }
  function restoreFocus(action) {
    const control = [...root.querySelectorAll("[data-action]")].find(element => element.dataset.action === action);
    control?.focus({ preventScroll: true });
  }
  function render(focusAction) {
    const previousAction = focusAction || document.activeElement?.dataset.action;
    document.title = state.view === "watch" ? "Watch | Cornhub" : "Cornhub | Videos";
    root.innerHTML = catalogue.render(state, lang);
    const convert = (action, map) => root.querySelectorAll(`[data-action="night-${action}"]`).forEach(button => anchor(button, map(button)));
    convert("watch", button => ({ view: "watch", video: button.dataset.video }));
    convert("browse", () => ({}));
    convert("filter", button => ["top", "latest"].includes(button.dataset.filter)
      ? { sort: button.dataset.filter } : { filter: button.dataset.filter });
    convert("page", button => ({ page: button.dataset.page, filter: state.filter, sort: state.sort, q: state.query }));
    convert("channel", button => ({ q: button.dataset.channel }));

    const form = root.querySelector("#night-search");
    form.action = "cornhub.html";
    form.method = "get";
    root.querySelector("#night-query").name = "q";
    for (const [name, value] of [["lang", lang], ["v", VERSION]]) {
      const field = document.createElement("input");
      field.type = "hidden";
      field.name = name;
      field.value = value;
      form.append(field);
    }
    const footer = root.querySelector(".nr-footer");
    footer.replaceChildren();
    const copyright = document.createElement("span");
    copyright.textContent = "© 2026 Cornhub";
    const footerLinks = document.createElement("span");
    for (const [file, label] of [["index.html", zh ? "返回壁纸站" : "Back to wallpapers"], ["about.html", zh ? "关于与隐私" : "About & privacy"]]) {
      const link = document.createElement("a");
      link.href = url(file);
      link.textContent = label;
      footerLinks.append(link);
    }
    footer.append(copyright, footerLinks);

    const prompt = root.querySelector(".nr-prompt");
    document.documentElement.classList.toggle("has-dialog", Boolean(prompt));
    if (prompt) {
      prompt.setAttribute("aria-modal", "true");
      prompt.tabIndex = -1;
      for (const sibling of root.querySelector(".night-site").children) {
        sibling.inert = !sibling.classList.contains("nr-prompt-backdrop");
      }
      (prompt.querySelector("button") || prompt).focus({ preventScroll: true });
    } else {
      const closesPrompt = ["night-dismiss", "night-install", "night-join", "night-allow", "night-block"].includes(previousAction);
      restoreFocus(closesPrompt ? returnAction : previousAction);
    }
    save();
  }

  root.addEventListener("click", event => {
    const control = event.target.closest("button[data-action]");
    if (!control || control.disabled || !control.dataset.action.startsWith("night-")) return;
    const action = control.dataset.action.slice(6);
    if (["premium", "chat", "download", "play"].includes(action)) returnAction = control.dataset.action;
    if (action === "play") clearTimeout(loadingTimer);
    catalogue.act(state, action, control.dataset, elapsed());
    render(control.dataset.action);
    if (action === "play") {
      loadingTimer = setTimeout(() => {
        if (state.phase === "loading" && !state.notice) {
          returnAction = "night-play";
          state.notice = "update";
          render();
        }
      }, 900);
    }
  });
  document.addEventListener("keydown", event => {
    const prompt = root.querySelector(".nr-prompt");
    if (!prompt) return;
    if (event.key === "Escape") {
      event.preventDefault();
      catalogue.act(state, "dismiss", {}, elapsed());
      render("night-dismiss");
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [...prompt.querySelectorAll("button,a[href],input,[tabindex]")].filter(element => !element.disabled && element.tabIndex >= 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (!first) { event.preventDefault(); prompt.focus(); }
    else if (event.shiftKey && (document.activeElement === first || !prompt.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !prompt.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
  window.addEventListener("pagehide", () => { clearTimeout(loadingTimer); save(); });
  window.addEventListener("pageshow", event => {
    if (!event.persisted) return;
    const latest = read();
    if (latest && typeof latest === "object" && !Array.isArray(latest)) {
      state.liked = clipIds(latest.liked);
      state.saved = clipIds(latest.saved);
      state.adHidden = latest.adHidden === true;
      state.chatHidden = latest.chatHidden === true;
      state.reported = Number.isInteger(latest.reported) && latest.reported >= 0 && latest.reported < 12 ? latest.reported : undefined;
      state.actions = Array.isArray(latest.actions) ? latest.actions.filter(item => item && knownActions.has(item.kind) && Number.isFinite(item.at) && item.at >= 0).slice(-100) : [];
    }
    // A frozen loading state cannot retain its timer after leaving the page.
    if (state.phase === "loading") state.phase = "ready";
    render();
  });
  render();
})();
