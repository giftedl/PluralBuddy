import { emojis } from "@/lib/emojis";
import { userCollection } from "@/mongodb";
import { writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import CrowdinApi from "@crowdin/crowdin-api-client";
import {
	Command,
	Container,
	createStringOption,
	Declare,
	Options,
	TextDisplay,
	type CommandContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const getFlagEmoji = (countryCode: string) => {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
};

const options = {
	language: createStringOption({
		description: "Language to set to in PluralBuddy.",
		autocomplete: async (ctx) => {
			const { translationStatusApi, sourceFilesApi } = new CrowdinApi({
				token: process.env.CROWDIN_API_KEY ?? "",
			});

			const progress = await translationStatusApi.getFileProgress(
				Number(process.env.CROWDIN_PROJ_ID ?? ""),
				Number(process.env.CROWDIN_FILE_ID ?? ""),
			);

			return await ctx.respond([
				{ name: `${getFlagEmoji("US")} English - source`, value: "en" },
				...progress.data.map((v) => ({
					name: `${getFlagEmoji(v.data.language.twoLettersCode)} ${v.data.language.name} - ${v.data.approvalProgress}% translated`,
					value: v.data.language.twoLettersCode,
				})),
			]);
		},
	}),
};

@Declare({
	name: "set-language",
	description: "Set current language in PluralBuddy",
	aliases: ["lang"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class SetupCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);

		const locale = await ctx.userTranslations();
		const user = await ctx.retrievePUser();
		const { language } = ctx.options;

		const { translationStatusApi, sourceFilesApi } = new CrowdinApi({
			token: process.env.CROWDIN_API_KEY ?? "",
		});

		const progress = await translationStatusApi.getFileProgress(
			Number(process.env.CROWDIN_PROJ_ID ?? ""),
			Number(process.env.CROWDIN_FILE_ID ?? ""),
		);

		if (!language) {
			return await ctx.ephemeral(
				{
					components: [
						new Container()
							.setComponents(
								new TextDisplay().setContent(
									locale.SET_LANGUAGE_DESC.replace(
										"{{ gear }}",
										emojis.settingsWhite,
									).replace(
										"{{ languages }}",
										[
											`> - ${getFlagEmoji("US")} English - source`,
											...progress.data.map(
												(v) =>
													`> - ${getFlagEmoji(v.data.language.twoLettersCode)} ${v.data.language.name} - ${v.data.approvalProgress}% translated`,
											),
										].join("\n"),
									),
								),
							)
							.setColor("White"),
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		ctx.client.cache.i18n.remove(ctx.author.id);

		await writeUserById(user.userId, {
			...user,
			userLang: language,
		});

		return await ctx.editResponse({
			components: new AlertView(locale).successViewCustom(
				locale.SET_LANGUAGE_TO.replace(
					"{{ language }}",
					progress.data.find((v) => v.data.language.twoLettersCode === language)
						?.data.language.name ?? "Unknown",
				),
			),
            flags: MessageFlags.IsComponentsV2
		});
	}
}
