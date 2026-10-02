/**
 * تنظیمات کلی جشن و اطلاعات مراسم
 * Wedding Configuration & Details - Pantea & Hossein
 */
export const weddingConfig = {
  // مشخصات زوجین
  couple: {
    bride: "پانته‌آ",
    groom: "حسین",
    fullName: "پانته‌آ و حسین",
    monogram: "پ & ح",
    parentsBride: "خانواده‌های محترم بنی اسد آزاد",
    parentsGroom: "خانواده‌های محترم صانعی",
  },

  // شعار / بیت آغازین
  introPoem: {
    verse1: "ما در آستانه‌ی آغاز راهی ایستاده‌ایم",
    verse2: "که نامش زندگی‌ست و چراغش عشق",
    header: "به نام خالق هستی",
    subtitle: "با قلبی آکنده از شوق، آغاز این سفر مشترک را در کنار شما جشن می‌گیریم"
  },

  // تاریخ و زمان برگزاری
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

  // تصویر اصلی کارت دعوت عروسی (تصویر استاتیک)
  cardImage: "./card.webp",

  // تنظیمات دسترسی: فقط مهمانان دارای پیوند اختصاصی معتبر اجازه مشاهده کارت را دارند
  requireGuestLink: true,

  // محل برگزاری و مسیریابی
  venue: {
    name: "عمارت ملک جهان",
    hall: "سالن اختصاصی تشریفات",
    address: "کرمان، بلوار جمهوری، کوچه ۳۳، عمارت ملک جهان",
    city: "کرمان",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=عمارت+ملک+جهان+کرمان+بلوار+جمهوری",
    neshanUrl: "https://neshan.org/maps/search/تالار%20عمارت%20ملک%20جهان%20کرمان",
    baladUrl: "https://balad.ir/p/PTqyxKjJ1yKx3s"
  },

  // زمان‌بندی بخش‌های مراسم
  timeline: [
    { time: "۱۸:۳۰", title: "ورود و پذیرایی", desc: "استقبال از مهمانان گرامی با نوشیدنی و شیرینی" },
    { time: "۱۹:۳۰", title: "مراسم عقد و پیوند آسمانی", desc: "ثبت لحظه باشکوه پیمان و حلقه" },
    { time: "۲۱:۰۰", title: "صرف شام و برش کیک", desc: "ضیافت شام به افتخار مهمانان عزیز" },
    { time: "۲۲:۳۰", title: "جشن و پایکوبی", desc: "شب خاطره‌انگیز رقص، موسیقی و شادمانی" }
  ],

  // متن‌های پیش‌فرض و پیام‌های خوش‌آمدگویی
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
};

