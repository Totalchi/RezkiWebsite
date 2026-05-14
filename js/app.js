/* ==========================================================
   RM Bygg & Montage AB — app logic
   ========================================================== */

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
      // already in view at load — reveal immediately
      requestAnimationFrame(() => el.classList.add('is-in'));
    } else {
      io.observe(el);
    }
  });

  // (hero-floating elements removed — no action needed)

  // ---------- Language toggle (light: swaps a few labels) ----------
  const LANGS = {
    en: {
      eyebrow_badge: 'Local • Trusted • Gothenburg',
      h1_line1: 'Your neighbourhood',
      h1_line2_a: 'builder with',
      h1_em: 'heart',
      h1_line2_b: '',
      hero_sub: 'From solar panels on the roof to a freshly painted façade — built with precision, honesty, and a personal promise you\'ll feel from the first handshake.',
      btn_quote: 'Request a Quote',
      btn_book: 'Book Site Visit',
      nav: ['Services', 'Promise', 'Process', 'Projects', 'Reviews', 'Contact'],
    },
    sv: {
      eyebrow_badge: 'Lokal • Pålitlig • Göteborg',
      h1_line1: 'Din lokala',
      h1_line2_a: 'byggare med',
      h1_em: 'hjärta',
      h1_line2_b: '',
      hero_sub: 'Från solceller på taket till en nymålad fasad — byggt med precision, ärlighet och ett personligt löfte du känner från första handslaget.',
      btn_quote: 'Begär offert',
      btn_book: 'Boka besök',
      nav: ['Tjänster', 'Vårt löfte', 'Process', 'Projekt', 'Omdömen', 'Kontakt'],
    }
  };
  const langBtns = document.querySelectorAll('[data-lang]');
  function applyLang(l) {
    const L = LANGS[l];
    if (!L) return;
    const byId = (id) => document.getElementById(id);
    byId('h1-line1').textContent = L.h1_line1;
    byId('h1-line2-a').textContent = L.h1_line2_a;
    byId('h1-em').textContent = L.h1_em;
    byId('h1-line2-b').textContent = L.h1_line2_b;
    byId('hero-sub').textContent = L.hero_sub;
    // Bug fix: use text-only span to preserve the SVG arrow inside btn-quote
    const qText = byId('btn-quote-text') || byId('btn-quote');
    qText.textContent = L.btn_quote;
    byId('btn-book').textContent = L.btn_book;
    // Bug fix: eyebrow badge was never updated on lang switch
    const badge = byId('eyebrow-badge');
    if (badge && L.eyebrow_badge) badge.textContent = L.eyebrow_badge;
    const navLis = document.querySelectorAll('.nav-links a');
    L.nav.forEach((t, i) => { if (navLis[i]) navLis[i].textContent = t; });
    langBtns.forEach(b => b.classList.toggle('is-active', b.dataset.lang === l));
    localStorage.setItem('rm-lang', l);
  }
  langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(localStorage.getItem('rm-lang') || 'en');

  // ---------- Tabs (quote vs book vs invoice) ----------
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
      g.style.display = (k === 'all' || g.dataset.cat === k) ? '' : 'none';
    });
  }));

  // ---------- Gallery lightbox ----------
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gitem').forEach(g => {
    g.addEventListener('click', () => {
      const src = g.querySelector('img').src;
      lbImg.src = src;
      lb.classList.add('is-open');
    });
  });
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) lb.classList.remove('is-open');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-open'); });

  // ---------- Calendar ----------
  const calRoot = document.getElementById('calendar');
  if (calRoot) {
    let view = new Date();
    view.setDate(1);
    let selected = null;
    let slot = null;
    const monthEl = calRoot.querySelector('.cal-month');
    const gridEl = calRoot.querySelector('.cal-grid');
    const slotsEl = document.getElementById('slots');
    const slotsLabel = document.getElementById('slots-label');

    // deterministic "busy" days — pretend these are booked
    function busyDays(year, month) {
      const seed = year * 12 + month;
      const days = [];
      for (let i = 0; i < 4; i++) {
        days.push(((seed * 7 + i * 11) % 26) + 3);
      }
      return new Set(days);
    }

    function render() {
      const y = view.getFullYear();
      const m = view.getMonth();
      const mn = view.toLocaleString('default', { month: 'long' });
      monthEl.textContent = `${mn} ${y}`;
      gridEl.innerHTML = '';
      const firstDow = (new Date(y, m, 1).getDay() + 6) % 7; // Mon=0
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const busy = busyDays(y, m);
      const today = new Date(); today.setHours(0,0,0,0);
      for (let i = 0; i < firstDow; i++) {
        const c = document.createElement('div'); c.className = 'cal-cell is-off'; gridEl.appendChild(c);
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const c = document.createElement('div');
        c.className = 'cal-cell';
        c.textContent = d;
        const dt = new Date(y, m, d);
        if (dt < today) c.classList.add('is-past');
        // no weekends for visits
        const dow = dt.getDay();
        if (dow === 0 || dow === 6) c.classList.add('is-off');
        if (dt.toDateString() === today.toDateString()) c.classList.add('is-today');
        if (busy.has(d)) c.classList.add('is-busy');
        if (selected && dt.toDateString() === selected.toDateString()) c.classList.add('is-sel');
        c.addEventListener('click', () => {
          if (c.classList.contains('is-off') || c.classList.contains('is-past')) return;
          selected = new Date(y, m, d);
          slot = null;
          render();
          renderSlots();
        });
        gridEl.appendChild(c);
      }
    }
    function renderSlots() {
      if (!selected) { slotsEl.innerHTML = ''; slotsLabel.textContent = 'Select a date first'; return; }
      slotsLabel.textContent = `Available times — ${selected.toDateString()}`;
      const times = ['07:30', '09:00', '10:30', '13:00', '14:30', '16:00'];
      // deterministic "busy" slots
      const seed = selected.getDate() * 7 + selected.getMonth() * 13;
      const busySlots = new Set([times[(seed + 1) % times.length], times[(seed + 4) % times.length]]);
      slotsEl.innerHTML = '';
      times.forEach(tm => {
        const s = document.createElement('div');
        s.className = 'slot';
        s.textContent = tm;
        if (busySlots.has(tm)) s.classList.add('is-busy');
        if (slot === tm) s.classList.add('is-sel');
        s.addEventListener('click', () => {
          if (s.classList.contains('is-busy')) return;
          slot = tm;
          renderSlots();
          document.getElementById('booking-selection').textContent =
            `${selected.toDateString()} · ${slot}`;
        });
        slotsEl.appendChild(s);
      });
    }

    calRoot.querySelector('.cal-prev').addEventListener('click', () => {
      view.setMonth(view.getMonth() - 1); render();
    });
    calRoot.querySelector('.cal-next').addEventListener('click', () => {
      view.setMonth(view.getMonth() + 1); render();
    });
    render();
    renderSlots();
  }

  // ---------- Form submit (demo) ----------
  document.querySelectorAll('form.rm-form').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const card = f.closest('.form-card');
      const pane = f.parentElement;
      const success = pane.querySelector('.success');
      f.style.display = 'none';
      success.style.display = 'block';
    });
  });

  // ---------- Login / auth modal ----------
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const authMessage = document.getElementById('auth-message');
  const authSubmitText = document.getElementById('auth-submit-text');
  const authNameField = document.querySelector('.auth-name-field');
  const authPassword = document.getElementById('auth-password');
  const authOpenBtns = document.querySelectorAll('[data-auth-open]');
  const authCloseBtns = document.querySelectorAll('[data-auth-close]');
  const authModeBtns = document.querySelectorAll('[data-auth-mode]');
  const authConfig = window.RM_AUTH_CONFIG || {};
  const authReady = Boolean(authConfig.supabaseUrl && authConfig.supabaseAnonKey && window.supabase);
  const authClient = authReady
    ? window.supabase.createClient(authConfig.supabaseUrl, authConfig.supabaseAnonKey)
    : null;
  let authMode = 'signin';

  function setAuthMessage(text) {
    if (authMessage) authMessage.textContent = text || '';
  }

  function setAuthMode(mode) {
    authMode = mode;
    authModeBtns.forEach(btn => btn.classList.toggle('is-active', btn.dataset.authMode === mode));
    if (authNameField) authNameField.hidden = mode !== 'signup';
    if (authPassword) authPassword.setAttribute('autocomplete', mode === 'signin' ? 'current-password' : 'new-password');
    if (authSubmitText) authSubmitText.textContent = mode === 'signin' ? 'Login' : 'Create account';
    setAuthMessage('');
  }

  function openAuth() {
    if (!authModal) return;
    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!authReady) {
      setAuthMessage('Login is added. Add your Supabase URL and anon key in RM_AUTH_CONFIG to activate it.');
    }
  }

  function closeAuth() {
    if (!authModal) return;
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  authOpenBtns.forEach(btn => btn.addEventListener('click', openAuth));
  authCloseBtns.forEach(btn => btn.addEventListener('click', closeAuth));
  authModeBtns.forEach(btn => btn.addEventListener('click', () => setAuthMode(btn.dataset.authMode)));

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setAuthMessage('');
      if (!authClient) {
        setAuthMessage('Login is not connected yet. Configure Supabase in RM_AUTH_CONFIG.');
        return;
      }

      const formData = new FormData(authForm);
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');
      const name = String(formData.get('name') || '');

      const result = authMode === 'signup'
        ? await authClient.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
          })
        : await authClient.auth.signInWithPassword({ email, password });

      if (result.error) {
        setAuthMessage(result.error.message);
        return;
      }

      setAuthMessage(authMode === 'signup'
        ? 'Account created. Check your email if confirmation is required.'
        : 'Logged in successfully.');
      setTimeout(closeAuth, 900);
    });
  }

  if (authClient) {
    authClient.auth.getSession().then(({ data }) => {
      const loggedIn = Boolean(data.session);
      authOpenBtns.forEach(btn => {
        const label = btn.querySelector('span') || btn;
        label.textContent = loggedIn ? 'Account' : 'Login';
      });
    });
  }

  // ---------- Init 3D scenes ----------
  if (window.RMScenes) window.RMScenes.init();

  // ---------- Hero video ----------
  const heroEl    = document.querySelector('.hero');
  const heroVideo = document.getElementById('hero-video');

  function disableHeroVideo() {
    if (heroEl) heroEl.classList.add('no-video');
  }

  if (heroVideo) {
    heroVideo.loop = false;
    heroVideo.muted = true;
    heroVideo.removeAttribute('controls');

    const showHeroVideo = () => {
      heroVideo.classList.add('is-ready');
      if (heroEl) heroEl.classList.add('video-ready');
    };

    heroVideo.addEventListener('loadeddata', showHeroVideo, { once: true });
    heroVideo.addEventListener('canplay', showHeroVideo, { once: true });
    if (heroVideo.readyState >= 2) showHeroVideo();

    heroVideo.addEventListener('ended', () => {
      heroVideo.pause();
      heroVideo.style.opacity = '1';
    }, { once: true });

    heroVideo.play().catch(disableHeroVideo);
    heroVideo.addEventListener('error', disableHeroVideo);
  } else {
    disableHeroVideo();
  }

  // ---------- Scroll progress bar ----------
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ---------- Back-to-top ----------
  const backTop = document.getElementById('back-top');
  function updateBackTop() {
    backTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', updateBackTop, { passive: true });
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Mobile hamburger nav ----------
  const burger     = document.getElementById('nav-burger');
  const overlay    = document.getElementById('mobile-nav-overlay');
  const drawer     = document.getElementById('mobile-nav-drawer');
  const navClose   = document.getElementById('mobile-nav-close');

  function openMobileNav() {
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
  });
  navClose.addEventListener('click', closeMobileNav);
  overlay.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav-link').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // Mobile lang buttons are already captured by langBtns above — no extra listener needed

  // ---------- Active section highlighting in nav (viewport-centre approach, no flicker) ----------
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
    if (closest) {
      navAs.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + closest.id));
    }
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
      const value = (target * ease).toFixed(decimals);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ---------- Spotlight card — cursor-tracking radial glow on service cards ----------
  document.querySelectorAll('.svc-card, .tc, .promise-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // ---------- GDPR / compliance bar ----------
  const complianceBar = document.getElementById('compliance-bar');
  const complianceOk  = document.getElementById('compliance-ok');
  if (localStorage.getItem('rm-cookies') === 'ok') {
    complianceBar.classList.add('is-hidden');
  }
  complianceOk.addEventListener('click', () => {
    localStorage.setItem('rm-cookies', 'ok');
    complianceBar.classList.add('is-hidden');
  });
});
