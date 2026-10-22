/* V16 hero
   1. On open, the portrait (as particles) blasts out across the whole window, then flies back together.
   2. Scrolling then scrubs the 192-frame sequence (arms fold); scrolling back up unfolds them.
      On desktop the hero stays pinned while the frames play; on phones the first scroll drives it.
   3. Pointer notes appear: two after the build-up, two as the arms fold. */
(() => {
  'use strict';
  const stage = document.querySelector('.hero-stage');
  if (!stage) return;
  const pin = document.querySelector('.hero-pin');
  const hero = document.querySelector('.hero');
  const canvas = stage.querySelector('.stage-canvas');
  const poster = stage.querySelector('.stage-poster');
  const notes = [...stage.querySelectorAll('.stage-note')];
  const total = Number(stage.dataset.frames) || 1;
  const path = stage.dataset.path;
  const src = (i) => `${path}${String(i).padStart(3, '0')}.webp`;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 801px)');
  let introDone = false;
  const showNotes = (frame) => notes.forEach(n => {
    n.classList.toggle('is-on', introDone && frame >= Number(n.dataset.at));
  });

  // Reduced motion: final arms-folded pose, every note visible, no pinning or particles.
  if (reduced.matches) {
    poster.src = src(total - 1);
    stage.classList.add('is-live');
    introDone = true;
    showNotes(total);
    return;
  }
  stage.classList.add('js-stage');

  const frames = new Array(total);
  let current = -1, target = 0, raf = 0;
  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas(c) {
    const w = Math.round(c.clientWidth * dpr()), h = Math.round(c.clientHeight * dpr());
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; return true; }
    return false;
  }
  function fitRect(img, cw, ch) {
    const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    return [(cw - w) / 2, (ch - h) / 2, w, h];
  }
  const usable = (img) => img && img.complete && img.naturalWidth;
  function draw(i, force) {
    // Fall back to the nearest earlier frame that has finished loading.
    let k = i;
    while (k > 0 && !usable(frames[k])) k--;
    if (!usable(frames[k]) || (k === current && !force)) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[k], ...fitRect(frames[k], canvas.width, canvas.height));
    current = k;
  }

  /* ---------- scroll → frame ---------- */
  function layoutPin() {
    if (!pin || !hero) return;
    const pinned = desktop.matches;
    pin.classList.toggle('is-pinned', pinned);
    if (pinned) {
      pin.style.setProperty('--pin-top', `${Math.min(0, window.innerHeight - hero.offsetHeight)}px`);
      pin.style.setProperty('--pin-distance', `${Math.round(window.innerHeight * 1.1)}px`);
    }
  }
  function progress() {
    if (desktop.matches && pin) {
      const pinTop = Math.min(0, window.innerHeight - hero.offsetHeight);
      const distance = window.innerHeight * 1.1;
      const scrolled = -pin.getBoundingClientRect().top + pinTop;
      return Math.min(1, Math.max(0, scrolled / distance));
    }
    return Math.min(1, Math.max(0, window.scrollY / 360));
  }
  function onScroll() {
    target = Math.round(progress() * (total - 1));
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    raf = 0;
    if (!introDone) return;
    // Ease toward the scroll position so fast wheel jumps still read as motion.
    const diff = target - current;
    let jump = Math.round(diff * 0.35);
    if (jump === 0) jump = Math.sign(diff);
    const next = Math.abs(diff) <= 1 ? target : current + jump;
    draw(next);
    showNotes(current);
    stage.classList.toggle('show-hint', current < 6);
    if (current !== target) raf = requestAnimationFrame(tick);
  }

  /* ---------- particle build-up ---------- */
  function finishIntro() {
    introDone = true;
    stage.classList.add('is-playing', 'is-live');
    stage.classList.remove('is-assembling');
    sizeCanvas(canvas);
    draw(Math.round(progress() * (total - 1)), true);
    onScroll();
  }
  function assemble(img) {
    sizeCanvas(canvas);
    // Sample the first frame at CSS-pixel resolution inside the portrait box.
    const fw = Math.round(canvas.clientWidth), fh = Math.round(canvas.clientHeight);
    let pixels;
    try {
      const off = document.createElement('canvas');
      off.width = fw; off.height = fh;
      const o = off.getContext('2d');
      o.drawImage(img, ...fitRect(img, fw, fh));
      pixels = o.getImageData(0, 0, fw, fh).data;
    } catch (_) { finishIntro(); return; } // e.g. opened from file:// — skip straight to the image

    // Full-window overlay so the blast can spread over the whole page.
    const dust = document.createElement('canvas');
    dust.className = 'page-particles';
    dust.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dust);
    const dctx = dust.getContext('2d');
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    let vw = 0, vh = 0;
    const sizeDust = () => {
      vw = window.innerWidth; vh = window.innerHeight;
      dust.width = Math.round(vw * ratio); dust.height = Math.round(vh * ratio);
      dctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    sizeDust();
    window.addEventListener('resize', sizeDust, { passive: true });

    const step = vw < 600 ? 3 : 3.4;
    const size = step * 0.95;
    const parts = [];
    for (let y = 0; y < fh; y += step) {
      for (let x = 0; x < fw; x += step) {
        const p = (Math.floor(y) * fw + Math.floor(x)) * 4;
        if (pixels[p + 3] < 110) continue;
        // Match the soft fade at the bottom of the portrait.
        const fade = Math.min(1, Math.max(0, (1 - y / fh - 0.02) / 0.24));
        if (fade <= 0.02) continue;
        parts.push({
          x, y, fade,
          // a random spot anywhere in the window (a little past the edges too)
          ex: (Math.random() * 1.2 - 0.1) * vw,
          ey: (Math.random() * 1.2 - 0.1) * vh,
          dx: (Math.random() - 0.5) * 0.05,
          dy: (Math.random() - 0.5) * 0.05,
          out: Math.random() * 140,
          back: (y / fh) * 520 + Math.random() * 380,
          color: `rgb(${pixels[p]},${pixels[p + 1]},${pixels[p + 2]})`
        });
      }
    }

    const HOLD = 260, BLAST = 900, FLOAT = 420, RETURN = 1350;
    const backStart = HOLD + BLAST + FLOAT;
    const end = backStart + 520 + 380 + RETURN;
    const outExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const clamp01 = (v) => Math.min(1, Math.max(0, v));

    stage.classList.add('is-assembling', 'is-live');
    const start = performance.now();
    const frame = (now) => {
      const t = now - start;
      const r = canvas.getBoundingClientRect(); // follows the portrait even if the page scrolls
      dctx.clearRect(0, 0, vw, vh);
      for (const q of parts) {
        const hx = r.left + q.x, hy = r.top + q.y; // home position
        let px, py, a = q.fade, s = size;
        const tb = t - HOLD - q.out;
        if (tb <= 0) {
          px = hx; py = hy; a *= clamp01(t / 200);
        } else {
          const k = outExpo(clamp01(tb / BLAST));
          const drift = Math.max(0, Math.min(t, backStart + q.back) - HOLD - q.out);
          const fx = q.ex + q.dx * drift * 4, fy = q.ey + q.dy * drift * 4;
          const sx = hx + (fx - hx) * k, sy = hy + (fy - hy) * k;
          const kb = inOut(clamp01((t - backStart - q.back) / RETURN));
          px = sx + (hx - sx) * kb; py = sy + (hy - sy) * kb;
          const away = k * (1 - kb);
          a *= 1 - 0.35 * away;
          s = size * (1 + 0.6 * away);
        }
        dctx.globalAlpha = a;
        dctx.fillStyle = q.color;
        dctx.fillRect(px, py, s, s);
      }
      if (t < end) { requestAnimationFrame(frame); return; }
      dctx.globalAlpha = 1;
      finishIntro();
      dust.classList.add('is-gone');
      setTimeout(() => { window.removeEventListener('resize', sizeDust); dust.remove(); }, 600);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- load frames ---------- */
  for (let i = 0; i < total; i++) {
    const img = new Image();
    img.decoding = 'async';
    if (i === 0) img.onload = () => assemble(img);
    img.onerror = () => { if (i === 0) finishIntro(); };
    img.onload = i === 0 ? img.onload : () => { if (introDone && i <= target) draw(target); };
    img.src = src(i);
    frames[i] = img;
  }

  layoutPin();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    layoutPin();
    if (sizeCanvas(canvas) && introDone) draw(current, true);
    onScroll();
  }, { passive: true });
})();
