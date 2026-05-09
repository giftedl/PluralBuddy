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
		description: "User to query global block",
		required: true,
	})
};

@Declare({
	name: "check",
	description: "Check for a global block",
	contexts: ["Guild"],
	guildId: ["1444187699924963350"],
})
@Options(options)
export default class CreateBlockCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		if (!ctx.member?.roles.keys.includes("1444241245634433134")) {
			return;
		}

		const { "user-id": userId } = ctx.options;
        const user = await getUserById(userId.id)

        if (!user.blocked) {
            return await ctx.write({
                content: "This user has not been blocked.",
                flags: MessageFlags.Ephemeral
            })
        }

        const blockNote = await noteCollection.findOne({ associatedUserId: user.userId })

        if (!blockNote) {
            return await ctx.write({
                content: "This user **has been blocked**, however has no global block note :thinking:.\n-# This could have happened if a developer manually blocked a user.",
                components: [
                    new ActionRow()
                        .setComponents(
                            new Button()
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Close Block")
                                .setCustomId(`close-${user.userId}`)
                        )
                ],
                flags: MessageFlags.Ephemeral,
            })
        }

		return await ctx.write({
			content: `That user was blocked by <@${blockNote.moderatorId}> at <t:${Math.floor(blockNote.date.getTime() / 1000)}>. They have a provided note as \`${blockNote.note}\`.`,
            components: [
                new ActionRow()
                    .setComponents(
                        new Button()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Close Block")
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
