"use client";
import { MDXFeedbackBlock } from "@/mdx-components";
import {
	DiscordBold,
	DiscordContainer,
	DiscordCustomEmoji,
	DiscordItalic,
	DiscordLink,
	DiscordMessage,
	DiscordMessages,
	DiscordTextDisplay,
} from "@penwin/discord-components-react-render";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CorrectHeaderFixer } from "../correct-header-fixer";

export function RoleContainerExample() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true));

	if (!mounted) return null;
	return (
		<MDXFeedbackBlock id="app-card" body="Blacklisted Channel Card (#response)">
			<DiscordMessages
				className="py-4 font-[gg_sans] rounded-[8px] border"
				lightTheme={resolvedTheme === "light"}
			>
				<DiscordMessage
					author="Clementine"
					avatar="https://pluralbuddy.giftedly.dev/clementine.jpeg"
					bot={true}
					className="px-3 "
					lightTheme={resolvedTheme === "light"}
				>
					<DiscordContainer accentColor="#f1aef2" className="mb-2">
						<DiscordTextDisplay className="block">
							<DiscordCustomEmoji
								url="/image/moderator-example.png"
								name="moderator"
								className="mr-1"
							/>{" "}
							Moderator
						</DiscordTextDisplay>
					</DiscordContainer>
					<DiscordTextDisplay className="block">
						Hi! I'm Clementine!
					</DiscordTextDisplay>
				</DiscordMessage>
				<DiscordMessage
					lightTheme={resolvedTheme === "light"}
					message-body-only
					className="block"
				>
					<DiscordTextDisplay className="block">
						The role container doesn't continue across consecutive proxies.
					</DiscordTextDisplay>
				</DiscordMessage>
				<DiscordMessage
					lightTheme={resolvedTheme === "light"}
					message-body-only
					className="block"
				>
					<DiscordTextDisplay className="block">
						Did you know Clementine's profile is from{" "}
						<DiscordLink
							href="https://en.wikipedia.org/wiki/The_Fragrant_Flower_Blooms_with_Dignity"
							target="_blank"
						>
							<DiscordItalic>
								The Fragrant Flowers Bloom with Dignity
							</DiscordItalic>
						</DiscordLink>
						?
					</DiscordTextDisplay>
				</DiscordMessage>
			</DiscordMessages>

			<CorrectHeaderFixer />
		</MDXFeedbackBlock>
	);
}
