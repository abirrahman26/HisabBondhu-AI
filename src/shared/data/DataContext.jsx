import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  subscribeShopData,
  addProduct,
  archiveProduct,
  addCustomer,
  createSaleTx,
  recordPaymentTx,
  recordBakiTx,
  addExpense,
  loadDemoDataset,
  removeDemoDataset,
} from './dbService';
import { getDhakaDateKey } from '../lib/dates';
import { calcAllBalances, calcTotalBaki, getTopDebtors } from '../lib/balance';
import { calcPeriodProfit } from '../lib/profit';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [data, setData] = useState({
    products: [],
    customers: [],
    sales: [],
    ledger: [],
    expenses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setData({ products: [], customers: [], sales: [], ledger: [], expenses: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeShopData(currentUser.uid, (freshData) => {
      setData(freshData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Derived Business Logic (Pure Code Calculations)
  const customersWithBalances = calcAllBalances(data.customers, data.ledger);
  const totalBaki = calcTotalBaki(customersWithBalances);
  const topDebtors = getTopDebtors(customersWithBalances, 5);

  const todayKey = getDhakaDateKey();
  const todaySales = data.sales.filter((s) => s.dateKey === todayKey);
  const todayExpenses = data.expenses.filter((e) => e.dateKey === todayKey);

  const todaySalesTotal = todaySales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
  const todayProfitSummary = calcPeriodProfit(todaySales, todayExpenses);

  const lowStockProducts = data.products.filter(
    (p) => p.active !== false && Number(p.stockQty) <= Number(p.lowStockAt)
  );

  const isDemoLoaded =
    data.products.some((p) => p.isDemo) ||
    data.customers.some((c) => c.isDemo) ||
    data.sales.some((s) => s.isDemo);

  const uid = currentUser?.uid;

  const value = {
    products: data.products,
    customers: customersWithBalances,
    sales: data.sales,
    ledger: data.ledger,
    expenses: data.expenses,
    todaySales,
    todaySalesTotal,
    todayEstimatedProfit: todayProfitSummary.estimatedProfit,
    totalBaki,
    topDebtors,
    lowStockProducts,
    isDemoLoaded,
    loading,

    // Actions
    addProduct: (product) => addProduct(uid, product),
    archiveProduct: (productId) => archiveProduct(uid, productId),
    addCustomer: (customer) => addCustomer(uid, customer),
    createSale: (sale) => createSaleTx(uid, sale),
    recordPayment: (payment) => recordPaymentTx(uid, payment),
    recordBaki: (baki) => recordBakiTx(uid, baki),
    addExpense: (expense) => addExpense(uid, expense),
    loadDemo: () => loadDemoDataset(uid),
    removeDemo: () => removeDemoDataset(uid),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
}
