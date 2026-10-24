/* Motion only: native close buttons, links and keyboard handlers remain owned by the caller.
 * CSS contract: the supplied card is fixed-positioned, fits the visual viewport minus
 * 8px, and has no transform/transform transition or transformed ancestor. This module
 * owns its inline translate3d. Use max-width/max-height:
 * calc(var(--br-motion-view-width, 100vw) - 8px) / the corresponding
 * --br-motion-view-height (100dvh fallback), plus border-box and overflow:auto.
 * Keep .br-real-close inside the card. stop() preserves
 * the last position; a new controller on the same element replaces the previous one.
 */
(() => {
  'use strict';
  const controllers = new WeakMap();
  window.BROWSE_POPUP_MOTION = ({element, mode = 'bounce', isActive = () => true, onMove} = {}) => {
    if (!element?.getBoundingClientRect || !element.style) throw new TypeError('A popup card element is required.');
    if (!['bounce', 'dodge'].includes(mode)) throw new TypeError('Unknown popup motion mode.');
    controllers.get(element)?.stop();
    const doc = element.ownerDocument, win = doc.defaultView;
    const reduce = win.matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = win.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const viewport = win.visualViewport, margin = 4, listeners = [], held = new Set();
    const originalWillChange = element.style.willChange;
    let stopped = false, manualPause = false, focused = doc.hasFocus(), focusWithin = element.contains(doc.activeElement);
    let raf = 0, previousTime = 0, settleTimer = 0, pointerSettling = false, pendingPointer = null;
    let x = 0, y = 0, tx = 0, ty = 0, baseX = 0, baseY = 0, width = 0, height = 0, bounds;
    let vx = 92, vy = 66, count = 0, lastDodge = -Infinity;
    const listen = (target, name, fn, options) => {
      target.addEventListener(name, fn, options);
      listeners.push(() => target.removeEventListener(name, fn, options));
    };
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const active = () => { try { return Boolean(isActive()); } catch { return false; } };
    const basicPause = () => stopped || manualPause || doc.hidden || !focused || focusWithin || held.size > 0 || pointerSettling || reduce.matches;
    const cancelFrame = () => { if (raf) win.cancelAnimationFrame(raf); raf = 0; previousTime = 0; };
    const apply = () => {
      tx = x - baseX; ty = y - baseY;
      element.style.transform = `translate3d(${tx.toFixed(3)}px, ${ty.toFixed(3)}px, 0)`;
    };
    const emit = reason => {
      if (typeof onMove !== 'function') return;
      try { onMove({mode, count, x, y, width, height, reason}); } catch { /* A text callback must not break motion or native controls. */ }
    };
    const measure = () => {
      const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
      const viewWidth = viewport?.width || doc.documentElement.clientWidth || win.innerWidth;
      const viewHeight = viewport?.height || doc.documentElement.clientHeight || win.innerHeight;
      element.style.setProperty('--br-motion-view-width', `${viewWidth}px`);
      element.style.setProperty('--br-motion-view-height', `${viewHeight}px`);
      const rect = element.getBoundingClientRect();
      baseX = rect.left - tx; baseY = rect.top - ty;
      width = rect.width; height = rect.height;
      bounds = {left: left + margin, top: top + margin,
        right: Math.max(left + margin, left + viewWidth - width - margin),
        bottom: Math.max(top + margin, top + viewHeight - height - margin)};
      x = clamp(rect.left, bounds.left, bounds.right);
      y = clamp(rect.top, bounds.top, bounds.bottom);
    };
    const schedule = () => {
      if (!element.isConnected) { stop(); return; }
      if (!raf && !basicPause() && (mode === 'bounce' || pendingPointer)) raf = win.requestAnimationFrame(tick);
    };
    const refresh = reason => {
      if (stopped) return;
      if (!element.isConnected) { stop(); return; }
      previousTime = 0;
      measure(); apply();
      if (reason) emit(reason);
      schedule();
    };
    const reflect = (position, velocity, dt, min, max) => {
      const range = max - min;
      if (range <= 0) return {position: min, velocity, hit: false};
      const raw = position - min + velocity * dt, period = range * 2;
      const phase = ((raw % period) + period) % period;
      const next = phase <= range ? min + phase : max - (phase - range);
      let nextVelocity = phase <= range ? velocity : -velocity;
      if (phase === 0) nextVelocity = Math.abs(velocity);
      else if (phase === range) nextVelocity = -Math.abs(velocity);
      return {position: next, velocity: nextVelocity,
        hit: raw < 0 || raw > range || (raw === 0 && velocity < 0) || (raw === range && velocity > 0)};
    };
    const dodge = (pointer, now) => {
      const close = element.querySelector('.br-real-close');
      if (!close || !mouse.matches || now - lastDodge < 260) return;
      const rect = close.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dx = Math.max(rect.left - pointer.x, 0, pointer.x - rect.right);
      const dy = Math.max(rect.top - pointer.y, 0, pointer.y - rect.bottom);
      if (Math.hypot(dx, dy) > 44) return;
      const closeX = rect.left + rect.width / 2 - x, closeY = rect.top + rect.height / 2 - y;
      const midX = (bounds.left + bounds.right) / 2, midY = (bounds.top + bounds.bottom) / 2;
      const candidates = [[bounds.left, bounds.top], [bounds.right, bounds.top],
        [bounds.left, bounds.bottom], [bounds.right, bounds.bottom],
        [midX, bounds.top], [midX, bounds.bottom], [bounds.left, midY], [bounds.right, midY]];
      const distance = (a, b) => Math.hypot(a + closeX - pointer.x, b + closeY - pointer.y);
      let best = [x, y], bestDistance = distance(x, y);
      for (const candidate of candidates) {
        const d = distance(candidate[0], candidate[1]);
        if (d > bestDistance) { best = candidate; bestDistance = d; }
      }
      if (Math.hypot(best[0] - x, best[1] - y) < 1) return;
      x = best[0]; y = best[1]; lastDodge = now; count++;
      apply(); emit('dodge');
    };
    function tick(now) {
      raf = 0;
      if (!element.isConnected) { stop(); return; }
      if (basicPause()) { previousTime = 0; return; }
      if (!active()) { previousTime = 0; schedule(); return; }
      if (mode === 'dodge') {
        const pointer = pendingPointer; pendingPointer = null;
        if (pointer) dodge(pointer, now);
      } else {
        const dt = previousTime ? Math.max(0, Math.min(.05, (now - previousTime) / 1000)) : 0;
        previousTime = now;
        const horizontal = reflect(x, vx, dt, bounds.left, bounds.right);
        const vertical = reflect(y, vy, dt, bounds.top, bounds.bottom);
        x = horizontal.position; y = vertical.position; vx = horizontal.velocity; vy = vertical.velocity;
        apply();
        if (horizontal.hit || vertical.hit) { count++; emit('bounce'); }
      }
      schedule();
    }
    function stop() {
      if (stopped) return;
      stopped = true; cancelFrame(); pendingPointer = null; held.clear();
      win.clearTimeout(settleTimer); pointerSettling = false;
      listeners.splice(0).forEach(remove => remove());
      resizeObserver?.disconnect(); detachObserver?.disconnect();
      element.style.willChange = originalWillChange;
      if (controllers.get(element) === controller) controllers.delete(element);
    }
    const pause = () => { if (!stopped) { manualPause = true; pendingPointer = null; cancelFrame(); } };
    const resume = () => { if (!stopped) { manualPause = false; refresh('resume'); } };
    const controller = {stop, pause, resume};
    let resizeObserver = null, detachObserver = null;
    controllers.set(element, controller);
    if (!element.isConnected) { stop(); return controller; }
    element.style.willChange = 'transform';
    // A restarted controller retains the prior translate rather than accumulating it.
    const matrix = win.getComputedStyle(element).transform;
    if (matrix && matrix !== 'none') {
      try { const m = new win.DOMMatrixReadOnly(matrix); tx = m.m41; ty = m.m42; } catch { /* CSS contract excludes other transforms. */ }
    }
    measure();
    x = bounds.left + (bounds.right - bounds.left) * (mode === 'bounce' ? .64 : .55);
    y = bounds.top + (bounds.bottom - bounds.top) * (mode === 'bounce' ? .24 : .30);
    apply(); emit('start');
    listen(doc, 'visibilitychange', () => { pendingPointer = null; cancelFrame(); if (!doc.hidden) refresh('visibility'); });
    listen(win, 'blur', () => { focused = false; held.clear(); pendingPointer = null; cancelFrame(); });
    listen(win, 'focus', () => { focused = true; refresh('focus'); });
    listen(win, 'pagehide', stop);
    listen(win, 'pageshow', () => refresh('pageshow'));
    listen(win, 'resize', () => refresh('resize'), {passive: true});
    if (viewport) {
      listen(viewport, 'resize', () => refresh('viewport'), {passive: true});
      listen(viewport, 'scroll', () => refresh('viewport'), {passive: true});
    }
    listen(element, 'focusin', () => { focusWithin = true; pendingPointer = null; cancelFrame(); });
    listen(element, 'focusout', () => win.queueMicrotask(() => {
      if (stopped) return;
      focusWithin = element.contains(doc.activeElement);
      previousTime = 0; schedule();
    }));
    listen(doc, 'pointerdown', event => {
      if (!element.contains(event.target)) return;
      held.add(event.pointerId); pendingPointer = null; pointerSettling = false;
      win.clearTimeout(settleTimer); cancelFrame();
    }, {capture: true, passive: true});
    const pointerEnd = event => {
      if (!held.delete(event.pointerId) || held.size) return;
      pointerSettling = true;
      win.clearTimeout(settleTimer);
      settleTimer = win.setTimeout(() => { pointerSettling = false; previousTime = 0; schedule(); }, 220);
    };
    listen(doc, 'pointerup', pointerEnd, {capture: true, passive: true});
    listen(doc, 'pointercancel', pointerEnd, {capture: true, passive: true});
    if (mode === 'dodge') listen(doc, 'pointermove', event => {
      if (event.pointerType !== 'mouse' || event.buttons || !mouse.matches || basicPause() || !active()) return;
      pendingPointer = {x: event.clientX, y: event.clientY}; schedule();
    }, {passive: true});
    const motionPreference = () => { pendingPointer = null; cancelFrame(); if (!reduce.matches) refresh('preference'); };
    if (reduce.addEventListener) listen(reduce, 'change', motionPreference);
    else { reduce.addListener(motionPreference); listeners.push(() => reduce.removeListener(motionPreference)); }
    if (win.ResizeObserver) {
      resizeObserver = new win.ResizeObserver(() => refresh('resize'));
      resizeObserver.observe(element);
    }
    if (win.MutationObserver) {
      detachObserver = new win.MutationObserver(() => { if (!element.isConnected) stop(); });
      detachObserver.observe(doc.documentElement, {childList: true, subtree: true});
    }
    schedule();
    return controller;
  };
})();
