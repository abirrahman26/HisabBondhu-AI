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
      <div className="text-center py-12 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Customer not found</h3>
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm font-semibold"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back button & Customer Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
          aria-label="Back to customers list"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {customer?.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono">{customer?.phone}</p>
        </div>
      </div>

      {/* Balance Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Balance (বর্তমান বাকি)
          </span>
          <div
            className={`text-3xl font-extrabold tabular-nums mt-0.5 ${
              currentBalance > 0 ? 'text-red-700' : currentBalance < 0 ? 'text-green-700' : 'text-slate-700'
            }`}
          >
            {formatMoney(currentBalance)}
          </div>
          {currentBalance < 0 && (
            <p className="text-xs font-bold text-green-700 mt-1">Customer Advance (জমা আছে)</p>
          )}
        </div>
      </div>

      {/* Action Form: Payment or Baki */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => {
              setActionType('payment');
              setShowOverpaymentWarning(false);
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${
              actionType === 'payment'
                ? 'bg-green-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${
              actionType === 'credit'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📖 Give Baki (বাকি দেওয়া)
          </button>
        </div>

        {errors.form && (
          <p className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            ⚠️ {errors.form}
          </p>
        )}

        <form onSubmit={handleRecord} className="space-y-3" noValidate>
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
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700"
            />
          </FormField>

          {showOverpaymentWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-900">
              <p className="font-bold">
                ⚠️ This payment ({formatMoney(amount)}) is more than {customer?.name} owes ({formatMoney(currentBalance)}).
              </p>
              <p>Do you want to record the surplus as an advance balance?</p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowOverpaymentWarning(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-md font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1.5 bg-amber-700 text-white rounded-md font-bold"
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
              className={`w-full py-3 text-white font-bold rounded-xl transition shadow-xs text-sm disabled:opacity-50 ${
                actionType === 'payment' ? 'bg-green-700 hover:bg-green-800' : 'bg-teal-700 hover:bg-teal-800'
              }`}
            >
              {saving ? 'Saving…' : actionType === 'payment' ? 'Save Payment' : 'Save Baki Entry'}
            </button>
          )}
        </form>
      </div>

      {/* Ledger History List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Ledger Entries (লেনদেন খতিয়ান)</h3>
          <span className="text-xs text-slate-400">{customerEntries.length} entries</span>
        </div>

        {customerEntries.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No transactions recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {customerEntries.map((entry) => {
              const isPayment = entry.type === 'payment';
              return (
                <div key={entry.id} className="p-4 flex justify-between items-center text-sm">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isPayment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isPayment ? 'Payment Received' : 'Baki Given'}
                      </span>
                      {entry.createdBy === 'ai' && (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-sm">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 pt-0.5">{entry.note}</p>
                    <p className="text-[11px] text-slate-400">{entry.dateKey}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-base font-extrabold tabular-nums ${
                        isPayment ? 'text-green-700' : 'text-red-700'
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
