/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, Container, createStringOption, Declare, Options, SubCommand, TextDisplay } from "seyfert"
import { autocompleteAlters } from "@/lib/autocomplete-alters"
import { AlterProtectionFlags } from "plurography"
import { alterCollection } from "@/mongodb"
import { MessageFlags } from "seyfert/lib/types"
import { AlertView } from "@/views/alert"
import { friendlyProtectionAlters, listFromMaskAlters } from "@/lib/privacy-bitmask"

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    "alter-subject": createStringOption({
        description: "Name of the subject to set",
        choices: Object.keys(AlterProtectionFlags).filter(c => Number.isNaN(Number(c))).map(c => { return { name: c.toLocaleLowerCase(), value: c.toLocaleLowerCase()}})
    }),
    "alter-subject-choice": createStringOption({
        description: "Whether to set the subject to public or private",
        choices: [{ name: "Public", value: "public"}, { name: "Private", value: "private" }]
    })
}

@Options(options)
export default class EditAlterPrivacyCommand extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        
		const {
			"alter-name": alterName,
			"alter-subject": alterPrivacySubject,
            "alter-subject-choice": alterPrivacySubjectChoice
		} = ctx.options;

		const systemId = ctx.author.id;
		const query = Number.isNaN(Number.parseInt(alterName))
			? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
			: alterCollection.findOne({
					$or: [{ username: alterName }, { alterId: Number(alterName) }],
					systemId,
				});
		const alter = await query;

		if (alter === null) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

        if (alterPrivacySubject === undefined || alterPrivacySubjectChoice === undefined) {
            return await ctx.ephemeral({
                components: [new Container().setComponents(new TextDisplay().setContent(`Alter's can have privacy flags that identify how external users see your alter. All alters are exclusively private by default. Below are the public values that you added.

**Current public privacy values**:
\`${friendlyProtectionAlters(ctx.userTranslations(), listFromMaskAlters(alter.public ?? 0)).join("`, `")}\`

-# If you were trying to _set_ the privacy values, you may not have finished the command.`))],
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        let newPublic = alter.public ?? 0;
        // @ts-ignore
        const flagValue = AlterProtectionFlags[alterPrivacySubject.toUpperCase() as string];

        if (alterPrivacySubjectChoice === "public") {
            newPublic = newPublic | flagValue;
        } else if (alterPrivacySubjectChoice === "private") {
            newPublic = newPublic & ~flagValue;
        }

        await alterCollection.updateOne(
            { alterId: alter.alterId },
            { $set: { public: newPublic } },
        );
    

		return await ctx.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations().ALTER_SUCCESS_PRIVACY.replace(
							"%alter%",
							alter.username,
						)
						.replace("%new%", `\`${friendlyProtectionAlters(ctx.userTranslations(), listFromMaskAlters(alter.public ?? 0)).join("`, `")}\``)
                        .replace("%number%", (listFromMaskAlters(alter.public ?? 0) ?? []).length.toString()),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
    }
}