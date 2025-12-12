import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import HeroEditor from '../components/admin/HeroEditor';
import AboutEditor from '../components/admin/AboutEditor';
import SkillsManager from '../components/admin/SkillsManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import ProjectsManager from '../components/admin/ProjectsManager';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await api.analytics.getSummary();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/');
    }
  };

  if (!user?.token) {
    return null;
  }

  const handleBackToLanding = () => {
    navigate('/');
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
  ];

  const visitorData = analytics
    ? [
        { name: 'Today', value: analytics.visitors?.today || 0 },
        { name: 'Week', value: analytics.visitors?.thisWeek || 0 },
        { name: 'Month', value: analytics.visitors?.thisMonth || 0 },
        { name: 'Year', value: analytics.visitors?.thisYear || 0 },
      ]
    : [];

  const deviceData = analytics
    ? [
        { name: 'Desktop', value: analytics.devices?.desktop || 0 },
        { name: 'Mobile', value: analytics.devices?.mobile || 0 },
        { name: 'Tablet', value: analytics.devices?.tablet || 0 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-x-hidden">
      {/* HEADER (sticky only md-up) */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sm:sticky sm:top-0 sm:z-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.button
              onClick={handleBackToLanding}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800 transition-all"
            >
              ← Back to portfolio
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-[11px] font-semibold text-slate-100">
                AD
              </div>
              <div className="leading-tight">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-slate-50">
                  Admin Dashboard
                </h1>
                <p className="text-[11px] text-slate-400">SoloPilot portfolio control panel</p>
              </div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-500/50 bg-rose-500/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-200 hover:bg-rose-500/20 transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            {loggingOut ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-rose-300 border-t-transparent" />
                Logging out…
              </>
            ) : (
              <>
                <span>🚪</span>
                Logout
              </>
            )}
          </motion.button>
        </div>
      </header>

      {/* TABS NAV (sticky only md-up) */}
      <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sm:sticky sm:top-[56px] sm:z-40">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((tab, idx) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-700/40'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <header className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-50">
                Dashboard <span className="text-sky-400">Analytics</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-400">
                Track visitor engagement and performance metrics at a glance.
              </p>
            </header>

            {loadingAnalytics ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 sm:h-28 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-rose-500/60 bg-rose-500/10 p-4 sm:p-6 text-sm text-rose-100"
              >
                {error}
              </motion.div>
            ) : analytics ? (
              <>
                {/* KPI CARDS */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Today', value: analytics.visitors?.today || 0, icon: '📅' },
                    { label: 'This Week', value: analytics.visitors?.thisWeek || 0, icon: '📊' },
                    { label: 'This Month', value: analytics.visitors?.thisMonth || 0, icon: '📈' },
                    { label: 'This Year', value: analytics.visitors?.thisYear || 0, icon: '🎯' },
                  ].map((stat, idx) => (
                    <motion.article
                      key={stat.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -3 }}
                      className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:border-sky-500/60 hover:bg-slate-900 transition-all"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                        <span className="text-lg sm:text-xl">{stat.icon}</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-semibold text-slate-50">
                        {stat.value.toLocaleString()}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">Unique visitors</p>
                    </motion.article>
                  ))}
                </section>

                {/* CHARTS */}
                <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Visitors bar chart */}
                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 shadow-sm"
                  >
                    <h3 className="mb-4 text-sm sm:text-lg font-semibold text-slate-50">
                      Visitor Trends
                    </h3>
                    <div className="h-60 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visitorData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#020617',
                              border: '1px solid #4b5563',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#e5e7eb' }}
                          />
                          <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.article>

                  {/* Devices pie chart */}
                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 shadow-sm"
                  >
                    <h3 className="mb-4 text-sm sm:text-lg font-semibold text-slate-50">
                      Device Distribution
                    </h3>
                    <div className="h-60 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="44%"
                            innerRadius={45}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="#020617"
                            strokeWidth={2}
                            labelLine={false}
                          >
                            {deviceData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>

                          <Tooltip
                            formatter={(value, name) => [`${value}`, name]}
                            contentStyle={{
                              backgroundColor: '#020617',
                              border: '1px solid #4b5563',
                              borderRadius: 8,
                              color: '#e5e7eb',
                              fontSize: 12,
                            }}
                            labelStyle={{ color: '#9ca3af' }}
                            itemStyle={{ color: '#e5e7eb' }}
                          />

                          <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            iconSize={10}
                            wrapperStyle={{
                              color: '#e5e7eb',
                              fontSize: 12,
                              marginTop: 10,
                              paddingTop: 6,
                            }}
                            formatter={(value) => {
                              const item = deviceData.find((d) => d.name === value);
                              return `${value}: ${item?.value ?? 0}`;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.article>
                </section>

                {/* Messages + Summary */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="mb-1 text-xs font-medium text-slate-400">
                          Total Messages
                        </p>
                        <p className="text-4xl sm:text-5xl font-semibold text-slate-50">
                          {analytics.totalMessages || 0}
                        </p>
                        <p className="mt-2 text-xs sm:text-sm text-slate-500">
                          Inquiries received via contact form
                        </p>
                      </div>
                      <div className="text-5xl sm:text-6xl opacity-20">💬</div>
                    </div>
                  </motion.article>

                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm"
                  >
                    <h3 className="mb-4 text-sm sm:text-lg font-semibold text-slate-50">
                      Summary
                    </h3>
                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Avg. daily visitors</span>
                        <span className="font-semibold text-slate-50">
                          {analytics.visitors?.thisYear &&
                          analytics.visitors?.thisYear > 0
                            ? Math.round(
                                analytics.visitors.thisYear / 365
                              ).toLocaleString()
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Most popular device</span>
                        <span className="font-semibold text-slate-50">
                          {analytics.devices &&
                            (Math.max(
                              analytics.devices.desktop || 0,
                              analytics.devices.mobile || 0,
                              analytics.devices.tablet || 0
                            ) === (analytics.devices.desktop || 0)
                              ? '💻 Desktop'
                              : Math.max(
                                  analytics.devices.desktop || 0,
                                  analytics.devices.mobile || 0,
                                  analytics.devices.tablet || 0
                                ) === (analytics.devices.mobile || 0)
                              ? '📱 Mobile'
                              : '⌨️ Tablet')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Total device hits</span>
                        <span className="font-semibold text-slate-50">
                          {(
                            (analytics.devices?.desktop || 0) +
                            (analytics.devices?.mobile || 0) +
                            (analytics.devices?.tablet || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </section>
              </>
            ) : null}
          </motion.div>
        )}

        {/* OTHER TABS: unchanged API logic */}
        {activeTab === 'hero' && <HeroEditor />}
        {activeTab === 'about' && <AboutEditor />}
        {activeTab === 'skills' && <SkillsManager />}
        {activeTab === 'experience' && <ExperienceManager />}
        {activeTab === 'projects' && <ProjectsManager />}
      </main>
    </div>
  );
}

