"use client";
import { MDXFeedbackBlock } from "@/mdx-components";
import {
	DiscordBold,
	DiscordContainer,
	DiscordCustomEmoji,
	DiscordMessage,
	DiscordMessages,
	DiscordTextDisplay,
} from "@penwin/discord-components-react-render";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CorrectHeaderFixer } from "../correct-header-fixer";

export function BlacklistedChannelExample() {
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
					author="PluralBuddy"
					avatar="/image/solar-centered.png"
					bot={true}
					verified={true}
					roleColor="#1e88e5"
					className="px-3"
					lightTheme={resolvedTheme === "light"}
				>
					<DiscordContainer accentColor="#B70000">
						<DiscordTextDisplay className="block">
							<DiscordCustomEmoji url="https://cdn.discordapp.com/emojis/1436973282304725083.webp?size=60" name="x_" className="mr-1"/> That feature is disabled on this guild.
						</DiscordTextDisplay>
					</DiscordContainer>
				</DiscordMessage>
			</DiscordMessages>
		</MDXFeedbackBlock>
	);
}
