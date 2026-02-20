import convert from "@/lib/delay-converter";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import parse from "parse-duration";
import {
	CommandContext,
	createNumberOption,
	createStringOption,
	Declare,
	Options,
	SubCommand,
} from "seyfert/lib/commands";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"latch-delay": createStringOption({
		description: "New latch delay in duration format. (max 10 hours)",
		required: true,
	}),
};

@Declare({
	name: "latch-delay",
	description: "Sets delay before latches expire.",
	aliases: ["ld", "l"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class SetLatchDelayCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "latch-delay": newDelay } = ctx.options;
		const user = await ctx.retrievePUser();
		const parsedDelay = parse(newDelay);

		if (user.system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (parsedDelay === null || parsedDelay >= 36000000) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"LATCH_DELAY_INVALID",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const updatedSystem = await createSystemOperation(
			user.system,
			{
				latchExpiration: parsedDelay,
			},
			ctx.userTranslations(),
			"discord",
		);

		if (updatedSystem === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SYSTEM_SET_LATCH_DELAY.replace(
						"%delay%",
						convert(Math.floor(parsedDelay / 1000)),
					),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
