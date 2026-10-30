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
    <div className="text-center py-12 px-4 bg-white rounded-xl border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4">
      <div className="text-4xl">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-lg transition shadow-xs"
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
