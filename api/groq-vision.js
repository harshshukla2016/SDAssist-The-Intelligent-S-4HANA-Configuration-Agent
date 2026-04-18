export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { base64Image, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GROQ_API_KEY in server environment' }), { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        response_format: { type: "json_object" },
        messages: [
          { 
            role: "system", 
            content: "You are an SAP Vision Analyst. Analyze the screenshot to detect SAP GUI configuration glitches. Return strict JSON: { \"glitches\": [{ \"label\": \"string\", \"x\": 10, \"y\": 20 }], \"suggested_fix\": \"string\", \"confidence\": 95 }. Focus ONLY on SAP configuration issues. If none found, state empty." 
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: `Context provided by user: ${context || 'None'}` },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ],
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
