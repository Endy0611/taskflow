import React from 'react';

export default function OfflineMode() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90">
      <svg
        className="w-16 h-16 text-primary mb-4 animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 5.636a9 9 0 1 0 0 12.728M15.536 8.464a5 5 0 1 0 0 7.072"
        />
        <circle cx="12" cy="20" r="1" fill="currentColor" />
      </svg>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Opps! No Connection</h2>
      <p className="text-gray-600 mb-4 text-center">
        Please check your internet connection.<br />
        Some features may not be available.
      </p>
    </div>
  );
}