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

  // ---------- Floating tags ----------
  setTimeout(() => document.querySelectorAll('.hero-floating').forEach(el => el.classList.add('is-in')), 900);

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
    byId('btn-quote').textContent = L.btn_quote;
    byId('btn-book').textContent = L.btn_book;
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

  // ---------- Init 3D scenes ----------
  if (window.RMScenes) window.RMScenes.init();
});
