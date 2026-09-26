import { createEvent, Guild } from "seyfert";
import type { APIUnavailableGuild } from "seyfert/lib/types";
import { guildCollection } from "@/mongodb";

export default createEvent({
    data: { name: "guildDelete", once: false },
    run: async (guild: APIUnavailableGuild | Guild<"cached">) => {
        if (guild.unavailable) return;

        await guildCollection.deleteOne({ guildId: guild.id })
    }
});