import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { CommandContext, createRoleOption, createUserOption, Declare, Group, Middlewares, Options, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    role: createRoleOption({
        description: "Role to add to manager role list",
        required: true
    })
}

@Declare({
    name: "add",
    description: "Add manager role to the server.",
    aliases: ["a"],
})
@Middlewares(["administrativeGuildPermissions"])
@Group("manager-roles")
@Options(options)
export default class AddManagerRole extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        const pluralGuild = await ctx.retrievePGuild();

        if (pluralGuild.managerRoles.includes(ctx.options.role.id)) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("MANAGER_ALREADY_EXISTS"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        if (pluralGuild.blacklistedRoles.length >= 25) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("TOO_MANY_MANAGER_ITEMS"),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            })
        }

        pluralGuild.managerRoles.push(ctx.options.role.id);

        await guildCollection.updateOne({ guildId: pluralGuild.guildId }, { $push: { managerRoles: ctx.options.role.id }});

        return await ctx.write({
            
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				`${ctx.userTranslations().SUCCESS_ADD_MANAGER_ROLE.replace("%item%", `<@&${ctx.options.role.id}>`)} ${ctx
					.userTranslations()
					.SUCCESS_CHANGED_MANAGER_BLACKLIST.replace(
						"%manager_roles%",
						pluralGuild.managerRoles
							.map((c) => `> - <@&${c}>`)
							.join("\n"),
					)}`,
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            allowed_mentions: { parse: [] }
        })
    }
}