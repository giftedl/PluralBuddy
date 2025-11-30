/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getUserById, noteCollection, writeUserById } from "@/mongodb";
import {
	SubCommand,
	type CommandContext,
	createUserOption,
	createStringOption,
	Declare,
	Options,
    type OnOptionsReturnObject
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"user-id": createUserOption({
		description: "User to blacklist",
		required: true,
	}),
	note: createStringOption({
		description: "Sapphire Note including the reasoning",
		required: true,
		min_length: 7,
		max_length: 7,
	}),
};

@Declare({
	name: "create",
	description: "Create a blacklist",
	contexts: ["Guild"],
	guildId: ["1444187699924963350"],
})
@Options(options)
export default class CreateBlacklistCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		if (!ctx.member?.roles.keys.includes("1444241245634433134")) {
			return;
		}

		const { "user-id": userId, note: note } = ctx.options;
        const user = await getUserById(userId.id)

        if (user.blacklisted) {
            return await ctx.write({
                content: "That user was already blacklisted.",
                flags: MessageFlags.Ephemeral,

            })
        }

		await noteCollection.insertOne({
			note,
			associatedUserId: userId.id,
            date: new Date(),
            moderatorId: ctx.author.id
		});

        await writeUserById(userId.id, {
            ...(await getUserById(userId.id)),
            blacklisted: true
        })

		return await ctx.write({
			content: `Okay, that user has been **blacklisted**. (${note}) (${userId})`,
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
