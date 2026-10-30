import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
}) {
  const variantStyles = {
    default: 'bg-white border-slate-200 text-slate-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    teal: 'bg-teal-50 border-teal-200 text-teal-900',
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between ${
        variantStyles[variant] || variantStyles.default
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
