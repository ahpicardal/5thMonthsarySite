/* =========================================================
   CONFIG — edit these two lines to personalize
   ========================================================= */
const HERO_TITLE = "Happy 5th Monthsary, My Lab ❤️"; // shown as a typing animation
const START_DATE = new Date("2026-02-05T00:00:00"); // the day you got together

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   LOADER
   ========================================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 900);
});

/* =========================================================
   TYPING ANIMATION (hero title)
   ========================================================= */
function typeHeroTitle(){
  const target = document.getElementById('typing-target');
  if (reducedMotion){ target.textContent = HERO_TITLE; return; }
  let i = 0;
  function step(){
    if (i <= HERO_TITLE.length){
      target.textContent = HERO_TITLE.slice(0, i);
      i++;
      setTimeout(step, 55);
    } else {
      target.style.borderRight = 'none';
    }
  }
  step();
}
typeHeroTitle();

/* =========================================================
   SCROLL PROGRESS BAR
   ========================================================= */
const progressBar = document.getElementById('scroll-progress');
function updateProgress(){
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach(item => revealObserver.observe(item));

/* =========================================================
   "OUR JOURNEY" BUTTON — smooth scroll to story
   ========================================================= */
document.getElementById('journey-btn').addEventListener('click', () => {
  document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('replay-btn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   FLOATING HEARTS (ambient)
   ========================================================= */
const heartsLayer = document.getElementById('floating-hearts');
function spawnHeart(){
  const heart = document.createElement('span');
  heart.className = 'heart-particle';
  heart.textContent = '♥';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
  heart.style.fontSize = (0.7 + Math.random() * 1.2) + 'rem';
  const duration = 8 + Math.random() * 6;
  heart.style.animationDuration = duration + 's';
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}
if (!reducedMotion) setInterval(spawnHeart, 1400);

/* =========================================================
   AMBIENT STARS
   ========================================================= */
const starsLayer = document.getElementById('stars');
for (let i = 0; i < 40; i++){
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = Math.random() * 100 + 'vw';
  star.style.top = Math.random() * 100 + 'vh';
  star.style.animationDuration = (2 + Math.random() * 3) + 's';
  starsLayer.appendChild(star);
}

/* =========================================================
   CURSOR GLOW
   ========================================================= */
const glow = document.getElementById('cursor-glow');
window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

/* =========================================================
   GALLERY LIGHTBOX
   ========================================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
  });
});
document.getElementById('lightbox-close').addEventListener('click', () => {
  lightbox.classList.remove('active');
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});

/* =========================================================
   COUNTDOWN — time since START_DATE
   ========================================================= */
const cd = {
  months: document.getElementById('cd-months'),
  days: document.getElementById('cd-days'),
  hours: document.getElementById('cd-hours'),
  minutes: document.getElementById('cd-minutes'),
  seconds: document.getElementById('cd-seconds'),
};
document.getElementById('start-date-label').textContent =
  'counting from ' + START_DATE.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

function updateCountdown(){
  const now = new Date();
  let diffMs = now - START_DATE;
  if (diffMs < 0) diffMs = 0;

  // whole months since start date
  let months = (now.getFullYear() - START_DATE.getFullYear()) * 12 + (now.getMonth() - START_DATE.getMonth());
  const monthAnchor = new Date(START_DATE);
  monthAnchor.setMonth(monthAnchor.getMonth() + months);
  if (monthAnchor > now){
    months--;
    monthAnchor.setMonth(monthAnchor.getMonth() - 1);
  }

  let remainderMs = now - monthAnchor;
  const days = Math.floor(remainderMs / (1000 * 60 * 60 * 24));
  remainderMs -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(remainderMs / (1000 * 60 * 60));
  remainderMs -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(remainderMs / (1000 * 60));
  remainderMs -= minutes * (1000 * 60);
  const seconds = Math.floor(remainderMs / 1000);

  cd.months.textContent = Math.max(months, 0);
  cd.days.textContent = days;
  cd.hours.textContent = hours;
  cd.minutes.textContent = minutes;
  cd.seconds.textContent = seconds;
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   MUSIC PLAYER
   ========================================================= */
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let musicPlaying = false;

function tryAutoplay(){
  music.play().then(() => {
    musicPlaying = true;
    musicToggle.classList.add('playing');
  }).catch(() => {
    // autoplay blocked by browser — wait for user interaction
    musicPlaying = false;
  });
}
tryAutoplay();

musicToggle.addEventListener('click', () => {
  if (musicPlaying){
    music.pause();
    musicToggle.classList.remove('playing');
  } else {
    music.play();
    musicToggle.classList.add('playing');
  }
  musicPlaying = !musicPlaying;
});

/* =========================================================
   LOVE NOTES / ENVELOPES
   ========================================================= */
const popup = document.getElementById('note-popup');
const noteText = document.getElementById('note-text');
document.querySelectorAll('.envelope').forEach(env => {
  env.addEventListener('click', () => {
    noteText.textContent = env.dataset.note;
    popup.classList.add('active');
  });
});
document.getElementById('note-close').addEventListener('click', () => {
  popup.classList.remove('active');
});

/* =========================================================
   CONFETTI — fires when the ending section is reached
   ========================================================= */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(){
  if (reducedMotion) return;
  const colors = ['#B5657A', '#C9A66B', '#8C4A5C', '#FBF5EF'];
  confettiPieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.3,
    size: 4 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: (Math.random() - 0.5) * 2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
  }));
  if (!confettiRunning){
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let stillActive = false;
  confettiPieces.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;
    if (p.y < canvas.height + 20) stillActive = true;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  if (stillActive){
    requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiRunning = false;
  }
}

let confettiFired = false;
const endingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      confettiFired = true;
      launchConfetti();
    }
  });
}, { threshold: 0.5 });
endingObserver.observe(document.getElementById('ending'));
