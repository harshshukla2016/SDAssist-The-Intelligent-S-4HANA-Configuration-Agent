// src/services/googleSheets.js
/**
 * Google Sheets integration – appends rows to a sheet.
 * Uses the Sheets API v4 via fetch.
 * Requires VITE_GOOGLE_API_KEY and a spreadsheet ID.
 */

/**
 * Append rows to the given spreadsheet using OAuth2.
 * @param {string} spreadsheetId - The ID of the Google Sheet.
 * @param {Array<Array<string>>} rows - 2‑D array of values.
 * @param {string} accessToken - The OAuth2 access token.
 * @returns {Promise<Object>} API response.
 */
export const appendRows = async (spreadsheetId, rows, accessToken) => {
  if (!accessToken) {
    throw new Error('Neural Link not authorized. Please Connect Google in Sync Ledger.');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=RAW`;
  const body = {
    majorDimension: 'ROWS',
    values: rows,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Sheets append failed:', err);
    throw new Error(err.error?.message || 'Google Sheets API error');
  }
  return response.json();
};

/**
 * High-level wrapper to sync a roadmap to the configured sheet.
 * @param {Object} roadmap - The generated SAP roadmap object.
 * @param {string} accessToken - The OAuth2 access token.
 */
export const syncToSheets = async (roadmap, accessToken) => {
  const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  if (!SPREADSHEET_ID) return;

  const rows = roadmap.configuration_roadmap.map(step => [
    roadmap.scenario_type,
    step.step,
    step.tcode,
    step.description,
    "PENDING",
    new Date().toISOString()
  ]);

  return appendRows(SPREADSHEET_ID, rows, accessToken);
};
