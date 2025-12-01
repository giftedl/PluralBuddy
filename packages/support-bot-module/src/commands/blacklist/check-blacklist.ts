/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getUserById, noteCollection, writeUserById } from "@/mongodb";
import {
	SubCommand,
	type CommandContext,
	createUserOption,
	createStringOption,
	Declare,
	Options,
    type OnOptionsReturnObject,
    ActionRow,
    Button
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

const options = {
	"user-id": createUserOption({
		description: "User to query blacklist",
		required: true,
	})
};

@Declare({
	name: "check",
	description: "Check for a blacklist",
	contexts: ["Guild"],
	guildId: ["1444187699924963350"],
})
@Options(options)
export default class CreateBlacklistCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		if (!ctx.member?.roles.keys.includes("1444241245634433134")) {
			return;
		}

		const { "user-id": userId } = ctx.options;
        const user = await getUserById(userId.id)

        if (!user.blacklisted) {
            return await ctx.write({
                content: "This user has not been blacklisted.",
                flags: MessageFlags.Ephemeral
            })
        }

        const blacklistNote = await noteCollection.findOne({ associatedUserId: user.userId })

        if (!blacklistNote) {
            return await ctx.write({
                content: "This user **has been blacklisted**, however has no blacklist note :thinking:.\n-# This could have happened if a developer manually blacklisted a user.",
                components: [
                    new ActionRow()
                        .setComponents(
                            new Button()
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Close Blacklist")
                                .setCustomId(`close-${user.userId}`)
                        )
                ],
                flags: MessageFlags.Ephemeral,
            })
        }

		return await ctx.write({
			content: `That user was blacklisted by <@${blacklistNote.moderatorId}> at <t:${Math.floor(blacklistNote.date.getTime() / 1000)}>. They have a provided note as \`${blacklistNote.note}\`.`,
            components: [
                new ActionRow()
                    .setComponents(
                        new Button()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Close Blacklist")
                            .setCustomId(`close-${user.userId}`)
                    )
            ],
			flags: MessageFlags.Ephemeral,
		});
	}

	override async onOptionsError(
		context: CommandContext,
		metadata: OnOptionsReturnObject,
	) {
		if (context.author.bot === true) return;

		const errors = Object.entries(metadata)
			.filter((_) => _[1].failed)
			.map((error) => `${error[0]}: ${error[1].value}`)
			.join("\n");

		await context.write({
			content: `There was some error(s) while parsing arguments in that command:
            
            >>> ${errors}`
		});
	}
}
