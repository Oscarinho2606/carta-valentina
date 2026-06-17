/* ================================================================
   script.js — Carta para Valentina
   ================================================================ */

// ── 1. BACKGROUND CANVAS — Stars & Shooting Stars ────────────────

const bgCanvas = document.getElementById('bg-canvas');
const bgCtx    = bgCanvas.getContext('2d');

function resizeBgCanvas() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

resizeBgCanvas();
window.addEventListener('resize', () => {
  resizeBgCanvas();
  initStars();
});

let stars = [];

function initStars() {
  stars = [];
  for (let i = 0; i < 220; i++) {
    stars.push({
      x:     Math.random() * bgCanvas.width,
      y:     Math.random() * bgCanvas.height,
      r:     Math.random() * 1.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.004,
    });
  }
}
initStars();

const shootingStars = [];

function spawnShootingStar() {
  const angle = Math.PI / 5 + (Math.random() - 0.5) * 0.35;
  shootingStars.push({
    x:     Math.random() * bgCanvas.width * 0.75,
    y:     Math.random() * bgCanvas.height * 0.45,
    len:   Math.random() * 130 + 70,
    speed: Math.random() * 14 + 8,
    alpha: 1,
    angle,
    width: Math.random() * 1.8 + 0.8,
  });
}

setInterval(spawnShootingStar, 2800);
setTimeout(spawnShootingStar, 500);

let bgTime = 0;

function drawBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  // Twinkling stars
  stars.forEach(star => {
    const alpha = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(bgTime * star.speed * 60 + star.phase));
    bgCtx.beginPath();
    bgCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
    bgCtx.fill();

    // Glow on larger stars
    if (star.r > 1.3) {
      bgCtx.beginPath();
      bgCtx.arc(star.x, star.y, star.r * 3.5, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(140, 195, 255, ${alpha * 0.12})`;
      bgCtx.fill();
    }
  });

  // Shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    const gradient = bgCtx.createLinearGradient(
      ss.x, ss.y,
      ss.x - Math.cos(ss.angle) * ss.len,
      ss.y - Math.sin(ss.angle) * ss.len
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    bgCtx.save();
    bgCtx.lineWidth   = ss.width;
    bgCtx.lineCap     = 'round';
    bgCtx.strokeStyle = gradient;
    bgCtx.beginPath();
    bgCtx.moveTo(ss.x, ss.y);
    bgCtx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
    bgCtx.stroke();
    bgCtx.restore();

    ss.x     += Math.cos(ss.angle) * ss.speed;
    ss.y     += Math.sin(ss.angle) * ss.speed;
    ss.alpha -= 0.018;

    if (ss.alpha <= 0) shootingStars.splice(i, 1);
  }

  bgTime += 0.016;
  requestAnimationFrame(drawBackground);
}
drawBackground();


// ── 2. CURSOR TRAIL ──────────────────────────────────────────────

const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx    = cursorCanvas.getContext('2d');

function resizeCursorCanvas() {
  cursorCanvas.width  = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
}
resizeCursorCanvas();
window.addEventListener('resize', resizeCursorCanvas);

const trailParticles = [];
const TRAIL_EMOJIS   = ['💙', '✨', '💫', '⭐', '🌟', '✦'];

document.addEventListener('mousemove', e => {
  if (Math.random() > 0.28) return;
  trailParticles.push({
    x:     e.clientX,
    y:     e.clientY,
    alpha: 1,
    size:  Math.random() * 16 + 10,
    emoji: TRAIL_EMOJIS[Math.floor(Math.random() * TRAIL_EMOJIS.length)],
    vx:    (Math.random() - 0.5) * 2.2,
    vy:    -(Math.random() * 2.5 + 0.8),
  });
});

document.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  if (Math.random() > 0.4) return;
  trailParticles.push({
    x:     touch.clientX,
    y:     touch.clientY,
    alpha: 1,
    size:  Math.random() * 14 + 8,
    emoji: TRAIL_EMOJIS[Math.floor(Math.random() * TRAIL_EMOJIS.length)],
    vx:    (Math.random() - 0.5) * 1.5,
    vy:    -(Math.random() * 2 + 0.5),
  });
}, { passive: true });

function drawCursorTrail() {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

  for (let i = trailParticles.length - 1; i >= 0; i--) {
    const p = trailParticles[i];
    cursorCtx.globalAlpha = p.alpha;
    cursorCtx.font        = `${p.size}px serif`;
    cursorCtx.fillText(p.emoji, p.x - p.size / 2, p.y);

    p.x     += p.vx;
    p.y     += p.vy;
    p.alpha -= 0.038;
    p.size  *= 0.97;

    if (p.alpha <= 0) trailParticles.splice(i, 1);
  }

  cursorCtx.globalAlpha = 1;
  requestAnimationFrame(drawCursorTrail);
}
drawCursorTrail();


// ── 3. FLOATING HEARTS (background) ─────────────────────────────

const floatHeartsContainer = document.getElementById('float-hearts');
const HEART_ICONS = ['💙', '✨', '💫', '⭐', '🌟', '💎'];

function spawnFloatingHeart() {
  const el = document.createElement('span');
  el.className   = 'fheart';
  el.textContent = HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)];

  const duration = Math.random() * 10 + 10;
  el.style.left            = `${Math.random() * 100}%`;
  el.style.fontSize        = `${Math.random() * 18 + 10}px`;
  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay    = `${Math.random() * 2}s`;
  el.style.setProperty('--drift', `${Math.random() * 90 - 45}px`);

  floatHeartsContainer.appendChild(el);
  setTimeout(() => el.remove(), (duration + 3) * 1000);
}

setInterval(spawnFloatingHeart, 1400);
for (let i = 0; i < 10; i++) setTimeout(spawnFloatingHeart, i * 400);


// ── 4. CONFETTI BURST ────────────────────────────────────────────

const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx    = confettiCanvas.getContext('2d');

function resizeConfettiCanvas() {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

const CONFETTI_COLORS  = ['#4fc3ff', '#80c8ff', '#ffffff', '#a8d8ff', '#ffe070', '#ff9de2', '#c8a0ff', '#70ffbe'];
const confettiParticles = [];
let confettiRunning    = false;

function burst(x, y, count = 65) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
    const speed = Math.random() * 9 + 4;
    confettiParticles.push({
      x, y,
      vx:     Math.cos(angle) * speed,
      vy:     Math.sin(angle) * speed - Math.random() * 6,
      alpha:  1,
      color:  CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size:   Math.random() * 7 + 3,
      shape:  Math.random() > 0.45 ? 'circle' : 'rect',
      rot:    Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.22,
      gravity: 0.14 + Math.random() * 0.1,
    });
  }
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    confettiCtx.save();
    confettiCtx.globalAlpha = p.alpha;
    confettiCtx.fillStyle   = p.color;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);

    if (p.shape === 'circle') {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    } else {
      confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }

    confettiCtx.restore();
    p.x     += p.vx;
    p.y     += p.vy;
    p.vy    += p.gravity;
    p.alpha -= 0.011;
    p.rot   += p.rotSpd;

    if (p.alpha <= 0) confettiParticles.splice(i, 1);
  }

  if (confettiParticles.length > 0) {
    requestAnimationFrame(drawConfetti);
  } else {
    confettiRunning = false;
  }
}

function launchConfetti() {
  const cx = confettiCanvas.width / 2;
  const cy = confettiCanvas.height / 2;
  burst(cx,       cy,       80);
  burst(cx * 0.3, cy * 0.5, 45);
  burst(cx * 1.7, cy * 0.5, 45);
  burst(cx * 0.6, cy * 1.3, 30);
  burst(cx * 1.4, cy * 1.3, 30);
  if (!confettiRunning) {
    confettiRunning = true;
    drawConfetti();
  }
}


// ── 5. MELODY (Web Audio API) ────────────────────────────────────

function playMelody() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes    = [261.63, 329.63, 392, 440, 523.25, 659.25]; // C major arpeggio

    notes.forEach((freq, i) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode   = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type          = 'sine';
      oscillator.frequency.value = freq;

      const startTime = audioCtx.currentTime + i * 0.28;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.1);
      oscillator.start(startTime);
      oscillator.stop(startTime + 1.2);
    });
  } catch (e) {
    // AudioContext not supported — silent fail
  }
}


// ── 6. OPEN / CLOSE LETTER ───────────────────────────────────────

const PARAGRAPH_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'sign', 'letter-gallery'];
const MAIN_SELECTORS = ['.scene', '.bottom-img-wrap', '.title-text'];

function hideMainContent() {
  MAIN_SELECTORS.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.visibility = 'hidden';
  });
}

function showMainContent() {
  MAIN_SELECTORS.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.visibility = '';
  });
}

function openLetter() {
  document.getElementById('envelope').classList.add('opening');

  setTimeout(() => {
    hideMainContent();
    document.getElementById('overlay').classList.add('show');
    launchConfetti();
    playMelody();

    PARAGRAPH_IDS.forEach((id, index) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.classList.add('visible');
      }, 350 + index * 320);
    });
  }, 650);
}

function closeLetter() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('envelope').classList.remove('opening');
  showMainContent();

  PARAGRAPH_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('visible');
  });
}

document.getElementById('envelope').addEventListener('click', openLetter);
document.getElementById('envelope').addEventListener('touchend', e => {
  e.preventDefault();
  openLetter();
});
document.getElementById('close-btn').addEventListener('click', closeLetter);
document.getElementById('overlay').addEventListener('click', function (e) {
  if (e.target === this) closeLetter();
});


// ── 7. LIGHTBOX ──────────────────────────────────────────────────

function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('show');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', function (e) {
  if (e.target === this) closeLightbox();
});
