import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   Neural Canvas — GPU-accelerated, optimized to ~35 nodes
   Mouse tracking via ref (zero React re-renders)
───────────────────────────────────────────────────────── */
const NeuralCanvas = ({ nodeCount = 35, opacity = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animId = null;
    let W = 0, H = 0;
    let mouse = { x: 0, y: 0 };
    let nodes = [];
    let lastTime = 0;
    const FPS_CAP = 60;
    const INTERVAL = 1000 / FPS_CAP;
    const CONNECT_DIST = 150;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 350 + 80,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1.2,
        hue: Math.random() < 0.55 ? 195 : 260,
      });
    }

    const project = (n) => {
      const fl = 500;
      const sc = fl / (fl + n.z);
      const cx = W / 2, cy = H / 2;
      const dx = (mouse.x - cx) * 0.025 * sc;
      const dy = (mouse.y - cy) * 0.025 * sc;
      return {
        px: (n.x - cx) * sc + cx + dx,
        py: (n.y - cy) * sc + cy + dy,
        sc,
      };
    };

    const draw = (ts) => {
      animId = requestAnimationFrame(draw);
      if (ts - lastTime < INTERVAL) return;
      lastTime = ts;

      ctx.clearRect(0, 0, W, H);

      // Pre-project all nodes
      const proj = nodes.map(project);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = proj[i].px - proj[j].px;
          const dy = proj[i].py - proj[j].py;
          const d2 = dx * dx + dy * dy;
          if (d2 > CONNECT_DIST * CONNECT_DIST) continue;
          const d = Math.sqrt(d2);
          const alpha = (1 - d / CONNECT_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(proj[i].px, proj[i].py);
          ctx.lineTo(proj[j].px, proj[j].py);
          ctx.strokeStyle = `hsla(${nodes[i].hue},100%,75%,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const { px, py, sc } = proj[i];
        const r = n.r * sc * 1.8;
        const alpha = 0.3 + 0.7 * sc;

        // outer glow (paint once, cheap)
        ctx.beginPath();
        ctx.arc(px, py, r * 5, 0, 6.28318);
        const g = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
        g.addColorStop(0, `hsla(${n.hue},100%,75%,${alpha * 0.3})`);
        g.addColorStop(1, `hsla(${n.hue},100%,75%,0)`);
        ctx.fillStyle = g;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(px, py, r, 0, 6.28318);
        ctx.fillStyle = `hsla(${n.hue},100%,82%,${alpha})`;
        ctx.fill();

        // move
        n.x += n.vx; n.y += n.vy; n.z += n.vz;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        if (n.z < 80 || n.z > 430) n.vz *= -1;
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, [nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        opacity,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
};

/* ─── Smooth scroll progress indicator ─── */
const ScrollLine = () => {
  const lineRef = useRef(null);
  useEffect(() => {
    const el = document.getElementById('lp-scroll');
    if (!el || !lineRef.current) return;
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
      lineRef.current.style.transform = `scaleX(${p})`;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-16 left-0 right-0 h-[2px] z-50 bg-outline-variant/20">
      <div ref={lineRef} className="h-full bg-primary origin-left transition-none"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }} />
    </div>
  );
};

/* ─── Feature Card ─── */
const FeatureCard = ({ icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    className="feature-card group relative p-8 rounded-[2rem] border border-outline-variant/10 bg-surface-container-low/60 flex flex-col gap-5 overflow-hidden"
    style={{ willChange: 'transform, opacity' }}
  >
    <div className="card-glow" style={{ background: color }} />
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}
    >
      {icon}
    </div>
    <div>
      <h3 className="font-headline text-lg font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

/* ─── Stat ─── */
const Stat = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
    className="flex flex-col items-center gap-1"
  >
    <span className="font-headline text-5xl font-bold" style={{ color: '#68d3ff', textShadow: '0 0 30px rgba(104,211,255,0.4)' }}>{value}</span>
    <span className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">{label}</span>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────
   Main Landing Page
───────────────────────────────────────────────────────── */
const LandingPage = ({ onEnter }) => {
  const handleEnter = useCallback(() => onEnter(), [onEnter]);

  return (
    <>
      <ScrollLine />

      {/* Scrollable container — single overflow context = no jitter */}
      <div id="lp-scroll" className="lp-scroll-container">

        {/* ── Fixed ambient glows ── */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          <div className="lp-glow lp-glow-cyan" />
          <div className="lp-glow lp-glow-purple" />
        </div>

        {/* ── Nav ── */}
        <nav className="lp-nav">
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="lp-logo-icon">A</div>
            <span className="font-headline text-[1.1rem] font-bold text-primary tracking-tight">SDAssist Aether</span>
            <span className="hidden md:block lp-version-badge">V9.1 Titan</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-6 md:gap-8"
          >
            <div className="hidden md:flex gap-8 text-[0.82rem] font-body text-on-surface-variant">
              {['Product', 'Modules', 'Enterprise'].map(l => (
                <a key={l} href="#" className="hover:text-primary transition-colors duration-200">{l}</a>
              ))}
            </div>
            <button onClick={handleEnter} className="lp-btn-primary">
              Launch App
            </button>
          </motion.div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          {/* Canvas absolutely behind */}
          <div className="absolute inset-0 z-0">
            <NeuralCanvas nodeCount={38} opacity={0.65} />
          </div>

          {/* Decorative SVG rings */}
          <div className="lp-rings" aria-hidden>
            <motion.div className="lp-ring lp-ring-1"
              animate={{ rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}>
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <ellipse cx="250" cy="250" rx="220" ry="75" stroke="#68d3ff" strokeWidth="1" fill="none"
                  strokeDasharray="6 10" transform="rotate(-25 250 250)" opacity="0.6" />
              </svg>
            </motion.div>
            <motion.div className="lp-ring lp-ring-2"
              animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}>
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <ellipse cx="250" cy="250" rx="170" ry="60" stroke="#b088ff" strokeWidth="1" fill="none"
                  strokeDasharray="4 8" transform="rotate(18 250 250)" opacity="0.5" />
              </svg>
            </motion.div>
          </div>

          {/* Hero text */}
          <div className="lp-hero-content">
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lp-pill"
            >
              <span className="lp-pulse-dot" />
              V9.1 · Full-Stack SAP Digital Twin — Live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="lp-headline"
            >
              Design Enterprise Logic
              <br />
              <span className="lp-gradient-text">at the Speed of Thought.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="lp-sub"
            >
              The world's first AI-native S/4HANA Digital Twin. Configure Sales Distribution,
              Materials Management, Financials, and Neural Vision — all in one Neural OS.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="lp-cta-row"
            >
              <button onClick={handleEnter} className="lp-btn-hero">
                Enter Aether OS
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="lp-btn-ghost">
                View Architecture
              </button>
            </motion.div>
          </div>

          {/* 3D UI Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lp-preview"
          >
            {/* fade-to-bg gradient overlay */}
            <div className="lp-preview-fade" />
            <div className="lp-preview-inner">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(104,211,255,0.06),transparent_70%)]" />
              {/* sidebar stub */}
              <div className="lp-preview-sidebar">
                {['#68d3ff45', '#b088ff40', '#ababac25', '#ababac20', '#ababac15'].map((bg, i) => (
                  <div key={i} className="h-9 w-9 rounded-xl" style={{ background: bg }} />
                ))}
              </div>
              {/* canvas area */}
              <div className="lp-preview-canvas">
                <svg className="absolute inset-0 w-full h-full" opacity="0.5">
                  <line x1="18%" y1="48%" x2="50%" y2="38%" stroke="#68d3ff" strokeWidth="1.2" strokeDasharray="5,5" />
                  <line x1="50%" y1="38%" x2="78%" y2="25%" stroke="#68d3ff" strokeWidth="1.2" strokeDasharray="5,5" />
                  <line x1="50%" y1="38%" x2="78%" y2="62%" stroke="#b088ff" strokeWidth="1.2" strokeDasharray="5,5" />
                  <line x1="50%" y1="38%" x2="32%" y2="68%" stroke="#93a2ff" strokeWidth="1.2" strokeDasharray="5,5" />
                </svg>
                {[
                  { l: '12%', t: '40%', c: '#68d3ff', n: 'Sales Org' },
                  { l: '44%', t: '30%', c: '#b088ff', n: 'Dist. Channel' },
                  { l: '72%', t: '18%', c: '#93a2ff', n: 'Plant 1000' },
                  { l: '72%', t: '55%', c: '#93a2ff', n: 'Plant 2000' },
                  { l: '26%', t: '62%', c: '#68d3ff', n: 'Company Code' },
                ].map((nd, i) => (
                  <div key={i} className="absolute" style={{ left: nd.l, top: nd.t, transform: 'translate(-50%,-50%)' }}>
                    <div className="lp-node-chip" style={{ color: nd.c, borderColor: `${nd.c}50`, background: `${nd.c}14` }}>
                      {nd.n}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <section className="lp-stats-section">
          <div className="lp-stats-grid">
            <Stat value="12+" label="SAP Modules" delay={0} />
            <Stat value="99%" label="Config Accuracy" delay={0.1} />
            <Stat value="3×" label="Faster Deploy" delay={0.2} />
            <Stat value="∞" label="Neural Capacity" delay={0.3} />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="lp-section">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
              className="max-w-2xl mb-16"
            >
              <div className="lp-eyebrow">Full-Spectrum Intelligence</div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-on-surface mb-4">
                Every SAP Module.<br />One Neural Brain.
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                From Pricing Procedures (ZIM24) to Procurement cycles, Aether's multi-agent core bridges the gap between business logic and technical precision.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: '⚡', title: 'SD Neural Architect', desc: 'AI-powered Order-to-Cash with Condition Technique, Access Sequences & Partner Function mapping.', color: '#68d3ff', delay: 0 },
                { icon: '📦', title: 'MM-Link Console', desc: 'Full Procure-to-Pay lifecycle from ME51N Purchase Requisition to MIRO Invoice Verification.', color: '#b088ff', delay: 0.07 },
                { icon: '💳', title: 'FICO-Sync Ledger', desc: 'Real-time G/L account determination via VKOA and automated Accounts Receivable reconciliation.', color: '#93a2ff', delay: 0.14 },
                { icon: '👁️', title: 'Vision Neural Lab', desc: 'Upload SAP GUI screenshots — AI detects misconfigurations with spatial heatmap overlays.', color: '#68d3ff', delay: 0.21 },
                { icon: '📇', title: 'Master Data Dossier', desc: 'Multi-tier Customer & Material Master views: General, Company Code, and Sales Area intelligence.', color: '#b088ff', delay: 0.28 },
                { icon: '☁️', title: 'Cloud Sync Ledger', desc: 'OAuth2-secured Google Sheets, Docs, and Calendar integration for enterprise data persistence.', color: '#93a2ff', delay: 0.35 },
              ].map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </section>

        {/* ── DEEP DIVE ── */}
        <section className="lp-section">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lp-cta-block"
            >
              <div className="lp-eyebrow" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>Ready to Deploy?</div>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-5 text-center"
                style={{ textShadow: '0 0 60px rgba(104,211,255,0.25)' }}>
                Your Digital Twin<br />Awaits Activation.
              </h2>
              <p className="text-on-surface-variant text-base max-w-lg text-center mb-10 mx-auto leading-relaxed">
                Step inside Aether OS. Configure S/4HANA architecture faster, smarter, and with full neural precision.
              </p>
              <button onClick={handleEnter} className="lp-btn-cta">
                Initialize Aether OS →
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="flex items-center gap-3">
            <div className="lp-logo-icon">A</div>
            <span className="font-headline font-bold text-primary text-sm">SDAssist Aether</span>
            <span className="lp-version-badge">V9.1</span>
          </div>
          <span className="lp-footer-copy">Google Antigravity Hackathon 2026 · Neural Editorial System</span>
          <div className="flex gap-6 text-[11px] uppercase tracking-widest text-on-surface-variant/40">
            {['Status', 'Docs', 'Privacy'].map(l => (
              <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
        </footer>

      </div>

      {/* ── All CSS in one block, no inline styles scattered ── */}
      <style>{`
        /* Scrollable container */
        .lp-scroll-container {
          position: absolute;
          inset: 0;
          overflow-y: auto;
          overflow-x: hidden;
          background: #0d0e0f;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Ambient glows */
        .lp-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .lp-glow-cyan {
          top: -15%; right: -10%;
          width: 65vw; height: 65vw;
          background: radial-gradient(circle, rgba(104,211,255,0.09) 0%, transparent 70%);
        }
        .lp-glow-purple {
          bottom: -20%; left: -10%;
          width: 55vw; height: 55vw;
          background: radial-gradient(circle, rgba(176,136,255,0.07) 0%, transparent 70%);
        }

        /* Nav */
        .lp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 100;
          background: rgba(13,14,15,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(71,72,73,0.2);
          will-change: transform;
        }
        .lp-logo-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(104,211,255,0.15);
          border: 1px solid rgba(104,211,255,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #68d3ff;
          font-weight: 700;
          font-size: 0.9rem;
          font-family: 'Space Grotesk', sans-serif;
          flex-shrink: 0;
        }
        .lp-version-badge {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(171,171,172,0.35);
          font-family: 'Inter', sans-serif;
        }

        /* Buttons */
        .lp-btn-primary {
          padding: 8px 20px;
          border-radius: 999px;
          background: #68d3ff;
          color: #00465b;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.82rem;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .lp-btn-primary:hover {
          transform: scale(1.04);
          box-shadow: 0 0 24px rgba(104,211,255,0.45);
        }
        .lp-btn-primary:active { transform: scale(0.97); }

        .lp-btn-hero {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 1.25rem;
          background: #68d3ff;
          color: #003c4f;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          border: none;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 30px rgba(0,0,0,0.35);
        }
        .lp-btn-hero:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 32px rgba(104,211,255,0.4), 0 12px 40px rgba(0,0,0,0.45);
        }
        .lp-btn-hero:active { transform: translateY(0) scale(0.98); }

        .lp-btn-ghost {
          padding: 16px 36px;
          border-radius: 1.25rem;
          border: 1px solid rgba(71,72,73,0.35);
          background: transparent;
          color: rgba(255,255,255,0.85);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 1.05rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .lp-btn-ghost:hover {
          border-color: rgba(104,211,255,0.4);
          background: rgba(104,211,255,0.06);
          transform: translateY(-2px);
        }
        .lp-btn-ghost:active { transform: translateY(0); }

        .lp-btn-cta {
          padding: 18px 48px;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, #68d3ff, #b088ff);
          color: #001630;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 30px rgba(104,211,255,0.3), 0 16px 40px rgba(0,0,0,0.4);
        }
        .lp-btn-cta:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 0 50px rgba(104,211,255,0.4), 0 20px 50px rgba(0,0,0,0.5);
        }
        .lp-btn-cta:active { transform: translateY(0) scale(0.98); }

        /* Hero */
        .lp-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 64px;
          overflow: hidden;
        }
        .lp-rings {
          position: absolute;
          right: -60px;
          top: 50%;
          transform: translateY(-50%);
          width: 520px;
          height: 520px;
          pointer-events: none;
          opacity: 0.18;
        }
        .lp-ring {
          position: absolute;
          inset: 0;
        }
        .lp-ring-1, .lp-ring-2 { will-change: transform; }

        .lp-hero-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 1.5rem;
          max-width: 62rem;
          margin: 0 auto;
        }
        .lp-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(104,211,255,0.25);
          background: rgba(104,211,255,0.07);
          color: #68d3ff;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-family: 'Inter', sans-serif;
          margin-bottom: 2rem;
        }
        .lp-pulse-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #68d3ff;
          animation: lpPulse 2.2s ease infinite;
        }
        @keyframes lpPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .lp-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.04;
          color: #fff;
          margin-bottom: 1.25rem;
          font-size: clamp(2.6rem, 7vw, 6rem);
          text-shadow: 0 0 80px rgba(104,211,255,0.15);
        }
        .lp-gradient-text {
          background: linear-gradient(90deg, #68d3ff 0%, #b088ff 50%, #68d3ff 100%);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: lpGrad 6s ease infinite;
        }
        @keyframes lpGrad {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .lp-sub {
          color: #ababac;
          font-size: 1.05rem;
          max-width: 36rem;
          line-height: 1.7;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          margin-bottom: 2.5rem;
        }
        .lp-cta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 4.5rem;
        }

        /* Preview card */
        .lp-preview {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem 0;
          will-change: transform, opacity;
        }
        .lp-preview-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #0d0e0f 0%, transparent 50%);
          z-index: 2;
          pointer-events: none;
          border-radius: 2rem;
        }
        .lp-preview-inner {
          position: relative;
          border-radius: 2rem;
          overflow: hidden;
          border: 1px solid rgba(71,72,73,0.3);
          box-shadow: 0 40px 100px rgba(0,0,0,0.75);
          background: #121315;
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          min-height: 280px;
        }
        .lp-preview-sidebar {
          width: 48px;
          background: rgba(24,26,27,0.8);
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px;
          border: 1px solid rgba(71,72,73,0.2);
          flex-shrink: 0;
        }
        .lp-preview-canvas {
          flex: 1;
          background: rgba(24,26,27,0.6);
          border-radius: 1rem;
          border: 1px solid rgba(71,72,73,0.15);
          position: relative;
          overflow: hidden;
        }
        .lp-node-chip {
          font-family: 'Space Grotesk', monospace;
          font-size: 9px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          border-width: 1px;
          border-style: solid;
          white-space: nowrap;
        }

        /* Stats */
        .lp-stats-section {
          padding: 5rem 1.5rem;
          position: relative;
          z-index: 10;
          border-top: 1px solid rgba(71,72,73,0.12);
        }
        .lp-stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        }
        @media (min-width: 768px) {
          .lp-stats-grid { grid-template-columns: repeat(4, 1fr); }
        }

        /* Sections */
        .lp-section {
          padding: 6rem 0;
          position: relative;
          z-index: 10;
        }

        /* Feature card CSS hover (GPU, no React state) */
        .feature-card {
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), border-color 0.28s ease, background 0.28s ease;
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-6px) translateZ(0);
          border-color: rgba(104,211,255,0.2);
          background: rgba(30,32,33,0.7);
        }
        .card-glow {
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .feature-card:hover .card-glow { opacity: 0.18; }

        /* Eyebrow label */
        .lp-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #68d3ff;
          margin-bottom: 1rem;
        }

        /* CTA block */
        .lp-cta-block {
          border-radius: 3rem;
          border: 1px solid rgba(104,211,255,0.2);
          background: linear-gradient(135deg, rgba(104,211,255,0.07), rgba(176,136,255,0.04), rgba(13,14,15,0.9));
          padding: 5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        /* Footer */
        .lp-footer {
          position: relative;
          z-index: 10;
          border-top: 1px solid rgba(71,72,73,0.12);
          padding: 2.5rem 2rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .lp-footer-copy {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(171,171,172,0.35);
        }
      `}</style>
    </>
  );
};

export default LandingPage;
