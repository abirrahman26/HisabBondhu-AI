import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import FormField from '../shared/ui/FormField';
import { isValidBDPhone, isValidName } from '../shared/lib/validate';

export default function SetupPage() {
  const navigate = useNavigate();
  const { saveShopProfile } = useAuth();

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!isValidName(shopName, 60)) {
      errs.shopName = 'Enter shop name (1–60 characters).';
    }
    if (!isValidName(ownerName, 60)) {
      errs.ownerName = 'Enter owner name (1–60 characters).';
    }
    if (!isValidBDPhone(phone)) {
      errs.phone = 'Enter a valid 11-digit Bangladeshi mobile number starting with 01.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await saveShopProfile({
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Failed to save shop profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-3xl mb-2 animate-float">
          ✨
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Shop Setup (দোকানের তথ্য)
        </h2>
        <p className="text-sm text-slate-400">
          Tell us about your business to personalize your digital assistant
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel py-8 px-6 sm:px-8 shadow-2xl border border-white/10 rounded-3xl">
          {serverError && (
            <div
              role="alert"
              className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs font-semibold text-rose-300 mb-4"
            >
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField id="shopName" label="Shop Name (দোকানের নাম)" required error={errors.shopName}>
              <input
                type="text"
                value={shopName}
                onChange={(e) => {
                  setShopName(e.target.value);
                  if (errors.shopName) setErrors((prev) => ({ ...prev, shopName: undefined }));
                }}
                placeholder="e.g. Rahima Store"
                className="w-full px-3.5 py-2.5 text-base text-slate-100 border border-white/15 rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </FormField>

            <FormField id="ownerName" label="Owner Name (মালিকের নাম)" required error={errors.ownerName}>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => {
                  setOwnerName(e.target.value);
                  if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: undefined }));
                }}
                placeholder="e.g. Md. Rahima"
                className="w-full px-3.5 py-2.5 text-base text-slate-100 border border-white/15 rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </FormField>

            <FormField
              id="phone"
              label="Owner Mobile Number"
              required
              hint="11 digits (01...)"
              error={errors.phone}
            >
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="01700000000"
                className="w-full px-3.5 py-2.5 text-base text-slate-100 border border-white/15 rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 font-mono"
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 glow-btn-primary text-white font-bold text-base rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Setting up…' : 'Complete Setup & Go to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
