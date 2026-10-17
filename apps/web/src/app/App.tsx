import type { ReactElement } from 'react';

export function App(): ReactElement {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-700 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Proximi</h1>
        <p className="text-slate-400 mb-6">Trust-first resource-sharing platform</p>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-800 text-left">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">API Target</div>
          <div className="text-emerald-400 break-all" data-testid="api-url">{apiUrl}</div>
        </div>
      </div>
    </main>
  );
}
