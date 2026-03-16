import { DiscordSnowflake } from "@sapphire/snowflake";
import { Double } from "mongodb";

export const createRandomId = (i: number) => {
	const date = new Date();
	date.setSeconds(i);

	return new Double(
		Number(
			DiscordSnowflake.generate({
				timestamp: date,
				workerId: BigInt(i),
				processId: BigInt(Math.floor(Math.random() * 1000)),
			}),
		),
	);
};
