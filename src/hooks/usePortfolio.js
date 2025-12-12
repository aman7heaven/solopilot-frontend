// src/hooks/usePortfolio.js
import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../api';

function isAbortError(err) {
  if (!err) return false;
  // axios in modern versions throws a DOMException with name 'CanceledError' or message includes 'canc'
  const msg = String(err?.message || '').toLowerCase();
  if (err?.name === 'CanceledError') return true;
  if (msg.includes('cancel') || msg.includes('canceled')) return true;
  // some normalized errors may carry status or other shape - avoid treating HTTP errors as aborts
  return false;
}

export default function usePortfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    // create an AbortController for this request
    const { controller, signal } = api.createAbortSignal();
    controllerRef.current = controller;

    try {
      const portfolio = await api.portfolio.getUserPortfolio({ signal });
      setData(portfolio);
    } catch (err) {
      // If the request was cancelled/aborted, ignore it (don't set error)
      if (isAbortError(err)) {
        // silently ignore aborts in UI
        // (useful because React StrictMode mounts/unmounts in dev)
        // console.log('portfolio request aborted (ignored)');
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      // cancel only when component unmounts
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) {}
      }
    };
  }, [load]);

  return { data, loading, error, reload: load };
}
