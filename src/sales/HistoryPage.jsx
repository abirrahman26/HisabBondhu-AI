import React from 'react';
import { useData } from '../shared/data/DataContext';
import EmptyState from '../shared/ui/EmptyState';
import { formatMoney } from '../shared/lib/money';

export default function HistoryPage() {
  const { sales, loading } = useData();

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Sales History (বিক্রি ইতিহাস)
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Record of all past transactions and items sold</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading sales history…</div>
      ) : sales.length === 0 ? (
        <EmptyState
          icon="📜"
          title="No sales recorded yet"
          description="Sales recorded through the Sell screen or AI assistant will appear here."
        />
      ) : (
        <div className="space-y-3.5">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="glass-card p-5 rounded-2xl border border-white/10 shadow-lg space-y-3"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      sale.paymentType === 'cash'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : sale.paymentType === 'baki'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                    }`}
                  >
                    {sale.paymentType}
                  </span>
                  {sale.paymentLabel && (
                    <span className="text-xs font-semibold text-sky-300">
                      ({sale.paymentLabel})
                    </span>
                  )}
                  {sale.createdBy === 'ai' && (
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 font-extrabold px-1.5 py-0.2 rounded-xs">
                      AI
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">{sale.dateKey}</span>
              </div>

              <div className="divide-y divide-white/5 text-xs">
                {sale.items &&
                  sale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 text-slate-300">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-bold text-white tabular-nums">{formatMoney(item.lineTotal)}</span>
                    </div>
                  ))}
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-white/10 font-bold text-sm">
                <span className="text-slate-400">Total:</span>
                <span className="text-sky-400 text-lg font-black tabular-nums">{formatMoney(sale.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
