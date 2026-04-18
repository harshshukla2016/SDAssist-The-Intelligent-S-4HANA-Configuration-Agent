import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Brain, ShieldAlert, Activity, Cpu, Zap } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const AgentsPage = () => {
  const { isProcessing } = useAppState();

  const agents = [
    {
      id: 'architect',
      name: 'SAP Architect',
      model: 'Groq Llama 3.3 70B',
      status: isProcessing ? 'Processing' : 'Standby',
      desc: 'Expert in S/4HANA Sales & Distribution (SD) logic and Case-Based Reasoning.',
      icon: <Rocket className="text-primary" size={24} />,
      color: 'primary'
    },
    {
      id: 'integrator',
      name: 'Google Integrator',
      model: 'Workspace v4 Engine',
      status: 'Synced',
      desc: 'Orchestrates Google Sheets (Tracker) and Google Calendar (Scheduler) links.',
      icon: <Brain className="text-secondary" size={24} />,
      color: 'secondary'
    },
    {
      id: 'overseer',
      name: 'Aether Overseer',
      model: 'Internal Neural Audit',
      status: 'Active',
      desc: 'Continuously monitors for security vulnerabilities and neural loop repetitions.',
      icon: <ShieldAlert className="text-orange-400" size={24} />,
      color: 'orange-400'
    }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12">
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Neural Unit Control</h2>
        <p className="text-on-surface-variant text-sm flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          Active agents synchronized at neural epoch 2.5
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center outline outline-1 outline-outline-variant/20 shadow-xl group-hover:scale-110 transition-transform">
                {agent.icon}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${agent.status === 'Standby' ? 'bg-surface-container text-on-surface-variant border-outline-variant/20' : 'bg-primary/10 text-primary border-primary/20 animate-pulse'}`}>
                {agent.status}
              </div>
            </div>

            <h3 className="font-headline text-xl font-bold mb-1">{agent.name}</h3>
            <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-4">{agent.model}</div>
            
            <p className="text-xs text-on-surface-variant leading-relaxed mb-8 h-12">
              {agent.desc}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>Latency</span>
                <span className="text-primary">42ms</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: agent.status === 'Standby' ? '2%' : '85%' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-12 p-8 rounded-3xl bg-surface-container-low border border-outline-variant/10">
        <div className="flex items-center gap-4 mb-8">
          <Cpu className="text-primary" size={24} />
          <h3 className="font-headline text-lg font-bold">Neural Engine Health</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Metric label="Uptime" value="99.98%" />
          <Metric label="Roadmaps Scaled" value="1.2k" />
          <Metric label="Security Score" value="A+" />
          <Metric label="Memory Usage" value="268KB" />
        </div>
      </section>
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div className="p-4 rounded-2xl bg-surface-container-high border border-outline-variant/10 text-center">
    <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">{label}</div>
    <div className="font-headline text-2xl font-bold text-primary">{value}</div>
  </div>
);

export default AgentsPage;
