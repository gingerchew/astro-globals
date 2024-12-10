import { addVirtualImports, defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";

export const integration = defineIntegration({
	name: "astro-globals",
	optionsSchema: z.object({
		sources: z.array(z.string())
	}),
	setup({ name, options }) {
		
		const exports = options.sources.map(file => `export * from "${file}"`).join('\n');

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					addVirtualImports(params, {
						name, 
						imports: {
							['globals:data']: exports
						}
					})
				},
				'astro:config:done': async ({ injectTypes }) => {
					injectTypes({
						filename: 'types.d.ts',
						content: 'declare module "globals:data";'
					})
				}
			},
		};
	},
});
