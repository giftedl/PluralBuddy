"use client";

import { MDXFeedbackBlock } from "@/mdx-components";
import {
	DiscordButton,
	DiscordContainer,
	DiscordLink,
	DiscordMention,
	DiscordMessage,
	DiscordMessages,
	DiscordSection,
	DiscordSectionComponents,
	DiscordTextDisplay,
} from "@penwin/discord-components-react-render";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function DMRepliesExample() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true));

	if (!mounted) return null;
	return (
		<MDXFeedbackBlock id="dm-replies-card" body="DM Replies Card (#dm-replies)">
			<DiscordMessages
				className="py-4 font-[gg_sans] rounded-[8px] border"
				lightTheme={resolvedTheme === "light"}
			>
				<DiscordMessage
					author="PluralBuddy"
					avatar="/image/solar-centered.png"
					bot={true}
					verified={true}
					roleColor="#1e88e5"
					className="px-3"
					lightTheme={resolvedTheme === "light"}
				>
					<DiscordContainer lightTheme={resolvedTheme === "light"}>
						<DiscordSection>
							<DiscordSectionComponents>
								<DiscordTextDisplay className="block">
									<DiscordMention>giftedly</DiscordMention> replied to you in{" "}
									<DiscordMention type="channel">general</DiscordMention>, and
									you have DM replies on.{" "}
									<DiscordLink href="#">Message Link</DiscordLink>
								</DiscordTextDisplay>
							</DiscordSectionComponents>
							<DiscordButton type="destructive">Disable DM Replies</DiscordButton>
						</DiscordSection>
					</DiscordContainer>
				</DiscordMessage>
			</DiscordMessages>
		</MDXFeedbackBlock>
	);
}
