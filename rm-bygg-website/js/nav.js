/* ============================================================
   RM Bygg & Montage AB — Navigation
   ============================================================ */

const NavService = {
  init() {
    this._initTheme();
    this._initScroll();
    this._markActiveLink();
    this._initResponsiveMenu();
  },

  _initTheme() {
    const html   = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    try {
      if (localStorage.getItem('rmTheme') === 'light') {
        html.setAttribute('data-theme', 'light');
      }
    } catch (_) { /* private mode of verouderde browser */ }

    toggle.addEventListener('click', () => {
      const isLight = html.getAttribute('data-theme') === 'light';
      const next    = isLight ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('rmTheme', next); } catch (_) { /* private mode */ }
    });
  },

  _initScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    /* passive: true — geen preventDefault nodig op scroll, verbetert prestaties */
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  },

  /* Highlight the nav link matching the current page */
  _markActiveLink() {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    const page = file.replace('.html', '') || 'index';
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
      a.classList.toggle('nav-active', a.dataset.page === page);
    });
  },

  _initResponsiveMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.getElementById('menuToggle');
    if (!navLinks || !menuToggle) return;

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) {
        navLinks.style.cssText = '';
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 820) {
          navLinks.style.cssText = '';
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  },
};

/* Mobile menu — exposed globally for inline onclick */
function toggleMenu() {
  const nl         = document.querySelector('.nav-links');
  const menuToggle = document.getElementById('menuToggle');
  if (!nl) return;
  const open = nl.style.display === 'flex';

  if (open) {
    nl.style.cssText = '';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  } else {
    const theme = document.documentElement.getAttribute('data-theme');
    Object.assign(nl.style, {
      display:        'flex',
      position:       'fixed',
      top:            '76px',
      left:           '0',
      right:          '0',
      background:     theme === 'light'
        ? 'rgba(247,243,238,0.98)'
        : 'rgba(20,18,16,0.98)',
      flexDirection:  'column',
      alignItems:     'flex-start',
      padding:        '1.75rem 2rem',
      gap:            '1.3rem',
      borderBottom:   '1px solid rgba(196,180,154,0.3)',
      zIndex:         '999',
      justifyContent: 'flex-start',
      boxShadow:      '0 18px 30px rgba(43,32,23,0.12)',
    });
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }
}
