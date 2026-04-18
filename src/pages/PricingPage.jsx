import React from 'react';
import { motion } from 'framer-motion';
import { Table, Zap, Calculator, ShieldAlert, BadgeInfo, SlidersHorizontal, Settings, Info } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const PricingPage = () => {
  const { roadmap } = useAppState();
  
  const defaultPricing = {
    name: "ZIM24 - INESH PRICING",
    full_grid: [
      { step: 10, ctyp: "ZM24", description: "Basic Value", from: "", to: "", stat: "X", reqt: "2", calType: "", basType: "", acck: "ERL" },
      { step: 20, ctyp: "Z007", description: "Customer Dis-TG07", from: "10", to: "", stat: "", reqt: "", calType: "", basType: "", acck: "ERS" },
      { step: 30, ctyp: "ZFOO", description: "PRICE - DISCOUNT", from: "10", to: "20", stat: "", reqt: "", calType: "", basType: "", acck: "ERL" },
      { step: 32, ctyp: "", description: "Freight", from: "", to: "", stat: "X", reqt: "", calType: "", basType: "", acck: "ERF" },
      { step: 35, ctyp: "", description: "PRICE - DISCOUNT + FRIEGHT", from: "30", to: "32", stat: "", reqt: "", calType: "", basType: "16", acck: "" },
      { step: 36, ctyp: "CGST", description: "CGST - India", from: "30", to: "", stat: "", reqt: "10", calType: "", basType: "", acck: "MWS" },
      { step: 38, ctyp: "SGST", description: "SGST - India", from: "30", to: "", stat: "", reqt: "10", calType: "", basType: "", acck: "MWS" }
    ]
  };

  const pricing = roadmap?.pricing_procedure || defaultPricing;
  const grid = pricing.full_grid || defaultPricing.full_grid;

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2 opacity-60 font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-primary">
            <Settings size={12} />
            SPRO: Control Data Overview
          </div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Neural Pricing Lab</h2>
          <p className="text-on-surface-variant text-sm flex items-center gap-2">
            <Calculator size={14} className="text-secondary" />
            V/08 Procedure: <span className="font-bold text-on-surface">{pricing.name}</span>
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldAlert size={14} /> Automatic Entry
           </div>
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] border border-outline-variant/10 overflow-hidden shadow-2xl bg-surface-container/10 flex flex-col">
        <div className="w-full overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-surface-container-high/60 border-b border-outline-variant/10 sticky top-0 z-10 backdrop-blur-xl">
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-20">Step</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-24">CTyp</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">Description</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-16 text-center">From</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-16 text-center">To</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-16 text-center">Stat</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-16 text-center">Reqt</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-16">CalType</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest w-16 text-right">AccK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {grid.map((step, i) => (
                <motion.tr 
                  key={step.step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-primary/5 transition-colors group cursor-default"
                >
                  <td className="p-6 font-mono text-xs text-primary font-bold">{step.step}</td>
                  <td className="p-6 font-headline text-xs font-bold text-secondary">{step.ctyp || '-'}</td>
                  <td className="p-6 text-xs text-on-surface font-medium opacity-90">{step.description}</td>
                  <td className="p-6 text-center font-mono text-xs opacity-40">{step.from}</td>
                  <td className="p-6 text-center font-mono text-xs opacity-40">{step.to}</td>
                  <td className="p-6 text-center">
                    {step.stat === 'X' && <span className="w-2 h-2 rounded-full bg-primary inline-block shadow-[0_0_8px_rgba(104,211,255,0.6)]" />}
                  </td>
                  <td className="p-6 text-center font-mono text-xs text-secondary/60">{step.reqt}</td>
                  <td className="p-6 font-mono text-xs opacity-40">{step.calType}</td>
                  <td className="p-6 text-right font-mono text-[10px] font-bold text-primary/80">{step.acck}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-8 flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
         <PricingDetailCard 
           label="Condition Technique" 
           value="Specific → General" 
           desc="Neural hierarchy alignment active" 
           icon={<Zap size={16} />}
         />
         <PricingDetailCard 
           label="Access Sequence" 
           value="AS_ZIM24" 
           desc="Conditional search criteria enabled" 
           icon={<BadgeInfo size={16} />}
         />
         <PricingDetailCard 
           label="Header Conditions" 
           value="Multi-tier" 
           desc="Applicable to whole document flow" 
           icon={<Info size={16} />}
         />
      </footer>
    </div>
  );
};

const PricingDetailCard = ({ label, value, desc, icon }) => (
  <div className="min-w-[280px] glass-panel p-6 rounded-3xl border border-outline-variant/10 bg-surface-container-low/30 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-[0.2em]">{label}</div>
      <div className="text-primary">{icon}</div>
    </div>
    <div>
      <div className="text-lg font-headline font-bold mb-1 text-on-surface">{value}</div>
      <div className="text-[10px] text-on-surface-variant opacity-60 leading-tight">{desc}</div>
    </div>
  </div>
);

export default PricingPage;
