export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { requirement, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GROQ_API_KEY in server environment' }), { status: 500 });
    }

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
