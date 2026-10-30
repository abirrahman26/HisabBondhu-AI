/**
 * Schema and tool argument validator for HisabBondhu AI.
 * Strict CEL / schema bounds check.
 */

export function isValidBDPhone(phone = '') {
  const p = String(phone).trim();
  return /^01\d{9}$/.test(p);
}

export function isValidName(name = '', maxLen = 60) {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= maxLen;
}

export function validateBakiArgs(args, allowedKeys = ['customerName', 'customerNameAlt', 'customerRef', 'amount', 'note']) {
  if (!args || typeof args !== 'object') {
    return { valid: false, error: 'Arguments must be an object' };
  }

  // Reject unexpected keys
  const keys = Object.keys(args);
  for (const k of keys) {
    if (!allowedKeys.includes(k)) {
      return { valid: false, error: `Disallowed argument: ${k}` };
    }
  }

  // Validate amount
  const rawAmt = args.amount;
  if (typeof rawAmt !== 'number' || !Number.isInteger(rawAmt) || rawAmt <= 0) {
    return { valid: false, error: 'Amount must be a positive integer' };
  }
  if (rawAmt > 10000000) {
    return { valid: false, error: 'Amount exceeds maximum allowed limit (৳10,000,000)' };
  }

  // Must have either customerRef or customerName
  if (!args.customerRef && (!args.customerName || typeof args.customerName !== 'string' || !args.customerName.trim())) {
    return { valid: false, error: 'Customer identifier is required' };
  }

  if (args.note && (typeof args.note !== 'string' || args.note.length > 200)) {
    return { valid: false, error: 'Note must be at most 200 characters' };
  }

  return { valid: true };
}
