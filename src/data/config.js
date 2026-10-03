/**
 * تنظیمات کلی جشن و اطلاعات مراسم (حنابندان و عروسی)
 * Event Configuration - Pantea & Hossein
 * Supports multiple ceremonies (Hana & Wedding) with easy switching
 */

export const events = {
  // ۱. مراسم حنابندان (رویداد فعال فعلی)
  hana: {
    id: "hana",
    eventName: "جشن حنابندان",
    title: "دعوت‌نامه جشن حنابندان | پانته‌آ و حسین",
    theme: "theme-hana", // تم قرمز یاقوتی و طلایی
    requireGuestLink: false, // بدون نیاز به لینک یا نام مهمان
    showGuestHonor: false,   // بدون نمایش کادر نام مهمان در بالای کارت
    audioSrc: "./music-hana.mp3?v=19s",
    audioTitle: "آرمین ام سی - حنابندان",
    cardImageWebp: "./card-hana.webp",
    cardImageFallback: "./card-hana.jpeg",
    cardAlt: "کارت دعوت جشن حنابندان پانته‌آ و حسین",
    
    // مشخصات زوجین
    couple: {
      bride: "پانته‌آ",
      groom: "حسین",
      fullName: "پانته‌آ و حسین",
      monogram: "پ & ح",
    },

    // تاریخ و زمان برگزاری
    date: {
      solarDayName: "پنج‌شنبه",
      solarDate: "۱۶ مهرماه",
      time: "از ساعت ۱۹ تا پاسی از شب",
    },

    // محل برگزاری و مسیریابی
    venue: {
      name: "باغ بناحسینی",
      city: "بردسیر",
      address: "بردسیر، میدان امام خمینی، بلوار شهید دستغیب، بلوار شهید خسروی، سمت چپ، کوچه مظفر گنجی زاده، باغ بناحسینی",
      googleMapsUrl: "https://maps.app.goo.gl/3QHCoZSJya4eQtWK7?g_st=atm",
      neshanUrl: "https://neshan.org/maps/places/7bhf0npjTAca",
      baladUrl: "https://balad.ir/location?latitude=29.935799&longitude=56.555067"
    },

    // رنگ‌های پرتاب شادباش (یاقوتی، طلایی گرم، زرشکی، شامپاینی)
    confettiColors: ['#C92A36', '#E5A93C', '#7A1D24', '#FCD581', '#FAF0DC'],

    messages: {
      envelopeHint: "برای گشودن دعوت‌نامه لمس کنید",
      neshanBtn: "مسیریابی با نشان",
      googleMapsBtn: "مسیریابی در گوگل مپ",
      musicToggleOn: "پخش موسیقی",
      musicToggleOff: "قطع موسیقی"
    }
  },

  // ۲. مراسم عروسی (نسخه اصلی که پس از حنابندان فعال خواهد شد)
  wedding: {
    id: "wedding",
    eventName: "جشن ازدواج",
    title: "دعوت‌نامه رسمی جشن ازدواج | پانته‌آ و حسین",
    theme: "theme-wedding", // تم بنفش، ارغوانی و یاسی
    requireGuestLink: true, // فقط با لینک اختصاصی مهمان
    showGuestHonor: true,   // نمایش کتیبه اختصاصی نام مهمان در بالای کارت
    audioSrc: "./music.mp3",
    audioTitle: "شاه پسر داریم دوماد",
    cardImageWebp: "./card.webp",
    cardImageFallback: "./card.png",
    cardAlt: "کارت دعوت عروسی پانته‌آ و حسین",

    couple: {
      bride: "پانته‌آ",
      groom: "حسین",
      fullName: "پانته‌آ و حسین",
      monogram: "پ & ح",
      parentsBride: "خانواده‌های محترم بنی اسد آزاد",
      parentsGroom: "خانواده‌های محترم صانعی",
    },

    introPoem: {
      verse1: "ما در آستانه‌ی آغاز راهی ایستاده‌ایم",
      verse2: "که نامش زندگی‌ست و چراغش عشق",
      header: "به نام خالق هستی",
      subtitle: "با قلبی آکنده از شوق، آغاز این سفر مشترک را در کنار شما جشن می‌گیریم"
    },

    date: {
      solarDayName: "پنج‌شنبه",
      solarDate: "۲۳ مهرماه ۱۴۰۵",
      gregorianDate: "15 October 2026",
      time: "از ساعت ۱۹:۰۰",
      calendarReminder: {
        title: "جشن ازدواج پانته‌آ و حسین",
        description: "عمارت ملک جهان",
        startDate: "20261015T153000Z",
        endDate: "20261015T203000Z"
      }
    },

    venue: {
      name: "عمارت ملک جهان",
      hall: "سالن اختصاصی تشریفات",
      address: "کرمان، بلوار جمهوری، کوچه ۳۳، عمارت ملک جهان",
      city: "کرمان",
      googleMapsUrl: "https://maps.app.goo.gl/fyic1aBuS65Lavu56",
      neshanUrl: "https://neshan.org/maps/places/6e91284abbdc4eff5afd7d629e2afba0#c30.274-57.009-18z-0p",
      baladUrl: "https://balad.ir/p/PTqyxKjJ1yKx3s"
    },

    timeline: [
      { time: "۱۸:۳۰", title: "ورود و پذیرایی", desc: "استقبال از مهمانان گرامی با نوشیدنی و شیرینی" },
      { time: "۱۹:۳۰", title: "مراسم عقد و پیوند آسمانی", desc: "ثبت لحظه باشکوه پیمان و حلقه" },
      { time: "۲۱:۰۰", title: "صرف شام و برش کیک", desc: "ضیافت شام به افتخار مهمانان عزیز" },
      { time: "۲۲:۳۰", title: "جشن و پایکوبی", desc: "شب خاطره‌انگیز رقص، موسیقی و شادمانی" }
    ],

    confettiColors: ['#8E5E98', '#BA9CBA', '#D8C2E2', '#D4AF37', '#FAF6FC'],

    messages: {
      genericGuestName: "مهمان ارجمند و گرامی",
      genericCompanions: "به همراه خانواده محترم",
      guestGreetingPrefix: "این دعوت‌نامه با کمال احترام تقدیم می‌شود به:",
      guestGreetingSubtitle: "حضور گرم و صمیمانه شما، زیباترین هدیه و برکت آغاز پیوند ما خواهد بود.",
      envelopeHint: "برای گشودن دعوت‌نامه لمس کنید",
      neshanBtn: "مسیریابی با نشان",
      googleMapsBtn: "مسیریابی در گوگل مپ",
      musicToggleOn: "پخش موسیقی",
      musicToggleOff: "قطع موسیقی"
    }
  }
};

/**
 * رویداد پیش‌فرض: 'hana' برای مراسم حنابندان
 * برای بازگرداندن مراسم عروسی در آینده، فقط کافیست این مقدار به 'wedding' تغییر کند.
 */
export const DEFAULT_EVENT = 'hana';

export function getActiveEvent() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventParam = urlParams.get('event');
  if (eventParam && events[eventParam]) {
    return events[eventParam];
  }
  return events[DEFAULT_EVENT];
}

export const weddingConfig = getActiveEvent();
