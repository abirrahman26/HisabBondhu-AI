import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import FormField from '../shared/ui/FormField';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, currentUser, shopProfile } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // If already logged in, navigate onward
  React.useEffect(() => {
    if (currentUser) {
      if (!shopProfile) {
        navigate('/setup');
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from === '/' ? '/dashboard' : from, { replace: true });
      }
    }
  }, [currentUser, shopProfile, navigate, location]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
        navigate('/setup');
      } else {
        await login(email, password);
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from === '/' ? '/dashboard' : from);
      }
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setServerError('');
    try {
      await login('demo@hisabbondhu.ai', '123456');
      navigate('/dashboard');
    } catch {
      // If demo user doesn't exist yet in real auth, try registering it
      try {
        await register('demo@hisabbondhu.ai', '123456');
        navigate('/setup');
      } catch (err2) {
        setServerError('Demo login failed: ' + (err2.message || 'Please register manually.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <div className="inline-flex p-3.5 bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-sky-500/20 text-3xl animate-float">
          🤖
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">
          হিসাববন্ধু <span className="text-sky-400">AI</span>
        </h2>
        <p className="text-sm text-slate-400">
          {isRegister ? 'দোকানের জন্য নতুন একাউন্ট খুলুন' : 'স্মার্ট ডিজিটাল খাতা ও এআই ব্যবসায়িক সহকারী'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-6 sm:px-8 rounded-3xl space-y-5 border border-white/10 shadow-2xl">
          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-sky-500/20 hover:from-emerald-500/30 hover:to-sky-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-emerald-950/40"
          >
            <span className="text-base group-hover:scale-110 transition-transform">⚡</span>
            <span>এক ক্লিকে ডেমো প্রবেশ (Instant Demo Access)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-700/60" />
            <span className="absolute bg-[#0b172e] px-3 text-xs uppercase text-slate-400 font-semibold tracking-wider">
              অথবা ইমেইল দিয়ে
            </span>
          </div>

          {serverError && (
            <div
              role="alert"
              className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs font-semibold text-red-200"
            >
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField id="email" label="Email Address (ইমেইল)" required error={errors.email}>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="shopkeeper@example.com"
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl"
              />
            </FormField>

            <FormField
              id="password"
              label="Password (পাসওয়ার্ড)"
              required
              hint="Min. 6 characters"
              error={errors.password}
            >
              <input
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl"
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 glow-btn-primary font-bold text-base rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block">⚙️</span>
                  <span>অপেক্ষা করুন…</span>
                </span>
              ) : isRegister ? (
                'Register & Setup Shop'
              ) : (
                'Sign In (প্রবেশ করুন)'
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-700/40">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrors({});
                setServerError('');
              }}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
