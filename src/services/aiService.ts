export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

/**
 * Sends a message and history to Google Gemini to get an agricultural expert response.
 * Uses the backend chat proxy first, then falls back to direct client-side integration.
 *
 * The proxy attempt is wrapped in its own try-catch so that failures
 * (including Vite returning HTML for `/api/chat` in local dev) cleanly
 * fall through to the direct Gemini call.
 */
export const getGeminiResponse = async (
  message: string,
  history: ChatMessage[] = [],
  language: string = "en"
): Promise<string> => {
  // ── 1. Attempt the Vercel serverless proxy ──────────────────
  try {
    const proxyRes = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, language }),
    });

    // Only trust the response if it's JSON (avoids Vite's SPA HTML fallback)
    const ct = proxyRes.headers.get("content-type") || "";
    if (proxyRes.ok && ct.includes("application/json")) {
      const data = await proxyRes.json();
      if (data.reply) return data.reply;
    }
  } catch (_proxyErr) {
    console.warn("Backend chat proxy not available, using direct Gemini API.");
  }

  // ── 2. Direct client-side Gemini call (fallback) ────────────
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Chat proxy failed and client-side VITE_GEMINI_API_KEY / VITE_GOOGLE_API_KEY is missing."
    );
  }

  const systemPrompt = `You are Krishi AI, a helpful, polite, and professional agricultural voice assistant for farmers in Mysuru, Karnataka, India.
Your goal is to provide precise, accurate, and easy-to-understand advice on crops, weather, soil health, farming methods, and government schemes.
The user is conversing in language: ${language === "kn" ? "Kannada" : language === "hi" ? "Hindi" : "English"}.
You MUST respond in ${language === "kn" ? "Kannada" : language === "hi" ? "Hindi" : "English"}.
Because this is a VOICE assistant, keep your responses short, natural, and conversational (maximum 2-3 sentences). Do not use bullet points or markdown symbols like asterisks in your response text. Use simple spoken language that farmers can easily understand when read aloud.`;

  const contents: { role: string; parts: { text: string }[] }[] = [];

  for (const turn of history) {
    contents.push({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.text }],
    });
  }
  contents.push({ role: "user", parts: [{ text: message }] });

  const requestBody = {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 250,
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I am sorry, I could not generate a response."
  );
};
