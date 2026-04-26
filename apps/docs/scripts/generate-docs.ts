import { generateFiles } from "fumadocs-openapi";
import { openapi } from "@/lib/openapi";
import { globby } from "globby";
import { mkdir } from "node:fs/promises";

await mkdir("content/docs/en/pluralbuddy/api")

await generateFiles({
	input: openapi,
	output: "./content/docs/en/pluralbuddy/api",
	// we recommend to enable it
	// make sure your endpoint description doesn't break MDX syntax.
	includeDescription: true,
	groupBy: "route",

	index: {
		// for generating `href`
		url: (file) => `/en/docs/pluralbuddy/api/${file.replace(".mdx", "")}`,
		items: [
			{
				path: "index.mdx",
			},
		],
	},
});

Bun.write(
	"./content/docs/en/pluralbuddy/api/meta.json",
	JSON.stringify({
		title: "API References",
		pages: (await globby(["./content/docs/en/pluralbuddy/api/**/*.mdx"])).map(
			(v) =>
				v.replace("./content/docs/en/pluralbuddy/api/", "").replace(".mdx", ""),
		).slice(1),
	}, null, 2),
);
