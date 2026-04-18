import React, { useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ─── SVG Logo Mark ─── */
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
    {/* Hexagon outline */}
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="url(#logoGrad)" strokeWidth="1.5" fill="rgba(104,211,255,0.06)" filter="url(#logoGlow)"/>
    {/* Neural node connectors */}
    <circle cx="20" cy="20" r="3" fill="url(#logoGrad)"/>
    <line x1="20" y1="20" x2="12" y2="13" stroke="#68d3ff" strokeWidth="1" opacity="0.7"/>
    <line x1="20" y1="20" x2="28" y2="13" stroke="#b088ff" strokeWidth="1" opacity="0.7"/>
    <line x1="20" y1="20" x2="28" y2="28" stroke="#68d3ff" strokeWidth="1" opacity="0.5"/>
    <line x1="20" y1="20" x2="12" y2="28" stroke="#93a2ff" strokeWidth="1" opacity="0.5"/>
    {/* Peripheral nodes */}
    <circle cx="12" cy="13" r="2" fill="#68d3ff" opacity="0.9"/>
    <circle cx="28" cy="13" r="2" fill="#b088ff" opacity="0.9"/>
    <circle cx="28" cy="28" r="1.5" fill="#68d3ff" opacity="0.6"/>
    <circle cx="12" cy="28" r="1.5" fill="#93a2ff" opacity="0.6"/>
    <circle cx="20" cy="6" r="1.5" fill="#68d3ff" opacity="0.4"/>
  </svg>
);

/* ─── Particles ─── */
const ParticleField = () => {
  const particles = Array.from({ length: 35 });
  return (
    <div className="lp-particle-field" aria-hidden>
      {particles.map((_, i) => (
        <div key={i} className="lp-particle" style={{
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          animationDelay: `${(Math.random() * 8).toFixed(2)}s`,
          animationDuration: `${(7 + Math.random() * 8).toFixed(2)}s`,
          width: `${(1 + Math.random() * 2.2).toFixed(1)}px`,
          height: `${(1 + Math.random() * 2.2).toFixed(1)}px`,
          background: Math.random() > 0.5 ? '#68d3ff' : '#b088ff',
        }}/>
      ))}
    </div>
  );
};

/* ─── Scroll progress ─── */
const ScrollProgress = () => {
  const barRef = useRef(null);
  useEffect(() => {
    const el = document.getElementById('lp-root');
    if (!el || !barRef.current) return;
    const bar = barRef.current;
    const onScroll = () => { bar.style.transform = `scaleX(${el.scrollTop / (el.scrollHeight - el.clientHeight) || 0})`; };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position:'fixed',top:64,left:0,right:0,height:2,background:'rgba(71,72,73,0.15)',zIndex:200 }}>
      <div ref={barRef} style={{ height:'100%',background:'linear-gradient(90deg,#68d3ff,#b088ff)',transformOrigin:'left',transform:'scaleX(0)',willChange:'transform',transition:'none' }}/>
    </div>
  );
};

/* ─── Scroll to section ─── */
const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ─── Animation helpers ─── */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.55,delay,ease:[0.22,1,0.36,1] }} className={className}>
    {children}
  </motion.div>
);
const FadeUpView = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity:0,y:22 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true,margin:'-50px' }} transition={{ duration:0.5,delay,ease:[0.22,1,0.36,1] }} className={className}>
    {children}
  </motion.div>
);

/* ─── Profile Card ─── */
const ProfileCard = ({ name, role, bio, initials, color, delay }) => (
  <FadeUpView delay={delay} className="profile-card">
    <div className="profile-avatar" style={{ background:`${color}20`, border:`2px solid ${color}50`, color }}>
      {initials}
    </div>
    <div>
      <div className="font-headline font-bold text-on-surface" style={{ fontSize:'1rem', marginBottom:2 }}>{name}</div>
      <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color, marginBottom:8 }}>{role}</div>
      <p style={{ fontSize:'0.82rem', color:'#ababac', lineHeight:1.6 }}>{bio}</p>
    </div>
  </FadeUpView>
);

/* ─── Module Card ─── */
const ModuleCard = ({ icon, title, badge, desc, tcodes, color, delay }) => (
  <FadeUpView delay={delay} className="module-card">
    <div className="module-glow" style={{ background:color }}/>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
      <div className="module-icon" style={{ background:`${color}18`, border:`1px solid ${color}35`, color }}>
        {icon}
      </div>
      <span className="module-badge" style={{ background:`${color}15`, color, border:`1px solid ${color}40` }}>{badge}</span>
    </div>
    <h3 className="font-headline font-bold text-on-surface" style={{ fontSize:'1.05rem', marginBottom:'0.5rem' }}>{title}</h3>
    <p style={{ color:'#ababac', fontSize:'0.83rem', lineHeight:1.65, marginBottom:'1rem', flex:1 }}>{desc}</p>
    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
      {tcodes.map(t => (
        <span key={t} className="tcode-chip">{t}</span>
      ))}
    </div>
  </FadeUpView>
);

/* ─── Feature Row (Product section) ─── */
const ProductRow = ({ n, icon, title, desc, bullets, color, delay, reverse }) => (
  <FadeUpView delay={delay} className={`product-row${reverse?' product-row-rev':''}`}>
    <div className="product-text">
      <div className="eyebrow" style={{ color }}>{n.toString().padStart(2,'0')} · Feature</div>
      <h3 className="font-headline font-bold text-on-surface" style={{ fontSize:'clamp(1.5rem,3vw,2rem)', letterSpacing:'-0.03em', lineHeight:1.2, marginBottom:'0.75rem' }}>{title}</h3>
      <p style={{ color:'#ababac', fontSize:'0.92rem', lineHeight:1.7, marginBottom:'1.25rem' }}>{desc}</p>
      <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:8 }}>
        {bullets.map(b => (
          <li key={b} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:'0.85rem', color:'#c8c8c9' }}>
            <span style={{ color, marginTop:2, flexShrink:0 }}>✦</span>{b}
          </li>
        ))}
      </ul>
    </div>
    <div className="product-visual" style={{ borderColor:`${color}25`, background:`${color}06` }}>
      <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>{icon}</div>
      <div style={{ width:'100%', height:2, background:`linear-gradient(90deg,transparent,${color}60,transparent)`, margin:'1rem 0' }}/>
      <div style={{ fontFamily:'Space Grotesk', fontSize:'0.75rem', color:`${color}80`, letterSpacing:'0.15em', textTransform:'uppercase' }}>Neural Intelligence Active</div>
    </div>
  </FadeUpView>
);

/* ── Stat ── */
const Stat = ({ value, label, delay }) => (
  <FadeUpView delay={delay} className="stat-item">
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </FadeUpView>
);

/* ═══════════════════════════
   MAIN LANDING PAGE
═══════════════════════════ */
const LandingPage = ({ onEnter }) => {
  const handleEnter = useCallback(() => onEnter(), [onEnter]);

  const MODULES = [
    { icon:'⚡', title:'SD Neural Architect', badge:'Sales Distribution', desc:'Full Order-to-Cash configuration: enterprise structures, pricing procedures (Condition Technique), partner functions, and billing document types — powered by AI.', tcodes:['VA01','VF01','VL01N','V/08','OVX5'], color:'#68d3ff', delay:0 },
    { icon:'📦', title:'MM-Link Console', badge:'Materials Mgmt', desc:'Procure-to-Pay lifecycle visualizer. From purchase requisition to invoice verification, with real-time stock and MRP validation across all plants.', tcodes:['ME51N','ME21N','MIGO','MIRO','MB51'], color:'#b088ff', delay:0.06 },
    { icon:'💳', title:'FICO-Sync Ledger', badge:'Finance & Controlling', desc:'Automated G/L account determination via VKOA, Accounts Receivable management, chart of accounts setup, and real-time revenue posting trace.', tcodes:['VKOA','FS00','FB01','F-28','OBYC'], color:'#93a2ff', delay:0.12 },
    { icon:'👁️', title:'Vision Neural Lab', badge:'AI Vision', desc:'Upload any SAP GUI screenshot. Llama 3.3 AI detects configuration glitches, screen artifacts, and incorrect field values using spatial heatmap analysis.', tcodes:['Screenshot','Glitch Detect','Heatmap','Fix Suggest'], color:'#68d3ff', delay:0.18 },
    { icon:'📇', title:'Master Data Dossier', badge:'Master Data', desc:'Multi-tier Customer & Material master views. Switch between General (Client), Company Code (FI), and Sales Area (SD) data levels with AI-guided field completion.', tcodes:['XD01','MM01','VD01','MMBE','XK01'], color:'#b088ff', delay:0.24 },
    { icon:'☁️', title:'Cloud Sync Ledger', badge:'Google Workspace', desc:'OAuth2-secured real-time synchronization to Google Sheets for roadmap persistence, Calendar for review checkpoints, and Docs for configuration export.', tcodes:['Sheets API','Calendar API','Docs API','OAuth2'], color:'#93a2ff', delay:0.30 },
  ];

  const PRODUCT_FEATURES = [
    {
      n:1, icon:'🧠', title:'AI Neural Architect', color:'#68d3ff',
      desc:'Ask in plain English. Get a complete, audit-ready SAP configuration roadmap in seconds.',
      bullets:['Generates step-by-step T-Code sequences', 'Validates configurations against SAP best practices', 'Produces implementation-ready technical specs', 'Supports SAP ECC → S/4HANA migration paths'],
      delay:0
    },
    {
      n:2, icon:'🗺️', title:'Enterprise Topology Visualizer', color:'#b088ff',
      desc:'See your entire SAP organizational structure as an interactive neural graph — not a text list.',
      bullets:['Drag-and-drop node assignments', 'Real-time dependency validation', 'Company Code → Sales Org → Division mappings', 'Export as configuration spec document'],
      delay:0.05, reverse:true
    },
    {
      n:3, icon:'⚖️', title:'Neural Pricing Lab (V/08)', color:'#93a2ff',
      desc:'The only AI tool that simulates the full SAP Condition Technique: Specific-to-General price hierarchy.',
      bullets:['SPRO-grade Control Data grid (Step/CTyp/From/To)', 'Access Sequence search strategy simulation', 'Account Key mapping to G/L accounts', 'Automatic vs. manual condition type validation'],
      delay:0
    },
    {
      n:4, icon:'🔁', title:'Cross-Module Symphony', color:'#68d3ff',
      desc:'Visualize how SD, MM, and FICO data flows across module boundaries in real time.',
      bullets:['SD Availability Check → MM stock deduction', 'VF01 billing → FI revenue G/L posting trace', 'Procurement trigger from MRP planning run', 'Full O2C and P2P lifecycle side-by-side view'],
      delay:0.05, reverse:true
    },
  ];

  const ENTERPRISE_TRUST = [
    { icon:'🔒', title:'OAuth2 Secured', desc:'Google Identity Services OAuth2 — no passwords stored, token-based auth for all Workspace APIs.' },
    { icon:'⚡', title:'Edge Deployed', desc:'Vercel Edge Network — globally distributed CDN with sub-50ms TTFB across all continents.' },
    { icon:'🤖', title:'Llama 3.3 70B', desc:'Powered by Meta\'s Llama 3.3 70B via Groq\'s inference API — state-of-the-art SAP domain reasoning.' },
    { icon:'🏆', title:'Enterprise Standards', desc:'Engineered to modern production standards with robust architecture, minimal dependencies, and pure CSS GPU animations.' },
  ];

  return (
    <>
      <ScrollProgress/>

      <div id="lp-root" className="lp-root">
        {/* Ambient orbs */}
        <div className="lp-orb lp-orb-cyan" aria-hidden/>
        <div className="lp-orb lp-orb-purple" aria-hidden/>
        <ParticleField/>

        {/* ── NAVBAR ── */}
        <nav className="lp-nav">
          <FadeUp delay={0} className="lp-nav-brand">
            <AetherLogo size={34}/>
            <div>
              <div className="font-headline font-bold text-primary lp-brand-name">SDAssist Aether</div>
              <div className="lp-brand-sub">V9.1 Titan · Neural OS</div>
            </div>
          </FadeUp>
          <FadeUp delay={0.04} className="lp-nav-links">
            {[
              { label:'Product', id:'section-product' },
              { label:'Modules', id:'section-modules' },
              { label:'Enterprise', id:'section-enterprise' },
            ].map(item => (
              <button key={item.label} onClick={() => scrollTo(item.id)} className="lp-nav-link">
                {item.label}
              </button>
            ))}
          </FadeUp>
          <FadeUp delay={0.08} className="lp-nav-actions">
            <button onClick={handleEnter} className="lp-btn-sm">Launch App ↗</button>
          </FadeUp>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-content">
            <FadeUp delay={0}>
              <div className="lp-pill">
                <span className="lp-pulse-dot"/>
                V9.1 · Aether Full-Stack SAP Digital Twin — Live
              </div>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="lp-h1">
                Design Enterprise Logic
                <br/>
                <span className="lp-gradient-text">at the Speed of Thought.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="lp-hero-sub">
                The world's first AI-native S/4HANA Digital Twin — configure Sales Distribution,
                Materials Management, Financials and Vision Neural Lab in one Neural OS.
              </p>
            </FadeUp>
            <FadeUp delay={0.22} className="lp-cta-row">
              <button onClick={handleEnter} className="lp-btn-hero">
                Enter Aether OS
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button onClick={() => scrollTo('section-modules')} className="lp-btn-ghost">Explore Modules</button>
            </FadeUp>
          </div>

          {/* Dashboard preview */}
          <FadeUp delay={0.3} className="lp-preview-wrap">
            <div className="lp-preview-fade"/>
            <div className="lp-preview-inner">
              <div className="lp-preview-sidebar">
                {['#68d3ff50','#b088ff45','#ababac25','#ababac18','#ababac12'].map((bg,i)=>(
                  <div key={i} style={{ height:34,width:34,borderRadius:9,background:bg,flexShrink:0 }}/>
                ))}
              </div>
              <div className="lp-preview-canvas">
                <svg className="absolute inset-0 w-full h-full" opacity="0.45">
                  <line x1="14%" y1="44%" x2="46%" y2="34%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="5,5"/>
                  <line x1="46%" y1="34%" x2="74%" y2="20%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="5,5"/>
                  <line x1="46%" y1="34%" x2="74%" y2="56%" stroke="#b088ff" strokeWidth="1" strokeDasharray="5,5"/>
                  <line x1="46%" y1="34%" x2="28%" y2="62%" stroke="#93a2ff" strokeWidth="1" strokeDasharray="5,5"/>
                </svg>
                {[
                  {l:'8%', t:'36%',c:'#68d3ff',n:'Sales Org'},
                  {l:'40%',t:'26%',c:'#b088ff',n:'Dist. Channel'},
                  {l:'68%',t:'13%',c:'#93a2ff',n:'Plant 1000'},
                  {l:'68%',t:'50%',c:'#93a2ff',n:'Plant 2000'},
                  {l:'22%',t:'58%',c:'#68d3ff',n:'Company Code'},
                ].map((nd,i)=>(
                  <div key={i} style={{position:'absolute',left:nd.l,top:nd.t,transform:'translate(-50%,-50%)'}}>
                    <div className="lp-node-chip" style={{color:nd.c,borderColor:`${nd.c}50`,background:`${nd.c}14`}}>{nd.n}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ── STATS ── */}
        <section className="lp-stats-wrap">
          <Stat value="12+" label="SAP Modules" delay={0}/>
          <Stat value="99%" label="Config Accuracy" delay={0.08}/>
          <Stat value="3×" label="Faster Deploy" delay={0.16}/>
          <Stat value="∞" label="Neural Capacity" delay={0.24}/>
        </section>

        {/* ═══════════════════════════════════
            PRODUCT SECTION
        ═══════════════════════════════════ */}
        <section id="section-product" className="lp-section">
          <div className="lp-container">
            <FadeUpView className="lp-section-header">
              <div className="eyebrow">Product</div>
              <h2 className="lp-h2">Built for SAP Experts.<br/>Powered by Neural AI.</h2>
              <p className="lp-section-sub">
                Every feature is designed around real SAP consulting workflows — not generic AI chatbots.
                Aether understands T-Codes, configuration tables, and cross-module dependencies natively.
              </p>
            </FadeUpView>
            <div className="lp-product-rows">
              {PRODUCT_FEATURES.map(f => <ProductRow key={f.title} {...f}/>)}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            MODULES SECTION
        ═══════════════════════════════════ */}
        <section id="section-modules" className="lp-section lp-section-alt">
          <div className="lp-container">
            <FadeUpView className="lp-section-header">
              <div className="eyebrow">Modules</div>
              <h2 className="lp-h2">Every SAP Module.<br/>One Neural Brain.</h2>
              <p className="lp-section-sub">
                From SD Pricing Procedures (ZIM24) to FICO G/L determination — Aether's multi-agent core
                bridges the gap between business requirements and technical configuration precision.
              </p>
            </FadeUpView>
            <div className="lp-modules-grid">
              {MODULES.map(m => <ModuleCard key={m.title} {...m}/>)}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            ENTERPRISE SECTION
        ═══════════════════════════════════ */}
        <section id="section-enterprise" className="lp-section">
          <div className="lp-container">
            <FadeUpView className="lp-section-header">
              <div className="eyebrow">Enterprise</div>
              <h2 className="lp-h2">Production-Grade.<br/>Enterprise-Ready.</h2>
              <p className="lp-section-sub">
                Designed with a strict production architecture —
                secure, exceptionally fast, SEO-optimized, and built for immense scale.
              </p>
            </FadeUpView>

            {/* Trust grid */}
            <div className="lp-trust-grid">
              {ENTERPRISE_TRUST.map((t, i) => (
                <FadeUpView key={t.title} delay={i * 0.06} className="lp-trust-card">
                  <div style={{ fontSize:'1.8rem', marginBottom:'0.75rem' }}>{t.icon}</div>
                  <h4 className="font-headline font-bold text-on-surface" style={{ fontSize:'0.95rem', marginBottom:'0.4rem' }}>{t.title}</h4>
                  <p style={{ fontSize:'0.8rem', color:'#ababac', lineHeight:1.6 }}>{t.desc}</p>
                </FadeUpView>
              ))}
            </div>

            {/* Tech stack visual */}
            <FadeUpView delay={0.2} className="lp-tech-strip">
              {[
                { label:'React 18', color:'#61dafb' },
                { label:'Vite 8', color:'#a855f7' },
                { label:'Tailwind CSS', color:'#38bdf8' },
                { label:'Framer Motion', color:'#ff6b9d' },
                { label:'Groq AI', color:'#f97316' },
                { label:'Llama 3.3 70B', color:'#68d3ff' },
                { label:'Google OAuth2', color:'#34a853' },
                { label:'Vercel Edge', color:'#ffffff' },
              ].map(t => (
                <span key={t.label} className="lp-tech-badge" style={{ borderColor:`${t.color}35`, color:t.color, background:`${t.color}10` }}>
                  {t.label}
                </span>
              ))}
            </FadeUpView>

            {/* Team / Profile section */}
            <div style={{ marginTop:'5rem' }}>
              <FadeUpView className="lp-section-header" style={{ marginBottom:'2.5rem' }}>
                <div className="eyebrow">Team & Profile</div>
                <h3 className="font-headline font-bold text-on-surface" style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', letterSpacing:'-0.03em', lineHeight:1.2 }}>
                  Built by a Visionary<br/>SAP & AI Engineer.
                </h3>
              </FadeUpView>
              <div className="lp-profiles-grid">
                <ProfileCard
                  name="Harsh Shukla"
                  role="SAP SD Architect & AI Engineer"
                  bio="Full-stack developer and SAP Sales & Distribution domain expert. Built SDAssist Aether as a complete enterprise-grade digital twin platform combining deep SAP configuration knowledge with neural AI capabilities."
                  initials="HS"
                  color="#68d3ff"
                  delay={0}
                />
                <FadeUpView delay={0.1} className="lp-profile-stats-panel">
                  <div className="eyebrow" style={{ marginBottom:'1.5rem' }}>Platform Intelligence</div>
                  {[
                    { label:'SAP Modules Covered', val:'SD · MM · FICO · Vision' },
                    { label:'AI Model', val:'Llama 3.3 70B via Groq' },
                    { label:'Google Integration', val:'Sheets · Calendar · Docs' },
                    { label:'Deployment', val:'Vercel Edge · Global CDN' },
                  ].map(r => (
                    <div key={r.label} className="lp-profile-stat-row">
                      <span style={{ color:'#ababac', fontSize:'0.8rem' }}>{r.label}</span>
                      <span className="font-headline font-bold text-on-surface" style={{ fontSize:'0.82rem' }}>{r.val}</span>
                    </div>
                  ))}
                  <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
                    <a href="https://harsh-kumar-shukla-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="lp-btn-sm" style={{ padding: '10px 24px', background: 'transparent', border: '1px solid rgba(104,211,255,0.4)', color: '#68d3ff' }}>
                      View Creator Portfolio ↗
                    </a>
                  </div>
                </FadeUpView>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="lp-section">
          <div className="lp-container">
            <FadeUpView className="lp-cta-block">
              <div className="eyebrow" style={{ justifyContent:'center' }}>Ready to Deploy?</div>
              <h2 className="font-headline font-bold text-on-surface" style={{ fontSize:'clamp(2rem,4.5vw,3.5rem)', letterSpacing:'-0.035em', lineHeight:1.1, marginBottom:'1rem', textAlign:'center' }}>
                Your Digital Twin<br/>Awaits Activation.
              </h2>
              <p style={{ color:'#ababac', maxWidth:400, textAlign:'center', lineHeight:1.65, fontSize:'0.92rem', marginBottom:'2.5rem' }}>
                Step inside Aether OS. Configure S/4HANA architecture faster, smarter, with full neural precision.
              </p>
              <button onClick={handleEnter} className="lp-btn-cta">
                Initialize Aether OS →
              </button>
            </FadeUpView>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-footer-brand">
            <AetherLogo size={28}/>
            <div>
              <div className="font-headline font-bold text-primary lp-brand-name-sm">SDAssist Aether</div>
              <div style={{ fontSize:9, color:'rgba(171,171,172,0.35)', textTransform:'uppercase', letterSpacing:'0.18em' }}>V9.1 Titan · Neural OS</div>
            </div>
          </div>
          <div className="lp-footer-links">
            {[
              { label:'Product', id:'section-product' },
              { label:'Modules', id:'section-modules' },
              { label:'Enterprise', id:'section-enterprise' },
            ].map(item => (
              <button key={item.label} onClick={() => scrollTo(item.id)} className="lp-footer-link">{item.label}</button>
            ))}
            <button onClick={handleEnter} className="lp-footer-link" style={{ color:'#68d3ff' }}>Launch App ↗</button>
          </div>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.18em', color:'rgba(171,171,172,0.3)' }}>
            © 2026 SDAssist Aether
          </div>
        </footer>
      </div>

      <style>{`
        .lp-root { position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;background:#0d0e0f;-webkit-overflow-scrolling:touch; }

        /* Orbs */
        .lp-orb { position:fixed;border-radius:50%;pointer-events:none;z-index:0; }
        .lp-orb-cyan { width:55vw;height:55vw;top:-15%;right:-12%;background:radial-gradient(circle,rgba(104,211,255,0.09) 0%,transparent 70%);filter:blur(80px); }
        .lp-orb-purple { width:45vw;height:45vw;bottom:-10%;left:-8%;background:radial-gradient(circle,rgba(176,136,255,0.07) 0%,transparent 70%);filter:blur(80px); }

        /* Particles */
        .lp-particle-field { position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden; }
        .lp-particle { position:absolute;border-radius:50%;opacity:0;animation:lpFloat linear infinite;will-change:transform,opacity; }
        @keyframes lpFloat { 0%{transform:translateY(0) scale(1);opacity:0} 15%{opacity:0.55} 85%{opacity:0.25} 100%{transform:translateY(-70px) scale(0.5);opacity:0} }

        /* Nav */
        .lp-nav { position:fixed;top:0;left:0;right:0;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;z-index:100;background:rgba(13,14,15,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(71,72,73,0.18); }
        .lp-nav-brand { display:flex;align-items:center;gap:10px;cursor:default; }
        .lp-brand-name { font-size:1rem;letter-spacing:-0.02em; }
        .lp-brand-name-sm { font-size:0.88rem;letter-spacing:-0.02em; }
        .lp-brand-sub { font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:rgba(171,171,172,0.3);font-family:'Inter',sans-serif; }
        .lp-nav-links { display:none;gap:2rem; }
        @media(min-width:768px){ .lp-nav-links{display:flex;} }
        .lp-nav-link { background:none;border:none;cursor:pointer;font-size:0.83rem;color:#ababac;font-family:'Inter',sans-serif;transition:color 0.18s;padding:4px 0; }
        .lp-nav-link:hover { color:#68d3ff; }
        .lp-nav-actions { display:flex;align-items:center;gap:12px; }
        .lp-btn-sm { padding:7px 18px;border-radius:999px;background:#68d3ff;color:#003c4f;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.8rem;border:none;cursor:pointer;transition:transform 0.15s ease,box-shadow 0.18s ease;will-change:transform; }
        .lp-btn-sm:hover { transform:scale(1.05);box-shadow:0 0 18px rgba(104,211,255,0.4); }
        .lp-btn-sm:active { transform:scale(0.96); }

        /* Hero */
        .lp-hero { position:relative;z-index:10;min-height:100vh;padding-top:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-inline:1.5rem; }
        .lp-hero-content { max-width:800px;text-align:center;display:flex;flex-direction:column;align-items:center; }
        .lp-pill { display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:999px;border:1px solid rgba(104,211,255,0.22);background:rgba(104,211,255,0.07);color:#68d3ff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;font-family:'Inter',sans-serif;margin-bottom:1.75rem; }
        .lp-pulse-dot { display:inline-block;width:6px;height:6px;border-radius:50%;background:#68d3ff;animation:lpPulse 2.4s ease infinite;will-change:opacity,transform; }
        @keyframes lpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        .lp-h1 { font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:-0.04em;line-height:1.06;color:#fff;margin-bottom:1rem;font-size:clamp(2.4rem,6.5vw,5.6rem); }
        .lp-gradient-text { background:linear-gradient(90deg,#68d3ff 0%,#b088ff 50%,#68d3ff 100%);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:lpGrad 7s ease infinite;will-change:background-position; }
        @keyframes lpGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .lp-hero-sub { color:#ababac;font-size:clamp(0.88rem,1.5vw,1.04rem);max-width:37rem;line-height:1.72;font-family:'Inter',sans-serif;font-weight:300;margin-bottom:2.2rem; }
        .lp-cta-row { display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1rem;margin-bottom:3.5rem; }
        .lp-btn-hero { display:inline-flex;align-items:center;gap:10px;padding:14px 32px;border-radius:1.2rem;background:#68d3ff;color:#003c4f;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1rem;border:none;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,0.3);transition:transform 0.18s ease,box-shadow 0.2s ease;will-change:transform; }
        .lp-btn-hero:hover { transform:translateY(-2px);box-shadow:0 0 26px rgba(104,211,255,0.35),0 12px 36px rgba(0,0,0,0.4); }
        .lp-btn-hero:active { transform:translateY(0) scale(0.98); }
        .lp-btn-ghost { padding:14px 32px;border-radius:1.2rem;border:1px solid rgba(71,72,73,0.4);background:transparent;color:rgba(255,255,255,0.8);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:1rem;cursor:pointer;transition:border-color 0.18s,background 0.18s,transform 0.15s;will-change:transform; }
        .lp-btn-ghost:hover { border-color:rgba(104,211,255,0.38);background:rgba(104,211,255,0.06);transform:translateY(-2px); }
        .lp-btn-ghost:active { transform:translateY(0); }

        /* Preview */
        .lp-preview-wrap { position:relative;z-index:10;width:100%;max-width:840px;padding-inline:1rem;will-change:transform,opacity; }
        .lp-preview-fade { position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(to top,#0d0e0f 0%,transparent 55%);border-radius:1.8rem; }
        .lp-preview-inner { border-radius:1.8rem;overflow:hidden;border:1px solid rgba(71,72,73,0.28);box-shadow:0 32px 80px rgba(0,0,0,0.7);background:#121315;display:flex;gap:1rem;padding:1.25rem;min-height:230px; }
        .lp-preview-sidebar { width:42px;background:rgba(24,26,27,0.7);border-radius:0.9rem;display:flex;flex-direction:column;gap:7px;padding:9px;border:1px solid rgba(71,72,73,0.15);flex-shrink:0; }
        .lp-preview-canvas { flex:1;background:rgba(24,26,27,0.55);border-radius:0.9rem;border:1px solid rgba(71,72,73,0.12);position:relative;overflow:hidden; }
        .lp-node-chip { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;padding:3px 9px;border-radius:7px;border:1px solid;white-space:nowrap; }

        /* Stats */
        .lp-stats-wrap { position:relative;z-index:10;display:grid;grid-template-columns:repeat(2,1fr);gap:2.5rem;padding:4rem 2rem;max-width:800px;margin:0 auto;border-top:1px solid rgba(71,72,73,0.12); }
        @media(min-width:640px){ .lp-stats-wrap{grid-template-columns:repeat(4,1fr);} }
        .stat-item { display:flex;flex-direction:column;align-items:center;gap:4px; }
        .stat-value { font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(2rem,5vw,2.8rem);color:#68d3ff;filter:drop-shadow(0 0 16px rgba(104,211,255,0.35)); }
        .stat-label { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.22em;color:rgba(171,171,172,0.5);font-family:'Inter',sans-serif; }

        /* Sections */
        .lp-section { position:relative;z-index:10;padding:5rem 0; }
        .lp-section-alt { background:rgba(255,255,255,0.015); }
        .lp-container { max-width:1100px;margin:0 auto;padding-inline:1.5rem; }
        .lp-section-header { max-width:580px;margin-bottom:3.5rem; }
        .lp-h2 { font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.035em;line-height:1.15;color:#fff;margin-bottom:1rem; }
        .lp-section-sub { color:#ababac;font-size:0.92rem;line-height:1.7;max-width:520px; }
        .eyebrow { display:flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;color:#68d3ff;margin-bottom:0.75rem; }

        /* Product rows */
        .lp-product-rows { display:flex;flex-direction:column;gap:4rem; }
        .product-row { display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:center; }
        @media(min-width:768px){ .product-row{grid-template-columns:1fr 1fr;} }
        .product-row-rev .product-visual { order:-1; }
        @media(min-width:768px){ .product-row-rev .product-visual{order:1;} .product-row-rev .product-text{order:2;} }
        .product-text { display:flex;flex-direction:column; }
        .product-visual { border:1px solid;border-radius:1.5rem;padding:2.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;transition:border-color 0.3s,background 0.3s; }

        /* Modules grid */
        .lp-modules-grid { display:grid;gap:1.25rem;grid-template-columns:1fr; }
        @media(min-width:640px){ .lp-modules-grid{grid-template-columns:repeat(2,1fr);} }
        @media(min-width:1024px){ .lp-modules-grid{grid-template-columns:repeat(3,1fr);} }
        .module-card { position:relative;padding:1.6rem;border-radius:1.5rem;border:1px solid rgba(71,72,73,0.12);background:rgba(18,19,21,0.6);display:flex;flex-direction:column;gap:0;overflow:hidden;cursor:default;transition:transform 0.24s cubic-bezier(0.22,1,0.36,1),border-color 0.24s,background 0.24s;will-change:transform; }
        .module-card:hover { transform:translateY(-5px) translateZ(0);border-color:rgba(104,211,255,0.2);background:rgba(30,32,33,0.65); }
        .module-glow { position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;filter:blur(36px);opacity:0;transition:opacity 0.35s;pointer-events:none; }
        .module-card:hover .module-glow { opacity:0.16; }
        .module-icon { width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;border:1px solid;flex-shrink:0;transition:transform 0.2s; }
        .module-card:hover .module-icon { transform:scale(1.08); }
        .module-badge { font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;padding:3px 10px;border-radius:99px;border:1px solid;font-family:'Inter',sans-serif; }
        .tcode-chip { font-family:'Space Grotesk',monospace;font-size:9px;font-weight:700;padding:2px 8px;border-radius:5px;background:rgba(71,72,73,0.25);color:#ababac;border:1px solid rgba(71,72,73,0.3); }

        /* Trust grid */
        .lp-trust-grid { display:grid;gap:1.25rem;grid-template-columns:repeat(2,1fr);margin-bottom:3rem; }
        @media(min-width:640px){ .lp-trust-grid{grid-template-columns:repeat(3,1fr);} }
        .lp-trust-card { padding:1.5rem;border-radius:1.2rem;border:1px solid rgba(71,72,73,0.1);background:rgba(18,19,21,0.5);transition:transform 0.22s cubic-bezier(0.22,1,0.36,1),border-color 0.22s;will-change:transform; }
        .lp-trust-card:hover { transform:translateY(-4px);border-color:rgba(104,211,255,0.18); }

        /* Tech strip */
        .lp-tech-strip { display:flex;flex-wrap:wrap;gap:0.6rem;padding:2rem;border-radius:1.2rem;border:1px solid rgba(71,72,73,0.1);background:rgba(18,19,21,0.4); }
        .lp-tech-badge { font-family:'Inter',sans-serif;font-size:11px;font-weight:600;padding:5px 12px;border-radius:99px;border:1px solid; }

        /* Profiles */
        .lp-profiles-grid { display:grid;gap:1.5rem;grid-template-columns:1fr; }
        @media(min-width:768px){ .lp-profiles-grid{grid-template-columns:1fr 1fr;} }
        .profile-card { padding:2rem;border-radius:1.5rem;border:1px solid rgba(71,72,73,0.12);background:rgba(18,19,21,0.6);display:flex;flex-direction:column;gap:1.25rem; }
        .profile-avatar { width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.1rem; }
        .lp-profile-stats-panel { padding:2rem;border-radius:1.5rem;border:1px solid rgba(104,211,255,0.15);background:rgba(104,211,255,0.04);display:flex;flex-direction:column; }
        .lp-profile-stat-row { display:flex;justify-content:space-between;align-items:center;padding:0.65rem 0;border-bottom:1px solid rgba(71,72,73,0.1); }
        .lp-profile-stat-row:last-child { border-bottom:none; }

        /* CTA block */
        .lp-cta-block { border-radius:2.5rem;border:1px solid rgba(104,211,255,0.18);background:linear-gradient(135deg,rgba(104,211,255,0.07),rgba(176,136,255,0.04),rgba(13,14,15,0.9));padding:4rem 2rem;display:flex;flex-direction:column;align-items:center; }
        .lp-btn-cta { padding:16px 44px;border-radius:1.4rem;background:linear-gradient(135deg,#68d3ff,#b088ff);color:#001630;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.05rem;border:none;cursor:pointer;box-shadow:0 0 26px rgba(104,211,255,0.28),0 14px 36px rgba(0,0,0,0.4);transition:transform 0.18s ease,box-shadow 0.2s;will-change:transform; }
        .lp-btn-cta:hover { transform:translateY(-3px) scale(1.02);box-shadow:0 0 44px rgba(104,211,255,0.38),0 18px 44px rgba(0,0,0,0.5); }
        .lp-btn-cta:active { transform:scale(0.98); }

        /* Footer */
        .lp-footer { position:relative;z-index:10;border-top:1px solid rgba(71,72,73,0.12);padding:2rem 2rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;max-width:1100px;margin:0 auto;padding-bottom:3rem; }
        .lp-footer-brand { display:flex;align-items:center;gap:10px; }
        .lp-footer-links { display:flex;gap:1.5rem;flex-wrap:wrap; }
        .lp-footer-link { background:none;border:none;cursor:pointer;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:rgba(171,171,172,0.4);font-family:'Inter',sans-serif;font-weight:600;transition:color 0.18s;padding:0; }
        .lp-footer-link:hover { color:#ababac; }
      `}</style>
    </>
  );
};

export default LandingPage;
