import { generateFiles } from "fumadocs-openapi";
import { openapi } from "@/lib/openapi";
import { globby } from "globby";
import { mkdir } from "node:fs/promises";

await mkdir("content/docs/pluralbuddy/api")

await generateFiles({
	input: openapi,
	output: "./content/docs/pluralbuddy/api",
	// we recommend to enable it
	// make sure your endpoint description doesn't break MDX syntax.
	includeDescription: true,
	groupBy: "route",

	index: {
		// for generating `href`
		url: (file) => `/docs/pluralbuddy/api/${file.replace(".mdx", "")}`,
		items: [
			{
				path: "index.mdx",
			},
		],
	},
});

Bun.write(
	"./content/docs/pluralbuddy/api/meta.json",
	JSON.stringify({
		title: "API References",
		pages: (await globby(["./content/docs/pluralbuddy/api/**/*.mdx"])).map(
			(v) =>
				v.replace("./content/docs/pluralbuddy/api/", "").replace(".mdx", ""),
		).slice(1),
	}, null, 2),
);
