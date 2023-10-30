import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  sourcemap: false,
  tsconfig: "tsconfig.lib.json",
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  minify: true,
  splitting: false,
  dts: false,
  treeshake: true,
});
