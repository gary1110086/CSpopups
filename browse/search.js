/* Findline: native search routes and a local, harmless Pixelpress TXT guide. */
(() => {
  'use strict';

  window.BROWSE_SCENES = window.BROWSE_SCENES || {};
  window.BROWSE_SCENES.search = C => {
    const {root, params, t, esc} = C;
    const normalizeQuery = value => (typeof value === 'string' ? value : '').slice(0, 180)
      .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim();
    const query = params.has('q') ? normalizeQuery(params.get('q')) : 'Pixelpress download';
    const tab = ['downloads', 'help'].includes(params.get('tab')) ? params.get('tab') : 'all';
    const official = params.get('view') === 'official' && params.get('app') === 'pixelpress';
    const matched = /\bpixelpress\b/i.test(query);
    const sponsoredIDs = ['software', 'security'];
    let suspended = false, ended = false, generation = 0;
    let frame = 0, restoreFrame = 0, quietForDocument = false, status = '';
    const objectURLs = new Map();

    // C.url deliberately omits empty values. Preserve a genuinely submitted empty q.
    const route = (values = {}) => {
      const next = new URL(C.url('search.html', {q: query, ...values}));
      next.searchParams.set('q', Object.prototype.hasOwnProperty.call(values, 'q') ? normalizeQuery(values.q) : query);
      return next.href;
    };
    const link = values => esc(route(values));
    const allowedArray = (key, allowed) => {
      const value = C.read(key, []);
      return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string' && allowed.includes(item)))] : [];
    };
    const canMutate = () => !suspended && !ended && window.BROWSE_BOOTH?.canAct?.() !== false;
    const message = value => {
      status = value;
      const node = root.querySelector('[data-search-status]');
      if (node) node.textContent = value;
    };
    const addOfficialEvidence = key => {
      if (!official || !canMutate()) return false;
      const previous = allowedArray(key, ['pixelpress']);
      return previous.includes('pixelpress') || C.write(key, [...previous, 'pixelpress']) !== false;
    };
    const contextInputs = () => [...new URL(route()).searchParams]
      .filter(([name]) => !['q', 'view', 'app', 'tab'].includes(name))
      .map(([name, value]) => `<input type="hidden" name="${esc(name)}" value="${esc(value)}">`).join('');
    const searchForm = () => `<form class="fl-search-form" action="${link({})}" method="get" role="search">${contextInputs()}${tab !== 'all' ? `<input type="hidden" name="tab" value="${esc(tab)}">` : ''}<label class="fl-sr-only" for="fl-query">${t('Search the local index', '搜索本地索引')}</label><input id="fl-query" name="q" type="search" value="${esc(query)}" maxlength="180" autocomplete="off" spellcheck="false"><button type="submit">${t('Search', '搜索')}</button></form>`;
    const languageLink = () => `<a class="fl-language" href="${link({tab, ...(official ? {view: 'official', app: 'pixelpress'} : {}), lang: C.lang === 'zh' ? 'en' : 'zh'})}">${t('中文', 'English')}</a>`;
    const header = () => `<header class="fl-header"><a class="fl-brand" href="${link({q: 'Pixelpress download'})}" aria-label="Findline">Find<span>line</span></a>${searchForm()}${languageLink()}</header><nav class="fl-tabs" aria-label="${t('Search categories', '搜索分类')}">${[['all', t('All', '全部')], ['downloads', t('Downloads', '下载')], ['help', t('Help', '帮助')]].map(([value, label]) => `<a href="${link({tab: value})}"${tab === value ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
    const footer = () => `<footer class="fl-footer"><p>${t('Local practice index. The reserved .example domains are reference labels; these pages stay within this demonstration.', '本地练习索引。.example 为保留示例域名，仅用作来源标识；所有页面均在此演示内打开。')}</p><a href="${link({tab: 'help'})}">${t('About Findline', '关于 Findline')}</a></footer>`;
    const sponsored = id => {
      if (quietForDocument || allowedArray('search-dismissed', sponsoredIDs).includes(id)) return '';
      const software = id === 'software';
      const href = C.url('destination.html', {site: id, from: 'search', topic: 'Pixelpress', interest: 'image tools'});
      return `<section class="fl-result fl-sponsored" data-host-sponsored data-search-sponsored="${id}" aria-label="${t('Sponsored result', '赞助结果')}"><div class="fl-sponsor-meta"><span>${t('Sponsored', '赞助')} · ${software ? 'AppHarbor' : 'SecureLane'}</span><button type="button" class="fl-dismiss" data-search-dismiss="${id}" aria-label="${esc(t('Hide this sponsored result', '关闭此条赞助结果'))}">×</button></div><h2><a href="${esc(href)}" data-br-ad="${id}" target="_blank" rel="noopener">${software ? t('Pixelpress download — quick access to image tools', 'Pixelpress 下载 — 快速获取图片工具') : t('Pixelpress download check — review your device', 'Pixelpress 下载检查 — 查看设备状态')}</a></h2><div class="fl-domain">${software ? 'pixelpress-download.example' : 'pixelpress-check.example'} <span>› ${software ? 'download' : 'check'}</span></div><p>${software ? t('Get the image-tool package through AppHarbor. Choose your download option and review the available package.', '通过 AppHarbor 获取图片工具程序包，选择下载选项并查看可用程序包。') : t('SecureLane offers a device check before you continue. Review protection options and download guidance.', 'SecureLane 提供继续前的设备检查，可查看防护选项及下载指引。')}</p></section>`;
    };
    const related = () => `<section class="fl-related"><h2>${t('Related searches','相关搜索')}</h2><div>${[['Pixelpress image tools','Pixelpress 图片工具'],['Pixelpress getting started','Pixelpress 入门说明'],['Pixelpress quick download','Pixelpress 快速下载'],['Pixelpress device check','Pixelpress 设备检查']].map(([en,zh])=>`<a href="${link({q:t(en,zh),tab:'all'})}"><span aria-hidden="true">⌕</span>${esc(t(en,zh))}</a>`).join('')}</div></section>`;
    const results = () => `<main class="fl-results"><h1 class="fl-sr-only">${t('Search results', '搜索结果')}</h1><p class="fl-result-count">${matched ? t('1 indexed page for','约 1 条本地结果：')+' '+esc(query) : t('No matching pages in this local index','本地索引中没有匹配页面')}<span>${t('Local index · revision 14 Nov 2026','本地索引 · 修订 2026-11-14')}</span></p>${matched ? `${sponsored('software')}${sponsored('security')}<article class="fl-result fl-organic"><div class="fl-source-meta"><span class="fl-source-icon" aria-hidden="true">P</span><div><strong>Pixelpress</strong><span>pixelpress.example › image-tools › downloads</span><small>${t('Index updated 14 Nov 2026','索引更新于 2026年11月14日')}</small></div></div><h2><a data-official-result href="${link({view: 'official', app: 'pixelpress'})}">${t('Pixelpress — image tools & getting-started guide', 'Pixelpress — 图片工具与入门说明')}</a></h2><div class="fl-domain">pixelpress.example <span>› downloads</span></div><p>${t('The official Pixelpress reference page. Download the free getting-started TXT guide, read the quick-start steps and check the guide details. No installer is needed for this demonstration.', 'Pixelpress 官方参考页面。免费下载入门说明 TXT，阅读快速上手步骤并核对文件信息。本演示无需安装程序。')}</p><div class="fl-sitelinks"><a href="${link({view: 'official', app: 'pixelpress'})}#getting-started">${t('Getting started', '快速上手')}</a><a href="${link({view: 'official', app: 'pixelpress'})}#release-notes">${t('Guide notes', '说明文件信息')}</a></div></article>` : `<section class="fl-no-results"><h2>${query ? t('No results for', '没有找到：') + ' “' + esc(query) + '”' : t('Enter a search query', '请输入搜索词')}</h2><p>${t('This practice index contains the Pixelpress reference site. It does not search the public web.', '本练习索引包含 Pixelpress 参考网站，不会搜索互联网。')}</p><p>${t('Try:', '试试：')} <a href="${link({q: 'Pixelpress'})}">Pixelpress</a> · <a href="${link({q:'Pixelpress',tab:'all'})}">${t('Clear search','清除搜索')}</a></p></section>`}${related()}</main>`;
    const help = () => `<main class="fl-results fl-help"><p class="fl-result-count">${t('FINDLINE HELP', 'FINDLINE 帮助')}</p><h1>${t('A small, local search index', '一个小型本地搜索索引')}</h1><p>${t('Search for Pixelpress to find its reference download page. The All and Downloads tabs search the same small software index.', '搜索 Pixelpress 可找到其参考下载页。「全部」与「下载」检索同一份小型软件索引。')}</p><h2>${t('Reading a result', '阅读搜索结果')}</h2><p>${t('Each result shows a title, a display domain and a short description. Sponsored results are paid placements from separate advertisers. Follow the page whose source matches what you are looking for.', '每条结果显示标题、展示域名和简短说明。「赞助」结果来自独立广告商；请根据所需来源选择页面。')}</p><h2>${t('What stays on this device', '保留在本设备上的内容')}</h2><p>${t('Search routes use the address bar. Dismissed sponsored results and practice progress stay in the current browser visit. The Pixelpress guide is a free plain-text download.', '搜索页面通过地址栏导航。关闭的赞助结果与练习进度保留在当前浏览器访问中。Pixelpress 入门说明可免费下载为纯文本。')}</p><a href="${link({tab: 'all', q: 'Pixelpress'})}">${t('Search Pixelpress', '搜索 Pixelpress')}</a></main>`;
    const guideText = () => '\ufeff' + [
      'PIXELPRESS — GETTING STARTED / PIXELPRESS 入门说明',
      'Official practice reference / 官方练习参考: pixelpress.example',
      'Guide edition / 说明版本: 1.0', '',
      'This is a harmless UTF-8 text guide for a local browsing demonstration.',
      '这是本地浏览演示使用的无害 UTF-8 纯文本说明。',
      'It is not an installer. No sign-in, payment or external connection is required.',
      '这不是安装程序，无需登录、付款或连接外部服务。', '',
      '1. Keep an original copy of your image. / 保留图片原件。',
      '2. Choose an output size that fits its intended use. / 根据用途选择输出尺寸。',
      '3. Preview the image and check its proportions. / 预览图片并核对比例。',
      '4. Save a separate export and keep the source. / 另存导出文件，保留源文件。', '',
      'In this practice, downloading this TXT is the complete download action.',
      '在此练习中，下载这份 TXT 即为完整的下载操作。',
      'The demonstration does not install or supply an executable Pixelpress application.',
      '本演示不会安装或提供可执行的 Pixelpress 应用程序。', ''
    ].join('\r\n');
    const officialPage = () => `<div class="fl-official"><header class="fl-product-header"><a class="fl-product-brand" href="${link({view: 'official', app: 'pixelpress'})}">Pixelpress</a><nav aria-label="${t('Pixelpress navigation', 'Pixelpress 导航')}"><a href="#download">${t('Download', '下载')}</a><a href="#getting-started">${t('Getting started', '快速上手')}</a><a href="#release-notes">${t('Guide notes', '说明信息')}</a></nav>${languageLink()}</header><main class="fl-product-main"><a class="fl-back" href="${link({tab: 'all'})}">← ${t('Back to Findline results', '返回 Findline 搜索结果')}</a><p class="fl-origin">pixelpress.example / ${t('Official practice reference', '官方练习参考')}</p><h1>${t('Pixelpress downloads', 'Pixelpress 下载')}</h1><p class="fl-product-intro">${t('A straightforward start for everyday image work.', '从简单清晰的步骤开始处理日常图片。')}</p><section class="fl-download-section" id="download"><h2>${t('Getting-started guide', '入门说明')}</h2><p>${t('Read the image preparation checklist and keep a copy for your next project.', '阅读图片准备清单，留一份说明供下次项目使用。')}</p><dl class="fl-file-details"><div><dt>${t('File', '文件')}</dt><dd>pixelpress-getting-started.txt</dd></div><div><dt>${t('Format', '格式')}</dt><dd>${t('UTF-8 plain text (.txt)', 'UTF-8 纯文本（.txt）')}</dd></div><div><dt>${t('Price', '价格')}</dt><dd>${t('Free', '免费')}</dd></div><div><dt>${t('Edition', '版本')}</dt><dd>1.0</dd></div></dl><button type="button" class="fl-download" data-official-download>${t('Download free TXT guide', '免费下载 TXT 入门说明')}</button><p class="fl-download-note">${t('Local guide only. No installer, account, payment or external connection.', '仅为本地说明文件，无安装程序，无需账户、付款或外部连接。')}</p></section><section class="fl-product-section" id="getting-started"><h2>${t('Before your first export', '首次导出前')}</h2><ol><li>${t('Keep an untouched copy of the original image.', '保留一份未经修改的图片原件。')}</li><li>${t('Choose the output dimensions for its intended use.', '按用途选择输出尺寸。')}</li><li>${t('Preview the image and check its proportions.', '预览图片并核对比例。')}</li><li>${t('Save your export separately from the original.', '将导出文件与原件分开保存。')}</li></ol></section><section class="fl-product-section" id="release-notes"><h2>${t('Guide edition 1.0', '说明版本 1.0')}</h2><p>${t('Includes an English and Chinese quick-start checklist. This demonstration supplies a plain-text document; it does not provide executable software.', '包含中英文快速上手清单。本演示提供纯文本文件，不提供可执行软件。')}</p></section></main></div>`;
    const draw = () => {
      document.title = official ? t('Pixelpress — Downloads', 'Pixelpress — 下载') : query ? `${query} — Findline` : 'Findline';
      root.innerHTML = `<div class="fl-site${official ? ' fl-product-site' : ''}">${official ? officialPage() : header() + (tab === 'help' ? help() : results())}<p class="fl-status" data-search-status role="status" aria-live="polite">${esc(status)}</p>${footer()}</div>`;
    };
    const revoke = url => {
      clearTimeout(objectURLs.get(url));
      objectURLs.delete(url);
      URL.revokeObjectURL(url);
    };
    const downloadGuide = () => {
      if (!official || !canMutate()) return;
      // Re-read immediately before the action, so a BFCache closure cannot replace newer evidence.
      if (!addOfficialEvidence('search-official-visits') || !canMutate()) return;
      let objectURL = '', anchor, downloadEvent;
      try {
        objectURL = URL.createObjectURL(new Blob([guideText()], {type: 'text/plain;charset=utf-8'}));
        anchor = document.createElement('a');
        anchor.href = objectURL;
        anchor.download = 'pixelpress-getting-started.txt';
        anchor.hidden = true;
        anchor.addEventListener('click', event => { downloadEvent = event; }, {once: true});
        document.body.append(anchor);
        if (!canMutate()) { anchor.remove(); URL.revokeObjectURL(objectURL); return; }
        anchor.click();
        anchor.remove();
        if (!downloadEvent || downloadEvent.defaultPrevented) {
          URL.revokeObjectURL(objectURL);
          if (canMutate()) message(t('The guide download could not start. Please try again.', '未能发起说明文件下载，请重试。'));
          return;
        }
        objectURLs.set(objectURL, setTimeout(() => revoke(objectURL), 1000));
      } catch {
        anchor?.remove();
        if (objectURL) URL.revokeObjectURL(objectURL);
        message(t('The guide could not be downloaded. Please try again.', '无法发起说明文件下载，请重试。'));
        return;
      }
      if (!canMutate()) return;
      if (!addOfficialEvidence('search-official-downloads')) {
        message(t('The download was requested, but practice progress could not be recorded.', '已发起下载，但未能记录练习进度。'));
        return;
      }
      message(t('TXT download requested. Check your browser’s downloads for the file.', '已发起 TXT 下载，请在浏览器下载列表中检查文件。'));
    };
    const click = event => {
      const button = event.target.closest('button');
      if (!button || !root.contains(button)) return;
      if (button.hasAttribute('data-official-download')) { downloadGuide(); return; }
      const id = button.dataset.searchDismiss;
      if (!sponsoredIDs.includes(id) || !canMutate()) return;
      const current = allowedArray('search-dismissed', sponsoredIDs);
      if (C.write('search-dismissed', [...new Set([...current, id])]) === false) return;
      button.closest('[data-search-sponsored]')?.remove();
      (root.querySelector('[data-search-sponsored] h2 a') || root.querySelector('[data-official-result]'))?.focus({preventScroll: true});
    };
    const escape = event => {
      if (event.key !== 'Escape' || !canMutate()) return;
      quietForDocument = true;
      root.querySelectorAll('[data-search-sponsored]').forEach(node => node.remove());
      // Leave Escape bubbling so the engine also clears its independent ad layers.
    };
    const cancelFrames = () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(restoreFrame);
      frame = 0; restoreFrame = 0;
    };
    const queueVisit = () => {
      const own = generation;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (own === generation && canMutate()) addOfficialEvidence('search-official-visits');
      });
    };
    const hide = () => {
      suspended = true; generation++; cancelFrames();
      for (const url of [...objectURLs.keys()]) revoke(url);
    };
    const show = event => {
      if (ended) return;
      if (!event.persisted) { suspended = false; return; }
      suspended = true; cancelFrames();
      const own = ++generation;
      frame = requestAnimationFrame(() => {
        frame = 0;
        restoreFrame = requestAnimationFrame(() => {
          restoreFrame = 0;
          if (ended || own !== generation) return;
          status = '';
          draw();
          suspended = false;
          queueVisit();
        });
      });
    };
    const cleanup = () => {
      ended = true; hide();
      root.removeEventListener('click', click);
      window.removeEventListener('keydown', escape);
      window.removeEventListener('pagehide', hide);
      window.removeEventListener('pageshow', show);
      window.removeEventListener('browse:booth-end', cleanup);
    };
    root.addEventListener('click', click);
    window.addEventListener('keydown', escape);
    window.addEventListener('pagehide', hide);
    window.addEventListener('pageshow', show);
    window.addEventListener('browse:booth-end', cleanup);
    draw();
    // The engine arms/starts a booth after renderer(C) returns.
    if (official) queueVisit();
  };
})();
