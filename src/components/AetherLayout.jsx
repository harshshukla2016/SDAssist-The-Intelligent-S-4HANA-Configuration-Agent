import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import SafetyLog from './SafetyLog';
import { useAppState } from '../context/StateContext';

import Dashboard from './Dashboard';
import AgentsPage from '../pages/AgentsPage';
import WorkflowPage from '../pages/WorkflowPage';
import TopologyPage from '../pages/TopologyPage';
import CloudSyncPage from '../pages/CloudSyncPage';
import ArchivesPage from '../pages/ArchivesPage';
import EnterprisePage from '../pages/EnterprisePage';
import O2CPage from '../pages/O2CPage';
import PricingPage from '../pages/PricingPage';
import MaterialsPage from '../pages/MaterialsPage';
import FinancePage from '../pages/FinancePage';
import VisionLab from '../pages/VisionLab';
import MasterDataPage from '../pages/MasterDataPage';
import SupportPage from '../pages/SupportPage';

// Command Center Panels
import ProjectAlpha from './ProjectAlpha';
import NeuralConfig from './NeuralConfig';

const AetherLayout = ({ onExit }) => {
  const { activePage } = useAppState();
  const [isAlphaOpen, setIsAlphaOpen] = React.useState(false);
  const [isNeuralOpen, setIsNeuralOpen] = React.useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'agents': return <AgentsPage />;
      case 'workflow': return <WorkflowPage />;
      case 'topology': return <TopologyPage />;
      case 'sync': return <CloudSyncPage />;
      case 'archives': return <ArchivesPage />;
      case 'enterprise': return <EnterprisePage />;
      case 'o2c': return <O2CPage />;
      case 'pricing': return <PricingPage />;
      case 'mm': return <MaterialsPage />;
      case 'fico': return <FinancePage />;
      case 'vision': return <VisionLab />;
      case 'master': return <MasterDataPage />;
      case 'support': return <SupportPage />;
      case 'safety': return <SafetyLog />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-on-surface font-body overflow-hidden">
      <div className="gradient-mesh"></div>
      <Sidebar />
      <ProjectAlpha isOpen={isAlphaOpen} onClose={() => setIsAlphaOpen(false)} />
      <NeuralConfig isOpen={isNeuralOpen} onClose={() => setIsNeuralOpen(true)} />
      
      <div className="flex-1 flex flex-col pl-0 md:pl-20 transition-all duration-300">
        <Header 
          onOpenAlpha={() => setIsAlphaOpen(true)} 
          onOpenNeural={() => setIsNeuralOpen(true)} 
          onExit={onExit}
        />
        
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AetherLayout;
