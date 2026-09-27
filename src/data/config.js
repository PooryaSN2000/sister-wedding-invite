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
    parentsBride: "خانواده‌های محترم احمدی",
    parentsGroom: "خانواده‌های محترم حسینی",
  },

  // شعار / بیت آغازین
  introPoem: {
    verse1: "در تمنای نگاهت که پر از باران است",
    verse2: "دل ما تا ابدیت به هم آمیخته است",
    header: "به نام پیوند‌دهنده دل‌ها",
    subtitle: "با قلبی آکنده از شوق، آغاز این سفر مشترک را در کنار شما جشن می‌گیریم"
  },

  // تاریخ و زمان برگزاری
  date: {
    solarDayName: "پنج‌شنبه",
    solarDate: "۲۴ مهرماه ۱۴۰۴",
    gregorianDate: "16 October 2025",
    time: "ساعت ۱۸:۳۰ الی ۲۳:۳۰",
    calendarReminder: {
      title: "جشن ازدواج پانته‌آ و حسین",
      description: "باغ تالار عمارت بهشت",
      startDate: "20251016T150000Z",
      endDate: "20251016T200000Z"
    }
  },

  // تصویر اصلی کارت دعوت عروسی (تصویر استاتیک)
  // مسیر پیش‌فرض روی فایل SVG نمونه تنظیم شده و هر زمان مایل باشید می‌توانید فایل عکس خود را جایگزین کنید
  cardImage: "./card-placeholder.svg",

  // تنظیمات دسترسی: فقط مهمانان دارای پیوند اختصاصی معتبر اجازه مشاهده کارت را دارند
  requireGuestLink: true,

  // محل برگزاری و مسیریابی
  venue: {
    name: "باغ تالار عمارت بهشت",
    hall: "سالن رویال و باغ اختصاصی",
    address: "تهران، گرمدره، انتهای خیابان کوهک، کوچه شقایق، باغ تالار عمارت بهشت",
    city: "تهران / البرز",
    // مختصات جغرافیایی تالار
    coordinates: {
      lat: 35.73812,
      lng: 51.04583
    },
    // لینک‌های مستقیم مسیریابی
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.73812,51.04583",
    neshanUrl: "https://neshan.org/maps/@35.73812,51.04583,16z",
    baladUrl: "https://balad.ir/location?latitude=35.73812&longitude=51.04583"
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

