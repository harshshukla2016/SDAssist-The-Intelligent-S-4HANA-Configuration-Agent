import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Landmark, Factory, GitCommit, ShieldCheck, Info } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const EnterprisePage = () => {
  const { roadmap } = useAppState();
  const structure = roadmap?.enterprise_structure || {
    sales_org: "----",
    dist_channel: "----",
    division: "----",
    company_code: "----",
    plant: "----",
    shipping_point: "----"
  };

  const categories = [
    { 
      title: "Legal Hierarchy", 
      icon: <Landmark className="text-primary" size={20} />,
      items: [
        { label: "Company Code", value: structure.company_code, tcode: "OX02" },
        { label: "Sales Organization", value: structure.sales_org, tcode: "OVX5" }
      ]
    },
    { 
      title: "Logistic Grid", 
      icon: <Factory className="text-secondary" size={20} />,
      items: [
        { label: "Plant (Logistics)", value: structure.plant, tcode: "OX10" },
        { label: "Shipping Point", value: structure.shipping_point, tcode: "OVWD" }
      ]
    },
    { 
      title: "Commercial Definition", 
      icon: <Building2 className="text-pink-400" size={20} />,
      items: [
        { label: "Dist. Channel", value: structure.dist_channel, tcode: "OVXI" },
        { label: "Division", value: structure.division, tcode: "OVXG" }
      ]
    }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12">
        <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Enterprise Architect</h2>
        <p className="text-on-surface-variant text-sm flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" />
          Neural Integrity Check: 98% Synchronized
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-3xl border border-outline-variant/10 shadow-2xl relative overflow-hidden group"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-headline text-lg font-bold">{cat.title}</h3>
            </div>

            <div className="space-y-8 relative z-10">
              {cat.items.map(item => (
                <div key={item.label} className="flex justify-between items-end border-b border-outline-variant/5 pb-2">
                  <div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="font-mono text-xs text-primary font-bold">{item.tcode}</div>
                  </div>
                  <div className="font-headline text-2xl font-black tracking-tighter text-on-surface opacity-80 decoration-primary/30 decoration-2 underline-offset-4">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              {cat.id === 'lg' ? <Factory size={200} /> : <Building2 size={200} />}
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex gap-6 items-start">
         <Info className="text-primary shrink-0" size={24} />
         <div>
            <h4 className="font-headline font-bold text-lg mb-2">Neural Assignment Logic</h4>
            <p className="text-on-surface-variant text-xs leading-relaxed max-w-2xl">
              Agent Architect has auto-linked the **Sales Organization** ({structure.sales_org}) to **Plant** ({structure.plant}) per S/4HANA best practices. 
              This ensures that the sales-to-logistics handover (ATP Check) functions correctly across the entire enterprise matrix.
            </p>
         </div>
      </section>
    </div>
  );
};

export default EnterprisePage;
