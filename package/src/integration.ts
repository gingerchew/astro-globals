import { addVirtualImports, defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";

export const integration = defineIntegration({
	name: "astro-globals",
	optionsSchema: z.object({
		sources: z.array(
			z.string().or(z.object({ name: z.string(), file: z.string() })),
		),
	}),
	setup({ name, options }) {
		const imports = options.sources.reduce(
			(acc, source) => {
				if (typeof source === "string") {
					acc["globals/data"] += `\nexport * from "${source}";`;
				} else if (source.name) {
					acc[`globals/${source.name}`] = `export * from "${source.file}";`;
				}

				return acc;
			},
			{
				"globals/data": "",
			} as Record<string, string>,
		);

		return {
			hooks: {
				"astro:config:setup": async (params) => {
					addVirtualImports(params, {
						name,
						imports,
					});
				},
				/**
				 * There has to be a better way to get the typescript types
				 * and more accurate too
				 */
				"astro:config:done": async ({ injectTypes }) => {
					injectTypes({
						filename: "types.d.ts",
						content: 'declare module "globals:data";',
					});
				},
			},
		};
	},
});
