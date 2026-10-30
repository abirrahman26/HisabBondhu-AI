import React, { useEffect } from 'react';

export default function Toast({
  message,
  type = 'info', // 'success', 'error', 'warning', 'info'
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: 'bg-green-700 text-white',
    error: 'bg-red-700 text-white',
    warning: 'bg-amber-600 text-white',
    info: 'bg-slate-800 text-white',
  };

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 transition-all animate-bounce-in"
    >
      <div
        className={`px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 text-sm font-medium ${
          typeStyles[type] || typeStyles.info
        }`}
      >
        <span>{message}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white font-bold p-1 leading-none text-base"
            aria-label="Close message"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
