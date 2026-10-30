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
    <div className="relative rounded-xl shadow-xs">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400 font-bold text-base">
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
        className={`block w-full pl-9 pr-3.5 py-2.5 text-base text-slate-100 bg-slate-900/80 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 disabled:bg-slate-950/40 disabled:text-slate-600 font-semibold tabular-nums placeholder-slate-500 transition ${className}`}
        {...props}
      />
    </div>
  );
}
