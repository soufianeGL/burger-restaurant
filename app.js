/* ============================================================
   BURGR. — APP JAVASCRIPT
   ============================================================ */

'use strict';

// ── MENU DATA ──────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: 1, name: 'The Inferno', price: '$18', emoji: '🔥',
    badge: 'SPICY', badgeClass: 'badge-spicy',
    desc: 'Double wagyu, ghost pepper sauce, jalapeños, smoked bacon, pepper jack cheese',
    stars: 5, reviews: 243, category: 'specials',
  },
  {
    id: 2, name: 'The Classic', price: '$14', emoji: '⭐',
    badge: 'BESTSELLER', badgeClass: 'badge-bestseller',
    desc: 'Single angus patty, american cheese, pickles, mustard, caramelized onions',
    stars: 5, reviews: 581, category: 'classics',
  },
  {
    id: 3, name: 'Black Label', price: '$24', emoji: '👑',
    badge: 'PREMIUM', badgeClass: 'badge-premium',
    desc: 'A5 wagyu, truffle aioli, aged brie, arugula, sun-dried tomato, gold dust',
    stars: 5, reviews: 127, category: 'specials',
  },
  {
    id: 4, name: 'Mushroom Melt', price: '$16', emoji: '🍄',
    badge: 'VEGGIE', badgeClass: 'badge-veggie',
    desc: 'Plant-based patty, portobello mushrooms, gruyère, herb mayo, crispy shallots',
    stars: 5, reviews: 189, category: 'veggie',
  },
  {
    id: 5, name: 'The Double Down', price: '$20', emoji: '💪',
    badge: 'BESTSELLER', badgeClass: 'badge-bestseller',
    desc: 'Two smash-style angus patties, american cheese, special sauce, crispy onions',
    stars: 5, reviews: 342, category: 'classics',
  },
  {
    id: 6, name: 'Garden Party', price: '$15', emoji: '🥗',
    badge: 'VEGGIE', badgeClass: 'badge-veggie',
    desc: 'Falafel patty, tahini, roasted red pepper, cucumber, fresh herbs on brioche',
    stars: 4, reviews: 98, category: 'veggie',
  },
  {
    id: 7, name: 'The Deal', price: '$22', emoji: '🎉',
    badge: 'NEW', badgeClass: 'badge-new',
    desc: 'Single classic burger + crispy fries + craft drink — everything you need',
    stars: 5, reviews: 64, category: 'combos',
  },
  {
    id: 8, name: 'Family Feast', price: '$58', emoji: '👨‍👩‍👧',
    badge: 'NEW', badgeClass: 'badge-new',
    desc: 'Four burgers of your choice, large fries x2, four craft drinks — feeds the crew',
    stars: 5, reviews: 32, category: 'combos',
  },
];

// ── LOADER ─────────────────────────────────────────────────
const loader = document.getElementById('loader');
const progressBar = document.getElementById('progressBar');
let progress = 0;

const interval = setInterval(() => {
  progress += Math.random() * 18 + 5;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setTimeout(() => {
      loader.classList.add('hidden');
      initApp();
    }, 400);
  }
  progressBar.style.width = progress + '%';
}, 120);

// ── CURSOR ─────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .menu-card, .tab, .testi-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    cursorFollower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    cursorFollower.classList.remove('hover');
  });
});

// ── MAIN INIT ───────────────────────────────────────────────
function initApp() {
  setupNav();
  setupHamburger();
  renderMenuCards('all');
  setupMenuTabs();
  setupAOS();
  animateCounters();
  setupParallax();
  highlightActiveNav();
  setupCountdown();
}

// ── NAV ─────────────────────────────────────────────────────
function setupNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
}

// ── MENU ────────────────────────────────────────────────────
function renderMenuCards(filter) {
  const grid = document.getElementById('menuGrid');
  const items = filter === 'all' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === filter);
  grid.innerHTML = '';
  items.forEach((item, idx) => {
    const stars = '★'.repeat(item.stars) + '☆'.repeat(5 - item.stars);
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.style.animationDelay = (idx * 0.08) + 's';
    card.innerHTML = `
      <div class="card-img">
        <div class="card-img-bg"></div>
        <span class="card-emoji">${item.emoji}</span>
        <span class="card-badge ${item.badgeClass}">${item.badge}</span>
      </div>
      <div class="card-body">
        <div class="card-stars">${stars} <span style="color:var(--muted);font-size:12px">(${item.reviews})</span></div>
        <div class="card-name">${item.name}</div>
        <div class="card-desc">${item.desc}</div>
        <div class="card-footer">
          <span class="card-price">${item.price}</span>
          <button class="card-add" onclick="addToCart(${item.id}, this)" aria-label="Add to order">+</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
    // Re-add hover listeners for cursor
    card.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    card.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

function setupMenuTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.tab;
      renderMenuCards(filter);
    });
  });
}

window.addToCart = function(id, btn) {
  btn.textContent = '✓';
  btn.style.background = '#2da84f';
  btn.style.transform = 'scale(1.3) rotate(0deg)';
  setTimeout(() => {
    btn.textContent = '+';
    btn.style.background = '';
    btn.style.transform = '';
  }, 1500);
  // Ripple effect
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:fixed;width:20px;height:20px;
    background:rgba(250,102,15,0.5);border-radius:50%;
    transform:translate(-50%,-50%) scale(0);
    animation:rippleOut 0.6s ease-out forwards;
    left:${mouseX}px;top:${mouseY}px;
    pointer-events:none;z-index:9000;
  `;
  document.body.appendChild(ripple);
  const style = document.createElement('style');
  style.textContent = '@keyframes rippleOut{to{transform:translate(-50%,-50%) scale(6);opacity:0}}';
  document.head.appendChild(style);
  setTimeout(() => ripple.remove(), 700);
};

// ── AOS ─────────────────────────────────────────────────────
function setupAOS() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-aos]').forEach(el => io.observe(el));
}

// ── COUNTERS ────────────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-val[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseFloat(e.target.dataset.count);
        const isDecimal = target % 1 !== 0;
        let start = 0;
        const duration = 2000;
        const step = 16;
        const increment = target / (duration / step);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          e.target.textContent = isDecimal ? start.toFixed(1) : Math.floor(start);
        }, step);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

// ── PARALLAX ────────────────────────────────────────────────
function setupParallax() {
  const heroBgGlow = document.querySelector('.hero-bg-glow');
  if (!heroBgGlow) return;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroBgGlow.style.transform = `translateY(${scrollY * 0.3}px)`;
    const burgerStack = document.getElementById('burgerStack');
    if (burgerStack) {
      burgerStack.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
  });
  // Mouse parallax on hero
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    const burgerStack = document.getElementById('burgerStack');
    if (burgerStack) {
      burgerStack.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;
    }
    heroBgGlow.style.transform = `translate(${dx * 20}px, ${dy * 20}px)`;
  });
}

// ── COUNTDOWN ───────────────────────────────────────────────
function setupCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  let totalSeconds = 2 * 86400 + 14 * 3600 + 32 * 60;
  setInterval(() => {
    totalSeconds = Math.max(0, totalSeconds - 1);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    el.innerHTML = `Available for: <strong>${d}d ${h}h ${m}m ${s}s</strong>`;
  }, 1000);
}

// ── SMOOTH SCROLL ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── TILT EFFECT ON CARDS ────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.menu-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (
      e.clientX > rect.left && e.clientX < rect.right &&
      e.clientY > rect.top && e.clientY < rect.bottom
    ) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) scale(1.01) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    } else {
      card.style.transform = '';
    }
  });
});
