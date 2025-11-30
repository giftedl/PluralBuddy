import type { TopLevelBuilders } from "seyfert";
import { Container, TextDisplay, ActionRow, Button, Separator } from "seyfert";
import { ButtonStyle, Spacing } from "seyfert/lib/types";

export function getInfoMessage(): TopLevelBuilders[] {
    return [
        new Container()
            .setColor("#FCCEE8")
            .setComponents(
                new TextDisplay()
                    .setContent(`## Server Rules
> 1. **No spamming** walls of text or same emojis
> 2. **No NSFW content**, as per PluralBuddy's [Terms of Service](https://pb.giftedly.dev/docs/policies/terms)
> 3. **No advertising** throughout this entire server. (invites, polls, channels, referrals, DMs)
> 4. **Be respectful** and don't troll. (swearing okay, excessive swearing is not)
> 5. **Follow Discord guidelines.** This includes Discord's [Terms of Service](https://discord.com/terms) & [Community Guidelines](https://discord.com/guidelines).
> 6. **Use your head.** These rules aren't perfect. If you think something might not be allowed, don't do it.`),
                new ActionRow()
                    .setComponents(
                        new Button()
                            .setURL("https://pb.giftedly.dev/docs/policies/terms")
                            .setStyle(ButtonStyle.Link)
                            .setLabel("PluralBuddy ToS"),
                        new Button()
                            .setURL("https://pb.giftedly.dev/docs/policies/privacy")
                            .setStyle(ButtonStyle.Link)
                            .setLabel("PluralBuddy Privacy Policy")
                    )

            ),
        new Separator().setSpacing(Spacing.Large),
        new Container()
            .setColor("#FCCEE8")
            .setComponents(
                new TextDisplay()
                    .setContent(`## PluralBuddy Support
Welcome in! Please read the rules above before participating in this server.
### Other Links:
>  - **Website:** https://pb.giftedly.dev
>  - **Invite PluralBuddy to your server:** https://gftl.fyi/invite
>  - **Permanent Invite:** https://gftl.fyi/discord`)
            )
    ]
}