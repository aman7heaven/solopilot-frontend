// src/components/landing/Projects.jsx
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export default function Projects({ projects = [] }) {
    // EMPTY STATE (logic unchanged)
    if (!Array.isArray(projects) || projects.length === 0) {
        return (
            <motion.section
                id="projects"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="relative overflow-hidden bg-[#050816] py-16 sm:py-20 px-4"
            >
                <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#f97316]/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#22d3ee]/15 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-6xl text-center">
                    <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Featured{' '}
                        <span className="bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] bg-clip-text text-transparent">
                            Projects
                        </span>
                    </h2>
                    <motion.div variants={itemVariants} className="py-10">
                        <p className="text-sm sm:text-base text-slate-400">
                            Projects coming soon...
                        </p>
                    </motion.div>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.section
            id="projects"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="relative overflow-hidden bg-[#050816] py-16 sm:py-20 px-4"
        >
            {/* background accents */}
            <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#f97316]/18 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#22d3ee]/18 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-6xl">
                {/* heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 sm:mb-12 text-center"
                >
                    <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Featured{' '}
                        <span className="bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] bg-clip-text text-transparent">
                            Projects
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
                        A selection of work that reflects how I approach problem-solving and execution.
                    </p>
                </motion.div>

                {/* projects grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:gap-8"
                >
                    {projects.map((p, idx) => (
                        <motion.article
                            key={p.uuid ?? p.projectName ?? idx}
                            variants={itemVariants}
                            whileHover={{ y: -3 }}
                            className="relative group h-full"
                        >
                            {/* subtle border glow on hover */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#facc15]/0 via-[#f97316]/20 to-[#a855f7]/25 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                            {/* inner panel */}
                            <div className="relative flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6 sm:py-6 backdrop-blur-sm shadow-[0_18px_40px_rgba(15,23,42,0.7)]">
                                {/* top row: index + title */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                                            {p.projectName ?? 'Untitled Project'}
                                        </h3>
                                    </div>

                                    {/* small status pill */}
                                    <div className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200">
                                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <span>Active</span>
                                    </div>
                                </div>

                                {/* summary */}
                                {p.summary && (
                                    <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                                        {p.summary}
                                    </p>
                                )}

                                {/* tech stack */}
                                {p.technologies && (
                                    <div className="space-y-1">
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                            Tech stack
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.technologies.split(',').map((tech, tIdx) => (
                                                <motion.span
                                                    key={`${p.uuid ?? p.projectName}-${tIdx}`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: tIdx * 0.04 }}
                                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs sm:text-sm text-slate-200 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                                                >
                                                    {tech.trim()}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* links */}
                                {(p.gitHubUrl || p.deploymentLink) && (
                                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                            Links
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {p.gitHubUrl && (
                                                <motion.a
                                                    href={p.gitHubUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    whileHover={{ x: 2 }}
                                                    className="group/link inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-300 transition-colors hover:text-white"
                                                >
                                                    <span>Code</span>
                                                    <span className="text-white/40 transition-colors group-hover/link:text-white/70">
                                                        ↗
                                                    </span>
                                                </motion.a>
                                            )}
                                            {p.deploymentLink && (
                                                <motion.a
                                                    href={p.deploymentLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    whileHover={{ x: 2 }}
                                                    className="group/link inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-300 transition-colors hover:text-white"
                                                >
                                                    <span>Live Demo</span>
                                                    <span className="text-white/40 transition-colors group-hover/link:text-white/70">
                                                        ↗
                                                    </span>
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
