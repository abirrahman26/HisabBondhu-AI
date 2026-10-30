import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useData } from '../data/DataContext';
import ConfirmDialog from './ConfirmDialog';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { currentUser, shopProfile, logout, isFirebaseConfigured } = useAuth();
  const { isDemoLoaded, loadDemo, removeDemo } = useData();

  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [processingDemo, setProcessingDemo] = useState(false);

  const handleLoadDemo = async () => {
    setProcessingDemo(true);
    try {
      await loadDemo();
      setShowLoadDialog(false);
    } catch (err) {
      alert('Failed to load demo data: ' + err.message);
    } finally {
      setProcessingDemo(false);
    }
  };

  const handleRemoveDemo = async () => {
    setProcessingDemo(true);
    try {
      await removeDemo();
      setShowRemoveDialog(false);
    } catch (err) {
      alert('Failed to remove demo data: ' + err.message);
    } finally {
      setProcessingDemo(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & Account
        </h1>
        <p className="text-sm text-slate-500">Shop profile, Judge Mode, and system information</p>
      </div>

      {/* Shop Profile Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Shop Profile (দোকানের তথ্য)
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Shop Name</span>
            <span className="font-bold text-slate-800">{shopProfile?.shopName || 'Not Set'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Owner Name</span>
            <span className="font-bold text-slate-800">{shopProfile?.ownerName || 'Not Set'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Phone</span>
            <span className="font-mono text-slate-800">{shopProfile?.phone || 'Not Set'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Email / ID</span>
            <span className="text-slate-800 font-mono text-xs truncate block" title={currentUser?.email || currentUser?.uid}>
              {currentUser?.email || currentUser?.uid || 'Not signed in'}
            </span>
          </div>
        </div>
      </div>

      {/* Backend & Deployment Status */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h3 className="text-sm font-bold text-slate-900">Deployment & Environment</h3>
        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-500">Firebase Backend Status:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-full ${
              isFirebaseConfigured
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isFirebaseConfigured ? 'Connected ✓' : 'Local Preview'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-500">Live Vercel URL Target:</span>
          <span className="font-mono font-bold text-teal-800">hisabbondhuai.vercel.app</span>
        </div>
      </div>

      {/* Judge Mode / Demo Data (P1) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Judge Mode (পরীক্ষক মোড)</h3>
              <p className="text-xs text-slate-500">Load fictional demo records to evaluate the app</p>
            </div>
          </div>
        </div>

        {isDemoLoaded ? (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-indigo-900">
              Demo data (fictional) is currently active. All demo records are tagged <code className="bg-indigo-100 px-1 py-0.5 rounded-sm">isDemo: true</code>.
            </p>
            <button
              type="button"
              disabled={processingDemo}
              onClick={() => setShowRemoveDialog(true)}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
            >
              {processingDemo ? 'Removing…' : 'Remove Demo Data'}
            </button>
          </div>
        ) : (
          <div className="pt-1">
            <button
              type="button"
              disabled={processingDemo}
              onClick={() => setShowLoadDialog(true)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {processingDemo ? 'Loading…' : 'Load Demo Data'}
            </button>
          </div>
        )}
      </div>

      {/* Honest Limitations & Disclosures */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
        <h3 className="text-sm font-bold text-slate-900">System Information & Scope</h3>
        <ul className="list-disc pl-4 space-y-1 text-slate-500">
          <li><strong>Deployment:</strong> Configured for Vercel (hisabbondhuai.vercel.app) & Firebase Hosting.</li>
          <li><strong>Offline:</strong> Offline persistence is out of scope; requires internet connectivity.</li>
          <li><strong>SMS / WhatsApp:</strong> Direct customer SMS notifications are out of scope (P3).</li>
          <li><strong>Profit:</strong> Estimated based on selling price minus cost price snapshot.</li>
          <li><strong>Multi-user:</strong> Single owner account model (no staff accounts).</li>
        </ul>
      </div>

      {/* Logout */}
      <div>
        <button
          type="button"
          onClick={() => setShowLogoutDialog(true)}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm rounded-xl border border-red-200 transition"
        >
          Sign Out of Digital Khata
        </button>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showLoadDialog}
        title="Load Demo Data?"
        message="This will populate your shop with fictional products (Rice, Oil, Salt, Lentil) and sample customer credit records for evaluation."
        confirmLabel="Load Fictional Data"
        onConfirm={handleLoadDemo}
        onCancel={() => setShowLoadDialog(false)}
      />

      <ConfirmDialog
        isOpen={showRemoveDialog}
        title="Remove Demo Data?"
        message="This will delete only records tagged with isDemo: true. Any real records you created will remain untouched."
        confirmLabel="Remove"
        isDestructive
        onConfirm={handleRemoveDemo}
        onCancel={() => setShowRemoveDialog(false)}
      />

      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Sign Out?"
        message="Are you sure you want to sign out of your HisabBondhu account?"
        confirmLabel="Sign Out"
        isDestructive
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}
