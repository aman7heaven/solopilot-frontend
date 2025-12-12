import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [localError, setLocalError] = useState(null);

  // Redirect to admin if already logged in
  useEffect(() => {
    if (user?.token) {
      navigate('/admin', { replace: true });
    }
  }, [user?.token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!form.emailOrUsername || !form.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(form.emailOrUsername, form.password);
      // navigate via useEffect when user.token changes
    } catch (err) {
      setLocalError(err?.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#020617] via-[#020817] to-[#02010f] px-4">
      {/* soft background accents */}
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-[#22d3ee]/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#f97316]/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 110 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* subtle outer glow */}
        <div className="absolute inset-0 -z-10 rounded-[32px] bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.85)]" />

        {/* card */}
        <div className="rounded-[32px] border border-white/10 bg-[#020617]/95 px-7 py-7 sm:px-8 sm:py-8 backdrop-blur-xl">
          {/* logo header */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-7 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#facc15] via-[#f97316] to-[#a855f7] shadow-md shadow-[#f97316]/40">
              <span className="text-base font-bold text-slate-900">AD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Admin Login
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Secure access to your portfolio dashboard
            </p>
          </motion.div>

          {/* error state */}
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-3 text-xs sm:text-sm text-red-200"
            >
              <span className="mt-0.5 text-base">⚠️</span>
              <span>{error || localError}</span>
            </motion.div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="mb-5 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
            >
              <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Email or Username
              </label>
              <input
                type="text"
                name="emailOrUsername"
                value={form.emailOrUsername}
                onChange={handleChange}
                placeholder="admin@example.com"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 }}
            >
              <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] py-3 text-sm sm:text-base font-semibold text-slate-900 shadow-md shadow-[#f97316]/40 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  Signing in…
                </>
              ) : (
                <>
                  <span className="text-base">🔐</span>
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          {/* back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.36 }}
            className="mt-2 flex items-center justify-center text-center"
          >
            <a
              href="/"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span className="text-sm">←</span>
              <span>Back to portfolio</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}


