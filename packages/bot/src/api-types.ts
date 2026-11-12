import z, { type ZodTypeAny } from "zod";
import type { clientRoutes } from "./api";

declare const require: (moduleName: string) => any;
const { ImportNotation, PluralKitSystem, TupperBoxSystem } = require("plurography") as {
  ImportNotation: ZodTypeAny;
  PluralKitSystem: ZodTypeAny;
  TupperBoxSystem: ZodTypeAny;
};

export type ClientType = typeof clientRoutes;

export const ImportStagingValidation = (type: string) =>
  z
    .string()
    .min(20, "Import must be at least 20 characters.")
    .refine(
      (val) => {
        try {
          JSON.parse(val);
        } catch {
          return false;
        }
        return true;
      },
      { error: "Must be valid JSON." },
    )
    .refine(
      (val) => {
        try {
          JSON.parse(val);
        } catch {
          return false;
        }
        if (type === "PluralKit" && PluralKitSystem.safeParse(JSON.parse(val)).error) {
          return false;
        }
        if (type === "PluralBuddy" && ImportNotation.safeParse(JSON.parse(val)).error) {
          return false;
        }
        if (type === "TupperBox" && TupperBoxSystem.safeParse(JSON.parse(val)).error) {
          return false;
        }

        return true;
      },
      { error: "Configuration is not consistent with import type." },
    );
