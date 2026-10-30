import React from 'react';

export default function EmptyState({
  icon = '📋',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) {
  return (
    <div className="glass-card text-center py-12 px-6 rounded-2xl max-w-lg mx-auto space-y-4 border border-white/10 shadow-2xl">
      <div className="text-4xl p-3 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10 animate-float">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-slate-100">{title}</h3>
        {description && <p className="text-sm text-slate-400 max-w-md mx-auto">{description}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 glow-btn-primary font-bold text-sm rounded-xl transition shadow-lg"
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-sm rounded-xl transition border border-white/10"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
