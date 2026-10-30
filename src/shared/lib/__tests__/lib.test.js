import { describe, it, expect } from 'vitest';
import { roundMoney, calcLineTotal, calcSaleTotal, formatMoney } from '../money.js';
import { getDhakaDateKey, getDhakaStartOfWeek, isDateKeyInPeriod } from '../dates.js';
import { calcCustomerBalance, calcAllBalances, calcTotalBaki, getTopDebtors } from '../balance.js';
import { calcSaleProfit, calcPeriodProfit } from '../profit.js';
import { parseBengaliDigits, matchName, resolveEntity } from '../match.js';
import { isValidBDPhone, isValidName, validateBakiArgs } from '../validate.js';

describe('shared/lib/money.js (UT-1, UT-2)', () => {
  it('UT-1: calculates line total with fractional quantity and rounds to integer BDT', () => {
    // 0.5 kg at ৳130 = ৳65
    expect(calcLineTotal(0.5, 130)).toBe(65);
    // 0.333 kg at ৳130 = 43.29 -> 43
    expect(calcLineTotal(0.333, 130)).toBe(43);
    // 2 kg Sugar at ৳130 (GP-3)
    expect(calcLineTotal(2, 130)).toBe(260);
    // 3 kg Sugar at ৳130 (GP-4)
    expect(calcLineTotal(3, 130)).toBe(390);
  });

  it('UT-2: computes total sale from sum of line totals (GP-3, GP-4)', () => {
    const saleItems = [
      { productId: 'p1', lineTotal: 260 },
      { productId: 'p2', lineTotal: 390 },
    ];
    expect(calcSaleTotal(saleItems)).toBe(650);
  });

  it('formats currency correctly with BDT symbol', () => {
    expect(formatMoney(650)).toBe('৳650');
  });
});

describe('shared/lib/balance.js (UT-3)', () => {
  it('UT-3: customer balance equals sum of credits minus payments (390 - 200 = 190; + 500 = 690)', () => {
    // GP-4: baki 390
    const entries = [{ type: 'credit', amount: 390 }];
    expect(calcCustomerBalance(entries)).toBe(390);

    // GP-5: partial payment 200
    entries.push({ type: 'payment', amount: 200 });
    expect(calcCustomerBalance(entries)).toBe(190);

    // GP-7: additional baki 500
    entries.push({ type: 'credit', amount: 500 });
    expect(calcCustomerBalance(entries)).toBe(690);
  });

  it('handles customer overpayment as advance (negative balance)', () => {
    const entries = [
      { type: 'credit', amount: 100 },
      { type: 'payment', amount: 150 },
    ];
    expect(calcCustomerBalance(entries)).toBe(-50);
  });

  it('sorts top debtors descending by balance', () => {
    const balances = [
      { id: 'c1', name: 'Rahim', balance: 190 },
      { id: 'c2', name: 'Karim Mia', balance: 1200 },
      { id: 'c3', name: 'Nasima Begum', balance: 850 },
    ];
    const top = getTopDebtors(balances, 2);
    expect(top).toHaveLength(2);
    expect(top[0].name).toBe('Karim Mia');
    expect(top[1].name).toBe('Nasima Begum');
    expect(calcTotalBaki(balances)).toBe(2240);
  });
});

describe('shared/lib/profit.js (UT-4)', () => {
  it('UT-4: computes estimated profit from sales and unit costs (650 - 550 = 100)', () => {
    // 2 kg Sugar sold at 130, cost 110: profit = 2 * (130 - 110) = 40
    // 3 kg Sugar sold at 130, cost 110: profit = 3 * (130 - 110) = 60
    // Total profit = 100
    const sales = [
      {
        total: 260,
        items: [{ qty: 2, unitPrice: 130, unitCost: 110, lineTotal: 260 }],
      },
      {
        total: 390,
        items: [{ qty: 3, unitPrice: 130, unitCost: 110, lineTotal: 390 }],
      },
    ];
    const summary = calcPeriodProfit(sales, []);
    expect(summary.totalSales).toBe(650);
    expect(summary.totalCost).toBe(550);
    expect(summary.estimatedProfit).toBe(100);
  });

  it('subtracts expenses from period profit', () => {
    const sales = [{ total: 1000, items: [{ qty: 10, unitPrice: 100, unitCost: 60 }] }];
    const expenses = [{ amount: 150 }];
    const summary = calcPeriodProfit(sales, expenses);
    // Gross = 1000 - 600 = 400. Net = 400 - 150 = 250.
    expect(summary.estimatedProfit).toBe(250);
  });
});

describe('shared/lib/dates.js (UT-5, UT-6)', () => {
  it('UT-5: generates correct dateKey in Asia/Dhaka around midnight', () => {
    // UTC 2026-10-31T17:59:00Z is 2026-10-31 23:59:00 in Dhaka (UTC+6)
    const lateNight = new Date('2026-10-31T17:59:00Z');
    expect(getDhakaDateKey(lateNight)).toBe('2026-10-31');

    // UTC 2026-10-31T18:01:00Z is 2026-11-01 00:01:00 in Dhaka (UTC+6)
    const earlyMorning = new Date('2026-10-31T18:01:00Z');
    expect(getDhakaDateKey(earlyMorning)).toBe('2026-11-01');
  });

  it('UT-6: computes Saturday as start of week for Bangladesh', () => {
    // 2026-10-31 is a Saturday in Dhaka
    const sat = new Date('2026-10-31T06:00:00Z');
    expect(getDhakaStartOfWeek(sat)).toBe('2026-10-31');

    // 2026-11-04 is Wednesday; week start is the preceding Saturday 2026-10-31
    const wed = new Date('2026-11-04T06:00:00Z');
    expect(getDhakaStartOfWeek(wed)).toBe('2026-10-31');
  });
});

describe('shared/lib/match.js (UT-7, Bengali Digits)', () => {
  it('UT-7: matches product names across English, Bangla, and aliases', () => {
    const aliases = ['chini', 'sugar'];
    expect(matchName('Sugar (চিনি)', 'chini', aliases)).toBe(true);
    expect(matchName('Sugar (চিনি)', 'চিনি', aliases)).toBe(true);
    expect(matchName('Sugar (চিনি)', 'sugar', aliases)).toBe(true);
    expect(matchName('Sugar (চিনি)', 'dal', aliases)).toBe(false);
  });

  it('converts Bengali digits to standard ASCII numerals', () => {
    expect(parseBengaliDigits('৫০০')).toBe('500');
    expect(parseBengaliDigits('১২৫০')).toBe('1250');
  });

  it('resolves entities and flags ambiguity', () => {
    const customers = [
      { id: 'c1', name: 'Rahim' },
      { id: 'c2', name: 'Rahim Sheikh' },
      { id: 'c3', name: 'Karim' },
    ];
    // Exact/partial match on 'Karim'
    expect(resolveEntity(customers, 'Karim').status).toBe('match');
    // Ambiguous match on 'Rahim'
    const res = resolveEntity(customers, 'Rahim');
    expect(res.status).toBe('ambiguous');
    expect(res.matches).toHaveLength(2);
  });
});

describe('shared/lib/validate.js (UT-8)', () => {
  it('UT-8: rejects extra unexpected arguments in tool calls', () => {
    const res = validateBakiArgs({
      customerName: 'Rahim',
      amount: 500,
      maliciousField: 'exploit',
    });
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Disallowed argument');
  });

  it('UT-8: rejects negative and floating point amounts', () => {
    expect(validateBakiArgs({ customerName: 'Rahim', amount: -500 }).valid).toBe(false);
    expect(validateBakiArgs({ customerName: 'Rahim', amount: 50.5 }).valid).toBe(false);
    expect(validateBakiArgs({ customerName: 'Rahim', amount: 0 }).valid).toBe(false);
    expect(validateBakiArgs({ customerName: 'Rahim', amount: 20000000 }).valid).toBe(false);
  });

  it('validates Bangladeshi phone numbers', () => {
    expect(isValidBDPhone('01700000000')).toBe(true);
    expect(isValidBDPhone('01812345678')).toBe(true);
    expect(isValidBDPhone('12345')).toBe(false);
    expect(isValidBDPhone('02700000000')).toBe(false);
  });
});
