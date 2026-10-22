/* V15 hero: plays the transparent frame sequence in assets/hero-frames once the frames load,
   reveals the pointer notes in step with it, and replays when the hero comes back into view. */
(() => {
  'use strict';
  const stage = document.querySelector('.hero-stage');
  if (!stage) return;
  const canvas = stage.querySelector('.stage-canvas');
  const poster = stage.querySelector('.stage-poster');
  const notes = [...stage.querySelectorAll('.stage-note')];
  const total = Number(stage.dataset.frames) || 1;
  const fps = Number(stage.dataset.fps) || 30;
  const path = stage.dataset.path;
  const src = (i) => `${path}${String(i).padStart(3, '0')}.webp`;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const showNotes = (frame) => notes.forEach(n => n.classList.toggle('is-on', frame >= Number(n.dataset.at)));

  // Reduced motion: no playback, just the final arms-folded pose with every note visible.
  if (reduced.matches) {
    poster.src = src(total - 1);
    stage.classList.add('is-live');
    showNotes(total);
    return;
  }

  const frames = new Array(total);
  let loaded = 0, ready = false, playing = false, done = false, inView = true, raf = 0, current = 0;

  function fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; draw(current); }
  }
  function draw(i) {
    const img = frames[i];
    if (!img || !img.complete || !img.naturalWidth) return;
    const cw = canvas.width, ch = canvas.height;
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    current = i;
  }
  function play() {
    if (!ready || playing) return;
    playing = true; done = false;
    stage.classList.add('is-playing', 'is-live');
    fit();
    const start = performance.now();
    const step = (now) => {
      const i = Math.min(total - 1, Math.floor((now - start) / 1000 * fps));
      draw(i);
      showNotes(i);
      if (i < total - 1) raf = requestAnimationFrame(step);
      else { playing = false; done = true; }
    };
    raf = requestAnimationFrame(step);
  }
  function reset() {
    cancelAnimationFrame(raf);
    playing = false; done = false;
    draw(0); showNotes(-1);
  }

  for (let i = 0; i < total; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = img.onerror = () => {
      loaded++;
      if (loaded === total) { ready = true; fit(); draw(0); if (inView) play(); }
    };
    img.src = src(i);
    frames[i] = img;
  }

  window.addEventListener('resize', fit, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView && done) reset();
      else if (inView && !done) play();
    }, { threshold: 0.35 }).observe(stage);
  }
})();
