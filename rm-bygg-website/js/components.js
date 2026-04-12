/* ============================================================
   RM Bygg & Montage AB — Shared Components
   Nav en footer worden hier gedefinieerd en in elke pagina
   geïnjecteerd. Wijzig nav/footer hier — nergens anders.

   SECURITY: geen inline onclick-attributen — event listeners
   worden na injectie toegevoegd zodat de CSP niet geschonden wordt.
   ============================================================ */

const NAV_HTML = `
<div class="cursor"      id="cursor"></div>
<div class="cursor-ring" id="cursor-ring"></div>

<nav id="navbar">
  <a href="index.html" class="logo-img">
    <img src="images/logo.png" alt="RM Bygg &amp; Montage AB" class="logo-image"/>
    <span class="logo-name">RM <span class="logo-name-sub">Bygg &amp; Montage</span></span>
  </a>

  <ul class="nav-links">
    <li><a href="services.html"     data-page="services"     data-i18n="nav.0">Services</a></li>
    <li><a href="about.html"        data-page="about"        data-i18n="nav.1">About</a></li>
    <li><a href="projects.html"     data-page="projects"     data-i18n="nav.2">Projects</a></li>
    <li><a href="testimonials.html" data-page="testimonials" data-i18n="nav.3">Reviews</a></li>
    <li><a href="contact.html"      data-page="contact"      class="nav-cta" data-i18n="nav.4">Book Now</a></li>
  </ul>

  <div class="nav-controls">
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
      <span class="toggle-icons">
        <span aria-hidden="true">&#127769;</span>
        <span aria-hidden="true">&#9728;&#65039;</span>
      </span>
    </button>
    <div class="lang-toggle" role="group" aria-label="Language">
      <button class="lang-btn active" id="langEN" data-lang="en" aria-pressed="true">EN</button>
      <button class="lang-btn"        id="langSV" data-lang="sv" aria-pressed="false">SV</button>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
  </div>
</nav>
`;

const FOOTER_HTML = `
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <a href="index.html" class="logo-img">
        <img src="images/logo.png" alt="RM Bygg &amp; Montage AB" class="logo-image"/>
        <span class="logo-name">RM <span class="logo-name-sub">Bygg &amp; Montage</span></span>
      </a>
      <p>Local craftsmanship, personal service, and a direct line to the team doing the work. We build trust with every project.</p>
    </div>

    <div class="footer-col">
      <h5 data-i18n="fc.s">Services</h5>
      <ul>
        <li><a href="services.html" data-i18n="fc.c1.0">Solar Panels</a></li>
        <li><a href="services.html" data-i18n="fc.c1.1">Energy Storage</a></li>
        <li><a href="services.html" data-i18n="fc.c1.2">EV Chargers</a></li>
        <li><a href="services.html" data-i18n="fc.c1.3">Windows</a></li>
        <li><a href="services.html" data-i18n="fc.c1.4">Roofing</a></li>
        <li><a href="services.html" data-i18n="fc.c1.5">Exterior Painting</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h5 data-i18n="fc.c">Company</h5>
      <ul>
        <li><a href="about.html"        data-i18n="fc.c2.0">About Us</a></li>
        <li><a href="about.html"        data-i18n="fc.c2.1">Our Process</a></li>
        <li><a href="testimonials.html" data-i18n="fc.c2.2">Customer Reviews</a></li>
        <li><a href="projects.html"     data-i18n="fc.c2.3">Projects</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h5 data-i18n="fc.ct">Contact</h5>
      <ul>
        <li><a href="tel:+46700000000">+46 70 000 00 00</a></li>
        <li><a href="mailto:info@rmbygg.se">info@rmbygg.se</a></li>
        <li><a href="contact.html" data-i18n="fc.c3.0">Book a Meeting</a></li>
        <li><a href="contact.html" data-i18n="fc.c3.1">Request a Quote</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <span data-i18n="fc.copy">&copy; 2025 RM Bygg &amp; Montage AB. Org.nr: 556XXX-XXXX. All rights reserved.</span>
    <span data-i18n="fc.badge">F-tax certificate &middot; Liability Insurance &middot; ROT Approved</span>
  </div>
</footer>
`;

/* --- Injecteer in placeholders --- */
document.getElementById('nav-placeholder').innerHTML    = NAV_HTML;
document.getElementById('footer-placeholder').innerHTML = FOOTER_HTML;

/* --- Event listeners voor nav (GEEN inline onclick) --- */
/* Gebonden via DOMContentLoaded zodat nav.js (dat toggleMenu definieert)
   gegarandeerd al uitgevoerd is tegen de tijd dat de binding plaatsvindt. */
function attachNavListeners() {
  /* Taalwisseling */
  document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLang(lang);                          // gedefinieerd in i18n.js
      document.querySelectorAll('.lang-btn').forEach(b => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });

  /* Mobiel menu */
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu); // gedefinieerd in nav.js
  }
}
document.addEventListener('DOMContentLoaded', attachNavListeners);
