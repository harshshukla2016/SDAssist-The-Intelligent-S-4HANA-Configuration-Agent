import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StateProvider } from './context/StateContext';
import AetherLayout from './components/AetherLayout';
import LandingPage from './pages/LandingPage';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [entered, setEntered] = useState(false);
  const handleEnter = useCallback(() => setEntered(true), []);

  return (
    <StateProvider>
      <div className="w-screen h-screen overflow-hidden bg-background" style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <LandingPage onEnter={handleEnter} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <ErrorBoundary>
                <AetherLayout />
              </ErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StateProvider>
  );
}

export default App;
