import React, { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
  warningText,
}) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus cancel button by default for safety
      cancelBtnRef.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="glass-card max-w-sm w-full p-6 rounded-2xl shadow-2xl space-y-4 border border-white/15">
        <h3 id="dialog-title" className="text-lg font-bold text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-300">{message}</p>

        {warningText && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs font-medium text-amber-200">
            ⚠️ {warningText}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-white/15 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/30'
                : 'glow-btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
