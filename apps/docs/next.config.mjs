import { createMDX } from "fumadocs-mdx/next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const withMDX = createMDX();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	typescript: {
		// TypeScript is strictly for IDE support for the frontend.
		ignoreBuildErrors: true,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb"
		}
	}
};

export default withMDX(config);
