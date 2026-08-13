import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// `vite` / `vite build` -> demo playground app (index.html)
// `vite build --mode lib` -> publishable package in dist/ (src/index.ts entry)
export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";

  return {
    plugins: [
      react(),
      ...(isLib
        ? [
            dts({
              tsconfigPath: "./tsconfig.app.json",
              entryRoot: "src",
              include: ["src/index.ts", "src/table/**/*.ts", "src/table/**/*.tsx"],
              insertTypesEntry: true,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: isLib
      ? {
          lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "CustomDataTable",
            fileName: (format) => `custom-data-table.${format}.js`,
            formats: ["es", "cjs"],
          },
          rollupOptions: {
            external: [
              "react",
              "react-dom",
              "react/jsx-runtime",
              "@tanstack/react-table",
              "lucide-react",
            ],
            output: {
              exports: "named",
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
              },
            },
          },
          sourcemap: true,
          emptyOutDir: true,
        }
      : {
          outDir: "demo-dist",
        },
  };
});
