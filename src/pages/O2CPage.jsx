import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Circle, Clock, FileText, ShoppingCart, Truck, CreditCard, Zap } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const O2CPage = () => {
  const { roadmap } = useAppState();
  const flow = roadmap?.o2c_flow || [
    { doc_type: 'Inquiry', tcode: 'VA11', status: 'completed' },
    { doc_type: 'Quotation', tcode: 'VA21', status: 'pending' },
    { doc_type: 'Sales Order', tcode: 'VA01', status: 'pending' },
    { doc_type: 'Delivery', tcode: 'VL01N', status: 'pending' },
    { doc_type: 'Billing', tcode: 'VF01', status: 'pending' }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'Inquiry': return <FileText size={20} />;
      case 'Quotation': return <Zap size={20} />;
      case 'Sales Order': return <ShoppingCart size={20} />;
      case 'Delivery': return <Truck size={20} />;
      case 'Billing': return <CreditCard size={20} />;
      default: return <Circle size={20} />;
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-12">
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Order-to-Cash (O2C) Flow</h2>
        <p className="text-on-surface-variant text-sm flex items-center gap-2">
          <Clock size={14} className="text-primary" />
          Real-time lifecycle of the Sales Document
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-center gap-12 max-w-5xl mx-auto w-full">
        <div className="relative flex justify-between items-center w-full">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-outline-variant/10 -translate-y-1/2 z-0"></div>
          
          {flow.map((doc, i) => (
            <div key={doc.doc_type} className="relative z-10 flex flex-col items-center gap-6 group">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 transition-all duration-500 ${doc.status === 'completed' ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_rgba(104,211,255,0.3)]' : 'bg-surface-container-high border-outline-variant/50 text-on-surface-variant group-hover:border-primary/40'}`}
              >
                {doc.status === 'completed' ? <CheckCircle2 size={32} /> : getIcon(doc.doc_type)}
              </motion.div>
              
              <div className="text-center">
                <div className={`font-headline text-sm font-bold mb-1 ${doc.status === 'completed' ? 'text-primary' : 'text-on-surface-variant'}`}>{doc.doc_type}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">{doc.tcode}</div>
              </div>

              {i < flow.length - 1 && (
                <div className="absolute top-10 -right-20 text-outline-variant/20 hidden lg:block">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass-panel p-8 rounded-3xl border border-outline-variant/10 shadow-2xl bg-surface-container/30">
              <h4 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                Process Automation
              </h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Agent Architect has enabled **Back-to-Back Automation** for this flow. When a Sales Order is saved, a Delivery document (VL01N) will be auto-staged in the logistics pipeline.
              </p>
           </div>
           <div className="glass-panel p-8 rounded-3xl border border-outline-variant/10 shadow-2xl bg-surface-container/30">
              <h4 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-secondary" />
                Revenue Pipeline
              </h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Billing (VF01) is linked to **Fiori App: Manage Billing Documents**. Revenue recognition occurs upon PGI (Post Goods Issue) in the Delivery phase.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
};

export default O2CPage;
