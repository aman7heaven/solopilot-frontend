import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const DEFAULT_TIMEOUT = 20_000; // ms

// --- axios instance
const http = axios.create({
  baseURL: API_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: { Accept: 'application/json' },
});

// attach token only for protected /admin/ endpoints
http.interceptors.request.use((cfg) => {
  try {
    // Only attach token for admin endpoints (protected APIs)
    if (cfg.url?.includes('/admin/')) {
      const token = localStorage.getItem('sp_token');
      if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) { /* ignore */ }
  return cfg;
}, (err) => Promise.reject(err));

// normalize axios errors to a simple shape
function toError(err) {
  if (!err) return { message: 'Unknown error' };
  if (err.response) {
    const { status, data } = err.response;
    return {
      message: data?.message || data?.error || err.message || 'Request failed',
      status,
      details: data ?? null,
    };
  }
  if (err.request) return { message: 'No response from server', details: null };
  return { message: err.message || String(err) };
}

// --- helpers
export function createAbortSignal() {
  const controller = new AbortController();
  return { controller, signal: controller.signal };
}

export function buildFormData(obj = {}) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((item) => fd.append(k, item));
    else fd.append(k, v);
  });
  return fd;
}

export function clearAuthToken() {
  try { localStorage.removeItem('sp_token'); } catch (e) { /* ignore */ }
}

export function extractErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  return err.message || (err.details && err.details.message) || JSON.stringify(err);
}

// --- domain APIs (grouped) ---

// portfolio (public)
export const portfolio = {
  getUserPortfolio: async (opts = {}) => {
    try {
      const res = await http.get('/api/v1/user/portfolio/', { signal: opts.signal });
      return res.data;
    } catch (e) {
      throw toError(e);
    }
  },
};

// hero & about
export const hero = {
  getHeroSection: async (opts = {}) => {
    try {
      const res = await http.get('/api/v1/admin/portfolio/hero-section', { signal: opts.signal });
      return res.data;
    } catch (e) { throw toError(e); }
  },
  updateHeroSection: async (payload) => {
    try {
      const res = await http.post('/api/v1/admin/portfolio/hero-section', payload);
      return res.data;
    } catch (e) { throw toError(e); }
  },
};

export const about = {
  getAboutSection: async () => {
    try {
      const res = await http.get('/api/v1/admin/portfolio/about-section');
      return res.data;
    } catch (e) { throw toError(e); }
  },
  updateAboutSection: async (payload = {}) => {
    try {
      // If caller already provided a FormData (we want to send exactly as multipart with
      // a 'payload' JSON field and 'image' file), use it directly. Otherwise build
      // a FormData from the plain object.
      const form = payload instanceof FormData ? payload : buildFormData(payload);
      const res = await http.post('/api/v1/admin/portfolio/about-section', form);
      return res.data;
    } catch (e) { throw toError(e); }
  },
};

// projects
export const projects = {
  getAll: async () => {
    try {
      const res = await http.get('/api/v1/admin/portfolio/project-section');
      return res.data;
    } catch (e) { throw toError(e); }
  },
  create: async (payload) => {
    try { const res = await http.post('/api/v1/admin/portfolio/project', payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  update: async (projectId, payload) => {
    try {
      const res = await http.put(`/api/v1/admin/portfolio/project/${encodeURIComponent(projectId)}`, payload);
      return res.data;
    } catch (e) { throw toError(e); }
  },
  remove: async (projectId) => {
    try { const res = await http.delete(`/api/v1/admin/portfolio/project/${encodeURIComponent(projectId)}`); return res.data; }
    catch (e) { throw toError(e); }
  },
};

// experience
export const experience = {
  getAll: async () => {
    try { const res = await http.get('/api/v1/admin/portfolio/experience-section'); return res.data; }
    catch (e) { throw toError(e); }
  },
  create: async (payload) => {
    try { const res = await http.post('/api/v1/admin/portfolio/experience', payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  update: async (id, payload) => {
    try { const res = await http.put(`/api/v1/admin/portfolio/experience/${encodeURIComponent(id)}`, payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  remove: async (id) => {
    try { const res = await http.delete(`/api/v1/admin/portfolio/experience/${encodeURIComponent(id)}`); return res.data; }
    catch (e) { throw toError(e); }
  },
};

// contact
export const contact = {
  sendMessage: async (payload) => {
    try { const res = await http.post('/api/v1/admin/portfolio/send-message', payload); return res.data; }
    catch (e) { throw toError(e); }
  },
};

// skills & expertise
export const skills = {
  getAllExpertises: async () => {
    try { const res = await http.get('/api/v1/admin/skills/expertise/all'); return res.data; }
    catch (e) { throw toError(e); }
  },
  createExpertise: async (payload) => {
    try { const res = await http.post('/api/v1/admin/skills/expertise', payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  updateExpertise: async (uuid, payload) => {
    try { const res = await http.put(`/api/v1/admin/skills/expertise/${encodeURIComponent(uuid)}`, payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  deleteExpertise: async (uuid) => {
    try { const res = await http.delete(`/api/v1/admin/skills/expertise/${encodeURIComponent(uuid)}`); return res.data; }
    catch (e) { throw toError(e); }
  },

  createSkill: async (expertiseUuid, payload) => {
    try { const res = await http.post(`/api/v1/admin/skills/expertise/${encodeURIComponent(expertiseUuid)}/skills`, payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  updateSkill: async (skillUuid, payload) => {
    try { const res = await http.put(`/api/v1/admin/skills/${encodeURIComponent(skillUuid)}`, payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  deleteSkill: async (skillUuid) => {
    try { const res = await http.delete(`/api/v1/admin/skills/${encodeURIComponent(skillUuid)}`); return res.data; }
    catch (e) { throw toError(e); }
  },

  createSkillTools: async (skillUuid, payload) => {
    try { const res = await http.post(`/api/v1/admin/skills/skills/${encodeURIComponent(skillUuid)}/tools`, payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  updateSkillTool: async (toolUuid, payload) => {
    try { const res = await http.put(`/api/v1/admin/skills/SkillTool/${encodeURIComponent(toolUuid)}`, payload); return res.data; }
    catch (e) { throw toError(e); }
  },
  deleteSkillTool: async (toolUuid) => {
    try { const res = await http.delete(`/api/v1/admin/skills/SkillTool/${encodeURIComponent(toolUuid)}`); return res.data; }
    catch (e) { throw toError(e); }
  },
};

// auth
export const auth = {
  login: async (payload) => {
    try {
      const res = await http.post('/api/v1/admin/auth/login', payload);
      if (res?.data?.token) localStorage.setItem('sp_token', res.data.token);
      return res.data;
    } catch (e) { throw toError(e); }
  },
  logout: async () => {
    try {
      const res = await http.post('/api/v1/admin/auth/logout');
      clearAuthToken();
      return res.data;
    } catch (e) { throw toError(e); }
  },
  register: async (payload) => {
    try {
      const res = await http.post('/api/v1/admin/auth/register', payload);
      if (res?.data?.token) localStorage.setItem('sp_token', res.data.token);
      return res.data;
    } catch (e) { throw toError(e); }
  },
  resetPassword: async (payload) => {
    try { const res = await http.post('/api/v1/admin/auth/reset-password', payload); return res.data; }
    catch (e) { throw toError(e); }
  },
};

// analytics
export const analytics = {
  getSummary: async () => {
    try { const res = await http.get('/api/v1/admin/analytics/summary'); return res.data; }
    catch (e) { throw toError(e); }
  },
};

// --- default export (http + utilities + groups)
const api = {
  http,
  createAbortSignal,
  buildFormData,
  clearAuthToken,
  extractErrorMessage,
  portfolio,
  hero,
  about,
  projects,
  experience,
  contact,
  skills,
  auth,
  analytics,
};

export default api;
