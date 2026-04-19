# 🧪 SDAssist Aether: Testing & Validation Protocol

This document outlines the manual testing procedures used to validate the **Neural S/4HANA Architect** during development. Due to the strict 1MB repository limit, these focused manual test cases serve as our primary technical validation baseline.

---

## 1. Core Neural Logic (Roadmap Generation)
**Objective**: Verify the Llama 3.3 engine correctly translates natural language into SAP-technical JSON.

| Test Case | Step | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **TC-01** | Input: "Create a sales order for a consumer customer" | System identifies `scenario_type: "OrderProcess"` and suggests `VA01`. | ✅ Pass |
| **TC-02** | Input: "Configure pricing with a 5% discount" | System generates a `pricing_procedure` grid containing `V/08` logic. | ✅ Pass |
| **TC-03** | Input: "Setup new plant in New York" | System maps `OX10` and `OX18` configuration nodes. | ✅ Pass |

---

## 2. Multi-Agent Orchestration (Council Mode)
**Objective**: Ensure the /api/groq-council endpoint returns a structured JSON debate transcript.

| Test Case | Input | Expected Outcome |
| :--- | :--- | :--- |
| **Summon Council** | Click Shield Icon + "Should I use custom Z-tables for pricing?" | Chat displays a 3-way debate (SD/ABAP/FICO) with a technical verdict. |

---

## 3. Computer Vision (OCR Audit)
**Objective**: Validate the Vision Neural Suite's ability to process Base64 images.

| Test Case | Input | Expected Outcome |
| :--- | :--- | :--- |
| **Vision Scan** | Upload a screenshot of an SAP Error (e.g. ST22 Dump) | System overlays a spatial heatmap on the glitch and suggests a fix (e.g., "Check table VBKD"). |

---

## 4. Google Workspace Sync
**Objective**: Validate authenticated Google Cloud Ledger integration.

- [x] **Auth Check**: Clicking "Neural Link" triggers the Google OAuth2 popup.
- [x] **Sheets Sync**: Clicking "Sync to Ledger" creates/updates a row in the associated Google Sheet.
- [x] **Calendar Sync**: Triggering a new configuration Roadmap correctly asks to "Block Calendar" for the implementation window.

---

## 5. Security & Edge Logic
**Objective**: Verify that API keys are strictly masked from the client browser.

1. Open Browser DevTools -> Network Tab.
2. Trigger any AI generation.
3. **Validation**: Confirm the request goes to `/api/groq-chat` and the `Payload` contains **NO** API Keys. (Key is injected server-side via `process.env.GROQ_API_KEY`).

---

## 6. Accessibility & Inclusivity
**Objective**: Verify WCAG-compliant keyboard traversal.

1. Disconnect Mouse / Trackpad.
2. Use `Tab` to navigate from Dashboard to Vision Lab.
3. **Validation**: Focus rings are visible on all interactive elements, and `Enter` triggers the correct actions.
