import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── 3D Neural Canvas ─── */
const NeuralCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    const NODE_COUNT = 60;
    const nodes = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 400 + 50,       // depth  50-450
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2.5 + 1,
        hue: Math.random() < 0.5 ? 195 : 260, // cyan or purple
      });
    }

    let mx = W / 2, my = H / 2;
    const onMouse = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMouse);

    const project = (n) => {
      const fl = 500;
      const scale = fl / (fl + n.z);
      const cx = W / 2, cy = H / 2;
      const px = (n.x - cx) * scale + cx + (mx - cx) * 0.03 * scale;
      const py = (n.y - cy) * scale + cy + (my - cy) * 0.03 * scale;
      return { px, py, scale };
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const { px: ax, py: ay } = project(a);
          const { px: bx, py: by } = project(b);
          const d = Math.hypot(ax - bx, ay - by);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            const alpha = (1 - d / 140) * 0.25 * ((a.hue === 195) ? 1 : 0.7);
            ctx.strokeStyle = `hsla(${a.hue},100%,75%,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        const { px, py, scale } = project(n);
        const r = n.r * scale * 1.6;
        const alpha = 0.4 + 0.6 * scale;

        // glow
        const g = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
        g.addColorStop(0, `hsla(${n.hue},100%,75%,${alpha * 0.4})`);
        g.addColorStop(1, `hsla(${n.hue},100%,75%,0)`);
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue},100%,80%,${alpha})`;
        ctx.fill();

        // movement
        n.x += n.vx; n.y += n.vy; n.z += n.vz;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        if (n.z < 50 || n.z > 450) n.vz *= -1;
      });

      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
};

/* ─── Orbital Rings SVG (decorative 3D effect) ─── */
const OrbitalRings = () => (
  <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 pointer-events-none opacity-20 hidden lg:block">
    <motion.svg width="700" height="700" viewBox="0 0 700 700"
      animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
      <ellipse cx="350" cy="350" rx="300" ry="100" stroke="#68d3ff" strokeWidth="1" fill="none"
        strokeDasharray="6 10" transform="rotate(-30 350 350)" />
    </motion.svg>
    <motion.svg width="700" height="700" viewBox="0 0 700 700"
      className="absolute inset-0"
      animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}>
      <ellipse cx="350" cy="350" rx="240" ry="80" stroke="#b088ff" strokeWidth="1" fill="none"
        strokeDasharray="4 8" transform="rotate(20 350 350)" />
    </motion.svg>
    <motion.svg width="700" height="700" viewBox="0 0 700 700"
      className="absolute inset-0"
      animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}>
      <ellipse cx="350" cy="350" rx="330" ry="130" stroke="#93a2ff" strokeWidth="0.5" fill="none"
        strokeDasharray="2 6" transform="rotate(50 350 350)" />
    </motion.svg>

    {/* Floating dots on orbital paths */}
    {[
      { cx: 650, cy: 350, color: '#68d3ff', dur: 60 },
      { cx: 590, cy: 270, color: '#b088ff', dur: 45 },
      { cx: 680, cy: 430, color: '#93a2ff', dur: 80 },
    ].map((dot, i) => (
      <motion.div key={i}
        className="absolute w-3 h-3 rounded-full"
        style={{ background: dot.color, boxShadow: `0 0 12px ${dot.color}`, left: 0, top: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: dot.dur, repeat: Infinity, ease: 'linear' }}
      />
    ))}
  </div>
);

/* ─── Feature Card ─── */
const FeatureCard = ({ icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="relative group p-8 rounded-[2rem] border border-outline-variant/10 bg-surface-container-low/60 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col gap-6 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-500 rounded-[2rem]" />
    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"
      style={{ background: color }} />
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-outline-variant/20 group-hover:scale-110 transition-transform duration-300 text-2xl relative z-10"
      style={{ background: `${color}15`, color }}>
      {icon}
    </div>
    <div className="relative z-10">
      <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed font-body">{desc}</p>
    </div>
  </motion.div>
);

/* ─── Stats Ticker ─── */
const Stat = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
    className="text-center"
  >
    <div className="font-headline text-5xl font-bold text-primary mb-1">{value}</div>
    <div className="text-[11px] text-on-surface-variant uppercase tracking-[0.2em] font-body">{label}</div>
  </motion.div>
);

/* ─── Main Landing Page ─── */
const LandingPage = ({ onEnter }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-on-surface font-body overflow-x-hidden select-none">
      {/* ── Global ambient gradients ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      {/* ── Sticky Top Nav ── */}
      <nav className="fixed top-0 w-full h-16 z-50 flex items-center justify-between px-8 lg:px-16"
        style={{ background: 'rgba(13,14,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(71,72,73,0.2)' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">A</div>
          <span className="font-headline text-xl font-bold text-primary tracking-tight">SDAssist Aether</span>
          <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 ml-2">v9.0 Titan</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-sm font-body text-on-surface-variant">
            {['Product', 'Features', 'Modules', 'Enterprise'].map(l => (
              <a key={l} href="#" className="hover:text-primary transition-colors duration-300">{l}</a>
            ))}
          </div>
          <button onClick={onEnter}
            className="px-5 py-2 rounded-full bg-primary text-background font-headline font-bold text-sm hover:shadow-[0_0_20px_rgba(104,211,255,0.5)] transition-all duration-300 hover:scale-105 active:scale-95">
            Launch App
          </button>
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* 3D Canvas background */}
        <div className="absolute inset-0 z-0">
          <NeuralCanvas />
        </div>
        <OrbitalRings />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Aether V9.0 Titan Enterprise Core — Now Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
            className="font-headline font-bold tracking-tighter leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', textShadow: '0 0 80px rgba(104,211,255,0.2)' }}
          >
            Design Enterprise Logic{' '}
            <br className="hidden md:block" />
            <span style={{
              background: 'linear-gradient(90deg, #68d3ff, #b088ff, #68d3ff)',
              backgroundSize: '200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 4s ease infinite'
            }}>
              at the Speed of Thought.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-body font-light"
          >
            The world's first AI-native SAP S/4HANA Digital Twin. Configure, validate, and architect
            Sales Distribution, Materials Management, and Financials — all in one Neural OS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <button
              onClick={onEnter}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="px-10 py-5 rounded-[1.5rem] bg-primary text-background font-headline font-bold text-lg transition-all duration-300 flex items-center gap-3 hover:scale-105 active:scale-95"
              style={{ boxShadow: hovered ? '0 0 40px rgba(104,211,255,0.5), 0 20px 60px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.4)' }}
            >
              <span>Enter Aether OS</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="px-10 py-5 rounded-[1.5rem] border border-outline-variant/30 text-on-surface font-headline font-medium text-lg hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center gap-3">
              View Architecture
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
              </svg>
            </button>
          </motion.div>

          {/* 3D UI Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl rounded-[2.5rem] overflow-hidden border border-outline-variant/20 shadow-[0_40px_120px_rgba(0,0,0,0.8)] relative"
            style={{ transformPerspective: 1200 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-surface-container-low p-8 min-h-[340px] flex gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(104,211,255,0.05)_0%,transparent_70%)]" />
              {/* Sidebar mock */}
              <div className="w-16 bg-surface-container rounded-2xl border border-outline-variant/10 flex flex-col gap-3 p-3">
                {['#68d3ff', '#b088ff', '#ababac', '#ababac', '#ababac'].map((c, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl" style={{ background: `${c}15`, border: `1px solid ${c}30` }} />
                ))}
              </div>
              {/* Main content mock */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div className="h-4 w-48 rounded-full bg-surface-container-high" />
                  <div className="ml-auto h-7 w-32 rounded-full bg-primary/20 border border-primary/30" />
                </div>
                <div className="flex-1 bg-surface-container rounded-2xl border border-outline-variant/10 p-6 relative overflow-hidden">
                  {/* Node graph mock */}
                  <svg className="absolute inset-0 w-full h-full opacity-60">
                    <line x1="20%" y1="50%" x2="50%" y2="40%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="50%" y1="40%" x2="80%" y2="30%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="50%" y1="40%" x2="80%" y2="65%" stroke="#b088ff" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="50%" y1="40%" x2="35%" y2="70%" stroke="#93a2ff" strokeWidth="1" strokeDasharray="4,4" />
                  </svg>
                  {[
                    { left: '14%', top: '42%', color: '#68d3ff', label: 'Sales Org' },
                    { left: '44%', top: '32%', color: '#b088ff', label: 'Dist Channel' },
                    { left: '74%', top: '22%', color: '#93a2ff', label: 'Plant 1000' },
                    { left: '74%', top: '56%', color: '#93a2ff', label: 'Plant 2000' },
                    { left: '28%', top: '62%', color: '#68d3ff', label: 'Company Code' },
                  ].map((n, i) => (
                    <div key={i} className="absolute" style={{ left: n.left, top: n.top, transform: 'translate(-50%,-50%)' }}>
                      <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono whitespace-nowrap"
                        style={{ background: `${n.color}15`, border: `1px solid ${n.color}40`, color: n.color }}>
                        {n.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-24 border-t border-outline-variant/10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <Stat value="12+" label="SAP Modules" delay={0} />
          <Stat value="99%" label="Config Accuracy" delay={0.1} />
          <Stat value="3x" label="Faster Deployment" delay={0.2} />
          <Stat value="∞" label="Neural Capacity" delay={0.3} />
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl mb-16">
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-4">Intelligent Architecture</div>
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-on-surface mb-4">
              Every SAP Module.<br />One Neural Brain.
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed font-body font-light">
              From Pricing Procedures to Procurement cycles, Aether's multi-agent neural core bridges the gap between business logic and technical precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'SD Neural Architect', desc: 'AI-powered Order-to-Cash configuration with Condition Technique, Access Sequences, and Partner Function mapping.', color: '#68d3ff', delay: 0 },
              { icon: '📦', title: 'MM-Link Console', desc: 'Full Procure-to-Pay lifecycle visualization from ME51N Purchase Requisition to MIRO Invoice Verification.', color: '#b088ff', delay: 0.1 },
              { icon: '💳', title: 'FICO-Sync Ledger', desc: 'Real-time G/L account determination via VKOA, automated revenue postings, and Accounts Receivable reconciliation.', color: '#93a2ff', delay: 0.2 },
              { icon: '👁️', title: 'Vision Neural Lab', desc: 'Upload SAP GUI screenshots. AI detects misconfigurations with a spatial heatmap overlay and suggests instant fixes.', color: '#68d3ff', delay: 0.3 },
              { icon: '📇', title: 'Master Data Dossier', desc: 'Multi-tier Customer & Material Master views — General, Company Code, and Sales Area data in one intelligent hub.', color: '#b088ff', delay: 0.4 },
              { icon: '☁️', title: 'Cloud Sync Ledger', desc: 'OAuth2-secured integration with Google Sheets, Docs, and Calendar for real-time enterprise data persistence.', color: '#93a2ff', delay: 0.5 },
            ].map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── DEEP DIVE CTA ── */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative max-w-4xl w-full p-12 md:p-20 rounded-[3rem] overflow-hidden border border-primary/20"
            style={{ background: 'linear-gradient(135deg, rgba(104,211,255,0.08), rgba(176,136,255,0.05), rgba(13,14,15,0.8))' }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 opacity-30">
                <NeuralCanvas />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Ready to Deploy?</div>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-6"
                style={{ textShadow: '0 0 60px rgba(104,211,255,0.3)' }}>
                Your Digital Twin<br />Awaits Activation.
              </h2>
              <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto font-body font-light leading-relaxed">
                Step into the Aether OS. Configure S/4HANA architecture 10x faster with the power of neural intelligence.
              </p>
              <button onClick={onEnter}
                className="px-12 py-5 rounded-[1.5rem] font-headline font-bold text-xl text-background transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #68d3ff, #b088ff)',
                  boxShadow: '0 0 40px rgba(104,211,255,0.4), 0 20px 60px rgba(0,0,0,0.5)'
                }}>
                Initialize Aether OS →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-outline-variant/10 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">A</div>
            <span className="font-headline font-bold text-primary">SDAssist Aether</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">V9.0 Titan</span>
          </div>
          <div className="text-[11px] uppercase tracking-widest text-on-surface-variant/40 font-body">
            Google Antigravity Hackathon 2026 · Neural Editorial System
          </div>
          <div className="flex gap-6 text-[11px] uppercase tracking-widest text-on-surface-variant/40">
            {['Status', 'API Docs', 'Privacy'].map(l => (
              <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
