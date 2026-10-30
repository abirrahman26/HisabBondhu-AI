import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../shared/data/DataContext';
import FormField from '../shared/ui/FormField';
import EmptyState from '../shared/ui/EmptyState';
import { formatMoney } from '../shared/lib/money';
import { isValidBDPhone, isValidName } from '../shared/lib/validate';
import { matchName } from '../shared/lib/match';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { customers, totalBaki, addCustomer, loading } = useData();

  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs = {};
    if (!isValidName(name)) errs.name = 'Customer name is required (1–60 characters).';
    if (!isValidBDPhone(phone)) errs.phone = 'Enter valid 11-digit BD mobile number (01...).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await addCustomer({
        name: name.trim(),
        phone: phone.trim(),
      });
      setName('');
      setPhone('');
      setShowAdd(false);
      setErrors({});
    } catch (err) {
      setErrors({ form: err.message || 'Failed to add customer.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredCustomers = customers
    .filter((c) => (search ? matchName(c.name, search) || c.phone.includes(search) : true))
    .sort((a, b) => b.balance - a.balance);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Baki Khata (বাকি খাতা)
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Track customer credit and collections</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 glow-btn-primary text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <span>{showAdd ? 'Close' : '+ Add Customer'}</span>
        </button>
      </div>

      {/* Total Outstanding Card */}
      <div className="glass-card border border-sky-500/30 text-white p-5 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-sky-300">
            Total Outstanding Baki (মোট বকেয়া)
          </span>
          <div className="text-3xl font-black tabular-nums mt-0.5 text-rose-400">
            {formatMoney(totalBaki)}
          </div>
        </div>
        <div className="text-right text-xs text-sky-300/80 font-medium">
          {customers.filter((c) => c.balance > 0).length} active debtors
        </div>
      </div>

      {/* Add Customer Modal/Form */}
      {showAdd && (
        <div className="glass-card p-5 rounded-2xl border-2 border-sky-400/40 shadow-2xl space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-white">Add New Customer</h3>
          {errors.form && (
            <p className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-semibold">
              ⚠️ {errors.form}
            </p>
          )}
          <form onSubmit={handleAddCustomer} className="space-y-4" noValidate>
            <FormField id="name" label="Customer Name (নাম)" required error={errors.name}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahim"
                className="w-full px-3.5 py-2.5 text-base border border-white/15 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </FormField>

            <FormField id="phone" label="Mobile Phone (মোবাইল নম্বর)" required hint="11 digits (01...)" error={errors.phone}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01700000000"
                className="w-full px-3.5 py-2.5 text-base border border-white/15 rounded-xl bg-slate-900 text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                {saving ? 'Saving…' : 'Save Customer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or phone…"
          className="w-full px-4 py-3 pl-10 text-sm glass-input rounded-xl shadow-md text-slate-100 placeholder-slate-500"
        />
        <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading customer khata…</div>
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No customers in khata"
          description={search ? `No customer matches "${search}"` : 'Add your first customer to track baki.'}
          actionLabel="+ Add Customer"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <div className="divide-y divide-white/5 glass-card rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/customers/${c.id}`)}
              className="p-4 hover:bg-white/5 transition flex items-center justify-between cursor-pointer"
            >
              <div className="space-y-0.5">
                <h4 className="font-bold text-white text-base">{c.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{c.phone}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Due Balance</span>
                <span
                  className={`text-lg font-black tabular-nums ${
                    c.balance > 0 ? 'text-rose-400' : c.balance < 0 ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {formatMoney(c.balance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
