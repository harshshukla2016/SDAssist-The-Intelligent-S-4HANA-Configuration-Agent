/**
 * Agent 1: The SAP Architect (Lead)
 * Responsible for domain logic and ensuring S/4HANA best practices.
 * Refactored to use Groq (Llama 3) for high performance and reliability.
 */

const LOCAL_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Generates a technical SAP configuration roadmap using Groq.
 * @param {string} requirement - User's business requirement.
 * @param {Object} projectMeta - Project metadata (client, industry, version).
 * @param {Object} neuralConfig - Neural parameters (temperature, persona).
 * @param {string} localRagContext - Parsed RAG local memory rules.
 */
export const generateRoadmap = async (requirement, projectMeta = {}, neuralConfig = {}, localRagContext = "") => {
  if (!requirement) {
    throw new Error("Business requirement is mandatory.");
  }

  try {

    const systemInstruction = `
      You are an ${neuralConfig.persona || 'Expert SAP Architect'}. 
      Context: This is for a project for ${projectMeta.client || 'General Client'} in the ${projectMeta.industry || 'General'} industry, operating on ${projectMeta.version || 'S/4HANA'}.
      
      CRITICAL: You MUST output all technical descriptions, steps, and warnings in ${neuralConfig.language || 'English'}. However, all SAP T-Codes (e.g., OX02, V/08) MUST remain in their standard technical format.
      
      You act as a Case-Based Reasoner. You do not write SOPs; you provide specific, technical configuration paths.
      
      You MUST output a structured JSON response containing:
      {
        "status": "validated",
        "scenario_type": "Entry | Pricing | Partners | OrderProcess | MM | FICO | MasterData | Other",
        "estimatedHours": number,
        "enterprise_structure": { ... },
        "pricing_procedure": {
          "name": "ZIM24 - INESH PRICING",
          "full_grid": [
            { "step": 10, "ctyp": "ZM24", "description": "Basic Value", "from": "", "to": "", "stat": "X", "reqt": "2", "acck": "ERL" },
            { "step": 20, "ctyp": "ZFOO", "description": "Customer Dis", "from": "10", "to": "", "stat": "", "reqt": "None", "acck": "ERS" }
          ]
        },
        "master_data": {
          "customer_views": {
            "general": ["Name", "Address", "Language"],
            "company_code": ["Reconciliation Account", "Payment Terms"],
            "sales_area": ["Shipping Conditions", "Partner Functions"]
          },
          "material_views": {
            "basic": ["Base Unit", "Weight"],
            "purchasing": ["Purchasing Group", "Valuation Class"],
            "sales": ["Sales Unit", "Tax Class"]
          }
        },
        "o2c_flow": [...],
        "procurement_roadmap": [...],
        "configuration_roadmap": [...],
        "warnings": ["Potential pitfalls"]
      }

      Design constraints: Use standard SAP Best Practices unless otherwise specified.
      Context Rule: Respect the 'Condition Technique' (Specific -> General). Use Access Sequences for automatic pricing.
      ${localRagContext ? `\nCRITICAL PROPRIETARY RULES (RAG MEMORY BANK):\n${localRagContext}` : ''}
    `;

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Requirement: ${requirement} (Output should be valid JSON)` }
    ];

    let response;

    // Local fallback for developers bypassing Vercel CLI
    if (LOCAL_GROQ_KEY && window.location.hostname === 'localhost') {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LOCAL_GROQ_KEY}`
        },
        body: JSON.stringify({
          messages,
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: neuralConfig.temperature || 0.2,
          top_p: neuralConfig.topP || 0.8
        })
      });
    } else {
      // Production secure serverless route
      response = await fetch("/api/groq-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, neuralConfig })
      });
    }

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
export const analyzeScreenshot = async (fileName, context = "", base64Image = null) => {
  let response;

  if (LOCAL_GROQ_KEY && window.location.hostname === 'localhost') {
    if (!LOCAL_GROQ_KEY) throw new Error("Neural Engine Offline.");
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOCAL_GROQ_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: "You are an SAP Vision Analyst. Analyze the screenshot to detect SAP GUI configuration glitches. Return strict JSON: { \"glitches\": [{ \"label\": \"string\", \"x\": 10, \"y\": 20 }], \"suggested_fix\": \"string\", \"confidence\": 95 }. Focus ONLY on SAP configuration issues. If none found, state empty."  
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: `Context provided by user: ${context || 'None'}` },
              ...(base64Image ? [{ type: "image_url", image_url: { url: base64Image } }] : [])
            ]
          }
        ],
        model: "llama-3.2-11b-vision-preview",
        response_format: { type: "json_object" }
      })
    });
  } else {
    response = await fetch("/api/groq-vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image, context })
    });
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

/**
 * Invokes the Multi-Agent Council to debate an SAP requirement.
 * @param {string} requirement - User's business requirement.
 * @param {string} context - The injected local RAG memory bank context.
 */
export const generateCouncilDebate = async (requirement, context = "") => {
  let response;

  if (LOCAL_GROQ_KEY && window.location.hostname === 'localhost') {
    const systemPrompt = `You are the Aether Council. You must simulate a debate between 3 SAP experts: "SD Lead", "ABAP Dev", and "FICO Auditor". 
They must discuss the user's requirement and identify architectural bottlenecks or proper solutions. 
Return strictly valid JSON in this exact format:
{
  "debate": [
    {"agent": "SD Lead", "message": "string"},
    {"agent": "ABAP Dev", "message": "string"},
    {"agent": "FICO Auditor", "message": "string"}
  ],
  "final_verdict": "string summarizing the agreed upon architectural solution"
}
Custom Architectural Constraints / Context: ${context || 'None'}`;

    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOCAL_GROQ_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Requirement: ${requirement}` }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });
  } else {
    response = await fetch("/api/groq-council", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requirement, context })
    });
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || data.error || "Council Neural Link Offline");
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
