import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Cpu, Sliders, Check, UserCircle } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const NeuralConfig = ({ isOpen, onClose }) => {
  const { neuralConfig, setNeuralConfig } = useAppState();

  const handleUpdate = (key, value) => {
    setNeuralConfig(prev => ({ ...prev, [key]: value }));
  };

  const personas = [
    { id: 'Expert SAP Architect', desc: 'Strict, technical, focus on T-Codes.' },
    { id: 'Creative Consultant', desc: 'Holistic approach, focus on business flow.' },
    { id: 'Legacy Migration Lead', desc: 'Focus on ECC-to-S/4 mapping.' }
  ];

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
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold tracking-tight">Neural Tuning</h3>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em]">Agent Parameter Sync</p>
                </div>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <section className="space-y-8">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={12} />
                  Precision Control
                </div>
                
                <Slider 
                  label="Temperature" 
                  value={neuralConfig.temperature} 
                  min={0.1} max={1.0} step={0.1}
                  onChange={(v) => handleUpdate('temperature', v)}
                  desc="Higher values make Agent Architect more creative."
                />

                <Slider 
                  label="Top P (Nucleus)" 
                  value={neuralConfig.topP} 
                  min={0.1} max={1.0} step={0.1}
                  onChange={(v) => handleUpdate('topP', v)}
                  desc="Adjusts the diversity of tokens used in reasoning."
                />
              </section>

              <section className="space-y-6">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex items-center gap-2">
                  <UserCircle size={12} />
                  Persona Mapping
                </div>
                <div className="grid gap-3">
                  {personas.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handleUpdate('persona', p.id)}
                      className={`p-5 rounded-2xl border transition-all text-left group ${neuralConfig.persona === p.id ? 'border-secondary bg-secondary/5' : 'border-outline-variant/10 bg-surface-container hover:border-secondary/30'}`}
                    >
                      <div className={`text-xs font-bold mb-1 ${neuralConfig.persona === p.id ? 'text-secondary' : 'text-on-surface'}`}>{p.id}</div>
                      <div className="text-[10px] text-on-surface-variant opacity-60 leading-relaxed">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={12} />
                  Regionality & Language
                </div>
                <div className="flex gap-2">
                  {['English', 'German', 'Spanish', 'French'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => handleUpdate('language', lang)}
                      className={`flex-1 px-3 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${neuralConfig.language === lang ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_10px_rgba(104,211,255,0.2)]' : 'bg-surface-container border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      {lang.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </section>

              <section className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
                <div className="flex gap-4">
                  <Cpu className="text-secondary shrink-0" size={20} />
                  <div className="text-[11px] text-on-surface-variant leading-relaxed">
                    <span className="font-bold text-secondary block mb-1">Architecture Sync Active</span>
                    Parameters are live-synced to the Groq inference engine. High temperature (&gt;0.7) may increase technical hallucinations.
                  </div>
                </div>
              </section>
            </div>

            <footer className="p-8 border-t border-outline-variant/10 bg-surface-container/30">
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-secondary text-on-secondary font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <Check size={18} />
                Deploy Parameters
              </button>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Slider = ({ label, value, min, max, step, onChange, desc }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
      <span className="text-on-surface-variant">{label}</span>
      <span className="text-secondary">{value.toFixed(1)}</span>
    </div>
    <input 
      type="range"
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary transition-all"
    />
    <p className="text-[9px] text-on-surface-variant/50">{desc}</p>
  </div>
);

export default NeuralConfig;
