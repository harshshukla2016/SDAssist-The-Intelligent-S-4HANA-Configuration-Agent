/**
 * Agent 3: The Overseer (QA/Monitor)
 * Responsible for security, efficiency, and logic verification.
 */

const KEY_PATTERNS = [
  /AIza[0-9A-Za-z-_]{35}/, // Google API Key
  /gsk_[0-9A-Za-z]{48}/,   // Groq Key
  /53597257728-/,          // OAuth Client ID start
];

export const runOverseerAudit = (state, sourceCode = "") => {
  const warnings = [];

  // 1. Hardcoded Credential Check
  // In a real app we'd scan all files. Here we scan passed sourceCode or stringified state.
  KEY_PATTERNS.forEach(pattern => {
    if (pattern.test(sourceCode)) {
      warnings.push({
        type: 'SECURITY',
        severity: 'CRITICAL',
        message: 'Hardcoded API credential detected in source code. Use .env instead.'
      });
    }
  });

  // 2. Loop Detection
  if (state.messages?.length > 10) {
    const lastThree = state.messages.slice(-3).map(m => m.content);
    if (lastThree[0] === lastThree[2]) {
      warnings.push({
        type: 'LOGIC',
        severity: 'HIGH',
        message: 'Neural loop detected. Gemini/Groq response pattern becoming repetitive.'
      });
    }
  }

  // 3. Efficiency Check (Bundle Size Simulation)
  // We check for "large" mock dependencies or state bloat
  if (JSON.stringify(state).length > 20000) {
    warnings.push({
      type: 'PERFORMANCE',
      severity: 'MEDIUM',
      message: 'State object size exceeding 20KB. Archiving old roadmap nodes recommended.'
    });
  }

  return warnings;
};
