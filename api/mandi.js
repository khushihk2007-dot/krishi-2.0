// Node-level in-memory cache to safeguard against rate-limiting in hot serverless environments
const memoryCache = new Map();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

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

  // Set Vercel edge CDN cache headers (Cache for 10 minutes, serve stale for 5 minutes during background revalidation)
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");

  const { state, district, commodity, limit = 50, offset = 0 } = req.query;

  const apiKey = process.env.MANDI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Mandi API Key is not configured on the server" });
  }

  // Construct target URL with filters
  let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;
  
  if (state) {
    url += `&filters[state]=${encodeURIComponent(state)}`;
  }
  if (district) {
    url += `&filters[district]=${encodeURIComponent(district)}`;
  }
  if (commodity) {
    url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
  }

  // Check in-memory cache first
  const cachedData = memoryCache.get(url);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
    res.setHeader("X-Cache", "HIT-MEMORY");
    return res.status(200).json(cachedData.data);
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Agmarknet API error: ${errorText}` });
    }

    const data = await response.json();

    // Cache the successful response
    memoryCache.set(url, {
      timestamp: Date.now(),
      data: data
    });

    res.setHeader("X-Cache", "MISS");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in Mandi price proxy:", error);
    
    // In case of error, see if we have ANY stale cache we can return as fallback
    if (cachedData) {
      res.setHeader("X-Cache", "HIT-STALE-FALLBACK");
      return res.status(200).json(cachedData.data);
    }

    return res.status(500).json({ error: "Internal server error fetching Mandi prices" });
  }
}
