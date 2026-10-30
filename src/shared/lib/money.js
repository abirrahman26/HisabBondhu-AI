/**
 * Money calculations and formatting for HisabBondhu AI.
 * Rules:
 * - All stored currency values are positive/zero integer BDT (D-10).
 * - Line total = Math.round(qty * unitPrice).
 * - Total sale = Sum of line totals.
 */

export function roundMoney(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return 0;
  return Math.round(amount);
}

export function calcLineTotal(qty, unitPrice) {
  const q = Number(qty) || 0;
  const p = Number(unitPrice) || 0;
  return Math.round(q * p);
}

export function calcSaleTotal(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);
}

export function formatMoney(amount) {
  const val = Number(amount) || 0;
  return `৳${val.toLocaleString('en-BD')}`;
}
