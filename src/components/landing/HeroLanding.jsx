import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export default function HeroLanding({ hero = {} }) {
    const firstName = hero?.firstName ?? 'Aman';
    const lastName = hero?.lastName ?? 'Saxena';
    const title = hero?.professionalTitle ?? 'Backend / Full-Stack Developer';
    const tagline =
        hero?.tagline ??
        'I build reliable, scalable backend systems and clean developer experiences.';

    const handleCollaborate = () => {
        const contactElement = document.getElementById('contact');
        contactElement?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            id="hero"
            className="min-h-screen bg-[#050816] text-white relative overflow-hidden"
        >
            {/* split background accent – dark left, subtle accent right */}
            <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-gradient-to-br from-[#facc15] via-[#f97316] to-[#a855f7] opacity-[0.07] md:opacity-100 mix-blend-normal pointer-events-none" />

            {/* faint orbs for depth */}
            <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#22d3ee]/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#4f46e5]/30 blur-3xl" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="min-h-screen flex items-center"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                        {/* LEFT: text block */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-8 md:space-y-10 max-w-xl"
                        >
                            {/* status pill */}
                            <div className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5/80 px-5 py-1.5 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm">
                                <span className="whitespace-nowrap">
                                    Backend Engineer
                                </span>
                                <span className="flex items-center gap-2 normal-case tracking-normal text-[11px]">
                                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 animate-ping" />
                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.35)]" />
                                    </span>
                                    <span className="text-slate-100">
                                        Available for collaboration
                                    </span>
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
                                    <span className="block text-slate-300 text-lg sm:text-xl mb-1">
                                        Hi, I&apos;m
                                    </span>
                                    <span className="block">
                                        <span className="text-slate-100">
                                            {firstName}
                                        </span>{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7]">
                                            {lastName}
                                        </span>
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg text-slate-300">
                                    {title}
                                </p>

                                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                                    {tagline}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.a
                                    href="#projects"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    See My Work
                                </motion.a>

                                <motion.button
                                    type="button"
                                    onClick={handleCollaborate}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm sm:text-base font-semibold border border-slate-500/60 bg-white/5 text-slate-100 hover:bg-white/10 transition-all duration-300"
                                >
                                    Let&apos;s Collaborate
                                </motion.button>
                            </div>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-wrap gap-2 pt-2"
                            >
                                {[
                                    'Java',
                                    'Spring Boot',
                                    'Microservices',
                                    'React',
                                    'Node.js',
                                    'Cloud',
                                ].map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs sm:text-sm text-slate-200"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* RIGHT: Developer card panel */}
                        <motion.div
                            variants={itemVariants}
                            className="relative flex justify-center items-center lg:justify-end lg:items-center h-full"
                        >
                            <div className="relative w-full max-w-md lg:max-w-lg">
                                {/* Vertical label */}
                                <div className="hidden lg:block absolute -left-12 top-24 -rotate-90 origin-left text-[10px] tracking-[0.3em] uppercase text-slate-700/80">
                                    Developer • Systems • APIs
                                </div>

                                {/* Soft halo behind card */}
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 translate-y-6 rounded-[36px] bg-gradient-to-tr from-[#facc15] via-[#f97316] to-[#a855f7] opacity-50 blur-3xl"
                                />

                                {/* Floating card */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    whileHover={{ rotateX: 4, rotateY: -4 }}
                                    className="relative rounded-[32px] bg-[#111827]/95 border border-black/40 shadow-[0_30px_80px_rgba(15,23,42,0.9)] overflow-hidden"
                                >
                                    {/* Thin gradient top bar */}
                                    <div className="h-1 w-full bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7]" />

                                    {/* Header row */}
                                    <div className="flex items-start justify-between px-6 pt-5 pb-3">
                                        <div>
                                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                                                Currently building
                                            </p>
                                            <p className="mt-1 text-sm text-slate-100">
                                                High-performance backend systems &amp; modern web
                                                apps
                                            </p>
                                        </div>

                                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] text-emerald-100 border border-emerald-400/40 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="uppercase tracking-wide">Live</span>
                                        </div>
                                    </div>

                                    {/* Illustration */}
                                    <div className="px-5 pb-5">
                                        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900/80 border border-white/5">
                                            <img
                                                src="/images/dev-macbook.png"
                                                alt="Developer working on a laptop"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* Small stats row */}
                                        <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-slate-300">
                                            <div className="rounded-2xl bg-white/5 border border-white/5 px-3 py-2">
                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                    Latency
                                                </p>
                                                <p className="mt-1 font-semibold text-slate-100">
                                                    &lt; 100ms
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2">
                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                    Uptime
                                                </p>
                                                <p className="mt-1 font-semibold text-slate-100">
                                                    99.9%
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-white/5 border border-white/5 px-3 py-2">
                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                    Stack
                                                </p>
                                                <p className="mt-1 font-semibold text-slate-100">
                                                    Java • Spring
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
