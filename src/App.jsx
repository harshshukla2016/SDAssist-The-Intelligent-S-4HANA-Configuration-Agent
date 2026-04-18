import React from 'react';
import { StateProvider } from './context/StateContext';
import AetherLayout from './components/AetherLayout';

function App() {
  return (
    <StateProvider>
      <div className="w-screen h-screen overflow-hidden bg-background">
        <AetherLayout />
      </div>
    </StateProvider>
  );
}

export default App;
