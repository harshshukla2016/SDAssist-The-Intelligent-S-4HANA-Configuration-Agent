import React from 'react';
import { 
  Rocket, 
  Network, 
  Building2, 
  Cloud, 
  Archive, 
  HelpCircle, 
  Terminal,
  Settings2,
  Calculator,
  Layout,
  Zap,
  Package,
  Landmark,
  Eye
} from 'lucide-react';
import { useAppState } from '../context/StateContext';

const Sidebar = () => {
  const { activePage, setActivePage } = useAppState();

  const NavIcon = ({ id, icon, label, active = false }) => (
    <div 
      id={`nav-${id}`}
      onClick={() => setActivePage(id)}
      className={`p-4 mx-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 relative group/nav ${active ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(104,211,255,0.1)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
    >
      <div className="shrink-0">{icon}</div>
      <span className="font-headline text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{label}</span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[2px_0_8px_rgba(104,211,255,0.6)]"></div>}
    </div>
  );

  return (
    <nav className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-20 hover:w-64 transition-all duration-500 z-40 bg-[#0d0e0f] flex-col py-6 border-r-0 group overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      <div className="px-6 mb-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        <div className="w-8 h-8 rounded shrink-0 bg-primary-container/20 flex items-center justify-center border border-primary/30">
          <Network size={16} className="text-primary" />
        </div>
        <div>
          <div className="font-headline text-sm font-bold text-primary">Aether OS</div>
          <div className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">Neural v3.0</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto custom-scrollbar pr-2">
        <div className="px-8 mt-4 mb-2 text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Architectural Core</div>
        <NavIcon id="dashboard" icon={<Rocket size={18} />} label="Neural Architect" active={activePage === 'dashboard'} />
        <NavIcon id="enterprise" icon={<Building2 size={18} />} label="Enterprise Structure" active={activePage === 'enterprise'} />
        <NavIcon id="topology" icon={<Layout size={18} />} label="Topology Matrix" active={activePage === 'topology'} />
        <NavIcon id="pricing" icon={<Calculator size={18} />} label="Pricing Lab" active={activePage === 'pricing'} />
        
        <div className="px-8 mt-6 mb-2 text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Execution Pipeline</div>
        <NavIcon id="workflow" icon={<Network size={18} />} label="Neural Pipeline" active={activePage === 'workflow'} />
        <NavIcon id="o2c" icon={<Zap size={18} />} label="O2C Flow" active={activePage === 'o2c'} />
        <NavIcon id="mm" icon={<Package size={18} />} label="Materials (MM)" active={activePage === 'mm'} />
        <NavIcon id="fico" icon={<Landmark size={18} />} label="Finance (FICO)" active={activePage === 'fico'} />
        <NavIcon id="vision" icon={<Eye size={18} />} label="Vision Lab" active={activePage === 'vision'} />
        <NavIcon id="agents" icon={<Settings2 size={18} />} label="Agent Mission Control" active={activePage === 'agents'} />
        <NavIcon id="sync" icon={<Cloud size={18} />} label="Cloud Ledger" active={activePage === 'sync'} />
        <NavIcon id="archives" icon={<Archive size={18} />} label="Memory Bank" active={activePage === 'archives'} />
      </div>

      <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-outline-variant/5">
        <NavIcon id="support" icon={<HelpCircle size={16} />} label="Neural Support" active={activePage === 'support'} />
        <NavIcon id="safety" icon={<Terminal size={16} />} label="Overseer Console" active={activePage === 'safety'} />
      </div>
    </nav>
  );
};

export default Sidebar;
