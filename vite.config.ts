import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        '/api/youtube': {
          target: 'https://www.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => {
            const apiKey = env.YOUTUBE_API_KEY || env.VITE_YOUTUBE_API_KEY;
            return path.replace(/^\/api\/youtube/, '/youtube/v3/search') + `&part=snippet&type=video&key=${apiKey}`;
          }
        }
      }
    },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  };
});
