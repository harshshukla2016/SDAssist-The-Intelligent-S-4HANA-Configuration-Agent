import React from 'react';
import { AlertCircle, CheckCircle2, Zap, ArrowDown } from 'lucide-react';
import { validatePricing } from '../services/sapLogic';

const PricingHealth = ({ roadmap }) => {
  // Extract technical pricing steps if present, or use default logic
  const pricingSteps = roadmap.configuration_roadmap?.filter(s => 
    s.step.toLowerCase().includes('price') || 
    s.step.toLowerCase().includes('discount') ||
    s.step.includes('V/08')
  ) || [];

  // Mock expansion for visualization if Gemini didn't return specific conditions
  const conditions = [
    { id: 'PR00', name: 'Base Price', type: 'base' },
    { id: 'K007', name: 'Customer Discount', type: 'discount' },
    { id: 'RA01', name: 'Group Discount', type: 'discount' }
  ];

  const warnings = validatePricing(conditions);

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden animate-in fade-in slide-in-from-right-10 duration-700 delay-200">
      <header className="p-5 border-b border-outline-variant/10 bg-surface-container/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
            <Zap size={18} />
          </div>
          <h4 className="font-headline text-sm font-bold">Pricing Engine Health</h4>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${warnings.length > 0 ? 'bg-error/10 text-error' : 'bg-green-500/10 text-green-400'}`}>
          {warnings.length > 0 ? 'Critical Logic Gap' : 'Sequence Validated'}
        </div>
      </header>

      <div className="p-6">
        <div className="flex flex-col items-center gap-4 relative">
          {conditions.map((c, i) => (
            <React.Fragment key={c.id}>
              <div className={`w-full max-w-[280px] p-4 rounded-xl border flex items-center justify-between group transition-all duration-300 ${c.type === 'base' ? 'bg-primary/5 border-primary/20 hover:border-primary/40' : 'bg-surface-container-high border-outline-variant/20'}`}>
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-bold text-on-surface-variant font-mono">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="text-xs font-bold text-on-surface">{c.name}</div>
                    <div className="text-[9px] text-on-surface-variant font-mono uppercase tracking-widest">{c.id}</div>
                  </div>
                </div>
                {c.type === 'base' ? <CheckCircle2 size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-on-surface-variant animate-pulse" />}
              </div>
              {i < conditions.length - 1 && (
                <div className="h-6 w-px bg-outline-variant/30 relative">
                  <ArrowDown size={14} className="absolute -bottom-1 -left-[6px] text-outline-variant/30" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {warnings.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-error/5 border border-error/20 flex gap-3 animate-bounce">
            <AlertCircle size={18} className="text-error shrink-0 mt-0.5" />
            <div className="text-[11px] text-error leading-relaxed">
              <span className="font-bold block mb-1 uppercase tracking-wider">Logic Violation Detected</span>
              {warnings[0]} Adjust Step Sequence in V/08.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingHealth;
