import React, { useState, useEffect } from "react";
import { Search, Play, BookmarkPlus, BookmarkCheck, Youtube, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchLearningVideos, YouTubeVideo } from "@/services/youtubeService";
import { toast } from "sonner";

interface AgriLearningHubProps {
  farmerProfile: { name: string; crop: string; district: string };
  language: "en" | "kn" | "hi";
}

const CATEGORIES = [
  "Export Market",
  "Organic Fertilizer",
  "Pest Prevention",
  "Advanced AgriTech",
  "Modern Irrigation",
  "Govt Awareness",
  "Crop Techniques",
];

export const AgriLearningHub: React.FC<AgriLearningHubProps> = ({ farmerProfile, language }) => {
  const [activeTab, setActiveTab] = useState<"recommended" | "saved">("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Crop Techniques");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [savedVideos, setSavedVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved videos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("krishi_saved_videos");
    if (saved) {
      try {
        setSavedVideos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved videos", e);
      }
    }
  }, []);

  const saveToLocalStorage = (videosToSave: YouTubeVideo[]) => {
    localStorage.setItem("krishi_saved_videos", JSON.stringify(videosToSave));
    setSavedVideos(videosToSave);
  };

  const toggleSaveVideo = (video: YouTubeVideo) => {
    const isSaved = savedVideos.some((v) => v.videoId === video.videoId);
    if (isSaved) {
      saveToLocalStorage(savedVideos.filter((v) => v.videoId !== video.videoId));
      toast.success("Removed from Watch Later");
    } else {
      saveToLocalStorage([...savedVideos, video]);
      toast.success("Saved to Watch Later");
    }
  };

  const loadVideos = async (searchTerm?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build an intelligent query
      const langSuffix = language === "kn" ? "Kannada" : language === "hi" ? "Hindi" : "English";
      const baseCrop = farmerProfile.crop || "Farming";
      const query = searchTerm || `${baseCrop} ${activeCategory} ${langSuffix}`;
      
      const results = await fetchLearningVideos(query, 12);
      setVideos(results);
      if (results.length === 0) {
        setError("No videos found. Try a different search term or category.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load videos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "recommended") {
      loadVideos();
    }
  }, [activeCategory, activeTab, language, farmerProfile.crop]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("recommended");
      loadVideos(searchQuery.trim());
    }
  };

  const displayedVideos = activeTab === "saved" ? savedVideos : videos;

  const labels = {
    title: language === "kn" ? "ಎಐ-ಚಾಲಿತ ಕೃಷಿ ಕಲಿಕಾ ಕೇಂದ್ರ" : "AI-Powered Agri Learning Hub",
    subtitle: language === "kn" ? "ನಿಮ್ಮ ಬೆಳೆ ಮತ್ತು ಪ್ರೊಫೈಲ್ ಆಧರಿಸಿ ಶಿಫಾರಸು ಮಾಡಿದ ವೀಡಿಯೊಗಳು" : "Smart recommendations based on your crop and profile",
    searchPlaceholder: language === "kn" ? "ವೀಡಿಯೊಗಳನ್ನು ಹುಡುಕಿ..." : "Search videos...",
    recommended: language === "kn" ? "ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ" : "Recommended for You",
    saved: language === "kn" ? "ಉಳಿಸಿದ ವೀಡಿಯೊಗಳು" : "Watch Later",
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
          <Youtube size={120} />
        </div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 relative z-10">
          <Youtube className="w-8 h-8 text-red-500 bg-white rounded-full p-1" />
          {labels.title}
        </h2>
        <p className="text-emerald-100 mb-6 relative z-10 max-w-xl">
          {labels.subtitle}
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 w-5 h-5" />
            <Input
              type="text"
              placeholder={labels.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/95 text-emerald-900 border-none placeholder:text-emerald-600/70 w-full"
            />
          </div>
          <Button type="submit" variant="secondary" className="bg-emerald-100 hover:bg-white text-emerald-900">
            Search
          </Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-2 flex flex-col">
            <button
              onClick={() => setActiveTab("recommended")}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "recommended" ? "bg-emerald-50 text-emerald-800" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ⭐ {labels.recommended}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${
                activeTab === "saved" ? "bg-emerald-50 text-emerald-800" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>🔖 {labels.saved}</span>
              {savedVideos.length > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold">
                  {savedVideos.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === "recommended" && (
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      activeCategory === cat
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-emerald-600">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p>Finding the best videos for {farmerProfile.crop}...</p>
            </div>
          ) : error ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col items-center text-center">
              <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
              <p className="text-amber-800 font-medium">{error}</p>
            </div>
          ) : displayedVideos.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 flex flex-col items-center text-center">
              <Youtube className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No videos to display</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                {activeTab === "saved" ? "You haven't saved any videos yet. Browse recommendations and click the bookmark icon to save." : "Try adjusting your search or category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedVideos.map((video) => {
                const isSaved = savedVideos.some((v) => v.videoId === video.videoId);
                return (
                  <div key={video.videoId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transform hover:scale-110 transition-all shadow-lg"
                        >
                          <Play className="w-6 h-6 ml-1" />
                        </a>
                      </div>
                      <button
                        onClick={() => toggleSaveVideo(video)}
                        className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved ? "bg-emerald-500/90 text-white" : "bg-black/40 text-white hover:bg-black/60"
                        }`}
                        title={isSaved ? "Remove from Watch Later" : "Save to Watch Later"}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3
                        className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1 group-hover:text-emerald-700 transition-colors"
                        dangerouslySetInnerHTML={{ __html: video.title }}
                      />
                      <p className="text-xs text-gray-500 mb-3">{video.channelTitle}</p>
                      
                      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Watch Now
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
