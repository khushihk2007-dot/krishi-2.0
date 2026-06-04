export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}

export const fetchLearningVideos = async (
  query: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> => {
  try {
    // If running via Vite locally, we might need to point to /api/youtube or the local proxy
    // In Vercel dev or production, /api/youtube will map to the serverless function.
    // However, if standard vite doesn't proxy /api natively, we might need to use full URL or configure proxy.
    // Assuming the user runs with a backend server that handles /api or Vercel CLI. 
    // If not, we'll fetch relative path and rely on proxy settings in vite.config.ts if they exist.
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const url = `${baseUrl}/api/youtube?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch videos. Status: ${response.status}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid response from server. Make sure the API proxy is running.");
    }

    if (data.error) {
      throw new Error(data.error.message || "YouTube API error");
    }

    if (!data.items) {
      return [];
    }

    return data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error: any) {
    console.error("Error fetching learning videos:", error);
    throw error;
  }
};
