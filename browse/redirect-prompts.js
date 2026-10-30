/* Local teaching prompts. Navigation and genuine dismissal belong to ad-stack.js. */
(() => {
  'use strict';
  const formats = Object.freeze(['robot', 'player-error', 'bonus', 'captcha']);
  const robot = `<svg class="br-prompt-robot-art" viewBox="0 0 210 230" aria-hidden="true"><ellipse cx="105" cy="214" rx="80" ry="4" fill="#c7c5cf"/><g stroke="#435064" stroke-width="4" stroke-linejoin="round"><path d="M105 29V12m-7 7h14"/><rect x="70" y="42" width="70" height="54" rx="13" fill="#e2e9ef" stroke="#a7b4c2"/><path d="M66 54v27m78-27v27" stroke="#bdcbd6" stroke-width="10" stroke-linecap="round"/><circle cx="105" cy="65" r="10" fill="#6ac5dc" stroke="#a5b4c1"/><circle cx="105" cy="65" r="4" fill="#42596e" stroke="none"/><path d="M90 86h30" stroke-width="6"/><path d="M83 99h44v94H83z" fill="#e8eef2" stroke="#c2ced7"/><path d="M91 112h28m-28 17h28m-28 17h28m-28 17h28" stroke="#6abed4" stroke-width="8"/><rect x="56" y="106" width="16" height="67" rx="8" fill="#e4ebf0" stroke="#c2ced7"/><rect x="138" y="106" width="16" height="67" rx="8" fill="#e4ebf0" stroke="#c2ced7"/><path d="M83 196v13m44-13v13" stroke="#a6b7c6" stroke-width="12"/></g><g fill="none" stroke="#ce523b" stroke-width="17"><circle cx="105" cy="122" r="78"/><path d="m50 67 110 110"/></g></svg>`;
  const arrows = `<svg class="br-prompt-arrows" viewBox="0 0 64 62" aria-hidden="true"><path d="m8 8 24 24L56 8M8 31l24 24 24-24" fill="none" stroke="#ff9800" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const gift = `<svg class="br-prompt-gift" viewBox="0 0 128 128" aria-hidden="true"><defs><linearGradient id="br-prompt-gift-fill" x2=".6" y2="1"><stop stop-color="#efb6ff"/><stop offset=".45" stop-color="#ad42d5"/><stop offset="1" stop-color="#46116d"/></linearGradient></defs><circle cx="64" cy="63" r="54" fill="#32104e" stroke="#bc75d7" stroke-width="3"/><circle cx="64" cy="63" r="48" fill="url(#br-prompt-gift-fill)"/><path d="m28 36 73 52M22 75l80-42M65 13l-2 98" stroke="#f1c4ff" stroke-width="2" opacity=".45"/><g stroke="#401064" stroke-width="2"><path d="M34 46h61v42H34z" fill="#8823b4"/><path d="M29 38h71v15H29z" fill="#cf6de9"/><path d="M58 38h14v50H58z" fill="#e8c5ff"/><path d="M63 37C26 28 48 14 63 37Zm2 0c37-9 15-23 0 0Z" fill="#f6daff"/></g><path d="m18 29 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1ZM100 15l3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" fill="#ffdaff"/><text x="64" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="29" fill="#fff" stroke="#38205a" stroke-width="5" paint-order="stroke">BONUS</text></svg>`;
  const checkBrand = `<span class="br-prompt-check-brand" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M39 19A16 16 0 0 0 13 11l-4-3v14h14l-5-5a9 9 0 0 1 14 5Z" fill="#4b94e5"/><path d="M9 29a16 16 0 0 0 26 8l4 3V26H25l5 5a9 9 0 0 1-14-5Z" fill="#a5a9ad"/></svg><small>Secure check</small></span>`;
  const html = (format, {t = en => en, esc = value => String(value), url} = {}) => {
    if (!formats.includes(format)) return '';
    const e = value => esc(String(value));
    const text = (en, zh) => e(t(en, zh));
    const link = target => e(typeof url === 'function' ? url(target) : url || '#');
    const anchor = (label, name, cls = '', target) => `<a class="br-prompt-link ${cls}" data-br-hop data-br-prompt-action="${name}" href="${link(target)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    if (format === 'robot') return `<div class="br-prompt br-prompt-robot" data-br-prompt="robot"><div class="br-prompt-robot-body"><h2 class="br-prompt-title">${text('CONFIRM YOU ARE NOT A ROBOT', '请确认你不是机器人')}</h2><p class="br-prompt-instruction">${text('Click the button', '点击下方按钮')}</p>${robot}${arrows}</div>${anchor(text("I'm not a robot", '我不是机器人'), 'robot', 'br-prompt-robot-cta')}</div>`;
    if (format === 'player-error') return `<div class="br-prompt br-prompt-player-error" data-br-prompt="player-error"><div class="br-prompt-error-body"><svg class="br-prompt-flash" viewBox="0 0 76 76" aria-hidden="true"><defs><linearGradient id="br-prompt-flash-fill" x2="0" y2="1"><stop stop-color="#ef1814"/><stop offset="1" stop-color="#9c0908"/></linearGradient></defs><path d="M2 2h72v72H2z" fill="url(#br-prompt-flash-fill)" stroke="#aaa" stroke-width="2"/><path d="M50 14c-17 0-15 15-20 22-3 4-6 4-10 4l-5 14c17 1 19-11 23-19 3-6 4-9 10-9Z" fill="#fff"/></svg><div><h2 class="br-prompt-error-title"><strong>ERROR</strong> XX13-V</h2><p>${text('Your browser is unable to play this video, press the Accept button to continue', '你的浏览器无法播放此视频，请按“接受”按钮继续')}</p></div></div><div class="br-prompt-error-actions">${anchor(text('Accept', '接受'), 'accept', 'br-prompt-accept')}<button class="br-prompt-decline" type="button" data-br-close>${text('Decline', '拒绝')}</button></div></div>`;
    if (format === 'bonus') return `<div class="br-prompt br-prompt-bonus" data-br-prompt="bonus"><span class="br-prompt-bonus-badge" aria-hidden="true">1</span><div class="br-prompt-bonus-body">${gift}<div><h2 class="br-prompt-bonus-title">${text('Congratulations!', '恭喜你！')}</h2><p>${text('Available: $1500', '可领取：$1500')}</p></div></div><div class="br-prompt-bonus-actions">${anchor(text('Transfer Money', '转账'), 'transfer', 'br-prompt-transfer')}${anchor(text('Withdraw Money', '提现'), 'withdraw', 'br-prompt-withdraw', 'alternate')}</div></div>`;
    return `<div class="br-prompt br-prompt-captcha" data-br-prompt="captcha" data-br-prompt-state="idle"><div class="br-prompt-captcha-body"><h2 class="br-prompt-title">${text('CONFIRM YOU ARE NOT A ROBOT', '请确认你不是机器人')}</h2><p class="br-prompt-instruction">${text('Click the button', '点击下方按钮')}</p><div class="br-prompt-check-panel"><button class="br-prompt-checkbox" type="button" role="checkbox" aria-checked="false" aria-busy="false" data-br-prompt-checkbox><span class="br-prompt-check-icon" aria-hidden="true"><span class="br-prompt-check-box"></span><span class="br-prompt-spinner"></span><svg class="br-prompt-green-check" viewBox="0 0 42 42"><path d="m5 22 10 10L37 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>${text("I'm not a robot", '我不是机器人')}</span></button>${checkBrand}</div><p class="br-prompt-status" role="status" aria-live="polite" data-br-prompt-status></p></div><div class="br-prompt-captcha-footer"><a class="br-prompt-link br-prompt-continue" data-br-hop data-br-prompt-action="continue" data-br-prompt-continue data-br-prompt-ready="false" aria-disabled="true" tabindex="-1" href="${link()}" target="_blank" rel="noopener noreferrer">${text('Continue', '继续')}</a></div></div>`;
  };
  const mount = (node, {format, t = en => en} = {}) => {
    let alive = true, suspended = false, timer = 0, state = 'idle';
    const panel = node?.querySelector?.('[data-br-prompt="captcha"]');
    const button = panel?.querySelector('[data-br-prompt-checkbox]');
    const next = panel?.querySelector('[data-br-prompt-continue]');
    const status = panel?.querySelector('[data-br-prompt-status]');
    const readyURL=next?.getAttribute('href');
    const abort = new AbortController();
    const cancel = () => {clearTimeout(timer); timer = 0;};
    const draw = value => {
      state = value;
      if (!panel || !alive) return;
      panel.dataset.brPromptState = value;
      button.setAttribute('aria-checked', String(value === 'checked'));
      button.setAttribute('aria-busy', String(value === 'checking'));
      next.dataset.brPromptReady = String(value === 'checked');
      next.setAttribute('aria-disabled', String(value !== 'checked'));
      next.tabIndex = value === 'checked' ? 0 : -1;
      if(value==='checked')next.setAttribute('href',readyURL);else next.removeAttribute('href');
      status.textContent = value === 'checking' ? t('Checking…', '正在检查…') : value === 'checked' ? t('Check complete. You can continue.', '检查完成，可以继续。') : '';
    };
    if (panel && button && next && status) {
      draw('idle');
      button.addEventListener('click', () => {
        if (!alive || suspended || state !== 'idle') return;
        draw('checking');
        timer = setTimeout(() => {
          timer = 0;
          if (alive && !suspended && panel.isConnected && state === 'checking') draw('checked');
        }, 1150);
      }, {signal: abort.signal});
      next.addEventListener('click', event => {
        if (alive && !suspended && state === 'checked') return;
        event.preventDefault(); event.stopImmediatePropagation();
      }, {capture: true, signal: abort.signal});
      next.addEventListener('auxclick', event => {
        if (alive && !suspended && state === 'checked') return;
        event.preventDefault(); event.stopImmediatePropagation();
      }, {capture: true, signal: abort.signal});
    }
    return {
      canContinue: () => alive && !suspended && (format !== 'captcha' || state === 'checked'),
      suspend() {if (!alive) return; suspended = true; cancel(); if (state === 'checking') draw('idle');},
      resume() {if (!alive) return; suspended = false; if (state === 'checking') draw('idle');},
      destroy() {if (!alive) return; cancel(); alive = false; abort.abort();}
    };
  };
  window.BROWSE_REDIRECT_PROMPTS = Object.freeze({formats, isModal: format => format === 'robot' || format === 'captcha', html, mount});
})();
