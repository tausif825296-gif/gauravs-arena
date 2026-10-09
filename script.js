const PHONE = '918009899756';

// Mobile menu
const burger = document.querySelector('.burger'), menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });

// Sliders (swipe + arrows + auto slide)
document.querySelectorAll('.sl').forEach(sl => {
  const tr = sl.querySelector('.tr');
  const step = () => (tr.firstElementChild?.getBoundingClientRect().width || 300) + 16;
  const next = () => {
    if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 5) tr.scrollTo({ left: 0, behavior: 'smooth' });
    else tr.scrollBy({ left: step(), behavior: 'smooth' });
  };
  const prev = () => {
    if (tr.scrollLeft <= 5) tr.scrollTo({ left: tr.scrollWidth, behavior: 'smooth' });
    else tr.scrollBy({ left: -step(), behavior: 'smooth' });
  };
  sl.querySelector('.nx').addEventListener('click', next);
  sl.querySelector('.pv').addEventListener('click', prev);
  if (sl.hasAttribute('data-auto')) {
    let paused = false;
    ['mouseenter', 'touchstart'].forEach(ev => sl.addEventListener(ev, () => paused = true, { passive: true }));
    ['mouseleave', 'touchend'].forEach(ev => sl.addEventListener(ev, () => setTimeout(() => paused = false, 2500), { passive: true }));
    setInterval(() => { if (!paused && !document.hidden) next(); }, 3500);
  }
});

// Broken stock image fallback
document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }));

// Lightbox for gallery images
const lb = document.getElementById('lb'), lbImg = lb.querySelector('img');
document.querySelectorAll('#gallery figure img').forEach(img => img.addEventListener('click', () => {
  lbImg.src = img.src.replace(/w=\d+/, 'w=1400'); lbImg.alt = img.alt; lb.classList.add('on');
}));
lb.addEventListener('click', () => lb.classList.remove('on'));

// WhatsApp links with pre-filled text
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(a.dataset.wa)}`;
});

