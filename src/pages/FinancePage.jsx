import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, CreditCard, PieChart, ShieldCheck, Database, Zap } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const FinancePage = () => {
  const { roadmap } = useAppState();

  const ledger = roadmap?.financial_ledger || {
    dr_account: 'Receivables (A/R)',
    cr_account: 'Revenue / Tax',
    gl_mapping_tcode: 'VKOA'
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2 opacity-60">
          <Landmark size={14} className="text-secondary" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">FICO-Sync Module</span>
        </div>
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Financial Ledger Sync</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl">Automated G/L account determination and billing integration logic for S/4HANA.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="glass-panel p-8 rounded-[2rem] border border-outline-variant/10 bg-surface-container-low/30 flex flex-col gap-6">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Database size={24} />
          </div>
          <div>
             <h3 className="font-headline text-lg font-bold mb-1">Account Mapping</h3>
             <div className="text-[9px] font-mono text-secondary font-bold uppercase tracking-widest mb-4">Neural T-Code: {ledger.gl_mapping_tcode}</div>
             <p className="text-xs text-on-surface-variant leading-relaxed">System automatically maps Account Assignment Groups to General Ledger accounts based on chart of accounts logic.</p>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-[2rem] p-8 border border-outline-variant/10 bg-gradient-to-br from-surface-container-low to-secondary/5 relative overflow-hidden">
           <h3 className="font-headline text-lg font-bold mb-8 flex items-center gap-3">
             <CreditCard size={18} className="text-secondary" />
             Billing ↔ G/L Neural Interface
           </h3>

           <div className="flex items-start justify-between gap-12 relative z-10">
              <div className="flex-1 p-6 rounded-2xl bg-surface-container-high border border-outline-variant/10 shadow-lg">
                 <div className="text-[9px] uppercase font-bold text-on-surface-variant/60 mb-4 tracking-widest">Debit Control</div>
                 <div className="text-lg font-headline font-bold mb-1 text-on-surface">{ledger.dr_account}</div>
                 <div className="text-[10px] font-mono text-secondary">POSTING_KEY: 01</div>
              </div>
              <div className="pt-8 opacity-40">
                <Zap size={24} className="text-secondary animate-pulse" />
              </div>
              <div className="flex-1 p-6 rounded-2xl bg-surface-container-high border border-outline-variant/10 shadow-lg">
                 <div className="text-[9px] uppercase font-bold text-on-surface-variant/60 mb-4 tracking-widest">Credit Control</div>
                 <div className="text-lg font-headline font-bold mb-1 text-on-surface">{ledger.cr_account}</div>
                 <div className="text-[10px] font-mono text-secondary">POSTING_KEY: 50</div>
              </div>
           </div>
        </div>
      </div>

      <section className="glass-panel rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-2xl bg-surface-container-highest/20 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-xl font-bold flex items-center gap-3">
            <PieChart size={22} className="text-secondary" />
            Revenue Reconciliation Matrix
          </h3>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-bold text-secondary uppercase tracking-widest">
            <ShieldCheck size={12} />
            Best Practice Validated
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Chart of Accounts', value: 'INT', icon: <Landmark size={14} /> },
             { label: 'Fiscal Year', value: 'V3', icon: <PieChart size={14} /> },
             { label: 'Posting Period', value: 'Open', icon: <Zap size={14} /> },
             { label: 'Auto-Clearing', value: 'Enabled', icon: <ShieldCheck size={14} /> }
           ].map((stat) => (
             <div key={stat.label} className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/5">
                <div className="text-secondary mb-3">{stat.icon}</div>
                <div className="text-[10px] uppercase font-bold text-on-surface-variant/60 mb-1">{stat.label}</div>
                <div className="text-lg font-headline font-bold">{stat.value}</div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default FinancePage;
