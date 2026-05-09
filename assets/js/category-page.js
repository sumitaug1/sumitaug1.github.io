/* ═══════════════════════════════════════════════════════
   CATEGORY PAGE — Dynamic Animations Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NO_HOVER = window.matchMedia('(hover: none)').matches;

  /* ── Helpers ── */
  function getCSSColor() {
    const hero = document.querySelector('.cat-hero');
    if (!hero) return '#00c8ff';
    const raw = getComputedStyle(hero).getPropertyValue('--t-clr').trim();
    return raw || '#00c8ff';
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    };
  }

  /* ══════════════════════════════
     1. HERO PARTICLE CANVAS
     ══════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || REDUCED) { if (canvas) canvas.remove(); return; }

    const ctx = canvas.getContext('2d');
    const color = getCSSColor();
    const rgb = hexToRgb(color);
    let W, H, particles = [], raf;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function spawn() {
      return {
        x: Math.random() * W,
        y: H + 8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.25 + Math.random() * 0.7),
        r: 0.8 + Math.random() * 1.4,
        life: 0,
        max: 140 + Math.random() * 200,
        peak: 0.25 + Math.random() * 0.35
      };
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      if (particles.length < 30 && Math.random() < 0.12) particles.push(spawn());
      particles = particles.filter(p => p.life < p.max);
      particles.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const t = p.life / p.max;
        const a = t < 0.15 ? (t / 0.15) * p.peak
                : t > 0.75 ? ((1 - t) / 0.25) * p.peak
                : p.peak;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a.toFixed(3)})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    tick();

    // Stop when hero leaves viewport to save resources
    const stopObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) { cancelAnimationFrame(raf); stopObs.disconnect(); }
    });
    stopObs.observe(canvas);
  }

  /* ══════════════════════════════
     2. TYPEWRITER BADGE
     ══════════════════════════════ */
  function initTypewriter() {
    const el = document.querySelector('.cat-badge-text');
    if (!el) return;
    const text = (el.dataset.text || el.textContent).trim();
    if (REDUCED) { el.textContent = text; el.classList.add('done'); return; }

    el.textContent = '';
    let i = 0;
    setTimeout(() => {
      const id = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) {
          clearInterval(id);
          setTimeout(() => el.classList.add('done'), 600);
        }
      }, 55);
    }, 250);
  }

  /* ══════════════════════════════
     3. ANIMATED COUNTER
     ══════════════════════════════ */
  function counter(el, target, delay = 600) {
    if (REDUCED) { el.textContent = target; return; }
    setTimeout(() => {
      const dur = 1400;
      const t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        el.textContent = Math.round(e * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      })(t0);
    }, delay);
  }

  /* ══════════════════════════════
     4. SCROLL REVEAL
     ══════════════════════════════ */
  function initScrollReveal() {
    if (REDUCED) {
      document.querySelectorAll('.t-tile, .section-head, .cat-divider').forEach(el => el.classList.add('revealed'));
      return;
    }

    // Section heads
    const headObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.section-head').forEach(el => headObs.observe(el));

    // Dividers
    const divObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.7 });
    document.querySelectorAll('.cat-divider').forEach(el => divObs.observe(el));

    // Tiles — stagger per grid
    document.querySelectorAll('.tools-grid').forEach(grid => {
      const tiles = [...grid.querySelectorAll('.t-tile')];
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = tiles.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx * 0.07, 0.4)}s`;
            entry.target.classList.add('revealed');
            o.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
      tiles.forEach(t => obs.observe(t));
    });
  }

  /* ══════════════════════════════
     5. 3-D CARD TILT
     ══════════════════════════════ */
  function initTilt() {
    if (REDUCED || NO_HOVER) return;

    document.querySelectorAll('.t-tile').forEach(card => {
      let active = false;

      card.addEventListener('mouseenter', () => {
        active = true;
        card.style.transition =
          'border-color 0.3s ease, background 0.3s ease, color 0.3s ease';
      });

      card.addEventListener('mousemove', e => {
        if (!active) return;
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        card.style.transform =
          `perspective(700px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateY(-5px) scale(1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        active = false;
        card.style.transition =
          'transform 0.55s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease, color 0.3s ease';
        card.style.transform = '';
        setTimeout(() => { if (!active) card.style.transition = ''; }, 560);
      });
    });
  }

  /* ══════════════════════════════
     6. HERO MOUSE-FOLLOW GLOW
     ══════════════════════════════ */
  function initHeroGlow() {
    if (REDUCED || NO_HOVER) return;
    const hero = document.querySelector('.cat-hero');
    const glow = document.querySelector('.cat-hero-glow');
    if (!hero || !glow) return;

    let tx = -150, ty = -150, cx = -150, cy = -150, raf;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
      cx = lerp(cx, tx, 0.06);
      cy = lerp(cy, ty, 0.06);
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      raf = requestAnimationFrame(animate);
    }

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left - 350;
      ty = e.clientY - r.top  - 250;
    });

    hero.addEventListener('mouseleave', () => {
      tx = -150; ty = -150;
    });

    animate();
    // Clean up when hero is gone
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) cancelAnimationFrame(raf);
    }).observe(hero);
  }

  /* ══════════════════════════════
     7. RIPPLE ON CLICK
     ══════════════════════════════ */
  function initRipple() {
    if (REDUCED) return;
    document.querySelectorAll('.t-tile').forEach(card => {
      card.addEventListener('click', function (e) {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rpl = document.createElement('span');
        rpl.style.cssText = `
          position:absolute;
          border-radius:50%;
          width:8px;height:8px;
          left:${x - 4}px;top:${y - 4}px;
          background:var(--t-clr,#00c8ff);
          opacity:0.6;
          transform:scale(0);
          animation:rippleOut 0.6s ease forwards;
          pointer-events:none;
          z-index:10;
        `;
        card.appendChild(rpl);
        setTimeout(() => rpl.remove(), 650);
      });
    });

    // Inject keyframe once
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes rippleOut{to{transform:scale(30);opacity:0;}}';
      document.head.appendChild(s);
    }
  }

  /* ══════════════════════════════
     8. PAGE ENTRANCE (overlay fade)
     ══════════════════════════════ */
  function initPageEntrance() {
    if (REDUCED) return;
    const ov = document.createElement('div');
    ov.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:#02040a;
      transition:opacity 0.5s ease;
      pointer-events:none;
    `;
    document.body.appendChild(ov);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ov.style.opacity = '0';
        setTimeout(() => ov.remove(), 520);
      });
    });
  }

  /* ══════════════════════════════
     INIT
     ══════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initPageEntrance();
    initParticles();
    initTypewriter();
    initScrollReveal();
    initTilt();
    initHeroGlow();
    initRipple();

    // Counter
    const numEl = document.querySelector('.cat-stat-num');
    if (numEl) {
      const n = parseInt(numEl.dataset.count, 10);
      if (!isNaN(n)) counter(numEl, n, 700);
    }
  });
})();
