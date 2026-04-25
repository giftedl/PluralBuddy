import { createOpenAPI } from 'fumadocs-openapi/server';

const schemaPath = process.cwd().includes('/apps/docs')
	? `${process.cwd()}/public/openapi.yml`
	: `${process.cwd()}/apps/docs/public/openapi.yml`;

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: async () => ({
    './public/openapi.yml': schemaPath,
  }),
});