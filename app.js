// mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // mark active nav link
  const here = document.body.dataset.page;
  document.querySelectorAll('nav.links a[data-page]').forEach(a => {
    if (a.dataset.page === here) a.classList.add('active');
  });

  // scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // photo fallback: mark tiles whose image failed to load
  document.querySelectorAll('.photo-tile img').forEach(img => {
    img.addEventListener('error', () => img.closest('.photo-tile').classList.add('img-missing'));
    if (img.complete && img.naturalWidth === 0) img.closest('.photo-tile').classList.add('img-missing');
  });

  initGestureCursor();
});

// ---------- gesture-tracking cursor signature ----------
// A small tracking dot + connecting line, referencing the hand-landmark
// tracking in the Zero-Footprint Virtual Dissection project. Desktop/hover only.
function initGestureCursor(){
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'gesture-dot';
  const line = document.createElement('div');
  line.className = 'gesture-line';
  document.body.appendChild(dot);
  document.body.appendChild(line);

  let anchor = null; // nearest focal element (logo or nav link)
  let raf = null;
  let mouse = {x:-100,y:-100};

  function findAnchor(){
    const candidates = document.querySelectorAll('.logo, nav.links a, .btn');
    let closest = null, minD = Infinity;
    candidates.forEach(el => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const d = Math.hypot(cx - mouse.x, cy - mouse.y);
      if (d < minD){ minD = d; closest = {x:cx,y:cy}; }
    });
    return closest;
  }

  function update(){
    dot.style.opacity = '1';
    dot.style.left = mouse.x + 'px';
    dot.style.top = mouse.y + 'px';
    anchor = findAnchor();
    if (anchor){
      const dx = anchor.x - mouse.x, dy = anchor.y - mouse.y;
      const dist = Math.hypot(dx,dy);
      if (dist < 260){
        line.style.opacity = String(Math.max(0, 1 - dist/260) * 0.7);
        line.style.left = mouse.x + 'px';
        line.style.top = mouse.y + 'px';
        line.style.width = dist + 'px';
        line.style.transform = `rotate(${Math.atan2(dy,dx)}rad)`;
      } else {
        line.style.opacity = '0';
      }
    }
    raf = null;
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  });
  window.addEventListener('mouseleave', () => { dot.style.opacity = '0'; line.style.opacity = '0'; });
}

// ---------- EKG canvas (home hero only) ----------
function drawEkg(){
  const canvas = document.getElementById('ekg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = 0;
  function pulseAt(x, phase){
    const p = ((x + phase) % 1 + 1) % 1;
    if (p > 0.46 && p < 0.60){
      const local = (p - 0.46) / 0.14;
      if (local < 0.28) return -local * 10;
      if (local < 0.45) return (local-0.28)/0.17 * 46 - 2.8;
      if (local < 0.62) return 43 - (local-0.45)/0.17 * 55;
      return -12 + (local-0.62)/0.38*12;
    }
    return Math.sin(p * Math.PI * 2) * 1.2;
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    const baseline = h * 0.62;
    const speed = reduceMotion ? 0 : 0.00028;
    const phase = t * speed;
    ctx.beginPath();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(51,199,189,0.85)';
    ctx.shadowColor = 'rgba(51,199,189,0.55)';
    ctx.shadowBlur = 6;
    const step = 3;
    for (let x = 0; x <= w; x += step){
      const nx = (x / w) * 3.2;
      const y = baseline - pulseAt(nx, phase * 60 * 60);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (!reduceMotion){ t += 16; requestAnimationFrame(draw); }
  }
  draw();
}
document.addEventListener('DOMContentLoaded', drawEkg);
