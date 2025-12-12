// src/components/landing/AboutSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
};

export default function AboutSection({ about = {} }) {
    const aboutMe =
        about?.aboutMe ??
        "I'm a passionate backend & full stack developer who loves transforming ideas into clean, scalable digital experiences.";
    const profileImageUrl = about?.profileImageUrl ?? null;
    const linkedInUrl = about?.linkedInUrl ?? null;
    const twitterUrl = about?.twitterUrl ?? null;
    const githubUrl = about?.githubUrl ?? null;

    return (
        <motion.section
            id="about"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
            className="relative overflow-hidden bg-[#050816] py-14 sm:py-18 px-4"
        >
            {/* subtle background accents */}
            <div className="pointer-events-none absolute -right-40 top-0 h-56 w-56 rounded-full bg-[#f97316]/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-32 bottom-0 h-56 w-56 rounded-full bg-[#22d3ee]/15 blur-3xl" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* heading – smaller bottom margin to reduce empty space */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-10"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        About{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7]">
                            Me
                        </span>
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                        A quick snapshot of who I am and how I like to build software.
                    </p>
                </motion.div>

                {/* content grid – reduced gap between image and text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
                    {/* left: image */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center md:justify-center"
                    >
                        <div className="relative w-56 h-56 sm:w-60 sm:h-60 lg:w-64 lg:h-64">
                            <div className="absolute inset-0 translate-y-3 rounded-[32px] bg-gradient-to-tr from-[#facc15] via-[#f97316] to-[#a855f7] blur-2xl opacity-50" />
                            <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-white/10 bg-slate-900/80 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                                {profileImageUrl ? (
                                    <img
                                        src={profileImageUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-100 bg-gradient-to-br from-slate-900 to-slate-800">
                                        AS
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* right: text + connect, tightly grouped */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-4 md:gap-5 items-center md:items-start"
                    >
                        {/* main about text */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 sm:px-7 sm:py-6 backdrop-blur-sm max-w-xl">
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                                {aboutMe}
                            </p>
                        </div>

                        {/* connect pill + buttons – pulled up closer to text */}
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-300 self-center md:self-start">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span>Let&apos;s connect</span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {linkedInUrl && (
                                    <motion.a
                                        href={linkedInUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-slate-100 hover:bg-white/[0.08] transition-all duration-300"
                                    >
                                        <span>LinkedIn</span>
                                        <span className="text-xs group-hover:translate-x-0.5 transition-transform">
                                            ↗
                                        </span>
                                    </motion.a>
                                )}
                                {githubUrl && (
                                    <motion.a
                                        href={githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-slate-100 hover:bg-white/[0.08] transition-all duration-300"
                                    >
                                        <span>GitHub</span>
                                        <span className="text-xs group-hover:translate-x-0.5 transition-transform">
                                            ↗
                                        </span>
                                    </motion.a>
                                )}
                                {twitterUrl && (
                                    <motion.a
                                        href={twitterUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-slate-100 hover:bg-white/[0.08] transition-all duration-300"
                                    >
                                        <span>Twitter</span>
                                        <span className="text-xs group-hover:translate-x-0.5 transition-transform">
                                            ↗
                                        </span>
                                    </motion.a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
