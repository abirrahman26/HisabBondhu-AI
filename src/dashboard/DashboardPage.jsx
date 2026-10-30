import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../shared/data/DataContext';
import { useAuth } from '../auth/AuthContext';
import StatCard from '../shared/ui/StatCard';
import EmptyState from '../shared/ui/EmptyState';
import { formatMoney } from '../shared/lib/money';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { shopProfile } = useAuth();
  const {
    products,
    todaySalesTotal,
    todayEstimatedProfit,
    totalBaki,
    lowStockProducts,
    topDebtors,
    isDemoLoaded,
    loadDemo,
    loading,
  } = useData();

  const hasData = products.length > 0 || todaySalesTotal > 0 || totalBaki > 0;

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 space-y-2">
        <span className="text-2xl animate-spin inline-block">⚙️</span>
        <p className="text-xs font-semibold">Loading shop metrics…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Persistent Demo Banner (D-13) */}
      {isDemoLoaded && (
        <div className="bg-indigo-700 text-white p-3 rounded-xl shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span>⚖️</span>
            <span className="font-semibold">
              Demo data (fictional) is active for testing & evaluation.
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-md font-bold transition"
          >
            Manage in Settings
          </button>
        </div>
      )}

      {/* Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {shopProfile?.shopName || 'Dashboard'}
          </h1>
          <p className="text-sm text-slate-500">
            Welcome, <span className="font-bold text-slate-700">{shopProfile?.ownerName || 'Shopkeeper'}</span> —{' '}
            <span className="font-semibold text-teal-800">আজকের হিসাব</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/sell')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-sm shadow-xs transition flex items-center gap-1.5"
          >
            <span>⚡</span>
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Today's Sales"
          value={formatMoney(todaySalesTotal)}
          subtitle="Cash & Baki combined"
          icon="📈"
          variant="teal"
        />
        <StatCard
          title="Estimated Profit"
          value={formatMoney(todayEstimatedProfit)}
          subtitle="Sales minus cost & expenses"
          icon="✨"
          variant={todayEstimatedProfit >= 0 ? 'success' : 'danger'}
        />
        <StatCard
          title="Total Baki"
          value={formatMoney(totalBaki)}
          subtitle="Customer dues"
          icon="📖"
          variant={totalBaki > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Low Stock"
          value={`${lowStockProducts.length} items`}
          subtitle="Needs restock"
          icon="⚠️"
          variant={lowStockProducts.length > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Main Content Area */}
      {!hasData ? (
        <EmptyState
          icon="🏪"
          title="Welcome to your Digital Khata!"
          description="Start by adding your first product to your catalog or load the fictional Judge Mode demo dataset to test."
          actionLabel="+ Add First Product"
          onAction={() => navigate('/products')}
          secondaryActionLabel="⚖️ Load Demo Data"
          onSecondaryAction={loadDemo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Who Owes Most (Top Debtors) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Who Owes Most (শীর্ষ বাকিদার)
              </h3>
              <button
                type="button"
                onClick={() => navigate('/customers')}
                className="text-xs text-teal-700 font-bold hover:underline"
              >
                View All →
              </button>
            </div>

            {topDebtors.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No outstanding customer baki.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {topDebtors.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="py-2.5 flex justify-between items-center text-xs hover:bg-slate-50 cursor-pointer px-1 rounded-sm transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
                    </div>
                    <span className="font-extrabold text-red-700 text-sm tabular-nums">
                      {formatMoney(c.balance)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Low Stock Alerts (মজুদ সতর্কতা)
              </h3>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="text-xs text-teal-700 font-bold hover:underline"
              >
                Catalog →
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">All inventory is well-stocked.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{p.name}</span>
                      <span className="text-slate-400 text-[11px]">
                        Alert threshold: {p.lowStockAt} {p.unit}
                      </span>
                    </div>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {p.stockQty} {p.unit} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
