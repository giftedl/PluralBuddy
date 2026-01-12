import { RESTGetAPICurrentUserResult } from "discord-api-types/v10";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ user: string }> },
) {
    const response = await fetch(`https://discord.com/api/v10/users/${(await params).user}`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
    });

    let imageUrl = null;

    const profile: RESTGetAPICurrentUserResult = await response.json();
    if (profile.avatar === null) {
        const defaultAvatarNumber =
            profile.discriminator === "0"
                ? Number(BigInt(profile.id) >> BigInt(22)) % 6
                : parseInt(profile.discriminator) % 5;
        imageUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        imageUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
    }

    return await fetch(imageUrl);
}