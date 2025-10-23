import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

const API_BASE = "https://taskflow-api.istad.co";

export default defineConfig({
  base: "/", // ✅ ensure correct base path for Vercel
  plugins: [react(), tailwind()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: API_BASE,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
