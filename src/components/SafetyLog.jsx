import React from 'react';
import { ShieldAlert, Terminal, Cpu, Gauge, Activity } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const SafetyLog = () => {
  const { warnings } = useAppState();

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12 border-b border-outline-variant/10 pb-6 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/20 shrink-0">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Overseer Console</h2>
          <p className="text-on-surface-variant text-sm flex items-center gap-2">
            <Activity size={14} className="text-error" />
            Neural Audit & Security Monitoring Hub
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section className="glass-panel p-8 rounded-3xl border border-outline-variant/10">
          <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <Cpu size={14} className="text-primary"/> Active Security Matrix
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/10 text-center">
              <div className="text-xs text-on-surface-variant mb-1">Audit DB Capacity</div>
              <div className="font-headline font-bold text-2xl text-primary">50 MB</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/10 text-center">
              <div className="text-xs text-on-surface-variant mb-1">Rule Engine</div>
              <div className="font-headline font-bold text-2xl text-secondary">Active</div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-outline-variant/10 pb-2">
          <Terminal size={14} /> Active Policy Violations
        </div>
        
        <div className="space-y-4">
          {warnings.length > 0 ? warnings.map((warn, i) => (
            <div key={i} className={`p-6 rounded-2xl border flex gap-6 hover-lift ${warn.severity === 'CRITICAL' ? 'bg-error/10 border-error/20 shadow-[0_4px_20px_rgba(255,113,108,0.1)]' : 'bg-orange-500/10 border-orange-500/20'}`}>
              <Terminal size={24} className={warn.severity === 'CRITICAL' ? 'text-error mt-1' : 'text-orange-400 mt-1'} />
              <div>
                <div className="font-headline text-lg font-bold leading-tight mb-2">{warn.type} Violation</div>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-4xl">{warn.message}</p>
                <div className="mt-4 text-[10px] text-error font-mono tracking-widest uppercase py-1 px-3 border border-error/20 inline-block bg-error/5 rounded">
                  Status: Action Required
                </div>
              </div>
            </div>
          )) : (
            <div className="glass-panel p-16 rounded-3xl border border-outline-variant/10 text-center">
              <Gauge size={48} className="mx-auto mb-6 opacity-20 text-success" />
              <div className="font-headline text-xl font-bold mb-2">Systems Compliant</div>
              <div className="text-sm text-on-surface-variant">All neuro-policies and SAP constraints are currently satisfied.</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SafetyLog;
