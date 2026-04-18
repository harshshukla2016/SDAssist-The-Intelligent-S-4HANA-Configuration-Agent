import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Upload, FileSearch, AlertCircle, CheckCircle2, RefreshCw, Cpu, Zap, Search, Maximize2 } from 'lucide-react';
import { analyzeScreenshot } from '../services/sapLogic';

const VisionLab = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [context, setContext] = useState('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, visible: false });
  const imageRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setAnalysis(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, visible: true });
  };

  const getBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    try {
      const base64Image = await getBase64(file);
      const result = await analyzeScreenshot(file.name, context, base64Image);
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
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Vision Neural Suite v8.1</span>
        </div>
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Neural Audit Lab</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl">High-precision diagnostic engine for SAP screenshots. Detects configuration glitched with spatial heatmap overlays.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <section className="flex flex-col gap-6">
          <div 
            className={`relative rounded-[2.5rem] border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center min-h-[450px] overflow-hidden ${preview ? 'border-primary/40 bg-[#0d0e0f]/40' : 'border-outline-variant/20 hover:border-primary/30 bg-surface-container-lowest/5'}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos(prev => ({ ...prev, visible: false }))}
          >
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center cursor-crosshair">
                <img 
                  ref={imageRef}
                  src={preview} 
                  alt="SAP Screenshot" 
                  className="max-w-full max-h-[400px] rounded-2xl shadow-2xl object-contain z-10" 
                />
                
                {/* Neural Heatmap Overlay */}
                {analysis?.glitches?.map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                    className="absolute w-12 h-12 rounded-full bg-primary/20 border border-primary/40 z-20 pointer-events-none"
                    style={{ left: `${g.x}%`, top: `${g.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-md"></div>
                  </motion.div>
                ))}

                {/* Intelligent Magnifier */}
                {zoomPos.visible && !isScanning && (
                  <div 
                    className="absolute w-32 h-32 rounded-full border-2 border-primary/50 pointer-events-none z-30 overflow-hidden shadow-[0_0_30px_rgba(104,211,255,0.4)] bg-surface-container"
                    style={{ left: `${zoomPos.x}%`, top: `${zoomPos.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <img 
                      src={preview} 
                      alt="Zoom"
                      className="absolute max-w-none w-[400%] h-auto"
                      style={{ 
                        left: `${-zoomPos.x * 4}%`, 
                        top: `${-zoomPos.y * 4}%`,
                        transform: 'translate(12.5%, 12.5%)'
                      }}
                    />
                    <div className="absolute inset-0 border-[10px] border-surface-container/20 rounded-full"></div>
                  </div>
                )}

                {isScanning && (
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary/60 shadow-[0_0_20px_rgba(104,211,255,1)] z-40"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center mb-6 text-on-surface-variant/40 outline outline-1 outline-outline-variant/10">
                  <Upload size={32} />
                </div>
                <h4 className="font-headline font-bold mb-1">Load SAP Screenshot</h4>
                <p className="text-xs text-on-surface-variant mb-6">High-resolution diagnostic mode</p>
                <label className="px-8 py-3.5 rounded-2xl bg-primary text-on-primary font-bold text-xs cursor-pointer hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                  Select Artifact
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-outline-variant/10">
             <div className="flex items-center justify-between mb-4">
               <label className="text-[10px] uppercase font-bold text-on-surface-variant/60 ml-2 tracking-widest">Neural Directives</label>
               <div className="text-[9px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded cursor-default border border-primary/20">Auto-Context Enabled</div>
             </div>
             <textarea 
               value={context}
               onChange={(e) => setContext(e.target.value)}
               placeholder="Describe the issue... (e.g., Pricing mismatch on item 10)"
               className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all min-h-[100px] resize-none font-body text-on-surface/90"
             />
          </div>

          <button 
            disabled={!file || isScanning}
            onClick={handleScan}
            className={`w-full py-5 rounded-3xl font-headline font-bold flex items-center justify-center gap-3 transition-all ${file && !isScanning ? 'bg-primary text-on-primary shadow-2xl shadow-primary/20 hover:scale-[0.99]' : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'}`}
          >
            {isScanning ? <RefreshCw className="animate-spin" /> : <Search size={20} />}
            {isScanning ? 'Diagnostics in Progress...' : 'Initialize Multi-Modal Audit'}
          </button>
        </section>

        <section className="flex flex-col gap-8">
           <AnimatePresence mode="wait">
             {analysis ? (
               <motion.div 
                 key="analysis-result"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col gap-6"
               >
                 <div className="glass-panel p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Maximize2 size={120} /></div>
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Cpu className="text-primary" size={24} />
                        <h3 className="font-headline text-xl font-bold">Audit Synthesis</h3>
                      </div>
                      <div className="text-[10px] font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 uppercase tracking-widest">
                        Neural Confidence: {(analysis.confidence * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-8">
                       <div className="text-[10px] uppercase font-bold text-on-surface-variant/60 ml-2 tracking-widest mb-1">Detected Mismatches</div>
                       {analysis.glitches?.map((glitch, i) => (
                         <motion.div 
                           key={i} 
                           initial={{ x: -10, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: i * 0.1 }}
                           className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant/10 group cursor-default"
                         >
                            <div className="flex items-center gap-3">
                               <AlertCircle className="text-primary" size={16} />
                               <div className="text-xs font-bold text-on-surface">{glitch.label}</div>
                            </div>
                            <div className="text-[9px] font-mono text-on-surface-variant/40">{glitch.x}%, {glitch.y}%</div>
                         </motion.div>
                       ))}
                       {(!analysis.glitches || analysis.glitches.length === 0) && (
                         <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                           <CheckCircle2 size={16} />
                           <span className="text-xs font-bold uppercase tracking-widest">No Technical Glitches Scanned</span>
                         </div>
                       )}
                    </div>

                    <div className="p-6 rounded-[2rem] bg-surface-container-highest border border-outline-variant/20 shadow-inner">
                       <div className="text-[9px] uppercase font-bold text-primary mb-3 flex items-center gap-2">
                         <Zap size={14} />
                         Recommended Resolution
                       </div>
                       <p className="text-sm italic text-on-surface/90 leading-relaxed font-body">
                         "{analysis.suggested_fix}"
                       </p>
                    </div>
                 </div>

                 <div className="glass-panel p-8 rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-all hover:bg-primary/5 active:scale-95">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                        <Maximize2 size={24} />
                      </div>
                      <div>
                        <div className="font-headline font-bold">Inject Roadmap Correction</div>
                        <div className="text-xs text-on-surface-variant">Update primary Neural Architect roadmap with these findings.</div>
                      </div>
                    </div>
                    <ArrowUpRight className="text-on-surface-variant group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
                 </div>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 grayscale brightness-50">
                  <Eye size={120} strokeWidth={0.5} className="animate-pulse" />
                  <div className="text-sm font-headline uppercase tracking-[0.5em] mt-8 italic text-center">Optic Sensor Offline<br/>Awaiting Visual Feed</div>
               </div>
             )}
           </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

const ArrowUpRight = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default VisionLab;
