import React, { useState } from 'react';
import { useData } from '../shared/data/DataContext';
import FormField from '../shared/ui/FormField';
import MoneyInput from '../shared/ui/MoneyInput';
import EmptyState from '../shared/ui/EmptyState';
import { formatMoney } from '../shared/lib/money';

export default function ExpensesPage() {
  const { expenses, addExpense, loading } = useData();

  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState('rent');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const categoryLabels = {
    rent: 'Shop Rent (দোকান ভাড়া)',
    electricity: 'Electricity (বিদ্যুৎ বিল)',
    transport: 'Transport (যাতায়াত)',
    salary: 'Staff Salary (বেতন)',
    other: 'Other (অন্যান্য)',
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setErrors({ amount: 'Enter a valid expense amount.' });
      return;
    }

    setSaving(true);
    try {
      await addExpense({
        category,
        amount: Number(amount),
        note: note.trim(),
      });
      setAmount('');
      setNote('');
      setShowAdd(false);
      setErrors({});
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save expense.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Expenses (দোকানের খরচ)
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Record operational costs to compute net profit</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 glow-btn-primary text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <span>{showAdd ? 'Close' : '+ Add Expense'}</span>
        </button>
      </div>

      {/* Total Card */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Total Recorded Expenses (মোট খরচ)
          </span>
          <div className="text-3xl font-black text-rose-400 tabular-nums mt-1">
            {formatMoney(totalExpenses)}
          </div>
        </div>
        <span className="text-3xl p-2 bg-white/5 rounded-2xl border border-white/10">🧾</span>
      </div>

      {/* Add Expense Form */}
      {showAdd && (
        <div className="glass-card p-5 sm:p-6 rounded-2xl border-2 border-sky-400/40 shadow-2xl space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-white">Add Shop Expense</h3>
          {errors.form && (
            <p className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-semibold">
              ⚠️ {errors.form}
            </p>
          )}
          <form onSubmit={handleAdd} className="space-y-4" noValidate>
            <FormField id="category" label="Category (খরচের খাত)" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base border border-white/15 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="rent">Shop Rent (দোকান ভাড়া)</option>
                <option value="electricity">Electricity (বিদ্যুৎ বিল)</option>
                <option value="transport">Transport (যাতায়াত)</option>
                <option value="salary">Staff Salary (বেতন)</option>
                <option value="other">Other (অন্যান্য)</option>
              </select>
            </FormField>

            <FormField id="amount" label="Amount (টাকা)" required error={errors.amount}>
              <MoneyInput id="amount" value={amount} onChange={setAmount} placeholder="500" />
            </FormField>

            <FormField id="note" label="Note" hint="Optional">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. October electric bill"
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-white placeholder-slate-500"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-white/15 text-slate-300 font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 glow-btn-primary font-bold rounded-xl transition shadow-md disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expense List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading expenses…</div>
      ) : expenses.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No expenses recorded"
          description="Track your electricity, rent, and staff salary here."
          actionLabel="+ Add Expense"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <div className="divide-y divide-white/5 glass-card rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          {expenses.map((exp) => (
            <div key={exp.id} className="p-4 flex justify-between items-center text-sm hover:bg-white/5 transition">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">
                  {categoryLabels[exp.category] || exp.category}
                </span>
                {exp.note && <p className="text-xs text-slate-400">{exp.note}</p>}
                <p className="text-[11px] text-slate-500 font-mono">{exp.dateKey}</p>
              </div>
              <div className="text-right font-black text-base text-rose-400 tabular-nums">
                -{formatMoney(exp.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
