import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function HeroEditor() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        professionalTitle: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        setLoading(true);
        try {
            const data = await api.hero.getHeroSection();
            setForm(
                data || { firstName: '', lastName: '', professionalTitle: '' },
            );
            setError(null);
        } catch (err) {
            setError(err?.message || 'Failed to load hero section');
            console.error('Hero fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await api.hero.updateHeroSection(form);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err?.message || 'Failed to save hero section');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-50">
                    Hero <span className="text-sky-400">Section</span>
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Update the name and title shown on your public landing
                    page.
                </p>
            </div>

            {/* Alerts */}
            <div className="mb-4 space-y-3">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                    >
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                    >
                        ✓ Hero section updated successfully.
                    </motion.div>
                )}
            </div>

            {/* Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 shadow-sm">
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-2xl flex-col gap-5"
                >
                    {/* First / Last name in grid on md+ */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }}
                        >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="e.g., Aman"
                                disabled={saving}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="e.g., Saxena"
                                disabled={saving}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Professional Title
                        </label>
                        <input
                            type="text"
                            name="professionalTitle"
                            value={form.professionalTitle}
                            onChange={handleChange}
                            placeholder="e.g., Backend / Full-Stack Developer"
                            disabled={saving}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
                        />
                        <p className="mt-1 text-[11px] text-slate-500">
                            This appears under your name on the landing page.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pt-2"
                    >
                        <motion.button
                            whileHover={{ scale: saving ? 1 : 1.02, y: saving ? 0 : -1 }}
                            whileTap={{ scale: saving ? 1 : 0.98 }}
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-sky-700/40 transition-all hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <span>💾</span>
                                    Save Changes
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
}
