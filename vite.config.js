// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
  build: {
    lib: {
      entry: "src/embed.jsx",
      name: "ScreenshotWidget",
      fileName: (format) => `screenshot-widget.${format}.js`,
      formats: ["umd", "es"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    minify: true, // Use esbuild minification instead of terser
    cssCodeSplit: false,
    assetsInlineLimit: 100000, // Inline small assets
    target: "es2015", // Support older browsers
  },
  server: {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, Content-Length, X-Requested-With",
    },
  },
});
