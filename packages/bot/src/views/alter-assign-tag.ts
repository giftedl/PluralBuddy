import {
	ActionRow,
	Button,
	Container,
	Section,
	Separator,
	TextDisplay,
} from "seyfert";
import { AlertView } from "./alert";
import { TranslatedView } from "./translated-view";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import { tagCollection } from "@/mongodb";
import { DiscordSnowflake } from "@sapphire/snowflake";
import type { PSystem } from "@/types/system";
import { emojis, getEmojiFromTagColor } from "@/lib/emojis";
import type { PAlter } from "@/types/alter";

export const assignTagPagination: {
	id: string;
	memoryPage: number;
	documentCount: number;
	searchQuery?: string | undefined;
	alter: PAlter;
}[] = [];

export class AlertAssignTagView extends TranslatedView {
	async alterAssignTag(
		system: PSystem,
		alter?: PAlter | undefined,
		pgObj?: (typeof assignTagPagination)[0],
	) {
		const tagsPerPage = 5;

		if (system.tagIds.length === 0) {
			return [
				...new AlertView(this.translations).errorView("ERROR_NO_TAGS"),
				new ActionRow().setComponents(
					new Button()
						.setLabel("Create new tag")
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.CreateNewTag.create(),
						)
						.setStyle(ButtonStyle.Primary),
				),
			];
		}

		const time = Date.now();
		const tagsCursor = tagCollection
			.find({
				systemId: system.associatedUserId,
				tagFriendlyName: { $regex: pgObj?.searchQuery ?? "" },
			})
			.limit(tagsPerPage)
			.skip(((pgObj?.memoryPage ?? 1) - 1) * tagsPerPage);

		const alters = await tagsCursor.toArray();
		const pgId = pgObj === undefined ? DiscordSnowflake.generate() : pgObj.id;

		if (pgObj === undefined) {
			const documentCount = await tagCollection.countDocuments({
				systemId: system.associatedUserId,
			});

			assignTagPagination.push({
				id: String(pgId),
				memoryPage: 1,
				documentCount,
				alter: alter!,
			});

			pgObj = {
				id: String(pgId),
				memoryPage: 1,
				documentCount,
				alter: alter!,
			};
		}

		return [
			new Container()
				.setColor(`#${getEmojiFromTagColor(pgObj.alter.color ?? "amber")}`)
				.setComponents(
					new TextDisplay().setContent(
						`## Assign tag to @${pgObj.alter.username}`,
					),
					new Separator().setSpacing(Spacing.Large),
					...alters.map((tag) => {
						return new Section()
							.setAccessory(
								new Button()
									.setLabel(
										pgObj.alter.tagIds.includes(tag.tagId)
											? "Unassign Tag"
											: "Assign Tag",
									)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.AlterAssignPagination.ToggleAssign.create(
											pgObj.id,
											tag.tagId,
										),
									)
									.setStyle(
										pgObj.alter.tagIds.includes(tag.tagId)
											? ButtonStyle.Danger
											: ButtonStyle.Primary,
									)
									.setEmoji(
										pgObj.alter.tagIds.includes(tag.tagId)
											? emojis.minus
											: emojis.plus,
									),
							)
							.setComponents(
								new TextDisplay().setContent(
									`${getEmojiFromTagColor(tag.tagColor)}  ${tag.tagFriendlyName}`,
								),
							);
					}),
					new Separator().setSpacing(Spacing.Large),
					new TextDisplay().setContent(
						`-# Page ${pgObj.memoryPage}/${Math.ceil((pgObj?.documentCount ?? 0) / tagsPerPage)} · Found ${alters.length}/${pgObj.documentCount} tag(s) in ${Date.now() - time}ms${pgObj.searchQuery !== undefined ? ` · Querying for \`${pgObj.searchQuery}\`` : ""}`,
					),
					new ActionRow().setComponents(
						new Button()
							.setStyle(ButtonStyle.Primary)
							.setEmoji(emojis.undo)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.GeneralSettings.create(
									pgObj.alter.alterId,
								),
							),
						new Button()
							.setLabel("Previous Page")
							.setDisabled(pgObj?.memoryPage === 1)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.AlterAssignPagination.PreviousPage.create(
									pgObj.id,
								),
							)
							.setStyle(ButtonStyle.Primary),
						new Button()
							.setLabel("Next Page")
							.setDisabled(
								pgObj?.memoryPage ===
									Math.ceil((pgObj?.documentCount ?? 0) / tagsPerPage),
							)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.AlterAssignPagination.NextPage.create(
									pgObj.id,
								),
							)
							.setStyle(ButtonStyle.Primary),
						new Button()
							.setStyle(ButtonStyle.Primary)
							.setEmoji(emojis.search)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.AlterAssignPagination.Search.create(
									pgObj.id,
								),
							),
					),
				),
		];
	}
}
