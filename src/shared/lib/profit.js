/**
 * Profit calculations for HisabBondhu AI.
 * Rules (D-16):
 * - Estimated profit (period) = Σ(qty × (unitPrice − unitCost)) over sales dated in period − expenses dated in period.
 * - Baki sales count when sold; repayments are not income.
 * - unitCost snapshots buyPrice at sale time.
 * - Always labeled "estimated" in the UI.
 */

export function calcSaleProfit(sale) {
  if (!sale || !Array.isArray(sale.items)) return 0;
  return sale.items.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const unitCost = Number(item.unitCost) || 0;
    const itemProfit = Math.round(qty * (unitPrice - unitCost));
    return sum + itemProfit;
  }, 0);
}

export function calcPeriodProfit(sales = [], expenses = []) {
  let grossProfit = 0;
  let totalSales = 0;
  let totalCost = 0;

  for (const sale of sales) {
    totalSales += Number(sale.total) || 0;
    if (Array.isArray(sale.items)) {
      for (const item of sale.items) {
        const qty = Number(item.qty) || 0;
        const unitCost = Number(item.unitCost) || 0;
        totalCost += Math.round(qty * unitCost);
      }
    }
  }

  grossProfit = totalSales - totalCost;

  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const estimatedProfit = grossProfit - totalExpenses;

  return {
    totalSales,
    totalCost,
    totalExpenses,
    estimatedProfit: Math.round(estimatedProfit),
  };
}
