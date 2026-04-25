import { createOpenAPI } from 'fumadocs-openapi/server';

const schemaPath = process.cwd().includes('/apps/docs')
	? './public/openapi.yml'
	: './apps/docs/public/openapi.yml';

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: [schemaPath],
});