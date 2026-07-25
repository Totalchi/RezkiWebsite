/* ==========================================================
   RM Bygg & Montage AB — content interactions
   Tabs, service chips, gallery filter + lightbox, mobile nav, reviews marquee, projects.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  // ---------- Tabs ----------
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');
  tabs.forEach(b => b.addEventListener('click', () => {
    tabs.forEach(x => x.classList.toggle('is-active', x === b));
    panes.forEach(p => p.style.display = p.dataset.tab === b.dataset.tab ? '' : 'none');
  }));

  // ---------- Service chips toggle ----------
  document.querySelectorAll('.service-chips .chip').forEach(c => {
    c.addEventListener('click', () => c.classList.toggle('is-on'));
  });

  // ---------- Gallery filter ----------
  const gf = document.querySelectorAll('.gallery-filter button');
  gf.forEach(b => b.addEventListener('click', () => {
    gf.forEach(x => x.classList.toggle('is-active', x === b));
    const k = b.dataset.filter;
    document.querySelectorAll('.gitem').forEach(g => {
      g.classList.toggle('is-hidden', k !== 'all' && g.dataset.cat !== k);
    });
  }));

  // ---------- Gallery lightbox ----------
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gitem').forEach(g => {
    g.addEventListener('click', () => {
      lbImg.src = g.querySelector('img').src;
      lb.classList.add('is-open');
    });
  });
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) lb.classList.remove('is-open');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-open'); });

  // ---------- Reviews marquee ----------
  function renderReviews(reviews) {
    const track = document.getElementById('review-track');
    if (!track) return;
    const visible = reviews.filter(r => r.visible !== false);
    if (!visible.length) return;
    const card = r => {
      const initials = esc((r.name || '').split(' ').map(w => w[0]).slice(0, 2).join(''));
      const stars = '★'.repeat(Math.min(5, r.rating || 5));
      return `<div class="review-card">
        <div class="stars">${stars}</div>
        <blockquote>${esc(r.quote)}</blockquote>
        <div class="who">
          <div class="avi">${initials}</div>
          <div><strong>${esc(r.name)}</strong><span>${esc(r.role || '')}</span></div>
        </div>
      </div>`;
    };
    const html = visible.map(card).join('');
    track.innerHTML = html + html;
  }

  // ---------- Completed projects (layered stack) ----------
  // Replaces the static fallback cards in #layered-stack .ls-grid with rows
  // from Supabase, then re-runs the stack/spread/filter/lightbox wiring in
  // ui.js. If Supabase has no visible rows (or isn't reachable), the static
  // fallback markup already shipped in index.html stays untouched.
  function renderProjects(rows) {
    const grid = document.querySelector('#layered-stack .ls-grid');
    if (!grid) return;
    const emptyEl = document.getElementById('pp-empty');
    const visible = rows.filter(p => p.visible !== false);
    if (!visible.length) {
      if (emptyEl) emptyEl.style.display = '';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    grid.innerHTML = visible.map(p => {
      const images = Array.isArray(p.images) ? p.images : [];
      const caption = [p.location, p.year].filter(Boolean).join(' · ') || p.category || '';
      return `<div class="ls-item" data-cat="${esc(p.category)}" data-title="${esc(p.title)}" data-location="${esc(p.location || '')}" data-year="${esc(p.year || '')}" data-desc="${esc(p.description || '')}" data-images='${esc(JSON.stringify(images))}'>
        <img src="${esc(p.cover_image)}" alt="${esc(p.title)}" loading="lazy"/>
        <span>${esc(caption)}</span>
      </div>`;
    }).join('');
    if (window.initLayeredStack) window.initLayeredStack();
  }

  (async () => {
    const _cfg = window.RM_AUTH_CONFIG || {};
    if (_cfg.supabaseUrl && _cfg.supabaseAnonKey && window.supabase) {
      const _sb = window.supabase.createClient(_cfg.supabaseUrl, _cfg.supabaseAnonKey);
      // The homepage teaser caps to the newest N via #layered-stack[data-limit];
      // projects.html leaves data-limit unset and gets every visible project.
      const limitAttr = document.querySelector('#layered-stack')?.dataset.limit;
      const limit = limitAttr ? parseInt(limitAttr, 10) : null;
      let projectsQuery = _sb.from('projects').select('*').order('created_at', { ascending: false });
      if (limit) projectsQuery = projectsQuery.limit(limit);
      const [{ data: reviews, error: reviewsErr }, { data: projects, error: projectsErr }] = await Promise.all([
        _sb.from('reviews').select('*').order('created_at'),
        projectsQuery
      ]);
      if (!reviewsErr && reviews && reviews.length) renderReviews(reviews);
      if (!projectsErr && projects) renderProjects(projects);
    }
  })();

  // ---------- Mobile nav ----------
  const burger  = document.getElementById('nav-burger');
  const overlay = document.getElementById('mobile-nav-overlay');
  const drawer  = document.getElementById('mobile-nav-drawer');
  const navClose = document.getElementById('mobile-nav-close');
  function openMobileNav() {
    burger.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('is-open'); drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('is-open'); drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  }
  burger.addEventListener('click', () => burger.classList.contains('is-open') ? closeMobileNav() : openMobileNav());
  navClose.addEventListener('click', closeMobileNav);
  overlay.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav-link').forEach(a => a.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMobileNav(); lb.classList.remove('is-open'); } });

});
