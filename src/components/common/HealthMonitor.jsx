// src/components/common/HealthMonitor.jsx
import React, { useEffect, useState } from 'react';
import { onApiEvent } from '../../api'; // adjust path if necessary
import HealthWaitingPage from './HealthWaitingPage';

export default function HealthMonitor() {
  const [state, setState] = useState({ mode: 'idle', waitedMs: 0 });

  useEffect(() => {
    let timer = null;

    const unsubStart = onApiEvent('health:start', () => {
      setState({ mode: 'waiting', waitedMs: 0 });
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        setState((s) => ({ ...s, waitedMs: (s.waitedMs || 0) + 1000 }));
      }, 1000);
    });

    const unsubWaiting = onApiEvent('health:waiting', ({ waitedMs }) => {
      setState((s) => ({ ...s, mode: 'waiting', waitedMs: waitedMs ?? s.waitedMs }));
    });

    const unsubReady = onApiEvent('health:ready', () => {
      setState({ mode: 'idle', waitedMs: 0 });
      if (timer) { clearInterval(timer); timer = null; }
    });

    const unsubFailed = onApiEvent('health:failed', () => {
      setState((s) => ({ ...s, mode: 'failed' }));
      if (timer) { clearInterval(timer); timer = null; }
    });

    return () => {
      unsubStart(); unsubWaiting(); unsubReady(); unsubFailed();
      if (timer) clearInterval(timer);
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
