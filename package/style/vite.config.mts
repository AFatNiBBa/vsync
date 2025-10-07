
import sassDts from "vite-plugin-sass-dts";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sassDts({
			exportName: { replacement: x => x.split(".")[0] },
			typeName: { replacement: "string" },
			esmExport: true
		})
	]
});