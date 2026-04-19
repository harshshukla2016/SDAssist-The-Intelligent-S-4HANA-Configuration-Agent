import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Rocket, Building2, Cloud, Archive, 
  HelpCircle, Terminal, Settings2, Calculator, 
  Layout, Zap, Package, Landmark, Eye, 
  Database, Book, Network
} from 'lucide-react';
import { useAppState } from '../context/StateContext';
import AetherLogo from './AetherLogo';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { activePage, setActivePage } = useAppState();

  const handleNav = (id) => {
    setActivePage(id);
    onClose();
  };

  const DrawerItem = ({ id, icon, label, active = false }) => (
    <button
      onClick={() => handleNav(id)}
      className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
        active 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg' 
          : 'text-on-surface-variant hover:bg-surface-container-high'
      }`}
    >
      <div className={`${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className="font-headline text-sm font-bold">{label}</span>
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-background border-r border-outline-variant/10 z-[101] shadow-2xl flex flex-col pt-20"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-surface-container-high text-on-surface-variant"
            >
              <X size={20} />
            </button>

            <div className="px-10 mb-8 flex items-center gap-4">
              <AetherLogo size={32} />
              <div>
                <div className="font-headline text-lg font-bold text-primary">Aether OS</div>
                <div className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">Neural v3.0</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-8 pb-10">
              <div className="space-y-2">
                <div className="px-4 mb-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Architectural Core</div>
                <DrawerItem id="dashboard" icon={<Rocket size={18} />} label="Neural Architect" active={activePage === 'dashboard'} />
                <DrawerItem id="tcodes" icon={<Book size={18} />} label="T-Code Library" active={activePage === 'tcodes'} />
                <DrawerItem id="master" icon={<Database size={18} />} label="Master Data Dossier" active={activePage === 'master'} />
                <DrawerItem id="enterprise" icon={<Building2 size={18} />} label="Enterprise Structure" active={activePage === 'enterprise'} />
                <DrawerItem id="topology" icon={<Layout size={18} />} label="Topology Matrix" active={activePage === 'topology'} />
                <DrawerItem id="pricing" icon={<Calculator size={18} />} label="Pricing Lab" active={activePage === 'pricing'} />
              </div>

              <div className="space-y-2">
                <div className="px-4 mb-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Execution Pipeline</div>
                <DrawerItem id="workflow" icon={<Network size={18} />} label="Neural Pipeline" active={activePage === 'workflow'} />
                <DrawerItem id="o2c" icon={<Zap size={18} />} label="O2C Flow" active={activePage === 'o2c'} />
                <DrawerItem id="mm" icon={<Package size={18} />} label="Materials (MM)" active={activePage === 'mm'} />
                <DrawerItem id="fico" icon={<Landmark size={18} />} label="Finance (FICO)" active={activePage === 'fico'} />
                <DrawerItem id="vision" icon={<Eye size={18} />} label="Vision Lab" active={activePage === 'vision'} />
                <DrawerItem id="agents" icon={<Settings2 size={18} />} label="Agent Mission Control" active={activePage === 'agents'} />
                <DrawerItem id="sync" icon={<Cloud size={18} />} label="Cloud Ledger" active={activePage === 'sync'} />
                <DrawerItem id="archives" icon={<Archive size={18} />} label="Memory Bank" active={activePage === 'archives'} />
              </div>

              <div className="pt-6 border-t border-outline-variant/10 space-y-2">
                <DrawerItem id="support" icon={<HelpCircle size={18} />} label="Neural Support" active={activePage === 'support'} />
                <DrawerItem id="safety" icon={<Terminal size={18} />} label="Overseer Console" active={activePage === 'safety'} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
