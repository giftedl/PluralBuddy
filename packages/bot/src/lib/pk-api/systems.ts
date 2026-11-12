import { PluralKitAPISystem, type PSystem } from "plurography";
import type { z } from "zod";
import { build } from "@/index";
import { API_PREFIX, PK_UA } from ".";

export class SystemCollection {
  private token: string;

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

  async updateOne(
    { userId }: { userId: string },
    system: Partial<z.infer<typeof PluralKitAPISystem>>,
  ) {
    const systemRun = await fetch(`${API_PREFIX}/systems/${userId}`, {
      headers: {
        Authorization: this.token,
        "User-Agent": PK_UA,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(system),
    });

    return PluralKitAPISystem.parse(await systemRun.json());
  }
}
