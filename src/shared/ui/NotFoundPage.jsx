import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="p-8 text-center space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">404 - Page Not Found</h1>
      <p className="text-slate-600">The page you requested does not exist.</p>
      <div>
        <Link to="/" className="inline-block px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
