import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// set code coverage threshold value
const thresholdValue = 0;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  test: {
    environment: "happy-dom",
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
