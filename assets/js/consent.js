/* ==========================================================
   RM Bygg & Montage AB — consent, promo & analytics
   GDPR cookie bar, promo popup and anonymous analytics tracking.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- GDPR bar ----------
  let _rmTrack = null; // set later by analytics block, used here for geo

  function requestGeoLocation() {
    if (!navigator.geolocation || !_rmTrack) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
        headers: { 'User-Agent': 'RMByggAnalytics/1.0' }
      })
        .then(r => r.json())
        .then(geo => {
          const addr = geo.address || {};
          const city   = addr.city || addr.town || addr.village || addr.suburb || null;
          const region = addr.state || null;
          const country = (addr.country_code || '').toUpperCase() || null;
          _rmTrack('geo', null, null, { city, region, country, latitude, longitude });
        })
        .catch(() => _rmTrack('geo', null, null, { latitude, longitude, country: 'SE' }));
    }, () => {}); // permission denied — silently ignore
  }

  const complianceBar = document.getElementById('compliance-bar');
  const complianceOk  = document.getElementById('compliance-ok');
  const cookiesAlreadyOk = localStorage.getItem('rm-cookies') === 'ok';
  if (cookiesAlreadyOk) complianceBar.classList.add('is-hidden');
  complianceOk.addEventListener('click', () => {
    localStorage.setItem('rm-cookies', 'ok');
    complianceBar.classList.add('is-hidden');
    // schedulePromo is only defined when the promo hasn't been shown yet.
    if (typeof schedulePromo === 'function') schedulePromo();
    requestGeoLocation();
  });

  // ---------- Promo popup ----------
  const PROMO_KEY    = 'rm_promo_v1';
  const promoOverlay = document.getElementById('promo-overlay');
  if (promoOverlay && !localStorage.getItem(PROMO_KEY)) {
    const closePromo = () => promoOverlay.classList.remove('is-open');

    document.getElementById('promo-close').addEventListener('click', closePromo);
    promoOverlay.addEventListener('click', e => { if (e.target === promoOverlay) closePromo(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePromo(); });

    document.getElementById('promo-cta').addEventListener('click', () => {
      closePromo();
      const contact = document.getElementById('contact');
      if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const bookTab = document.querySelector('.tab-btn[data-tab="book"]');
          if (bookTab && !bookTab.classList.contains('is-active')) bookTab.click();
        }, 600);
      }
    });

    function schedulePromo() {
      if (localStorage.getItem(PROMO_KEY)) return;
      setTimeout(() => {
        localStorage.setItem(PROMO_KEY, '1');
        promoOverlay.classList.add('is-open');
      }, 25000);
    }

    // Only start timer if cookies already accepted; otherwise wait for acceptance
    if (cookiesAlreadyOk) schedulePromo();
  }

  // ---------- Analytics tracking (anonymous, no personal data) ----------
  const _cfg = window.RM_AUTH_CONFIG || {};
  if (_cfg.supabaseUrl && _cfg.supabaseAnonKey) {
    const _sid = sessionStorage.getItem('rm_sid') || (() => {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('rm_sid', id);
      return id;
    })();
    const _dev  = window.innerWidth < 768 ? 'mobile' : 'desktop';
    const _lang = localStorage.getItem('rm-lang') || 'sv';

    function _track(type, label, value, extra) {
      const body = { session_id: _sid, event_type: type, device: _dev, lang: _lang, ...(extra || {}) };
      if (label != null) body.label = String(label).slice(0, 60);
      if (value  != null) body.value = value;
      fetch(_cfg.supabaseUrl + '/rest/v1/analytics_events', {
        method: 'POST',
        headers: {
          'apikey': _cfg.supabaseAnonKey,
          'Authorization': 'Bearer ' + _cfg.supabaseAnonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body)
      }).catch(() => {});
    }
    _rmTrack = _track;

    // Page view with geolocation (3s timeout fallback)
    {
      const ctrl = new AbortController();
      const tId  = setTimeout(() => ctrl.abort(), 3000);
      fetch('https://ipapi.co/json/', { signal: ctrl.signal })
        .then(r => r.json())
        .then(geo => {
          clearTimeout(tId);
          _track('pageview', null, null, {
            city:      geo.city      || null,
            region:    geo.region    || null,
            country:   geo.country_code || null,
            latitude:  geo.latitude  || null,
            longitude: geo.longitude || null
          });
        })
        .catch(() => _track('pageview'));
    }

    // Section visibility + track current section for heartbeat
    let _liveSection = 'Hero';
    const _secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const label = { home:'Hero', services:'Services', promise:'Promise', process:'Process', projects:'Gallery', reviews:'Reviews', contact:'Contact' }[e.target.id] || e.target.id;
          _track('section', label);
          _liveSection = label;
          _secObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('section[id]').forEach(s => _secObs.observe(s));

    // Heartbeat every 30s — keeps session "live" in admin dashboard
    setInterval(() => _track('heartbeat', _liveSection), 30000);

    // Click tracking
    document.addEventListener('click', e => {
      const el = e.target.closest('.btn-primary, .btn-ghost, .nav-cta, .whatsapp-btn, .tab-btn, .gallery-filter button, [data-lang], .svc-foot .learn');
      if (!el) return;
      const label = (el.dataset.i18n && el.dataset.i18n.replace(/\./g, ' ')) ||
                    el.textContent.trim().slice(0, 50) ||
                    el.getAttribute('aria-label') || 'btn';
      _track('click', label);
    }, { passive: true });

    // Time on page
    const _t0 = Date.now();
    const _sendDur = () => {
      const sec = Math.round((Date.now() - _t0) / 1000);
      if (sec >= 3) _track('duration', null, sec);
    };
    document.addEventListener('visibilitychange', () => { if (document.hidden) _sendDur(); });
    window.addEventListener('beforeunload', _sendDur);
  }
});
