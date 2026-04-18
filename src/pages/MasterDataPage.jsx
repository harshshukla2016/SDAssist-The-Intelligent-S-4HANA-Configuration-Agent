import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Globe, Landmark, ShoppingBag, CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const MasterDataPage = () => {
  const { roadmap } = useAppState();
  const [activeTab, setActiveTab] = useState('customer');
  const [view, setView] = useState('general');

  const defaultMaster = {
    customer_views: {
      general: ["Name: Harsh Enterprises", "Addr: Pune, IN", "Lang: EN"],
      company_code: ["Recon AC: 140000", "Payment: Net 30", "Tax: LI"],
      sales_area: ["Ship Cond: 01 (Standard)", "Currency: INR", "Partner: Sold-to"]
    },
    material_views: {
      basic: ["ID: MAT_PREMIUM", "Base Unit: EA", "Weight: 1.2kg"],
      purchasing: ["Purch Group: 001", "Val Class: 3000", "Batch: Yes"],
      sales: ["Sales Unit: EA", "Tax Class: 1", "Plant: DE01"]
    }
  };

  const data = roadmap?.master_data || defaultMaster;
  const currentData = activeTab === 'customer' ? data.customer_views : data.material_views;

  const views = activeTab === 'customer' 
    ? ['general', 'company_code', 'sales_area'] 
    : ['basic', 'purchasing', 'sales'];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2 opacity-60">
          <Database size={14} className="text-primary" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Neural Master Data Architect</span>
        </div>
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Master Data Dossier</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl">Enterprise-grade foundation for SD, MM, and FICO modules. Manage multi-tier views for high-precision transactions.</p>
      </header>

      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => { setActiveTab('customer'); setView('general'); }}
          className={`px-8 py-3 rounded-2xl font-headline font-bold flex items-center gap-3 transition-all ${activeTab === 'customer' ? 'bg-primary text-on-primary shadow-xl shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
        >
          <User size={18} /> Customer Master
        </button>
        <button 
          onClick={() => { setActiveTab('material'); setView('basic'); }}
          className={`px-8 py-3 rounded-2xl font-headline font-bold flex items-center gap-3 transition-all ${activeTab === 'material' ? 'bg-secondary text-on-secondary shadow-xl shadow-secondary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
        >
          <Package size={18} /> Material Master
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="flex flex-col gap-4">
           {views.map((v) => (
             <button
               key={v}
               onClick={() => setView(v)}
               className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${view === v ? 'border-primary/40 bg-primary/5 shadow-lg' : 'border-outline-variant/10 bg-surface-container-low grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
             >
                <div className="text-[10px] uppercase font-bold text-on-surface-variant/40 mb-2 tracking-widest group-hover:text-primary/60 transition-colors">Tier Integration</div>
                <div className="font-headline font-bold capitalize">{v.replace('_', ' ')}</div>
                {view === v && <motion.div layoutId="md-active" className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(104,211,255,0.8)]" />}
             </button>
           ))}

           <div className="mt-8 p-6 rounded-3xl bg-surface-container-high/50 border border-outline-variant/10">
              <div className="flex items-center gap-2 text-primary mb-3">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Global Integrity</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Data is locked at the client level. Changes propagate across all {activeTab === 'customer' ? 'Sales Orgs' : 'Plants'} automatically.
              </p>
           </div>
        </aside>

        <section className="lg:col-span-3">
           <AnimatePresence mode="wait">
             <motion.div
               key={`${activeTab}-${view}`}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="glass-panel p-10 rounded-[3rem] border border-outline-variant/10 shadow-2xl bg-surface-container-low/30 min-h-[500px]"
             >
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${activeTab === 'customer' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        {view === 'general' || view === 'basic' ? <Globe size={28} /> : 
                         view === 'company_code' || view === 'purchasing' ? <Landmark size={28} /> : 
                         <ShoppingBag size={28} />}
                      </div>
                      <div>
                        <h3 className="font-headline text-2xl font-bold capitalize">{view.replace('_', ' ')} Details</h3>
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">S/4HANA Master View • Neural Validated</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-1.5 rounded-full border border-green-400/20 text-[10px] font-bold uppercase tracking-widest">
                     <CheckCircle2 size={12} /> Sync Active
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {currentData[view]?.map((field, i) => (
                     <motion.div 
                       key={field}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col gap-2"
                     >
                        <div className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest">Technical Field</div>
                        <div className="text-lg font-headline font-bold text-on-surface">{field.split(':')[0]}</div>
                        <div className="text-sm text-primary font-medium">{field.split(':')[1] || 'Neural Generated'}</div>
                     </motion.div>
                   ))}
                </div>

                <div className="mt-12 pt-8 border-t border-outline-variant/10 flex items-center justify-between opacity-40">
                   <div className="text-[10px] font-mono tracking-tighter">TIMESTAMP: {new Date().toISOString()}</div>
                   <div className="text-[10px] font-mono tracking-tighter">DATASET_ID: MD_{activeTab.toUpperCase()}_{view.toUpperCase()}</div>
                </div>
             </motion.div>
           </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default MasterDataPage;
