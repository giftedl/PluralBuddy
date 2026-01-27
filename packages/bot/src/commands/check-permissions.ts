import { emojis } from "@/lib/emojis";
import { AlertView } from "@/views/alert";
import {
	Command,
	CommandContext,
	Container,
	Declare,
	Message,
	TextDisplay,
} from "seyfert";
import { MessageFlags, PermissionFlagsBits } from "seyfert/lib/types";

@Declare({
	name: "checkpermissions",
	description: "Ensure PluralBuddy has the proper permissions.",
	aliases: ["permissions"],
})
export default class AppExplanationCommand extends Command {
	override async run(ctx: CommandContext) {
		const guild = await ctx.retrievePGuild();

		if (guild.getFeatures().disabledPermissionCheck) {
			if (ctx.isChat() && ctx.message) {
				(ctx.message as Message).delete();

				await (ctx.message as Message).author.write({
					components: new AlertView(ctx.userTranslations()).errorView(
						"FEATURE_DISABLED_GUILD",
					),
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
				return;
			}

			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"FEATURE_DISABLED_GUILD",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (ctx.guildId === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const userPerms = await ctx.client.channels.memberPermissions(
			ctx.channelId,
			await ctx.client.members.fetch(ctx.guildId as string, ctx.client.botId),
			true,
		);

		const sendingUserPerms = await ctx.client.channels.memberPermissions(
			ctx.channelId,
			await ctx.client.members.fetch(ctx.guildId as string, ctx.author.id),
			true,
		);

		const { forcedWebhookMode, forcedNicknameMode } = guild.getFeatures()

		return await ctx.write({
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			components: [
				new TextDisplay().setContent(
					`-# ${emojis.reply} What permissions does PluralBuddy need and why?`,
				),
				new Container()
					.setComponents(
						new TextDisplay().setContent(`PluralBuddy supports a wide range of permission configurations due to how alters & systems are setup.

> **Pro tip:** Don't give all bots Administrator permissions! It increases your likelihood of being raided if a bot is compromised.

However, there are still base permissions that are needed to operate the bot due to how PluralBuddy is designed.

> **Manage Messages:** Needed to effectively delete proxied messages. _(${userPerms?.has([PermissionFlagsBits.ManageMessages]) ? "Granted" : "Denied, **required for proxying.**"})_
> **Send Messages:** Needed to communicate with users. _(${userPerms?.has([PermissionFlagsBits.SendMessages]) ? "Granted" : "Denied, **required for proxying.**"})_
> **View Channel:** Needed for the bot to see and use the channel. _(${userPerms?.has([PermissionFlagsBits.ViewChannel]) ? "Granted" : "Denied, **required for proxying.**"})_
 
However, there are two permissions that you can use for proxying which requires **only 1** to be granted depending on the proxy mode you'd like in the environment.
-# If you'd like both modes to be enabled, you can grant both permissions.

> ${forcedWebhookMode ? "~~" : ""}**Manage Nicknames:** Needed for Nickname proxy mode _(${userPerms?.has([PermissionFlagsBits.ManageNicknames]) ? "Granted" : "Denied"})_. Proxying user also needs the **Change Nickname** permission _(${sendingUserPerms?.has([PermissionFlagsBits.ChangeNickname]) ? "Granted" : "Denied"})_.${forcedWebhookMode ? "~~\n> -# This proxy mode is disabled on this server." : ""}
> ${forcedNicknameMode ? "~~" : ""}**Manage Webhooks:** Needed for Webhook proxy mode _(${userPerms?.has([PermissionFlagsBits.ManageWebhooks]) ? "Granted" : "Denied"})_.${forcedNicknameMode ? "~~\n> -# This proxy mode is disabled on this server." : ""}


-# ALL permissions are needed in context of the channel. If any of the 5 above permissions aren't granted accordingly, in a channel, then the bot won't work in the way specified above _just_ in that channel.`),
					)
					.setColor("#FCCEE8"),
			],
		});
	}
}
