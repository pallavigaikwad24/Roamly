
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");

  return {
    plugins: [react()],

    envDir: rootDir,

    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true
        }
      }
    }
  };
});
