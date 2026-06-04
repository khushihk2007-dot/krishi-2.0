export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { q, maxResults = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing search query (q)" });
  }

  const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "YouTube API Key is not configured on the server" });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
      q
    )}&maxResults=${maxResults}&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `YouTube API error: ${errorText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in YouTube proxy:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
