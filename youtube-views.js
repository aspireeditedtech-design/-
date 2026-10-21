(() => {
  'use strict';
  const fields = [...document.querySelectorAll('[data-view-id]')];
  if (!fields.length) return;
  fetch('assets/data/youtube-views.json', {cache:'no-cache'})
    .then(r => {if (!r.ok) throw new Error('View cache unavailable');return r.json();})
    .then(data => {
      if (!data || !data.videos || typeof data.videos !== 'object') return;
      const updated = data.updated_at ? new Date(data.updated_at) : null;
      fields.forEach(el => {
        const entry = data.videos[el.dataset.viewId];
        if (!entry || !Number.isFinite(Number(entry.views)) || Number(entry.views) < 0) return;
        const views = Number(entry.views);
        el.textContent = new Intl.NumberFormat('en-IN').format(views) + ' views';
        el.classList.add('is-loaded');
        if (updated && !Number.isNaN(updated.getTime())) el.title = 'YouTube view count updated ' + updated.toLocaleString();
      });
      // Optional: replace neutral gallery titles with actual YouTube titles from the API.
      document.querySelectorAll('.media-open[data-id]').forEach(button => {
        const entry = data.videos[button.dataset.id];
        if (!entry || typeof entry.title !== 'string' || !entry.title.trim()) return;
        const name = button.querySelector('.media-meta strong');
        if (name) name.textContent = entry.title;
        button.dataset.title = entry.title;
      });
    }).catch(() => {/* Keep honest fallback: users can check views on YouTube. */});
})();
