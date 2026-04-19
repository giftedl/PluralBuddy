import { parseArgs } from "util";

const { values } = parseArgs({
	args: Bun.argv,
	options: {
		botToken: {
			type: "string",
		},
	},
	strict: true,
	allowPositionals: true,
});

const guilds = await fetch("https://discord.com/api/v10/users/@me/guilds", {
	headers: {
		Authorization: `Bot ${values.botToken}`,
		"Content-Type": "application/json",
	},
});
const guildJson: any[] = await guilds.json();

for (const element of guildJson) {
    await new Promise<null>((a) => setTimeout(() => a(null), 2000))
	const guild = await fetch(`https://discord.com/api/v10/users/@me/guilds/${element.id}`, {
        method: "DELETE",
		headers: {
			Authorization: `Bot ${values.botToken}`,
		},
	});
    console.log(await guild.json())

}
