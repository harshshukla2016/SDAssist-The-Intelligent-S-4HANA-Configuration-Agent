/**
 * Agent 2: The Google Integrator (Dev)
 * Responsible for Google Auth, Sheets, and Calendar integration.
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Request real OAuth2 token from Google Identity Services.
 */
export const handleGoogleLogin = () => {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined') {
      reject(new Error("Google scripts not loaded. Check internet connection."));
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/calendar.events',
      callback: (response) => {
        if (response.error) {
          reject(response);
        } else {
          resolve(response.access_token);
        }
      },
    });
    
    client.requestAccessToken();
  });
};

export const syncToSheets = async (spreadsheetId, roadmap, token) => {
  if (!spreadsheetId || !roadmap || !token) {
    throw new Error("Missing parameters for Neural Sync.");
  }
  // This is now handled in googleSheets.js using the real token
};

export const scheduleCheckpoint = async (summary, startTime) => {
  console.log("Scheduling Calendar checkpoint:", summary);
  return { success: true, eventLink: "https://calendar.google.com/..." };
};
