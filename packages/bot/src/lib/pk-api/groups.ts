import { PluralKitAPISystem, PluralKitGroup, PluralKitMember } from "plurography";
import { API_PREFIX, PK_UA } from ".";

export class GroupCollection {
	token: string;

	constructor(token: string) {
		this.token = token;
	}

	async find({ userId }: { userId: string }) {
		const members = await fetch(`${API_PREFIX}/systems/${userId}/groups`, {
			headers: {
				Authorization: this.token,
				"User-Agent": PK_UA,
			},
		});

		return ((await members.json()) as unknown[]).map((v) =>
			PluralKitGroup.parse(v),
		);
	}
}
