// src/api/index.js
import axios from 'axios';

// tiny event emitter for health status (put near top of src/api/index.js)
// We record the last event payload per event name so late subscribers
// (components that mount slightly after an API call starts) can be
// informed immediately and avoid missing a brief 'health:start' event.
const __events = new Map();
// store { payload, ts }
const __lastEventPayload = new Map();
// TTL for replayed events (ms) - avoids replaying very old events
const LAST_EVENT_TTL_MS = 60 * 1000; // 1 minute
export function onApiEvent(name, fn) {
  const list = __events.get(name) ?? [];
  list.push(fn);
  __events.set(name, list);

  // If we've previously emitted this event, replay the last payload (only if fresh)
  if (__lastEventPayload.has(name)) {
    try {
      const entry = __lastEventPayload.get(name);
      if (entry && Date.now() - (entry.ts || 0) <= LAST_EVENT_TTL_MS) {
        const payload = entry.payload;
        // call async to avoid surprising sync behavior during mount
        Promise.resolve().then(() => fn(payload));
      }
    } catch (e) { /* ignore listener errors */ }
  }

  return () => {
    const newList = (__events.get(name) || []).filter(x => x !== fn);
    __events.set(name, newList);
  };
}
function emitApiEvent(name, payload) {
  // store last payload for this event name
  try { __lastEventPayload.set(name, { payload, ts: Date.now() }); } catch (e) { /* ignore */ }
  // If health is ready/failed, clear previous 'start' and 'waiting' events to avoid stale replays
  try {
    if (name === 'health:ready' || name === 'health:failed') {
      [ 'health:start', 'health:waiting' ].forEach((n) => __lastEventPayload.delete(n));
    }
  } catch (e) { /* ignore */ }

  const list = __events.get(name) ?? [];
  list.forEach((fn) => {
    try { fn(payload); } catch (e) { /* ignore errors from listeners */ }
  });
}


const API_BASE = import.meta.env.VITE_API_BASE ?? ''; // allow relative if not set
const DEFAULT_TIMEOUT = 20_000; // ms

// --- axios instance
const http = axios.create({
  baseURL: API_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: { Accept: 'application/json' },
  withCredentials: true, // enable cookies if backend uses them
});

// attach token only for protected /admin/ endpoints
http.interceptors.request.use(
  (cfg) => {
    try {
      if (typeof cfg.url === 'string' && cfg.url.includes('/admin/')) {
        const token = localStorage.getItem('sp_token');
        if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);

// normalize axios errors to a simple shape
function toError(err) {
  if (!err) return { message: 'Unknown error' };
  if (err.response) {
    const { status, data } = err.response;
    return {
      message: data?.message || data?.error || err.message || 'Request failed',
      status,
      details: data ?? null,
      code: data?.code ?? data?.errorCode ?? err.code ?? null,
      name: err.name ?? null,
    };
  }
  if (err.request) {
    const isAbort = err.name === 'CanceledError' || err.name === 'AbortError' || String(err?.message || '').toLowerCase().includes('cancel');
    return {
      message: isAbort ? 'Request canceled' : 'No response from server',
      details: null,
      name: err.name ?? null,
      code: err.code ?? null,
    };
  }
  return { message: err.message || String(err), name: err.name ?? null, code: err.code ?? null };
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
  try {
    localStorage.removeItem('sp_token');
  } catch (e) {
    // ignore
  }
}

export function extractErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  return err.message || (err.details && err.details.message) || JSON.stringify(err);
}

/* ===========================
   Health-first utilities
   =========================== */

// read timeout from environment (support both VITE_HEALTHCHECK_TIMEOUT_MS and HEALTHCHECK_TIMEOUT_MS for compatibility)
const HEALTHCHECK_TIMEOUT_MS = Number.parseInt(import.meta.env.VITE_HEALTHCHECK_TIMEOUT_MS ?? import.meta.env.HEALTHCHECK_TIMEOUT_MS ?? '', 10) || (4 * 60 * 1000);

const HEALTH_DEFAULTS = {
  healthPath: '/actuator/health',
  pollIntervalMs: 3000,
  overallTimeoutMs: HEALTHCHECK_TIMEOUT_MS, // default 4 minutes
  perRequestTimeoutMs: 8000, // abort single health request if >8s
  base: API_BASE,
};

// Map to dedupe concurrent waitForHealth calls by key (base + healthPath)
// value is { promise, callbacks: Set<fn> }
const __ongoingHealthWaits = new Map();

/**
 * Internal helper: fetch a URL with timeout (using native fetch so we can set per-request Abort)
 * Returns { ok, status, json, errorMessage }
 */
async function fetchWithTimeout(url, opts = {}, timeoutMs = HEALTH_DEFAULTS.perRequestTimeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal, cache: 'no-store' });
    clearTimeout(timer);
    let json = null;
    try { json = await res.json(); } catch (e) { /* ignore non-json */ }
    return { ok: res.ok, status: res.status, json };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') return { ok: false, status: 'aborted', errorMessage: 'Request timed out' };
    return { ok: false, status: 'error', errorMessage: err.message || String(err) };
  }
}

/**
 * Check health once. Returns { ok: boolean, payload }
 */
async function checkHealthOnce(cfg = {}) {
  const c = { ...HEALTH_DEFAULTS, ...cfg };
  const base = (c.base ?? '').replace(/\/+$/, '');
  const path = c.healthPath.startsWith('/') ? c.healthPath : `/${c.healthPath}`;
  const url = base ? `${base}${path}` : path;
  const res = await fetchWithTimeout(url, {}, c.perRequestTimeoutMs);
  if (res.ok && res.json && (String(res.json.status).toLowerCase() === 'up' || String(res.json.status).toLowerCase() === 'ok')) {
    return { ok: true, payload: res.json };
  }
  return { ok: false, payload: res.json, status: res.status, errorMessage: res.errorMessage ?? null };
}

/**
 * Wait for health to become UP within overallTimeoutMs.
 * Calls onWaiting({ waitedMs, nextTryIn, lastStatus }) if provided.
 * Resolves true when health becomes UP, false on timeout.
 */
async function waitForHealth(cfg = {}, onWaiting) {
  const c = { ...HEALTH_DEFAULTS, ...cfg };
  const dedupeKey = `${(c.base ?? '')}::${c.healthPath}`;

  if (__ongoingHealthWaits.has(dedupeKey)) {
    const entry = __ongoingHealthWaits.get(dedupeKey);
    // attach this caller's onWaiting callback if provided
    if (typeof onWaiting === 'function') entry.callbacks.add(onWaiting);
    // If there's an ongoing wait, return the same promise; global events will still be emitted.
    return entry.promise;
  }

  // prepare the per-dedupe callbacks set (store current caller's onWaiting as well)
  const callbacks = new Set();
  if (typeof onWaiting === 'function') callbacks.add(onWaiting);

  // Create a wrapper Promise and store it so concurrent callers reuse it
  const waitPromise = (async () => {
    const start = Date.now();
    // immediate check
    const first = await checkHealthOnce(c);
    let lastStatus = first.status || null;
  if (first.ok) return true;
    while (Date.now() - start < c.overallTimeoutMs) {
      // Call per-dedupe-key callbacks (propagated from concurrent callers)
      if (callbacks.size > 0) {
        callbacks.forEach((cb) => {
          try { cb({ waitedMs: Date.now() - start, nextTryIn: c.pollIntervalMs, lastStatus }); } catch (_) {}
        });
      }
    await new Promise((r) => setTimeout(r, c.pollIntervalMs));
    const r = await checkHealthOnce(c);
    lastStatus = r.status || lastStatus;
    if (r.ok) return true;
  }
    return false;
  })();
  __ongoingHealthWaits.set(dedupeKey, { promise: waitPromise, callbacks });
  try {
    const r = await waitPromise;
    return r;
  } finally {
    __ongoingHealthWaits.delete(dedupeKey);
  }
}

/**
 * requestWithHealth: ensure health is UP before making the axios call.
 *
 * params:
 *  - axiosConfig: { method, url, data, params, headers, signal, ... } (same as axios)
 *  - healthOpts: optional config overrides for waiting behavior and onWaiting callback
 *
 * Throws toError(...) on axios error or an Error with code = 'HEALTH_UNAVAILABLE' when health never becomes UP.
 */
async function requestWithHealth(axiosConfig = {}, healthOpts = {}) {
  const cfg = { ...axiosConfig };
  const onWaiting = healthOpts.onWaiting;

  // emit start - an API request is about to block waiting for health
  emitApiEvent('health:start', { url: cfg.url });

  const healthy = await waitForHealth({ ...HEALTH_DEFAULTS, ...healthOpts }, (info) => {
    // propagate to both the caller and global listeners
    try { onWaiting?.(info); } catch (_) {}
    emitApiEvent('health:waiting', info);
  });

  if (!healthy) {
    emitApiEvent('health:failed', { url: cfg.url });
    const err = new Error('Service unavailable: health probe did not return UP within timeout');
    err.code = 'HEALTH_UNAVAILABLE';
    throw err;
  }

  // health ok
  emitApiEvent('health:ready', { url: cfg.url });

  try {
    const axiosResp = await http.request(cfg);
    return axiosResp.data;
  } catch (e) {
    throw toError(e);
  }
}


/* ===========================
   Domain APIs (implemented using requestWithHealth)
   =========================== */

// portfolio (public)
export const portfolio = {
  getUserPortfolio: async (opts = {}) => {
    // opts may contain { signal, healthOpts }
    const axiosCfg = {
      method: 'get',
      url: '/api/v1/user/portfolio/',
      signal: opts.signal,
    };
    return requestWithHealth(axiosCfg, opts.healthOpts);
  },
};

// hero & about
export const hero = {
  getHeroSection: async (opts = {}) => {
    return requestWithHealth({ method: 'get', url: '/api/v1/admin/portfolio/hero-section', signal: opts.signal }, opts.healthOpts);
  },
  updateHeroSection: async (payload, opts = {}) => {
    return requestWithHealth({ method: 'post', url: '/api/v1/admin/portfolio/hero-section', data: payload }, opts.healthOpts);
  },
};

export const about = {
  getAboutSection: async (opts = {}) => {
    return requestWithHealth({ method: 'get', url: '/api/v1/admin/portfolio/about-section', signal: opts.signal }, opts.healthOpts);
  },

  updateAboutSection: async (payload = {}, opts = {}) => {
    const form = payload instanceof FormData ? payload : buildFormData(payload);
    return requestWithHealth({ method: 'post', url: '/api/v1/admin/portfolio/about-section', data: form }, opts.healthOpts);
  },
};

// projects
export const projects = {
  getAll: async (opts = {}) => requestWithHealth({ method: 'get', url: '/api/v1/admin/portfolio/project-section', signal: opts.signal }, opts.healthOpts),
  create: async (payload, opts = {}) => requestWithHealth({ method: 'post', url: '/api/v1/admin/portfolio/project', data: payload }, opts.healthOpts),
  update: async (projectId, payload, opts = {}) => requestWithHealth({ method: 'put', url: `/api/v1/admin/portfolio/project/${encodeURIComponent(projectId)}`, data: payload }, opts.healthOpts),
  remove: async (projectId, opts = {}) => requestWithHealth({ method: 'delete', url: `/api/v1/admin/portfolio/project/${encodeURIComponent(projectId)}` }, opts.healthOpts),
};

// experience
export const experience = {
  getAll: async (opts = {}) => requestWithHealth({ method: 'get', url: '/api/v1/admin/portfolio/experience-section', signal: opts.signal }, opts.healthOpts),
  create: async (payload, opts = {}) => requestWithHealth({ method: 'post', url: '/api/v1/admin/portfolio/experience', data: payload }, opts.healthOpts),
  update: async (id, payload, opts = {}) => requestWithHealth({ method: 'put', url: `/api/v1/admin/portfolio/experience/${encodeURIComponent(id)}`, data: payload }, opts.healthOpts),
  remove: async (id, opts = {}) => requestWithHealth({ method: 'delete', url: `/api/v1/admin/portfolio/experience/${encodeURIComponent(id)}` }, opts.healthOpts),
};

// contact
export const contact = {
  sendMessage: async (payload, opts = {}) => requestWithHealth({ method: 'post', url: '/api/v1/user/portfolio/send-message', data: payload }, opts.healthOpts),
};

// Poll a URL until it responds with HTTP 200 or until overall timeout elapses
// Returns true if the URL started responding with 200 within the timeout, otherwise false
export async function pollUrlFor200(url, intervalMs = 10000, overallTimeoutMs = 4 * 60 * 1000, perRequestTimeoutMs = HEALTH_DEFAULTS.perRequestTimeoutMs) {
  const start = Date.now();
  // immediate check
  try {
    let res = await fetchWithTimeout(url, {}, perRequestTimeoutMs);
    if (res.ok) return true; // any 2xx will be treated as success
  } catch (_) {}

  while (Date.now() - start < overallTimeoutMs) {
    await new Promise((r) => setTimeout(r, intervalMs));
    try {
      const r = await fetchWithTimeout(url, {}, perRequestTimeoutMs);
      if (r.ok) return true;
    } catch (_) {}
  }
  return false;
}

// Wrap the default contact.sendMessage to start a background worker health polling
// after a successful send. The function still returns the original send response immediately.
const _originalSend = contact.sendMessage;
contact.sendMessage = async (payload, opts = {}) => {
  const res = await _originalSend(payload, opts);
  // After successful send, start background polling for the worker health endpoint
  // default target per user's request
  const workerHealthUrl = (opts && opts.workerHealthUrl) || 'https://solopilot-worker-service.onrender.com/actuator/health';
  const intervalMs = (opts && opts.workerPollIntervalMs) || 10_000; // 10 seconds
  const overallTimeoutMs = (opts && opts.workerPollTimeoutMs) || 4 * 60 * 1000; // 4 minutes
  const perRequestTimeoutMs = (opts && opts.workerPollPerRequestTimeoutMs) || HEALTH_DEFAULTS.perRequestTimeoutMs;
  // Launch in background (non-blocking)
  (async () => {
    try {
      emitApiEvent('worker:poll:start', { url: workerHealthUrl });
      const ok = await pollUrlFor200(workerHealthUrl, intervalMs, overallTimeoutMs, perRequestTimeoutMs);
      if (ok) emitApiEvent('worker:poll:ready', { url: workerHealthUrl });
      else emitApiEvent('worker:poll:timeout', { url: workerHealthUrl });
    } catch (e) {
      // ignore background errors, but emit a failure event
      emitApiEvent('worker:poll:error', { url: workerHealthUrl, error: extractErrorMessage(e) });
    }
  })();
  return res;
};

// skills & expertise
export const skills = {
  getAllExpertises: async (opts = {}) => requestWithHealth({ method: 'get', url: '/api/v1/admin/skills/expertise/all', signal: opts.signal }, opts.healthOpts),
  createExpertise: async (payload, opts = {}) => requestWithHealth({ method: 'post', url: '/api/v1/admin/skills/expertise', data: payload }, opts.healthOpts),
  updateExpertise: async (uuid, payload, opts = {}) => requestWithHealth({ method: 'put', url: `/api/v1/admin/skills/expertise/${encodeURIComponent(uuid)}`, data: payload }, opts.healthOpts),
  deleteExpertise: async (uuid, opts = {}) => requestWithHealth({ method: 'delete', url: `/api/v1/admin/skills/expertise/${encodeURIComponent(uuid)}` }, opts.healthOpts),

  createSkill: async (expertiseUuid, payload, opts = {}) => requestWithHealth({ method: 'post', url: `/api/v1/admin/skills/expertise/${encodeURIComponent(expertiseUuid)}/skills`, data: payload }, opts.healthOpts),
  updateSkill: async (skillUuid, payload, opts = {}) => requestWithHealth({ method: 'put', url: `/api/v1/admin/skills/${encodeURIComponent(skillUuid)}`, data: payload }, opts.healthOpts),
  deleteSkill: async (skillUuid, opts = {}) => requestWithHealth({ method: 'delete', url: `/api/v1/admin/skills/${encodeURIComponent(skillUuid)}` }, opts.healthOpts),

  createSkillTools: async (skillUuid, payload, opts = {}) => requestWithHealth({ method: 'post', url: `/api/v1/admin/skills/skills/${encodeURIComponent(skillUuid)}/tools`, data: payload }, opts.healthOpts),
  updateSkillTool: async (toolUuid, payload, opts = {}) => requestWithHealth({ method: 'put', url: `/api/v1/admin/skills/SkillTool/${encodeURIComponent(toolUuid)}`, data: payload }, opts.healthOpts),
  deleteSkillTool: async (toolUuid, opts = {}) => requestWithHealth({ method: 'delete', url: `/api/v1/admin/skills/SkillTool/${encodeURIComponent(toolUuid)}` }, opts.healthOpts),
};

// auth
export const auth = {
  login: async (payload, opts = {}) => {
    const data = await requestWithHealth({ method: 'post', url: '/api/v1/admin/auth/login', data: payload }, opts.healthOpts);
    if (data?.token) {
      try { localStorage.setItem('sp_token', data.token); } catch (e) {}
    }
    return data;
  },
  logout: async (opts = {}) => {
    const data = await requestWithHealth({ method: 'post', url: '/api/v1/admin/auth/logout' }, opts.healthOpts);
    clearAuthToken();
    return data;
  },
  register: async (payload, opts = {}) => {
    const data = await requestWithHealth({ method: 'post', url: '/api/v1/admin/auth/register', data: payload }, opts.healthOpts);
    if (data?.token) {
      try { localStorage.setItem('sp_token', data.token); } catch (e) {}
    }
    return data;
  },
  resetPassword: async (payload, opts = {}) => requestWithHealth({ method: 'post', url: '/api/v1/admin/auth/reset-password', data: payload }, opts.healthOpts),
};

// analytics
export const analytics = {
  getSummary: async (opts = {}) => requestWithHealth({ method: 'get', url: '/api/v1/admin/analytics/summary', signal: opts.signal }, opts.healthOpts),
};

// --- default export (http + utilities + groups)
const api = {
  http,
  createAbortSignal,
  buildFormData,
  clearAuthToken,
  extractErrorMessage,
  // domains
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
