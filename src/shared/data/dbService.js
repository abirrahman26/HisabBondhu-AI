import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { getDhakaDateKey } from '../lib/dates';

// In-memory & LocalStorage fallback key for offline/preview testing
const PREVIEW_STORAGE_KEY = 'hisabbondhu_preview_data';
let inMemoryStore = {};

export function getPreviewData() {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return (
    inMemoryStore[PREVIEW_STORAGE_KEY] || {
      products: [],
      customers: [],
      sales: [],
      ledger: [],
      expenses: [],
    }
  );
}

export function savePreviewData(data) {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(data));
    }
  } catch {}
  inMemoryStore[PREVIEW_STORAGE_KEY] = JSON.parse(JSON.stringify(data));
}

export function resetPreviewData() {
  inMemoryStore = {};
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem(PREVIEW_STORAGE_KEY);
    }
  } catch {}
}

/**
 * Add a new product to inventory.
 */
export async function addProduct(uid, product) {
  const prodData = {
    name: product.name.trim(),
    aliases: Array.isArray(product.aliases) ? product.aliases : [],
    unit: product.unit || 'kg',
    buyPrice: Number(product.buyPrice) || 0,
    sellPrice: Number(product.sellPrice) || 0,
    stockQty: Number(product.stockQty) || 0,
    lowStockAt: Number(product.lowStockAt) || 10,
    active: true,
    isDemo: Boolean(product.isDemo),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    const newProd = { ...prodData, id: `prod_${Date.now()}_${Math.random()}`, createdAt: new Date().toISOString() };
    local.products.push(newProd);
    savePreviewData(local);
    return newProd.id;
  }

  const colRef = collection(db, 'shops', uid, 'products');
  const docRef = doc(colRef);
  await setDoc(docRef, prodData);
  return docRef.id;
}

/**
 * Archive a product (soft delete).
 */
export async function archiveProduct(uid, productId) {
  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    const p = local.products.find((item) => item.id === productId);
    if (p) p.active = false;
    savePreviewData(local);
    return;
  }

  const docRef = doc(db, 'shops', uid, 'products', productId);
  await updateDoc(docRef, { active: false, updatedAt: serverTimestamp() });
}

/**
 * Add a new customer.
 */
export async function addCustomer(uid, customer) {
  const custData = {
    name: customer.name.trim(),
    phone: customer.phone.trim(),
    note: customer.note ? customer.note.trim() : '',
    active: true,
    isDemo: Boolean(customer.isDemo),
    createdAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    const newCust = { ...custData, id: `cust_${Date.now()}_${Math.random()}`, createdAt: new Date().toISOString() };
    local.customers.push(newCust);
    savePreviewData(local);
    return newCust.id;
  }

  const colRef = collection(db, 'shops', uid, 'customers');
  const docRef = doc(colRef);
  await setDoc(docRef, custData);
  return docRef.id;
}

/**
 * Record a sale atomically with stock reduction and baki ledger credit.
 */
export async function createSaleTx(uid, sale) {
  const dateKey = sale.dateKey || getDhakaDateKey();
  const saleId = sale.id || `sale_${Date.now()}_${Math.random()}`;

  const saleRecord = {
    dateKey,
    createdAt: serverTimestamp(),
    items: sale.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      qty: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      unitCost: Number(item.unitCost || 0),
      lineTotal: Math.round(Number(item.qty) * Number(item.unitPrice)),
    })),
    total: Number(sale.total),
    paymentType: sale.paymentType,
    paymentLabel: sale.paymentLabel || null,
    customerId: sale.paymentType === 'baki' ? sale.customerId : null,
    createdBy: sale.createdBy || 'manual',
    negativeStockAccepted: Boolean(sale.negativeStockAccepted),
    aiActionId: sale.aiActionId || null,
    isDemo: Boolean(sale.isDemo),
  };

  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    // Update stock in preview
    for (const item of sale.items) {
      const prod = local.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQty -= Number(item.qty);
      }
    }
    const savedSale = { ...saleRecord, id: saleId, createdAt: new Date().toISOString() };
    local.sales.push(savedSale);

    // If baki, add ledger entry
    if (sale.paymentType === 'baki' && sale.customerId) {
      local.ledger.push({
        id: `led_${Date.now()}_${Math.random()}`,
        customerId: sale.customerId,
        type: 'credit',
        amount: saleRecord.total,
        relatedSaleId: saleId,
        dateKey,
        createdAt: new Date().toISOString(),
        note: `Baki sale (${sale.items.map((i) => i.name).join(', ')})`,
        createdBy: sale.createdBy || 'manual',
        isDemo: Boolean(sale.isDemo),
      });
    }

    savePreviewData(local);
    return { saleId };
  }

  // Atomic Firestore Transaction
  await runTransaction(db, async (tx) => {
    const productDocs = [];
    for (const item of sale.items) {
      const prodRef = doc(db, 'shops', uid, 'products', item.productId);
      const prodSnap = await tx.get(prodRef);
      if (!prodSnap.exists()) {
        throw new Error(`Product ${item.name} not found`);
      }
      productDocs.push({ ref: prodRef, data: prodSnap.data(), item });
    }

    const saleRef = doc(db, 'shops', uid, 'sales', saleId);
    tx.set(saleRef, saleRecord);

    for (const { ref, data, item } of productDocs) {
      const newStock = (Number(data.stockQty) || 0) - Number(item.qty);
      tx.update(ref, {
        stockQty: newStock,
        updatedAt: serverTimestamp(),
      });
    }

    if (sale.paymentType === 'baki' && sale.customerId) {
      const ledgerCol = collection(db, 'shops', uid, 'ledger');
      const ledgerRef = doc(ledgerCol);
      tx.set(ledgerRef, {
        customerId: sale.customerId,
        type: 'credit',
        amount: saleRecord.total,
        relatedSaleId: saleId,
        dateKey,
        createdAt: serverTimestamp(),
        note: `Baki sale`,
        createdBy: sale.createdBy || 'manual',
        isDemo: Boolean(sale.isDemo),
      });
    }
  });

  return { saleId };
}

/**
 * Record a baki repayment or payment.
 */
export async function recordPaymentTx(uid, { customerId, amount, note, createdBy, proposalId, isDemo }) {
  const dateKey = getDhakaDateKey();
  const entryData = {
    customerId,
    type: 'payment',
    amount: Math.round(Number(amount)),
    relatedSaleId: null,
    dateKey,
    createdAt: serverTimestamp(),
    note: note ? note.trim() : 'Payment received',
    createdBy: createdBy || 'manual',
    isDemo: Boolean(isDemo),
  };

  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    const entryId = proposalId || `led_${Date.now()}_${Math.random()}`;
    local.ledger.push({ ...entryData, id: entryId, createdAt: new Date().toISOString() });
    savePreviewData(local);
    return { entryId };
  }

  const ledgerDocRef = proposalId
    ? doc(db, 'shops', uid, 'ledger', proposalId)
    : doc(collection(db, 'shops', uid, 'ledger'));

  await setDoc(ledgerDocRef, entryData);
  return { entryId: ledgerDocRef.id };
}

/**
 * Record direct baki given to customer.
 */
export async function recordBakiTx(uid, { customerId, amount, note, createdBy, proposalId, isDemo }) {
  const dateKey = getDhakaDateKey();
  const entryData = {
    customerId,
    type: 'credit',
    amount: Math.round(Number(amount)),
    relatedSaleId: null,
    dateKey,
    createdAt: serverTimestamp(),
    note: note ? note.trim() : 'Baki given',
    createdBy: createdBy || 'manual',
    isDemo: Boolean(isDemo),
  };

  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    const entryId = proposalId || `led_${Date.now()}_${Math.random()}`;
    local.ledger.push({ ...entryData, id: entryId, createdAt: new Date().toISOString() });
    savePreviewData(local);
    return { entryId };
  }

  const ledgerDocRef = proposalId
    ? doc(db, 'shops', uid, 'ledger', proposalId)
    : doc(collection(db, 'shops', uid, 'ledger'));

  await setDoc(ledgerDocRef, entryData);
  return { entryId: ledgerDocRef.id };
}

/**
 * Add an expense.
 */
export async function addExpense(uid, expense) {
  const expData = {
    category: expense.category,
    amount: Math.round(Number(expense.amount)),
    dateKey: expense.dateKey || getDhakaDateKey(),
    note: expense.note ? expense.note.trim() : '',
    createdAt: serverTimestamp(),
    createdBy: expense.createdBy || 'manual',
    isDemo: Boolean(expense.isDemo),
  };

  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    const newExp = { ...expData, id: `exp_${Date.now()}_${Math.random()}`, createdAt: new Date().toISOString() };
    local.expenses.push(newExp);
    savePreviewData(local);
    return newExp.id;
  }

  const colRef = collection(db, 'shops', uid, 'expenses');
  const docRef = doc(colRef);
  await setDoc(docRef, expData);
  return docRef.id;
}

/**
 * Load Judge Mode fictional demo data (F-18, Judge_Mode.md).
 */
export async function loadDemoDataset(uid) {
  const dateKey = getDhakaDateKey();

  const demoProducts = [
    { name: 'Rice (Miniket)', aliases: ['rice', 'chal'], unit: 'kg', buyPrice: 62, sellPrice: 70, stockQty: 100, lowStockAt: 20, active: true, isDemo: true },
    { name: 'Soybean Oil', aliases: ['oil', 'tel'], unit: 'litre', buyPrice: 160, sellPrice: 175, stockQty: 8, lowStockAt: 10, active: true, isDemo: true },
    { name: 'Salt (লবণ)', aliases: ['salt', 'lobon'], unit: 'packet', buyPrice: 30, sellPrice: 36, stockQty: 40, lowStockAt: 10, active: true, isDemo: true },
    { name: 'Lentil (Masur Dal)', aliases: ['dal', 'daal'], unit: 'kg', buyPrice: 110, sellPrice: 125, stockQty: 6, lowStockAt: 10, active: true, isDemo: true },
  ];

  const demoCustomers = [
    { name: 'Karim Mia', phone: '01700000002', note: 'Regular customer', active: true, isDemo: true },
    { name: 'Nasima Begum', phone: '01700000003', note: 'School teacher', active: true, isDemo: true },
  ];

  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    local.products = local.products.filter((p) => !p.isDemo);
    local.customers = local.customers.filter((c) => !c.isDemo);
    local.sales = local.sales.filter((s) => !s.isDemo);
    local.ledger = local.ledger.filter((l) => !l.isDemo);
    local.expenses = local.expenses.filter((e) => !e.isDemo);

    const createdProds = demoProducts.map((p, idx) => ({ ...p, id: `demo_p_${idx + 1}` }));
    const createdCusts = demoCustomers.map((c, idx) => ({ ...c, id: `demo_c_${idx + 1}` }));

    local.products.push(...createdProds);
    local.customers.push(...createdCusts);

    local.ledger.push(
      { id: 'demo_l_1', customerId: 'demo_c_1', type: 'credit', amount: 1500, dateKey, note: 'Previous groceries', isDemo: true },
      { id: 'demo_l_2', customerId: 'demo_c_1', type: 'payment', amount: 300, dateKey, note: 'Cash payment', isDemo: true },
      { id: 'demo_l_3', customerId: 'demo_c_2', type: 'credit', amount: 850, dateKey, note: 'Monthly oil & rice', isDemo: true }
    );

    local.sales.push(
      { id: 'demo_s_1', dateKey, total: 700, paymentType: 'cash', items: [{ name: 'Rice (Miniket)', qty: 10, unit: 'kg', unitPrice: 70, unitCost: 62, lineTotal: 700 }], isDemo: true },
      { id: 'demo_s_2', dateKey, total: 180, paymentType: 'mobile_banking', paymentLabel: 'bKash', items: [{ name: 'Salt (লবণ)', qty: 5, unit: 'packet', unitPrice: 36, unitCost: 30, lineTotal: 180 }], isDemo: true }
    );

    local.expenses.push({ id: 'demo_e_1', category: 'electricity', amount: 450, dateKey, note: 'Shop electricity bill', isDemo: true });

    savePreviewData(local);
    return true;
  }

  for (const prod of demoProducts) {
    const ref = doc(collection(db, 'shops', uid, 'products'));
    await setDoc(ref, { ...prod, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  const cust1Ref = doc(collection(db, 'shops', uid, 'customers'));
  await setDoc(cust1Ref, { ...demoCustomers[0], createdAt: serverTimestamp() });

  const cust2Ref = doc(collection(db, 'shops', uid, 'customers'));
  await setDoc(cust2Ref, { ...demoCustomers[1], createdAt: serverTimestamp() });

  await setDoc(doc(collection(db, 'shops', uid, 'ledger')), {
    customerId: cust1Ref.id,
    type: 'credit',
    amount: 1500,
    dateKey,
    note: 'Previous groceries',
    createdBy: 'manual',
    isDemo: true,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(collection(db, 'shops', uid, 'ledger')), {
    customerId: cust1Ref.id,
    type: 'payment',
    amount: 300,
    dateKey,
    note: 'Cash payment',
    createdBy: 'manual',
    isDemo: true,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(collection(db, 'shops', uid, 'ledger')), {
    customerId: cust2Ref.id,
    type: 'credit',
    amount: 850,
    dateKey,
    note: 'Monthly groceries',
    createdBy: 'manual',
    isDemo: true,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(collection(db, 'shops', uid, 'sales')), {
    dateKey,
    total: 700,
    paymentType: 'cash',
    createdBy: 'manual',
    isDemo: true,
    createdAt: serverTimestamp(),
    items: [{ productId: 'demo', name: 'Rice (Miniket)', qty: 10, unit: 'kg', unitPrice: 70, unitCost: 62, lineTotal: 700 }],
  });

  await setDoc(doc(collection(db, 'shops', uid, 'sales')), {
    dateKey,
    total: 180,
    paymentType: 'mobile_banking',
    paymentLabel: 'bKash',
    createdBy: 'manual',
    isDemo: true,
    createdAt: serverTimestamp(),
    items: [{ productId: 'demo', name: 'Salt (লবণ)', qty: 5, unit: 'packet', unitPrice: 36, unitCost: 30, lineTotal: 180 }],
  });

  await setDoc(doc(collection(db, 'shops', uid, 'expenses')), {
    category: 'electricity',
    amount: 450,
    dateKey,
    note: 'Shop electricity bill',
    createdBy: 'manual',
    isDemo: true,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, 'shops', uid), { demoLoaded: true });
  return true;
}

/**
 * Remove only demo records (isDemo: true).
 */
export async function removeDemoDataset(uid) {
  if (!isFirebaseConfigured || !uid) {
    const local = getPreviewData();
    local.products = local.products.filter((p) => !p.isDemo);
    local.customers = local.customers.filter((c) => !c.isDemo);
    local.sales = local.sales.filter((s) => !s.isDemo);
    local.ledger = local.ledger.filter((l) => !l.isDemo);
    local.expenses = local.expenses.filter((e) => !e.isDemo);
    savePreviewData(local);
    return true;
  }

  const collectionsToClean = ['products', 'customers', 'sales', 'ledger', 'expenses'];
  for (const col of collectionsToClean) {
    const q = query(collection(db, 'shops', uid, col), where('isDemo', '==', true));
    const snaps = await getDocs(q);
    for (const d of snaps.docs) {
      await deleteDoc(d.ref);
    }
  }

  await updateDoc(doc(db, 'shops', uid), { demoLoaded: false });
  return true;
}

/**
 * Subscribe to shop data collections with live updates.
 */
export function subscribeShopData(uid, onData) {
  if (!isFirebaseConfigured || !uid) {
    const updateLocal = () => {
      const local = getPreviewData();
      onData({
        products: local.products.filter((p) => p.active !== false),
        customers: local.customers.filter((c) => c.active !== false),
        sales: local.sales,
        ledger: local.ledger,
        expenses: local.expenses,
      });
    };
    updateLocal();
    const interval = setInterval(updateLocal, 800);
    return () => clearInterval(interval);
  }

  let state = { products: [], customers: [], sales: [], ledger: [], expenses: [] };

  const unsubProds = onSnapshot(query(collection(db, 'shops', uid, 'products'), where('active', '==', true)), (snap) => {
    state.products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData({ ...state });
  });

  const unsubCusts = onSnapshot(query(collection(db, 'shops', uid, 'customers'), where('active', '==', true)), (snap) => {
    state.customers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData({ ...state });
  });

  const unsubSales = onSnapshot(query(collection(db, 'shops', uid, 'sales'), orderBy('createdAt', 'desc')), (snap) => {
    state.sales = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData({ ...state });
  });

  const unsubLedger = onSnapshot(collection(db, 'shops', uid, 'ledger'), (snap) => {
    state.ledger = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData({ ...state });
  });

  const unsubExp = onSnapshot(collection(db, 'shops', uid, 'expenses'), (snap) => {
    state.expenses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData({ ...state });
  });

  return () => {
    unsubProds();
    unsubCusts();
    unsubSales();
    unsubLedger();
    unsubExp();
  };
}
