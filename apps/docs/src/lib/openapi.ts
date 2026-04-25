import { createOpenAPI } from 'fumadocs-openapi/server';

const baseUrl =
	process.env.NEXT_PUBLIC_SITE_URL ??
	(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
	(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined);

const schemaPath = baseUrl
	? `${baseUrl}/openapi.yml`
	: process.cwd().includes('/apps/docs')
		? './public/openapi.yml'
		: './apps/docs/public/openapi.yml';

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: async () => ({
    './public/openapi.yml': schemaPath,
  }),
});