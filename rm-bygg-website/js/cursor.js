/* ============================================================
   RM Bygg & Montage AB — Custom Cursor
   ============================================================ */

const CursorService = {
  init() {
    const cur  = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cur || !ring) return; // elementen ontbreken — sla cursor-animatie over

    let mx = 0, my = 0, rx = 0, ry = 0;

    /* passive: true — geen preventDefault nodig op mousemove */
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    // Smooth trailing ring via rAF
    const tick = () => {
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tick);
    };
    tick();

    // Scale up on interactive elements
    const interactive = 'a,button,input,select,textarea,.service-card,.gallery-item';
    document.querySelectorAll(interactive).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.style.transform  = 'translate(-50%,-50%) scale(2)';
        ring.style.transform = 'translate(-50%,-50%) scale(1.4)';
      });
      el.addEventListener('mouseleave', () => {
        cur.style.transform  = 'translate(-50%,-50%) scale(1)';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });
  },
};
