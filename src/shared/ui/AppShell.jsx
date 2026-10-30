import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function AppShell() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/sell', label: 'Sell', icon: '⚡' },
    { to: '/customers', label: 'Baki', icon: '📖' },
    { to: '/products', label: 'Products', icon: '📦' },
    { to: '/assistant', label: 'Assistant', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div
          role="alert"
          className="bg-amber-600 text-white text-xs font-bold text-center py-2 px-4 shadow-xs sticky top-0 z-50 flex items-center justify-center gap-2"
        >
          <span>⚠️</span>
          <span>No internet connection. Changes cannot be saved until reconnected.</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-teal-800 text-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span>হিসাববন্ধু AI</span>
            <span className="text-[10px] bg-teal-600/80 px-2 py-0.5 rounded-full font-medium tracking-wide">
              BETA
            </span>
          </NavLink>
          {/* Desktop Navigation Links (Visible on tablet & desktop >= 768px) */}
          <nav aria-label="Desktop Navigation" className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition ${
                    isActive ? 'bg-teal-900 text-white shadow-xs' : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
            <div className="h-4 w-px bg-teal-600/60 mx-1" />
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-xs font-semibold px-2.5 py-2 rounded-lg transition ${
                  isActive ? 'bg-teal-900 text-white' : 'text-teal-100 hover:bg-teal-700'
                }`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `text-xs font-semibold px-2.5 py-2 rounded-lg transition ${
                  isActive ? 'bg-teal-900 text-white' : 'text-teal-100 hover:bg-teal-700'
                }`
              }
            >
              Expenses
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `text-xs font-semibold px-3 py-2 rounded-lg transition ${
                  isActive ? 'bg-teal-900 text-white' : 'bg-teal-700 text-white hover:bg-teal-600'
                }`
              }
            >
              Settings
            </NavLink>
          </nav>

          {/* Mobile top-bar secondary links (History, Expenses, Settings) */}
          <div className="flex md:hidden items-center gap-1.5">
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-xs font-semibold px-2 py-1.5 rounded-lg transition ${
                  isActive ? 'bg-teal-900 text-white' : 'text-teal-100 hover:bg-teal-700'
                }`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `text-xs font-semibold px-2 py-1.5 rounded-lg transition ${
                  isActive ? 'bg-teal-900 text-white' : 'text-teal-100 hover:bg-teal-700'
                }`
              }
            >
              Expenses
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                  isActive ? 'bg-teal-900 text-white' : 'bg-teal-700 text-white hover:bg-teal-600'
                }`
              }
            >
              Settings
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:py-6">
        <Outlet />
      </main>

      {/* Floating Chatbot Launcher Button (Visible across all routes except /assistant) */}
      {location.pathname !== '/assistant' && (
        <NavLink
          to="/assistant"
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm border border-indigo-500/40"
          aria-label="Open হিসাববন্ধু AI Chatbot"
        >
          <span className="text-lg">🤖</span>
          <span className="font-semibold">হিসাববন্ধু Chatbot</span>
        </NavLink>
      )}

      {/* Bottom Navigation for Mobile / Fixed Bar */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 md:relative md:border-t-0 md:bg-transparent"
      >
        <div className="max-w-4xl mx-auto flex justify-around items-center h-16 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition ${
                  isActive ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <span className="text-xl leading-none mb-1">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
