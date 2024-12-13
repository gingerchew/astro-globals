import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";

const { default: astroGlobals } = await import("astro-globals");

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		astroGlobals({
			sources: ["./global.ts", { name: "site", file: "./src/globals2.ts" }],
		}),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
});
