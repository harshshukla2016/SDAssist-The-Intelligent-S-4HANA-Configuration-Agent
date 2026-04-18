import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { runOverseerAudit } from '../overseer/monitor';
import {
  getSetting, setSetting,
  saveSession, getAllSessions, getLatestSession,
  saveRoadmap, getAllRoadmaps,
  saveArchive, getAllArchives,
  getDBStats,
  migrateFromLocalStorage,
} from '../services/idbService';

const StateContext = createContext();

export const StateProvider = ({ children }) => {

  // ── Core UI state ──────────────────────────────────────
  const [user,         setUser]         = useState(null);
  const [activePage,   setActivePage]   = useState('dashboard');
  const [googleToken,  setGoogleToken]  = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing,    setIsSyncing]    = useState(false);
  const [warnings,     setWarnings]     = useState([]);
  const [dbReady,      setDbReady]      = useState(false);
  const [dbStats,      setDbStats]      = useState(null);

  // ── Persisted state (synced to IndexedDB) ──────────────
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Neural link established. I am Aether, your SAP SD Configuration Architect. How can I assist with your S/4HANA roadmap today?' }
  ]);
  const [roadmap,    setRoadmap]    = useState(null);
  const [archives,   setArchives]   = useState([]);
  const [allRoadmaps, setAllRoadmaps] = useState([]);

  const [projectMeta, setProjectMeta] = useState({
    client: 'Global Automotive', version: 'S/4HANA 2023', industry: 'Automotive'
  });
  const [neuralConfig, setNeuralConfig] = useState({
    temperature: 0.2, topP: 0.8, persona: 'Expert SAP Architect', language: 'English'
  });

  // ── DB Init & Migration ────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        // Migrate any existing localStorage data on first run
        const migrated = await getSetting('__migrated_from_ls', false);
        if (!migrated) await migrateFromLocalStorage();

        // Load settings from IndexedDB
        const savedProject = await getSetting('aether_project');
        const savedNeural  = await getSetting('aether_neural');
        if (savedProject) setProjectMeta(savedProject);
        if (savedNeural)  setNeuralConfig(savedNeural);

        // Load archives
        const savedArchives = await getAllArchives();
        setArchives(savedArchives.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));

        // Load all roadmaps
        const savedRoadmaps = await getAllRoadmaps();
        setAllRoadmaps(savedRoadmaps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

        // Load latest chat session
        const latestSession = await getLatestSession();
        if (latestSession && latestSession.messages.length > 1) {
          setMessages(latestSession.messages);
        }

        // DB stats
        const stats = await getDBStats();
        setDbStats(stats);
        setDbReady(true);
      } catch (err) {
        console.warn('[StateContext] DB init failed, falling back to localStorage:', err);
        // Graceful localStorage fallback
        const p = localStorage.getItem('aether_project');
        const n = localStorage.getItem('aether_neural');
        const a = localStorage.getItem('aether_archives');
        if (p) setProjectMeta(JSON.parse(p));
        if (n) setNeuralConfig(JSON.parse(n));
        if (a) setArchives(JSON.parse(a));
        setDbReady(true);
      }
    };
    init();
  }, []);

  // ── Persist projectMeta to IndexedDB on change ─────────
  useEffect(() => {
    if (!dbReady) return;
    setSetting('aether_project', projectMeta).catch(() => {
      localStorage.setItem('aether_project', JSON.stringify(projectMeta)); // fallback
    });
  }, [projectMeta, dbReady]);

  // ── Persist neuralConfig to IndexedDB on change ────────
  useEffect(() => {
    if (!dbReady) return;
    setSetting('aether_neural', neuralConfig).catch(() => {
      localStorage.setItem('aether_neural', JSON.stringify(neuralConfig));
    });
  }, [neuralConfig, dbReady]);

  // ── Auto-save chat session when messages update ─────────
  useEffect(() => {
    if (!dbReady || messages.length <= 1) return;
    const timer = setTimeout(async () => {
      try {
        await saveSession(messages, projectMeta.client || 'default');
        const stats = await getDBStats();
        setDbStats(stats);
      } catch (err) {
        console.warn('[StateContext] Session save failed:', err);
      }
    }, 1500); // debounce 1.5s
    return () => clearTimeout(timer);
  }, [messages, dbReady]);

  // ── Auto-save roadmap when generated ──────────────────
  useEffect(() => {
    if (!dbReady || !roadmap) return;
    const saveIt = async () => {
      try {
        await saveRoadmap(roadmap);
        const saved = await getAllRoadmaps();
        setAllRoadmaps(saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const stats = await getDBStats();
        setDbStats(stats);
      } catch (err) {
        console.warn('[StateContext] Roadmap save failed:', err);
      }
    };
    saveIt();
  }, [roadmap, dbReady]);

  // ── Overseer audit on message/roadmap changes ──────────
  useEffect(() => {
    const auditResults = runOverseerAudit({ messages, roadmap });
    setWarnings(auditResults);
  }, [messages, roadmap]);

  // ── Save to archives (bookmark a roadmap) ─────────────
  const saveToArchives = useCallback(async (roadmapData) => {
    if (!roadmapData) return;
    // Avoid duplicates
    const exists = archives.some(a =>
      a.data?.scenario_type === roadmapData.scenario_type &&
      JSON.stringify(a.data?.configuration_roadmap) === JSON.stringify(roadmapData.configuration_roadmap)
    );
    if (exists) return;

    try {
      await saveArchive(roadmapData);
      const saved = await getAllArchives();
      setArchives(saved.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      const stats = await getDBStats();
      setDbStats(stats);
    } catch (err) {
      // Fallback: in-memory only
      setArchives(prev => [
        { id: Date.now(), timestamp: new Date().toISOString(), data: roadmapData },
        ...prev
      ]);
    }
  }, [archives]);

  return (
    <StateContext.Provider value={{
      user,          setUser,
      activePage,    setActivePage,
      googleToken,   setGoogleToken,
      messages,      setMessages,
      roadmap,       setRoadmap,
      isProcessing,  setIsProcessing,
      isSyncing,     setIsSyncing,
      warnings,
      archives,      saveToArchives,
      allRoadmaps,
      projectMeta,   setProjectMeta,
      neuralConfig,  setNeuralConfig,
      dbReady,       dbStats,
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
