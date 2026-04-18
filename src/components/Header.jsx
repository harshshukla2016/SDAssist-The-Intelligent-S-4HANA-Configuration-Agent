import React from 'react';
import { Bell, Settings2, ShieldAlert } from 'lucide-react';
import StatusGlow from './StatusGlow';
import { useAppState } from '../context/StateContext';
import AetherLogo from './AetherLogo';

const Header = ({ onOpenAlpha, onOpenNeural, onExit }) => {
  const { isProcessing, setActivePage } = useAppState();

  return (
    <header className="h-16 border-b border-outline-variant/10 flex items-center justify-between px-8 premium-glass sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={onExit}
          aria-label="Return to Landing Page"
        >
          <AetherLogo size={28} />
          <span className="font-headline font-bold text-lg tracking-tight group-hover:text-primary transition-colors">SDAssist <span className="text-primary">Aether</span></span>
        </div>
        <div className="h-4 w-px bg-outline-variant/30 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-body text-on-surface-variant">
          <button onClick={onOpenAlpha} className="hover:text-primary transition-colors cursor-pointer capitalize">Project Alpha</button>
          <button onClick={onOpenNeural} className="hover:text-primary transition-colors cursor-pointer">Neural Configuration</button>
          <span className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
            <ShieldAlert size={14} className="text-primary" />
            Overseer Enabled
          </span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <StatusGlow status={isProcessing ? 'processing' : 'success'} />
        <div className="h-6 w-px bg-outline-variant/30 hidden sm:block"></div>
        <button onClick={() => setActivePage('safety')} aria-label="Open Overseer Console" className="text-primary hover:text-white transition-colors active:scale-95 duration-100 flex items-center justify-center">
          <Bell size={20} />
        </button>
        <button onClick={onOpenNeural} aria-label="Open Neural Configuration" className="text-primary hover:text-white transition-colors active:scale-95 duration-100 flex items-center justify-center">
          <Settings2 size={20} />
        </button>
        <div onClick={onOpenAlpha} aria-label="Open Project Alpha" className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden ml-2 outline outline-1 outline-outline-variant/30 cursor-pointer">
          <img src="https://lh3.googleusercontent.com/a/ACg8ocL8Rvhz5v4u3T8X678G8g7X7mX" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
