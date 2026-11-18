import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // GitHub Pages repository path
  base: "/ASCA-DASHBOARD-MONITORING/",

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
      },
    },
  },
});
