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
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Settings & Account
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Shop profile, Judge Mode, and system information</p>
      </div>

      {/* Shop Profile Summary */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-3.5">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-2.5">
          Shop Profile (দোকানের তথ্য)
        </h3>
        <div className="grid grid-cols-2 gap-3.5 text-sm">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Shop Name</span>
            <span className="font-bold text-white">{shopProfile?.shopName || 'Not Set'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Owner Name</span>
            <span className="font-bold text-white">{shopProfile?.ownerName || 'Not Set'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Phone</span>
            <span className="font-mono text-slate-200">{shopProfile?.phone || 'Not Set'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Email / ID</span>
            <span className="text-slate-200 font-mono text-xs truncate block" title={currentUser?.email || currentUser?.uid}>
              {currentUser?.email || currentUser?.uid || 'Not signed in'}
            </span>
          </div>
        </div>
      </div>

      {/* Backend & Deployment Status */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-2.5">
        <h3 className="text-sm font-bold text-white">Deployment & Environment</h3>
        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-400">Firebase Backend Status:</span>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-full ${
              isFirebaseConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
            }`}
          >
            {isFirebaseConfigured ? 'Connected ✓' : 'Local Preview'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-400">Live Vercel URL Target:</span>
          <span className="font-mono font-bold text-sky-400">hisabbondhuai.vercel.app</span>
        </div>
      </div>

      {/* Judge Mode / Demo Data (P1) */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl p-2 bg-white/5 rounded-xl border border-white/10">⚖️</span>
            <div>
              <h3 className="text-base font-bold text-white">Judge Mode (পরীক্ষক মোড)</h3>
              <p className="text-xs text-slate-400">Load fictional demo records to evaluate the app</p>
            </div>
          </div>
        </div>

        {isDemoLoaded ? (
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-400/30 rounded-xl space-y-2.5">
            <p className="text-xs font-semibold text-indigo-200">
              Demo data (fictional) is currently active. All demo records are tagged <code className="bg-indigo-900/60 text-sky-300 px-1.5 py-0.5 rounded-sm font-mono">isDemo: true</code>.
            </p>
            <button
              type="button"
              disabled={processingDemo}
              onClick={() => setShowRemoveDialog(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50"
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
              className="px-4 py-2.5 glow-btn-primary text-white font-bold text-sm rounded-xl transition shadow-md disabled:opacity-50"
            >
              {processingDemo ? 'Loading…' : 'Load Demo Data'}
            </button>
          </div>
        )}
      </div>

      {/* Honest Limitations & Disclosures */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-3 text-xs text-slate-400">
        <h3 className="text-sm font-bold text-white">System Information & Scope</h3>
        <ul className="list-disc pl-4 space-y-1.5">
          <li><strong>Deployment:</strong> Configured for Vercel (<span className="text-sky-400 font-mono">hisabbondhuai.vercel.app</span>) & Firebase Hosting.</li>
          <li><strong>Zero-Math Hallucination:</strong> Calculation queries always verified via deterministic ledger code.</li>
          <li><strong>Propose-Confirm:</strong> Automated credit actions require explicit shopkeeper confirmation.</li>
          <li><strong>Profit:</strong> Estimated based on selling price minus cost price snapshot.</li>
          <li><strong>Multi-user:</strong> Single owner account model (no staff accounts).</li>
        </ul>
      </div>

      {/* Logout */}
      <div>
        <button
          type="button"
          onClick={() => setShowLogoutDialog(true)}
          className="w-full py-3 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 font-bold text-sm rounded-xl border border-rose-500/40 transition shadow-lg"
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
