(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const dialog = $('#video-dialog');
  const player = $('#player');
  const dialogTitle = $('#dialog-title');
  const closeButton = $('#close-dialog');
  const emailLink = $('#email-link');
  const phoneLink = $('#phone-link');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let previouslyFocused = null;
  let playbackTimeout = 0;
  const heroCards = [...document.querySelectorAll('.reel-card')];
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  // All five reel cards preview from 0:00 with no sound; clicking opens the full film WITH sound.
  function stopPreview(card) {
    const preview = card.querySelector('.reel-preview');
    if (!preview) return;
    preview.pause();
    card.classList.remove('is-previewing');
    try { preview.currentTime = 0; } catch (_) {}
  }
  function startPreview(card) {
    if (!canHover.matches || reducedMotion.matches || dialog.open) return;
    const video = config.videos?.[Number(card.dataset.video)];
    const preview = card.querySelector('.reel-preview');
    if (!video?.preview || !preview) return;
    if (!preview.getAttribute('src')) preview.src = video.preview;
    preview.muted = true;
    preview.currentTime = 0;
    const playing = preview.play();
    if (playing?.then) playing.then(() => { if (!dialog.open && (card.matches(':hover') || card.matches(':focus-visible'))) card.classList.add('is-previewing'); else stopPreview(card); }).catch(() => stopPreview(card));
  }
  heroCards.forEach(card => {
    card.addEventListener('pointerenter', () => startPreview(card));
    card.addEventListener('pointerleave', () => stopPreview(card));
    card.addEventListener('focus', () => startPreview(card));
    card.addEventListener('blur', () => stopPreview(card));
  });
  const aiFilmCard = $('.ai-film-card');
  const aiFilmPreview = $('.ai-film-preview');
  function stopAiFilmPreview() {
    if (!aiFilmPreview) return;
    aiFilmPreview.pause();
    aiFilmCard.classList.remove('is-previewing');
    try { aiFilmPreview.currentTime = 0; } catch (_) {}
  }
  function startAiFilmPreview() {
    if (!aiFilmPreview || !canHover.matches || reducedMotion.matches || dialog.open) return;
    const film = config.videos?.[6];
    if (!film?.preview) return;
    if (!aiFilmPreview.getAttribute('src')) aiFilmPreview.src = film.preview;
    aiFilmPreview.muted = true;
    try { aiFilmPreview.currentTime = 0; } catch (_) {}
    const playing = aiFilmPreview.play();
    if (playing?.then) playing.then(() => {
      if (!dialog.open && (aiFilmCard.matches(':hover') || aiFilmCard.matches(':focus-visible'))) aiFilmCard.classList.add('is-previewing');
      else stopAiFilmPreview();
    }).catch(() => stopAiFilmPreview());
  }
  if (aiFilmCard) {
    aiFilmCard.addEventListener('pointerenter', startAiFilmPreview);
    aiFilmCard.addEventListener('pointerleave', stopAiFilmPreview);
    aiFilmCard.addEventListener('focus', startAiFilmPreview);
    aiFilmCard.addEventListener('blur', stopAiFilmPreview);
  }



  // Signature showreel: lightweight, silent preview on hover; full film plays with sound on click.
  const showreelCard = $('.showreel-card');
  const showreelPreview = $('.showreel-preview');
  function stopShowreelPreview() {
    if (!showreelPreview) return;
    showreelPreview.pause();
    showreelCard.classList.remove('is-previewing');
    try { showreelPreview.currentTime = 0; } catch (_) {}
  }
  function startShowreelPreview() {
    if (!showreelCard || !showreelPreview || !canHover.matches || reducedMotion.matches || dialog.open) return;
    const video = config.videos?.[9];
    if (!video?.preview) return;
    if (!showreelPreview.getAttribute('src')) showreelPreview.src = video.preview;
    showreelPreview.muted = true;
    try { showreelPreview.currentTime = 0; } catch (_) {}
    const playing = showreelPreview.play();
    if (playing?.then) playing.then(() => {
      if (!dialog.open && (showreelCard.matches(':hover') || showreelCard.matches(':focus-visible'))) showreelCard.classList.add('is-previewing');
      else stopShowreelPreview();
    }).catch(() => stopShowreelPreview());
  }
  if (showreelCard) {
    showreelCard.addEventListener('pointerenter', startShowreelPreview);
    showreelCard.addEventListener('pointerleave', stopShowreelPreview);
    showreelCard.addEventListener('focus', startShowreelPreview);
    showreelCard.addEventListener('blur', stopShowreelPreview);
  }

  if (config.email) {
    emailLink.href = 'mailto:' + config.email + '?subject=' + encodeURIComponent('Video editing project inquiry');
    $('#email-text').textContent = config.email + ' · +91 ' + (config.phone || '7717777075');
  }
  if (config.phone && phoneLink) phoneLink.href = 'tel:+91' + config.phone;
  $('#year').textContent = new Date().getFullYear();

  function openVideo(card) {
    const video = config.videos?.[Number(card.dataset.video)];
    if (!video || dialog.open) return;
    heroCards.forEach(stopPreview);
    stopAiFilmPreview();
    stopShowreelPreview();
    previouslyFocused = card;
    dialog.classList.toggle('landscape-dialog', Boolean(video.landscape));
    dialogTitle.textContent = video.title;
    player.poster = video.poster;
    player.currentTime = 0;
    player.src = video.src;
    player.setAttribute('aria-label', video.title + ', ' + video.subtitle);
    dialog.showModal();
    document.body.classList.add('modal-open');
    const rect = card.getBoundingClientRect();
    const stage = $('.video-stage').getBoundingClientRect();
    const scale = Math.max(.20, Math.min(.78, rect.width / stage.width));
    dialog.style.setProperty('--enter-x', `${rect.left + rect.width / 2 - (stage.left + stage.width / 2)}px`);
    dialog.style.setProperty('--enter-y', `${rect.top + rect.height / 2 - (stage.top + stage.height / 2)}px`);
    dialog.style.setProperty('--enter-scale', scale);
    dialog.classList.remove('is-visible');
    requestAnimationFrame(() => dialog.classList.add('is-visible'));
    // The click is the user's playback gesture; the video is never muted.
    const playPromise = player.play();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {/* The native player retains its play button. */});
    closeButton.focus({ preventScroll: true });
  }

  function closeVideo() {
    if (!dialog.open) return;
    player.pause();
    clearTimeout(playbackTimeout);
    dialog.close();
    dialog.classList.remove('is-visible');
    dialog.classList.remove('landscape-dialog');
    document.body.classList.remove('modal-open');
    player.removeAttribute('src');
    player.load(); // Free video memory when the dialog is closed.
    if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-video]').forEach((card) => {
    card.addEventListener('click', () => openVideo(card));
  });
  closeButton.addEventListener('click', closeVideo);
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeVideo(); });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeVideo(); });
  player.addEventListener('error', () => { if (dialog.open) dialogTitle.textContent = 'Video couldn\'t load — check the video file'; });


  // V12: Four featured YouTube cards now play in this portfolio instead of navigating away.
  const ytDialog = document.getElementById('youtube-dialog');
  const ytStage = document.getElementById('youtube-dialog-stage');
  const ytTitle = document.getElementById('youtube-dialog-title');
  const ytClose = document.getElementById('youtube-dialog-close');
  const ytLink = document.getElementById('youtube-dialog-link');
  let ytPreviousFocus = null;
  const ytIdPattern = /^[A-Za-z0-9_-]{11}$/;
  document.querySelectorAll('[data-home-youtube-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.homeYoutubeId;
      if (!ytIdPattern.test(id || '') || ytDialog.open) return;
      ytPreviousFocus = card;
      ytTitle.textContent = card.querySelector('.long-video-meta strong')?.textContent || 'Long-format edit';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
      iframe.title = ytTitle.textContent;
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      ytStage.replaceChildren(iframe);
      ytLink.href = `https://www.youtube.com/watch?v=${id}`;
      ytDialog.showModal();
      document.body.classList.add('modal-open');
      ytClose.focus({preventScroll:true});
    });
  });
  function closeYoutubeDialog() {
    if (!ytDialog.open) return;
    ytStage.replaceChildren(); // unloads the iframe and stops playback
    ytDialog.close();
    document.body.classList.remove('modal-open');
    if (ytPreviousFocus?.isConnected) ytPreviousFocus.focus({preventScroll:true});
  }
  ytClose.addEventListener('click', closeYoutubeDialog);
  ytDialog.addEventListener('cancel', (e) => {e.preventDefault();closeYoutubeDialog();});
  ytDialog.addEventListener('click', (e) => {if (e.target === ytDialog) closeYoutubeDialog();});

  const menuButton = $('.mobile-menu-button');
  const mobileNav = $('#mobile-nav');
  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }
  menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      navLinks.forEach(a => a.classList.toggle('current', a.hash === `#${visible[0].target.id}`));
    }, { rootMargin: '-15% 0px -60% 0px', threshold: [0, .2, .5, .8] });
    sections.forEach(s => observer.observe(s));
  }

  // Subtle cursor lighting on desktop; completely disabled on touch / reduced-motion devices.
  const glow = $('.cursor-glow');
  if (window.matchMedia('(pointer:fine)').matches && !reducedMotion.matches) {
    window.addEventListener('pointermove', (e) => {
      glow.style.setProperty('--pointer-x', e.clientX + 'px');
      glow.style.setProperty('--pointer-y', e.clientY + 'px');
    }, { passive: true });
  } else glow.hidden = true;
})();


// Client logo availability: try a known secondary brand icon, then show initials.
document.querySelectorAll('.client-logo img').forEach(img => {
  img.addEventListener('error', () => {
    const alternative = img.dataset.alternative;
    if (alternative) {
      delete img.dataset.alternative;
      img.src = alternative;
    } else {
      img.remove();
    }
  });
});
