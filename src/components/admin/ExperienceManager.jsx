import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        companyName: '',
        designation: '',
        location: '',
        summary: '',
        dtStartedOn: '',
        dtEndedOn: '',
        isCurrentlyWorking: false,
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const data = await api.experience.getAll();
            setExperiences(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err?.message || 'Failed to load experiences');
            console.error('Experience fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm({
            companyName: '',
            designation: '',
            location: '',
            summary: '',
            dtStartedOn: '',
            dtEndedOn: '',
            isCurrentlyWorking: false,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const payload = {
                ...form,
                dtStartedOn: form.dtStartedOn ? new Date(form.dtStartedOn).toISOString() : null,
                dtEndedOn: form.isCurrentlyWorking ? null : (form.dtEndedOn ? new Date(form.dtEndedOn).toISOString() : null),
            };

            if (editingId) {
                await api.experience.update(editingId, payload);
            } else {
                await api.experience.create(payload);
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            resetForm();
            await fetchExperiences();
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Failed to save experience');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (exp) => {
        const started = exp.dtStartedOn ? new Date(exp.dtStartedOn).toISOString().split('T')[0] : '';
        const ended = exp.dtEndedOn ? new Date(exp.dtEndedOn).toISOString().split('T')[0] : '';

        setForm({
            companyName: exp.companyName || '',
            designation: exp.designation || '',
            location: exp.location || '',
            summary: exp.summary || '',
            dtStartedOn: started,
            dtEndedOn: ended,
            isCurrentlyWorking: exp.isCurrentlyWorking || false,
        });
        setEditingId(exp.uuid);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;

        setSaving(true);
        try {
            await api.experience.remove(id);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            await fetchExperiences();
        } catch (err) {
            setError(err?.message || 'Failed to delete experience');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Experience</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (showForm && editingId) {
                            resetForm();
                        } else {
                            setShowForm(!showForm);
                        }
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                    {showForm ? '✕ Cancel' : '+ New Experience'}
                </motion.button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400"
                >
                    ✓ Experience saved successfully!
                </motion.div>
            )}

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="mb-8 max-w-4xl space-y-4 p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                placeholder="Acme Corp"
                                disabled={saving}
                                required
                                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                placeholder="Senior Developer"
                                disabled={saving}
                                required
                                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                            />
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="San Francisco, CA"
                            disabled={saving}
                            className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Summary</label>
                        <textarea
                            name="summary"
                            value={form.summary}
                            onChange={handleChange}
                            placeholder="Describe your role and achievements..."
                            disabled={saving}
                            rows="3"
                            className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all resize-none"
                        />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                            <input
                                type="date"
                                name="dtStartedOn"
                                value={form.dtStartedOn}
                                onChange={handleChange}
                                disabled={saving}
                                required
                                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                            <input
                                type="date"
                                name="dtEndedOn"
                                value={form.dtEndedOn}
                                onChange={handleChange}
                                disabled={saving || form.isCurrentlyWorking}
                                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                            />
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isCurrentlyWorking"
                            checked={form.isCurrentlyWorking}
                            onChange={handleChange}
                            disabled={saving}
                            className="w-4 h-4 rounded border-2 border-purple-500/30 accent-purple-500 cursor-pointer disabled:opacity-50"
                        />
                        <label className="text-sm font-medium text-slate-300 cursor-pointer">
                            Currently working here
                        </label>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="flex gap-3"
                    >
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : editingId ? (
                                '💾 Update Experience'
                            ) : (
                                '💾 Create Experience'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                            className="px-6 py-3 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all"
                        >
                            Clear
                        </button>
                    </motion.div>
                </motion.form>
            )}

            {experiences.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-slate-400"
                >
                    <p className="text-lg">No experience yet. Add your first one!</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {experiences.map((exp, idx) => (
                        <motion.div
                            key={exp.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{exp.companyName}</h3>
                                    <p className="text-purple-400 font-semibold">{exp.designation}</p>
                                    {exp.location && <p className="text-slate-400 text-sm">{exp.location}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(exp)}
                                        disabled={saving}
                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 transition-all text-sm font-medium"
                                    >
                                        ✏️ Edit
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(exp.uuid)}
                                        disabled={saving}
                                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 transition-all text-sm font-medium"
                                    >
                                        🗑️ Delete
                                    </motion.button>
                                </div>
                            </div>
                            <p className="text-slate-300 mb-3">{exp.summary}</p>
                            <p className="text-sm text-slate-400">
                                {new Date(exp.dtStartedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} —{' '}
                                {exp.isCurrentlyWorking ? (
                                    <span className="text-blue-400 font-semibold">Present</span>
                                ) : (
                                    new Date(exp.dtEndedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                                )}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
