import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],

          redux: ["@reduxjs/toolkit", "react-redux"],

          forms: ["formik", "yup"],

          i18n: ["i18next", "react-i18next"],

          motion: ["framer-motion"],
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  // server: {
  //   host: true,
  //   port: 5174,
  // },
});
