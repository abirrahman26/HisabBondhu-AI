import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, shopProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xl animate-spin">⚙️</span>
          <p className="text-sm font-semibold text-slate-500">Loading HisabBondhu AI…</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no shop profile setup, redirect to setup unless already on /setup
  if (!shopProfile && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }

  return children;
}
