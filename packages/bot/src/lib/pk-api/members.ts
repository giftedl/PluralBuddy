import { PluralKitAPISystem, PluralKitMember } from "plurography";
import { API_PREFIX, PK_UA } from ".";

export class MemberCollection {
	token: string;

	constructor(token: string) {
		this.token = token;
	}

	async find({ userId }: { userId: string }) {
		const members = await fetch(`${API_PREFIX}/systems/${userId}/members`, {
			headers: {
				Authorization: this.token,
				"User-Agent": PK_UA,
			},
		});

		return ((await members.json()) as unknown[]).map((v) =>
			PluralKitMember.parse(v),
		);
	}
}
