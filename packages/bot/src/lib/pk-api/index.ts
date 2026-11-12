import { build } from "@/index";
import { GroupCollection } from "./groups";
import { MemberCollection } from "./members";
import { SystemCollection } from "./systems";

export let PK_UA = `PluralBuddy/Loading... (gftl.fyi/discord; @giftedly, Discord) Plurography/0.5.0`;
export const API_PREFIX = "https://api.pluralkit.me/v2";

export class PluralKitAPI {
  private token: string;
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

  async addMemberGroupRelationship({ memberId, groupId }: { memberId: string; groupId: string }) {
    const groupUpdate = await fetch(`${API_PREFIX}/members/${memberId}/groups/add`, {
      headers: {
        Authorization: this.token,
        "User-Agent": PK_UA,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify([groupId]),
    });
    return groupUpdate;
  }

  async removeMemberGroupRelationship({
    memberId,
    groupId,
  }: {
    memberId: string;
    groupId: string;
  }) {
    const groupUpdate = await fetch(`${API_PREFIX}/members/${memberId}/groups/remove`, {
      headers: {
        Authorization: this.token,
        "User-Agent": PK_UA,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify([groupId]),
    });

    return groupUpdate;
  }
}

export const pk = (token: string) => new PluralKitAPI(token);
