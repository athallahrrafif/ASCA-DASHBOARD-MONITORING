import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // Di-serve dari root domain oleh FastAPI (satu origin dengan /api),
  // sehingga cookie login berfungsi. Bukan lagi GitHub Pages.
  base: "/",

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
