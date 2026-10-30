/**
 * String matching and entity resolution for products and customers.
 * Handles:
 * - Case-insensitive and trimmed comparisons.
 * - Bangla / English normalization.
 * - Bengali digits to ASCII conversion (e.g. ৫০০ -> 500).
 * - Aliases matching (e.g. "chini" -> "Sugar (চিনি)").
 * - Common Bengali/English phonetic transliteration pairs.
 */

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

const COMMON_TRANSLITERATION_MAP = [
  ['rahim', 'রহিম'],
  ['karim', 'করিম'],
  ['nasima', 'নাসিমা'],
  ['sumon', 'সুমন'],
  ['sugar', 'চিনি', 'chini'],
  ['rice', 'চাল', 'ভাত', 'chal'],
  ['oil', 'তেল', 'tel', 'soybean'],
  ['salt', 'লবণ', 'lobon'],
  ['dal', 'ডাল', 'daal', 'lentil'],
];

export function parseBengaliDigits(str) {
  if (typeof str !== 'string') return str;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const idx = BN_DIGITS.indexOf(char);
    if (idx !== -1) {
      result += idx.toString();
    } else {
      result += char;
    }
  }
  return result;
}

export function normalizeString(str = '') {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase();
}

export function matchName(candidateName = '', query = '', aliases = []) {
  const normQuery = normalizeString(query);
  if (!normQuery) return false;

  const normCandidate = normalizeString(candidateName);
  if (normCandidate === normQuery) return true;
  if (normCandidate.includes(normQuery) || normQuery.includes(normCandidate)) return true;

  // Check custom aliases
  if (Array.isArray(aliases)) {
    for (const alias of aliases) {
      const normAlias = normalizeString(alias);
      if (normAlias === normQuery || normAlias.includes(normQuery) || normQuery.includes(normAlias)) {
        return true;
      }
    }
  }

  // Check common transliteration equivalences
  for (const group of COMMON_TRANSLITERATION_MAP) {
    const inCandidate = group.some((term) => normCandidate.includes(term));
    const inQuery = group.some((term) => normQuery.includes(term));
    if (inCandidate && inQuery) {
      return true;
    }
  }

  return false;
}

export function resolveEntity(entities = [], query = '') {
  const normQuery = normalizeString(query);
  if (!normQuery) return { status: 'none', matches: [] };

  const matches = entities.filter((e) => matchName(e.name, normQuery, e.aliases));

  if (matches.length === 1) {
    return { status: 'match', match: matches[0], matches };
  }
  if (matches.length > 1) {
    // If one of the matches has the exact name, prioritize it
    const exact = matches.find((m) => normalizeString(m.name) === normQuery);
    if (exact && matches.length === 1) {
      return { status: 'match', match: exact, matches: [exact] };
    }
    return { status: 'ambiguous', matches };
  }
  return { status: 'none', matches: [] };
}
