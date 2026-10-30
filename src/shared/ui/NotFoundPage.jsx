import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="glass-card p-10 text-center space-y-4 max-w-md mx-auto rounded-3xl border border-white/10 my-12 shadow-2xl">
      <span className="text-5xl block animate-float">🧭</span>
      <h1 className="text-2xl font-black text-white">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400">The page or resource you requested could not be found.</p>
      <div className="flex gap-3 justify-center pt-2">
        <Link to="/dashboard" className="glow-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          Open Dashboard
        </Link>
        <Link to="/" className="px-4 py-2.5 glass-card border-white/15 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10">
          Website Home
        </Link>
      </div>
    </div>
  );
}
