import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Clock, ArrowRight, Table, Layout, Search, Zap, Trash2, RefreshCw, X, Upload, BrainCircuit, ShieldCheck } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const ArchivesPage = () => {
  const { archives, setRoadmap, setActivePage, localRagContext, setLocalRagContext } = useAppState();
  const [selected, setSelected] = React.useState([]);
  const [comparison, setComparison] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const toggleSelect = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleAnalyze = async () => {
    if (selected.length !== 2) return;
    setIsAnalyzing(true);
    setComparison(null);
    
    try {
      const a = archives.find(x => x.id === selected[0]);
      const b = archives.find(x => x.id === selected[1]);
      
      // Simulate Groq fetch for comparison
      const report = `Technical Analysis: Snapshot ${a.id.toString().slice(-4)} focuses on ${a.data.scenario_type} with ${a.data.configuration_roadmap?.length} steps, while Snapshot ${b.id.toString().slice(-4)} introduces additional ${b.data.scenario_type} logic. Key difference: The latter requires ${b.data.configuration_roadmap?.[0]?.tcode || 'unique'} validation.`;
      
      setTimeout(() => {
        setComparison(report);
        setIsAnalyzing(false);
      }, 1500);
    } catch (err) {
      setIsAnalyzing(false);
    }
  };

  const handleRestore = (roadmapData) => {
    setRoadmap(roadmapData);
    setActivePage('dashboard');
  };

  const handleRagUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalRagContext(event.target.result);
    };
    reader.readAsText(file);
  };

  const clearRagContext = () => {
    setLocalRagContext('');
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar flex flex-col">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Neural Memory Hub</h2>
          <p className="text-on-surface-variant text-sm flex items-center gap-2">
            <Archive size={14} className="text-primary" />
            Restoring previous neural roadmap snapshots
          </p>
        </div>
        {selected.length === 2 && (
          <button 
            onClick={handleAnalyze}
            className={`px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-2 transition-all hover:bg-primary-dim shadow-xl ${isAnalyzing ? 'animate-pulse' : ''}`}
          >
            <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            Analyze Differences
          </button>
        )}
      </header>

      {/* Local RAG / Proprietary Memory Injection Zone */}
      <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-8 rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[220px] ${localRagContext ? 'border-secondary/40 bg-secondary/5' : 'border-outline-variant/20 hover:border-primary/30 bg-surface-container-lowest/5'}`}>
          {!localRagContext ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4 text-on-surface-variant/40 outline outline-1 outline-outline-variant/10">
                <BrainCircuit size={28} />
              </div>
              <h4 className="font-headline font-bold mb-1">Inject Local RAG Context</h4>
              <p className="text-[10px] text-on-surface-variant mb-6 uppercase tracking-widest">Feed proprietary business rules to Aether</p>
              <label className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-[10px] cursor-pointer hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 uppercase tracking-widest">
                Upload Policy (.txt)
                <input type="file" className="hidden" accept=".txt,.md,.json" onChange={handleRagUpload} />
              </label>
            </div>
          ) : (
            <div className="w-full flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-secondary">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Active Neural Constraint Active</span>
                </div>
                <button onClick={clearRagContext} className="p-2 rounded-lg bg-surface-container hover:bg-error/10 text-on-surface-variant hover:text-error transition-all">
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[120px] p-4 bg-surface-container-low rounded-xl text-[11px] font-mono leading-relaxed text-on-surface-variant/80 border border-secondary/10">
                {localRagContext}
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border border-outline-variant/10 flex flex-col justify-center">
          <h4 className="font-headline font-bold text-lg mb-2 flex items-center gap-2">
             <Zap size={18} className="text-secondary" />
             RAG Logic Engine
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
            By uploading proprietary SAP blueprints or company specific pricing policies, you constrain Aether's Neural Engine to your specific landscape. This prevents standard SAP hallucinations and forces compliance with local enterprise standards.
          </p>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-[9px] font-bold text-secondary uppercase tracking-widest">
              Zero-Cloud Leakage
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary uppercase tracking-widest">
              Context-Engine 4.0
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {comparison && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-on-surface leading-relaxed relative"
          >
            <div className="font-bold text-primary mb-2 uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} />
              Neural Diff Report
            </div>
            {comparison}
            <button onClick={() => setComparison(null)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {archives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archives.map((archive, i) => (
            <motion.div
              key={archive.id}
              onClick={() => toggleSelect(archive.id)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel p-6 rounded-3xl border transition-all group flex flex-col shadow-xl cursor-pointer ${selected.includes(archive.id) ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-outline-variant/10 hover:border-primary/40'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant/10">
                  <Layout size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(archive.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-[9px] font-mono text-primary/60 mt-1 uppercase tracking-widest">Snapshot #{archive.id.toString().slice(-4)}</div>
                </div>
              </div>

              <h3 className="font-headline text-lg font-bold mb-1 truncate">{archive.data.scenario_type}</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 mb-6">
                Neural roadmap with {archive.data.configuration_roadmap?.length || 0} technical nodes and validated T-Codes.
              </p>

              <div className="mt-auto pt-6 border-t border-outline-variant/5 flex items-center justify-between">
                <button 
                  onClick={() => handleRestore(archive.data)}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors group/btn"
                >
                  Restore Memory
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button className="text-on-surface-variant hover:text-error transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20">
          <Archive size={64} className="mb-4" />
          <div className="font-headline text-xl font-bold uppercase tracking-[0.4em]">Memory Empty</div>
          <p className="text-sm mt-2">Generate roadmaps in the architect page to populate archives.</p>
        </div>
      )}

      <footer className="mt-12 p-8 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 text-on-surface-variant/40">
           <Zap size={14} />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Cache v3.0 // Ready</span>
        </div>
      </footer>
    </div>
  );
};

export default ArchivesPage;
