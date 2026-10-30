import React from 'react';

export default function ErrorWithRetry({
  title = 'Something went wrong',
  message,
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="p-5 bg-red-50 border border-red-200 rounded-xl text-center space-y-3 max-w-md mx-auto my-4"
    >
      <div className="text-2xl text-red-600 font-bold">⚠️</div>
      <div className="space-y-1">
        <h4 className="font-bold text-red-900 text-base">{title}</h4>
        <p className="text-xs text-red-700">{message || 'Unable to complete the action. Please try again.'}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-lg transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
