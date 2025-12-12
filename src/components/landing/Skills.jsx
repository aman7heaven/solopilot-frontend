// src/components/landing/Skills.jsx
import React from 'react';
import { motion } from 'framer-motion';

function ToolChip({ name, index }) {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -1 }}
            className="rounded-full px-3 py-1 text-xs sm:text-[13px] font-medium
                       border border-white/10 bg-white/5 text-slate-200
                       hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
            {name}
        </motion.span>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
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

export default function Skills({ skillsSections = [] }) {
    // ---- data logic (unchanged) ----
    const hasData = Array.isArray(skillsSections) && skillsSections.length > 0;

    const defaultCategories = [
        {
            categoryName: 'Technical',
            expertises: [
                {
                    expertiseName: 'Backend Development',
                    skills: [
                        {
                            skillName: 'Microservices',
                            skillTools: [
                                { name: 'Spring Boot' },
                                { name: 'Java' },
                                { name: 'REST APIs' },
                            ],
                        },
                        {
                            skillName: 'Databases',
                            skillTools: [
                                { name: 'MySQL' },
                                { name: 'PostgreSQL' },
                                { name: 'MongoDB' },
                            ],
                        },
                    ],
                },
                {
                    expertiseName: 'Frontend Development',
                    skills: [
                        {
                            skillName: 'UI Frameworks',
                            skillTools: [
                                { name: 'React' },
                                { name: 'Vue.js' },
                                { name: 'Next.js' },
                            ],
                        },
                        {
                            expertiseName: 'Styling',
                            skillName: 'Styling',
                            skillTools: [
                                { name: 'Tailwind CSS' },
                                { name: 'CSS3' },
                                { name: 'SCSS' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            categoryName: 'Soft Skills',
            expertises: [
                {
                    expertiseName: 'Communication',
                    skills: [
                        { skillName: 'Presenting', skillTools: [{ name: 'Storytelling' }] },
                        { skillName: 'Writing', skillTools: [{ name: 'Technical Writing' }] },
                    ],
                },
                {
                    expertiseName: 'Leadership',
                    skills: [
                        { skillName: 'Mentoring', skillTools: [{ name: '1:1 Coaching' }] },
                    ],
                },
            ],
        },
    ];

    let categories = defaultCategories;
    if (hasData) {
        if (skillsSections[0].categoryName) {
            categories = skillsSections.map((c) => ({
                categoryName: c.categoryName || 'Category',
                expertises: Array.isArray(c.expertises) ? c.expertises : [],
            }));
        } else {
            categories = [
                {
                    categoryName: 'Technical',
                    expertises: skillsSections,
                },
            ];
        }
    }
    // ---- end data logic ----

    return (
        <motion.section
            id="skills"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={containerVariants}
            className="relative overflow-hidden bg-[#050816] py-16 sm:py-20 px-4"
        >
            {/* background accents to match hero */}
            <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-[#22d3ee]/14 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#a855f7]/18 blur-3xl" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                        Skills&nbsp;&amp;&nbsp;
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7]">
                            Expertise
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                        An overview of the technologies and capabilities I use to design, build, and ship software.
                    </p>
                </motion.div>

                {/* categories grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
                >
                    {categories.map((category) => (
                        <motion.div
                            key={category.categoryName}
                            variants={itemVariants}
                            className="rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-sm p-4 sm:p-6 space-y-4"
                        >
                            {/* Category header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                <h4 className="text-base sm:text-lg text-slate-100 font-semibold">
                                    {category.categoryName}
                                </h4>
                                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                    Skills Overview
                                </span>
                            </div>

                            {/* Category body */}
                            {Array.isArray(category.expertises) &&
                            category.expertises.length > 0 ? (
                                <div className="space-y-4">
                                    {category.expertises.map((section) => (
                                        <motion.div
                                            key={section.uuid ?? section.expertiseName}
                                            variants={itemVariants}
                                            className="rounded-xl border border-white/6 bg-white/[0.015] px-3 py-3 sm:px-4 sm:py-4"
                                        >
                                            {/* Expertise row: name on left (md+), content on right */}
                                            <div className="md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.8fr)] md:gap-4">
                                                <div className="mb-2 md:mb-0">
                                                    <div className="inline-flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                                                        <h3 className="text-sm sm:text-base font-semibold text-slate-100">
                                                            {section.expertiseName ?? 'Expertise'}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 sm:space-y-3">
                                                    {Array.isArray(section.skills) &&
                                                    section.skills.length > 0 ? (
                                                        section.skills.map((skill) => (
                                                            <div
                                                                key={skill.uuid ?? skill.skillName}
                                                                className="border border-white/5 rounded-lg px-3 py-2.5 bg-white/[0.01]"
                                                            >
                                                                <div className="text-[12px] sm:text-sm font-medium text-slate-200 mb-1.5">
                                                                    {skill.skillName ?? 'Skill'}
                                                                </div>
                                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                                    {Array.isArray(skill.skillTools) &&
                                                                    skill.skillTools.length > 0 ? (
                                                                        skill.skillTools.map((t, idx) => (
                                                                            <ToolChip
                                                                                key={t.uuid ?? t.name}
                                                                                name={t.name ?? 'Tool'}
                                                                                index={idx}
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-[11px] text-slate-500 italic">
                                                                            No tools added yet.
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-[11px] text-slate-500 italic">
                                                            No skills listed for this area yet.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-slate-500 italic">
                                    No skills added in this category yet.
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
