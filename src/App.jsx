import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StateProvider } from './context/StateContext';
import AetherLayout from './components/AetherLayout';
import LandingPage from './pages/LandingPage';

function App() {
  const [entered, setEntered] = useState(false);

  return (
    <StateProvider>
      <div className="w-screen h-screen overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
              <LandingPage onEnter={() => setEntered(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <AetherLayout />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StateProvider>
  );
}

export default App;
