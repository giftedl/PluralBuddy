"use server";

import { after } from "node:test";
import { PostHog } from "posthog-node";

export async function onSendFeedback(feedback: {
	url: string;
	blockId: string;
	message: string;
	blockBody?: string | undefined;
}): Promise<{ githubUrl: string }> {
	const posthog = new PostHog(process.env.POSTHOG_API_KEY ?? "", {
		host: "https://us.i.posthog.com",
		flushAt: 1, // flush immediately in serverless environment
		flushInterval: 0, // same
	});

	await posthog.captureImmediate({
		event: "on_rate_block",
		properties: feedback,
	});

	after(() => posthog.shutdown());

	return { githubUrl: "https://github.com/giftedl/PluralBuddy" };
}
