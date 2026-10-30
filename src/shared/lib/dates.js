/**
 * Date calculations and timezone helpers for HisabBondhu AI.
 * Rules:
 * - Timezone: Asia/Dhaka (UTC+6) (D-15).
 * - dateKey format: YYYY-MM-DD in Dhaka time.
 * - Week start: Saturday (Bangladesh standard business week) (D-15).
 */

export function getDhakaDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  // Format to Asia/Dhaka parts
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d); // Returns YYYY-MM-DD
}

export function getDhakaStartOfWeek(date = new Date()) {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  // Get Dhaka parts to construct local date
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(d);

  const partMap = {};
  for (const p of parts) {
    partMap[p.type] = p.value;
  }

  // Weekday mapping: Saturday is 0 in BD business week
  const dayName = partMap.weekday; // Sat, Sun, Mon, Tue, Wed, Thu, Fri
  const dayOffsets = {
    'Sat': 0,
    'Sun': 1,
    'Mon': 2,
    'Tue': 3,
    'Wed': 4,
    'Thu': 5,
    'Fri': 6,
  };

  const offset = dayOffsets[dayName] || 0;
  // Create a Date representing midnight Dhaka for this day
  const year = parseInt(partMap.year, 10);
  const month = parseInt(partMap.month, 10) - 1;
  const day = parseInt(partMap.day, 10);

  // Subtract offset days in UTC/local calculation
  const startDay = new Date(Date.UTC(year, month, day - offset, 0, 0, 0));
  const sYear = startDay.getUTCFullYear();
  const sMonth = String(startDay.getUTCMonth() + 1).padStart(2, '0');
  const sDate = String(startDay.getUTCDate()).padStart(2, '0');

  return `${sYear}-${sMonth}-${sDate}`;
}

export function getDhakaWeekRange(date = new Date()) {
  const startDateKey = getDhakaStartOfWeek(date);
  const parts = startDateKey.split('-');
  const startDay = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) + 6));
  const eYear = startDay.getUTCFullYear();
  const eMonth = String(startDay.getUTCMonth() + 1).padStart(2, '0');
  const eDate = String(startDay.getUTCDate()).padStart(2, '0');
  const endDateKey = `${eYear}-${eMonth}-${eDate}`;

  return {
    startDateKey,
    endDateKey,
  };
}

export function isDateKeyInPeriod(dateKey, period = 'today', referenceDate = new Date()) {
  const todayKey = getDhakaDateKey(referenceDate);
  if (period === 'today') {
    return dateKey === todayKey;
  }
  if (period === 'week') {
    const startOfWeek = getDhakaStartOfWeek(referenceDate);
    return dateKey >= startOfWeek && dateKey <= todayKey;
  }
  if (period === 'month') {
    const startOfMonth = todayKey.slice(0, 7) + '-01';
    return dateKey >= startOfMonth && dateKey <= todayKey;
  }
  return false;
}
