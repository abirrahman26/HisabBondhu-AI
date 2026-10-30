import React, { useState } from 'react';
import { useData } from '../shared/data/DataContext';
import FormField from '../shared/ui/FormField';
import MoneyInput from '../shared/ui/MoneyInput';
import QtyInput from '../shared/ui/QtyInput';
import EmptyState from '../shared/ui/EmptyState';
import { formatMoney } from '../shared/lib/money';
import { matchName } from '../shared/lib/match';

export default function ProductsPage() {
  const { products, addProduct, archiveProduct, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [aliasStr, setAliasStr] = useState('');
  const [unit, setUnit] = useState('kg');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [lowStockAt, setLowStockAt] = useState('10');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Product name is required (1–60 characters).';
    if (buyPrice === '' || Number(buyPrice) < 0) errs.buyPrice = 'Enter a valid buy price (0 or more).';
    if (sellPrice === '' || Number(sellPrice) < 0) errs.sellPrice = 'Enter a valid sell price (0 or more).';
    if (stockQty === '' || Number(stockQty) < 0) errs.stockQty = 'Enter initial stock quantity (0 or more).';
    if (lowStockAt === '' || Number(lowStockAt) < 0) errs.lowStockAt = 'Enter low stock alert level.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await addProduct({
        name: name.trim(),
        aliases: aliasStr ? aliasStr.split(',').map((s) => s.trim()).filter(Boolean) : [],
        unit,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        stockQty: Number(stockQty),
        lowStockAt: Number(lowStockAt),
      });

      setShowForm(false);
      resetForm();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save product.' });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAliasStr('');
    setUnit('kg');
    setBuyPrice('');
    setSellPrice('');
    setStockQty('');
    setLowStockAt('10');
    setErrors({});
  };

  const filteredProducts = products.filter((p) =>
    search ? matchName(p.name, search, p.aliases) : true
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-sm text-slate-500">Manage your inventory, prices, and stock alerts</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <span>{showForm ? 'Close' : '+ Add Product'}</span>
        </button>
      </div>

      {/* Add Product Form Modal / Sheet */}
      {showForm && (
        <div className="bg-white p-5 rounded-2xl border-2 border-teal-600 shadow-md space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-lg font-bold text-slate-900">Add New Product</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>

          {errors.form && (
            <p className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
              ⚠️ {errors.form}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField id="name" label="Product Name (English / বাংলা)" required error={errors.name}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sugar (চিনি)"
                  className="w-full px-3.5 py-2.5 text-base border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700"
                />
              </FormField>

              <FormField id="aliases" label="Aliases (Banglish / Alternate)" hint="Comma separated">
                <input
                  type="text"
                  value={aliasStr}
                  onChange={(e) => setAliasStr(e.target.value)}
                  placeholder="e.g. chini, shugor"
                  className="w-full px-3.5 py-2.5 text-base border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <FormField id="unit" label="Unit (একক)" required>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-base border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 bg-white"
                >
                  <option value="kg">kg (কেজি)</option>
                  <option value="litre">litre (লিটার)</option>
                  <option value="piece">piece (পিস)</option>
                  <option value="packet">packet (প্যাকেট)</option>
                </select>
              </FormField>

              <FormField id="buyPrice" label="Buy Price (ক্রয়মূল্য)" required error={errors.buyPrice}>
                <MoneyInput
                  id="buyPrice"
                  value={buyPrice}
                  onChange={setBuyPrice}
                  placeholder="110"
                />
              </FormField>

              <FormField id="sellPrice" label="Sell Price (বিক্রয়মূল্য)" required error={errors.sellPrice}>
                <MoneyInput
                  id="sellPrice"
                  value={sellPrice}
                  onChange={setSellPrice}
                  placeholder="130"
                />
              </FormField>

              <FormField id="stockQty" label="Current Stock" required error={errors.stockQty}>
                <QtyInput
                  id="stockQty"
                  unit={unit}
                  value={stockQty}
                  onChange={setStockQty}
                  placeholder="50"
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition shadow-xs disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Product'}
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
          placeholder="Search products by name, বাংলা or Banglish…"
          className="w-full px-4 py-2.5 pl-10 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-700 shadow-xs"
        />
        <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading products…</div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No products in catalog"
          description={search ? `No products match "${search}"` : 'Add your first product to start tracking stock and sales.'}
          actionLabel="+ Add Product"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((p) => {
            const isLowStock = Number(p.stockQty) <= Number(p.lowStockAt);
            return (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{p.name}</h3>
                    {p.aliases && p.aliases.length > 0 && (
                      <p className="text-xs text-slate-400">({p.aliases.join(', ')})</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isLowStock
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {p.stockQty} {p.unit}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500">Sell: </span>
                    <span className="font-extrabold text-teal-800 text-sm">{formatMoney(p.sellPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Cost: </span>
                    <span className="font-semibold text-slate-600">{formatMoney(p.buyPrice)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
