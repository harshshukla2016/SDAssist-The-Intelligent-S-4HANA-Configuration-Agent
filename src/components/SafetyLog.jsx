import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, X, Archive, Cpu, Gauge } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const SafetyLog = () => {
  const { warnings } = useAppState();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end p-8 bg-black/40 backdrop-blur-md animate-in slide-in-from-right-full duration-500">
      <div className="w-full max-w-sm h-full bg-[#0d0e0f] border-l border-outline-variant/20 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        <header className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-error/10 flex items-center justify-center text-error border border-error/20">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold">Overseer Log</h3>
              <p className="text-[10px] text-error font-bold tracking-[0.2em] uppercase">Security & Audit</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <section>
            <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Archive size={12} />
              Active Metadata
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/10 text-center">
                <div className="text-xs text-on-surface-variant mb-1">Bundle Size</div>
                <div className="font-headline font-bold text-lg text-primary">268 KB</div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/10 text-center">
                <div className="text-xs text-on-surface-variant mb-1">Neural Nodes</div>
                <div className="font-headline font-bold text-lg text-secondary">42</div>
              </div>
            </div>
          </section>

          <section>
            <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu size={12} />
              Policy Violations
            </div>
            <div className="space-y-4">
              {warnings.length > 0 ? warnings.map((warn, i) => (
                <div key={i} className={`p-4 rounded-xl border flex gap-4 ${warn.severity === 'CRITICAL' ? 'bg-error/10 border-error/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                  <Terminal size={18} className={warn.severity === 'CRITICAL' ? 'text-error' : 'text-orange-400'} />
                  <div>
                    <div className="font-headline text-xs font-bold leading-tight mb-1">{warn.type} Violation</div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">{warn.message}</p>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-xs text-on-surface-variant opacity-40">
                  <Gauge size={32} className="mx-auto mb-4 opacity-20" />
                  All neuro-policies currently compliant.
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="p-6 border-t border-outline-variant/10 bg-surface-container/50 text-[10px] text-on-surface-variant">
          Overseer AI Agent Active since epoch. Neural sanity level: 100%.
        </footer>
      </div>
    </div>
  );
};

export default SafetyLog;
