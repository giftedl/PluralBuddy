import { createOpenAPI } from 'fumadocs-openapi/server';
throw new Error(process.cwd())

const schemaPath = process.cwd().includes('docs')
	? './public/openapi.yml'
	: './apps/docs/public/openapi.yml';

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: [schemaPath],
});