import React from 'react';
import { formatMoney } from '../lib/money';

export default function VerifiedDataCard({ title, data, total }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 my-2 text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          {title || 'Verified Data'}
        </span>
        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-sm font-semibold">
          App Calculated
        </span>
      </div>

      <div className="divide-y divide-slate-200">
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between py-1 text-slate-700">
            <span className="font-medium truncate max-w-[180px]">
              {item.name || item.label}
              {item.phoneLast4 ? ` (…${item.phoneLast4})` : ''}
              {item.unit ? ` (${item.stockQty} ${item.unit})` : ''}
            </span>
            <span className="font-bold tabular-nums text-slate-900">
              {item.balance !== undefined
                ? formatMoney(item.balance)
                : item.amount !== undefined
                ? formatMoney(item.amount)
                : item.stockQty !== undefined
                ? `${item.stockQty} ${item.unit || ''}`
                : ''}
            </span>
          </div>
        ))}
      </div>

      {total !== undefined && (
        <div className="border-t border-slate-300 pt-1.5 flex justify-between font-bold text-slate-900">
          <span>Total:</span>
          <span className="tabular-nums">{formatMoney(total)}</span>
        </div>
      )}

      <p className="text-[10px] text-slate-500 italic text-right pt-0.5">
        Verified from your data — calculated by the app, not by AI
      </p>
    </div>
  );
}
