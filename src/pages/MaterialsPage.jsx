import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, ShoppingCart, FileCheck, ArrowRight, Zap } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const MaterialsPage = () => {
  const { roadmap } = useAppState();

  const defaultValue = [
    { step: 'Purchase Requisition', tcode: 'ME51N', status: 'completed' },
    { step: 'Purchase Order', tcode: 'ME21N', status: 'pending' },
    { step: 'Goods Receipt', tcode: 'MIGO', status: 'pending' },
    { step: 'Invoice Verification', tcode: 'MIRO', status: 'pending' }
  ];

  const steps = roadmap?.procurement_roadmap || defaultValue;

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2 opacity-60">
          <Package size={14} className="text-primary" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">MM-Link Module</span>
        </div>
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Procurement Console</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl">Automating the Material Management lifecycle from requisition to invoice settlement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {['In-Bound', 'Stock Level', 'Safety Stock', 'Valuation'].map((label, i) => (
          <div key={label} className="glass-panel p-6 rounded-3xl border border-outline-variant/10 flex flex-col gap-4">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">{label}</div>
            <div className="text-3xl font-headline font-bold text-on-surface">
              {i === 0 ? 'Active' : i === 1 ? '82%' : i === 2 ? '500 KG' : 'Standard'}
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: i === 1 ? '82%' : '40%' }}></div>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-panel rounded-[2rem] p-10 border border-outline-variant/10 shadow-2xl relative overflow-hidden bg-surface-container-low/30">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShoppingCart size={200} />
        </div>
        
        <h3 className="font-headline text-xl font-bold mb-10 flex items-center gap-3">
          <Zap className="text-primary" size={20} />
          Procurement Lifecycle Visualizer
        </h3>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
          {steps.map((step, i) => (
            <React.Fragment key={step.step}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative group w-full lg:w-auto"
              >
                <div className={`p-6 rounded-[2rem] border min-w-[200px] transition-all bg-surface-container-high ${step.status === 'completed' ? 'border-primary/40 shadow-lg' : 'border-outline-variant/10 opacity-60'}`}>
                  <div className="text-[10px] font-mono text-primary font-bold mb-2 uppercase tracking-tighter">{step.tcode}</div>
                  <div className="font-headline text-sm font-bold mb-1">{step.step}</div>
                  <div className="text-[9px] text-on-surface-variant uppercase tracking-widest">{step.status || 'Pending'}</div>
                </div>
                {step.status === 'completed' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-xl">
                    <FileCheck size={12} />
                  </div>
                )}
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block">
                  <ArrowRight className="text-outline-variant opacity-30" size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MaterialsPage;
