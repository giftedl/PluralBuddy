import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "./components/image-zoom";
import { SystemCardExample } from "@/components/cards/system-card";
import { FeedbackBlock } from "./components/feedback/client";
import posthog from "posthog-js";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		img: (props) => {
			return <ImageZoom {...(props as any)} {...(props.src as any)} />;
		},
		SystemCardExample,

		FeedbackBlock: (props) => (
			<FeedbackBlock
				{...props}
				onSendAction={async (feedback) => {
					"use server";

					posthog.init(process.env.POSTHOG_API_KEY ?? "", {
						api_host: "https://us.i.posthog.com",
					});

					posthog.capture("on_rate_block", feedback);

					return { githubUrl: "https://github.com/giftedl/PluralBuddy" };
				}}
			>
				{props.children}
			</FeedbackBlock>
		),
		...components,
	};
}
