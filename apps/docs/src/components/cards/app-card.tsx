"use client";
import {
	DiscordCode,
	DiscordCommand,
	DiscordContainer,
	DiscordCustomEmoji,
	DiscordHeader,
	DiscordItalic,
	DiscordMessage,
	DiscordMessages,
	DiscordSubscript,
	DiscordTextDisplay,
} from "@penwin/discord-components-react-render";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CorrectHeaderFixer } from "../correct-header-fixer";

export function AppCardExample() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true));

	if (!mounted) return null;
	return (
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
					command="app"
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
					<DiscordHeader level="2">
						This server uses an application named PluralBuddy, a{" "}
						<DiscordItalic>plurality</DiscordItalic> bot.
					</DiscordHeader>
					<DiscordTextDisplay className="block">
						This bot serves people that would like to serve under a different
						identity while being on the same Discord account. <br/><br/>However,
						PluralBuddy uses a Discord feature named webhooks, which requires
						all messages sent by webhooks to have the <DiscordCode>[APP]</DiscordCode> tag, or on older
						clients, the <DiscordCode>[BOT]</DiscordCode> tag. However, users proxying with PluralBuddy are
						not bots; infact PluralBuddy takes steps to ensure they aren't. <br/><br/> Many
						servers have rules specific to PluralBuddy. Please check in with a
						server administrator regarding these topics if you have further
						questions.
					</DiscordTextDisplay>
				</DiscordContainer>
			</DiscordMessage>
			<CorrectHeaderFixer />
		</DiscordMessages>
	);
}
