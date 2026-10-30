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
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-4 shadow-md space-y-3 my-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            AI PROPOSAL
          </span>
          <h4 className="text-sm font-bold text-slate-800">Confirm Action</h4>
        </div>
        <span className="text-xs text-slate-400">{proposal.dateKey || 'Today'}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500 font-medium">Type:</span>
          <span className="font-bold text-slate-900">
            {typeLabels[proposal.type] || proposal.type}
          </span>
        </div>

        {proposal.customerName && (
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500 font-medium">Customer:</span>
            <span className="font-bold text-slate-900">
              {proposal.customerName}
              {proposal.phoneLast4 ? ` (…${proposal.phoneLast4})` : ''}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-1 bg-slate-50 px-2.5 rounded-lg">
          <span className="text-slate-600 font-medium">Amount:</span>
          <span className="text-xl font-extrabold text-teal-800 tabular-nums">
            {formatMoney(proposal.amount)}
          </span>
        </div>

        {proposal.originalText && (
          <div className="text-xs text-slate-500 italic bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
            You said: "{proposal.originalText}"
          </div>
        )}

        {proposal.warning && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800">
            ⚠️ {proposal.warning}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        {status === 'saved' ? (
          <div className="w-full py-2.5 bg-green-100 border border-green-300 text-green-800 font-bold text-center text-sm rounded-lg flex items-center justify-center gap-2">
            <span>Saved ✓</span>
          </div>
        ) : status === 'cancelled' ? (
          <div className="w-full py-2 bg-slate-100 text-slate-500 font-semibold text-center text-xs rounded-lg">
            Cancelled — Nothing saved
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={status === 'saving'}
              onClick={handleCancel}
              className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={status === 'saving'}
              onClick={handleConfirm}
              className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-lg transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'saving' ? 'Saving…' : 'Confirm'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
