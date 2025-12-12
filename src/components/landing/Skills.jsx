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
    const hasData = Array.isArray(skillsSections) && skillsSections.length > 0;

    // fallback defaults (unchanged)
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
        } else if (skillsSections[0].expertiseName && Array.isArray(skillsSections[0].skills)) {
            // transform incoming shape where expertiseName is top-level (your payload)
            categories = skillsSections.map((c) => {
                const expertises = Array.isArray(c.skills)
                    ? c.skills.map((s) => ({
                          expertiseName: s.skillName ?? s.expertiseName ?? 'Expertise',
                          skills: Array.isArray(s.skillTools)
                              ? [
                                    {
                                        skillName: s.skillName ?? 'Skill',
                                        skillTools: s.skillTools.map((t) =>
                                            typeof t === 'string' ? { name: t } : { name: t.name ?? 'Tool', uuid: t.uuid }
                                        ),
                                        uuid: s.uuid,
                                    },
                                ]
                              : [],
                          uuid: s.uuid,
                      }))
                    : [];

                return {
                    categoryName: c.expertiseName || 'Category',
                    expertises,
                    uuid: c.uuid,
                };
            });
        } else {
            categories = [
                {
                    categoryName: 'Skills',
                    expertises: skillsSections,
                },
            ];
        }
    }

    return (
        <motion.section
            id="skills"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={containerVariants}
            className="relative overflow-hidden bg-[#050816] py-16 sm:py-20 px-4"
        >
            <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-[#22d3ee]/14 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#a855f7]/18 blur-3xl" />

            <div className="relative z-10 max-w-6xl mx-auto">
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

                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
                >
                    {categories.map((category) => (
                        <motion.div
                            key={category.categoryName + (category.uuid ? `-${category.uuid}` : '')}
                            variants={itemVariants}
                            className="rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-sm p-4 sm:p-6 space-y-4"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                <h4 className="text-base sm:text-lg text-slate-100 font-semibold">
                                    {category.categoryName}
                                </h4>
                                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                    Skills Overview
                                </span>
                            </div>

                            {Array.isArray(category.expertises) && category.expertises.length > 0 ? (
                                <div className="space-y-4">
                                    {category.expertises.map((section) => (
                                        <motion.div
                                            key={(section.uuid ?? section.expertiseName) + Math.random()}
                                            variants={itemVariants}
                                            className="rounded-xl border border-white/6 bg-white/[0.015] px-3 py-3 sm:px-4 sm:py-4"
                                        >
                                            {/* Use a two-column layout on md+ where left is a narrow vertical label and right contains skill cards */}
                                            <div className="md:grid md:grid-cols-[minmax(0,0.28fr)_minmax(0,1fr)] md:gap-6">
                                                {/* LEFT: label vertically centered */}
                                                <div className="mb-2 md:mb-0 flex items-center">
                                                    <div className="inline-flex items-center gap-3">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                                                        <h3 className="text-sm sm:text-base font-semibold text-slate-100">
                                                            {section.expertiseName ?? 'Expertise'}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* RIGHT: skill boxes */}
                                                <div className="space-y-3">
                                                    {Array.isArray(section.skills) && section.skills.length > 0 ? (
                                                        section.skills.map((skill) => {
                                                            const tools = Array.isArray(skill.skillTools) ? skill.skillTools : [];
                                                            const showSkillTitle =
                                                                skill.skillName &&
                                                                skill.skillName.trim() !== '' &&
                                                                (skill.skillName !== section.expertiseName);

                                                            // if there are no tools and the skill name duplicates expertise, optionally hide the whole box:
                                                            // (user wanted no duplication and less noise)
                                                            const shouldHideEmptyDuplicate =
                                                                !showSkillTitle && tools.length === 0;

                                                            if (shouldHideEmptyDuplicate) return null;

                                                            return (
                                                                <div
                                                                    key={skill.uuid ?? skill.skillName ?? Math.random()}
                                                                    className="border border-white/5 rounded-lg px-3 py-3 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                                                                >
                                                                    {/* skill title (only when different from expertise) */}
                                                                    {showSkillTitle ? (
                                                                        <div className="text-[12px] sm:text-sm font-medium text-slate-200">
                                                                            {skill.skillName}
                                                                        </div>
                                                                    ) : (
                                                                        // keep spacing consistent when title is hidden
                                                                        <div className="hidden sm:block w-0" />
                                                                    )}

                                                                    {/* tools area: center vertically, keep chips left-to-right */}
                                                                    <div className="flex-1 flex items-center">
                                                                        {tools.length > 0 ? (
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {tools.map((t, idx) => (
                                                                                    <ToolChip
                                                                                        key={t.uuid ?? t.name ?? idx}
                                                                                        name={t.name ?? 'Tool'}
                                                                                        index={idx}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-[11px] text-slate-500 italic">
                                                                                No tools added yet.
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
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
