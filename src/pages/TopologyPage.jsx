import React from 'react';
import { motion } from 'framer-motion';
import { Network, Building2, Factory, Share2, Layers, ZoomIn, Sliders } from 'lucide-react';

const TopologyPage = () => {
  const svgRef = React.useRef(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aether-enterprise-topology.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nodes = [
    { id: 'SORG', name: 'Sales Org', type: 'root', pos: { x: 50, y: 10 } },
    { id: 'DIST', name: 'Distribution', type: 'link', pos: { x: 30, y: 40 } },
    { id: 'DIV', name: 'Division', type: 'link', pos: { x: 70, y: 40 } },
    { id: 'PLANT', name: 'Manufacturing Plant', type: 'leaf', pos: { x: 50, y: 75 } }
  ];

  return (
    <div className="p-8 h-full flex flex-col pt-0">
      <header className="py-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Enterprise Matrix</h2>
          <p className="text-on-surface-variant text-sm">Real-time S/4HANA Org Structure Topology</p>
        </div>
        <div className="flex gap-3">
          <ToolBtn onClick={handleDownload} icon={<Share2 size={16} />} label="Export SVG" />
          <ToolBtn icon={<ZoomIn size={16} />} />
          <ToolBtn icon={<Sliders size={16} />} />
        </div>
      </header>

      <div className="flex-1 bg-surface-container-lowest/30 rounded-[2.5rem] border border-outline-variant/10 relative overflow-hidden shadow-inset p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(104,211,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        
        {/* Animated Connections */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="50%" y1="15%" x2="30%" y2="40%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="50%" y1="15%" x2="70%" y2="40%" stroke="#68d3ff" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="30%" y1="40%" x2="50%" y2="75%" stroke="white" strokeWidth="0.5" />
          <line x1="70%" y1="40%" x2="50%" y2="75%" stroke="white" strokeWidth="0.5" />
        </svg>

        <div className="relative w-full h-full flex items-center justify-center">
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15, type: 'spring', damping: 12 }}
              style={{ position: 'absolute', left: `${node.pos.x}%`, top: `${node.pos.y}%`, transform: 'translate(-50%, -50%)' }}
              className="group cursor-pointer"
            >
              <div className={`p-8 rounded-3xl glass-panel border flex flex-col items-center gap-4 transition-all duration-500 group-hover:scale-110 shadow-2xl ${node.type === 'root' ? 'border-primary/50 bg-primary/5' : 'border-outline-variant/20 bg-surface-container-high'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${node.type === 'root' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container-highest text-on-surface-variant border-outline-variant/10'}`}>
                   {node.id === 'SORG' && <Factory size={24} />}
                   {node.id === 'DIST' && <Share2 size={24} />}
                   {node.id === 'DIV' && <Layers size={24} />}
                   {node.id === 'PLANT' && <Building2 size={24} />}
                </div>
                <div className="text-center">
                  <div className="font-headline text-sm font-bold">{node.name}</div>
                  <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">{node.id}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-8 right-8 max-w-xs p-6 rounded-2xl glass-panel border border-outline-variant/10 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
           <h4 className="font-headline text-xs font-bold text-primary mb-2">Neural Insight</h4>
           <p className="text-[10px] text-on-surface-variant leading-relaxed">
             This topology represents a standard global manufacturing template. Aether agents can optimize this path by collapsing divisions into shared services.
           </p>
        </div>
      </div>
    </div>
  );
};

const ToolBtn = ({ icon, onClick, label }) => (
  <button 
    onClick={onClick}
    className="px-3 h-10 rounded-xl bg-surface-container-high flex items-center justify-center gap-2 border border-outline-variant/10 hover:border-primary/40 hover:bg-primary/5 transition-all outline-none"
  >
    {icon}
    {label && <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pr-1">{label}</span>}
  </button>
);

export default TopologyPage;
