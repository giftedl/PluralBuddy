import { PluralKitAPISystem, PluralKitGroup, PluralKitMember } from "plurography";
import type { z } from "zod";
import { API_PREFIX, PK_UA } from ".";

export class GroupCollection {
  private token: string;

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

    return ((await members.json()) as unknown[]).map((v) => PluralKitGroup.parse(v));
  }
  async updateOne(
    { groupId }: { groupId: string },
    change: Partial<z.infer<typeof PluralKitGroup>>,
  ) {
    const groupUpdate = await fetch(`${API_PREFIX}/groups/${groupId}`, {
      headers: {
        Authorization: this.token,
        "User-Agent": PK_UA,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(change),
    });

    return (await groupUpdate.json()) as z.infer<typeof PluralKitGroup>;
  }
  async insertOne(group: Partial<z.infer<typeof PluralKitGroup>> & { name: string }) {
    const groupUpdate = await fetch(`${API_PREFIX}/groups`, {
      headers: {
        Authorization: this.token,
        "User-Agent": PK_UA,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(group),
    });

    return (await groupUpdate.json()) as z.infer<typeof PluralKitGroup>;
  }
}
