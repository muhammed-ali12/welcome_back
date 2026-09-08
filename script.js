/* ============================================
   WELCOME BACK, MY LOVE — script
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

const isMobile = window.matchMedia('(max-width: 860px)').matches ||
                  window.matchMedia('(hover: none)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------
   1. Ambient particles (subtle stars drifting)
--------------------------------------------- */
(function particles(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, dots = [];

  function size(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  size();
  window.addEventListener('resize', size);

  const count = isMobile ? 26 : 60;
  for(let i=0;i<count;i++){
    dots.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.3 + 0.3,
      vy: Math.random()*0.12 + 0.03,
      vx: (Math.random()-0.5)*0.05,
      a: Math.random()*0.5 + 0.15
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#C9A96E';
    dots.forEach(d=>{
      d.y -= d.vy;
      d.x += d.vx;
      if(d.y < -5){ d.y = h+5; d.x = Math.random()*w; }
      ctx.globalAlpha = d.a;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  if(!prefersReducedMotion) draw();
  else{
    ctx.fillStyle = '#C9A96E';
    dots.forEach(d=>{
      ctx.globalAlpha = d.a;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
})();

/* ---------------------------------------------
   2. Custom cursor (desktop only)
--------------------------------------------- */
if(!isMobile){
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx=0, my=0, rx=0, ry=0;

  window.addEventListener('mousemove', e=>{
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    document.body.classList.add('cursor-ready');
  });

  gsap.ticker.add(()=>{
    rx += (mx-rx)*0.15;
    ry += (my-ry)*0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  });
}

/* ---------------------------------------------
   3. Music toggle
--------------------------------------------- */
(function music(){
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  btn.addEventListener('click', ()=>{
    if(!playing){
      audio.play().catch(()=>{ /* file may not be added yet */ });
      btn.classList.add('playing');
      btn.setAttribute('aria-label','Pause music');
      playing = true;
    } else {
      audio.pause();
      btn.classList.remove('playing');
      btn.setAttribute('aria-label','Play music');
      playing = false;
    }
  });
})();

/* ---------------------------------------------
   4. Opening cinematic sequence
--------------------------------------------- */
const openingTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

openingTl
  .to('.opening-lines .line[data-line="1"]', { opacity: 1, duration: 1.4 }, 0.5)
  .to('.opening-lines .line[data-line="1"]', { opacity: 0, duration: 1, delay: 1.1 })
  .to('.opening-lines .line[data-line="2"]', { opacity: 1, duration: 1.4 }, '-=0.3')
  .to('.opening-lines .line[data-line="2"]', { opacity: 0, duration: 1, delay: 1.1 })
  .to('.opening-lines .line[data-line="3"]', { opacity: 1, duration: 1.4 }, '-=0.3')
  .to('.opening-lines .line[data-line="3"]', { opacity: 0, duration: 1, delay: 1.3 })
  .to('.opening-title', { opacity: 1, duration: 1.8, ease: 'expo.out' }, '-=0.2')
  .to('.scroll-cue', { opacity: 1, duration: 1 }, '-=0.6');

/* ---------------------------------------------
   5. Hero reveal (photo + text), tied loosely
      to scroll into view after opening
--------------------------------------------- */
gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top 75%',
    once: true
  },
  defaults: { ease: 'power3.out' }
})
  .to('.hero-photo-glow', { opacity: 1, duration: 1.6 })
  .to('.hero-photo-frame', { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, '-=1.4')
  .to('.hero-eyebrow', { opacity: 1, duration: 1 }, '-=0.6')
  .to('.hero-route', { opacity: 1, duration: 1 }, '-=0.5')
  .to('.hero-sub', { opacity: 1, duration: 1 }, '-=0.5');

/* subtle floating parallax on hero photo (desktop only) */
if(!isMobile && !prefersReducedMotion){
  const frame = document.querySelector('.hero-photo-frame');
  const heroSection = document.querySelector('.hero');

  heroSection.addEventListener('mousemove', (e)=>{
    const rect = heroSection.getBoundingClientRect();
    const relX = (e.clientX - rect.left)/rect.width - 0.5;
    const relY = (e.clientY - rect.top)/rect.height - 0.5;
    gsap.to(frame, {
      x: relX * 14,
      y: relY * 10,
      rotateY: relX * 4,
      rotateX: -relY * 4,
      duration: 0.9,
      ease: 'power2.out'
    });
  });

  heroSection.addEventListener('mouseleave', ()=>{
    gsap.to(frame, { x:0, y:0, rotateX:0, rotateY:0, duration: 1.2, ease: 'power3.out' });
  });
}

/* ---------------------------------------------
   6. Generic scroll reveal for .reveal-up items
--------------------------------------------- */
document.querySelectorAll('.reveal-up').forEach(el=>{
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true
    }
  });
});

/* ---------------------------------------------
   7. Journey / distance visual
--------------------------------------------- */
gsap.timeline({
  scrollTrigger: {
    trigger: '.journey-section',
    start: 'top 70%',
    once: true
  }
})
  .to('#pointStart', { opacity: 1, duration: 0.8, ease: 'power2.out' })
  .to('#journeyPath', { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, '-=0.2')
  .to('#pointEnd', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');

/* ---------------------------------------------
   8. I MISSED YOU — slow emphatic reveal
--------------------------------------------- */
gsap.timeline({
  scrollTrigger: {
    trigger: '.missed-section',
    start: 'top 60%',
    once: true
  }
})
  .to('.missed-1', { opacity: 1, duration: 2.4, ease: 'power1.out' })
  .to('.missed-2', { opacity: 1, duration: 1.6, ease: 'power2.out' }, '-=0.4');

/* ---------------------------------------------
   9. Secret message reveal
--------------------------------------------- */
const secretBtn = document.getElementById('secretBtn');
const secretMessage = document.getElementById('secretMessage');

secretBtn.addEventListener('click', ()=>{
  secretBtn.classList.add('hidden-away');
  secretMessage.setAttribute('aria-hidden', 'false');

  gsap.to(secretMessage.querySelectorAll('p'), {
    opacity: 1,
    y: 0,
    duration: 1.1,
    ease: 'power2.out',
    stagger: 0.35
  });
});
