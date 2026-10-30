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
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Failed to save shop profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Shop Setup
        </h2>
        <p className="text-sm text-slate-600">
          Tell us about your business to personalize your assistant
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl">
          {serverError && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800 mb-4"
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
                className="w-full px-3.5 py-2.5 text-base text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700"
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
                className="w-full px-3.5 py-2.5 text-base text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700"
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
                className="w-full px-3.5 py-2.5 text-base text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 font-mono"
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {loading ? 'Setting up…' : 'Complete Setup & Go to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
