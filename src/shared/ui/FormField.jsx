import React from 'react';

export default function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  children,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-200">
          {label} {required && <span className="text-rose-400 font-bold">*</span>}
        </label>
        {hint && (
          <span id={hintId} className="text-xs text-slate-400">
            {hint}
          </span>
        )}
      </div>

      {React.cloneElement(children, {
        id,
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': Boolean(error),
        required,
      })}

      {error && (
        <p id={errorId} className="text-xs font-semibold text-rose-400 mt-1 flex items-center gap-1" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
