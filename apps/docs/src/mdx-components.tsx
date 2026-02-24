import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "./components/image-zoom";
import { SystemCardExample } from "@/components/cards/system-card";
import { FeedbackBlock } from "./components/feedback/client";
import { AppCardExample } from "./components/cards/app-card";
import { CheckPermsCardExample } from "./components/cards/check-perms-card";
import { onSendFeedback } from "./app/actions";

export const MDXFeedbackBlock = (props: any) => (
	<FeedbackBlock
		{...props}
		onSendAction={onSendFeedback}
	>
		{props.children}
	</FeedbackBlock>
)

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		img: (props) => {
			return <ImageZoom {...(props as any)} {...(props.src as any)} />;
		},
		SystemCardExample,
		AppCardExample,
		CheckPermsCardExample,

		FeedbackBlock: (props) => (
			<MDXFeedbackBlock {...props} />
		),
		...components,
	};
}
