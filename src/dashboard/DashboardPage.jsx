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
    removeDemo,
    loading,
  } = useData();

  const hasData = products.length > 0 || todaySalesTotal > 0 || totalBaki > 0;

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-3">
        <span className="text-3xl animate-spin inline-block">⚙️</span>
        <p className="text-sm font-semibold tracking-wide">দোকানের হিসাব লোড হচ্ছে…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Persistent Demo Banner (D-13) */}
      {isDemoLoaded && (
        <div className="bg-indigo-950/60 border border-indigo-500/30 text-white p-3.5 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-2 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-base">⚖️</span>
            <span className="font-semibold text-slate-200">
              Demo data (fictional) is loaded for evaluation.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                await removeDemo();
              }}
              className="bg-rose-600/80 hover:bg-rose-600 px-3 py-1 rounded-lg font-bold transition shadow-xs text-white"
            >
              Remove Demo Data
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg font-bold transition text-white"
            >
              Settings
            </button>
          </div>
        </div>
      )}

      {/* Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {shopProfile?.shopName || 'Dashboard'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            স্বাগতম, <span className="font-bold text-slate-200">{shopProfile?.ownerName || 'Shopkeeper'}</span> —{' '}
            <span className="font-bold text-sky-400">আজকের হিসাব ও পর্যালোচনা</span>
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="px-4 py-2.5 glow-btn-primary rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <span>🤖</span>
            <span>Ask Chatbot</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/sell')}
            className="px-4 py-2.5 glow-btn-emerald rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <span>⚡</span>
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {/* AI Chatbot Hero Card */}
      <div className="glass-card border border-sky-500/30 p-5 rounded-2xl shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3.5">
            <span className="text-3xl p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl">🤖</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  হিসাববন্ধু AI Chatbot
                </h2>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Speak or type in natural Bangla to check sales, debtors, stock, or record baki instantly.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="glow-btn-primary text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            <span>Open Assistant</span>
            <span>→</span>
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs relative z-10">
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="bg-slate-900/80 hover:bg-sky-950/80 text-sky-200 border border-sky-500/20 px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2"
          >
            <span>💬</span>
            <span>কার কাছে সবচেয়ে বেশি বাকি?</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="bg-slate-900/80 hover:bg-sky-950/80 text-sky-200 border border-sky-500/20 px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2"
          >
            <span>💬</span>
            <span>আজকের বিক্রি ও লাভ কত?</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="bg-slate-900/80 hover:bg-sky-950/80 text-sky-200 border border-sky-500/20 px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2"
          >
            <span>💬</span>
            <span>রহিম কে ৫০০ টাকা বাকি দিলাম</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
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
          <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span>📖</span>
                <span>Who Owes Most (শীর্ষ বাকিদার)</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('/customers')}
                className="text-xs text-sky-400 font-bold hover:underline"
              >
                View All →
              </button>
            </div>

            {topDebtors.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No outstanding customer baki.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {topDebtors.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="py-3 flex justify-between items-center text-xs hover:bg-white/5 cursor-pointer px-2 rounded-xl transition"
                  >
                    <div>
                      <span className="font-bold text-slate-100 block text-sm">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
                    </div>
                    <span className="font-black text-rose-400 text-sm sm:text-base tabular-nums">
                      {formatMoney(c.balance)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span>⚠️</span>
                <span>Low Stock Alerts (মজুদ সতর্কতা)</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="text-xs text-sky-400 font-bold hover:underline"
              >
                Catalog →
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">All inventory is well-stocked.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="py-3 flex justify-between items-center text-xs px-2">
                    <div>
                      <span className="font-bold text-slate-100 block text-sm">{p.name}</span>
                      <span className="text-slate-400 text-[11px]">
                        Alert threshold: {p.lowStockAt} {p.unit}
                      </span>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold">
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
