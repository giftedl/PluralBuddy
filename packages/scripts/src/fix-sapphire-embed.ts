let embed: any = null

embed.embeds = embed.embeds.map((v: any) => ({
	...v,
	color: Number(`0x${v.color}`),
    fields: v.fields.map((c: any) => ({...c, value: typeof c.value === "object" ? c.value.join("\n") : c.value}))
}));
console.log(JSON.stringify(embed, null, 2));
