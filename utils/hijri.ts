export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  "Jumada al-Thani",
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul Qa'dah",
  'Dhul Hijjah',
];

export const HIJRI_DAYS = ['Ahad', 'Ithnayn', 'Thulatha', "Arba'a", 'Khamis', "Jumu'ah", 'Sabt'];

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
}

export function toHijri(date: Date): HijriDate {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();

  // Gregorian → Julian Day Number (proleptic Gregorian calendar algorithm)
  const a = Math.floor((14 - m) / 12);
  const ye = y + 4800 - a;
  const me = m + 12 * a - 3;
  const jd =
    d +
    Math.floor((153 * me + 2) / 5) +
    365 * ye +
    Math.floor(ye / 4) -
    Math.floor(ye / 100) +
    Math.floor(ye / 400) -
    32045;

  // Julian Day → Hijri (tabular Islamic calendar algorithm)
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { year, month, day, monthName: HIJRI_MONTHS[month - 1] ?? '' };
}

export function formatHijri(h: HijriDate): string {
  return `${h.day} ${h.monthName} ${h.year} AH`;
}

export const ISLAMIC_EVENTS: Array<{ month: number; day: number; name: string }> = [
  { month: 1, day: 1, name: 'Islamic New Year' },
  { month: 1, day: 10, name: 'Ashura' },
  { month: 3, day: 12, name: 'Mawlid al-Nabi' },
  { month: 7, day: 27, name: "Laylat al-Mi'raj" },
  { month: 8, day: 15, name: "Laylat al-Bara'ah" },
  { month: 9, day: 1, name: 'Beginning of Ramadan' },
  { month: 9, day: 27, name: 'Laylat al-Qadr' },
  { month: 10, day: 1, name: 'Eid al-Fitr' },
  { month: 12, day: 9, name: 'Day of Arafah' },
  { month: 12, day: 10, name: 'Eid al-Adha' },
];

export function getUpcomingEvents(hijri: HijriDate): Array<{ name: string; daysUntil: string }> {
  return ISLAMIC_EVENTS.map((ev) => {
    let monthDiff = ev.month - hijri.month;
    let dayDiff = ev.day - hijri.day;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      monthDiff += 12;
    }
    const label =
      monthDiff === 0 && dayDiff === 0
        ? 'Today'
        : monthDiff === 0
        ? `In ${dayDiff} day${dayDiff !== 1 ? 's' : ''}`
        : `${HIJRI_MONTHS[ev.month - 1]} ${ev.day}`;
    return { name: ev.name, daysUntil: label };
  });
}
