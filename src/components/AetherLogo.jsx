import React from 'react';

const AetherLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#68d3ff"/>
        <stop offset="100%" stopColor="#b088ff"/>
      </linearGradient>
      <filter id="logoGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="url(#logoGrad)" strokeWidth="1.5" fill="rgba(104,211,255,0.06)" filter="url(#logoGlow)"/>
    <circle cx="20" cy="20" r="3" fill="url(#logoGrad)"/>
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

export default AetherLogo;
