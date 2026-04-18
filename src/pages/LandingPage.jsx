import React, { useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────
   Pure CSS particle grid — zero JS per frame, GPU only
───────────────────────────────────────────────────── */
const ParticleField = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="particle-field" aria-hidden>
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            animationDelay: `${(Math.random() * 8).toFixed(2)}s`,
            animationDuration: `${(6 + Math.random() * 8).toFixed(2)}s`,
            width:  `${(1 + Math.random() * 2.5).toFixed(1)}px`,
            height: `${(1 + Math.random() * 2.5).toFixed(1)}px`,
            background: Math.random() > 0.5 ? '#68d3ff' : '#b088ff',
          }}
        />
      ))}
    </div>
  );
};

/* ─── Scroll-progress bar (ref-only, zero React state) ─── */
const ScrollProgress = () => {
  const barRef = useRef(null);
  useEffect(() => {
    const el = document.getElementById('lp-root');
    if (!el || !barRef.current) return;
    const bar = barRef.current;
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight) || 0;
      bar.style.transform = `scaleX(${p})`;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position:'fixed',top:64,left:0,right:0,height:2,background:'rgba(71,72,73,0.2)',zIndex:200 }}>
      <div ref={barRef} style={{ height:'100%', background:'#68d3ff', transformOrigin:'left', transform:'scaleX(0)', willChange:'transform', transition:'none' }} />
    </div>
  );
};

/* ─── Framer fade-in (one-shot, not looping) ─── */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const FadeUpView = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Feature Card ─── */
const FeatureCard = ({ icon, title, desc, color, delay }) => (
  <FadeUpView delay={delay} className="feat-card">
    <div className="feat-glow" style={{ background: color }} />
    <div className="feat-icon" style={{ background: `${color}18`, borderColor: `${color}35`, color }}>
      {icon}
    </div>
    <div>
      <h3 className="font-headline font-bold text-on-surface mb-2" style={{ fontSize: '1.05rem' }}>{title}</h3>
      <p style={{ color: '#ababac', fontSize: '0.85rem', lineHeight: 1.65 }}>{desc}</p>
    </div>
  </FadeUpView>
);

/* ─── Stat ─── */
const Stat = ({ value, label, delay }) => (
  <FadeUpView delay={delay} className="stat-item">
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </FadeUpView>
);

/* ═══════════════════════════════════════
   Main Landing Page
═══════════════════════════════════════ */
const LandingPage = ({ onEnter }) => {
  const handleEnter = useCallback(() => onEnter(), [onEnter]);

  const FEATURES = [
    { icon:'⚡', title:'SD Neural Architect', desc:'AI-powered Order-to-Cash: pricing procedures, access sequences, partner function mapping.', color:'#68d3ff', delay:0 },
    { icon:'📦', title:'MM-Link Console', desc:'Full Procure-to-Pay: ME51N → ME21N → MIGO → MIRO with live validation.', color:'#b088ff', delay:0.06 },
    { icon:'💳', title:'FICO-Sync Ledger', desc:'Real-time G/L account determination via VKOA with automated billing-to-finance postings.', color:'#93a2ff', delay:0.12 },
    { icon:'👁️', title:'Vision Neural Lab', desc:'Upload SAP GUI screenshots — AI detects misconfigurations with spatial heatmap overlays.', color:'#68d3ff', delay:0.18 },
    { icon:'📇', title:'Master Data Dossier', desc:'Multi-tier Customer & Material Master views: General, Company Code, and Sales Area.', color:'#b088ff', delay:0.24 },
    { icon:'☁️', title:'Cloud Sync Ledger', desc:'OAuth2-secured Google Sheets, Docs & Calendar integration for real-time persistence.', color:'#93a2ff', delay:0.30 },
  ];

  return (
    <>
      <ScrollProgress />

      <div id="lp-root" className="lp-root">

        {/* Ambient gradient orbs — pure CSS, GPU-composited */}
        <div className="orb orb-cyan" aria-hidden />
        <div className="orb orb-purple" aria-hidden />

        {/* Particle field — pure CSS keyframes */}
        <ParticleField />

        {/* ── NAV ── */}
        <nav className="lp-nav">
          <FadeUp delay={0} className="flex items-center gap-3">
            <div className="logo-icon">A</div>
            <span className="font-headline font-bold text-primary" style={{ fontSize:'1.05rem', letterSpacing:'-0.02em' }}>SDAssist Aether</span>
            <span className="version-tag">V9.1 Titan</span>
          </FadeUp>
          <FadeUp delay={0.05} className="flex items-center gap-6">
            <div className="hidden md:flex gap-8" style={{ fontSize:'0.83rem', color:'#ababac' }}>
              {['Product','Modules','Enterprise'].map(l => (
                <a key={l} href="#" className="nav-link">{l}</a>
              ))}
            </div>
            <button onClick={handleEnter} className="btn-primary-sm">Launch App</button>
          </FadeUp>
        </nav>

        {/* ── HERO ── */}
        <section className="hero-section">
          <div className="hero-content">
            <FadeUp delay={0}>
              <div className="pill">
                <span className="pulse-dot" />
                V9.1 · Full-Stack SAP Digital Twin — Live
              </div>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h1 className="hero-title">
                Design Enterprise Logic
                <br />
                <span className="gradient-text">at the Speed of Thought.</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.16}>
              <p className="hero-sub">
                The world's first AI-native S/4HANA Digital Twin — configure Sales Distribution,
                Materials Management, Financials and Vision Neural Lab in one Neural OS.
              </p>
            </FadeUp>

            <FadeUp delay={0.22} className="hero-cta">
              <button onClick={handleEnter} className="btn-hero">
                Enter Aether OS
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="btn-ghost">View Architecture</button>
            </FadeUp>
          </div>

          {/* UI Preview mockup */}
          <FadeUp delay={0.3} className="preview-wrap">
            <div className="preview-fade" />
            <div className="preview-inner">
              <div className="preview-sidebar">
                {['#68d3ff50','#b088ff40','#ababac25','#ababac18','#ababac12'].map((bg,i)=>(
                  <div key={i} style={{ height:36, width:36, borderRadius:10, background:bg, flexShrink:0 }} />
                ))}
              </div>
              <div className="preview-canvas">
                <svg className="absolute inset-0 w-full h-full" opacity="0.45">
                  <line x1="16%" y1="46%" x2="48%" y2="36%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="5,5"/>
                  <line x1="48%" y1="36%" x2="76%" y2="22%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="5,5"/>
                  <line x1="48%" y1="36%" x2="76%" y2="60%" stroke="#b088ff" strokeWidth="1" strokeDasharray="5,5"/>
                  <line x1="48%" y1="36%" x2="30%" y2="64%" stroke="#93a2ff" strokeWidth="1" strokeDasharray="5,5"/>
                </svg>
                {[
                  {l:'10%',t:'38%',c:'#68d3ff',n:'Sales Org'},
                  {l:'42%',t:'28%',c:'#b088ff',n:'Dist. Channel'},
                  {l:'70%',t:'15%',c:'#93a2ff',n:'Plant 1000'},
                  {l:'70%',t:'53%',c:'#93a2ff',n:'Plant 2000'},
                  {l:'24%',t:'58%',c:'#68d3ff',n:'Company Code'},
                ].map((n,i)=>(
                  <div key={i} style={{position:'absolute',left:n.l,top:n.t,transform:'translate(-50%,-50%)'}}>
                    <div className="node-chip" style={{color:n.c,borderColor:`${n.c}50`,background:`${n.c}14`}}>
                      {n.n}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ── STATS ── */}
        <section className="stats-section">
          <Stat value="12+" label="SAP Modules" delay={0} />
          <Stat value="99%" label="Config Accuracy" delay={0.08} />
          <Stat value="3×" label="Faster Deploy" delay={0.16} />
          <Stat value="∞" label="Neural Capacity" delay={0.24} />
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section">
          <FadeUpView className="features-header">
            <div className="eyebrow">Full-Spectrum Intelligence</div>
            <h2 className="font-headline font-bold text-on-surface" style={{ fontSize:'clamp(2rem,4vw,3.2rem)', letterSpacing:'-0.03em', lineHeight:1.15, marginBottom:'0.75rem' }}>
              Every SAP Module.<br />One Neural Brain.
            </h2>
            <p style={{ color:'#ababac', maxWidth:520, lineHeight:1.65, fontSize:'0.95rem' }}>
              From Pricing Procedures (ZIM24) to Procurement cycles, Aether's multi-agent core bridges business logic and technical precision.
            </p>
          </FadeUpView>
          <div className="features-grid">
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>

        {/* ── CTA BLOCK ── */}
        <section className="cta-section">
          <FadeUpView className="cta-block">
            <div className="eyebrow" style={{ justifyContent:'center' }}>Ready to Deploy?</div>
            <h2 className="font-headline font-bold text-on-surface" style={{ fontSize:'clamp(2rem,4.5vw,3.5rem)', letterSpacing:'-0.035em', lineHeight:1.1, marginBottom:'1rem', textAlign:'center' }}>
              Your Digital Twin<br />Awaits Activation.
            </h2>
            <p style={{ color:'#ababac', maxWidth:420, textAlign:'center', lineHeight:1.65, fontSize:'0.95rem', marginBottom:'2.5rem' }}>
              Step inside Aether OS. Configure S/4HANA architecture faster, smarter, with full neural precision.
            </p>
            <button onClick={handleEnter} className="btn-cta">
              Initialize Aether OS →
            </button>
          </FadeUpView>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="flex items-center gap-3">
            <div className="logo-icon">A</div>
            <span className="font-headline font-bold text-primary" style={{ fontSize:'0.9rem' }}>SDAssist Aether</span>
            <span className="version-tag">V9.1</span>
          </div>
          <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', color:'rgba(171,171,172,0.35)' }}>
            Google Antigravity Hackathon 2026 · Neural Editorial System
          </span>
          <div style={{ display:'flex', gap:24, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', color:'rgba(171,171,172,0.35)' }}>
            {['Status','Docs','Privacy'].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </footer>
      </div>

      {/* ══════════════════════════════════════════════
          ALL STYLES — GPU-composited, no layout thrash
      ══════════════════════════════════════════════ */}
      <style>{`
        /* ── Root ── */
        .lp-root {
          position: absolute; inset: 0;
          overflow-y: auto; overflow-x: hidden;
          background: #0d0e0f;
          -webkit-overflow-scrolling: touch;
        }

        /* ── Ambient orbs (static CSS, zero JS) ── */
        .orb {
          position: fixed; border-radius: 50%;
          pointer-events: none; z-index: 0;
          will-change: opacity;
        }
        .orb-cyan {
          width: 55vw; height: 55vw;
          top: -15%; right: -12%;
          background: radial-gradient(circle, rgba(104,211,255,0.1) 0%, transparent 70%);
          filter: blur(80px);
        }
        .orb-purple {
          width: 45vw; height: 45vw;
          bottom: -10%; left: -8%;
          background: radial-gradient(circle, rgba(176,136,255,0.08) 0%, transparent 70%);
          filter: blur(80px);
        }

        /* ── Particles — pure CSS, GPU transform only ── */
        .particle-field {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 1;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: floatParticle linear infinite;
          will-change: transform, opacity;
        }
        @keyframes floatParticle {
          0%   { transform: translateY(0px) scale(1); opacity: 0; }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.3; }
          100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        }

        /* ── Nav ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; z-index: 100;
          background: rgba(13,14,15,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(71,72,73,0.2);
        }
        .logo-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(104,211,255,0.15);
          border: 1px solid rgba(104,211,255,0.3);
          display: flex; align-items: center; justify-content: center;
          color: #68d3ff; font-weight: 700; font-size: 0.85rem;
          font-family: 'Space Grotesk', sans-serif; flex-shrink: 0;
        }
        .version-tag {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.2em; color: rgba(171,171,172,0.32);
          font-family: 'Inter', sans-serif; display: none;
        }
        @media (min-width: 768px) { .version-tag { display: block; } }
        .nav-link { transition: color 0.18s ease; }
        .nav-link:hover { color: #68d3ff; }

        /* ── Buttons ── */
        .btn-primary-sm {
          padding: 7px 18px; border-radius: 999px;
          background: #68d3ff; color: #003c4f;
          font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.8rem;
          border: none; cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.18s ease;
          will-change: transform;
        }
        .btn-primary-sm:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(104,211,255,0.4); }
        .btn-primary-sm:active { transform: scale(0.96); }

        .btn-hero {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 34px; border-radius: 1.2rem;
          background: #68d3ff; color: #003c4f;
          font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1rem;
          border: none; cursor: pointer;
          box-shadow: 0 8px 28px rgba(0,0,0,0.3);
          transition: transform 0.18s ease, box-shadow 0.2s ease;
          will-change: transform;
        }
        .btn-hero:hover { transform: translateY(-2px); box-shadow: 0 0 28px rgba(104,211,255,0.35), 0 12px 36px rgba(0,0,0,0.4); }
        .btn-hero:active { transform: translateY(0) scale(0.98); }

        .btn-ghost {
          padding: 15px 34px; border-radius: 1.2rem;
          border: 1px solid rgba(71,72,73,0.4); background: transparent;
          color: rgba(255,255,255,0.8); font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; font-size: 1rem; cursor: pointer;
          transition: border-color 0.18s, background 0.18s, transform 0.15s;
          will-change: transform;
        }
        .btn-ghost:hover { border-color: rgba(104,211,255,0.38); background: rgba(104,211,255,0.06); transform: translateY(-2px); }
        .btn-ghost:active { transform: translateY(0); }

        .btn-cta {
          padding: 17px 46px; border-radius: 1.4rem;
          background: linear-gradient(135deg, #68d3ff, #b088ff);
          color: #001630; font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 1.05rem; border: none; cursor: pointer;
          box-shadow: 0 0 28px rgba(104,211,255,0.28), 0 14px 36px rgba(0,0,0,0.4);
          transition: transform 0.18s ease, box-shadow 0.2s ease;
          will-change: transform;
        }
        .btn-cta:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 0 44px rgba(104,211,255,0.38), 0 18px 44px rgba(0,0,0,0.5); }
        .btn-cta:active { transform: scale(0.98); }

        /* ── Hero ── */
        .hero-section {
          position: relative; z-index: 10;
          min-height: 100vh; padding-top: 80px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding-inline: 1.5rem;
        }
        .hero-content {
          max-width: 820px; text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          border: 1px solid rgba(104,211,255,0.22);
          background: rgba(104,211,255,0.07);
          color: #68d3ff; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.18em;
          font-family: 'Inter', sans-serif; margin-bottom: 1.75rem;
        }
        .pulse-dot {
          display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: #68d3ff;
          animation: lpPulse 2.4s ease infinite;
          will-change: opacity, transform;
        }
        @keyframes lpPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .hero-title {
          font-family: 'Space Grotesk', sans-serif; font-weight: 700;
          letter-spacing: -0.04em; line-height: 1.06;
          color: #fff; margin-bottom: 1.1rem;
          font-size: clamp(2.4rem, 6.5vw, 5.8rem);
        }
        .gradient-text {
          background: linear-gradient(90deg, #68d3ff 0%, #b088ff 50%, #68d3ff 100%);
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradShift 7s ease infinite;
          will-change: background-position;
        }
        @keyframes gradShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .hero-sub {
          color: #ababac; font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          max-width: 38rem; line-height: 1.7;
          font-family: 'Inter', sans-serif; font-weight: 300;
          margin-bottom: 2.2rem;
        }
        .hero-cta {
          display: flex; flex-wrap: wrap; align-items: center;
          justify-content: center; gap: 1rem; margin-bottom: 4rem;
        }

        /* ── Preview ── */
        .preview-wrap {
          position: relative; z-index: 10; width: 100%;
          max-width: 860px; padding-inline: 1rem;
          will-change: transform, opacity;
        }
        .preview-fade {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(to top, #0d0e0f 0%, transparent 55%);
          border-radius: 1.8rem;
        }
        .preview-inner {
          border-radius: 1.8rem; overflow: hidden;
          border: 1px solid rgba(71,72,73,0.28);
          box-shadow: 0 32px 80px rgba(0,0,0,0.7);
          background: #121315;
          display: flex; gap: 1rem; padding: 1.25rem;
          min-height: 240px;
        }
        .preview-sidebar {
          width: 44px; background: rgba(24,26,27,0.7);
          border-radius: 0.9rem; display: flex;
          flex-direction: column; gap: 7px; padding: 9px;
          border: 1px solid rgba(71,72,73,0.15); flex-shrink: 0;
        }
        .preview-canvas {
          flex: 1; background: rgba(24,26,27,0.55);
          border-radius: 0.9rem; border: 1px solid rgba(71,72,73,0.12);
          position: relative; overflow: hidden;
        }
        .node-chip {
          font-family: 'Space Grotesk', sans-serif; font-size: 9px;
          font-weight: 700; padding: 3px 9px; border-radius: 7px;
          border: 1px solid; white-space: nowrap;
        }

        /* ── Stats ── */
        .stats-section {
          position: relative; z-index: 10;
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem; padding: 4rem 2rem;
          max-width: 860px; margin: 0 auto;
          border-top: 1px solid rgba(71,72,73,0.12);
        }
        @media (min-width: 640px) {
          .stats-section { grid-template-columns: repeat(4, 1fr); }
        }
        .stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .stat-value {
          font-family: 'Space Grotesk', sans-serif; font-weight: 700;
          font-size: clamp(2.2rem, 5vw, 3rem); color: #68d3ff;
          filter: drop-shadow(0 0 16px rgba(104,211,255,0.35));
        }
        .stat-label {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.22em; color: rgba(171,171,172,0.5);
          font-family: 'Inter', sans-serif;
        }

        /* ── Features ── */
        .features-section {
          position: relative; z-index: 10;
          padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto;
        }
        .features-header { max-width: 540px; margin-bottom: 3rem; }
        .features-grid {
          display: grid; gap: 1.25rem;
          grid-template-columns: repeat(1, 1fr);
        }
        @media (min-width: 640px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }

        .feat-card {
          position: relative; padding: 1.75rem; border-radius: 1.6rem;
          border: 1px solid rgba(71,72,73,0.12);
          background: rgba(18,19,21,0.6);
          display: flex; flex-direction: column; gap: 1rem;
          overflow: hidden; cursor: default;
          transition: transform 0.24s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.24s ease, background 0.24s ease;
          will-change: transform;
        }
        .feat-card:hover {
          transform: translateY(-5px) translateZ(0);
          border-color: rgba(104,211,255,0.2);
          background: rgba(30,32,33,0.65);
        }
        .feat-glow {
          position: absolute; top: -24px; right: -24px;
          width: 100px; height: 100px; border-radius: 50%;
          filter: blur(36px); opacity: 0;
          transition: opacity 0.35s ease; pointer-events: none;
        }
        .feat-card:hover .feat-glow { opacity: 0.16; }
        .feat-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; border: 1px solid; flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .feat-card:hover .feat-icon { transform: scale(1.08); }

        /* ── Eyebrow ── */
        .eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Inter', sans-serif; font-size: 10px;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.25em; color: #68d3ff;
          margin-bottom: 0.75rem;
        }

        /* ── CTA ── */
        .cta-section {
          position: relative; z-index: 10;
          padding: 4rem 1.5rem 6rem; max-width: 900px; margin: 0 auto;
        }
        .cta-block {
          border-radius: 2.5rem;
          border: 1px solid rgba(104,211,255,0.18);
          background: linear-gradient(135deg, rgba(104,211,255,0.07), rgba(176,136,255,0.04), rgba(13,14,15,0.9));
          padding: 4rem 2rem;
          display: flex; flex-direction: column; align-items: center;
        }

        /* ── Footer ── */
        .lp-footer {
          position: relative; z-index: 10;
          border-top: 1px solid rgba(71,72,73,0.12);
          padding: 2rem 2rem;
          display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: 0.75rem;
          max-width: 1100px; margin: 0 auto;
        }
        .footer-link { transition: color 0.18s ease; }
        .footer-link:hover { color: #68d3ff; }
      `}</style>
    </>
  );
};

export default LandingPage;
