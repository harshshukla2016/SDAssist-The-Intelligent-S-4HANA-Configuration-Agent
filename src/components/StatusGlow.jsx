import React from 'react';

const StatusGlow = ({ status = 'idle' }) => {
  const colors = {
    idle: 'bg-primary/80',
    processing: 'bg-secondary animate-pulse',
    success: 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]',
    error: 'bg-error animate-bounce'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]} transition-all duration-500`}></div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {status}
      </span>
    </div>
  );
};

export default StatusGlow;
