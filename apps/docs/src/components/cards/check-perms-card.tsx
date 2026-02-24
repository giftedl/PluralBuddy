"use client";
import {
	DiscordCode,
	DiscordCommand,
	DiscordContainer,
	DiscordCustomEmoji,
	DiscordItalic,
	DiscordMessage,
	DiscordMessages,
	DiscordQuote,
	DiscordSubscript,
	DiscordTextDisplay,
} from "@penwin/discord-components-react-render";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CorrectHeaderFixer } from "../correct-header-fixer";
import { FeedbackBlock } from "../feedback/client";
import { MDXFeedbackBlock } from "@/mdx-components";

export function CheckPermsCardExample() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true));

	if (!mounted) return null;
	return (
		<MDXFeedbackBlock id="check-perms-card" body="Check Permissions Card (#example)">
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
					<DiscordCommand
						type="slash_command"
						slot="reply"
						author="You"
						avatar="https://cdn.discordapp.com/embed/avatars/3.png"
						command="checkpermissions"
						className="ml-14"
						lightTheme={resolvedTheme === "light"}
					/>

					<DiscordTextDisplay className="pb-2">
						<DiscordSubscript>
							<DiscordCustomEmoji
								name="reply"
								url="https://cdn.discordapp.com/emojis/1437573788245037186.webp?size=64"
							/>{" "}
							Why is an <DiscordCode>[APP]</DiscordCode>/
							<DiscordCode>[BOT]</DiscordCode> user talking in chat?
						</DiscordSubscript>
					</DiscordTextDisplay>
					<DiscordContainer accentColor="#FCCEE8">
						<DiscordTextDisplay className="block">
							PluralBuddy supports a wide range of permission configurations due
							to how alters & systems are setup.
							<br />
							<br />
							<DiscordQuote>
								Pro tip: Don't give all bots Administrator permissions! It
								increases your likelihood of being raided if a bot is
								compromised.
							</DiscordQuote>
							<br />
							However, there are still base permissions that are needed to
							operate the bot due to how PluralBuddy is designed.
							<br />
							<br />
							<DiscordQuote>
								Manage Messages: Needed to effectively delete proxied messages.
								(<DiscordItalic>Granted</DiscordItalic>)<br />
								Send Messages: Needed to communicate with users. (
								<DiscordItalic>Granted</DiscordItalic>)<br />
								View Channel: Needed for the bot to see and use the channel.
								(Granted)
							</DiscordQuote>
							<br />
							However, there are two permissions that you can use for proxying
							which requires only 1 to be granted depending on the proxy mode
							you'd like in the environment.
							<br />
							<DiscordSubscript>
								If you'd like both modes to be enabled, you can grant both
								permissions.
							</DiscordSubscript>
							<br />
							<DiscordQuote>
								Manage Nicknames: Needed for Nickname proxy mode (
								<DiscordItalic>Granted</DiscordItalic>). Proxying user also
								needs the Change Nickname permission (Granted). Manage Webhooks:
								Needed for Webhook proxy mode (
								<DiscordItalic>Granted</DiscordItalic>).
							</DiscordQuote>
							<br />
							<DiscordSubscript>
								ALL permissions are needed in context of the channel. If any of
								the 5 above permissions aren't granted accordingly, in a
								channel, then the bot won't work in the way specified above just
								in that channel.
							</DiscordSubscript>
						</DiscordTextDisplay>
					</DiscordContainer>
				</DiscordMessage>

				<CorrectHeaderFixer />
			</DiscordMessages>
		</MDXFeedbackBlock>
	);
}
