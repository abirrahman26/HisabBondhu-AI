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
    <div className="relative rounded-xl shadow-xs">
      <input
        id={id}
        type="text"
        inputMode={isDecimalAllowed ? 'decimal' : 'numeric'}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full px-3.5 py-2.5 text-base text-slate-100 bg-slate-900/80 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 disabled:bg-slate-950/40 disabled:text-slate-600 font-semibold tabular-nums placeholder-slate-500 transition ${className}`}
        {...props}
      />
      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sky-400/90 text-sm font-semibold">
        {unit}
      </div>
    </div>
  );
}
