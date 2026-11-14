"use client";

/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
  DiscordActionRow,
  DiscordBold,
  DiscordButton,
  DiscordCommand,
  DiscordContainer,
  DiscordHeader,
  DiscordImageAttachment,
  DiscordMediaGallery,
  DiscordMediaGalleryItem,
  DiscordMention,
  DiscordMessage,
  DiscordMessages,
  DiscordPre,
  DiscordSection,
  DiscordSectionComponents,
  DiscordSubscript,
  DiscordTextDisplay,
  DiscordThumbnail,
  setConfig,
} from "@penwin/discord-components-react-render";
import { Wrench } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MDXFeedbackBlock } from "@/mdx-components";
import { CorrectHeaderFixer } from "../correct-header-fixer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/shadcn-button";

export function SystemCardExample() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true));

  if (!mounted) return null;
  return (
    <MDXFeedbackBlock id="system-card" body="System Card (#root-usage)">
      <DiscordMessages
        className="py-4 font-[gg_sans] rounded-[8px] border"
        lightTheme={resolvedTheme === "light"}
      >
        <DiscordMessage
          author="PluralBuddy"
          avatar="/image/pfp.png"
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
            command="system info"
            className="ml-14"
            lightTheme={resolvedTheme === "light"}
          />
          <DiscordContainer lightTheme={resolvedTheme === "light"}>
            <DiscordSection>
              <DiscordSectionComponents>
                <DiscordTextDisplay>
                  <DiscordHeader>Solar's System</DiscordHeader>
                  <DiscordSubscript>🌼 · he/him</DiscordSubscript>
                </DiscordTextDisplay>
                <DiscordTextDisplay>
                  Hello! I'm Solar, and this is Solar's System. I go by he/him pronouns and I'm a
                  system on PluralBuddy. 👋 Be sure if see me around to say hi!
                </DiscordTextDisplay>
                <DiscordTextDisplay className="block">
                  <DiscordBold>Alters: </DiscordBold>3
                  <br />
                  <DiscordBold>Tags: </DiscordBold>1
                  <br />
                  <DiscordBold>Associated to: </DiscordBold>
                  <DiscordMention>giftedly</DiscordMention> (1252031635692720224)
                </DiscordTextDisplay>
              </DiscordSectionComponents>
              <DiscordThumbnail media="/image/pfp.png" description="Solar" />
            </DiscordSection>
          </DiscordContainer>
          <DiscordActionRow>
            <DiscordButton
              type="primary"
              emoji="https://cdn.discordapp.com/emojis/1435094263032451202.webp?size=64"
            >
              Configure Profile
            </DiscordButton>
          </DiscordActionRow>
        </DiscordMessage>
        <CorrectHeaderFixer />
      </DiscordMessages>
    </MDXFeedbackBlock>
  );
}
