/**
 * Agent 1: The SAP Architect (Lead)
 * Responsible for domain logic and ensuring S/4HANA best practices.
 * Refactored to use Groq (Llama 3) for high performance and reliability.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Generates a technical SAP configuration roadmap using Groq.
 * @param {string} requirement - User's business requirement.
 * @param {Object} projectMeta - Project metadata (client, industry, version).
 * @param {Object} neuralConfig - Neural parameters (temperature, persona).
 */
export const generateRoadmap = async (requirement, projectMeta = {}, neuralConfig = {}) => {
  if (!requirement) {
    throw new Error("Business requirement is mandatory.");
  }

  try {
    if (!GROQ_API_KEY) {
      console.warn("VITE_GROQ_API_KEY missing. Returning fallback.");
      return getDefaultRoadmap(requirement);
    }

    const systemInstruction = `
      You are an ${neuralConfig.persona || 'Expert SAP Architect'}. 
      Context: This is for a project for ${projectMeta.client || 'General Client'} in the ${projectMeta.industry || 'General'} industry, operating on ${projectMeta.version || 'S/4HANA'}.
      
      CRITICAL: You MUST output all technical descriptions, steps, and warnings in ${neuralConfig.language || 'English'}. However, all SAP T-Codes (e.g., OX02, V/08) MUST remain in their standard technical format.
      
      You act as a Case-Based Reasoner. You do not write SOPs; you provide specific, technical configuration paths.
      
      You MUST output a structured JSON response containing:
      {
        "status": "validated",
        "scenario_type": "Entry | Pricing | Partners | OrderProcess | MM | FICO | Other",
        "estimatedHours": number,
        "enterprise_structure": {
          "sales_org": "code", "dist_channel": "code", "division": "code",
          "company_code": "code", "plant": "code", "shipping_point": "code",
          "purchasing_org": "code", "purchasing_group": "code"
        },
        "pricing_procedure": {
          "name": "string",
          "steps": [...]
        },
        "o2c_flow": [...],
        "procurement_roadmap": [
          { "step": "Purchase Requisition", "tcode": "ME51N" },
          { "step": "Purchase Order", "tcode": "ME21N" },
          { "step": "Goods Receipt", "tcode": "MIGO" },
          { "step": "Invoice Verification", "tcode": "MIRO" }
        ],
        "financial_ledger": {
          "dr_account": "Receivables/Inventory",
          "cr_account": "Revenue/Payables",
          "gl_mapping_tcode": "VKOA / OBYC"
        },
        "configuration_roadmap": [...],
        "warnings": ["Potential pitfalls"]
      }

      Context Rule: For MM, focus on ME21N/MIGO logic. For FICO, focus on VKOA account determination.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Requirement: ${requirement} (Output should be valid JSON)` }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: neuralConfig.temperature || 0.2,
        top_p: neuralConfig.topP || 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      throw new Error(`Groq Failure: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return result;

  } catch (error) {
    console.error("SAP Architect Error (Groq):", error);
    return getDefaultRoadmap(requirement);
  }
};

/**
 * Neural Vision Engine: Analyzes SAP GUI screenshots (simulated).
 * @param {string} fileName - Name of the uploaded screenshot.
 * @param {string} context - User provided text context.
 */
export const analyzeScreenshot = async (fileName, context = "") => {
  if (!GROQ_API_KEY) throw new Error("Neural Engine Offline.");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      messages: [
        { 
          role: "system", 
          content: "You are an SAP Vision Analyst. Analyze the screenshot name and context to detect configuration glitches. Return JSON: { glitches: [{ label: string, x: number, y: number }], suggested_fix: string, confidence: number }. x and y are percentages (0-100) on the image." 
        },
        { role: "user", content: `Screenshot: ${fileName}. Context: ${context}` }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

const getDefaultRoadmap = (req) => {
  return {
    status: "mock",
    scenario_type: "General",
    estimatedHours: 2,
    configuration_roadmap: [
      { step: "Define Organizational Units", tcode: "SPRO", description: "General setup." }
    ]
  };
};

export const validatePricing = (pricingData) => {
  const baseIndex = pricingData.findIndex(p => p.description?.toLowerCase().includes('base'));
  const discountIndex = pricingData.findIndex(p => p.description?.toLowerCase().includes('discount'));
  if (discountIndex !== -1 && baseIndex !== -1 && discountIndex < baseIndex) {
    return ["Discount condition placed before Base Price – will result in $0 calculation."];
  }
  return [];
};
