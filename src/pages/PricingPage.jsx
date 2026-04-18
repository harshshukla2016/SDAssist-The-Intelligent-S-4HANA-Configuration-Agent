import React from 'react';
import { motion } from 'framer-motion';
import { Table, Zap, Calculator, ShieldAlert, BadgeInfo, SlidersHorizontal } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const PricingPage = () => {
  const { roadmap } = useAppState();
  const pricing = roadmap?.pricing_procedure || {
    name: "RVAA01 (Standard)",
    steps: [
      { step: 10, cond_type: "PR00", description: "Base Price", requirement: "2" },
      { step: 20, cond_type: "K007", description: "Customer Discount", requirement: "None" },
      { step: 100, cond_type: "MWST", description: "Output Tax", requirement: "10" }
    ]
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Neural Pricing Lab</h2>
          <p className="text-on-surface-variant text-sm flex items-center gap-2">
            <Calculator size={14} className="text-secondary" />
            Configuring V/08: {pricing.name}
          </p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 rounded-[1rem] bg-secondary/10 border border-secondary/20 text-secondary font-bold text-xs hover:bg-secondary/20 transition-all flex items-center gap-2">
              <SlidersHorizontal size={14} />
              Condition Records
           </button>
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] border border-outline-variant/10 overflow-hidden shadow-2xl bg-surface-container/20">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                <th className="p-8 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest w-24">Step</th>
                <th className="p-8 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest w-32">Cond. Type</th>
                <th className="p-8 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Description</th>
                <th className="p-8 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Requirement</th>
                <th className="p-8 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest text-right">Account Key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {pricing.steps.map((step, i) => (
                <motion.tr 
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-primary/5 transition-colors group cursor-default"
                >
                  <td className="p-8 font-mono text-xs text-primary font-bold">{step.step}</td>
                  <td className="p-8 font-headline text-sm font-bold opacity-80 decoration-primary/30 decoration-2 underline-offset-4 group-hover:underline">{step.cond_type}</td>
                  <td className="p-8 text-sm text-on-surface font-medium">{step.description}</td>
                  <td className="p-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest">
                       <Zap size={10} />
                       {step.requirement}
                    </div>
                  </td>
                  <td className="p-8 text-right font-mono text-xs text-on-surface-variant opacity-60">ERL</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
         <PricingCard 
           icon={<ShieldAlert className="text-error" size={18} />}
           title="Account Assignment"
           value="VKOA Verified"
         />
         <PricingCard 
           icon={<BadgeInfo className="text-primary" size={18} />}
           title="Access Sequences"
           value="AS_PR00 Active"
         />
         <PricingCard 
           icon={<Calculator className="text-secondary" size={18} />}
           title="Condition Technique"
           value="6/16 Formula"
         />
      </footer>
    </div>
  );
};

const PricingCard = ({ icon, title, value }) => (
  <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 flex items-center gap-4 bg-surface-container/50">
     <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/10">
        {icon}
     </div>
     <div>
        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</div>
        <div className="text-sm font-headline font-bold text-on-surface">{value}</div>
     </div>
  </div>
);

export default PricingPage;
