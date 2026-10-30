import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import FormField from '../shared/ui/FormField';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, currentUser, shopProfile, isFirebaseConfigured } = useAuth();

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
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
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
        navigate('/');
      }
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-block p-3 bg-teal-700 text-white rounded-2xl text-2xl shadow-md">
          🏪
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          HisabBondhu AI
        </h2>
        <p className="text-sm text-slate-600">
          {isRegister ? 'Create your shop owner account' : 'Sign in to your digital khata'}
        </p>

        {!isFirebaseConfigured && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center font-medium mt-2">
            ℹ️ Running in Local Preview Mode. Firebase credentials can be set in <code>.env</code>.
          </div>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl space-y-6">
          {serverError && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800"
            >
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField id="email" label="Email Address" required error={errors.email}>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="shopkeeper@example.com"
                className="w-full px-3.5 py-2.5 text-base text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
              />
            </FormField>

            <FormField
              id="password"
              label="Password"
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
                className="w-full px-3.5 py-2.5 text-base text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-xl transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Please wait…' : isRegister ? 'Register & Setup Shop' : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">Or</span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrors({});
                setServerError('');
              }}
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
