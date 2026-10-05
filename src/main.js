/**
 * منطق اصلی دعوت‌نامه دیجیتال پنجره‌ای (حنابندان و عروسی) - پانته‌آ و حسین
 * Gatefold Luxury Event Invitation Logic - Pantea & Hossein
 * 100% Client-side compatible for GitHub Pages
 */

import { weddingConfig, getActiveEvent } from './data/config.js';
import { getGuestById } from './data/guests.js';
import confetti from 'canvas-confetti';

// متغیرهای وضعیت
let currentGuest = null;
let isGateOpened = false;
let isMusicPlaying = false;
let currentConfig = getActiveEvent();
let currentFlipAngle = 0;
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
  currentConfig = getActiveEvent();

  // ۱. تنظیم عنوان صفحه و کلاس تم روی body
  document.title = currentConfig.title;
  document.body.classList.remove('theme-wedding', 'theme-hana');
  document.body.classList.add(currentConfig.theme);

  // ۲. به‌روزرسانی گرادیان تذهیب SVG بر اساس تم
  const foilGold = document.getElementById('foilGold');
  if (foilGold) {
    if (currentConfig.id === 'hana') {
      foilGold.innerHTML = `
        <stop offset="0%" stop-color="#FAF0DC"/>
        <stop offset="35%" stop-color="#CCA46A"/>
        <stop offset="70%" stop-color="#8E6B34"/>
        <stop offset="100%" stop-color="#FAF0DC"/>
      `;
    } else {
      foilGold.innerHTML = `
        <stop offset="0%" stop-color="#EADBEE"/>
        <stop offset="35%" stop-color="#AF7BB9"/>
        <stop offset="70%" stop-color="#6F347B"/>
        <stop offset="100%" stop-color="#C596CF"/>
      `;
    }
  }

  const gatefoldWrapper = document.getElementById('gatefold-wrapper');
  const unauthorizedCard = document.getElementById('unauthorized-card');
  const guestHonorSection = document.getElementById('guest-honor-section');
  const venueActionBox = document.getElementById('venue-action-box');
  const topNav = document.querySelector('.top-nav');
  const musicCueToast = document.getElementById('music-cue-toast');

  // ۳. بررسی دسترسی مهمان (در حنابندان نیازی به لینک نیست و برای همه باز است)
  if (currentConfig.requireGuestLink) {
    const guestId = getGuestParamFromUrl();
    currentGuest = getGuestById(guestId);

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
  } else {
    // حنابندان: دعوت عمومی بدون نیاز به اسم اختصاصی
    currentGuest = { id: 'all', name: '' };
  }

  // نمایش بخش‌های کارت
  if (gatefoldWrapper) gatefoldWrapper.style.display = 'block';
  if (unauthorizedCard) unauthorizedCard.style.display = 'none';
  if (topNav) topNav.style.display = 'flex';
  if (musicCueToast) musicCueToast.style.display = 'flex';

  // نمایش یا عدم نمایش کادر نام مهمان در بالای کارت
  if (guestHonorSection) {
    if (currentConfig.showGuestHonor && currentGuest && currentGuest.name) {
      guestHonorSection.style.display = 'flex';
      const guestDisplayEl = document.getElementById('guest-display-name');
      const guestCompanionsEl = document.getElementById('guest-companions');
      if (guestDisplayEl) guestDisplayEl.textContent = currentGuest.name;
      if (guestCompanionsEl) {
        guestCompanionsEl.textContent = currentGuest.companions || '';
        guestCompanionsEl.style.display = currentGuest.companions ? 'inline-block' : 'none';
      }
    } else {
      guestHonorSection.style.display = 'none';
    }
  }

  // ۴. بارگذاری فایل صوتی مربوط به رویداد
  const audio = getAudioElement();
  if (audio && currentConfig.audioSrc) {
    const targetFileName = currentConfig.audioSrc.replace(/^.*[\\\/]/, '').split('?')[0];
    const currentAudioFile = (audio.src || '').replace(/^.*[\\\/]/, '').split('?')[0];
    if (currentAudioFile !== targetFileName) {
      audio.src = currentConfig.audioSrc;
      audio.load();
    }
  }

  // ۵. بارگذاری تصویر کارت اختصاصی رویداد
  const cardImg = document.getElementById('wedding-card-image');
  const cardSource = document.getElementById('wedding-card-source');
  const cardSkeleton = document.getElementById('card-image-skeleton');

  if (cardSource && currentConfig.cardImageWebp) {
    cardSource.srcset = currentConfig.cardImageWebp;
  }
  if (cardImg && currentConfig.cardImageFallback) {
    cardImg.src = currentConfig.cardImageFallback;
    cardImg.alt = currentConfig.cardAlt;

    if (cardImg.complete && cardImg.naturalWidth > 0) {
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

  // ۶. لینک‌های مسیریابی: نشان و گوگل مپ
  const neshanLink = document.getElementById('neshan-map-link');
  if (neshanLink && currentConfig.venue?.neshanUrl) {
    neshanLink.href = currentConfig.venue.neshanUrl;
  }

  const googleMapsLink = document.getElementById('google-maps-link');
  if (googleMapsLink && currentConfig.venue?.googleMapsUrl) {
    googleMapsLink.href = currentConfig.venue.googleMapsUrl;
  }
}

/**
 * انیمیشن گشودن درهای دو لنگه پنجره‌ای (Gatefold Open)
 */
function openGate() {
  if (isGateOpened) return;
  if (currentConfig.requireGuestLink && !currentGuest) return;
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

  // فعال‌سازی بخش مسیریابی پس از باز شدن
  if (venueBox) {
    venueBox.classList.add('revealed');
  }

  // بررسی وضعیت نمایش نشانگر شناور اسکرول
  setTimeout(() => {
    updateScrollCueVisibility();
  }, 400);

  // پرتاب شادباش گلبرگ و ذرات درخشان پس از گشوده شدن آرام کارت
  setTimeout(() => {
    triggerCelebrationConfetti();
  }, 1300);
}

/**
 * چرخش ۳۶۰ درجه و پیوسته کارت (جابجایی بین عکس یادگاری و متن دعوت‌نامه)
 */
function toggleCardFlip() {
  const flipper = document.getElementById('card-flipper');
  const cardInterior = document.getElementById('card-interior');
  const flipText = document.getElementById('flip-text');
  const flipIcon = document.getElementById('flip-icon');
  if (!flipper || !cardInterior) return;

  isCardFlipped = !isCardFlipped;
  currentFlipAngle += 180;
  flipper.style.transform = `rotateY(${currentFlipAngle}deg)`;

  if (isCardFlipped) {
    cardInterior.classList.add('is-flipped');
    if (flipText) flipText.textContent = 'بازگشت به عکس عروس و داماد ↺';
    if (flipIcon) flipIcon.textContent = '🤍';
  } else {
    cardInterior.classList.remove('is-flipped');
    if (flipText) flipText.textContent = 'مشاهده متن دعوت‌نامه (چرخش ۳۶۰°) ↺';
    if (flipIcon) flipIcon.textContent = '📜';
  }
}

/**
 * بازگرداندن کارت به حالت بسته (درهای بسته)
 */
function closeGate() {
  isGateOpened = false;
  const wrapper = document.getElementById('gatefold-wrapper');
  const venueBox = document.getElementById('venue-action-box');
  const floatingCue = document.getElementById('floating-scroll-cue');

  if (wrapper) {
    wrapper.classList.remove('gate-opened');
  }
  if (venueBox) {
    venueBox.classList.remove('revealed');
  }
  if (floatingCue) {
    floatingCue.classList.remove('visible');
  }

  // اگر کارت چرخیده بود، به زاویه اولیه بازگردد
  if (isCardFlipped || currentFlipAngle !== 0) {
    isCardFlipped = false;
    currentFlipAngle = 0;
    const flipper = document.getElementById('card-flipper');
    const cardInterior = document.getElementById('card-interior');
    const flipText = document.getElementById('flip-text');
    const flipIcon = document.getElementById('flip-icon');
    if (cardInterior) cardInterior.classList.remove('is-flipped');
    if (flipText) flipText.textContent = 'مشاهده متن دعوت‌نامه (چرخش ۳۶۰°) ↺';
    if (flipIcon) flipIcon.textContent = '📜';
    if (flipper) {
      setTimeout(() => {
        flipper.style.transform = 'rotateY(0deg)';
      }, 500);
    }
  }
}

/**
 * جلوه شادباش متناسب با تم رویداد (حنابندان یا عروسی)
 */
function triggerCelebrationConfetti() {
  const count = 55;
  const defaults = {
    origin: { y: 0.65 },
    colors: currentConfig.confettiColors || ['#C92A36', '#E5A93C', '#7A1D24', '#FCD581', '#FAF0DC']
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
 * مدیریت پخش موسیقی جشن
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
  if (currentConfig.requireGuestLink && !currentGuest) return;

  // ۱. تلاش فوری برای پخش خودکار هنگام لود
  playWeddingMusic();

  // ۲. در صورتی که مرورگر مانع شود، با اولین لمس، کلیک یا اسکرول بلافاصله پخش می‌شود
  const triggerAudioOnFirstGesture = () => {
    if (currentConfig.requireGuestLink && !currentGuest) return;
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
 * ذرات شناور در پس‌زمینه (گرد طلایی و گلبرگ‌های شادباش)
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

  const isHana = currentConfig.id === 'hana';

  // ۱. ذرات گرد طلایی / نورانی
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

  // ۲. گلبرگ‌های لطیف
  const petalsCount = 14;
  const petals = [];
  const petalPalette = isHana 
    ? ['rgba(180, 45, 55, 0.45)', 'rgba(215, 80, 90, 0.40)', 'rgba(230, 185, 110, 0.35)']
    : ['rgba(174, 144, 174, 0.5)', 'rgba(196, 168, 206, 0.45)'];

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
      color: petalPalette[Math.floor(Math.random() * petalPalette.length)]
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // ذرات درخشان گرد نور
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
      ctx.fillStyle = isHana 
        ? `rgba(235, 195, 120, ${Math.max(0.15, Math.min(0.85, p.opacity))})`
        : `rgba(186, 156, 196, ${Math.max(0.15, Math.min(0.85, p.opacity))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = isHana ? 'rgba(235, 195, 120, 0.6)' : 'rgba(186, 156, 196, 0.6)';
      ctx.fill();
    });

    // گلبرگ‌های معلق
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
      ctx.shadowColor = isHana ? 'rgba(180, 45, 55, 0.25)' : 'rgba(142, 94, 152, 0.2)';
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

  // لمس روی عکس عروس و داماد برای چرخش به متن دعوت‌نامه
  const cardFaceFront = document.getElementById('card-face-front');
  if (cardFaceFront) {
    cardFaceFront.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isGateOpened) {
        openGate();
      } else if (!isCardFlipped) {
        toggleCardFlip();
      }
    });
  }

  // لمس روی متن دعوت‌نامه برای چرخش و بازگشت به عکس عروس و داماد
  const cardFaceBack = document.getElementById('card-face-back');
  if (cardFaceBack) {
    cardFaceBack.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isGateOpened) {
        openGate();
      } else if (isCardFlipped) {
        toggleCardFlip();
      }
    });
  }

  window.addEventListener('popstate', () => {
    initializeContent();
  });
}

/**
 * بررسی و به‌روزرسانی نمایش نشانگر شناور اسکرول به سمت نشانی و نقشه
 */
function updateScrollCueVisibility() {
  const floatingCue = document.getElementById('floating-scroll-cue');
  const venueBox = document.getElementById('venue-action-box');
  if (!floatingCue || !venueBox) return;

  if (!isGateOpened) {
    floatingCue.classList.remove('visible');
    return;
  }

  const rect = venueBox.getBoundingClientRect();
  // اگر بخش نشانی و دکمه‌ها زیر خط دید صفحه (viewport) قرار داشته باشد، نشانگر اسکرول نمایش داده می‌شود
  const isBelowFold = rect.top > window.innerHeight - 30;
  if (isBelowFold) {
    floatingCue.classList.add('visible');
  } else {
    floatingCue.classList.remove('visible');
  }
}

/**
 * راه‌اندازی شنونده‌های مربوط به نشانگر اسکرول
 */
function setupScrollIndicator() {
  const floatingCue = document.getElementById('floating-scroll-cue');
  const venueBox = document.getElementById('venue-action-box');
  if (floatingCue && venueBox) {
    floatingCue.addEventListener('click', (e) => {
      e.stopPropagation();
      venueBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  window.addEventListener('scroll', updateScrollCueVisibility, { passive: true });
  window.addEventListener('resize', updateScrollCueVisibility, { passive: true });
}

// راه‌اندازی با بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
  initializeContent();
  setupEventListeners();
  setupScrollIndicator();
  setupAmbientParticles();
  setupAutoplayMusic();
});
