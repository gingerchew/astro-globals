import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: 'json' }
const { peerDependencies } = pkg;

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ["src/**/*.(ts|js)"],
		format: ["esm"],
		target: "node22",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [...Object.keys(peerDependencies)],
		tsconfig: "tsconfig.json",
	};
});
