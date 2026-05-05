import { createMDX } from "fumadocs-mdx/next";
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = createMDX();

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
	},
	serverExternalPackages: ["node:fs/promises"]
};

const withNextIntl = createNextIntlPlugin();

export default withMDX(withNextIntl(config));
