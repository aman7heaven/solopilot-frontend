import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function AboutEditor() {
    const [form, setForm] = useState({
        aboutMe: '',
        linkedinUrl: '',
        twitterUrl: '',
        githubUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [profileFile, setProfileFile] = useState(null);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        setLoading(true);
        try {
            const data = await api.about.getAboutSection();
            setForm({
                aboutMe: data?.aboutMe || '',
                linkedinUrl: data?.linkedInUrl || '',
                twitterUrl: data?.twitterUrl || '',
                githubUrl: data?.githubUrl || '',
            });
            setError(null);
        } catch (err) {
            setError(err?.message || 'Failed to load about section');
            console.error('About fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const jsonPayload = {
                aboutMe: form.aboutMe?.trim() ? form.aboutMe.trim() : null,
                linkedinUrl: form.linkedinUrl?.trim() ? form.linkedinUrl.trim() : null,
                twitterUrl: form.twitterUrl?.trim() ? form.twitterUrl.trim() : null,
                githubUrl: form.githubUrl?.trim() ? form.githubUrl.trim() : null,
            };

            const formData = new FormData();
            formData.append(
                'payload',
                new Blob([JSON.stringify(jsonPayload)], {
                    type: 'application/json',
                }),
            );
            if (profileFile) {
                formData.append('image', profileFile);
            }

            await api.about.updateAboutSection(formData);
            setSuccess(true);
            setProfileFile(null);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err?.message || 'Failed to save about section');
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
            exit={{ opacity: 0, y: -16 }}
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-50">
                    About <span className="text-sky-400">Section</span>
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Manage your bio, profile image, and social links shown on the portfolio.
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
                        ✓ About section updated successfully.
                    </motion.div>
                )}
            </div>

            {/* Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 shadow-sm">
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-3xl flex-col gap-6"
                >
                    {/* About text + profile image: stack on mobile, side-by-side on md+ */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }}
                        >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                About Me
                            </label>
                            <textarea
                                name="aboutMe"
                                value={form.aboutMe}
                                onChange={handleChange}
                                placeholder="Share a short snapshot of who you are and how you like to build software..."
                                disabled={saving}
                                rows={6}
                                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
                            />
                            <p className="mt-1 text-[11px] text-slate-500">
                                This appears as the main paragraph in your About section.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 }}
                        >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Profile Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={saving}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs sm:text-sm text-slate-300 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-sky-500/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-sky-300 hover:file:bg-sky-500/20 disabled:opacity-60"
                            />
                            {profileFile && (
                                <p className="mt-2 text-xs sm:text-sm text-sky-300">
                                    Selected: {profileFile.name}
                                </p>
                            )}
                            <p className="mt-1 text-[11px] text-slate-500">
                                Upload a square image for best results. Leaving empty keeps the current one.
                            </p>
                        </motion.div>
                    </div>

                    {/* Social links – responsive grid */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 }}
                    >
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Social Links
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    name="linkedinUrl"
                                    value={form.linkedinUrl}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/you"
                                    disabled={saving}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Twitter / X
                                </label>
                                <input
                                    type="url"
                                    name="twitterUrl"
                                    value={form.twitterUrl}
                                    onChange={handleChange}
                                    placeholder="https://twitter.com/you"
                                    disabled={saving}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    GitHub
                                </label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={form.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/you"
                                    disabled={saving}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Save button */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
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
