
import { defineConfig } from "@solidjs/start/config";
import { UserConfig } from "vite";

export default defineConfig({
	appRoot: "./src/template",
	routeDir: "../route",
	ssr: false,
	vite: {
		build: {
			minify: false
		}
	} satisfies UserConfig
});