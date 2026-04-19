import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Table, Calendar, CheckCircle, RefreshCw, ExternalLink, Zap } from 'lucide-react';
import { useAppState } from '../context/StateContext';
import { handleGoogleLogin } from '../services/googleServices';

const CloudSyncPage = () => {
  const { isSyncing, googleToken, setGoogleToken } = useAppState();

  const handleAuth = async () => {
    try {
      const token = await handleGoogleLogin();
      setGoogleToken(token);
    } catch (err) {
      console.error("Auth failed:", err);
    }
  };

  const syncLogs = [
    { type: 'Sheets', name: 'SAP Roadmap Ledger', status: 'Success', time: '2 mins ago', id: 'SH-8291' },
    { type: 'Calendar', name: 'Config Slot: Pune Plant', status: 'Success', time: '1 hour ago', id: 'CAL-012' },
    { type: 'Sheets', name: 'Pricing Validation Hub', status: 'Success', time: 'Yesterday', id: 'SH-8285' },
    { type: 'Telemetry', name: 'T-Code Deep Search Cache', status: 'Updating', time: 'Live', id: 'TEL-XX' }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Sync Ledger</h2>
          <p className="text-on-surface-variant text-sm">Orchestrating Google Workspace & SAP Neural Links</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAuth}
            aria-label={googleToken ? 'Neural Link Active' : 'Authorize Google Hub'}
            className={`px-6 py-4 rounded-2xl border flex items-center gap-4 transition-all shadow-2xl ${googleToken ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'}`}
          >
            <RefreshCw className={isSyncing ? 'animate-spin' : ''} size={20} />
            <div>
               <div className="font-headline text-sm font-bold">{googleToken ? 'Neural Link Active' : 'Authorize Aether'}</div>
               <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                 {googleToken ? 'Workspace Connected' : 'Google Auth Required'}
               </div>
            </div>
          </button>
          
          {googleToken && (
            <button 
              onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_GOOGLE_SHEET_ID}`, '_blank')}
              aria-label="Open Project Ledger in Google Sheets"
              className="px-6 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 hover:border-primary/40 text-on-surface-variant hover:text-primary transition-all flex items-center gap-3 shadow-xl"
            >
              <ExternalLink size={18} />
              <div className="text-left">
                <div className="font-headline text-sm font-bold">Open Ledger</div>
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Google Sheets</div>
              </div>
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <SyncCard 
          icon={<Table className="text-[#0f9d58]" size={24} />} 
          title="Google Sheets Tracker" 
          desc="Real-time appending of AI roadmaps to your project spreadsheet." 
          details="VITE_GOOGLE_SHEET_ID Active"
        />
        <SyncCard 
          icon={<Calendar className="text-[#4285f4]" size={24} />} 
          title="Predictive Scheduler" 
          desc="Automated Google Calendar event creation for configuration tasks." 
          details="VITE_GOOGLE_CALENDAR Active"
        />
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Zap size={18} className="text-primary" />
          <h3 className="font-headline text-lg font-bold">Recent Transactions</h3>
        </div>
        <div className="glass-panel rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container/50 border-b border-outline-variant/10">
              <tr>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Type</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Entity Name</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Status</th>
                <th className="p-6 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Timestamp</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {syncLogs.map((log, i) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-surface-container-high/50 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center">
                        {log.type === 'Sheets' ? <Table size={14} className="text-[#0f9d58]" /> : <Calendar size={14} className="text-[#4285f4]" />}
                      </div>
                      <span className="text-xs font-bold text-on-surface">{log.type}</span>
                    </div>
                  </td>
                  <td className="p-6 text-xs text-on-surface-variant">{log.name}</td>
                  <td className="p-6">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${log.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary animate-pulse'}`}>
                      {log.status === 'Success' && <CheckCircle size={10} />}
                      {log.status}
                    </div>
                  </td>
                  <td className="p-6 text-[10px] font-mono text-on-surface-variant">{log.time}</td>
                  <td className="p-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const SyncCard = ({ icon, title, desc, details }) => (
  <div className="glass-panel p-8 rounded-3xl border border-outline-variant/10 flex items-start gap-6 hover:border-primary/30 transition-all group shadow-xl">
    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center outline outline-1 outline-outline-variant/20 shadow-lg group-hover:scale-110 transition-transform shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-headline text-lg font-bold mb-1">{title}</h3>
      <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{desc}</p>
      <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-2">
        <CheckCircle size={12} />
        {details}
      </div>
    </div>
  </div>
);

export default CloudSyncPage;
