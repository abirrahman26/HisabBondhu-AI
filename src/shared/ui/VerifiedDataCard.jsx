import React from 'react';
import { formatMoney } from '../lib/money';

export default function VerifiedDataCard({ title, data, total }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="glass-card border border-sky-400/30 rounded-2xl p-3.5 my-2.5 text-xs space-y-2.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-extrabold text-sky-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span>📊</span>
          <span>{title || 'Verified Data'}</span>
        </span>
        <span className="text-[10px] bg-sky-500/15 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full font-semibold">
          App Verified
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between py-1.5 text-slate-300">
            <span className="font-medium truncate max-w-[190px]">
              {item.name || item.label}
              {item.phoneLast4 ? ` (…${item.phoneLast4})` : ''}
              {item.unit ? ` (${item.stockQty} ${item.unit})` : ''}
            </span>
            <span className="font-bold tabular-nums text-white">
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
        <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sky-300 text-sm">
          <span>Total:</span>
          <span className="tabular-nums text-emerald-400 font-black">{formatMoney(total)}</span>
        </div>
      )}

      <p className="text-[10px] text-slate-400 italic text-right pt-0.5">
        Verified from your data — calculated by the app, not by AI
      </p>
    </div>
  );
}
