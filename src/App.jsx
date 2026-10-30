import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { DataProvider } from './shared/data/DataContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AppShell from './shared/ui/AppShell';
import DashboardPage from './dashboard/DashboardPage';
import LoginPage from './auth/LoginPage';
import SetupPage from './auth/SetupPage';
import SellPage from './sales/SellPage';
import HistoryPage from './sales/HistoryPage';
import CustomersPage from './customers/CustomersPage';
import CustomerLedgerPage from './customers/CustomerLedgerPage';
import ProductsPage from './products/ProductsPage';
import AssistantPage from './assistant/AssistantPage';
import ExpensesPage from './expenses/ExpensesPage';
import SettingsPage from './shared/ui/SettingsPage';
import NotFoundPage from './shared/ui/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <SetupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="sell" element={<SellPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerLedgerPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
