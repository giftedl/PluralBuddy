import { createMDX } from "fumadocs-mdx/next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from 'next-intl/plugin';
import { execSync } from "child_process";
import {withSerwist} from "@serwist/turbopack";

const withMDX = createMDX();
const revision = execSync("git rev-parse HEAD", { encoding: "utf8" })
  .trim()
  .slice(0, 7);


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
	},
	serverExternalPackages: ["node:fs/promises"],
	allowedDevOrigins: ['192.168.0.234']
};

const withNextIntl = createNextIntlPlugin();

export default withSerwist(withMDX(withNextIntl(config)));
