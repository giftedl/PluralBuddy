/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
	AlterProtectionFlags,
	type PAlter,
	type PTag,
	type Redacted,
	TagProtectionFlags,
} from "plurography";
import { has } from "./privacy-bitmask";

export function redactAlter(
	isSelf: boolean,
	alter: PAlter | null,
	clientId: string,
): Redacted<PAlter> {
	if (!alter) return null;

	if (isSelf) return {
		...alter,
		fields: {
			[clientId]: alter.fields[clientId],
		},
	};

	if (!has(AlterProtectionFlags.VISIBILITY, alter.public)) {
		return { redacted: true };
	}

	const displayNameDisplayable =
		isSelf || has(AlterProtectionFlags.NAME, alter.public);
	const pronounsDisplayable =
		isSelf || has(AlterProtectionFlags.PRONOUNS, alter.public);
	const descriptionDisplayable =
		isSelf || has(AlterProtectionFlags.DESCRIPTION, alter.public);
	const avatarDisplayable =
		isSelf || has(AlterProtectionFlags.AVATAR, alter.public);
	const bannerDisplayable =
		isSelf || has(AlterProtectionFlags.BANNER, alter.public);
	const messagesDisplayable =
		isSelf || has(AlterProtectionFlags.MESSAGE_COUNT, alter.public);
	const usernameDisplayable =
		isSelf || has(AlterProtectionFlags.USERNAME, alter.public);
	const tagsDisplayable =
		isSelf || has(AlterProtectionFlags.TAGS, alter.public);

	return {
		alterId: alter.alterId,
		// Doesn't matter since `alterId` includes the date it was created anyways since... its a snowflake.
		created: alter.created,
		systemId: alter.systemId,

		displayName: displayNameDisplayable
			? alter.displayName
			: { redacted: true },
		pronouns: pronounsDisplayable ? alter.pronouns : { redacted: true },
		description: descriptionDisplayable
			? alter.description
			: { redacted: true },
		avatarUrl: avatarDisplayable ? alter.avatarUrl : { redacted: true },
        avatarUrlMap: isSelf ? alter.avatarUrlMap : { redacted: true },
		banner: bannerDisplayable ? alter.banner : { redacted: true },
		messageCount: messagesDisplayable ? alter.messageCount : { redacted: true },
		lastMessageTimestamp: messagesDisplayable
			? alter.lastMessageTimestamp
			: { redacted: true },
		username: usernameDisplayable ? alter.username : { redacted: true },
		tagIds: tagsDisplayable ? alter.tagIds : { redacted: true },

		public: alter.public,

		...(isSelf
			? {
					fields: {
						[clientId]: alter.fields[clientId],
					},
				}
			: { fields: {} }),
	};
}

export function redactTag(
	isSelf: boolean,
	tag: PTag | null,
	clientId: string,
): Redacted<PTag> {
	if (!tag) return null;

	if (isSelf) return tag;

	const nameDisplayable = isSelf || has(TagProtectionFlags.NAME, tag.public);
	const colorDisplayable = isSelf || has(TagProtectionFlags.COLOR, tag.public);
	const descriptionDisplayable =
		isSelf || has(TagProtectionFlags.DESCRIPTION, tag.public);
	const altersDisplayable =
		isSelf || has(TagProtectionFlags.ALTERS, tag.public);

	return {
		tagId: tag.tagId,
		systemId: tag.systemId,

		tagFriendlyName: nameDisplayable ? tag.tagFriendlyName : { redacted: true },
		tagDescription: descriptionDisplayable
			? tag.tagDescription
			: { redacted: true },
		tagColor: colorDisplayable ? tag.tagColor : { redacted: true },
		associatedAlters: altersDisplayable
			? tag.associatedAlters
			: { redacted: true },

		public: tag.public,

		...(isSelf
			? {
					fields: {
						[clientId]: tag.fields[clientId],
					},
				}
			: { fields: {} }),
	};
}
