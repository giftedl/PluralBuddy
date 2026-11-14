/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import type { CommandContext } from "seyfert";

export async function createInvite(ctx: CommandContext): Promise<string> {
  const guild = await ctx.guild();
  const invite = await guild?.invites.create({ channelId: "1444187700864225328", max_age: 0 });

  return `https://discord.gg/${invite?.code}`;
}
