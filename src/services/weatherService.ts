export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  name: string;
  windSpeed: number;
  condition: string;
}

/**
 * Fetches live weather from the Vercel serverless proxy first, then falls
 * back to a direct client-side OpenWeather call.
 *
 * The proxy attempt is wrapped in its own try-catch so that failures
 * (including Vite returning HTML for `/api/weather` in local dev) cleanly
 * fall through to the direct API call.
 */
export const fetchLiveWeather = async (
  lat: number,
  lng: number
): Promise<WeatherData> => {
  // Helper to transform raw OpenWeather JSON → our WeatherData shape
  const parseWeather = (data: any): WeatherData => ({
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    description: data.weather?.[0]?.description || "clear sky",
    icon: data.weather?.[0]?.icon || "01d",
    name: data.name || "Mysuru",
    windSpeed: data.wind?.speed || 0,
    condition: data.weather?.[0]?.main || "Clear",
  });

  // ── 1. Attempt the Vercel serverless proxy ──────────────────
  try {
    const proxyRes = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
    const ct = proxyRes.headers.get("content-type") || "";

    // Only trust the response if it's JSON (avoids Vite's SPA HTML fallback)
    if (proxyRes.ok && ct.includes("application/json")) {
      const data = await proxyRes.json();
      if (data.main) {
        return parseWeather(data);
      }
    }
  } catch (_proxyErr) {
    console.warn(
      "Backend weather proxy not available, using direct OpenWeather API."
    );
  }

  // ── 2. Direct client-side OpenWeather call (fallback) ───────
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Weather proxy failed and client-side VITE_OPENWEATHER_API_KEY is missing."
    );
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error(`Weather service responded with status ${response.status}`);
  }

  const data = await response.json();
  return parseWeather(data);
};
