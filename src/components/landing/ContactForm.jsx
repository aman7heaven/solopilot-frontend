// src/components/landing/ContactForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.contact.sendMessage(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err?.message || 'Unable to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={itemVariants}
      className="relative overflow-hidden bg-[#050816] py-16 sm:py-20 px-4"
    >
      {/* background accents to match theme */}
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#22d3ee]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#f97316]/18 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7]">
              Touch
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Let&apos;s collaborate on something meaningful.
          </p>
          <div className="mt-4 h-px w-24 mx-auto bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] rounded-full" />
        </motion.div>

        {/* success state */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="rounded-2xl border border-emerald-400/40 bg-emerald-400/5 px-6 py-6 sm:px-7 sm:py-7 text-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 border border-emerald-400/60"
            >
              <span className="text-emerald-300 text-xl">✓</span>
            </motion.div>
            <h3 className="text-xl font-semibold text-emerald-300 mb-1">
              Message sent successfully
            </h3>
            <p className="text-sm sm:text-base text-emerald-200/90">
              Thanks for reaching out — I&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={onSubmit}
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="group">
                <label className="block text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 mb-2">
                  Name
                </label>
                <div className="relative">
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="group">
                <label className="block text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="group">
              <label className="block text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 mb-2">
                Subject
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="Enter a subject..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <label className="block text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows="5"
                placeholder="Share a bit about what you have in mind..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40 resize-none"
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                <span>⚠️</span>
                <span>{error}</span>
              </motion.div>
            )

            }

            <motion.div variants={itemVariants}>
              <motion.button
                disabled={loading}
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#a855f7] px-8 sm:px-10 py-3.5 text-sm sm:text-base font-semibold text-slate-900 shadow-lg shadow-[#f97316]/40 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="text-slate-900/70 text-lg">→</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </div>
    </motion.section>
  );
}
