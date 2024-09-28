import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/server-runtime" {
  interface Future {
    unstable_singleFetch: true; // 👈 enable _types_ for single-fetch
  }
}

export default defineConfig({
  server: {
    host: true,
  },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
      future: {
        unstable_optimizeDeps: true,
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});
