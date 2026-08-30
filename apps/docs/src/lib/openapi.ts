import path from "node:path";
import { createOpenAPI } from "fumadocs-openapi/server";

const baseUrl =
	process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined
		? process.env.BETTER_AUTH_URL
		: process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: undefined;
console.log();
const schemaPath = process.cwd().includes("/apps/docs")
	? path.join(process.cwd(), `./public/openapi.yml`)
	: path.join(process.cwd(), `./apps/docs/public/openapi.yml`);

export const openapi = createOpenAPI({
	// the OpenAPI schema, you can also give it an external URL.
	input: ["https://pluralbuddy-git-terminology-dvelo.vercel.app/openapi.yml"],
});
