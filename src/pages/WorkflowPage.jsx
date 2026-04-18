import React from 'react';
import { motion } from 'framer-motion';
import { Network, ArrowRight, Zap, CheckCircle2, Search, Database, Globe } from 'lucide-react';

const WorkflowPage = () => {
  const steps = [
    { title: 'Neural Input', desc: 'S/4HANA requirements captured via Natural Language Processing.', icon: <Search size={20} /> },
    { title: 'Case Analysis', desc: 'Case-Based Reasoning (CBR) maps requirement to SAP best practices.', icon: <Database size={20} /> },
    { title: 'Architect Mapping', desc: 'Agent Architect generates T-Codes and technical step sequences.', icon: <Zap size={20} /> },
    { title: 'Integrator Link', desc: 'Workspace agents sync data to Google Sheets and Calendar.', icon: <Globe size={20} /> },
    { title: 'Overseer Audit', desc: 'Neural sanity check and security leak scan performed.', icon: <CheckCircle2 size={20} /> }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar flex flex-col items-center">
      <header className="mb-16 text-center w-full">
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Neural Pipeline</h2>
        <p className="text-on-surface-variant text-sm">Tracing the lifecycle of an Aether Intelligence request</p>
      </header>

      <div className="relative w-full max-w-4xl px-8 pb-32">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-0 bottom-40 w-px bg-gradient-to-b from-primary/5 via-primary to-transparent -translate-x-1/2 shadow-[0_0_15px_rgba(104,211,255,0.3)]"></div>

        <div className="space-y-24">
          {steps.map((step, i) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`flex items-center gap-12 w-full ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-3xl glass-panel border border-outline-variant/10 shadow-2xl hover:border-primary/40 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="font-headline text-lg font-bold mb-1">{step.title}</h3>
                <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(104,211,255,1)] relative z-10 border-4 border-background"></div>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute w-8 h-8 rounded-full bg-primary/30"
                />
              </div>

              <div className="flex-1"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="mt-auto p-8 text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">
        Aether Workflow v3.0 // Neural Precision Engine
      </footer>
    </div>
  );
};

export default WorkflowPage;
