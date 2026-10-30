import React from 'react';
import { parseBengaliDigits } from '../lib/match';

export default function QtyInput({
  id,
  value,
  onChange,
  unit = 'kg',
  placeholder = '1',
  disabled = false,
  className = '',
  ...props
}) {
  const isDecimalAllowed = unit === 'kg' || unit === 'litre';

  const handleChange = (e) => {
    let raw = e.target.value;
    raw = parseBengaliDigits(raw);

    if (isDecimalAllowed) {
      // allow numbers and a single decimal point
      raw = raw.replace(/[^0-9.]/g, '');
      const parts = raw.split('.');
      if (parts.length > 2) {
        raw = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts[1] && parts[1].length > 3) {
        raw = parts[0] + '.' + parts[1].slice(0, 3);
      }
    } else {
      // only integers
      raw = raw.replace(/\D/g, '');
    }

    onChange(raw);
  };

  return (
    <div className="relative rounded-lg shadow-xs">
      <input
        id={id}
        type="text"
        inputMode={isDecimalAllowed ? 'decimal' : 'numeric'}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full px-3 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700 disabled:bg-slate-100 disabled:text-slate-400 font-semibold tabular-nums ${className}`}
        {...props}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-sm font-medium">
        {unit}
      </div>
    </div>
  );
}
