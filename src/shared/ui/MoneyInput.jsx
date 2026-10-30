import React from 'react';
import { parseBengaliDigits } from '../lib/match';

export default function MoneyInput({
  id,
  value,
  onChange,
  placeholder = '0',
  disabled = false,
  className = '',
  ...props
}) {
  const handleChange = (e) => {
    let raw = e.target.value;
    // Normalize Bengali digits (e.g. ৫০০ -> 500)
    raw = parseBengaliDigits(raw);
    // Keep only numbers
    const clean = raw.replace(/\D/g, '');
    const num = clean ? parseInt(clean, 10) : '';
    onChange(num);
  };

  return (
    <div className="relative rounded-lg shadow-xs">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-base">
        ৳
      </div>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full pl-9 pr-3 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700 disabled:bg-slate-100 disabled:text-slate-400 font-semibold tabular-nums ${className}`}
        {...props}
      />
    </div>
  );
}
