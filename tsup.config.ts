import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "esnext",
  outDir: "lib",
  format: ["esm"],
  minify: false,
  splitting: false,
  sourcemap: false,
  clean: false,
});
