import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load .env from the dashboard directory (where this file lives)
  const env = loadEnv(mode, path.resolve(import.meta.dirname), "");

  const port = Number(env.PORT ?? "5173");
  const basePath = env.BASE_PATH ?? "/";
  // API_BASE_URL is the full backend URL (e.g. http://localhost:3000 locally, Render URL in prod)
  const apiBaseUrl = env.API_BASE_URL ?? "http://localhost:3000";

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: false,
        deny: ["**/.*"],
      },
      proxy: {
        // During local dev, proxy /api/* → backend (no CORS needed)
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
