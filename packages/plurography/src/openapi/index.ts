
import {
	OpenApiGeneratorV31,
	OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { YAML } from "bun";
import { readdir } from "node:fs/promises"
import { fetchAllFilesFromGivenFolder } from "./utils";

const registry = new OpenAPIRegistry();
const routes = await fetchAllFilesFromGivenFolder("./src/openapi/routes")

const modules = routes.map(async v => await import(`@/${v.split("/").slice(1).join('/')}`));

await Promise.all(modules.map(async (m) => (await m).register(registry)))

const generator = new OpenApiGeneratorV31(registry.definitions);
const document = generator.generateDocument({
	openapi: "3.1.0",
	info: { title: "PluralBuddy API", version: "1.0.0" },
	servers: [
		{
			url: "https://pb.giftedly.dev/api",
		},
	],
	security: [
		{
			bearerAuth: [],
			apiKeyCookie: [],
			oAuth2: [],
		},
	],
});

Bun.write(
	"../../apps/docs/./public/openapi.yml",
	YAML.stringify(document, null, 2),
);
