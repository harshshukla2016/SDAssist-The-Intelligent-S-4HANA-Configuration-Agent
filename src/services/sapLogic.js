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
        "scenario_type": "Entry | Pricing | Partners | OrderProcess | Other",
        "estimatedHours": number,
        "enterprise_structure": {
          "sales_org": "code",
          "dist_channel": "code",
          "division": "code",
          "company_code": "code",
          "plant": "code",
          "shipping_point": "code"
        },
        "pricing_procedure": {
          "name": "string",
          "steps": [
            { "step": 10, "cond_type": "PR00", "description": "Base Price", "requirement": "2" },
            { "step": 20, "cond_type": "K007", "description": "Discount", "requirement": "None" },
            { "step": 100, "cond_type": "MWST", "description": "Tax", "requirement": "10" }
          ]
        },
        "o2c_flow": [
          { "doc_type": "Inquiry", "tcode": "VA11", "status": "completed" },
          { "doc_type": "Quotation", "tcode": "VA21", "status": "pending" },
          { "doc_type": "Sales Order", "tcode": "VA01", "status": "pending" },
          { "doc_type": "Delivery", "tcode": "VL01N", "status": "pending" },
          { "doc_type": "Billing", "tcode": "VF01", "status": "pending" }
        ],
        "configuration_roadmap": [
          {
            "step": "Short step name",
            "tcode": "SAP T-Code",
            "dependency": "What must be configured first",
            "description": "Short technical detail"
          }
        ],
        "warnings": ["Potential pitfalls"]
      }

      Context Rule: If the user mentions a specific industry (e.g., Automotive), tailor the Enterprise Structure and Pricing steps to match (e.g., use JIT/JIS for Automotive).

      Key Scenarios:
      1. New Market Entry: OX02, OVX1, OVX3, OVXC.
      2. Pricing Models: V/06, V/07, V/08.
      3. Partners: VOPAN.
      4. Order Process: VOV7, VOV6, VOV4.
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

const getDefaultRoadmap = (req) => {
  if (req.toLowerCase().includes('pune')) {
    return {
      status: "mock",
      scenario_type: "Entry",
      estimatedHours: 4,
      configuration_roadmap: [
        { step: "Define Company Code", tcode: "OX02", dependency: "None", description: "Legal entity." },
        { step: "Assign Sales Org to CC", tcode: "OVX1", dependency: "OX02", description: "Link IN01." }
      ]
    };
  }
  return {
    status: "mock",
    scenario_type: "General",
    estimatedHours: 2,
    configuration_roadmap: [
      { step: "Define Sales Org", tcode: "OVX5", dependency: "None", description: "Org unit." }
    ]
  };
};

/**
 * Mock pricing validator.
 */
export const validatePricing = (pricingData) => {
  const baseIndex = pricingData.findIndex(p => p.condition?.toLowerCase().includes('base'));
  const discountIndex = pricingData.findIndex(p => p.condition?.toLowerCase().includes('discount'));
  if (discountIndex !== -1 && baseIndex !== -1 && discountIndex < baseIndex) {
    return ["Discount condition placed before Base Price – will result in $0 calculation."];
  }
  return [];
};
