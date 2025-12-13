/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	AttachmentBuilder,
	Button,
	Container,
	MediaGallery,
	MediaGalleryItem,
	Section,
	TextDisplay,
	Thumbnail,
} from "seyfert";
import { TranslatedView } from "./translated-view";
import { SystemProtectionFlags, type PSystem } from "../types/system";
import { ButtonStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { emojis } from "../lib/emojis";
import { has } from "@/lib/privacy-bitmask";

export class SystemView extends TranslatedView {
	systemProfileView(system: PSystem, external?: boolean) {
		const displayNameDisplayable =
			!external || has(SystemProtectionFlags.NAME, system.public);
		const displayTagDisplayable =
			!external || has(SystemProtectionFlags.DISPLAY_TAG, system.public);
		const pronounsDisplayable =
			!external || has(SystemProtectionFlags.PRONOUNS, system.public);
		const descriptionDisplayable =
			!external || has(SystemProtectionFlags.DESCRIPTION, system.public);
		const avatarDisplayable =
			!external || has(SystemProtectionFlags.AVATAR, system.public);
		const bannerDisplayable =
			!external || has(SystemProtectionFlags.BANNER, system.public);
		const altersDisplayable =
			!external || has(SystemProtectionFlags.ALTERS, system.public);
		const tagsDisplayable =
			!external || has(SystemProtectionFlags.TAGS, system.public);


		const innerComponents = new TextDisplay().setContent(
			`${displayNameDisplayable ? `## ${system.systemName}` : ""}
${pronounsDisplayable || displayTagDisplayable ? `-# ${displayTagDisplayable ? system.systemDisplayTag : ""}${displayTagDisplayable && pronounsDisplayable ? " · " : ""}${pronounsDisplayable ? system.systemPronouns : ""}` : ""}
${descriptionDisplayable ? `\n${system.systemDescription}\n` : "\n"}
${altersDisplayable ? `**Alters**: ${(system.alterIds as number[]).length}` : ""}
${tagsDisplayable ? `**Tags:** ${(system.tagIds as string[]).length}` : ""}
**Associated to:** <@${system.associatedUserId}> (${system.associatedUserId})`,
		);

		return [
			new Container().setComponents(
				system.systemAvatar !== null &&
					system.systemAvatar !== undefined &&
					avatarDisplayable
					? new Section()
							.setAccessory(
								new Thumbnail()
									.setMedia(system.systemAvatar as string)
									.setDescription(`${system.systemName}'s avatar`),
							)
							.setComponents(innerComponents)
					: innerComponents,
				...(system.systemBanner !== null &&
				system.systemBanner !== undefined &&
				bannerDisplayable
					? [
							new MediaGallery().setItems(
								new MediaGalleryItem()
									.setMedia(system.systemBanner)
									.setDescription(`${system.systemName}'s banner`),
							),
						]
					: []),
			),
		];
	}

	systemConfigureButton(system: PSystem) {
		return [
			new ActionRow().setComponents(
				new Button()
					.setLabel("Configure Profile")
					.setEmoji(emojis.wrenchWhite)
					.setCustomId(
						InteractionIdentifier.Systems.ConfigurePublicProfile.create(
							system.associatedUserId,
						),
					)
					.setStyle(ButtonStyle.Primary),
			),
		];
	}
}
