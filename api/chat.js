export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { message, history = [], language = "en" } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Missing message parameter" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Gemini / Google API Key is not configured on the server" });
  }

  try {
    // Define system instructions for the farming assistant based on the active language
    const systemPrompt = `You are Krishi AI, a helpful, polite, and professional agricultural voice assistant for farmers in Mysuru, Karnataka, India.
Your goal is to provide precise, accurate, and easy-to-understand advice on crops, weather, soil health, farming methods, and government schemes.
The user is conversing in language: ${language === "kn" ? "Kannada" : language === "hi" ? "Hindi" : "English"}.
You MUST respond in ${language === "kn" ? "Kannada" : language === "hi" ? "Hindi" : "English"}.
Because this is a VOICE assistant, keep your responses short, natural, and conversational (maximum 2-3 sentences). Do not use bullet points or markdown symbols like asterisks in your response text. Use simple spoken language that farmers can easily understand when read aloud.`;

    // Format history and prompt for Gemini API
    const contents = [];

    // Add history entries
    for (const turn of history) {
      contents.push({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.text }]
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const requestBody = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Gemini API error: ${errorText}` });
    }

    const data = await response.json();

    // Extract the text content from Gemini's response
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am sorry, I could not generate a response.";
    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error("Error in Gemini chat proxy:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
