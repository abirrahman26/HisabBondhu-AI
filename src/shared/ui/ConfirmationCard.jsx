import React, { useState } from 'react';
import { formatMoney } from '../lib/money';

export default function ConfirmationCard({
  proposal, // { id, type, customerName, phoneLast4, amount, dateKey, originalText, warning }
  onConfirm,
  onCancel,
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'cancelled'

  if (!proposal) return null;

  const handleConfirm = async () => {
    if (status !== 'idle') return;
    setStatus('saving');
    try {
      await onConfirm(proposal);
      setStatus('saved');
    } catch {
      setStatus('idle');
    }
  };

  const handleCancel = () => {
    if (status !== 'idle') return;
    setStatus('cancelled');
    if (onCancel) onCancel(proposal);
  };

  const typeLabels = {
    baki: 'Baki Given (বাকি দেওয়া)',
    payment: 'Payment Received (টাকা গ্রহণ)',
    sale: 'Sale (পণ্য বিক্রি)',
    expense: 'Expense (খরচ)',
  };

  return (
    <div className="glass-card border-2 border-sky-400/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5 my-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider">
            AI PROPOSAL
          </span>
          <h4 className="text-sm font-bold text-slate-100">Confirm Action</h4>
        </div>
        <span className="text-xs text-slate-400">{proposal.dateKey || 'Today'}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 font-medium">Type:</span>
          <span className="font-bold text-slate-200">
            {typeLabels[proposal.type] || proposal.type}
          </span>
        </div>

        {proposal.customerName && (
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Customer:</span>
            <span className="font-bold text-slate-200">
              {proposal.customerName}
              {proposal.phoneLast4 ? ` (…${proposal.phoneLast4})` : ''}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 bg-sky-950/40 border border-sky-500/20 px-3 rounded-xl">
          <span className="text-slate-300 font-medium">Amount:</span>
          <span className="text-2xl font-black text-sky-400 tabular-nums">
            {formatMoney(proposal.amount)}
          </span>
        </div>

        {proposal.originalText && (
          <div className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/10">
            You said: "{proposal.originalText}"
          </div>
        )}

        {proposal.warning && (
          <div className="p-2.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs font-semibold text-amber-200">
            ⚠️ {proposal.warning}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        {status === 'saved' ? (
          <div className="w-full py-2.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-center text-sm rounded-xl flex items-center justify-center gap-2">
            <span>Saved ✓</span>
          </div>
        ) : status === 'cancelled' ? (
          <div className="w-full py-2 bg-white/5 text-slate-400 font-semibold text-center text-xs rounded-xl">
            Cancelled — Nothing saved
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={status === 'saving'}
              onClick={handleCancel}
              className="flex-1 py-2.5 border border-white/15 hover:bg-white/10 text-slate-300 font-semibold text-sm rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={status === 'saving'}
              onClick={handleConfirm}
              className="flex-1 py-2.5 glow-btn-primary font-bold text-sm rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'saving' ? 'Saving…' : 'Confirm'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
