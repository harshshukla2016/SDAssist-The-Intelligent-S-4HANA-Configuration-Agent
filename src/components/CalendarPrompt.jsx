import React, { useState } from 'react';
import { Calendar, Check, X, Loader2, ArrowRight } from 'lucide-react';
import { scheduleEvent } from '../services/googleCalendar';

const CalendarPrompt = ({ roadmap, googleToken, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSchedule = async () => {
    if (!googleToken) {
       alert("Neural Link not active. Please authorize in Cloud Sync.");
       onComplete();
       return;
    }
    setLoading(true);
    try {
      const hours = roadmap.estimatedHours || 4;
      const start = new Date();
      start.setHours(start.getHours() + 1); // Start in 1 hour
      const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

      await scheduleEvent(
        `SAP Config: ${roadmap.scenario_type} Implementation`,
        start.toISOString(),
        end.toISOString(),
        googleToken
      );
      setSuccess(true);
      setTimeout(onComplete, 2000);
    } catch (err) {
      console.error(err);
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <div className="glass-panel p-6 rounded-2xl border border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm">
        <header className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-headline text-sm font-bold">Smart Scheduler</h4>
            <div className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">Aether Predictive Link</div>
          </div>
        </header>

        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
          The <span className="text-on-surface font-semibold">{roadmap.scenario_type}</span> setup estimated at <span className="text-primary font-bold">{roadmap.estimatedHours} hours</span>. Should I block time on your Google Calendar for this afternoon?
        </p>

        <div className="flex gap-3">
          {success ? (
            <div className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold animate-in zoom-in duration-300">
              <Check size={14} /> Scheduled Successfully
            </div>
          ) : (
            <>
              <button 
                onClick={onComplete}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant text-xs font-bold transition-all"
              >
                Maybe Later
              </button>
              <button 
                onClick={handleSchedule}
                disabled={loading}
                className="flex-[1.5] px-4 py-3 rounded-xl bg-primary hover:bg-primary-dim text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : (
                  <>
                    Confirm Slot <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPrompt;
