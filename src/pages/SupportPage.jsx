import React from 'react';
import { HelpCircle, Terminal, Mail, MessageSquare, BookOpen } from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-12 border-b border-outline-variant/10 pb-6 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
          <HelpCircle size={28} />
        </div>
        <div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Neural Support</h2>
          <p className="text-on-surface-variant text-sm flex items-center gap-2">
            <Terminal size={14} className="text-primary" />
            Aether OS Documentation & Assistance
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
          <BookOpen className="text-primary mb-4" size={24} />
          <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">Documentation</h3>
          <p className="text-sm text-on-surface-variant">Read the Aether OS guide for S/4HANA Configuration and prompt engineering for Llama 3.3.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
          <MessageSquare className="text-secondary mb-4" size={24} />
          <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-secondary transition-colors">Neural Community</h3>
          <p className="text-sm text-on-surface-variant">Join the community of SAP Architects using Aether to share prompts and roadmap matrices.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 hover:border-error/30 transition-all cursor-pointer group md:col-span-2">
          <Mail className="text-error mb-4" size={24} />
          <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-error transition-colors">Priority Engineering Support</h3>
          <p className="text-sm text-on-surface-variant">Report bugs, AI loop logic errors, or request immediate neural resets directly to the engineering team.</p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
