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
let isCardFlipped = false;

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
  const guestHonorSection = document.getElementById('guest-honor-section');
  const venueActionBox = document.getElementById('venue-action-box');
  const topNav = document.querySelector('.top-nav');
  const musicCueToast = document.getElementById('music-cue-toast');

  // ۱. اگر مهمان در لیست نباشد و دسترسی بدون لینک غیرمجاز باشد
  if (!currentGuest) {
    if (gatefoldWrapper) gatefoldWrapper.style.display = 'none';
    if (guestHonorSection) guestHonorSection.style.display = 'none';
    if (venueActionBox) venueActionBox.style.display = 'none';
    if (unauthorizedCard) unauthorizedCard.style.display = 'flex';
    if (topNav) topNav.style.display = 'none';
    if (musicCueToast) musicCueToast.style.display = 'none';

    pauseWeddingMusic();
    return;
  }

  // ۲. مهمان معتبر است؛ نمایش کامل کارت دعوت اختصاصی
  if (gatefoldWrapper) gatefoldWrapper.style.display = 'block';
  if (guestHonorSection) guestHonorSection.style.display = 'flex';
  if (unauthorizedCard) unauthorizedCard.style.display = 'none';
  if (topNav) topNav.style.display = 'flex';
  if (musicCueToast) musicCueToast.style.display = 'flex';

  // سرآغاز و پیام خوش‌آمدگویی
  const introHeader = document.getElementById('intro-header');
  if (introHeader) introHeader.textContent = weddingConfig.introPoem.header;

  const greetingPrefix = document.getElementById('guest-greeting-prefix');
  if (greetingPrefix) greetingPrefix.textContent = weddingConfig.messages.guestGreetingPrefix;

  // بنر اختصاصی نام مهمان دعوت‌شده در بالای کارت
  const guestDisplayEl = document.getElementById('guest-display-name');
  const guestCompanionsEl = document.getElementById('guest-companions');

  if (guestDisplayEl) guestDisplayEl.textContent = currentGuest.name;
  if (guestCompanionsEl) {
    guestCompanionsEl.textContent = currentGuest.companions || '';
    guestCompanionsEl.style.display = currentGuest.companions ? 'inline-block' : 'none';
  }

  // بارگذاری تصویر کارت استاتیک با هندل کردن اسکلتون
  const cardImg = document.getElementById('wedding-card-image');
  const cardSkeleton = document.getElementById('card-image-skeleton');
  if (cardImg && weddingConfig.cardImage) {
    cardImg.src = weddingConfig.cardImage;
    if (cardImg.complete) {
      if (cardSkeleton) cardSkeleton.style.display = 'none';
      cardImg.classList.add('loaded');
    } else {
      cardImg.onload = () => {
        if (cardSkeleton) cardSkeleton.style.display = 'none';
        cardImg.classList.add('loaded');
      };
      cardImg.onerror = () => {
        if (cardSkeleton) {
          cardSkeleton.innerHTML = '<span class="skeleton-text">تصویر کارت در دسترس نیست</span>';
        }
      };
    }
  }

  // اطلاعات مکان و نشانی تالار
  const venueNameEl = document.getElementById('card-venue-name');
  if (venueNameEl) venueNameEl.textContent = weddingConfig.venue.name;

  const venueAddressEl = document.getElementById('venue-address');
  if (venueAddressEl) venueAddressEl.textContent = weddingConfig.venue.address;

  // لینک‌های مسیریابی: نشان و گوگل مپ
  const neshanLink = document.getElementById('neshan-map-link');
  if (neshanLink) neshanLink.href = weddingConfig.venue.neshanUrl;

  const googleMapsLink = document.getElementById('google-maps-link');
  if (googleMapsLink) googleMapsLink.href = weddingConfig.venue.googleMapsUrl;
}

/**
 * انیمیشن گشودن درهای دو لنگه پنجره‌ای (Gatefold Open)
 */
function openGate() {
  if (!currentGuest || isGateOpened) return;
  isGateOpened = true;

  const wrapper = document.getElementById('gatefold-wrapper');
  const venueBox = document.getElementById('venue-action-box');

  // پخش صدای گشودن و شروع آهنگ جشن
  playDoorOpenSound();
  playWeddingMusic();

  // گشودن لنگه‌های چپ و راست با چرخش سه‌بعدی
  if (wrapper) {
    wrapper.classList.add('gate-opened');
  }

  // فعال‌سازی و برجسته‌سازی بخش مسیریابی و دکمه عکس یادگاری پس از باز شدن
  const flipActionWrap = document.getElementById('card-flip-action-wrap');
  if (flipActionWrap) {
    flipActionWrap.classList.add('revealed');
  }

  if (venueBox) {
    venueBox.classList.add('revealed');
  }

  // پرتاب شادباش گلبرگ و ذرات درخشان پس از گشوده شدن آرام کارت
  setTimeout(() => {
    triggerCelebrationConfetti();
  }, 1300);
}

/**
 * ورق زدن سه‌بعدی کارت و جابجایی بین متن دعوت‌نامه و پرتره عروس و داماد
 */
function toggleCardFlip() {
  const cardInterior = document.getElementById('card-interior');
  const flipText = document.getElementById('flip-text');
  const flipIcon = document.getElementById('flip-icon');
  if (!cardInterior) return;

  isCardFlipped = !isCardFlipped;
  if (isCardFlipped) {
    cardInterior.classList.add('is-flipped');
    if (flipText) flipText.textContent = 'مشاهده متن دعوت‌نامه';
    if (flipIcon) flipIcon.textContent = '📜';
  } else {
    cardInterior.classList.remove('is-flipped');
    if (flipText) flipText.textContent = 'عکس یادگاری عروس و داماد';
    if (flipIcon) flipIcon.textContent = '🤍';
  }
}

/**
 * بازگرداندن کارت به حالت بسته (درهای بسته)
 */
function closeGate() {
  isGateOpened = false;
  const wrapper = document.getElementById('gatefold-wrapper');
  const venueBox = document.getElementById('venue-action-box');
  const flipActionWrap = document.getElementById('card-flip-action-wrap');

  if (wrapper) {
    wrapper.classList.remove('gate-opened');
  }
  if (venueBox) {
    venueBox.classList.remove('revealed');
  }
  if (flipActionWrap) {
    flipActionWrap.classList.remove('revealed');
  }

  // اگر کارت ورق زده شده بود، به حالت روی کارت بازگردد
  if (isCardFlipped) {
    toggleCardFlip();
  }
}

/**
 * جلوه شادباش با رنگ‌های طلایی و یاقوتی
 */
function triggerCelebrationConfetti() {
  const count = 55;
  const defaults = {
    origin: { y: 0.65 },
    colors: ['#8E5E98', '#BA9CBA', '#D8C2E2', '#D4AF37', '#FAF6FC']
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
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.65);
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
      color: Math.random() > 0.4 ? 'rgba(174, 144, 174, 0.5)' : 'rgba(196, 168, 206, 0.45)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // بلورهای بنفش و کریستالی
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
      ctx.fillStyle = `rgba(186, 156, 196, ${Math.max(0.15, Math.min(0.85, p.opacity))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(186, 156, 196, 0.6)';
      ctx.fill();
    });

    // گلبرگ‌های لطیف بنفش و یاسی
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
      ctx.shadowColor = 'rgba(142, 94, 152, 0.2)';
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

  // ورق زدن کارت با کلید تعاملی
  const cardFlipBtn = document.getElementById('card-flip-btn');
  if (cardFlipBtn) {
    cardFlipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCardFlip();
    });
  }

  // بازگشت با لمس روی تصویر پشت کارت
  const cardFaceBack = document.getElementById('card-face-back');
  if (cardFaceBack) {
    cardFaceBack.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isCardFlipped) {
        toggleCardFlip();
      }
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
