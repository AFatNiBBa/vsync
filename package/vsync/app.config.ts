
import { defineConfig } from "@solidjs/start/config";
import { UserConfig } from "vite";

export default defineConfig({
	ssr: false,
	vite: {
		build: {
			minify: false
		}
	} satisfies UserConfig
});
