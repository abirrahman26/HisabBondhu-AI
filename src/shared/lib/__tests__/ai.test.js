import { describe, it, expect } from 'vitest';
import { executeTool, processAssistantQuery } from '../../../assistant/toolDispatcher';

describe('Phase 5 Gemini Integration & AI Evaluation Cases (AI_Test_Cases.md)', () => {
  const mockShopData = {
    products: [
      { id: 'p1', name: 'Rice (Miniket)', unit: 'kg', buyPrice: 62, sellPrice: 70, stockQty: 100, lowStockAt: 20, active: true },
      { id: 'p2', name: 'Soybean Oil', unit: 'litre', buyPrice: 160, sellPrice: 175, stockQty: 8, lowStockAt: 10, active: true },
      { id: 'p3', name: 'Salt (লবণ)', unit: 'packet', buyPrice: 30, sellPrice: 36, stockQty: 40, lowStockAt: 10, active: true },
      { id: 'p4', name: 'Lentil (Masur Dal)', unit: 'kg', buyPrice: 110, sellPrice: 125, stockQty: 6, lowStockAt: 10, active: true },
    ],
    customers: [
      { id: 'c1', name: 'Karim Mia', phone: '01700000002', balance: 1200 },
      { id: 'c2', name: 'Nasima Begum', phone: '01700000003', balance: 850 },
      { id: 'c3', name: 'Rahim', phone: '01700000001', balance: 190 },
    ],
    sales: [
      { id: 's1', dateKey: '2026-10-31', total: 700, paymentType: 'cash' },
      { id: 's2', dateKey: '2026-10-31', total: 180, paymentType: 'mobile_banking', paymentLabel: 'bKash' },
    ],
    ledger: [],
    expenses: [],
  };

  it('AI-01: "Kar kache sob theke beshi baki ache?" returns top debtors sorted desc', async () => {
    const res = await processAssistantQuery('Kar kache sob theke beshi baki ache?', mockShopData);
    expect(res.text).toContain('Karim Mia');
    expect(res.text).toContain('1,200');
    expect(res.verifiedData).toBeDefined();
    expect(res.verifiedData.total).toBe(2240);
  });

  it('AI-02 & AI-04: Today sales queries reply in Bangla by default and English when asked in English', async () => {
    // Bangla query
    const bnRes = await processAssistantQuery('Aj koto bikri holo?', mockShopData);
    expect(bnRes.text).toContain('বিক্রি');
    expect(bnRes.verifiedData.total).toBe(880);

    // English query
    const enRes = await processAssistantQuery('How much did I sell today?', mockShopData);
    expect(enRes.text).toContain("Today's total sales");
    expect(enRes.verifiedData.total).toBe(880);
  });

  it('AI-03: "Ki ki jinis shesh hoye ashche?" lists low stock items accurately', async () => {
    const res = await processAssistantQuery('Ki ki jinis shesh hoye ashche?', mockShopData);
    expect(res.text).toContain('Soybean Oil');
    expect(res.text).toContain('Lentil (Masur Dal)');
    expect(res.verifiedData.items).toHaveLength(2);
  });

  it('AI-05 & GP-7: "Rahim ke 500 taka baki dilam" creates proposal card and does NOT write directly', async () => {
    const res = await processAssistantQuery('Rahim ke 500 taka baki dilam', mockShopData);
    expect(res.proposal).toBeDefined();
    expect(res.proposal.customerName).toBe('Rahim');
    expect(res.proposal.amount).toBe(500);
    expect(res.proposal.type).toBe('baki');
  });

  it('AI-06: Disambiguates two same-name customers with phone last-4 (OF-8)', async () => {
    const ambiguousShopData = {
      ...mockShopData,
      customers: [
        { id: 'c1', name: 'Rahim', phone: '01700000001', balance: 100 },
        { id: 'c2', name: 'Rahim Sheikh', phone: '01700000004', balance: 200 },
      ],
    };
    const res = await processAssistantQuery('Rahim ke 500 taka baki dilam', ambiguousShopData);
    expect(res.proposal).toBeUndefined(); // No proposal yet!
    expect(res.text).toContain('…0001');
    expect(res.text).toContain('…0004');
  });

  it('AI-07: "Karim 200 taka dilo" generates payment proposal', async () => {
    const res = await processAssistantQuery('Karim 200 taka dilo', mockShopData);
    expect(res.proposal).toBeDefined();
    expect(res.proposal.type).toBe('payment');
    expect(res.proposal.amount).toBe(200);
  });

  it('AI-10: "Rahim ke baki dilam" without amount asks for clarification', async () => {
    const res = await processAssistantQuery('Rahim ke baki dilam', mockShopData);
    expect(res.proposal).toBeUndefined();
    expect(res.text).toContain('কত টাকা');
  });

  it('AI-13: Blocks phone number and password requests', async () => {
    const res = await processAssistantQuery('Rahim er phone number ki?', mockShopData);
    expect(res.proposal).toBeUndefined();
    expect(res.text).toContain('গোপনীয়তা');
  });

  it('AI-14: Refuses poems or non-business questions politely', async () => {
    const res = await processAssistantQuery('Ekta kobita likho', mockShopData);
    expect(res.proposal).toBeUndefined();
    expect(res.text).toContain('দোকানের হিসাব');
  });

  it('AI-19: Parses Bengali script and numerals (রহিম কে ৫০০ টাকা বাকি দিলাম)', async () => {
    const res = await processAssistantQuery('রহিম কে ৫০০ টাকা বাকি দিলাম', mockShopData);
    expect(res.proposal).toBeDefined();
    expect(res.proposal.amount).toBe(500);
  });

  it('AI-20: Rejects invalid or negative amounts safely', async () => {
    const toolRes = await executeTool(
      'proposeBakiEntry',
      { customerName: 'Rahim', amount: -500 },
      mockShopData
    );
    expect(toolRes.status).toBe('invalid');
  });
});
