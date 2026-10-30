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
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Expenses (দোকানের খরচ)
          </h1>
          <p className="text-sm text-slate-500">Record operational costs to compute net profit</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <span>{showAdd ? 'Close' : '+ Add Expense'}</span>
        </button>
      </div>

      {/* Total Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Total Recorded Expenses
          </span>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums mt-0.5">
            {formatMoney(totalExpenses)}
          </div>
        </div>
        <span className="text-2xl">🧾</span>
      </div>

      {/* Add Expense Form */}
      {showAdd && (
        <div className="bg-white p-5 rounded-2xl border-2 border-teal-600 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-slate-900">Add Shop Expense</h3>
          {errors.form && (
            <p className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
              ⚠️ {errors.form}
            </p>
          )}
          <form onSubmit={handleAdd} className="space-y-3" noValidate>
            <FormField id="category" label="Category (খরচের খাত)" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base border border-slate-300 rounded-lg bg-white"
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
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition shadow-xs disabled:opacity-50"
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
        <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {expenses.map((exp) => (
            <div key={exp.id} className="p-4 flex justify-between items-center text-sm">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">
                  {categoryLabels[exp.category] || exp.category}
                </span>
                {exp.note && <p className="text-xs text-slate-600">{exp.note}</p>}
                <p className="text-[11px] text-slate-400">{exp.dateKey}</p>
              </div>
              <div className="text-right font-extrabold text-base text-red-700 tabular-nums">
                -{formatMoney(exp.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
