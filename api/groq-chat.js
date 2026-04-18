export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages, neuralConfig } = await req.json();
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
        messages,
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: neuralConfig?.temperature || 0.2,
        top_p: neuralConfig?.topP || 0.8
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
