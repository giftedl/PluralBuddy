import path from "node:path";
import { fileURLToPath } from "node:url";
import { paraglideWebpackPlugin } from "@inlang/paraglide-js";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
	transpilePackages: ["plurography"],
	reactStrictMode: true,
	typescript: {
		// TypeScript is strictly for IDE support for the frontend.
		ignoreBuildErrors: true,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb"
		}
	},
	serverExternalPackages: ["node:fs"],
	allowedDevOrigins: ['192.168.0.234'],
	headers() {
		return [
			{
				source: '/api/v1/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "X-CSRF-Token, X-Requested-With, Authorization, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
					}
				],
			},
			{
				source: '/api/auth/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "X-CSRF-Token, X-Requested-With, Authorization, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
					}
				],
			},
		]
	},

	webpack: (config) => {
		config.plugins.push(
			paraglideWebpackPlugin({
				outdir: "./src/paraglide",
				project: "./project.inlang",
				emitTsDeclarations: true,
				strategy: ["cookie", "baseLocale"],
			})
		);
		return config;
	},

};

export default withMDX(config);
