import React from 'react';
import { motion } from 'framer-motion';
import { Network, ArrowRight, Zap, CheckCircle2, Search, Database, Globe, ShoppingCart, Truck, Landmark, PieChart } from 'lucide-react';

const WorkflowPage = () => {
  const pipelineSteps = [
    { title: 'Neural Input', desc: 'S/4HANA requirements captured via Natural Language Processing.', icon: <Search size={20} /> },
    { title: 'Case Analysis', desc: 'Case-Based Reasoning (CBR) maps requirement to SAP best practices.', icon: <Database size={20} /> },
    { title: 'Architect Mapping', desc: 'Agent Architect generates T-Codes and technical step sequences.', icon: <Zap size={20} /> },
    { title: 'Integrator Link', desc: 'Workspace agents sync data to Google Sheets and Calendar.', icon: <Globe size={20} /> }
  ];

  const enterpriseFlow = [
    { from: 'SD', to: 'MM', action: 'Availability Check', sub: 'ATP stock verification', icon: <ShoppingCart size={20} /> },
    { from: 'MM', to: 'FI', action: 'LIV Verification', sub: '3-way Vendor Match', icon: <Truck size={20} /> },
    { from: 'SD', to: 'FI', action: 'Bill Customer', sub: 'Revenue G/L Posting', icon: <Landmark size={20} /> },
    { from: 'CO', to: 'MGMT', action: 'CO-PA Analysis', sub: 'Profitability Report', icon: <PieChart size={20} /> }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar flex flex-col items-center">
      <header className="mb-16 text-center w-full">
        <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Aether System Orchestration</div>
        <h2 className="font-headline text-5xl font-bold tracking-tight mb-2">Neural Pipeline & Handoffs</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl mx-auto">Tracing the lifecycle of an Aether Intelligence request through the SAP Digital Twin ecosystem.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full max-w-6xl pb-32">
        {/* Pipeline Column */}
        <div className="flex flex-col gap-12 relative">
           <div className="absolute left-8 top-0 bottom-0 w-px bg-primary/20"></div>
           <h3 className="font-headline text-xl font-bold mb-4 flex items-center gap-3 ml-2">
             <div className="w-2 h-2 rounded-full bg-primary" />
             Aether Internal Logic
           </h3>
           {pipelineSteps.map((step, i) => (
             <motion.div 
               key={step.title}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="flex items-center gap-6 relative z-10"
             >
                <div className="w-16 h-16 rounded-3xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-primary shadow-xl">
                  {step.icon}
                </div>
                <div>
                   <div className="font-headline font-bold text-lg">{step.title}</div>
                   <div className="text-[11px] text-on-surface-variant max-w-xs">{step.desc}</div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Module Handoff Column */}
        <div className="flex flex-col gap-8">
           <h3 className="font-headline text-xl font-bold mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-secondary" />
             Cross-Module Symphony (SD-MM-FI)
           </h3>
           {enterpriseFlow.map((flow, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-[2.5rem] border border-outline-variant/10 relative overflow-hidden group hover:border-secondary/40 transition-all"
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   {flow.icon}
                </div>
                <div className="flex items-center gap-4 mb-4">
                   <div className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-[10px] font-bold">{flow.from}</div>
                   <ArrowRight size={14} className="opacity-40" />
                   <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">{flow.to}</div>
                </div>
                <div className="font-headline text-lg font-bold mb-1">{flow.action}</div>
                <div className="text-[11px] text-on-surface-variant italic">"{flow.sub}"</div>
             </motion.div>
           ))}
        </div>
      </div>

      <footer className="mt-auto p-12 text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">
        Nebula V9.0 titan // Digital Twin Flow Sync
      </footer>
    </div>
  );
};

export default WorkflowPage;
