import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function SkillsManager() {
    const [expertises, setExpertises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [expandedExpertise, setExpandedExpertise] = useState(null);
    const [showNewExpertise, setShowNewExpertise] = useState(false);
    const [newExpertiseName, setNewExpertiseName] = useState('');
    const [editingExpertise, setEditingExpertise] = useState({});
    const [editingSkill, setEditingSkill] = useState({});

    useEffect(() => {
        fetchExpertises();
    }, []);

    const fetchExpertises = async () => {
        setLoading(true);
        try {
            const data = await api.skills.getAllExpertises();
            setExpertises(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err?.message || 'Failed to load skills');
            console.error('Skills fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExpertise = async () => {
        if (!newExpertiseName.trim()) {
            setError('Expertise name is required');
            return;
        }

        setSaving(true);
        try {
            await api.skills.createExpertise({ title: newExpertiseName });
            setSuccess(true);
            setNewExpertiseName('');
            setShowNewExpertise(false);
            setTimeout(() => setSuccess(false), 3000);
            await fetchExpertises();
        } catch (err) {
            setError(err?.message || 'Failed to create expertise');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExpertise = async (uuid) => {
        if (!window.confirm('This will delete the expertise and all related skills. Continue?')) return;

        setSaving(true);
        try {
            await api.skills.deleteExpertise(uuid);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            await fetchExpertises();
        } catch (err) {
            setError(err?.message || 'Failed to delete expertise');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateSkill = async (expertiseUuid, skillName) => {
        if (!skillName.trim()) {
            setError('Skill name is required');
            return;
        }

        setSaving(true);
        try {
            await api.skills.createSkill(expertiseUuid, { name: skillName });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setEditingSkill({ ...editingSkill, [expertiseUuid]: '' });
            await fetchExpertises();
        } catch (err) {
            setError(err?.message || 'Failed to create skill');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkill = async (skillUuid) => {
        if (!window.confirm('This will delete the skill and all related tools. Continue?')) return;

        setSaving(true);
        try {
            await api.skills.deleteSkill(skillUuid);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            await fetchExpertises();
        } catch (err) {
            setError(err?.message || 'Failed to delete skill');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTool = async (toolUuid) => {
        if (!window.confirm('Delete this tool?')) return;

        setSaving(true);
        try {
            await api.skills.deleteSkillTool(toolUuid);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            await fetchExpertises();
        } catch (err) {
            setError(err?.message || 'Failed to delete tool');
        } finally {
            setSaving(false);
        }
    };

    const handleAddTool = async (skillUuid, toolName) => {
        if (!toolName.trim()) {
            setError('Tool name is required');
            return;
        }

        setSaving(true);
        try {
            await api.skills.createSkillTools(skillUuid, { skillTools: [toolName] });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            await fetchExpertises();
        } catch (err) {
            setError(err?.message || 'Failed to add tool');
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
                <h2 className="text-3xl font-bold">Skills & Expertise</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewExpertise(!showNewExpertise)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                    {showNewExpertise ? '✕ Cancel' : '+ New Expertise'}
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
                    ✓ Changes saved successfully!
                </motion.div>
            )}

            {showNewExpertise && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl flex gap-3"
                >
                    <input
                        type="text"
                        value={newExpertiseName}
                        onChange={(e) => setNewExpertiseName(e.target.value)}
                        placeholder="e.g., Backend Development"
                        disabled={saving}
                        className="flex-1 px-4 py-3 bg-slate-900/50 border-2 border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                    />
                    <button
                        onClick={handleCreateExpertise}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all"
                    >
                        {saving ? 'Creating...' : 'Create'}
                    </button>
                </motion.div>
            )}

            {expertises.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-slate-400"
                >
                    <p className="text-lg">No expertise yet. Create your first one!</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {expertises.map((expertise, expIdx) => (
                        <motion.div
                            key={expertise.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: expIdx * 0.1 }}
                            className="bg-slate-800/50 border border-purple-500/30 rounded-xl overflow-hidden"
                        >
                            {/* Expertise Header */}
                            <motion.button
                                onClick={() => setExpandedExpertise(expandedExpertise === expertise.uuid ? null : expertise.uuid)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-all"
                            >
                                <h3 className="text-xl font-bold text-white text-left">{expertise.expertiseName}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-slate-400">{expertise.skills?.length || 0} skills</span>
                                    <motion.div
                                        animate={{ rotate: expandedExpertise === expertise.uuid ? 180 : 0 }}
                                        className="text-xl"
                                    >
                                        ▼
                                    </motion.div>
                                </div>
                            </motion.button>

                            {expandedExpertise === expertise.uuid && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="border-t border-purple-500/20 px-6 py-4 bg-slate-900/50 space-y-4"
                                >
                                    {/* Skills List */}
                                    {Array.isArray(expertise.skills) && expertise.skills.length > 0 && (
                                        <div className="space-y-3">
                                            {expertise.skills.map((skill, skillIdx) => (
                                                <motion.div
                                                    key={skill.uuid}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: skillIdx * 0.1 }}
                                                    className="p-4 bg-slate-800/50 border border-purple-500/20 rounded-lg"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-white">{skill.skillName}</h4>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDeleteSkill(skill.uuid)}
                                                            disabled={saving}
                                                            className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 disabled:opacity-50 transition-all"
                                                        >
                                                            🗑️ Delete
                                                        </motion.button>
                                                    </div>

                                                    {/* Tools */}
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {Array.isArray(skill.skillTools) && skill.skillTools.map((tool) => (
                                                            <motion.div
                                                                key={tool.uuid}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="group flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-full text-sm"
                                                            >
                                                                {tool.name}
                                                                <button
                                                                    onClick={() => handleDeleteTool(tool.uuid)}
                                                                    disabled={saving}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 cursor-pointer"
                                                                >
                                                                    ×
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    {/* Add Tool Input */}
                                                    <ToolInput
                                                        skillUuid={skill.uuid}
                                                        onAdd={(toolName) => handleAddTool(skill.uuid, toolName)}
                                                        disabled={saving}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Skill Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-2 p-4 bg-slate-800/30 border border-dashed border-purple-500/30 rounded-lg"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Add new skill..."
                                            value={editingSkill[expertise.uuid] || ''}
                                            onChange={(e) => setEditingSkill({ ...editingSkill, [expertise.uuid]: e.target.value })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleCreateSkill(expertise.uuid, editingSkill[expertise.uuid] || '');
                                                }
                                            }}
                                            disabled={saving}
                                            className="flex-1 px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 disabled:opacity-50 transition-all"
                                        />
                                        <button
                                            onClick={() => handleCreateSkill(expertise.uuid, editingSkill[expertise.uuid] || '')}
                                            disabled={saving}
                                            className="px-4 py-2 bg-purple-500/50 hover:bg-purple-500/70 text-purple-200 font-semibold rounded text-sm disabled:opacity-50 transition-all"
                                        >
                                            Add
                                        </button>
                                    </motion.div>

                                    {/* Delete Expertise */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDeleteExpertise(expertise.uuid)}
                                        disabled={saving}
                                        className="w-full mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 disabled:opacity-50 transition-all"
                                    >
                                        🗑️ Delete Expertise
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

function ToolInput({ skillUuid, onAdd, disabled }) {
    const [toolName, setToolName] = React.useState('');

    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Add tool (e.g., SpringBoot)"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && toolName.trim()) {
                        onAdd(toolName);
                        setToolName('');
                    }
                }}
                disabled={disabled}
                className="flex-1 px-3 py-2 bg-slate-700/30 border border-purple-500/20 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 disabled:opacity-50 transition-all"
            />
            <button
                onClick={() => {
                    if (toolName.trim()) {
                        onAdd(toolName);
                        setToolName('');
                    }
                }}
                disabled={disabled}
                className="px-3 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 font-semibold rounded text-sm disabled:opacity-50 transition-all"
            >
                +
            </button>
        </div>
    );
}
