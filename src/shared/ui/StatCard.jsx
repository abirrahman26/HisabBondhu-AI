import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
}) {
  const variantStyles = {
    default: 'border-white/10 text-slate-100 hover:border-sky-500/30',
    warning: 'border-amber-500/30 text-amber-200 bg-amber-950/20 hover:border-amber-400/50',
    danger: 'border-rose-500/30 text-rose-200 bg-rose-950/20 hover:border-rose-400/50',
    success: 'border-emerald-500/30 text-emerald-200 bg-emerald-950/20 hover:border-emerald-400/50',
    teal: 'border-cyan-500/30 text-cyan-200 bg-cyan-950/20 hover:border-cyan-400/50',
  };

  return (
    <div
      className={`glass-card p-4 rounded-2xl flex flex-col justify-between ${
        variantStyles[variant] || variantStyles.default
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && <span className="text-xl p-1 rounded-lg bg-white/5">{icon}</span>}
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight tabular-nums text-white">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
