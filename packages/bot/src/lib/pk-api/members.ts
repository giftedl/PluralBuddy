import { PluralKitMember } from "plurography";
import type { z } from "zod";
import { API_PREFIX, PK_UA } from ".";

export class MemberCollection {
  private token: string;

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

    return ((await members.json()) as unknown[]).map((v) => PluralKitMember.parse(v));
  }

  async updateOne(
    { memberId }: { memberId: string },
    change: Partial<z.infer<typeof PluralKitMember>>,
  ) {
    const memberUpdate = await fetch(`${API_PREFIX}/members/${memberId}`, {
      headers: {
        Authorization: this.token,
        "User-Agent": PK_UA,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(change),
    });

    return (await memberUpdate.json()) as z.infer<typeof PluralKitMember>;
  }

  async insertOne(member: Partial<z.infer<typeof PluralKitMember>> & { name: string }) {
    const memberUpdate = await fetch(`${API_PREFIX}/members`, {
      headers: {
        Authorization: this.token,
        "User-Agent": PK_UA,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(member),
    });

    return (await memberUpdate.json()) as z.infer<typeof PluralKitMember>;
  }
}
