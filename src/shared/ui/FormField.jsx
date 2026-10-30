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
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-red-600 font-bold">*</span>}
        </label>
        {hint && (
          <span id={hintId} className="text-xs text-slate-500">
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
        <p id={errorId} className="text-xs font-medium text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
