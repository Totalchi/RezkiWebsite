/* ============================================================
   RM Bygg & Montage AB — Canvas Animations
   Elke init-methode checkt eerst of het canvas element bestaat.
   ============================================================ */

const CanvasService = {
  init() {
    this.initHero();
    this.initAbout();
  },

  /* ---- Hero canvas (index.html) --------------------------- */
  initHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, mouseX, mouseY;
    const particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      mouseX = W / 2;
      mouseY = H / 2;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* passive: true — geen preventDefault nodig op mousemove */
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    }, { passive: true });

    function Particle() { this.reset(); }

    Particle.prototype.reset = function () {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = (Math.random() - 0.5) * 0.3;
      this.size  = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#C8972A' : '#4A9EBF';
      this.phase = Math.random() * Math.PI * 2;
    };

    Particle.prototype.update = function () {
      this.phase += 0.02;
      this.x += this.vx + (mouseX - W / 2) / W * 0.3;
      this.y += this.vy + (mouseY - H / 2) / H * 0.3;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };

    Particle.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.phase));
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (0.8 + 0.2 * Math.sin(this.phase)), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (let i = 0; i < 150; i++) particles.push(new Particle());

    let sunAngle = 0;

    const drawSun = () => {
      sunAngle += 0.003;
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const cx = W * 0.5 + Math.sin(sunAngle * 0.7) * 20;
      const cy = H * 0.42 + Math.cos(sunAngle * 0.5) * 10;
      const r  = Math.min(W, H) * 0.18;

      for (let i = 3; i >= 1; i--) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * (1 + i * 0.5));
        g.addColorStop(0, light ? 'rgba(200,151,42,0.07)' : 'rgba(200,151,42,0.04)');
        g.addColorStop(1, 'rgba(200,151,42,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r * (1 + i * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      const g2 = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r);
      g2.addColorStop(0,   light ? 'rgba(240,200,74,0.3)'  : 'rgba(240,200,74,0.22)');
      g2.addColorStop(0.5, light ? 'rgba(200,151,42,0.18)' : 'rgba(200,151,42,0.12)');
      g2.addColorStop(1,   'rgba(200,151,42,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g2;
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sunAngle * 0.5);
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / 12) * i);
        ctx.globalAlpha = light ? 0.1 : 0.06;
        ctx.strokeStyle = '#F0C84A';
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(r * 0.7, 0);
        ctx.lineTo(r * (1.3 + 0.15 * Math.sin(sunAngle * 3 + i)), 0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.save();
            ctx.globalAlpha = (1 - d / 80) * 0.07;
            ctx.strokeStyle = '#C8972A';
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const drawGrid = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.save();
      ctx.globalAlpha = light ? 0.04 : 0.06;
      ctx.strokeStyle = '#C8972A';
      ctx.lineWidth   = 0.8;
      const vX = W / 2, vY = H * 0.7, gY = H * 0.85, nL = 12, gS = 80;
      for (let i = -nL; i <= nL; i++) {
        ctx.beginPath();
        ctx.moveTo(vX, vY);
        ctx.lineTo(vX + i * gS * 4, gY + 200);
        ctx.stroke();
      }
      for (let i = 0; i <= nL; i++) {
        const t  = i / nL;
        const gy = vY + t * (gY - vY + 200);
        const sc = (gy - vY) / 600;
        ctx.beginPath();
        ctx.moveTo(vX - nL * gS * sc * 4, gy);
        ctx.lineTo(vX + nL * gS * sc * 4, gy);
        ctx.stroke();
      }
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, light ? 'rgba(245,243,238,0)'   : 'rgba(13,17,23,0)');
      bg.addColorStop(1, light ? 'rgba(245,243,238,0.4)' : 'rgba(13,17,23,0.5)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      drawGrid();
      drawSun();
      drawLines();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    };
    loop();
  },

  /* ---- About canvas (about.html) -------------------------- */
  initAbout() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const loop = () => {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);
      const cx   = W / 2;
      const cy   = H / 2;
      const base = Math.min(W, H) * 0.3;

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 2);
      bg.addColorStop(0, 'rgba(200,151,42,0.06)');
      bg.addColorStop(1, 'rgba(200,151,42,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      for (let i = 3; i >= 1; i--) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * (0.3 / i) * (i % 2 === 0 ? -1 : 1));
        ctx.globalAlpha = 0.15 - i * 0.03;
        ctx.strokeStyle = i === 1 ? '#C8972A' : '#4A9EBF';
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([6, 12 + i * 8]);
        ctx.beginPath();
        ctx.arc(0, 0, base * (0.6 + i * 0.35), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const orbitColors = ['#C8972A', '#4A9EBF', '#2DB87A'];
      for (let i = 0; i < 3; i++) {
        const angle = t * (0.6 + i * 0.3) + (i * Math.PI * 2 / 3);
        const r     = base * (0.6 + i * 0.35);
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle   = orbitColors[i];
        ctx.shadowColor = orbitColors[i];
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(cx, cy);
      const pulse = 0.92 + 0.08 * Math.sin(t * 2);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, base * 0.4 * pulse);
      g.addColorStop(0, 'rgba(200,151,42,0.25)');
      g.addColorStop(1, 'rgba(200,151,42,0)');
      ctx.beginPath();
      ctx.arc(0, 0, base * 0.4 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.font         = `bold ${Math.floor(base * 0.28)}px Cormorant Garamond,serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = '#C8972A';
      ctx.globalAlpha  = 0.85;
      ctx.fillText('RM', 0, 0);
      ctx.restore();

      requestAnimationFrame(loop);
    };
    loop();
  },
};
