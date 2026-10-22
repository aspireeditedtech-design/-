/* V16 hero
   1. Particles fly in and assemble into the first frame of the portrait.
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
  const dust = stage.querySelector('.stage-particles');
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
    sizeCanvas(dust); sizeCanvas(canvas);
    // The particle canvas is larger than the portrait so the scattered dust is not cut off at a box edge.
    const W = dust.width, H = dust.height, scale = dpr();
    const fw = canvas.width, fh = canvas.height, ox = (W - fw) / 2, oy = (H - fh) / 2;
    let pixels;
    try {
      const off = document.createElement('canvas');
      off.width = fw; off.height = fh;
      const o = off.getContext('2d');
      o.drawImage(img, ...fitRect(img, fw, fh));
      pixels = o.getImageData(0, 0, fw, fh).data;
    } catch (_) { finishIntro(); return; } // e.g. opened from file:// — skip straight to the image

    const step = Math.max(3, Math.round(3.4 * scale));
    const size = step * 0.92;
    const parts = [];
    for (let y = 0; y < fh; y += step) {
      for (let x = 0; x < fw; x += step) {
        const p = (y * fw + x) * 4;
        if (pixels[p + 3] < 110) continue;
        const angle = Math.random() * Math.PI * 2;
        const reach = 0.25 + Math.sqrt(Math.random()) * 0.72;
        parts.push({
          x: x + ox, y: y + oy,
          sx: W / 2 + Math.cos(angle) * reach * W * 0.42,
          sy: H * 0.46 + Math.sin(angle) * reach * H * 0.44,
          delay: (y / fh) * 650 + Math.random() * 500,
          color: `rgb(${pixels[p]},${pixels[p + 1]},${pixels[p + 2]})`
        });
      }
    }
    const dctx = dust.getContext('2d');
    const duration = 1600, total = duration + 1150;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    stage.classList.add('is-assembling', 'is-live');
    const start = performance.now();
    const frame = (now) => {
      const t = now - start;
      dctx.clearRect(0, 0, W, H);
      for (const q of parts) {
        const k = ease(Math.min(1, Math.max(0, (t - q.delay) / duration)));
        const life = Math.min(1, t / 500);
        dctx.globalAlpha = life * (0.35 + 0.65 * k);
        dctx.fillStyle = q.color;
        const s = size * (1.8 - 0.8 * k);
        dctx.fillRect(q.sx + (q.x - q.sx) * k, q.sy + (q.y - q.sy) * k, s, s);
      }
      if (t < total) requestAnimationFrame(frame);
      else { dctx.globalAlpha = 1; finishIntro(); }
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
