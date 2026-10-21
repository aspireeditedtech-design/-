(() => {
  'use strict';
  const dialog = document.getElementById('gallery-dialog');
  const stage = document.getElementById('gallery-video-stage');
  const title = document.getElementById('gallery-dialog-title');
  const close = document.getElementById('gallery-dialog-close');
  const external = document.getElementById('gallery-external');
  let previousFocus = null;
  const youtubeId = /^[A-Za-z0-9_-]{11}$/;

  function showFilm(button) {
    const kind = button.dataset.kind;
    const id = button.dataset.id;
    if (kind !== 'ai' && !youtubeId.test(id || '')) return;
    if (dialog.open) return;
    previousFocus = button;
    title.textContent = button.dataset.title || 'Selected Video';
    stage.replaceChildren();
    dialog.classList.toggle('is-short', kind === 'short');
    if (kind === 'ai') {
      const video = document.createElement('video');
      video.src = 'assets/videos/dettol-ai-ad.mp4';
      video.poster = 'assets/images/dettol-ai-ad.webp';
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', 'Dettol AI Ad Film');
      stage.append(video);
      external.hidden = true;
    } else {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
      frame.title = title.textContent;
      frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      stage.append(frame);
      external.href = button.dataset.url;
      external.hidden = false;
    }
    dialog.showModal();
    document.body.classList.add('modal-open');
    close.focus({preventScroll:true});
    if (kind === 'ai') {
      const play = stage.querySelector('video').play();
      if (play?.catch) play.catch(() => {});
    }
  }

  function closeFilm() {
    if (!dialog.open) return;
    const video = stage.querySelector('video');
    if (video) video.pause();
    stage.replaceChildren(); // removes the iframe and stops YouTube playback
    dialog.close();
    document.body.classList.remove('modal-open');
    dialog.classList.remove('is-short');
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
  }

  document.querySelectorAll('[data-kind]').forEach(button => button.addEventListener('click', () => showFilm(button)));
  close.addEventListener('click', closeFilm);
  dialog.addEventListener('cancel', e => {e.preventDefault();closeFilm();});
  dialog.addEventListener('click', e => {if (e.target === dialog) closeFilm();});
  document.getElementById('gallery-year').textContent = new Date().getFullYear();
  document.getElementById('gallery-top').addEventListener('click', e => {e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});

  const tabs = [...document.querySelectorAll('.gallery-tabs a')];
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      tabs.forEach(a => a.classList.toggle('active', a.hash === '#' + visible[0].target.id));
    }, {rootMargin:'-20% 0px -55% 0px',threshold:[0,.15,.5]});
    document.querySelectorAll('.gallery-category[id]').forEach(el => obs.observe(el));
  }
})();
