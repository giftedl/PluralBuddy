import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { SystemCardExample } from "@/components/cards/system-card";
import { onSendFeedback } from "./app/actions";
import { AppCardExample } from "./components/cards/app-card";
import { BlockedChannelExample } from "./components/cards/blocked-channel";
import { BlockedRoleExample } from "./components/cards/blocked-role";
import { CheckPermsCardExample } from "./components/cards/check-perms-card";
import { DMRepliesExample } from "./components/cards/dm-replies-card";
import { RoleContainerExample } from "./components/cards/role-container-card";
import { ThirdPartyIntegrationViewer } from "./components/docs/3rd-party-integrations";
import { FeedbackBlock } from "./components/feedback/client";
import { ImageZoom } from "./components/image-zoom";
import { AlphabeticalSort } from "./components/sort";
import { Step, Steps } from "./components/steps";

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
		BlockedRoleExample,
		BlockedChannelExample,
		DMRepliesExample,
		RoleContainerExample,
		AlphabeticalSort,
		// APIPage,
		Steps,
		Step,
		ThirdPartyIntegrationViewer,
		FeedbackBlock: (props) => <MDXFeedbackBlock {...props} />,
		...components,
	};
}
