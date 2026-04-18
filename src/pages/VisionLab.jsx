import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Upload, FileSearch, AlertCircle, CheckCircle2, RefreshCw, Cpu, Zap } from 'lucide-react';
import { analyzeScreenshot } from '../services/sapLogic';

const VisionLab = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [context, setContext] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setAnalysis(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    try {
      const result = await analyzeScreenshot(file.name, context);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("Neural Vision Link Interrupted.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2 opacity-60">
          <Eye size={14} className="text-primary" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Vision Neural Suite</span>
        </div>
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Screenshot Analysis Lab</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl">Neural-powered glitch detection for SAP GUI screens. Analyze screenshots to identify configuration mismatches.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <section className="flex flex-col gap-6">
          <div className={`relative rounded-[2.5rem] border-2 border-dashed transition-all p-10 flex flex-col items-center justify-center min-h-[400px] overflow-hidden ${preview ? 'border-primary/40 bg-surface-container-low' : 'border-outline-variant/20 hover:border-primary/30 bg-surface-container-lowest/5'}`}>
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={preview} alt="SAP Screenshot" className="max-w-full max-h-[350px] rounded-2xl shadow-2xl object-contain" />
                {isScanning && (
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary/60 shadow-[0_0_15px_rgba(104,211,255,1)] z-20"
                  />
                )}
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6 text-on-surface-variant/40">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <h4 className="font-headline font-bold mb-1">Drop SAP Screenshot</h4>
                  <p className="text-xs text-on-surface-variant mb-6">PNG or JPG exported from SAP GUI / S/4 Fiori</p>
                  <label className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer hover:bg-primary-dim transition-all">
                    Browse Files
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </>
            )}
            
            {preview && !isScanning && (
              <button 
                onClick={() => { setPreview(null); setFile(null); setAnalysis(null); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-surface-container-high hover:bg-error/20 hover:text-error transition-all"
              >
                <RefreshCw size={16} />
              </button>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-outline-variant/10">
             <label className="text-[10px] uppercase font-bold text-on-surface-variant/60 block mb-3 ml-2">Contextual Intelligence (Optional)</label>
             <textarea 
               value={context}
               onChange={(e) => setContext(e.target.value)}
               placeholder="Example: I'm getting a pricing error in VA01 for this customer..."
               className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all min-h-[100px] resize-none"
             />
          </div>

          <button 
            disabled={!file || isScanning}
            onClick={handleScan}
            className={`w-full py-5 rounded-3xl font-headline font-bold flex items-center justify-center gap-3 transition-all ${file && !isScanning ? 'bg-primary text-on-primary shadow-xl shadow-primary/20 hover:scale-[0.99]' : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'}`}
          >
            {isScanning ? <Loader className="animate-spin" /> : <FileSearch size={20} />}
            {isScanning ? 'Neural Scanning...' : 'Run Neural Vision Audit'}
          </button>
        </section>

        <section className="flex flex-col gap-8">
           <AnimatePresence mode="wait">
             {analysis ? (
               <motion.div 
                 key="analysis-result"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex flex-col gap-6"
               >
                 <div className="glass-panel p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Cpu className="text-primary" size={24} />
                        <h3 className="font-headline text-xl font-bold">Neural Findings</h3>
                      </div>
                      <div className="text-[10px] font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 uppercase tracking-widest">
                        Confidence: {(analysis.confidence * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-8">
                       {analysis.glitches?.map((glitch, i) => (
                         <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-high border border-outline-variant/10">
                            <AlertCircle className="text-orange-400 shrink-0 mt-0.5" size={16} />
                            <div className="text-xs font-medium text-on-surface">{glitch}</div>
                         </div>
                       ))}
                       {analysis.glitches?.length === 0 && (
                         <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                           <CheckCircle2 size={16} />
                           <span className="text-xs font-bold uppercase tracking-widest">Zero Glitches Detected</span>
                         </div>
                       )}
                    </div>

                    <div className="p-6 rounded-[2rem] bg-surface-container-highest border border-outline-variant/20 shadow-inner">
                       <div className="text-[9px] uppercase font-bold text-primary mb-3 flex items-center gap-2">
                         <Zap size={14} />
                         Suggested Technical Fix
                       </div>
                       <p className="text-sm italic text-on-surface/90 leading-relaxed font-body">
                         "{analysis.suggested_fix}"
                       </p>
                    </div>
                 </div>

                 <div className="glass-panel p-8 rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                        <RefreshCw size={24} />
                      </div>
                      <div>
                        <div className="font-headline font-bold">Self-Correction Pulse</div>
                        <div className="text-xs text-on-surface-variant">Engage Overseer to fix detected mismatches automatically.</div>
                      </div>
                    </div>
                    <ArrowUpRight className="text-on-surface-variant group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
                 </div>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                  <Eye size={120} strokeWidth={0.5} />
                  <div className="text-sm font-headline uppercase tracking-[0.5em] mt-6 italic text-center">Neural Vision Standby<br/>Waiting for Feed</div>
               </div>
             )}
           </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

const Loader = ({ className }) => <RefreshCw className={className} size={20} />;
const ArrowUpRight = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default VisionLab;
