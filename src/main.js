/**
 * منطق اصلی دعوت‌نامه دیجیتال پنجره‌ای عروسی - پانته‌آ و حسین
 * Gatefold Luxury Wedding Invitation Logic - Pantea & Hossein
 * 100% Client-side compatible for GitHub Pages
 */

import { weddingConfig } from './data/config.js';
import { guestsList, getGuestById } from './data/guests.js';
import confetti from 'canvas-confetti';

// متغیرهای وضعیت
let currentGuest = null;
let isGateOpened = false;
let isMusicPlaying = false;

/**
 * دریافت پارامتر مهمان از URL
 * Supports: ?to=guest-id or ?guest=guest-id or hash #/invite/guest-id
 */
function getGuestParamFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const toParam = urlParams.get('to') || urlParams.get('guest');
  if (toParam) return toParam;

  const hash = window.location.hash;
  if (hash) {
    const cleanHash = hash.replace(/^#\/?(invite\/)?/, '');
    if (cleanHash) return cleanHash;
  }
  return null;
}

/**
 * مقداردهی اولیه اطلاعات در صفحه بر اساس تنظیمات و مهمان
 */
function initializeContent() {
  const guestId = getGuestParamFromUrl();
  currentGuest = getGuestById(guestId);

  const gatefoldWrapper = document.getElementById('gatefold-wrapper');
  const unauthorizedCard = document.getElementById('unauthorized-card');
  const topNav = document.querySelector('.top-nav');
  const musicCueToast = document.getElementById('music-cue-toast');

  // ۱. اگر مهمان در لیست نباشد یا لینکی وارد نشده باشد، دسترسی به کارت مسدود می‌شود
  if (!currentGuest) {
    if (gatefoldWrapper) gatefoldWrapper.style.display = 'none';
    if (unauthorizedCard) unauthorizedCard.style.display = 'flex';
    if (topNav) topNav.style.display = 'none';
    if (musicCueToast) musicCueToast.style.display = 'none';

    // توقف هرگونه صدای پس‌زمینه
    pauseWeddingMusic();
    return;
  }

  // ۲. مهمان معتبر است؛ نمایش کامل کارت دعوت اختصاصی
  if (gatefoldWrapper) gatefoldWrapper.style.display = 'block';
  if (unauthorizedCard) unauthorizedCard.style.display = 'none';
  if (topNav) topNav.style.display = 'flex';
  if (musicCueToast) musicCueToast.style.display = 'flex';

  // سرآغاز و اشعار
  const introHeader = document.getElementById('intro-header');
  if (introHeader) introHeader.textContent = weddingConfig.introPoem.header;
  const verse1 = document.getElementById('intro-verse1');
  if (verse1) verse1.textContent = weddingConfig.introPoem.verse1;
  const verse2 = document.getElementById('intro-verse2');
  if (verse2) verse2.textContent = weddingConfig.introPoem.verse2;
  const coupleNameEl = document.getElementById('couple-name');
  if (coupleNameEl) coupleNameEl.textContent = weddingConfig.couple.fullName;
  const subtitleEl = document.getElementById('intro-subtitle');
  if (subtitleEl) subtitleEl.textContent = weddingConfig.introPoem.subtitle;

  // بنر اختصاصی نام مهمان روی صفحه اصلی کارت
  const guestDisplayEl = document.getElementById('guest-display-name');
  const guestCompanionsEl = document.getElementById('guest-companions');

  if (guestDisplayEl) guestDisplayEl.textContent = currentGuest.name;
  if (guestCompanionsEl) {
    guestCompanionsEl.textContent = currentGuest.companions || '';
    guestCompanionsEl.style.display = currentGuest.companions ? 'inline-block' : 'none';
  }

  // اطلاعات زمان و مکان در کارت
  const dateDayEl = document.getElementById('card-date-day');
  if (dateDayEl) dateDayEl.textContent = weddingConfig.date.solarDate;
  const dateGregorianEl = document.getElementById('card-date-gregorian');
  if (dateGregorianEl) dateGregorianEl.textContent = weddingConfig.date.gregorianDate;
  const timeEl = document.getElementById('card-time');
  if (timeEl) timeEl.textContent = weddingConfig.date.time;
  const venueNameEl = document.getElementById('card-venue-name');
  if (venueNameEl) venueNameEl.textContent = weddingConfig.venue.name;

  // نشانی و لینک گوگل مپ
  const venueAddressEl = document.getElementById('venue-address');
  if (venueAddressEl) venueAddressEl.textContent = weddingConfig.venue.address;
  const mapLink = document.getElementById('google-maps-link');
  if (mapLink) mapLink.href = weddingConfig.venue.googleMapsUrl;
}

/**
 * انیمیشن گشودن درهای دو لنگه پنجره‌ای (Gatefold Open)
 */
function openGate() {
  if (!currentGuest || isGateOpened) return;
  isGateOpened = true;

  const wrapper = document.getElementById('gatefold-wrapper');

  // پخش صدای گشودن و شروع آهنگ جشن
  playDoorOpenSound();
  playWeddingMusic();

  // گشودن لنگه‌های چپ و راست با چرخش سه‌بعدی
  if (wrapper) {
    wrapper.classList.add('gate-opened');
  }

  // پرتاب شادباش گلبرگ و ذرات درخشان
  setTimeout(() => {
    triggerCelebrationConfetti();
  }, 400);
}

/**
 * بازگرداندن کارت به حالت بسته (درهای بسته)
 */
function closeGate() {
  isGateOpened = false;
  const wrapper = document.getElementById('gatefold-wrapper');
  if (wrapper) {
    wrapper.classList.remove('gate-opened');
  }
}

/**
 * جلوه شادباش با رنگ‌های طلایی و یاقوتی
 */
function triggerCelebrationConfetti() {
  const count = 55;
  const defaults = {
    origin: { y: 0.65 },
    colors: ['#C5A059', '#F0D597', '#FBF0D8', '#8C2534', '#FAF6EF']
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 42 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 35 });
}

/**
 * افکت صوتی باز شدن درهای دو لنگه با Web Audio API
 */
function playDoorOpenSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Policy
  }
}

/**
 * مدیریت پخش موسیقی جشن (شاه پسر داریم دوماد)
 */
function getAudioElement() {
  return document.getElementById('wedding-audio');
}

function updateMusicUi(playing) {
  const musicBtn = document.getElementById('music-toggle');
  const musicText = document.getElementById('music-text');
  const musicIcon = document.getElementById('music-icon');
  const toast = document.getElementById('music-cue-toast');

  if (playing) {
    if (musicBtn) {
      musicBtn.classList.add('playing');
      musicIcon.textContent = '🔊';
      musicText.textContent = 'قطع موسیقی';
    }
    if (toast) toast.classList.add('fade-out');
  } else {
    if (musicBtn) {
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicText.textContent = 'پخش موسیقی';
    }
  }
}

function playWeddingMusic() {
  const audio = getAudioElement();
  if (!audio) return;

  audio.volume = 0.9;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isMusicPlaying = true;
        updateMusicUi(true);
      })
      .catch(() => {
        isMusicPlaying = false;
        updateMusicUi(false);
      });
  }
}

function pauseWeddingMusic() {
  const audio = getAudioElement();
  if (!audio) return;
  audio.pause();
  isMusicPlaying = false;
  updateMusicUi(false);
}

function toggleBackgroundMusic() {
  const audio = getAudioElement();
  if (!audio) return;

  if (audio.paused) {
    playWeddingMusic();
  } else {
    pauseWeddingMusic();
  }
}

/**
 * تنظیم پخش خودکار با ورود به سایت
 */
function setupAutoplayMusic() {
  // اگر مهمان نامعتبر باشد یا لینکی ارسال نشده باشد، موزیک پخش نشود
  if (!currentGuest) return;

  // ۱. تلاش فوری برای پخش خودکار هنگام لود
  playWeddingMusic();

  // ۲. در صورتی که مرورگر مانع شود، با اولین لمس، کلیک یا اسکرول بلافاصله پخش می‌شود
  const triggerAudioOnFirstGesture = () => {
    if (!currentGuest) return;
    const audio = getAudioElement();
    if (audio && audio.paused) {
      playWeddingMusic();
    }
  };

  ['click', 'touchstart', 'pointerdown', 'mousedown', 'scroll'].forEach((event) => {
    window.addEventListener(event, triggerAudioOnFirstGesture, { once: true, passive: true });
  });
}

/**
 * ذرات شناور در پس‌زمینه (گرد طلایی و گلبرگ‌های عاشقانه گل رز)
 */
function setupAmbientParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // ۱. ذرات گرد طلایی
  const sparklesCount = 26;
  const sparkles = [];
  for (let i = 0; i < sparklesCount; i++) {
    sparkles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.35 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });
  }

  // ۲. گلبرگ‌های رز
  const petalsCount = 14;
  const petals = [];
  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? 'rgba(230, 185, 175, 0.45)' : 'rgba(242, 215, 195, 0.5)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // گرد طلایی
    sparkles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197, 160, 89, ${Math.max(0.15, Math.min(0.85, p.opacity))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(236, 200, 128, 0.6)';
      ctx.fill();
    });

    // گلبرگ‌های رز
    petals.forEach((petal) => {
      petal.y += petal.speedY;
      petal.x += Math.sin(Date.now() * petal.oscillationSpeed + petal.oscillationOffset) * 0.5 + petal.speedX;
      petal.rotation += petal.rotSpeed;

      if (petal.y > height + 20) {
        petal.y = -20;
        petal.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-petal.size / 2, -petal.size / 2, -petal.size / 2, petal.size / 2, 0, petal.size);
      ctx.bezierCurveTo(petal.size / 2, petal.size / 2, petal.size / 2, -petal.size / 2, 0, 0);
      ctx.fillStyle = petal.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(215, 160, 140, 0.2)';
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  render();
}

/**
 * تنظیم رویدادها و شنوندگان دکمه‌ها
 */
function setupEventListeners() {
  const gatefoldWrapper = document.getElementById('gatefold-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const resetBtn = document.getElementById('reset-btn');
  const musicBtn = document.getElementById('music-toggle');

  // گشودن درها با لمس هر نقطه از کارت در حالت بسته
  if (gatefoldWrapper) {
    gatefoldWrapper.addEventListener('click', () => {
      if (!isGateOpened) {
        openGate();
      }
    });
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isGateOpened) {
        openGate();
      }
    });
  }

  // بستن درها و بازگشت به حالت اولیه
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeGate();
    });
  }

  // کنترل موسیقی
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBackgroundMusic();
    });
  }

  window.addEventListener('popstate', () => {
    initializeContent();
  });
}

// راه‌اندازی با بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
  initializeContent();
  setupEventListeners();
  setupAmbientParticles();
  setupAutoplayMusic();
});
