/**
 * Customer balance and baki ledger calculation.
 * Rules:
 * - Stored ledger entries: type = 'credit' (baki given) or 'payment' (repayment received).
 * - Balance = Σ(credit) − Σ(payment).
 * - Advance = negative balance (when customer overpays).
 */

export function calcCustomerBalance(entries = []) {
  let totalCredit = 0;
  let totalPayment = 0;

  for (const entry of entries) {
    const amt = Number(entry.amount) || 0;
    if (entry.type === 'credit') {
      totalCredit += amt;
    } else if (entry.type === 'payment') {
      totalPayment += amt;
    }
  }

  return Math.round(totalCredit - totalPayment);
}

export function calcAllBalances(customers = [], ledgerEntries = []) {
  // Map customerId -> array of entries
  const customerMap = new Map();
  for (const customer of customers) {
    customerMap.set(customer.id, {
      ...customer,
      balance: 0,
    });
  }

  for (const entry of ledgerEntries) {
    const cust = customerMap.get(entry.customerId);
    if (cust) {
      const amt = Number(entry.amount) || 0;
      if (entry.type === 'credit') {
        cust.balance += amt;
      } else if (entry.type === 'payment') {
        cust.balance -= amt;
      }
    }
  }

  return Array.from(customerMap.values());
}

export function calcTotalBaki(customerBalances = []) {
  return customerBalances.reduce((sum, c) => {
    return sum + (c.balance > 0 ? c.balance : 0);
  }, 0);
}

export function getTopDebtors(customerBalances = [], limit = 5) {
  return customerBalances
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit);
}
