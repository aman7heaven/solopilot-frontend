// src/pages/Home.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroLanding from '../components/landing/HeroLanding';
import AboutSection from '../components/landing/AboutSection';
import Skills from '../components/landing/Skills';
import Projects from '../components/landing/Projects';
import Experience from '../components/landing/Experience';
import ContactForm from '../components/landing/ContactForm';
import usePortfolio from '../hooks/usePortfolio';
import Loader from '../components/common/Loader';

export default function Home() {
    const { data, loading, error, reload } = usePortfolio();

    if (loading) return <Loader fullScreen />;
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold mb-4 text-white">Unable to load portfolio</h2>
                    <p className="text-lg text-slate-300 mb-6">{error?.message ?? 'Something went wrong'}</p>
                    <motion.button
                        onClick={reload}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50"
                    >
                        Retry
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // defensively get sub-sections (use empty defaults where appropriate)
    const hero = data?.heroSection ?? {};
    const about = data?.aboutSection ?? {};
    const skills = Array.isArray(data?.skillsSectionList) ? data.skillsSectionList : [];
    const projects = Array.isArray(data?.projectResponseList) ? data.projectResponseList : [];
    const experience = Array.isArray(data?.experienceResponseList) ? data.experienceResponseList : [];

    return (
<main className="bg-gradient-to-b from-[#020617] via-[#020817] to-[#02010f] text-slate-100 min-h-screen">
  <HeroLanding hero={hero} />
  <AboutSection about={about} />
  <Skills skillsSections={skills} />
  <Experience experience={experience} />
  <Projects projects={projects} />
  <ContactForm />

  {/* Footer */}
  <footer className="mt-16 border-t border-white/10">
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
        © {new Date().getFullYear()} All rights reserved.
      </p>

      <motion.a
        href="/login"
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-xs sm:text-sm font-medium text-slate-100 hover:bg-white/[0.06] transition-all"
      >
        <span className="text-sm">🔐</span>
        <span>Admin</span>
      </motion.a>
    </div>
  </footer>
</main>

    );
}
