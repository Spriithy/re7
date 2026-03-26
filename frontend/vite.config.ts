import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

const ReactCompilerConfig = {};
const allowedHosts = Array.from(
  new Set(
    (process.env.VITE_ALLOWED_HOSTS ?? "localhost,127.0.0.1")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean)
      .flatMap((host) => {
        const normalizedHost = host.replace(/\.+$/, "");
        if (!normalizedHost) {
          return [];
        }

        return normalizedHost === "localhost"
          ? [normalizedHost]
          : [normalizedHost, `${normalizedHost}.`];
      }),
  ),
);
const host = process.env.VITE_HOST ?? "0.0.0.0";
const backendProxyTarget =
  process.env.BACKEND_PROXY_TARGET ?? "http://localhost:8000";
const proxyConfig = {
  "/api": {
    target: backendProxyTarget,
    changeOrigin: false,
  },
  "/health": {
    target: backendProxyTarget,
    changeOrigin: false,
  },
  "/uploads": {
    target: backendProxyTarget,
    changeOrigin: false,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["lucide-react"],
  },
  server: {
    host,
    allowedHosts,
    proxy: proxyConfig,
  },
  preview: {
    host,
    allowedHosts,
    proxy: proxyConfig,
  },
});
