import guestsData from './guests.json';

/**
 * فهرست مهمانان اختصاصی مراسم (بارگذاری شده از فایل JSON)
 * Personalized Guests List loaded from guests.json
 */
export const guestsList = guestsData;

/**
 * دریافت اطلاعات مهمان بر اساس شناسه
 * Lookup guest by identifier
 * @param {string|null} id
 * @returns {object|null}
 */
export function getGuestById(id) {
  if (!id) return null;
  const cleanId = decodeURIComponent(id).trim().toLowerCase();
  return (
    guestsList.find(
      (g) =>
        g.id.toLowerCase() === cleanId ||
        (Array.isArray(g.aliases) && g.aliases.some((a) => a.toLowerCase() === cleanId))
    ) || null
  );
}
