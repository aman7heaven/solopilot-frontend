// src/components/landing/Experience.jsx
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
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

export default function Experience({ experience = [] }) {
    // Empty state – logic unchanged
    if (!Array.isArray(experience) || experience.length === 0) {
        return (
            <motion.section
                id="experience"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="relative overflow-hidden bg-[#050816] py-16 sm:py-20 px-4"
            >
                <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#22d3ee]/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#f97316]/15 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-6xl text-center">
                    <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-white">
                        <span className="bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] bg-clip-text text-transparent">
                            Experience
                        </span>
                    </h2>
                    <motion.div variants={itemVariants} className="py-10">
                        <p className="text-sm sm:text-base text-slate-400">
                            Experience coming soon...
                        </p>
                    </motion.div>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.section
            id="experience"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="relative overflow-hidden bg-[#050816] py-16 sm:py-20 px-4"
        >
            {/* subtle background accents */}
            <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#22d3ee]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#f97316]/15 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-4xl">
                {/* heading */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-10 sm:mb-14 text-center"
                >
                    <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Experience &{' '}
                        <span className="bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] bg-clip-text text-transparent">
                            Journey
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-400">
                        A timeline of my professional journey and growth.
                    </p>
                </motion.div>

                {/* timeline */}
                <div className="relative pt-4 sm:pt-6">
                    {/* center vertical line */}
                    <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="space-y-10 sm:space-y-12"
                    >
                        {experience.map((exp, idx) => {
                            const isLeft = idx % 2 === 0;

                            return (
                                <motion.div
                                    key={exp.uuid ?? idx}
                                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="relative flex flex-col md:block"
                                >
                                    {/* dot – always on center line */}
                                    <div className="absolute left-1/2 top-4 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-10">
                                        <div className="relative h-5 w-5 rounded-full border-2 border-transparent bg-gradient-to-tr from-[#facc15] via-[#f97316] to-[#a855f7] p-[2px] shadow-[0_0_25px_rgba(249,115,22,0.6)]">
                                            <div className="h-full w-full rounded-full bg-[#050816]" />
                                        </div>
                                    </div>

                                    {/* card wrapper */}
                                    <div
                                        className={`w-full md:w-1/2 ${
                                            isLeft
                                                ? 'md:mr-auto md:pr-8'
                                                : 'md:ml-auto md:pl-8'
                                        }`}
                                    >
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="group cursor-default rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 sm:px-6 sm:py-5 backdrop-blur-sm shadow-[0_18px_40px_rgba(15,23,42,0.7)]"
                                        >
                                            {/* date range (dtStartedOn/dtEndedOn/isCurrentlyWorking) */}
                                            <div className="mb-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] bg-clip-text text-transparent">
                                                {exp.dtStartedOn
                                                    ? `${new Date(
                                                          exp.dtStartedOn,
                                                      ).toLocaleDateString('en-US', {
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })} - ${
                                                          exp.isCurrentlyWorking || !exp.dtEndedOn
                                                              ? 'Present'
                                                              : new Date(
                                                                    exp.dtEndedOn,
                                                                ).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })
                                                      }`
                                                    : 'Timeframe not specified'}
                                            </div>

                                            <h3 className="mb-1 text-lg sm:text-xl font-bold text-white">
                                                {exp.role ?? exp.designation ?? 'Role'}
                                            </h3>

                                            <p className="mb-2 text-sm sm:text-base text-slate-300">
                                                {exp.companyName ?? 'Company'}
                                            </p>

                                            {exp.location && (
                                                <p className="mb-3 text-xs sm:text-sm text-slate-500">
                                                    📍 {exp.location}
                                                </p>
                                            )}

                                            {exp.description && (
                                                <p className="mb-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                                                    {exp.description}
                                                </p>
                                            )}
                                            {exp.summary && (
                                                <p className="mb-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                                                    {exp.summary}
                                                </p>
                                            )}

                                            {exp.highlights &&
                                                Array.isArray(exp.highlights) &&
                                                exp.highlights.length > 0 && (
                                                    <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-400">
                                                        {exp.highlights
                                                            .slice(0, 2)
                                                            .map((highlight, hidx) => (
                                                                <li
                                                                    key={hidx}
                                                                    className="flex items-start gap-2"
                                                                >
                                                                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#facc15]" />
                                                                    <span>{highlight}</span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}

                                            <div className="mt-3 h-px w-0 bg-gradient-to-r from-[#facc15] via-[#f97316] to-transparent transition-all duration-300 group-hover:w-16" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
