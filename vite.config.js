
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

import { existsSync, statSync, readdirSync } from "fs";
import { resolve } from "path";

/**
 * Se {@link path} E' un file, lo restituisce.
 * Se {@link path} E' una cartella, esegue la funzione sui suoi figli.
 * @param {import("fs").PathLike} path Il percorso da traversare
 * @param {(x: import("fs").PathLike) => boolean} f Funzione che filtra i percorsi
 * @returns Un iteratore di percorsi di file
 */
function *traverse(path, f) {
  if (existsSync(path))
    if (statSync(path).isDirectory())
      for (const file of readdirSync(path))
        yield* traverse(resolve(path, file), f);
    else if (f?.(path) ?? true)
      yield path;
}

const root = resolve(__dirname, "src/public");
const input = [ ...traverse(root, x => x.endsWith(".html")) ];

export default defineConfig({
  root,
  plugins: [ solidPlugin() ],
  build: {
    minify: false,
    target: "esnext",
    emptyOutDir: true,
    polyfillDynamicImport: false,
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input,
    },
  },
});