import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Building2, 
  RefreshCw, 
  Zap, 
  MoreVertical,
  Rocket,
  Search,
  ZoomIn,
  Sliders,
  Table,
  Network,
  Layout
} from 'lucide-react';
import { useAppState } from '../context/StateContext';
import { generateRoadmap } from '../services/sapLogic';
import { syncToSheets } from '../services/googleSheets';
import { Mic, MicOff, FileText } from 'lucide-react';
import { generateFSD } from '../services/googleDocs';

// Feature Components
import TCodeSearch from './TCodeSearch';
import CalendarPrompt from './CalendarPrompt';
import PricingHealth from './PricingHealth';
import FsdViewer from './FsdViewer';

const Dashboard = () => {
  const { 
    messages, setMessages, 
    roadmap, setRoadmap, 
    isProcessing, setIsProcessing, 
    isSyncing, setIsSyncing,
    saveToArchives,
    activePage, setActivePage,
    projectMeta, neuralConfig, googleToken
  } = useAppState();
  
  const [inputValue, setInputValue] = useState('');
  const [showCalendarPrompt, setShowCalendarPrompt] = useState(false);
  const [showFsdViewer, setShowFsdViewer] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Neural Voice Controller (Web Speech API)
  const startVoiceControl = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Neural Voice is not supported in this browser sector.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.start();
  };

  // Auto-sync to Sheets + Auto-Archive when roadmap is generated
  useEffect(() => {
    if (roadmap && !isProcessing && googleToken) {
      const performSync = async () => {
        setIsSyncing(true);
        try {
          await syncToSheets(roadmap, googleToken);
          saveToArchives(roadmap);
          setTimeout(() => setShowCalendarPrompt(true), 1500);
        } catch (err) {
          console.error("Sync failed", err);
        } finally {
          setIsSyncing(false);
        }
      };
      performSync();
    } else if (roadmap && !isProcessing && !googleToken) {
       // Just archive if no token
       saveToArchives(roadmap);
    }
  }, [roadmap, googleToken, isProcessing]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    setShowCalendarPrompt(false);

    try {
      const result = await generateRoadmap(inputValue, projectMeta, neuralConfig);
      setRoadmap(result);
      setMessages(prev => [...prev, { role: 'assistant', content: `Neural roadmap generated for "${result.scenario_type}" scenario. Technical validation complete.` }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Neural link interrupted. Fallback logic engaged.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {showCalendarPrompt && roadmap && (
        <CalendarPrompt roadmap={roadmap} googleToken={googleToken} onComplete={() => setShowCalendarPrompt(false)} />
      )}
      {showFsdViewer && roadmap && (
        <FsdViewer roadmap={roadmap} onClose={() => setShowFsdViewer(false)} />
      )}
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat */}
        <section className="w-full md:w-[320px] lg:w-[360px] shrink-0 border-r border-outline-variant/10 flex flex-col bg-surface-container-low/30 backdrop-blur-sm z-30">
          <header className="p-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-surface-container-highest outline outline-1 outline-outline-variant/20 relative shrink-0">
                <Brain className="text-primary" size={24} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-container rounded-full animate-pulse border-2 border-surface-container-low"></div>
              </div>
              <div>
                <h2 className="font-headline text-base font-semibold tracking-tight text-on-surface">Aether Agent</h2>
                <span className="font-body text-[10px] text-on-surface-variant flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/80 inline-block"></span>
                  Link: Llama 3.3 Active
                </span>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-primary transition-colors shrink-0">
              <MoreVertical size={16} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 w-full ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center border shrink-0 mt-1 ${msg.role === 'user' ? 'bg-surface-container-high border-outline-variant/30' : 'bg-primary/10 border-primary/20'}`}>
                  {msg.role === 'user' ? <Layout className="text-on-surface-variant" size={12} /> : <Rocket className="text-primary" size={12} />}
                </div>
                <div className={`p-4 outline outline-1 leading-relaxed text-sm w-full ${msg.role === 'user' ? 'bg-surface-container-high rounded-l-xl rounded-br-xl outline-outline-variant/10 shadow-lg' : 'bg-surface-container rounded-r-xl rounded-bl-xl outline-outline-variant/15 text-on-surface/90 shadow-xl'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-start gap-3 max-w-[90%] animate-pulse">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 mt-1">
                  <Rocket className="text-primary animate-spin" size={12} />
                </div>
                <div className="bg-surface-container rounded-r-xl rounded-bl-xl p-4 px-5 outline outline-1 outline-outline-variant/15 flex items-center gap-1.5 h-[52px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 md:p-6 pt-2">
            <div className="relative group">
              <input 
                id="aether-input"
                aria-label="Neural Requirement Input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Agent Aether..."
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl py-4 pl-12 pr-20 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-on-surface-variant/40"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button 
                  id="voice-command-btn"
                  aria-label="Activate Neural Voice"
                  type="button"
                  onClick={startVoiceControl}
                  className={`p-2 rounded-lg transition-all ${isListening ? 'bg-primary/20 text-primary animate-pulse' : 'text-on-surface-variant/40 hover:text-primary'}`}
                >
                  {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button
                  type="submit"
                  aria-label="Send Requirement"
                  disabled={!inputValue.trim() || isProcessing}
                  className="p-2 rounded-lg bg-primary text-on-primary hover:bg-primary-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed group-focus-within:shadow-[0_0_15px_rgba(104,211,255,0.4)]"
                >
                  <Rocket size={16} />
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Right Panel: Visualization */}
        <section className="flex-1 p-6 lg:p-8 overflow-y-auto flex flex-col gap-6 lg:gap-10 bg-[#0d0e0f]/20">
          <header className="flex flex-col md:flex-row md:justify-between md:items-end z-10 gap-4">
            <div>
              <div className="font-body text-xs text-secondary tracking-widest uppercase mb-2 flex items-center gap-2">
                <Zap size={14} />
                S/4HANA Configuration v3.0
              </div>
              <h1 className="font-headline text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-on-surface">Neural Architect</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:items-end">
              <div className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${roadmap?.status === 'validated' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                {roadmap?.status === 'validated' ? 'Live Neural API' : 'Neural Standby'}
              </div>
              <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-3 border border-outline-variant/20 shadow-2xl">
                <div className="w-5 h-5 rounded-sm bg-surface-container-highest flex items-center justify-center shrink-0">
                  <Table className="text-green-400" size={14} />
                </div>
                <span className="font-body text-[10px] sm:text-xs text-on-surface font-medium hidden sm:inline-block">Sheets Link</span>
                <RefreshCw className={`text-primary shrink-0 ${isSyncing ? 'animate-spin' : ''}`} size={14} />
              </div>

              {roadmap && (
                <button 
                  id="fsd-generate-btn"
                  aria-label="View Functional Specification Document"
                  onClick={() => setShowFsdViewer(true)}
                  className="glass-panel rounded-full px-4 py-2 flex items-center gap-3 border border-primary/20 shadow-2xl hover:bg-primary/5 transition-all"
                >
                  <FileText className="text-primary shrink-0" size={14} />
                  <span className="font-body text-[10px] sm:text-xs text-on-surface font-medium hidden sm:inline-block">View FSD (.txt)</span>
                </button>
              )}
            </div>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 min-h-[500px]">
            {/* Topology Map Preview */}
            <div className="flex-1 bg-surface-container-lowest/50 rounded-[2rem] border border-outline-variant/10 relative p-6 lg:p-8 flex flex-col z-10 shadow-inset">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(93,3,202,0.05)_0%,transparent_70%)] rounded-[2rem] pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-headline text-lg text-on-surface font-bold tracking-tight">
                  {roadmap?.scenario_type ? `${roadmap.scenario_type} Matrix` : 'Neural Blueprint'}
                </h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/10 hover:border-primary/40 transition-all"><ZoomIn size={14} /></button>
                  <button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/10 hover:border-primary/40 transition-all"><Sliders size={14} /></button>
                </div>
              </div>

              <div className="flex-1 relative flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden custom-scrollbar w-full pt-4 pb-12">
                {Array.isArray(roadmap?.configuration_roadmap) && roadmap.configuration_roadmap.length > 0 ? (
                  <div className="flex flex-col gap-6 z-20 w-full max-w-2xl px-2 lg:px-6 relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[34px] lg:left-[49px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-secondary/20 to-transparent hidden md:block"></div>
                    
                    {roadmap.configuration_roadmap.map((node, i) => (
                      <NodeCard 
                        key={`${roadmap.scenario_type}-${i}`} 
                        label={node.step} 
                        tcode={node.tcode} 
                        sub={node.description} 
                        icon={i % 2 === 0 ? <Building2 size={16} /> : <Network size={16} />} 
                        active={i === 0} 
                        index={i + 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 opacity-20 h-full w-full">
                    <Network size={64} className="text-on-surface-variant" />
                    <div className="text-sm font-headline uppercase tracking-[0.3em]">Ready for Requirement</div>
                  </div>
                )}
              </div>
            </div>

            {/* Side Tools (Pricing Health) */}
            {roadmap && (
              <div className="w-full xl:w-[320px] shrink-0">
                <PricingHealth roadmap={roadmap} />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const NodeCard = ({ label, tcode, sub, icon, active = false, index }) => (
  <div className={`glass-panel p-4 md:p-6 rounded-2xl border transition-all duration-500 group cursor-pointer relative md:ml-[34px] flex flex-col sm:flex-row gap-4 md:gap-6 ${active ? 'border-primary/40 shadow-[0_0_30px_rgba(104,211,255,0.15)] ring-1 ring-primary/20 scale-[1.02] z-10 bg-primary/5' : 'border-outline-variant/10 hover:border-primary/20 hover:shadow-xl'}`}>
    
    {/* Step Number Circle (Timeline) */}
    <div className={`absolute -left-10 md:-left-12 top-6 md:top-1/2 md:-translate-y-1/2 w-7 h-7 rounded-full border-2 hidden md:flex items-center justify-center font-body text-[10px] font-bold z-10 bg-surface ${active ? 'border-primary text-primary shadow-[0_0_15px_rgba(104,211,255,0.4)]' : 'border-outline-variant/30 text-on-surface-variant'}`}>
      {index.toString().padStart(2, '0')}
    </div>

    {/* Icon */}
    <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-primary/20 text-primary pt-1 shadow-inner' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'}`}>
      {icon}
    </div>

    {/* Content */}
    <div className="flex-[3] min-w-0">
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-3 justify-between mb-1 w-full">
        <div className="font-headline text-sm md:text-base font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors break-words min-w-0 flex-1">{label}</div>
        <div className="font-body text-[10px] px-2 py-0.5 rounded border border-primary/20 text-primary/80 font-bold tracking-widest bg-primary/5 shrink-0">{tcode}</div>
      </div>
      <div className="font-body text-[11px] md:text-xs text-on-surface-variant/80 leading-relaxed mb-4 mt-2 max-w-lg break-words">
        {sub}
      </div>
      <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/5">
        <TCodeSearch tcode={tcode} />
      </div>
    </div>
  </div>
);

export default Dashboard;
