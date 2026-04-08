import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://api.iai-journal.test:81",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // Pour que les cookies soient transmis
        cookieDomainRewrite: "",
      },
    },
  },
});