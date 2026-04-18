import React, { useState } from 'react';
import { Search, ExternalLink, Loader2, X } from 'lucide-react';
import { searchTCode } from '../services/googleSearch';

const TCodeSearch = ({ tcode }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async () => {
    setIsOpen(true);
    if (results) return;
    setLoading(true);
    try {
      const data = await searchTCode(tcode);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block">
      <button 
        onClick={handleSearch}
        className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 transition-all text-[10px] font-bold uppercase tracking-wider group"
      >
        <Search size={10} className="group-hover:scale-110 transition-transform" />
        Deep Research
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-outline-variant/20 shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Close Deep Research Overlay"
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container rounded-lg hover:bg-surface-container-high"
            >
              <X size={20} />
            </button>

            <header className="mb-6">
              <div className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Google Search Integration</div>
              <h3 className="font-headline text-xl font-bold">T-Code: {tcode}</h3>
              <p className="text-on-surface-variant text-xs">Fetching S/4HANA telemetry and documentation.</p>
            </header>

            <div className="space-y-4">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <span className="text-xs text-on-surface-variant animate-pulse">Consulting SAP Archives...</span>
                </div>
              ) : results?.length > 0 ? (
                results.map((res, i) => (
                  <a 
                    key={i} 
                    href={res.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block p-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/10 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{res.title}</h4>
                      <ExternalLink size={14} className="text-on-surface-variant shrink-0" />
                    </div>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                      {res.snippet}
                    </p>
                  </a>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-on-surface-variant">
                  No direct telemetry found. Reference SAP Best Practices.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TCodeSearch;
