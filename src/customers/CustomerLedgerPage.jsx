import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../shared/data/DataContext';
import FormField from '../shared/ui/FormField';
import MoneyInput from '../shared/ui/MoneyInput';
import { formatMoney } from '../shared/lib/money';
import { calcCustomerBalance } from '../shared/lib/balance';

export default function CustomerLedgerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, ledger, recordPayment, recordBaki, loading } = useData();

  const customer = customers.find((c) => c.id === id);
  const customerEntries = ledger.filter((l) => l.customerId === id);
  const currentBalance = customer ? customer.balance : calcCustomerBalance(customerEntries);

  const [actionType, setActionType] = useState('payment'); // 'payment' | 'credit'
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showOverpaymentWarning, setShowOverpaymentWarning] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleRecord = async (e) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!numAmt || numAmt <= 0) {
      setErrors({ amount: 'Enter an amount greater than 0.' });
      return;
    }

    // Check overpayment warning if payment > current balance
    if (actionType === 'payment' && numAmt > currentBalance && !showOverpaymentWarning) {
      setShowOverpaymentWarning(true);
      return;
    }

    setSaving(true);
    try {
      if (actionType === 'payment') {
        await recordPayment({
          customerId: id,
          amount: numAmt,
          note: note.trim() || 'Payment received',
        });
      } else {
        await recordBaki({
          customerId: id,
          amount: numAmt,
          note: note.trim() || 'Baki given',
        });
      }

      setAmount('');
      setNote('');
      setShowOverpaymentWarning(false);
      setErrors({});
    } catch (err) {
      setErrors({ form: err.message || 'Failed to record entry.' });
    } finally {
      setSaving(false);
    }
  };

  if (!loading && !customer) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-xl font-bold text-white">Customer not found</h3>
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="px-5 py-2.5 glow-btn-primary text-white rounded-xl text-sm font-semibold"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button & Customer Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="p-2.5 glass-card border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition"
          aria-label="Back to customers list"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {customer?.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{customer?.phone}</p>
        </div>
      </div>

      {/* Balance Banner */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Balance (বর্তমান বাকি)
          </span>
          <div
            className={`text-3xl sm:text-4xl font-black tabular-nums mt-1 ${
              currentBalance > 0 ? 'text-rose-400' : currentBalance < 0 ? 'text-emerald-400' : 'text-slate-300'
            }`}
          >
            {formatMoney(currentBalance)}
          </div>
          {currentBalance < 0 && (
            <p className="text-xs font-bold text-emerald-400 mt-1">Customer Advance (জমা আছে)</p>
          )}
        </div>
      </div>

      {/* Action Form: Payment or Baki */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex gap-2.5 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => {
              setActionType('payment');
              setShowOverpaymentWarning(false);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              actionType === 'payment'
                ? 'glow-btn-emerald text-white shadow-md'
                : 'bg-slate-900/60 text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            💰 Record Payment (টাকা গ্রহণ)
          </button>
          <button
            type="button"
            onClick={() => {
              setActionType('credit');
              setShowOverpaymentWarning(false);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              actionType === 'credit'
                ? 'glow-btn-primary text-white shadow-md'
                : 'bg-slate-900/60 text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            📖 Give Baki (বাকি দেওয়া)
          </button>
        </div>

        {errors.form && (
          <p className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-semibold">
            ⚠️ {errors.form}
          </p>
        )}

        <form onSubmit={handleRecord} className="space-y-4" noValidate>
          <FormField
            id="amount"
            label={actionType === 'payment' ? 'Payment Amount (টাকা)' : 'Baki Amount (টাকা)'}
            required
            error={errors.amount}
          >
            <MoneyInput id="amount" value={amount} onChange={setAmount} placeholder="200" />
          </FormField>

          <FormField id="note" label="Note (বিবরণ / নোট)" hint="Optional (max 200 chars)">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Cash repayment"
              maxLength={200}
              className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-white placeholder-slate-500"
            />
          </FormField>

          {showOverpaymentWarning && (
            <div className="p-3.5 bg-amber-950/40 border border-amber-400/40 rounded-xl space-y-2 text-xs text-amber-200">
              <p className="font-bold">
                ⚠️ This payment ({formatMoney(amount)}) is more than {customer?.name} owes ({formatMoney(currentBalance)}).
              </p>
              <p>Do you want to record the surplus as an advance balance?</p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowOverpaymentWarning(false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shadow-md"
                >
                  Record as Advance
                </button>
              </div>
            </div>
          )}

          {!showOverpaymentWarning && (
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 text-white font-bold rounded-xl transition shadow-lg text-sm disabled:opacity-50 ${
                actionType === 'payment' ? 'glow-btn-emerald' : 'glow-btn-primary'
              }`}
            >
              {saving ? 'Saving…' : actionType === 'payment' ? 'Save Payment' : 'Save Baki Entry'}
            </button>
          )}
        </form>
      </div>

      {/* Ledger History List */}
      <div className="glass-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Ledger Entries (লেনদেন খতিয়ান)</h3>
          <span className="text-xs text-slate-400">{customerEntries.length} entries</span>
        </div>

        {customerEntries.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No transactions recorded yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {customerEntries.map((entry) => {
              const isPayment = entry.type === 'payment';
              return (
                <div key={entry.id} className="p-4 flex justify-between items-center text-sm hover:bg-white/5 transition">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isPayment
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                        }`}
                      >
                        {isPayment ? 'Payment Received' : 'Baki Given'}
                      </span>
                      {entry.createdBy === 'ai' && (
                        <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.2 rounded-xs">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 pt-0.5">{entry.note}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{entry.dateKey}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-base font-black tabular-nums ${
                        isPayment ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPayment ? '-' : '+'}
                      {formatMoney(entry.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
