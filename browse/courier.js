/* TrackMY: fictional tracking records and local, free redelivery requests. */
(() => {
  'use strict';

  const localISO = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const dateAfter = days => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return localISO(date);
  };
  const tomorrow = () => dateAfter(1);
  // Fixture scans use today/yesterday while keeping their sample clock times.
  const scanStamp = stamp => dateAfter(Number(stamp.slice(8,10))-13)+stamp.slice(10);
  const scanLabel = stamp => scanStamp(stamp).slice(0,10)+' · '+stamp.slice(11,16);
  const validDate = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12);
    return localISO(date) === value;
  };
  const records = [
    {
      number: 'TM24081301', status: ['Delivery attempted', '派送未成功'], tone: 'attention', reschedule: true,
      address: 'Campus parcel desk, Sepang', service: ['Standard parcel', '标准包裹'], weight: '1.20 kg',
      note: ['The parcel desk was closed. Your parcel is at the Sepang delivery branch; choose another delivery window at no charge.', '包裹服务台已关闭。包裹暂存于雪邦派送站，可免费选择另一个派送时段。'],
      events: [
        ['2026-08-13T15:42:00+08:00', '13 Aug 2026 · 15:42', ['Delivery attempted — parcel desk closed', '派送未成功 — 包裹服务台已关闭'], ['Campus parcel desk, Sepang', '校园包裹服务台，雪邦']],
        ['2026-08-13T09:15:00+08:00', '13 Aug 2026 · 09:15', ['Out for delivery', '派送中'], ['Sepang delivery branch', '雪邦派送站']],
        ['2026-08-12T20:18:00+08:00', '12 Aug 2026 · 20:18', ['Arrived at sorting centre', '抵达分拣中心'], ['Shah Alam sorting centre', '莎阿南分拣中心']],
        ['2026-08-12T11:06:00+08:00', '12 Aug 2026 · 11:06', ['Shipment accepted', '已收件'], ['Kuala Lumpur practice counter', '吉隆坡练习网点']]
      ]
    },
    {
      number: 'TM24081302', status: ['Delivery attempted', '派送未成功'], tone: 'attention', reschedule: true,
      address: 'Practice locker, Putrajaya', service: ['Standard parcel', '标准包裹'], weight: '0.65 kg',
      note: ['The practice locker was unavailable. Select a free redelivery window below.', '练习储物柜暂不可用，请在下方选择免费重新派送时段。'],
      events: [
        ['2026-08-13T14:10:00+08:00', '13 Aug 2026 · 14:10', ['Delivery attempted — locker unavailable', '派送未成功 — 储物柜暂不可用'], ['Practice locker, Putrajaya', '练习储物柜，布城']],
        ['2026-08-13T08:25:00+08:00', '13 Aug 2026 · 08:25', ['Out for delivery', '派送中'], ['Putrajaya practice branch', '布城练习网点']],
        ['2026-08-12T18:50:00+08:00', '12 Aug 2026 · 18:50', ['Shipment accepted', '已收件'], ['Kuala Lumpur practice counter', '吉隆坡练习网点']]
      ]
    },
    {
      number: 'TM24081303', status: ['Delivered', '已送达'], tone: 'delivered', reschedule: false,
      address: 'Training reception, Cyberjaya', service: ['Standard parcel', '标准包裹'], weight: '2.00 kg',
      note: ['Received by the fictional training reception. This completed shipment cannot be rescheduled.', '已由虚构的培训接待处签收。此包裹已完成派送，无法重新预约。'],
      events: [
        ['2026-08-13T11:36:00+08:00', '13 Aug 2026 · 11:36', ['Delivered to training reception', '已送达培训接待处'], ['Cyberjaya training reception', '赛城培训接待处']],
        ['2026-08-13T08:40:00+08:00', '13 Aug 2026 · 08:40', ['Out for delivery', '派送中'], ['Cyberjaya practice branch', '赛城练习网点']],
        ['2026-08-12T16:15:00+08:00', '12 Aug 2026 · 16:15', ['Shipment accepted', '已收件'], ['Shah Alam practice counter', '莎阿南练习网点']]
      ]
    },
    {
      number: 'TM24081304', status: ['Returned to sender', '已退回寄件人'], tone: 'returned', reschedule: false,
      address: 'Demo dispatch desk, Shah Alam', service: ['Standard parcel', '标准包裹'], weight: '0.90 kg',
      note: ['This fictional parcel could not be delivered and has been returned. A redelivery request is unavailable.', '此虚构包裹无法派送，已退回寄件人，不能申请重新派送。'],
      events: [
        ['2026-08-13T16:25:00+08:00', '13 Aug 2026 · 16:25', ['Returned to sender', '已退回寄件人'], ['Shah Alam practice counter', '莎阿南练习网点']],
        ['2026-08-12T14:30:00+08:00', '12 Aug 2026 · 14:30', ['Undeliverable — practice destination closed', '无法派送 — 练习收件处已关闭'], ['Demo dispatch desk, Shah Alam', '演示发货台，莎阿南']],
        ['2026-08-11T10:05:00+08:00', '11 Aug 2026 · 10:05', ['Shipment accepted', '已收件'], ['Sepang delivery branch', '雪邦派送站']]
      ]
    }
  ];
  const findRecord = number => records.find(record => record.number === number);
  const slots = ['morning', 'afternoon'];
  const addresses = records.filter(record => record.reschedule).map(record => record.address);
  const validSchedule = value => Boolean(value && typeof value === 'object' && !Array.isArray(value)
    && validDate(value.date) && slots.includes(value.slot) && addresses.includes(value.address));

  window.BROWSE_COURIER = Object.assign(window.BROWSE_COURIER || {}, {tomorrow});
  window.BROWSE_SCENES = window.BROWSE_SCENES || {};
  window.BROWSE_SCENES.courier = C => {
    const {root, params, t, esc} = C;
    const tx = value => value[C.lang === 'zh' ? 1 : 0];
    const rawTracking = (params.get('tracking') || '').slice(0, 160);
    const tracking = rawTracking.trim().toUpperCase();
    const record = findRecord(tracking);
    const rawView = params.get('view') || '';
    const view = ['locations', 'rates', 'help'].includes(rawView) ? rawView : '';
    const route = (query = {}) => C.url('courier.html', query);
    const link = (query = {}) => esc(route(query));
    const slotLabel = slot => slot === 'afternoon' ? t('Afternoon · 14:00–18:00', '下午 · 14:00–18:00') : t('Morning · 09:00–13:00', '上午 · 09:00–13:00');
    let suspended = false, ended = false, generation = 0;
    let status = '';

    // Every mutation starts from authoritative storage, including after native Back.
    const savedSchedules = () => {
      const raw = C.read('courier-reschedules', {}), result = {};
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
      for (const candidate of records) {
        if (!candidate.reschedule || !Object.prototype.hasOwnProperty.call(raw, candidate.number)) continue;
        const value = raw[candidate.number];
        if (validSchedule(value)) result[candidate.number] = {date: value.date, slot: value.slot, address: value.address};
      }
      return result;
    };
    const completedNumbers = () => {
      const raw = C.read('courier-completed', []);
      return Array.isArray(raw) ? [...new Set(raw.filter(number => typeof number === 'string' && findRecord(number)?.reschedule))] : [];
    };
    const contextInputs = () => {
      const context = new URL(route());
      return [...context.searchParams].filter(([name]) => name !== 'tracking' && name !== 'view')
        .map(([name, value]) => `<input type="hidden" name="${esc(name)}" value="${esc(value)}">`).join('');
    };
    const trackingForm = () => `<form class="tm-track-form" action="${link()}" method="get" role="search">${contextInputs()}<label for="tm-tracking">${t('Enter your tracking number', '输入运单号码')}</label><div><input id="tm-tracking" type="search" name="tracking" value="${esc(rawTracking)}" placeholder="TM24081301" maxlength="32" autocomplete="off" spellcheck="false" required><button type="submit">${t('Track parcel', '查询包裹')} →</button></div><p>${t('One tracking number at a time. For this practice site, use a sample number below.', '每次查询一个运单号码；此练习网站可使用下方示例。')}</p></form>`;
    const header = () => `<div class="tm-service-line"><span>${t('DOMESTIC PARCEL SERVICES', '国内包裹服务')}</span><a href="${link({...Object.fromEntries(params), lang: C.lang === 'zh' ? 'en' : 'zh'})}">${t('中文', 'English')}</a></div><header class="tm-header"><a class="tm-brand" href="${link()}" aria-label="TrackMY">Track<span>MY</span><small>${t('PARCEL NETWORK', '包裹物流')}</small></a><nav aria-label="${t('Main navigation', '主导航')}">${[['', t('Tracking', '包裹追踪')], ['help', t('Help', '帮助')]].map(([value, label]) => `<a href="${link(value ? {view: value} : {})}"${view === value ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav></header>`;
    const savedSummary = shipment => {
      const saved = savedSchedules()[shipment.number];
      if (!saved) return '';
      return `<div class="tm-saved-summary"><strong>${t('Saved redelivery request', '已保存的重新派送申请')}</strong><p><time datetime="${esc(saved.date)}">${esc(saved.date)}</time> · ${esc(slotLabel(saved.slot))}<br>${esc(saved.address)}</p><small>${t('Local practice record only · RM0.00', '仅为本地练习记录 · RM0.00')}</small></div>`;
    };
    const rescheduleForm = shipment => {
      const saved = savedSchedules()[shipment.number];
      const date = saved && saved.date >= tomorrow() && saved.date <= dateAfter(14) ? saved.date : tomorrow();
      return `<section class="tm-reschedule" id="reschedule" aria-labelledby="tm-reschedule-title"><div class="tm-section-heading"><h2 id="tm-reschedule-title">${t('Reschedule delivery', '重新预约派送')}</h2><strong>${t('Free · RM0.00', '免费 · RM0.00')}</strong></div><p>${t('Choose a delivery date and window. Keep the current practice address, or select the other fictional practice location.', '选择派送日期与时段，可保留当前练习地址，或选择另一个虚构练习地点。')}</p><div data-courier-summary>${savedSummary(shipment)}</div><form method="post" action="${link({tracking: shipment.number})}#reschedule" data-courier-reschedule><input type="hidden" name="tracking" value="${esc(shipment.number)}"><div class="tm-form-row"><label for="tm-date">${t('Delivery date', '派送日期')}<input id="tm-date" name="date" type="date" required min="${tomorrow()}" max="${dateAfter(14)}" value="${esc(date)}"></label><label for="tm-slot">${t('Delivery window', '派送时段')}<select id="tm-slot" name="slot" required>${slots.map(slot => `<option value="${slot}"${(saved?.slot || 'morning') === slot ? ' selected' : ''}>${esc(slotLabel(slot))}</option>`).join('')}</select></label></div><label for="tm-address">${t('Fictional practice address only', '仅限虚构练习地址')}<input id="tm-address" name="address" type="text" value="${esc(saved?.address || shipment.address)}" list="tm-practice-addresses" maxlength="100" autocomplete="off" aria-describedby="tm-address-note" required></label><datalist id="tm-practice-addresses">${addresses.map(address => `<option value="${esc(address)}"></option>`).join('')}</datalist><p id="tm-address-note" class="tm-field-note">${t('Do not enter a real address. Accepted practice locations:', '请勿输入真实地址。可选练习地点：')} ${addresses.map(esc).join(' / ')}.</p><div class="tm-form-footer"><button type="submit">${t('Save free redelivery', '保存免费重新派送')}</button><span>${t('No payment or account required.', '无需付款或登录。')}</span></div></form></section>`;
    };
    const progress = shipment => {
      const step=shipment.tone==='delivered'?4:shipment.reschedule?3:2;
      return `<div class="tm-progress-row"><ol class="tm-progress" aria-label="${t('Delivery progress','派送进度')}">${[['Accepted','已收件'],['In transit','运输中'],['Out for delivery','派送中'],['Delivered','已签收']].map(([en,zh],i)=>`<li data-progress="${i<step?'done':'next'}"${i===step-1?' aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span>${t(en,zh)}</li>`).join('')}</ol>${shipment.reschedule?`<a href="#reschedule">${t('Reschedule delivery','改约派送')} →</a>`:''}</div>`;
    };
    const shipmentResult = shipment => `<section class="tm-result" aria-labelledby="tm-result-title">${progress(shipment)}<div class="tm-section-heading"><div><p class="tm-eyebrow">${t('TRACKING RESULT', '查询结果')}</p><h1 id="tm-result-title">${esc(shipment.number)}</h1><button type="button" class="tm-copy-number" data-copy-tracking="${esc(shipment.number)}">${t('Copy number','复制单号')}</button></div><span class="tm-status-badge tm-${esc(shipment.tone)}">${esc(tx(shipment.status))}</span></div><dl class="tm-shipment-facts"><div><dt>${t('Service', '服务')}</dt><dd>${esc(tx(shipment.service))}</dd></div><div><dt>${t('Parcel weight', '包裹重量')}</dt><dd>${esc(shipment.weight)}</dd></div><div><dt>${t('Fictional destination', '虚构目的地')}</dt><dd>${esc(shipment.address)}</dd></div></dl><div class="tm-result-note"><p>${esc(tx(shipment.note))}</p>${shipment.reschedule ? `<a href="#reschedule">${t('Arrange free redelivery', '安排免费重新派送')} →</a>` : ''}</div><h2>${t('Shipment history', '物流记录')}</h2><ol class="tm-timeline">${shipment.events.map(([datetime, label, event, place], index) => `<li${index === 0 ? ' class="tm-current"' : ''}><time datetime="${esc(scanStamp(datetime))}">${esc(scanLabel(datetime))}</time><div><strong>${esc(tx(event))}</strong><span>${esc(tx(place))}</span></div></li>`).join('')}</ol></section>${shipment.reschedule ? rescheduleForm(shipment) : ''}`;
    const parcelNames=[['Club display prints','社团展板印件'],['Study stationery','学习文具'],['Reading-group books','读书会书籍'],['Camera accessories','摄影配件']];
    const samples = () => `<section class="tm-samples"><div class="tm-section-heading"><h2>${t('Your sample parcels','示例包裹')}</h2><small>${t('Four fictional shipments · select to track','四件虚构包裹 · 点击查看')}</small></div><ul class="tm-parcel-list">${records.map((shipment,i)=>`<li><a href="${link({tracking:shipment.number})}"><strong>${esc(shipment.number)}</strong><span>${esc(tx(shipment.status))}</span><span class="tm-parcel-name">${t(...parcelNames[i])}</span><span class="tm-parcel-address">${esc(shipment.address)}</span><b aria-hidden="true">→</b></a></li>`).join('')}</ul></section>`;

    const trackingPage = () => `${trackingForm()}${record ? shipmentResult(record) : rawTracking ? `<section class="tm-empty"><h1>${t('No matching shipment', '未找到对应包裹')}</h1><p>${t('We could not find this tracking number:', '未能找到此运单号码：')} <strong>${esc(rawTracking)}</strong></p><p>${t('Check the number or choose one of the four fictional samples below. No external tracking service is contacted.', '请核对号码，或选择下方四个虚构示例之一。此页面不会连接外部物流查询服务。')}</p></section>` : `<div class="tm-intro"><h1>${t('Every parcel, one clear journey','包裹动态，一目了然')}</h1><p>${t('View the latest scan, follow its journey and manage an eligible redelivery.', '查看最新物流扫描记录与运输过程，并为符合条件的包裹安排重新派送。')}</p></div>`}${samples()}`;
    const locationsPage = () => `<section class="tm-info"><p class="tm-eyebrow">${t('BRANCH DIRECTORY', '网点目录')}</p><h1>${t('Find a service location', '查找服务网点')}</h1><p>${t('Fictional practice branches. Hours and locations below are examples, not live operating information.', '以下为虚构练习网点，地址和营业时间仅作示例，并非真实运营信息。')}</p><div class="tm-table-scroll"><table><thead><tr><th scope="col">${t('Branch', '网点')}</th><th scope="col">${t('Practice location', '练习地点')}</th><th scope="col">${t('Counter hours', '柜台时间')}</th><th scope="col">${t('Services', '服务')}</th></tr></thead><tbody>${[
      [t('Sepang delivery branch', '雪邦派送站'), 'Demo Logistics Lane, Sepang', 'Mon–Sat / 周一至六 · 09:00–18:00', t('Redelivery, parcel collection', '重新派送、领取包裹')],
      [t('Putrajaya practice branch', '布城练习网点'), 'Practice Transit Hall, Putrajaya', 'Mon–Fri / 周一至五 · 09:00–17:00', t('Parcel collection, drop-off', '领取包裹、寄件')],
      [t('Kuala Lumpur practice counter', '吉隆坡练习网点'), 'Demo Service Hall, Kuala Lumpur', 'Mon–Sat / 周一至六 · 08:30–18:00', t('Parcel drop-off, rate enquiries', '寄件、运费咨询')],
      [t('Shah Alam sorting centre', '莎阿南分拣中心'), 'Practice Sorting Road, Shah Alam', t('No walk-in counter', '不设现场柜台'), t('Sorting only', '仅进行分拣')]
    ].map(row => `<tr>${row.map((value, index) => `<${index === 0 ? 'th scope="row"' : 'td'}>${esc(value)}</${index === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</tbody></table></div><a href="${link()}">${t('Back to tracking', '返回包裹追踪')} →</a></section>`;
    const ratesPage = () => `<section class="tm-info"><p class="tm-eyebrow">${t('DOMESTIC SERVICES', '国内服务')}</p><h1>${t('Parcel rates', '包裹运费')}</h1><p>${t('Illustrative practice rates in Malaysian ringgit. This site does not sell postage or accept payment.', '以下为马来西亚令吉计价的练习运费。本网站不售卖邮资，也不接受付款。')}</p><div class="tm-table-scroll"><table><thead><tr><th scope="col">${t('Service', '服务')}</th><th scope="col">${t('Weight', '重量')}</th><th scope="col">${t('Peninsular Malaysia', '马来西亚半岛')}</th><th scope="col">${t('Example transit time', '运输时间示例')}</th></tr></thead><tbody><tr><th scope="row">${t('Standard parcel', '标准包裹')}</th><td>0–1 kg</td><td>RM7.00</td><td>${t('2–3 working days', '2–3个工作日')}</td></tr><tr><th scope="row">${t('Standard parcel', '标准包裹')}</th><td>&gt;1–3 kg</td><td>RM10.00</td><td>${t('2–3 working days', '2–3个工作日')}</td></tr><tr><th scope="row">${t('Standard parcel', '标准包裹')}</th><td>&gt;3–5 kg</td><td>RM14.00</td><td>${t('3–4 working days', '3–4个工作日')}</td></tr><tr><th scope="row">${t('Eligible redelivery', '符合条件的重新派送')}</th><td>—</td><td><strong>RM0.00</strong></td><td>${t('Choose a window after an attempted delivery', '派送未成功后选择时段')}</td></tr></tbody></table></div><p>${t('Oversize parcels, remote-area services and cross-border delivery are outside this example rate table.', '超大包裹、偏远地区服务和跨境派送不包含在此示例价目表中。')}</p><a href="${link()}">${t('Track a parcel', '查询包裹')} →</a></section>`;
    const helpPage = () => `<section class="tm-info tm-help"><p class="tm-eyebrow">${t('CUSTOMER HELP', '客户帮助')}</p><h1>${t('Tracking & redelivery help', '包裹追踪与重新派送帮助')}</h1><h2>${t('What does “Delivery attempted” mean?', '“派送未成功”是什么意思？')}</h2><p>${t('The driver reached the fictional destination but could not hand over the parcel. Read the latest timeline entry, then use “Arrange free redelivery” on an eligible tracking result.', '派送员已到达虚构目的地，但无法交付包裹。请查看最新物流记录，再在符合条件的查询结果中选择“安排免费重新派送”。')}</p><h2>${t('Is there a redelivery fee?', '重新派送是否收费？')}</h2><p>${t('No. Redelivery in this practice service is RM0.00. You do not need a bank card, account password, SMS code or payment app.', '不收费。此练习服务的重新派送费用为RM0.00，无需银行卡、账户密码、短信验证码或支付应用。')}</p><h2>${t('Which dates and addresses can I use?', '可以使用哪些日期和地址？')}</h2><p>${t('Select tomorrow or another date within the next 14 days, then choose morning (09:00–13:00) or afternoon (14:00–18:00). Use only the two fictional practice addresses listed beside the form. Never enter a real address.', '可选择明天至未来14天内的日期，时段为上午09:00–13:00或下午14:00–18:00。请仅使用表单旁列出的两个虚构练习地址，切勿输入真实地址。')}</p><h2>${t('Where is my request saved?', '申请保存在哪里？')}</h2><p>${t('Only in this browser tab for the current visit. Reload and native Back/Forward keep the record. Nothing is sent to a courier, and no actual delivery is booked.', '仅保存在此浏览器标签页的本次访问中，重新载入和浏览器前进后退会保留记录；不会发送给快递公司，也不会实际预约派送。')}</p><h2>${t('Can I reschedule a returned parcel?', '已退回的包裹可以重新预约吗？')}</h2><p>${t('No. Delivered and returned-to-sender samples have no redelivery form.', '不能。已送达和已退回寄件人的示例不提供重新派送表单。')}</p><a href="${link()}">${t('Back to tracking', '返回包裹追踪')} →</a></section>`;
    function draw() {
      document.body.classList.add('tm-page');
      document.title = `${record && !view ? record.number + ' · ' : ''}TrackMY — ${t('Parcel tracking', '包裹追踪')}`;
      root.innerHTML = `<div class="tm-site">${header()}<main class="tm-main">${view === 'locations' ? locationsPage() : view === 'rates' ? ratesPage() : view === 'help' ? helpPage() : trackingPage()}<p class="tm-feedback" data-courier-status role="status" aria-live="polite" tabindex="-1">${esc(status)}</p></main><footer class="tm-footer"><strong>TrackMY</strong><p>${t('Fictional logistics practice website. All shipments, branches and addresses are examples. Saved requests stay in this tab; no real delivery is arranged.', '虚构物流练习网站。运单、网点与地址均为示例。申请仅保存在当前标签页，不会安排真实派送。')}</p><a href="${link({view: 'help'})}">${t('Tracking help', '查询帮助')}</a></footer></div>`;
    }
    const announce = message => {
      status = message;
      const node = root.querySelector('[data-courier-status]');
      if (node) { node.textContent = message; node.focus({preventScroll: true}); }
    };
    const canMutate = () => !ended && !suspended && window.BROWSE_BOOTH?.canAct() !== false;
    function submit(event) {
      const form = event.target;
      if (!form?.hasAttribute('data-courier-reschedule') || (form.getAttribute('method') || 'get').toLowerCase() !== 'post') return;
      event.preventDefault();
      if (!canMutate()) return;
      const value = name => String(form.elements.namedItem(name)?.value || '').trim();
      const number = value('tracking'), shipment = findRecord(number);
      const requested = {date: value('date'), slot: value('slot'), address: value('address')};
      if (!shipment?.reschedule || !validSchedule(requested) || requested.date < tomorrow() || requested.date > dateAfter(14)) {
        announce(t('Request not saved. Choose a valid date, delivery window and one of the listed fictional practice addresses.', '申请未保存。请选择有效日期、派送时段，以及列出的虚构练习地址之一。'));
        return;
      }
      const schedules = savedSchedules();
      schedules[number] = requested;
      if (!canMutate() || C.write('courier-reschedules', schedules) === false) {
        announce(t('The request could not be saved. Try again while this visit is active.', '无法保存申请，请在本次访问仍有效时重试。'));
        return;
      }
      const completed = completedNumbers().filter(item => item !== number);
      if (requested.date === tomorrow() && requested.slot === 'afternoon' && requested.address === shipment.address) completed.push(number);
      if (!canMutate() || C.write('courier-completed', completed) === false) {
        announce(t('The save could not be confirmed. Please try again while this visit is active.', '无法确认保存，请在本次访问仍有效时重试。'));
        return;
      }
      const summary = root.querySelector('[data-courier-summary]');
      if (summary) summary.innerHTML = savedSummary(shipment);
      announce(t('Redelivery request saved locally. Free · RM0.00. No actual delivery has been booked.', '重新派送申请已保存至本地，免费 · RM0.00。未预约任何真实派送。'));
    }
    const hide = () => { suspended = true; generation++; };
    const show = event => {
      if (ended) return;
      if (!event.persisted) { suspended = false; return; }
      suspended = true;
      const current = ++generation;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (ended || current !== generation) return;
        status = '';
        draw();
        suspended = false;
      }));
    };
    const cleanup = () => {
      ended = true;
      hide();
      root.removeEventListener('submit', submit);
      window.removeEventListener('pagehide', hide);
      window.removeEventListener('pageshow', show);
      window.removeEventListener('browse:booth-end', cleanup);
    };
    root.addEventListener('click',async event=>{
      const button=event.target.closest('[data-copy-tracking]');if(!button)return;
      try{await navigator.clipboard.writeText(button.dataset.copyTracking);button.textContent=t('Copied','已复制');}
      catch{const input=root.querySelector('[name=tracking]');if(input){input.value=button.dataset.copyTracking;input.focus();input.select();announce(t('Number selected. Press Ctrl+C to copy.','已选中单号，按 Ctrl+C 复制。'));}}
    });
    root.addEventListener('submit', submit);
    window.addEventListener('pagehide', hide);
    window.addEventListener('pageshow', show);
    window.addEventListener('browse:booth-end', cleanup);
    draw();
  };
})();
