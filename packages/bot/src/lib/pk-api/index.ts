import { build } from "@/index";
import { GroupCollection } from "./groups";
import { MemberCollection } from "./members";
import { SystemCollection } from "./systems";

export let PK_UA = `PluralBuddy/Loading... (gftl.fyi/discord; @giftedly, Discord) Plurography/0.5.0`;
export const API_PREFIX = "https://api.pluralkit.me/v2";

export class PluralKitAPI {
		token: string;
		systemsCollection: SystemCollection;
		membersCollection: MemberCollection;
		groupsCollection: GroupCollection;

		constructor(token: string) {
			if (build)
				// fix: initialization issue
				PK_UA = `PluralBuddy/${(build ?? "").split("/")[0]} (gftl.fyi/discord; @giftedly, Discord) Plurography/0.5.0`;

			this.token = token;

			this.systemsCollection = new SystemCollection(token);
			this.membersCollection = new MemberCollection(token);
			this.groupsCollection = new GroupCollection(token);
		}
	}

export const pk = (token: string) => new PluralKitAPI(token);