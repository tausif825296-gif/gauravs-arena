const PHONE = '918009899756';

/* ---------- Mobile menu ---------- */
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', e => {
    if (e.target.tagName === 'A') menu.classList.remove('open');
  });
}

/* ---------- Sliders (swipe + arrows + auto slide) ---------- */
document.querySelectorAll('.sl').forEach(sl => {
  const tr = sl.querySelector('.tr');
  if (!tr) return;
  const step = () => (tr.firstElementChild?.getBoundingClientRect().width || 300) + 16;
  const next = () => {
    if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 5) tr.scrollTo({ left: 0, behavior: 'smooth' });
    else tr.scrollBy({ left: step(), behavior: 'smooth' });
  };
  const prev = () => {
    if (tr.scrollLeft <= 5) tr.scrollTo({ left: tr.scrollWidth, behavior: 'smooth' });
    else tr.scrollBy({ left: -step(), behavior: 'smooth' });
  };
  sl.querySelector('.nx')?.addEventListener('click', next);
  sl.querySelector('.pv')?.addEventListener('click', prev);
  if (sl.hasAttribute('data-auto')) {
    let paused = false;
    ['mouseenter', 'touchstart'].forEach(ev => sl.addEventListener(ev, () => (paused = true), { passive: true }));
    ['mouseleave', 'touchend'].forEach(ev => sl.addEventListener(ev, () => setTimeout(() => (paused = false), 2500), { passive: true }));
    setInterval(() => { if (!paused && !document.hidden) next(); }, 3500);
  }
});

/* ---------- Broken stock image fallback ---------- */
document.querySelectorAll('img').forEach(img =>
  img.addEventListener('error', () => { img.style.visibility = 'hidden'; })
);

/* ---------- Lightbox for gallery images ---------- */
const lb = document.getElementById('lb');
const lbImg = lb ? lb.querySelector('img') : null;
if (lb && lbImg) {
  document.querySelectorAll('#gallery figure img').forEach(img =>
    img.addEventListener('click', () => {
      lbImg.src = img.src.replace(/w=\d+/, 'w=1400');
      lbImg.alt = img.alt;
      lb.classList.add('on');
    })
  );
  lb.addEventListener('click', () => lb.classList.remove('on'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });
}

/* ---------- WhatsApp links with pre-filled text ---------- */
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(a.dataset.wa)}`;
});

/* ---------- Free trial booking form -> WhatsApp ---------- */
const form = document.getElementById('bk');
const formMsg = document.getElementById('bk-msg');
if (form) {
  const say = (text, ok) => {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.classList.toggle('ok', !!ok);
  };
  form.querySelectorAll('input,select').forEach(el =>
    el.addEventListener('input', () => el.classList.remove('bad'))
  );

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements['n'].value.trim();
    const phoneRaw = form.elements['p'].value.trim();
    const service = form.elements['s'].value.trim();
    const message = form.elements['m'].value.trim();

    // Phone: accept 10 digits, or 91 + 10 digits
    let digits = phoneRaw.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);

    form.querySelectorAll('.bad').forEach(el => el.classList.remove('bad'));
    if (name.length < 2) {
      form.elements['n'].classList.add('bad'); form.elements['n'].focus();
      return say('Please enter your name.');
    }
    if (!/^\d{10}$/.test(digits)) {
      form.elements['p'].classList.add('bad'); form.elements['p'].focus();
      return say('Please enter a valid 10-digit phone number.');
    }
    if (!service) {
      form.elements['s'].classList.add('bad'); form.elements['s'].focus();
      return say('Please choose a class.');
    }

    const msg =
      `Hi Gaurav's Arena, I want a free trial.\n` +
      `Name: ${name}\n` +
      `Phone: ${digits}\n` +
      `Class: ${service}\n` +
      `Message: ${message || '-'}`;
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url; // popup blocked: open in the same tab
    say('Opening WhatsApp. Press send to confirm your free trial.', true);
    form.reset();
  });
}

/* ---------- Highlight today + Open Now (India time) ---------- */
(function () {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const mins = ist.getHours() * 60 + ist.getMinutes();
  document.querySelector(`.tm tr[data-d="${day}"]`)?.classList.add('today');
  const isOpen = day === 0 || day === 6 || (mins >= 360 && mins < 1290);
  const badge = document.getElementById('open');
  if (badge) {
    badge.textContent = isOpen ? 'Open now' : 'Closed now · opens 6 am';
    badge.classList.add(isOpen ? 'on' : 'off');
  }
})();

const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ---------- Hero mouse depth (parallax) ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.getElementById('home');
if (hero && !reduceMotion) {
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--mx', 0);
    hero.style.setProperty('--my', 0);
  });
}

/* ---------- 3D tilt on service cards ---------- */
if (!reduceMotion) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add('tilt');
      card.style.transform = `perspective(700px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) translateZ(6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilt');
      card.style.transform = '';
    });
  });
}

/* ---------- Animated 3D particle network background ---------- */
(function () {
  const cv = document.getElementById('bg');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, pts = [];
  let mx = 0, my = 0, tx = 0, ty = 0; // mouse depth offset (smoothed)

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(85, Math.max(26, (W * H) / 21000)));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: 0.25 + Math.random() * 0.75, // depth: small = far, big = near
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX / W - 0.5;
    ty = e.clientY / H - 0.5;
  }, { passive: true });

  const wrap = (v, max) => ((v % max) + max) % max;

  function frame() {
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    const sy = window.scrollY;
    ctx.clearRect(0, 0, W, H);

    // position of each dot: drifts over time, shifts with mouse and scroll (depth)
    const P = pts.map(p => {
      p.x += p.vx * p.z;
      p.y += p.vy * p.z;
      return {
        x: wrap(p.x - mx * 70 * p.z, W),
        y: wrap(p.y - my * 70 * p.z - sy * 0.22 * p.z, H),
        z: p.z,
      };
    });

    const maxD = Math.min(150, W * 0.28);
    ctx.lineWidth = 1;
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y;
        const d = Math.hypot(dx, dy);
        if (d < maxD) {
          const a = (1 - d / maxD) * 0.32 * Math.min(P[i].z, P[j].z) * 1.6;
          ctx.strokeStyle = `rgba(200,20,20,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(P[i].x, P[i].y);
          ctx.lineTo(P[j].x, P[j].y);
          ctx.stroke();
        }
      }
    }
    for (const p of P) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(220,30,30,${(0.35 + p.z * 0.55).toFixed(2)})`;
      ctx.shadowColor = 'rgba(255,40,40,.7)';
      ctx.shadowBlur = 8 * p.z;
      ctx.arc(p.x, p.y, 1 + p.z * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  resize();
  if (reduceMotion) { frame(); return; } // one still frame only

  let running = true;
  function loop() {
    if (running) frame();
    requestAnimationFrame(loop);
  }
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });
  requestAnimationFrame(loop);
})();