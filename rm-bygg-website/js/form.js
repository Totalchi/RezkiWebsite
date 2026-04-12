/* ============================================================
   RM Bygg & Montage AB — Contact / Booking Form
   SECURITY: geen inline onclick-attributen — alles via
   addEventListener zodat CSP (script-src 'self') niet
   geschonden wordt.
   ============================================================ */

const FormService = {
  init() {
    const form = document.querySelector('.booking-form');
    if (!form) return; // alleen op contact.html

    this._bindTabs(form);
    this._bindSubmit(form);
    this._bindReset(form);
  },

  _bindTabs(form) {
    form.querySelectorAll('.form-tab').forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        const types = ['booking', 'quote', 'invoice'];
        this.switchTab(types[idx]);
      });
    });
  },

  _bindSubmit(form) {
    const btn = form.querySelector('.form-submit');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.preventDefault();
      this.submitForm();
    });
  },

  _bindReset(form) {
    const btn = form.querySelector('.form-success .btn-primary');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.preventDefault();
      this.resetForm();
    });
  },

  switchTab(type) {
    const types  = ['booking', 'quote', 'invoice'];
    const tabIds = ['tab-booking', 'tab-quote', 'tab-invoice'];
    const panel  = document.getElementById('form-content');

    document.querySelectorAll('.form-tab').forEach((tab, i) => {
      const active = types[i] === type;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      /* sync aria-labelledby op het tabpanel met de actieve tab */
      if (active && panel) panel.setAttribute('aria-labelledby', tabIds[i]);
    });

    const dateGroup = document.getElementById('date-group');
    if (dateGroup) dateGroup.style.display = type === 'booking' ? '' : 'none';
  },

  async submitForm() {
    /* Rate limit check */
    const limit = SecurityService.canSubmit();
    if (!limit.allowed) {
      this._showRateLimitMessage(limit.remaining);
      return;
    }

    /* Valideer invoer */
    SecurityService.clearAllErrors();
    const valid = SecurityService.validateForm();
    if (!valid) return;

    /* Verzamel formulierdata */
    const payload = {
      firstName:     document.getElementById('first-name')?.value.trim(),
      lastName:      document.getElementById('last-name')?.value.trim(),
      email:         document.getElementById('email')?.value.trim(),
      phone:         document.getElementById('phone')?.value.trim() || undefined,
      customerType:  document.getElementById('customer-type')?.value,
      service:       document.getElementById('service-select')?.value,
      preferredDate: document.getElementById('pref-date')?.value || undefined,
      message:       document.getElementById('message')?.value.trim(),
    };

    /* Verstuur naar Formspree */
    const btn = document.querySelector('.form-submit');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(
        `https://formspree.io/f/${CONFIG.contact.formspreeId}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body:    JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      /* Succes — registreer rate-limit en toon bevestiging */
      SecurityService.recordSubmit();
      document.getElementById('form-content').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';

    } catch (_err) {
      /* Toon generieke foutmelding — laat geen interne details zien */
      this._showSubmitError();
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  resetForm() {
    document.getElementById('form-content').style.display = '';
    document.getElementById('form-success').style.display = 'none';
    SecurityService.clearAllErrors();

    /* Reset alle velden */
    document.querySelectorAll('#form-content input, #form-content select, #form-content textarea')
      .forEach(el => { el.value = ''; });

    /* Zet eerste tab actief */
    this.switchTab('booking');
  },

  _showRateLimitMessage(seconds) {
    const btn = document.querySelector('.form-submit');
    if (!btn) return;
    const orig = btn.textContent;
    /* SecurityService._msg() gebruikt de actieve taal */
    btn.textContent = SecurityService._msg('rateLimit', { n: seconds });
    btn.disabled    = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled    = false;
    }, 3000);
  },

  _showSubmitError() {
    const btn = document.querySelector('.form-submit');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = SecurityService._msg('submitErr');
    setTimeout(() => { btn.textContent = orig; }, 5000);
  },
};
