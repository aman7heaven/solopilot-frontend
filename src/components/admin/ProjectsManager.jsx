import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        projectName: '',
        summary: '',
        gitHubUrl: '',
        deploymentLink: '',
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await api.projects.getAll();
            setProjects(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err?.message || 'Failed to load projects');
            console.error('Projects fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm({
            projectName: '',
            summary: '',
            gitHubUrl: '',
            deploymentLink: '',
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingId) {
                await api.projects.update(editingId, form);
            } else {
                await api.projects.create(form);
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            resetForm();
            await fetchProjects();
        } catch (err) {
            setError(err?.message || 'Failed to save project');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        setForm(project);
        setEditingId(project.uuid);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        setSaving(true);
        try {
            await api.projects.remove(id);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            await fetchProjects();
        } catch (err) {
            setError(err?.message || 'Failed to delete project');
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
                <h2 className="text-3xl font-bold">Projects</h2>
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
                    {showForm ? '✕ Cancel' : '+ New Project'}
                </motion.button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
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
                    ✓ Project saved successfully!
                </motion.div>
            )}

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="mb-8 max-w-4xl space-y-4 p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl"
                >
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                        <input
                            type="text"
                            name="projectName"
                            value={form.projectName}
                            onChange={handleChange}
                            placeholder="My Awesome Project"
                            disabled={saving}
                            required
                            className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Summary</label>
                        <textarea
                            name="summary"
                            value={form.summary}
                            onChange={handleChange}
                            placeholder="Describe your project..."
                            disabled={saving}
                            rows="3"
                            className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all resize-none"
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                        <input
                            type="url"
                            name="gitHubUrl"
                            value={form.gitHubUrl}
                            onChange={handleChange}
                            placeholder="https://github.com/..."
                            disabled={saving}
                            className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Deployment Link</label>
                        <input
                            type="url"
                            name="deploymentLink"
                            value={form.deploymentLink}
                            onChange={handleChange}
                            placeholder="https://myproject.com"
                            disabled={saving}
                            className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
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
                                '💾 Update Project'
                            ) : (
                                '💾 Create Project'
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

            {projects.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-slate-400"
                >
                    <p className="text-lg">No projects yet. Create your first one!</p>
                </motion.div>
            ) : (
                <div className="grid gap-6">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">{project.projectName}</h3>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(project)}
                                        disabled={saving}
                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 transition-all text-sm font-medium"
                                    >
                                        ✏️ Edit
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(project.uuid)}
                                        disabled={saving}
                                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 transition-all text-sm font-medium"
                                    >
                                        🗑️ Delete
                                    </motion.button>
                                </div>
                            </div>
                            <p className="text-slate-300 mb-4">{project.summary}</p>
                            <div className="flex gap-3 flex-wrap">
                                {project.gitHubUrl && (
                                    <a
                                        href={project.gitHubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 text-sm font-medium"
                                    >
                                        🔗 GitHub
                                    </a>
                                )}
                                {project.deploymentLink && (
                                    <a
                                        href={project.deploymentLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 text-sm font-medium"
                                    >
                                        🌐 Live
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
