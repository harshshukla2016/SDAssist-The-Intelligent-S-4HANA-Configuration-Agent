import React, { useState, useMemo } from 'react';
import { Book, Search, Filter, Database, Box, Landmark, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TCODE_DATABASE = [
  // SD - Master Data
  { tcode: 'XD01', module: 'SD', subCategory: 'Master Data', description: 'Create Customer (Centrally)' },
  { tcode: 'XD02', module: 'SD', subCategory: 'Master Data', description: 'Change Customer (Centrally)' },
  { tcode: 'XD03', module: 'SD', subCategory: 'Master Data', description: 'Display Customer (Centrally)' },
  { tcode: 'VD01', module: 'SD', subCategory: 'Master Data', description: 'Create Customer (Sales)' },
  { tcode: 'MM01', module: 'SD', subCategory: 'Master Data', description: 'Create Material' },
  { tcode: 'VK11', module: 'SD', subCategory: 'Master Data', description: 'Create Condition Record' },
  
  // SD - Sales
  { tcode: 'VA01', module: 'SD', subCategory: 'Sales', description: 'Create Sales Order' },
  { tcode: 'VA02', module: 'SD', subCategory: 'Sales', description: 'Change Sales Order' },
  { tcode: 'VA03', module: 'SD', subCategory: 'Sales', description: 'Display Sales Order' },
  { tcode: 'VA11', module: 'SD', subCategory: 'Sales', description: 'Create Inquiry' },
  { tcode: 'VA21', module: 'SD', subCategory: 'Sales', description: 'Create Quotation' },
  
  // SD - Shipping/Billing
  { tcode: 'VL01N', module: 'SD', subCategory: 'Shipping', description: 'Create Outbound Delivery' },
  { tcode: 'VL02N', module: 'SD', subCategory: 'Shipping', description: 'Change Outbound Delivery' },
  { tcode: 'VL03N', module: 'SD', subCategory: 'Shipping', description: 'Display Outbound Delivery' },
  { tcode: 'VF01', module: 'SD', subCategory: 'Billing', description: 'Create Billing Document' },
  { tcode: 'VF04', module: 'SD', subCategory: 'Billing', description: 'Maintain Billing Due List' },
  
  // MM - Purchasing
  { tcode: 'ME21N', module: 'MM', subCategory: 'Purchasing', description: 'Create Purchase Order' },
  { tcode: 'ME22N', module: 'MM', subCategory: 'Purchasing', description: 'Change Purchase Order' },
  { tcode: 'ME23N', module: 'MM', subCategory: 'Purchasing', description: 'Display Purchase Order' },
  { tcode: 'ME11', module: 'MM', subCategory: 'Purchasing', description: 'Create Purchasing Info Record' },
  
  // MM - Inventory
  { tcode: 'MIGO', module: 'MM', subCategory: 'Inventory', description: 'Goods Movement' },
  { tcode: 'MIRO', module: 'MM', subCategory: 'Invoice VER', description: 'Enter Incoming Invoice' },
  { tcode: 'MMBE', module: 'MM', subCategory: 'Inventory', description: 'Stock Overview' },
  
  // FICO - General Ledger
  { tcode: 'FB50', module: 'FICO', subCategory: 'General Ledger', description: 'Post G/L Account Document' },
  { tcode: 'FS00', module: 'FICO', subCategory: 'General Ledger', description: 'G/L Account Master Data' },
  { tcode: 'FBL3N', module: 'FICO', subCategory: 'General Ledger', description: 'G/L Account Line Items' },

  // FICO - AP/AR
  { tcode: 'FB60', module: 'FICO', subCategory: 'Accounts Payable', description: 'Enter Vendor Invoice' },
  { tcode: 'FB70', module: 'FICO', subCategory: 'Accounts Receivable', description: 'Enter Customer Invoice' },
  { tcode: 'FBL1N', module: 'FICO', subCategory: 'Accounts Payable', description: 'Vendor Line Items' },
  { tcode: 'FBL5N', module: 'FICO', subCategory: 'Accounts Receivable', description: 'Customer Line Items' },

  // Basis / System
  { tcode: 'SPRO', module: 'Basis', subCategory: 'Configuration', description: 'Customizing: Execute Project' },
  { tcode: 'SM30', module: 'Basis', subCategory: 'System', description: 'Maintain Table Views' },
  { tcode: 'SU01', module: 'Basis', subCategory: 'Security', description: 'User Maintenance' },
  { tcode: 'ST22', module: 'Basis', subCategory: 'System', description: 'ABAP Runtime Errors' },
  { tcode: 'SE16N', module: 'Basis', subCategory: 'System', description: 'General Table Display' },
  { tcode: 'SE80', module: 'Basis', subCategory: 'Development', description: 'Object Navigator' }
];

const MODULE_FILTERS = ['All', 'SD', 'MM', 'FICO', 'Basis'];

const TCodeLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModule, setActiveModule] = useState('All');

  const filteredData = useMemo(() => {
    return TCODE_DATABASE.filter(item => {
      const matchesSearch = item.tcode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = activeModule === 'All' || item.module === activeModule;
      return matchesSearch && matchesModule;
    });
  }, [searchTerm, activeModule]);

  return (
    <div className="p-8 h-full flex flex-col font-body">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2 opacity-60">
            <Book size={14} className="text-primary" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Universal Directory v4.0</span>
          </div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">T-Code Library</h2>
          <p className="text-on-surface-variant text-sm max-w-2xl">
            A comprehensive, modular dictionary grouping all critical SAP S/4HANA Transaction Codes for accelerated deployment.
          </p>
        </div>
        <div className="flex bg-surface-container-high rounded-xl p-1 border border-outline-variant/10 shadow-lg w-full md:w-auto">
           {MODULE_FILTERS.map(mod => (
             <button
               key={mod}
               onClick={() => setActiveModule(mod)}
               aria-label={`Filter by ${mod === 'All' ? 'all modules' : mod + ' module'}`}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeModule === mod ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
             >
               {mod}
             </button>
           ))}
        </div>
      </header>

      <div className="relative mb-8 group shrink-0">
        <input 
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Search Transaction Codes"
          placeholder="Search by T-Code, Description, or Sub-Category... (e.g. 'Sales', 'VA01')"
          className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-on-surface-variant/40 shadow-inner group-focus-within:bg-surface-container-lowest"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={20} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
          <AnimatePresence>
            {filteredData.map((code) => (
              <motion.div
                layout
                key={code.tcode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="glass-panel p-5 rounded-2xl border border-outline-variant/10 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(104,211,255,0.1)] transition-all flex flex-col group cursor-default"
              >
                <div className="flex items-center justify-between mb-3 border-b border-outline-variant/5 pb-3">
                  <div className="flex items-center gap-3">
                    <ModuleIcon module={code.module} />
                    <span className="font-headline text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{code.tcode}</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant uppercase tracking-widest border border-outline-variant/10">
                    {code.subCategory}
                  </span>
                </div>
                <div className="text-sm text-on-surface-variant/90 leading-relaxed font-body">
                  {code.description}
                </div>
              </motion.div>
            ))}
            {filteredData.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full h-40 flex flex-col items-center justify-center text-on-surface-variant/40"
              >
                <Filter size={40} className="mb-4 opacity-50" />
                <p className="text-sm font-bold uppercase tracking-widest">No Transation Codes Match Criteria</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ModuleIcon = ({ module }) => {
  switch(module) {
    case 'SD': return <Database className="text-secondary" size={16} />;
    case 'MM': return <Box className="text-orange-400" size={16} />;
    case 'FICO': return <Landmark className="text-green-400" size={16} />;
    case 'Basis': return <Server className="text-primary" size={16} />;
    default: return <Book className="text-on-surface-variant" size={16} />;
  }
}

export default TCodeLibrary;
