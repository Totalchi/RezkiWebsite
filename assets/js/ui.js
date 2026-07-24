/* ==========================================================
   RM Bygg & Montage AB — UI & scroll effects
   Nav scroll, reveal-on-scroll, hero video, layered stack, counters, etc.
   ========================================================== */

/* ---------- Layered Stack ----------
   Exposed as window.initLayeredStack() so it can be re-run after
   interactions.js swaps in project cards loaded from Supabase. */
(function () {
  let lsWrapper, lsFilter, grid;
  let items = [], ROTS = [], isSpread = false, bound = false;

  function visibleItems() { return items.filter(i => !i.classList.contains('ls-hidden')); }

  function stackItems() {
    isSpread = false;
    lsWrapper.classList.remove('is-spread');
    const cw = grid.offsetWidth;
    const ch = grid.offsetHeight;
    items.forEach((item, i) => {
      if (item.classList.contains('ls-hidden')) {
        item.style.transform = 'translate(-9999px, 0)';
        item.style.zIndex = '';
        return;
      }
      const dx = cw / 2 - (item.offsetLeft + item.offsetWidth  / 2);
      const dy = ch / 2 - (item.offsetTop  + item.offsetHeight / 2);
      item.style.transitionDelay = '0ms';
      item.style.transform = `translate(${dx}px,${dy}px) rotate(${ROTS[i]}deg)`;
      item.style.zIndex = i;
    });
  }

  function spreadItems() {
    isSpread = true;
    lsWrapper.classList.add('is-spread');
    const vis = visibleItems();
    vis.forEach((item, i) => {
      item.style.transitionDelay = `${i * 45}ms`;
      item.style.transform = 'translate(0,0) rotate(0deg)';
      item.style.zIndex = '';
    });
    setTimeout(() => vis.forEach(el => el.style.transitionDelay = ''), 800);
  }

  // Populate + open the shared #lightbox as a project detail card
  // (title, location, year, description, extra photos as thumbnails).
  function openProjectLightbox(item) {
    const lb    = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    if (!lb || !lbImg) return;

    const cover = item.querySelector('img').src;
    let extra = [];
    try { extra = JSON.parse(item.dataset.images || '[]'); } catch (e) { /* ignore malformed data */ }
    const gallery = [cover, ...extra.filter(Boolean)];
    lbImg.src = cover;

    const tagEl    = document.getElementById('lightbox-tag');
    const titleEl  = document.getElementById('lightbox-title');
    const metaEl   = document.getElementById('lightbox-meta');
    const descEl   = document.getElementById('lightbox-desc');
    const thumbsEl = document.getElementById('lightbox-thumbs');

    const catBtn = lsFilter && item.dataset.cat
      ? lsFilter.querySelector(`[data-ls-filter="${item.dataset.cat}"]`)
      : null;
    if (tagEl)   tagEl.textContent   = catBtn ? catBtn.textContent : (item.dataset.cat || '');
    if (titleEl) titleEl.textContent = item.dataset.title || '';
    if (metaEl)  metaEl.textContent  = [item.dataset.location, item.dataset.year].filter(Boolean).join(' · ');
    if (descEl)  descEl.textContent  = item.dataset.desc || '';

    if (thumbsEl) {
      thumbsEl.innerHTML = gallery.length > 1
        ? gallery.map((src, i) => `<img src="${src}" class="${i === 0 ? 'is-active' : ''}"/>`).join('')
        : '';
      thumbsEl.querySelectorAll('img').forEach(t => {
        t.addEventListener('click', () => {
          thumbsEl.querySelectorAll('img').forEach(x => x.classList.remove('is-active'));
          t.classList.add('is-active');
          lbImg.src = t.src;
        });
      });
    }

    lb.classList.add('is-open');
  }

  function bindItemEvents() {
    items.forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        if (!isSpread) { spreadItems(); return; }
        if (item.classList.contains('ls-hidden')) return;
        openProjectLightbox(item);
      });
    });
  }

  function initLayeredStack() {
    lsWrapper = document.getElementById('layered-stack');
    lsFilter  = document.getElementById('ls-filter');
    if (!lsWrapper) return;

    // Re-query every call: interactions.js may have just replaced the
    // grid's innerHTML with fresh project cards from Supabase.
    grid  = lsWrapper.querySelector('.ls-grid');
    items = [...lsWrapper.querySelectorAll('.ls-item')];
    ROTS  = items.map(() => (Math.random() * 22 - 11).toFixed(2));
    isSpread = false;
    bindItemEvents();

    requestAnimationFrame(() => requestAnimationFrame(stackItems));

    // Wrapper/filter-level listeners stay bound to the outer `items`/`grid`
    // variables above, so they only need to be attached once — later calls
    // to initLayeredStack() just refresh what those variables point to.
    if (!bound) {
      bound = true;
      lsWrapper.addEventListener('mouseenter', () => { if (!isSpread) spreadItems(); });
      lsWrapper.addEventListener('mouseleave', () => { if (isSpread)  stackItems();  });

      lsWrapper.addEventListener('click', e => {
        if (e.target === lsWrapper || e.target === grid) {
          isSpread ? stackItems() : spreadItems();
        }
      });

      if (lsFilter) {
        lsFilter.querySelectorAll('[data-ls-filter]').forEach(btn => {
          btn.addEventListener('click', () => {
            lsFilter.querySelectorAll('[data-ls-filter]').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const cat = btn.dataset.lsFilter;
            items.forEach(item => {
              if (cat === 'all' || item.dataset.cat === cat) item.classList.remove('ls-hidden');
              else item.classList.add('ls-hidden');
            });
            stackItems(); // re-stack with new visible set
          });
        });
      }
    }
  }

  window.initLayeredStack = initLayeredStack;
  document.addEventListener('DOMContentLoaded', initLayeredStack);
})();

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Nav scroll ----------
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      requestAnimationFrame(() => el.classList.add('is-in'));
    } else {
      io.observe(el);
    }
  });

  // ---------- Hero video ----------
  const heroEl    = document.querySelector('.hero');
  const heroVideo = document.getElementById('hero-video');
  function disableHeroVideo() { if (heroEl) heroEl.classList.add('no-video'); }
  if (heroVideo) {
    heroVideo.loop = false; heroVideo.muted = true; heroVideo.removeAttribute('controls');
    const showHeroVideo = () => {
      heroVideo.classList.add('is-ready');
      if (heroEl) heroEl.classList.add('video-ready');
    };
    heroVideo.addEventListener('loadeddata', showHeroVideo, { once: true });
    heroVideo.addEventListener('canplay',    showHeroVideo, { once: true });
    if (heroVideo.readyState >= 2) showHeroVideo();
    heroVideo.addEventListener('ended', () => { heroVideo.pause(); heroVideo.style.opacity = '1'; }, { once: true });
    heroVideo.play().catch(disableHeroVideo);
    heroVideo.addEventListener('error', disableHeroVideo);
  } else {
    disableHeroVideo();
  }

  // ---------- Scroll progress ----------
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    progressBar.style.width = (scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ---------- Back-to-top ----------
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => backTop.classList.toggle('is-visible', window.scrollY > 600), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- Active section in nav ----------
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  function updateActiveSection() {
    const mid = window.innerHeight / 2;
    let closest = null, minDist = Infinity;
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < minDist) { minDist = dist; closest = s; }
    });
    if (closest) navAs.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + closest.id));
  }
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // ---------- Animated stat counters ----------
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0');
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * ease).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  // ---------- Spotlight cursor tracking ----------
  document.querySelectorAll('.svc-card, .tc, .promise-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

});
