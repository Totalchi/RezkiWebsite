/* ============================================================
   RM Bygg & Montage AB — Security Service
   - Input sanitization (nooit user-data als HTML in DOM)
   - Form validatie met visuele feedback
   - Rate limiting (max 1 submit per 60 seconden)
   ============================================================ */

const SecurityService = {

  /* ----------------------------------------------------------
     Sanitizer — verander tekst naar veilige DOM-tekst
     Gebruik ALTIJD deze methode als je user-input in de DOM zet.
     Gebruik nooit innerHTML met user-input.
  ---------------------------------------------------------- */
  sanitize(str) {
    if (typeof str !== 'string') return '';
    const el = document.createElement('span');
    el.textContent = str;
    return el.textContent;
  },

  /* ----------------------------------------------------------
     Rate limiter — voorkomt form-spam
  ---------------------------------------------------------- */
  _lastSubmit: 0,
  COOLDOWN_MS: 60_000, // 60 seconden

  canSubmit() {
    const now     = Date.now();
    const elapsed = now - this._lastSubmit;
    if (elapsed < this.COOLDOWN_MS) {
      const remaining = Math.ceil((this.COOLDOWN_MS - elapsed) / 1000);
      return { allowed: false, remaining };
    }
    return { allowed: true };
  },

  recordSubmit() {
    this._lastSubmit = Date.now();
  },

  /* ----------------------------------------------------------
     Form validator
  ---------------------------------------------------------- */
  EMAIL_RE: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  PHONE_RE: /^[+\d][\d\s\-().]{5,19}$/,

  /* flsIdx verwijst naar de index in TRANSLATIONS[lang].fls (formulierlabels) */
  _rules: [
    { selector: '#first-name',     flsIdx: 0, required: true,  minLen: 2 },
    { selector: '#last-name',      flsIdx: 1, required: true,  minLen: 2 },
    { selector: '#email',          flsIdx: 2, required: true },
    { selector: '#phone',          flsIdx: 3, required: false },
    { selector: '#customer-type',  flsIdx: 4, required: true,  notDefault: true },
    { selector: '#service-select', flsIdx: 5, required: true,  notDefault: true },
    { selector: '#message',        flsIdx: 7, required: true,  minLen: 10 },
  ],

  /* Haal het vertaalde veld-label op */
  _getLabel(rule) {
    const lang = (typeof LanguageService !== 'undefined') ? LanguageService.current : 'en';
    const fls  = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang]?.fls : null;
    return (fls && rule.flsIdx !== undefined) ? fls[rule.flsIdx] : '';
  },

  /* Haal een vertaald foutbericht op en vul placeholders in */
  _msg(key, data = {}) {
    const lang = (typeof LanguageService !== 'undefined') ? LanguageService.current : 'en';
    const msgs = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang]?.errMsgs : null;
    const fb   = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS.en?.errMsgs   : null;
    const tpl  = (msgs && msgs[key]) || (fb && fb[key]) || key;
    return tpl.replace(/\{(\w+)\}/g, (_, k) => (data[k] !== undefined ? data[k] : `{${k}}`));
  },

  validateForm() {
    let valid = true;

    this._rules.forEach(rule => {
      const el = document.querySelector(rule.selector);
      if (!el) return; // veld staat niet op deze pagina

      const val   = el.value.trim();
      const label = this._getLabel(rule);

      // Verplicht veld
      if (rule.required && val === '') {
        this._showError(el, this._msg('required', { label }));
        valid = false;
        return;
      }

      // Minimale lengte
      if (rule.minLen && val.length > 0 && val.length < rule.minLen) {
        this._showError(el, this._msg('minLen', { label, n: rule.minLen }));
        valid = false;
        return;
      }

      // E-mailformaat
      if (el.type === 'email' && val !== '' && !this.EMAIL_RE.test(val)) {
        this._showError(el, this._msg('email'));
        valid = false;
        return;
      }

      // Telefoonformaat (alleen als ingevuld)
      if (el.type === 'tel' && val !== '' && !this.PHONE_RE.test(val)) {
        this._showError(el, this._msg('phone'));
        valid = false;
        return;
      }

      // Select: mag niet de placeholder-optie zijn (index 0)
      // selectedIndex === 0 werkt correct voor zowel EN ("Select...") als SV ("Välj...")
      if (rule.notDefault && el.tagName === 'SELECT' && el.selectedIndex === 0) {
        this._showError(el, this._msg('select', { label: label.toLowerCase() }));
        valid = false;
        return;
      }

      // Veld is geldig
      this._clearError(el);
    });

    return valid;
  },

  clearAllErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    document.querySelectorAll('.is-invalid').forEach(e => e.classList.remove('is-invalid'));
  },

  _showError(input, message) {
    this._clearError(input);
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    const err = document.createElement('span');
    err.className   = 'field-error';
    err.role        = 'alert';
    // textContent — NOOIT innerHTML met user-data
    err.textContent = this.sanitize(message);

    // Voeg foutmelding in na het invoerveld (of na select/textarea)
    input.insertAdjacentElement('afterend', err);
  },

  _clearError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    const err = input.parentNode.querySelector('.field-error');
    if (err) err.remove();
  },

  /* ----------------------------------------------------------
     Live validatie: verwijder fout zodra gebruiker corrigeert
  ---------------------------------------------------------- */
  initLiveValidation() {
    const form = document.querySelector('#form-content');
    if (!form) return;

    form.addEventListener('input', e => {
      const el = e.target;
      if (el.classList.contains('is-invalid') && el.value.trim() !== '') {
        this._clearError(el);
      }
    });

    form.addEventListener('change', e => {
      const el = e.target;
      if (el.tagName === 'SELECT' && el.classList.contains('is-invalid')) {
        this._clearError(el);
      }
    });
  },

  init() {
    if (!document.querySelector('.booking-form')) return;
    this.initLiveValidation();
  },
};
