import React from 'react';
import { Bell, Settings2, ShieldAlert } from 'lucide-react';
import StatusGlow from './StatusGlow';
import { useAppState } from '../context/StateContext';

const AetherLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#68d3ff"/>
        <stop offset="100%" stopColor="#b088ff"/>
      </linearGradient>
      <filter id="logoGlow2">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="url(#logoGrad2)" strokeWidth="1.5" fill="rgba(104,211,255,0.06)" filter="url(#logoGlow2)"/>
    <circle cx="20" cy="20" r="3" fill="url(#logoGrad2)"/>
    <line x1="20" y1="20" x2="12" y2="13" stroke="#68d3ff" strokeWidth="1" opacity="0.7"/>
    <line x1="20" y1="20" x2="28" y2="13" stroke="#b088ff" strokeWidth="1" opacity="0.7"/>
    <line x1="20" y1="20" x2="28" y2="28" stroke="#68d3ff" strokeWidth="1" opacity="0.5"/>
    <line x1="20" y1="20" x2="12" y2="28" stroke="#93a2ff" strokeWidth="1" opacity="0.5"/>
    <circle cx="12" cy="13" r="2" fill="#68d3ff" opacity="0.9"/>
    <circle cx="28" cy="13" r="2" fill="#b088ff" opacity="0.9"/>
    <circle cx="28" cy="28" r="1.5" fill="#68d3ff" opacity="0.6"/>
    <circle cx="12" cy="28" r="1.5" fill="#93a2ff" opacity="0.6"/>
    <circle cx="20" cy="6" r="1.5" fill="#68d3ff" opacity="0.4"/>
  </svg>
);

const Header = ({ onOpenAlpha, onOpenNeural }) => {
  const { isProcessing } = useAppState();

  return (
    <header className="h-16 border-b border-outline-variant/10 flex items-center justify-between px-8 premium-glass sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center mr-1">
            <AetherLogo size={22} />
          </div>
          <span className="font-headline font-bold text-lg tracking-tight">SDAssist <span className="text-primary">Aether</span></span>
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
        <button className="text-primary hover:text-white transition-colors active:scale-95 duration-100 flex items-center justify-center">
          <Bell size={20} />
        </button>
        <button className="text-primary hover:text-white transition-colors active:scale-95 duration-100 flex items-center justify-center">
          <Settings2 size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden ml-2 outline outline-1 outline-outline-variant/30 cursor-pointer">
          <img src="https://lh3.googleusercontent.com/a/ACg8ocL8Rvhz5v4u3T8X678G8g7X7mX" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
