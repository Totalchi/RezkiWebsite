/* ============================================================
   RM Bygg & Montage AB — Scroll Animations & Counters
   ============================================================ */

const AnimationService = {
  init() {
    this._initReveal();
    this._initCounters();
  },

  _initReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        observer.unobserve(e.target); // één keer zichtbaar = stop observeren
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  },

  _initCounters() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;

        const el     = e.target;
        const target = +el.dataset.count;
        /* data-suffix op het element overschrijft de standaard '+' */
        const suffix = el.dataset.suffix || '+';
        let current  = 0;
        const step   = target / 60;

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);

        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  },
};
