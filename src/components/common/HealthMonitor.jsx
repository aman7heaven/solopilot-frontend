// src/components/common/HealthMonitor.jsx
import React, { useEffect, useState } from 'react';
import { onApiEvent } from '../../api'; // adjust path if necessary
import HealthWaitingPage from './HealthWaitingPage';

export default function HealthMonitor() {
  const [state, setState] = useState({ mode: 'idle', waitedMs: 0 });
  // Small delay before showing the full-screen waiting UI to avoid flashes
  const MIN_SHOW_MS = 300; // 300ms threshold

  useEffect(() => {
    let timer = null; // increments waitedMs
    let pendingShowTimer = null; // delay before showing overlay

    const unsubStart = onApiEvent('health:start', () => {
      // Start counting immediately but delay showing UI to avoid brief flashes
      setState((s) => ({ ...s, mode: 'pending', waitedMs: 0 }));
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        setState((s) => ({ ...s, waitedMs: (s.waitedMs || 0) + 1000 }));
      }, 1000);
      // schedule the overlay show after MIN_SHOW_MS; if ready happens earlier, it will be cancelled
      if (pendingShowTimer) clearTimeout(pendingShowTimer);
      pendingShowTimer = setTimeout(() => {
        setState((s) => ({ ...s, mode: 'waiting' }));
        pendingShowTimer = null;
      }, MIN_SHOW_MS);
    });

    const unsubWaiting = onApiEvent('health:waiting', ({ waitedMs }) => {
      setState((s) => {
        const newWaited = waitedMs ?? s.waitedMs;
        // if waited surpasses threshold, ensure UI is visible
        if (newWaited >= MIN_SHOW_MS && s.mode !== 'waiting') {
          return { ...s, mode: 'waiting', waitedMs: newWaited };
        }
        return { ...s, waitedMs: newWaited };
      });
    });

    const unsubReady = onApiEvent('health:ready', () => {
      setState({ mode: 'idle', waitedMs: 0 });
      if (timer) { clearInterval(timer); timer = null; }
      if (pendingShowTimer) { clearTimeout(pendingShowTimer); pendingShowTimer = null; }
    });

    const unsubFailed = onApiEvent('health:failed', () => {
      setState((s) => ({ ...s, mode: 'failed' }));
      if (timer) { clearInterval(timer); timer = null; }
      if (pendingShowTimer) { clearTimeout(pendingShowTimer); pendingShowTimer = null; }
    });

    return () => {
      unsubStart(); unsubWaiting(); unsubReady(); unsubFailed();
      if (timer) clearInterval(timer);
      if (pendingShowTimer) clearTimeout(pendingShowTimer);
    };
  }, []);

  // when no one is waiting, render nothing
  if (state.mode === 'idle') return null;

  // show waiting page when waiting, failed shows same with message (you can customize)
  return (
    <HealthWaitingPage
      waitedMs={state.waitedMs}
      retry={() => window.location.reload()}
      onClose={() => setState({ mode: 'idle', waitedMs: 0 })}
    />
  );
}
