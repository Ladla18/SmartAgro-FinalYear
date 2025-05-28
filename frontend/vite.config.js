import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IPs
    port: 5173, // Default Vite port
    strictPort: true, // Don't try other ports if 5173 is taken
    open: true, // Open browser on server start
    cors: true, // Enable CORS
    hmr: {
      // Enable Hot Module Replacement
      host: "localhost",
      protocol: "ws",
    },
    watch: {
      // Watch for file changes
      usePolling: true,
    },
    // Proxy configuration for API requests if needed
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // Build configuration
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
