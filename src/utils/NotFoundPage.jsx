import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <span className="text-8xl mb-4 animate-bounce">🔍</span>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h2>
      <p className="text-gray-500 mb-6 text-center max-w-xs">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-5 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
      <span className="mt-8 text-xs text-gray-400">Let’s get you back on track!</span>
    </div>
  );
}