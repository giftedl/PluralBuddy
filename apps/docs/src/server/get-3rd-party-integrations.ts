"use server";

import { unstable_cache } from "next/cache";
import clientPromise from "./db";

export type DocsThirdPartyIntegration = {
	iconUrl: string;
	name: string;
	description: string;
	supports: string;
	
	button?: {
		link: string;
		label: string;
	};
	link: string;
	author?: string;
};

const fetchIntegrations = unstable_cache(
	async () => {
		const mongo = await clientPromise;
		const db = mongo.db(`${process.env.ENV}-pluralbuddy-app`);
		const integrations = await db
			.collection<DocsThirdPartyIntegration>("integrations")
			.find()
			.toArray();

		return integrations;
	},
	["integrations"],
	{ revalidate: 86400, tags: ["integrations"] },
);

export async function get3rdPartyIntegrations() {
    return await fetchIntegrations();
}
