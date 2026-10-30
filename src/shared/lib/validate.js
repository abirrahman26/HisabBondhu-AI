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

  const keys = Object.keys(args);
  for (const k of keys) {
    if (!allowedKeys.includes(k)) {
      return { valid: false, error: `Disallowed argument: ${k}` };
    }
  }

  const rawAmt = args.amount;
  if (typeof rawAmt !== 'number' || !Number.isInteger(rawAmt) || rawAmt <= 0) {
    return { valid: false, error: 'Amount must be a positive integer' };
  }
  if (rawAmt > 10000000) {
    return { valid: false, error: 'Amount exceeds maximum allowed limit (৳10,000,000)' };
  }

  if (!args.customerRef && (!args.customerName || typeof args.customerName !== 'string' || !args.customerName.trim())) {
    return { valid: false, error: 'Customer identifier is required' };
  }

  if (args.note && (typeof args.note !== 'string' || args.note.length > 200)) {
    return { valid: false, error: 'Note must be at most 200 characters' };
  }

  return { valid: true };
}

export function validateEmail(email = '') {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password = '') {
  if (typeof password !== 'string') return false;
  return password.length >= 6;
}

export function validatePhone(phone = '') {
  const p = String(phone).trim();
  // Accepts 01XXXXXXXXX or +8801XXXXXXXXX
  return /^(?:\+8801|01)[3-9]\d{8}$/.test(p);
}

export function validateProductForm(data = {}) {
  const { name, sellPrice, buyPrice, stock } = data;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { valid: false, error: 'পণ্যের নাম প্রয়োজন (Product name is required)' };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'পণ্যের নাম ১০০ অক্ষরের মধ্যে হতে হবে (Max 100 characters)' };
  }
  if (typeof sellPrice !== 'number' || sellPrice <= 0 || sellPrice > 1000000) {
    return { valid: false, error: 'সঠিক বিক্রয় মূল্য দিন (Valid selling price required)' };
  }
  if (typeof buyPrice === 'number' && (buyPrice < 0 || buyPrice > 1000000)) {
    return { valid: false, error: 'সঠিক ক্রয় মূল্য দিন (Valid buying price required)' };
  }
  if (typeof stock === 'number' && stock < 0) {
    return { valid: false, error: 'স্টক সংখ্যা ঋণাত্মক হতে পারে না (Stock cannot be negative)' };
  }
  return { valid: true };
}

export function isOverpayment(paymentAmount, currentBalance) {
  return typeof paymentAmount === 'number' && typeof currentBalance === 'number' && paymentAmount > currentBalance;
}

export function validatePaymentAmount(amount, balance) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'সঠিক টাকার পরিমাণ দিন (Amount must be greater than zero)' };
  }
  return { valid: true };
}

export function validateSaleItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'অন্তত একটি পণ্য নির্বাচন করুন (Select at least one product)' };
  }
  for (const item of items) {
    if (!item.productId || typeof item.qty !== 'number' || item.qty <= 0) {
      return { valid: false, error: 'সঠিক পরিমাণ ও পণ্য নির্বাচন করুন (Valid item & quantity required)' };
    }
  }
  return { valid: true };
}

export function checkDuplicatePayment(recentLedger = [], customerId, amount, currentTime = Date.now()) {
  if (!Array.isArray(recentLedger)) return false;
  const tenMinutesMs = 10 * 60 * 1000;
  return recentLedger.some((entry) => {
    if (entry.customerId !== customerId || entry.amount !== amount || entry.type !== 'payment') {
      return false;
    }
    const entryTime = new Date(entry.createdAt).getTime();
    return Math.abs(currentTime - entryTime) <= tenMinutesMs;
  });
}

