
import sassDts from "vite-plugin-sass-dts";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sassDts({
			esmExport: true,
			typeName: { replacement: "string" },
			exportName: {
				replacement(fileName) {
					return fileName.split(".")[0];
				},
			}
		})
	]
});