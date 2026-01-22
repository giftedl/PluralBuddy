import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { CommandContext, createRoleOption, createUserOption, Declare, Group, Middlewares, Options, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    role: createRoleOption({
        description: "Role to remove from the manager role list",
        required: true
    })
}

@Declare({
    name: "remove",
    description: "Remove manager role from the server.",
    aliases: ["a"],
})
@Middlewares(["administrativeGuildPermissions"])
@Group("manager-roles")
@Options(options)
export default class AddManagerRole extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        const pluralGuild = await ctx.retrievePGuild();

        pluralGuild.managerRoles = pluralGuild.managerRoles.filter((c) => c !== ctx.options.role.id);

        await guildCollection.updateOne({ guildId: pluralGuild.guildId }, { $pull: { managerRoles: ctx.options.role.id }});

        return await ctx.write({
            
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				`${ctx.userTranslations().SUCCESS_REMOVE_MANAGER_ROLE.replace("%item%", `<@&${ctx.options.role.id}>`)} ${ctx
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