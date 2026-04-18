/**
 * AetherDB — IndexedDB Service
 * Replaces localStorage with a structured, high-capacity browser database.
 * Stores: chat sessions, roadmaps, archives, pricing configs, master data,
 * enterprise structures, vision lab results, project settings, neural config.
 *
 * Capacity: 50MB–1GB (vs localStorage's 5MB)
 * API: Fully async, non-blocking
 */

const DB_NAME    = 'AetherOSDB';
const DB_VERSION = 1;

// ── Schema ─────────────────────────────────────────────
// Each object store is a "table" in the local database
const STORES = {
  SESSIONS:    'chat_sessions',    // Full conversation histories
  ROADMAPS:    'roadmaps',         // Generated SAP configuration roadmaps
  ARCHIVES:    'archives',         // Archived/bookmarked roadmaps
  PRICING:     'pricing_configs',  // Custom pricing procedure definitions
  MASTER_DATA: 'master_data',      // Customer & Material master records
  ENTERPRISE:  'enterprise_nodes', // Enterprise structure topology saves
  VISION:      'vision_results',   // Vision Lab screenshot analysis results
  SETTINGS:    'settings',         // Project config, neural config (key-value)
};

// ── Open / Upgrade DB ───────────────────────────────────
let _db = null;

const openDB = () => new Promise((resolve, reject) => {
  if (_db) { resolve(_db); return; }

  const req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onupgradeneeded = (e) => {
    const db = e.target.result;

    // Chat sessions — keyed by session id, indexed by timestamp
    if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
      const s = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id', autoIncrement: true });
      s.createIndex('createdAt', 'createdAt');
      s.createIndex('projectId', 'projectId');
    }

    // Roadmaps — keyed by id, indexed by scenario type
    if (!db.objectStoreNames.contains(STORES.ROADMAPS)) {
      const r = db.createObjectStore(STORES.ROADMAPS, { keyPath: 'id', autoIncrement: true });
      r.createIndex('scenarioType', 'scenarioType');
      r.createIndex('createdAt', 'createdAt');
    }

    // Archives — bookmarked roadmaps
    if (!db.objectStoreNames.contains(STORES.ARCHIVES)) {
      const a = db.createObjectStore(STORES.ARCHIVES, { keyPath: 'id', autoIncrement: true });
      a.createIndex('timestamp', 'timestamp');
    }

    // Pricing configs
    if (!db.objectStoreNames.contains(STORES.PRICING)) {
      const p = db.createObjectStore(STORES.PRICING, { keyPath: 'id', autoIncrement: true });
      p.createIndex('procedureName', 'procedureName');
    }

    // Master data records
    if (!db.objectStoreNames.contains(STORES.MASTER_DATA)) {
      const m = db.createObjectStore(STORES.MASTER_DATA, { keyPath: 'id', autoIncrement: true });
      m.createIndex('type', 'type');   // 'customer' | 'material'
      m.createIndex('number', 'number');
    }

    // Enterprise structure nodes
    if (!db.objectStoreNames.contains(STORES.ENTERPRISE)) {
      db.createObjectStore(STORES.ENTERPRISE, { keyPath: 'id', autoIncrement: true });
    }

    // Vision lab results
    if (!db.objectStoreNames.contains(STORES.VISION)) {
      const v = db.createObjectStore(STORES.VISION, { keyPath: 'id', autoIncrement: true });
      v.createIndex('analyzedAt', 'analyzedAt');
    }

    // Settings — simple key-value store for project/neural config
    if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
      db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
    }
  };

  req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
  req.onerror   = (e) => reject(e.target.error);
});

// ── Generic CRUD helpers ────────────────────────────────
const withStore = (storeName, mode, fn) =>
  openDB().then(db => new Promise((resolve, reject) => {
    const tx    = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req   = fn(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  }));

const getAll = (storeName) =>
  openDB().then(db => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  }));

// ── Settings (replaces localStorage for project & neural config) ──
export const setSetting = (key, value) =>
  withStore(STORES.SETTINGS, 'readwrite', s => s.put({ key, value, updatedAt: new Date().toISOString() }));

export const getSetting = async (key, defaultValue = null) => {
  try {
    const result = await withStore(STORES.SETTINGS, 'readonly', s => s.get(key));
    return result ? result.value : defaultValue;
  } catch { return defaultValue; }
};

// ── Chat Sessions ───────────────────────────────────────
export const saveSession = (messages, projectId = 'default') =>
  withStore(STORES.SESSIONS, 'readwrite', s => s.add({
    messages,
    projectId,
    createdAt: new Date().toISOString(),
    messageCount: messages.length,
  }));

export const getAllSessions = () => getAll(STORES.SESSIONS);

export const getLatestSession = async () => {
  const all = await getAllSessions();
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
};

export const deleteSession = (id) =>
  withStore(STORES.SESSIONS, 'readwrite', s => s.delete(id));

// ── Roadmaps ────────────────────────────────────────────
export const saveRoadmap = (roadmapData) =>
  withStore(STORES.ROADMAPS, 'readwrite', s => s.add({
    ...roadmapData,
    id: undefined,  // let autoIncrement assign
    scenarioType: roadmapData.scenario_type || 'Unknown',
    createdAt: new Date().toISOString(),
  }));

export const getAllRoadmaps = () => getAll(STORES.ROADMAPS);
export const deleteRoadmap = (id) => withStore(STORES.ROADMAPS, 'readwrite', s => s.delete(id));

// ── Archives ────────────────────────────────────────────
export const saveArchive = (roadmapData) =>
  withStore(STORES.ARCHIVES, 'readwrite', s => s.add({
    data: roadmapData,
    timestamp: new Date().toISOString(),
  }));

export const getAllArchives = () => getAll(STORES.ARCHIVES);
export const deleteArchive = (id) => withStore(STORES.ARCHIVES, 'readwrite', s => s.delete(id));
export const clearArchives = () =>
  openDB().then(db => new Promise((resolve, reject) => {
    const req = db.transaction(STORES.ARCHIVES, 'readwrite').objectStore(STORES.ARCHIVES).clear();
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  }));

// ── Pricing Configurations ──────────────────────────────
export const savePricingConfig = (config) =>
  withStore(STORES.PRICING, 'readwrite', s => s.add({
    ...config,
    savedAt: new Date().toISOString(),
  }));

export const getAllPricingConfigs = () => getAll(STORES.PRICING);
export const deletePricingConfig = (id) => withStore(STORES.PRICING, 'readwrite', s => s.delete(id));

// ── Master Data ─────────────────────────────────────────
export const saveMasterRecord = (type, record) =>
  withStore(STORES.MASTER_DATA, 'readwrite', s => s.add({
    type,  // 'customer' | 'material'
    ...record,
    savedAt: new Date().toISOString(),
  }));

export const getMasterRecords = (type) =>
  openDB().then(db => new Promise((resolve, reject) => {
    const tx    = db.transaction(STORES.MASTER_DATA, 'readonly');
    const index = tx.objectStore(STORES.MASTER_DATA).index('type');
    const req   = index.getAll(type);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  }));

export const deleteMasterRecord = (id) =>
  withStore(STORES.MASTER_DATA, 'readwrite', s => s.delete(id));

// ── Enterprise Structure ────────────────────────────────
export const saveEnterpriseSnapshot = (snapshot) =>
  withStore(STORES.ENTERPRISE, 'readwrite', s => s.add({
    ...snapshot,
    savedAt: new Date().toISOString(),
  }));

export const getAllEnterpriseSnapshots = () => getAll(STORES.ENTERPRISE);

// ── Vision Lab Results ──────────────────────────────────
export const saveVisionResult = (result) =>
  withStore(STORES.VISION, 'readwrite', s => s.add({
    ...result,
    analyzedAt: new Date().toISOString(),
  }));

export const getAllVisionResults = () => getAll(STORES.VISION);
export const deleteVisionResult = (id) => withStore(STORES.VISION, 'readwrite', s => s.delete(id));

// ── DB Stats ─────────────────────────────────────────────
export const getDBStats = async () => {
  const [sessions, roadmaps, archives, pricing, master, vision] = await Promise.all([
    getAllSessions(),
    getAllRoadmaps(),
    getAllArchives(),
    getAllPricingConfigs(),
    getAll(STORES.MASTER_DATA),
    getAllVisionResults(),
  ]);
  return {
    sessions:  sessions.length,
    roadmaps:  roadmaps.length,
    archives:  archives.length,
    pricing:   pricing.length,
    masterData: master.length,
    vision:    vision.length,
    totalRecords: sessions.length + roadmaps.length + archives.length + pricing.length + master.length + vision.length,
  };
};

// ── Clear All Data ──────────────────────────────────────
export const clearAllData = () =>
  openDB().then(db => {
    const storeNames = Object.values(STORES);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeNames, 'readwrite');
      storeNames.forEach(name => tx.objectStore(name).clear());
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  });

// ── Migrate from localStorage ───────────────────────────
export const migrateFromLocalStorage = async () => {
  try {
    const project  = localStorage.getItem('aether_project');
    const neural   = localStorage.getItem('aether_neural');
    const archives = localStorage.getItem('aether_archives');

    if (project)  await setSetting('aether_project',  JSON.parse(project));
    if (neural)   await setSetting('aether_neural',   JSON.parse(neural));
    if (archives) {
      const arr = JSON.parse(archives);
      for (const a of arr) await saveArchive(a.data || a);
    }

    // Mark migration done so we don't repeat it
    await setSetting('__migrated_from_ls', true);
    console.log('[AetherDB] Migration from localStorage complete.');
  } catch (err) {
    console.warn('[AetherDB] Migration skipped:', err);
  }
};

export { STORES };
export default { setSetting, getSetting, saveSession, getAllSessions, getLatestSession, deleteSession, saveRoadmap, getAllRoadmaps, deleteRoadmap, saveArchive, getAllArchives, deleteArchive, clearArchives, savePricingConfig, getAllPricingConfigs, deletePricingConfig, saveMasterRecord, getMasterRecords, deleteMasterRecord, saveEnterpriseSnapshot, getAllEnterpriseSnapshots, saveVisionResult, getAllVisionResults, deleteVisionResult, getDBStats, clearAllData, migrateFromLocalStorage };
