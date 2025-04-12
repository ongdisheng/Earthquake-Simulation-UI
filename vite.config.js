import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

const thresholdValue = 80;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.js",
    coverage: {
      reporter: ["text", "json-summary", "json"],
      thresholds: {
        lines: thresholdValue,
        branches: thresholdValue,
        functions: thresholdValue,
        statements: thresholdValue,
      },
    },
  },
});
