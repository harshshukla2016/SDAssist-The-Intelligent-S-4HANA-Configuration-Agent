/**
 * Google Calendar integration (V5.1 High-Fidelity).
 * Uses the Google Calendar API (v3) via fetch with Bearer Tokens.
 */

/**
 * Creates a calendar event for the given technical roadmap checkpoint.
 * @param {string} summary - Event title.
 * @param {string} startISO - ISO string for start time.
 * @param {string} endISO - ISO string for end time.
 * @param {string} accessToken - OAuth2 access token.
 */
export const scheduleEvent = async (summary, startISO, endISO, accessToken) => {
  if (!accessToken) {
    throw new Error('Neural Link not authorized. Please Connect Google in Sync Ledger.');
  }

  const body = {
    summary,
    description: 'Scheduled by SDAssist Aether Neural Architect.',
    start: { dateTime: startISO, timeZone: 'UTC' },
    end: { dateTime: endISO, timeZone: 'UTC' },
    reminders: { useDefault: true },
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    console.error('Calendar scheduling failed:', err);
    throw new Error(err.error?.message || 'Google Calendar API error');
  }
  return response.json();
};
