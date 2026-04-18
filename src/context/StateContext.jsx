import React, { createContext, useContext, useState, useEffect } from 'react';
import { runOverseerAudit } from '../overseer/monitor';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [googleToken, setGoogleToken] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Neural link established. I am Aether, your SAP SD Configuration Architect. How can I assist with your S/4HANA roadmap today?' }
  ]);
  const [roadmap, setRoadmap] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [warnings, setWarnings] = useState([]);
  
  // Persistence: Neural Configuration & Project Alpha
  const [projectMeta, setProjectMeta] = useState(() => {
    const saved = localStorage.getItem('aether_project');
    return saved ? JSON.parse(saved) : { client: 'Global Automotive', version: 'S/4HANA 2023', industry: 'Automotive' };
  });

  const [neuralConfig, setNeuralConfig] = useState(() => {
    const saved = localStorage.getItem('aether_neural');
    return saved ? JSON.parse(saved) : { temperature: 0.2, topP: 0.8, persona: 'Expert SAP Architect', language: 'English' };
  });

  // Persistence: Load archives from localStorage on init
  const [archives, setArchives] = useState(() => {
    const saved = localStorage.getItem('aether_archives');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence: Save archives to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aether_archives', JSON.stringify(archives));
  }, [archives]);

  useEffect(() => {
    localStorage.setItem('aether_project', JSON.stringify(projectMeta));
  }, [projectMeta]);

  useEffect(() => {
    localStorage.setItem('aether_neural', JSON.stringify(neuralConfig));
  }, [neuralConfig]);

  // Background Overseer Audit
  useEffect(() => {
    const auditResults = runOverseerAudit({ messages, roadmap });
    setWarnings(auditResults);
  }, [messages, roadmap]);

  const saveToArchives = (roadmapData) => {
    if (!roadmapData) return;
    setArchives(prev => {
      // Avoid duplicates
      const exists = prev.some(a => a.data.scenario_type === roadmapData.scenario_type && JSON.stringify(a.data.configuration_roadmap) === JSON.stringify(roadmapData.configuration_roadmap));
      if (exists) return prev;
      
      return [
        { id: Date.now(), timestamp: new Date().toISOString(), data: roadmapData },
        ...prev
      ];
    });
  };

  return (
    <StateContext.Provider value={{ 
      user, setUser, 
      activePage, setActivePage,
      messages, setMessages, 
      roadmap, setRoadmap,
      isProcessing, setIsProcessing,
      isSyncing, setIsSyncing,
      warnings,
      archives, saveToArchives,
      projectMeta, setProjectMeta,
      neuralConfig, setNeuralConfig
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
