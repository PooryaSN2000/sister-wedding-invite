import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const baseUrl = 'https://panteahossein.ir/';

// خواندن مهمانان از src/data/guests.json یا guests.json
const guestsJsonPath = fs.existsSync(path.join(rootDir, 'src/data/guests.json'))
  ? path.join(rootDir, 'src/data/guests.json')
  : path.join(rootDir, 'guests.json');

const guests = JSON.parse(fs.readFileSync(guestsJsonPath, 'utf8'));

// ۱. همگام‌سازی فایل‌های JSON در هر دو مسیر
const formattedJson = JSON.stringify(guests, null, 2);
fs.writeFileSync(path.join(rootDir, 'src/data/guests.json'), formattedJson, 'utf8');
fs.writeFileSync(path.join(rootDir, 'guests.json'), formattedJson, 'utf8');

// ۲. ساخت فایل اکسل guests.xlsx
const excelRows = guests.map((g, index) => ({
  'ردیف': index + 1,
  'شناسه لینک (ID)': g.id,
  'نام و عنوان مهمان': g.name,
  'همراهان': g.companions || 'بدون همراه',
  'طرف': g.side || 'مشترک',
  'لینک اختصاصی دعوت‌نامه': `${baseUrl}?to=${g.id}`
}));

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(excelRows);
ws['!cols'] = [
  { wch: 6 },
  { wch: 24 },
  { wch: 38 },
  { wch: 25 },
  { wch: 15 },
  { wch: 65 }
];
XLSX.utils.book_append_sheet(wb, ws, 'مهمانان عروسی');
XLSX.writeFile(wb, path.join(rootDir, 'guests.xlsx'));

// ۳. ساخت فایل guests_links.txt
let txtContent = '=================================================================================\n';
txtContent += '✨ لیست لینک‌های اختصاصی کارت دعوت عروسی پانته‌آ و حسین ✨\n';
txtContent += `آدرس پایه سایت: ${baseUrl}\n`;
txtContent += `تعداد کل مهمانان: ${guests.length} نفر / خانواده\n`;
txtContent += '=================================================================================\n\n';

guests.forEach((g, index) => {
  const companionText = g.companions ? ` (${g.companions})` : '';
  const sideText = g.side ? ` [${g.side}]` : '';
  txtContent += `${index + 1}. ${g.name}${companionText}${sideText}\n`;
  txtContent += `   🔗 لینک اختصاصی: ${baseUrl}?to=${g.id}\n\n`;
});

txtContent += '=================================================================================\n';
txtContent += 'نکته: برای اضافه کردن مهمان جدید، کافیست فایل guests.json را ویرایش کرده و دستور زیر را اجرا کنید:\n';
txtContent += 'npm run generate-links\n';
txtContent += '=================================================================================\n';

fs.writeFileSync(path.join(rootDir, 'guests_links.txt'), txtContent, 'utf8');

console.log(`✓ با موفقیت لینک‌های ${guests.length} مهمان تولید و در guests.xlsx و guests_links.txt ذخیره شد.`);
