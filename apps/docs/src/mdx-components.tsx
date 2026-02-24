import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "./components/image-zoom";
import { SystemCardExample } from "@/components/cards/system-card";
import { FeedbackBlock } from "./components/feedback/client";
import { PostHog } from "posthog-node";
import { after } from "next/server";
import { AppCardExample } from "./components/cards/app-card";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		img: (props) => {
			return <ImageZoom {...(props as any)} {...(props.src as any)} />;
		},
		SystemCardExample,
		AppCardExample,

		FeedbackBlock: (props) => (
			<FeedbackBlock
				{...props}
				onSendAction={async (feedback) => {
					"use server";

					const posthog = new PostHog(process.env.POSTHOG_API_KEY ?? "", {
						host: "https://us.i.posthog.com",
						flushAt: 1, // flush immediately in serverless environment
						flushInterval: 0, // same
					});

					await posthog.captureImmediate({
						event: "on_rate_block",
						properties: feedback,
          });
					
					after(() => posthog.shutdown())

					return { githubUrl: "https://github.com/giftedl/PluralBuddy" };
				}}
			>
				{props.children}
			</FeedbackBlock>
		),
		...components,
	};
}
