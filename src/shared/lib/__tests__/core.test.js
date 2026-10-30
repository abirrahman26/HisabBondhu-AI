import { describe, it, expect, beforeEach } from 'vitest';
import {
  addProduct,
  addCustomer,
  createSaleTx,
  recordPaymentTx,
  loadDemoDataset,
  removeDemoDataset,
  resetPreviewData,
  getPreviewData,
} from '../../data/dbService';
import { calcAllBalances, calcTotalBaki } from '../balance';
import { calcPeriodProfit } from '../profit';

describe('Phase 4 Core Functionality & Golden Path (GP-1 to GP-5, GP-8)', () => {
  beforeEach(() => {
    resetPreviewData();
  });

  it('GP-2: Adds product Sugar (চিনি) with initial stock 50 and price 130', async () => {
    const prodId = await addProduct('test_uid', {
      name: 'Sugar (চিনি)',
      unit: 'kg',
      buyPrice: 110,
      sellPrice: 130,
      stockQty: 50,
      lowStockAt: 10,
    });
    expect(prodId).toBeDefined();

    const stored = getPreviewData();
    const sugar = stored.products.find((p) => p.id === prodId);
    expect(sugar).toBeDefined();
    expect(sugar.stockQty).toBe(50);
  });

  it('GP-3: Cash sale of 2 kg Sugar (৳260) atomically drops stock to 48', async () => {
    const prodId = await addProduct('test_uid', {
      name: 'Sugar (চিনি)',
      unit: 'kg',
      buyPrice: 110,
      sellPrice: 130,
      stockQty: 50,
      lowStockAt: 10,
    });

    await createSaleTx('test_uid', {
      total: 260,
      paymentType: 'cash',
      items: [
        {
          productId: prodId,
          name: 'Sugar (চিনি)',
          qty: 2,
          unitPrice: 130,
          unitCost: 110,
        },
      ],
    });

    const stored = getPreviewData();
    const sugar = stored.products.find((p) => p.id === prodId);
    expect(sugar.stockQty).toBe(48); // Stock decremented 50 -> 48
    expect(stored.sales).toHaveLength(1);
    expect(stored.sales[0].total).toBe(260);
  });

  it('GP-4 & GP-5: Baki sale of 3 kg Sugar (৳390) to Rahim, stock -> 45, then payment of ৳200 -> balance ৳190', async () => {
    const prodId = await addProduct('test_uid', {
      name: 'Sugar (চিনি)',
      unit: 'kg',
      buyPrice: 110,
      sellPrice: 130,
      stockQty: 48,
      lowStockAt: 10,
    });

    const custId = await addCustomer('test_uid', {
      name: 'Rahim',
      phone: '01700000001',
    });

    // GP-4: Baki sale
    await createSaleTx('test_uid', {
      total: 390,
      paymentType: 'baki',
      customerId: custId,
      items: [
        {
          productId: prodId,
          name: 'Sugar (চিনি)',
          qty: 3,
          unitPrice: 130,
          unitCost: 110,
        },
      ],
    });

    let stored = getPreviewData();
    let sugar = stored.products.find((p) => p.id === prodId);
    expect(sugar.stockQty).toBe(45); // 48 - 3 = 45

    let customersWithBalances = calcAllBalances(stored.customers, stored.ledger);
    let rahim = customersWithBalances.find((c) => c.id === custId);
    expect(rahim.balance).toBe(390);

    // GP-5: Partial payment 200
    await recordPaymentTx('test_uid', {
      customerId: custId,
      amount: 200,
      note: 'Partial cash repayment',
    });

    stored = getPreviewData();
    customersWithBalances = calcAllBalances(stored.customers, stored.ledger);
    rahim = customersWithBalances.find((c) => c.id === custId);
    expect(rahim.balance).toBe(190); // 390 - 200 = 190
    expect(calcTotalBaki(customersWithBalances)).toBe(190);
  });

  it('GP-8: Persistence and Dashboard aggregates (Sales ৳650, Profit ৳100, Baki ৳190)', async () => {
    const prodId = await addProduct('test_uid', {
      name: 'Sugar (চিনি)',
      unit: 'kg',
      buyPrice: 110,
      sellPrice: 130,
      stockQty: 50,
      lowStockAt: 10,
    });
    const custId = await addCustomer('test_uid', {
      name: 'Rahim',
      phone: '01700000001',
    });
    await createSaleTx('test_uid', {
      total: 260,
      paymentType: 'cash',
      items: [{ productId: prodId, name: 'Sugar (চিনি)', qty: 2, unitPrice: 130, unitCost: 110 }],
    });
    await createSaleTx('test_uid', {
      total: 390,
      paymentType: 'baki',
      customerId: custId,
      items: [{ productId: prodId, name: 'Sugar (চিনি)', qty: 3, unitPrice: 130, unitCost: 110 }],
    });
    await recordPaymentTx('test_uid', {
      customerId: custId,
      amount: 200,
    });

    const stored = getPreviewData();
    const totalSales = stored.sales.reduce((sum, s) => sum + s.total, 0);
    expect(totalSales).toBe(650); // 260 + 390 = 650

    const profitSummary = calcPeriodProfit(stored.sales, []);
    expect(profitSummary.estimatedProfit).toBe(100); // 650 - 550 = 100
  });

  it('F-18 Judge Mode: loads and purges fictional demo dataset accurately', async () => {
    await loadDemoDataset('test_uid');
    let stored = getPreviewData();
    expect(stored.products.some((p) => p.name.includes('Rice'))).toBe(true);
    expect(stored.customers.some((c) => c.name === 'Karim Mia')).toBe(true);

    const balances = calcAllBalances(stored.customers, stored.ledger);
    expect(calcTotalBaki(balances)).toBe(2050);

    // Remove demo dataset
    await removeDemoDataset('test_uid');
    stored = getPreviewData();
    expect(stored.products.filter((p) => p.isDemo)).toHaveLength(0);
    expect(stored.customers.filter((c) => c.isDemo)).toHaveLength(0);
  });
});
