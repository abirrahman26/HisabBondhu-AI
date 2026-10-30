import React from 'react';
import { useData } from '../shared/data/DataContext';
import EmptyState from '../shared/ui/EmptyState';
import { formatMoney } from '../shared/lib/money';

export default function HistoryPage() {
  const { sales, loading } = useData();

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sales History (বিক্রি ইতিহাস)
        </h1>
        <p className="text-sm text-slate-500">Record of all past transactions and items sold</p>
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
        <div className="space-y-3">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                      sale.paymentType === 'cash'
                        ? 'bg-green-100 text-green-800'
                        : sale.paymentType === 'baki'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {sale.paymentType}
                  </span>
                  {sale.paymentLabel && (
                    <span className="text-xs font-semibold text-indigo-700">
                      ({sale.paymentLabel})
                    </span>
                  )}
                  {sale.createdBy === 'ai' && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.2 rounded-xs">
                      AI
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">{sale.dateKey}</span>
              </div>

              <div className="divide-y divide-slate-50 text-xs">
                {sale.items &&
                  sale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-slate-600">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-semibold text-slate-900">{formatMoney(item.lineTotal)}</span>
                    </div>
                  ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold text-sm">
                <span className="text-slate-500">Total:</span>
                <span className="text-teal-800 text-base tabular-nums">{formatMoney(sale.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
