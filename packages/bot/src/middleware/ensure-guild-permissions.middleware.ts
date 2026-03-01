import { AlertView } from "@/views/alert";
import { createMiddleware } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export const ensureGuildPermissions = createMiddleware<void>(async (middle) => {
    const ctx = middle.context;

    if (ctx.guildId === undefined) {
        return await ctx.write({
            components: new AlertView(ctx.userTranslations()).errorView(
                "DN_ERROR_SE",
            ),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
        });
    }

    const member = await ctx.client.members.fetch(ctx.guildId, ctx.author.id).catch(() => null);
    const pluralGuild = await ctx.retrievePGuild()
    const apiGuild = await ctx.guild()

    if (!member) throw new Error("no member")
    if (!apiGuild) throw new Error("no guild")

    const memberPermissions = await member.fetchPermissions()
    const memberRoles = (await member.roles.list()).map((c) => c.id);
    const managerRolesIntersect = memberRoles.filter(c => pluralGuild.managerRoles.includes(c)).length >= 1;

    if (!(
        memberPermissions.has(["Administrator"]) ||
        memberPermissions.has(["ManageGuild"]) ||
        apiGuild.ownerId === member.id ||
        managerRolesIntersect ||
        // this is NOT used in production. this is NOT a backdoor.
        (process.env.SRV_CFG_TEST_USER_ID && process.env.SRV_CFG_TEST_USER_ID === member.id))) {
        return await ctx.write({
            components: new AlertView(ctx.userTranslations()).errorView(
                "INSUFFICIENT_USER_PERMISSIONS",
            ),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
        });
    }

    middle.next();
})