/* Motion only: native close buttons, links and keyboard handlers remain owned by the caller.
 * CSS contract: the supplied card is fixed-positioned, fits the visual viewport minus
 * 8px, and has no transform/transform transition or transformed ancestor. This module
 * owns its inline translate3d. Use max-width/max-height:
 * calc(var(--br-motion-view-width, 100vw) - 8px) / the corresponding
 * --br-motion-view-height (100dvh fallback), plus border-box and overflow:auto.
 * Keep .br-real-close inside the card. stop() preserves
 * the last position; a new controller on the same element replaces the previous one.
 * Optional numeric slot selects one of four starting quadrants. Static mode keeps
 * its measured position when neither slot nor origin is supplied. Optional origin
 * is an internal [x,y] pair in 0..1.
 * Optional speed is bounded to 0.5–1.7 (default 1).
 * Dodge state can be persisted from onMove: dodgeLimit, dodgeCount and settled.
 * topReserve/bottomReserve leave room for a genuine close outside the frame.
 * snapshot()/nudge() let the caller resolve occasional card collisions without
 * bypassing the same focus, pointer, reduced-motion and settled-dodge guards.
 * nudge(dx,dy,{animate:true}) eases a shove over 300ms; the default remains immediate.
 */
(() => {
  'use strict';
  const controllers = new WeakMap();
  window.BROWSE_POPUP_MOTION = ({element, mode = 'bounce', isActive = () => true, onMove, slot, origin = null, speed = 1,
    random = Math.random, dodgeLimit, dodgeCount = 0, topReserve = 0, bottomReserve = 0} = {}) => {
    if (!element?.getBoundingClientRect || !element.style) throw new TypeError('A popup card element is required.');
    if (!['bounce', 'dodge', 'static'].includes(mode)) throw new TypeError('Unknown popup motion mode.');
    controllers.get(element)?.stop();
    const doc = element.ownerDocument, win = doc.defaultView;
    const reduce = win.matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = win.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const viewport = win.visualViewport, margin = 4, listeners = [], held = new Set();
    const originalWillChange = element.style.willChange;
    let stopped = false, manualPause = false, focused = doc.hasFocus(), focusWithin = element.contains(doc.activeElement);
    let raf = 0, previousTime = 0, settleTimer = 0, pointerSettling = false, pendingPointer = null, shove = null;
    let x = 0, y = 0, tx = 0, ty = 0, baseX = 0, baseY = 0, width = 0, height = 0, bounds;
    const motionSpeed = Number.isFinite(speed) ? Math.max(.5, Math.min(1.7, speed)) : 1;
    const quadrant = Number.isFinite(slot) ? ((Math.trunc(slot) % 4) + 4) % 4 : null;
    let vx = 92 * motionSpeed, vy = 66 * motionSpeed, count = 0, lastDodge = -Infinity;
    const draw = () => {
      let value;
      try { value = typeof random === 'function' ? random() : Math.random(); } catch { value = Math.random(); }
      return Number.isFinite(value) ? Math.max(0, Math.min(1 - Number.EPSILON, value)) : Math.random();
    };
    const limit = Number.isInteger(dodgeLimit) && dodgeLimit >= 4 && dodgeLimit <= 6 ? dodgeLimit : 4 + Math.floor(draw() * 3);
    let usedDodges = Number.isFinite(dodgeCount) ? Math.max(0, Math.min(limit, Math.trunc(dodgeCount))) : 0;
    const reserve = Number.isFinite(topReserve) ? Math.max(0, topReserve) : 0;
    const reserveBottom = Number.isFinite(bottomReserve) ? Math.max(0, bottomReserve) : 0;
    const listen = (target, name, fn, options) => {
      target.addEventListener(name, fn, options);
      listeners.push(() => target.removeEventListener(name, fn, options));
    };
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const active = () => { try { return Boolean(isActive()); } catch { return false; } };
    const basicPause = () => stopped || manualPause || doc.hidden || !focused || focusWithin || held.size > 0 || pointerSettling || reduce.matches;
    const cancelFrame = () => { if (raf) win.cancelAnimationFrame(raf); raf = 0; previousTime = 0; shove = null; };
    const apply = () => {
      tx = x - baseX; ty = y - baseY;
      element.style.transform = `translate3d(${tx.toFixed(3)}px, ${ty.toFixed(3)}px, 0)`;
    };
    const emit = reason => {
      if (typeof onMove !== 'function') return;
      try { onMove({mode, count, x, y, width, height, reason, dodgeLimit: limit, dodgeCount: usedDodges,
        settled: mode === 'dodge' && usedDodges >= limit}); } catch { /* A text callback must not break motion or native controls. */ }
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
      const bottom = Math.max(top + margin, top + viewHeight - height - margin - reserveBottom);
      bounds = {left: left + margin, top: Math.min(bottom, top + margin + reserve),
        right: Math.max(left + margin, left + viewWidth - width - margin),
        bottom};
      x = clamp(rect.left, bounds.left, bounds.right);
      y = clamp(rect.top, bounds.top, bounds.bottom);
    };
    const schedule = () => {
      if (!element.isConnected) { stop(); return; }
      if (!raf && !basicPause() && (mode === 'bounce' || pendingPointer || shove)) raf = win.requestAnimationFrame(tick);
    };
    const refresh = reason => {
      if (stopped) return;
      if (!element.isConnected) { stop(); return; }
      cancelFrame();
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
      if (usedDodges >= limit || !mouse.matches || now - lastDodge < 260) return;
      const closes = [...element.querySelectorAll('.br-real-close, .br-ghost-close[data-br-close]')].map(close => {
        const style = win.getComputedStyle(close), rect = close.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && close.getClientRects().length && rect.width && rect.height ? rect : null;
      }).filter(Boolean);
      if (!closes.some(rect => Math.hypot(Math.max(rect.left - pointer.x, 0, pointer.x - rect.right),
        Math.max(rect.top - pointer.y, 0, pointer.y - rect.bottom)) <= 44)) return;
      const offsets = closes.map(rect => [rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y]);
      const distance = (a, b) => Math.min(...offsets.map(([cx, cy]) => Math.hypot(a + cx - pointer.x, b + cy - pointer.y)));
      const travelX = bounds.right - bounds.left, travelY = bounds.bottom - bounds.top;
      const diagonal = Math.hypot(travelX, travelY);
      if (diagonal < 1) return;
      const corners = [[bounds.left, bounds.top], [bounds.right, bounds.top], [bounds.left, bounds.bottom], [bounds.right, bounds.bottom]];
      const currentDistance = distance(x, y), maxDistance = Math.max(...corners.map(([a,b]) => distance(a,b)));
      const minDistance = Math.min(Math.max(72, currentDistance + 32), maxDistance * .78);
      const minGain = Math.min(24, Math.max(0, maxDistance - currentDistance) * .35);
      const minTravel = Math.max(1, Math.min(140, diagonal * .23));
      const preferEdge = draw() < .6, candidates = [];
      const sample = edge => {
        let u = draw(), v = draw();
        if (edge) {
          const side = Math.floor(draw() * 4);
          if (side === 0) u *= .15;
          else if (side === 1) u = 1 - u * .15;
          else if (side === 2) v *= .15;
          else v = 1 - v * .15;
        }
        return [bounds.left + travelX * u, bounds.top + travelY * v];
      };
      // Rejection sampling preserves a random destination instead of choosing a fixed
      // farthest corner. A bounded fallback handles narrow screens and unusual RNGs.
      for (let attempt = 0; attempt < 40 && candidates.length < 6; attempt++) {
        const candidate = sample(attempt < 28 ? preferEdge : !preferEdge), d = distance(...candidate);
        if (Math.hypot(candidate[0] - x, candidate[1] - y) >= minTravel && d >= minDistance && d > currentDistance + minGain) candidates.push(candidate);
      }
      if (!candidates.length) return;
      const destination = candidates[Math.floor(draw() * candidates.length)];
      shove = null;
      x = destination[0]; y = destination[1]; lastDodge = now; count++; usedDodges++;
      apply(); emit('dodge');
    };
    function tick(now) {
      raf = 0;
      if (!element.isConnected) { stop(); return; }
      if (basicPause()) { previousTime = 0; shove = null; return; }
      if (!active()) { previousTime = 0; shove = null; schedule(); return; }
      // A close-hover response takes precedence over a collision already in flight.
      if (mode === 'dodge') {
        const pointer = pendingPointer; pendingPointer = null;
        if (pointer) dodge(pointer, now);
      }
      if (shove) {
        if (!canNudge()) { shove = null; previousTime = 0; schedule(); return; }
        if (shove.startedAt === null) shove.startedAt = now;
        const progress = clamp((now - shove.startedAt) / 300, 0, 1),tail = progress - 1;
        const eased = 1 + 2.1 * tail * tail * tail + 1.1 * tail * tail;
        x = clamp(shove.fromX + (shove.toX - shove.fromX) * eased, bounds.left, bounds.right);
        y = clamp(shove.fromY + (shove.toY - shove.fromY) * eased, bounds.top, bounds.bottom);
        apply();
        if (progress === 1) { shove = null; previousTime = now; }
        schedule();return;
      }
      if (mode === 'bounce') {
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
    const canNudge = () => !basicPause() && active() && mouse.matches && !(mode === 'dodge' && usedDodges >= limit);
    const snapshot = () => ({x, y, width, height, canMove: canNudge(), mode});
    const nudge = (dx, dy, {animate = false} = {}) => {
      if (!canNudge() || !Number.isFinite(dx) || !Number.isFinite(dy)) return false;
      const nextX=clamp(x+Math.max(-64,Math.min(64,dx)),bounds.left,bounds.right);
      const nextY=clamp(y+Math.max(-64,Math.min(64,dy)),bounds.top,bounds.bottom);
      if (Math.hypot(nextX-x,nextY-y)<.5) return false;
      if (nextX!==x) vx=Math.sign(nextX-x)*Math.abs(vx);
      if (nextY!==y) vy=Math.sign(nextY-y)*Math.abs(vy);
      shove=animate?{fromX:x,fromY:y,toX:nextX,toY:nextY,startedAt:null}:null;
      if(!animate){x=nextX;y=nextY;apply();}
      count++;emit('collision');previousTime=0;schedule();return true;
    };
    const controller = {stop, pause, resume, snapshot, nudge};
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
    if(mode!=='static'||origin||quadrant!==null){
      const start = origin || (quadrant === null ? (mode === 'bounce' ? [.64, .24] : [.55, .30])
        : [[.04, .08], [.93, .16], [.08, .90], [.87, .87]][quadrant]);
      x = bounds.left + (bounds.right - bounds.left) * start[0];
      y = bounds.top + (bounds.bottom - bounds.top) * start[1];
    }
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
      if (usedDodges >= limit || event.pointerType !== 'mouse' || event.buttons || !mouse.matches || basicPause() || !active()) return;
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
