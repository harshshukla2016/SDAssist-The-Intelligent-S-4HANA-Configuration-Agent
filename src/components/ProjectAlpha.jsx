import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, Building2, Globe, Cpu, Check } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const ProjectAlpha = ({ isOpen, onClose }) => {
  const { projectMeta, setProjectMeta } = useAppState();

  const handleUpdate = (key, value) => {
    setProjectMeta(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[101] bg-[#0d0e0f] border-l border-outline-variant/10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col"
          >
            <header className="p-8 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold tracking-tight">Project Alpha</h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Contextual Matrix</p>
                </div>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <section className="space-y-6">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={12} />
                  Enterprise Entity
                </div>
                <div className="grid gap-4">
                  <Field 
                    label="Client Identifier" 
                    value={projectMeta.client} 
                    onChange={(v) => handleUpdate('client', v)} 
                    placeholder="e.g. Mercedes Benz"
                  />
                  <Field 
                    label="Target Industry" 
                    value={projectMeta.industry} 
                    onChange={(v) => handleUpdate('industry', v)} 
                    placeholder="e.g. Automotive"
                  />
                </div>
              </section>

              <section className="space-y-6">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} />
                  S/4HANA Versioning
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['S/4HANA 2023', 'S/4HANA 2022', 'S4HANA 2021', 'Legacy ECC'].map(v => (
                    <button 
                      key={v}
                      onClick={() => handleUpdate('version', v)}
                      className={`p-4 rounded-xl border text-xs font-medium transition-all text-center ${projectMeta.version === v ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/10 bg-surface-container hover:bg-surface-container-high'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </section>

              <section className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex gap-4">
                  <Cpu className="text-primary shrink-0" size={20} />
                  <div className="text-[11px] text-on-surface-variant leading-relaxed">
                    <span className="font-bold text-primary block mb-1">Neural Impact Active</span>
                    Changes to Project Alpha will dynamically adjust Agent Architect's reasoning parameters for all subsequent roadmaps.
                  </div>
                </div>
              </section>
            </div>

            <footer className="p-8 border-t border-outline-variant/10 bg-surface-container/30">
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dim transition-all active:scale-[0.98]"
              >
                <Check size={18} />
                Sync Context
              </button>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Field = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">{label}</label>
    <input 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-on-surface-variant/30"
    />
  </div>
);

export default ProjectAlpha;
