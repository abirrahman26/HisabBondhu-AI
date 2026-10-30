import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../shared/data/DataContext';
import FormField from '../shared/ui/FormField';
import MoneyInput from '../shared/ui/MoneyInput';
import QtyInput from '../shared/ui/QtyInput';
import EmptyState from '../shared/ui/EmptyState';
import { calcLineTotal, formatMoney } from '../shared/lib/money';
import { isValidBDPhone, isValidName } from '../shared/lib/validate';

export default function SellPage() {
  const navigate = useNavigate();
  const { products, customers, createSale, addCustomer, loading } = useData();

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' | 'mobile_banking' | 'baki'
  const [paymentLabel, setPaymentLabel] = useState('bKash');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [negativeStockAccepted, setNegativeStockAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(null);

  // Auto-select first product when available
  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      setUnitPrice(String(products[0].sellPrice));
    }
  }, [products, selectedProductId]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const lineTotal = calcLineTotal(qty, unitPrice);
  const isStockLowOrNegative = selectedProduct && Number(qty) > Number(selectedProduct.stockQty);

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setUnitPrice(String(prod.sellPrice));
    }
  };

  const validate = () => {
    const errs = {};
    if (!selectedProductId) errs.product = 'Select a product.';
    if (!qty || Number(qty) <= 0) errs.qty = 'Quantity must be greater than 0.';
    if (unitPrice === '' || Number(unitPrice) < 0) errs.unitPrice = 'Enter selling price.';

    if (paymentType === 'baki') {
      if (showNewCustomer) {
        if (!isValidName(newCustName)) errs.custName = 'Customer name required (1–60 chars).';
        if (!isValidBDPhone(newCustPhone)) errs.custPhone = 'Valid 11-digit BD mobile required (01...).';
      } else if (!selectedCustomerId) {
        errs.customer = 'Select or add a customer for Baki.';
      }
    }

    if (isStockLowOrNegative && !negativeStockAccepted) {
      errs.stock = `Insufficient stock: only ${selectedProduct.stockQty} left.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      let finalCustomerId = selectedCustomerId;
      let finalCustName = 'Walk-in Customer';

      if (paymentType === 'baki') {
        if (showNewCustomer) {
          finalCustomerId = await addCustomer({
            name: newCustName.trim(),
            phone: newCustPhone.trim(),
          });
          finalCustName = newCustName.trim();
        } else {
          const c = customers.find((cust) => cust.id === selectedCustomerId);
          if (c) finalCustName = c.name;
        }
      }

      const saleRecord = {
        total: lineTotal,
        paymentType,
        paymentLabel: paymentType === 'mobile_banking' ? paymentLabel : null,
        customerId: paymentType === 'baki' ? finalCustomerId : null,
        negativeStockAccepted,
        createdBy: 'manual',
        items: [
          {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            qty: Number(qty),
            unitPrice: Number(unitPrice),
            unitCost: Number(selectedProduct.buyPrice || 0),
            lineTotal,
          },
        ],
      };

      await createSale(saleRecord);

      setSavedSuccess({
        productName: selectedProduct?.name,
        qty,
        unit: selectedProduct?.unit,
        total: lineTotal,
        paymentType,
        customerName: finalCustName,
      });
    } catch (err) {
      setErrors({ form: err.message || 'Transaction failed. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (!loading && products.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No products available to sell"
        description="Add items to your product catalog before recording sales."
        actionLabel="+ Add First Product"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Record Sale (বিক্রি হিসাব)
        </h1>
        <p className="text-sm text-slate-500">Atomic inventory decrement and baki khata logging</p>
      </div>

      {savedSuccess ? (
        <div className="bg-white p-6 rounded-2xl border-2 border-green-500 shadow-md text-center space-y-4 animate-in fade-in">
          <div className="text-4xl text-green-600">✓</div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Sale Recorded Successfully!</h3>
            <p className="text-sm text-slate-600">
              {savedSuccess.qty} {savedSuccess.unit} {savedSuccess.productName} for{' '}
              <strong className="text-teal-800">{formatMoney(savedSuccess.total)}</strong>
            </p>
            <p className="text-xs text-slate-500">
              Payment: <span className="font-semibold uppercase">{savedSuccess.paymentType}</span> (
              {savedSuccess.customerName})
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setSavedSuccess(null);
                setQty('1');
                setNegativeStockAccepted(false);
              }}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition"
            >
              + Another Sale
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {errors.form && (
            <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              ⚠️ {errors.form}
            </p>
          )}

          {/* Product Select */}
          <FormField id="product" label="Select Product" required error={errors.product}>
            <select
              value={selectedProductId}
              onChange={handleProductChange}
              className="w-full px-3.5 py-2.5 text-base border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 bg-white font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stockQty} {p.unit}) — {formatMoney(p.sellPrice)}
                </option>
              ))}
            </select>
          </FormField>

          {/* Qty & Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <FormField id="qty" label="Quantity" required error={errors.qty}>
              <QtyInput
                id="qty"
                unit={selectedProduct?.unit || 'kg'}
                value={qty}
                onChange={setQty}
                placeholder="2"
              />
            </FormField>

            <FormField id="unitPrice" label="Unit Price" required error={errors.unitPrice}>
              <MoneyInput
                id="unitPrice"
                value={unitPrice}
                onChange={setUnitPrice}
                placeholder="130"
              />
            </FormField>
          </div>

          {/* Negative Stock Warning */}
          {isStockLowOrNegative && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="text-xs font-semibold text-amber-900">
                ⚠️ Only {selectedProduct?.stockQty} {selectedProduct?.unit} left in stock. You are selling {qty} {selectedProduct?.unit}.
              </p>
              <label className="flex items-center gap-2 text-xs font-medium text-amber-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={negativeStockAccepted}
                  onChange={(e) => setNegativeStockAccepted(e.target.checked)}
                  className="rounded-sm text-teal-700 focus:ring-teal-700"
                />
                <span>I understand and want to sell anyway (Negative stock accepted)</span>
              </label>
            </div>
          )}

          {/* Payment Type Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-800">
              Payment Method (মূল্য পরিশোধ পদ্ধতি) <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'cash', label: 'Cash (নগদ)' },
                { type: 'mobile_banking', label: 'bKash/Nagad' },
                { type: 'baki', label: 'Baki (বাকি)' },
              ].map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setPaymentType(m.type)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition text-center ${
                    paymentType === m.type
                      ? 'border-teal-700 bg-teal-50 text-teal-900 shadow-xs ring-1 ring-teal-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Banking Type */}
          {paymentType === 'mobile_banking' && (
            <div className="flex gap-2">
              {['bKash', 'Nagad', 'Rocket'].map((wallet) => (
                <button
                  key={wallet}
                  type="button"
                  onClick={() => setPaymentLabel(wallet)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    paymentLabel === wallet
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {wallet}
                </button>
              ))}
            </div>
          )}

          {/* Baki Customer Selector / Inline Add */}
          {paymentType === 'baki' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">Baki Customer</span>
                <button
                  type="button"
                  onClick={() => setShowNewCustomer(!showNewCustomer)}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  {showNewCustomer ? 'Choose Existing' : '+ Add New Customer'}
                </button>
              </div>

              {showNewCustomer ? (
                <div className="space-y-3">
                  <FormField id="newCustName" label="Customer Name" required error={errors.custName}>
                    <input
                      type="text"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      placeholder="e.g. Rahim"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    />
                  </FormField>
                  <FormField id="newCustPhone" label="Mobile Phone" required hint="11 digits" error={errors.custPhone}>
                    <input
                      type="tel"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="01700000001"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </FormField>
                </div>
              ) : (
                <FormField id="customer" label="Select Customer" required error={errors.customer}>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) — {formatMoney(c.balance)}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}
            </div>
          )}

          {/* Summary Banner */}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Amount</span>
              <div className="text-2xl font-extrabold text-teal-800 tabular-nums">
                {formatMoney(lineTotal)}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {saving ? 'Processing…' : 'Complete Sale'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
