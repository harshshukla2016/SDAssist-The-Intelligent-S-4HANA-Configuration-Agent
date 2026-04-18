// src/services/googleSearch.js
/**
 * Google Custom Search integration – returns top results for a query.
 * Requires VITE_GOOGLE_API_KEY and VITE_GOOGLE_SEARCH_CSE_ID in .env.
 */

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CSE_ID = import.meta.env.VITE_GOOGLE_SEARCH_CSE_ID;

/**
 * Search the web for a given query using Google Custom Search JSON API.
 * @param {string} query - Search term (e.g., a T‑Code like "VA01").
 * @returns {Promise<Array<{title:string, link:string, snippet:string}>>}
 */
export const searchTCode = async (query) => {
  if (!API_KEY || !CSE_ID) {
    throw new Error('Google Search API credentials missing in .env');
  }
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const err = await response.json();
    console.error('Google Search failed', err);
    throw new Error('Google Search API error');
  }
  const data = await response.json();
  return (data.items || []).slice(0, 3).map(item => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
  }));
};
