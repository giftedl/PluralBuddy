import { PluralKitAPISystem } from "plurography";
import { build } from "@/index";
import { API_PREFIX, PK_UA } from ".";

export class SystemCollection {
	token: string;

	constructor(token: string) {
		this.token = token;
	}

	async findOne({ userId }: { userId: string }) {
		const system = await fetch(`${API_PREFIX}/systems/${userId}`, {
			headers: {
				Authorization: this.token,
				"User-Agent": PK_UA,
			},
		});

        return PluralKitAPISystem.parse(await system.json());
	}

    
}
