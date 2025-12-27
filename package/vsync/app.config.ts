
import { defineConfig } from "@solidjs/start/config";
import { UserConfig } from "vite";

export default defineConfig({
	ssr: false,
	middleware: "src/middleware.ts",
	vite: {
		build: {
			minify: false
		}
	} satisfies UserConfig
});