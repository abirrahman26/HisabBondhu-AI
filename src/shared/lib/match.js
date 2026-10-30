/**
 * String matching and entity resolution for products and customers.
 * Handles:
 * - Case-insensitive and trimmed comparisons.
 * - Bangla / English normalization.
 * - Bengali digits to ASCII conversion (e.g. ৫০০ -> 500).
 * - Aliases matching (e.g. "chini" -> "Sugar (চিনি)").
 */

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

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

  if (Array.isArray(aliases)) {
    for (const alias of aliases) {
      const normAlias = normalizeString(alias);
      if (normAlias === normQuery || normAlias.includes(normQuery) || normQuery.includes(normAlias)) {
        return true;
      }
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
    return { status: 'ambiguous', matches };
  }
  return { status: 'none', matches: [] };
}
