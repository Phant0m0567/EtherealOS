import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: "./",
  define: {
    "process.env.NODE_ENV": `"${mode}"`,
  },
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          return "vendor";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
  },
}));
