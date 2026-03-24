/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Container, createMiddleware } from "seyfert";
import { middlewareIssue } from "../lib/middleware-issue";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";

export const blacklistUserMiddleware = createMiddleware<void>(
	async (middle) => {
		const pluralUser = await middle.context.retrievePUser();

		if (
			middle.context.isChat() &&
			(middle.context.options as Record<string, string>)["alter-name"]
		) {
			const ctx = middle.context;

			const { "alter-name": alterName } = middle.context.options as {
				"alter-name": string;
			};
			const systemId = ctx.author.id;

			const query = Number.isNaN(Number.parseInt(alterName))
				? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
				: alterCollection.findOne({
						$or: [{ username: alterName }, { alterId: Number(alterName) }],
						systemId,
					});
			const alter = await query;

			if (alter === null) {
				const possibleMatch = await alterCollection.findOne({
					$or: [{ username: { $regex: alterName } }],
					systemId,
				});

				return await ctx.ephemeral({
					components: new AlertView(ctx.userTranslations()).errorViewCustom(
						possibleMatch
							? ctx
									.userTranslations()
									.ERROR_ALTER_DOESNT_EXIST_SUGGESTION.replace(
										"%suggestion%",
										possibleMatch.username,
									)
							: ctx.userTranslations().ERROR_ALTER_DOESNT_EXIST,
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			}

			ctx.setContextAlter(alter);
		}

		if (pluralUser.blacklisted) {
			return middlewareIssue("ERROR_USER_BLACKLISTED", middle);
		}

		middle.next();
	},
);
