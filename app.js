(() => {
  'use strict';
  const cfg=window.IRFAN_CONTENT;
  const $=(q,root=document)=>root.querySelector(q);
  const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  const year=new Date().getFullYear();
  $('#year-hero').textContent=year;$('#year-footer').textContent=year;

  const menu=$('.menu-toggle'),mobile=$('#mobile-menu');
  function closeMenu(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
  menu.addEventListener('click',()=>{mobile.hidden=!mobile.hidden;menu.setAttribute('aria-expanded',String(!mobile.hidden));menu.setAttribute('aria-label',mobile.hidden?'Open navigation':'Close navigation');});
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

  const grid=$('#featured-reels');
  cfg.featured.forEach((film,i)=>{
    const card=create('button','reel-card'+(film.type==='instagram'?' ig':''));card.type='button';card.dataset.type=film.type;card.dataset.id=film.id;card.dataset.title=film.title;card.dataset.url=film.url;card.setAttribute('aria-label','Play '+film.title+' in portfolio');
    if(film.type==='youtube'){
      const img=create('img');img.src='https://i.ytimg.com/vi/'+film.id+'/hqdefault.jpg';img.alt='Thumbnail for '+film.title;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>card.classList.add('thumb-missing'));card.append(img);
    }else{card.append(create('span','ig-art','◎'));}
    card.append(create('span','reel-overlay'));
    card.append(create('span','reel-no',String(i+1).padStart(2,'0')+' / 05'));
    card.append(create('span','reel-platform',film.type==='youtube'?'YT SHORTS':'INSTAGRAM'));
    card.append(create('span','small-play','▶'));
    const info=create('span','reel-info');info.append(create('b','',film.title),create('small','',film.tag));card.append(info);grid.append(card);
  });

  const cg=$('#client-grid');
  cfg.clients.forEach((c,i)=>{
    const card=create('article','client');card.append(create('span','client-index',String(i+1).padStart(2,'0')+' / SELECTED COLLABORATION'));
    card.append(create('h3','',c.name),create('span','client-category',c.category),create('p','',c.detail));
    const footer=create('div','client-foot');footer.append(create('span','',c.time));
    if(c.url){const link=create('a','',c.label+' ↗');link.href=c.url;link.target='_blank';link.rel='noopener noreferrer';footer.append(link);}
    card.append(footer);cg.append(card);
  });

  const dialog=$('#player-dialog'),stage=$('#player-stage'),title=$('#player-title'),close=$('#dialog-close'),external=$('#player-external'),note=$('#player-note');
  let previouslyFocused=null;
  const idPattern=/^[\w-]{11}$/;
  function openPlayer(button){
    const type=button.dataset.type,id=button.dataset.id;
    if(type==='youtube' && !idPattern.test(id||''))return;
    if(type==='instagram' && !/^[\w-]+$/.test(id||''))return;
    const local=type==='local';const portrait=type==='instagram'||(type==='youtube'&&cfg.featured.some(x=>x.id===id));
    if(local&&!/^assets\/videos\/[\w.-]+\.mp4$/.test(button.dataset.src||''))return;
    previouslyFocused=button;stage.replaceChildren();dialog.classList.toggle('is-portrait',portrait);
    const name=button.dataset.title||((type==='youtube'&&id===cfg.payoff.id)?cfg.payoff.title:'Selected edit');title.textContent=name;
    note.textContent=type==='instagram'?'INSTAGRAM MAY RESTRICT EMBEDDING · USE ORIGINAL LINK':'PRESS ESC TO CLOSE';
    let url=button.dataset.url||'';
    if(type==='youtube'){
      const iframe=create('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
      iframe.title=name;iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allowFullscreen=true;stage.append(iframe);
      if(!url)url=(id===cfg.payoff.id?cfg.payoff.url:'https://www.youtube.com/watch?v='+id);
    }else if(type==='instagram'){
      const iframe=create('iframe');iframe.src=`https://www.instagram.com/p/${id}/embed/`;iframe.title=name;iframe.loading='eager';stage.append(iframe);if(!url)url=`https://www.instagram.com/p/${id}/`;
    }else if(local){
      const video=create('video');video.src=button.dataset.src;video.controls=true;video.autoplay=true;video.playsInline=true;video.preload='metadata';stage.append(video);video.play().catch(()=>{});
    }else{return;}
    external.hidden=!url;external.href=url||'#';external.textContent=type==='instagram'?'OPEN ON INSTAGRAM ↗':'OPEN ORIGINAL ↗';
    dialog.showModal();document.body.classList.add('modal-open');close.focus({preventScroll:true});
  }
  function closePlayer(){if(!dialog.open)return;const v=stage.querySelector('video');if(v)v.pause();stage.replaceChildren();dialog.close();document.body.classList.remove('modal-open');dialog.classList.remove('is-portrait');if(previouslyFocused?.isConnected)previouslyFocused.focus({preventScroll:true});}
  document.addEventListener('click',e=>{const card=e.target.closest('[data-type]');if(card&&card instanceof HTMLButtonElement)openPlayer(card);});
  close.addEventListener('click',closePlayer);dialog.addEventListener('cancel',e=>{e.preventDefault();closePlayer();});dialog.addEventListener('click',e=>{if(e.target===dialog)closePlayer();});

  // Hover previews only for LOCAL original showreel and AI film (never load heavyweight files by default).
  const canHover=matchMedia('(hover:hover) and (pointer:fine)');const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)');
  document.querySelectorAll('.hover-preview').forEach(video=>{
    const card=video.closest('button');
    const stop=()=>{video.pause();card.classList.remove('is-previewing');try{video.currentTime=0;}catch(_){}};
    const start=()=>{if(!canHover.matches||reduceMotion.matches||dialog.open)return;if(!video.src)video.src=video.dataset.preview;video.muted=true;video.play().then(()=>{if(card.matches(':hover')||card.matches(':focus-visible'))card.classList.add('is-previewing');else stop();}).catch(stop);};
    card.addEventListener('pointerenter',start);card.addEventListener('pointerleave',stop);card.addEventListener('focus',start);card.addEventListener('blur',stop);dialog.addEventListener('close',stop);
  });
})();
