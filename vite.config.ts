
import adapter from "solid-start-express";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 80 },
  build: { minify: false },
  plugins: [
    solid({
      ssr: false,
      adapter: adapter()
    })
  ],
});