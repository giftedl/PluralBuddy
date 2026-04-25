import { createOpenAPI } from 'fumadocs-openapi/server';
import { existsSync } from 'node:fs';
import path from 'node:path';

const possibleSchemaPaths = [
	path.join(process.cwd(), 'public', 'openapi.yml'),
	path.join(process.cwd(), 'apps', 'docs', 'public', 'openapi.yml'),
];

const schemaPath =
	possibleSchemaPaths.find((candidate) => existsSync(candidate)) ??
	possibleSchemaPaths[0];

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: [schemaPath],
});