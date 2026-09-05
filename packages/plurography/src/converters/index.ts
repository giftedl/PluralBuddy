import type z from "zod";
import { OpenPluralExport } from "../openplural/export";
import { OpenPluralSystem } from "../openplural/system";
import { PAlter } from "../pluralbuddy/alter";
import { ImportNotation } from "../pluralbuddy/import-notation";
import { type PSystem, PSystemObject } from "../pluralbuddy/system";
import { PTag } from "../pluralbuddy/tag";
import { PluralKitSystem } from "../pluralkit";
import { TupperBoxSystem } from "../tupperbox";
import OpenPluralConverter from "./openplural";
import PluralBuddyConverter from "./pluralbuddy";
import PluralKitConverter from "./pluralkit";
import TupperBoxConverter from "./tupperbox";

export { OpenPluralConverter };
export { PluralBuddyConverter };
export { PluralKitConverter };
export { TupperBoxConverter }; 

type ClassOf<V> = { new (): V };

export type ConverterInput = {
	import: unknown;
	system: unknown;
	alter: unknown;
	tag: unknown;
};

export default interface Converter<V extends ConverterInput> {
	to(system: V["system"]): PSystem | null;
	toImport(data: V["import"]): z.infer<typeof ImportNotation>;
	toAlter(alter: V["alter"]): PAlter;
	toTag(tag: V["tag"]): PTag;

	from(system: PSystem): V["system"];
	fromImport(data: z.infer<typeof ImportNotation>): V["import"];
	fromAlter(data: PAlter): V["alter"];
	fromTag(data: PTag): V["tag"];
}
export const possibleConverters: Record<
	string,
	{
		converter: ClassOf<Converter<ConverterInput>>;
		name: string;
		description: string;
		parserZod: z.ZodObject,
	}
> = {
	pluralbuddy: {
		name: "PluralBuddy",
		description: "The default format. Most reliable.",
		converter: PluralBuddyConverter,
		parserZod: ImportNotation,
	},
	openplural: {
		name: "OpenPlural",
		description:
			"Open source plurality spec in collaboration with plurality developers - Sheaf & Prism supported",
		converter: OpenPluralConverter,
		parserZod: OpenPluralExport,
	},
	pluralkit: {
		name: "PluralKit",
		description:
			"Supported import/export on most major plurality apps - including PluralKit itself.",
		converter: PluralKitConverter,
		parserZod: PluralKitSystem
	},
	tupperbox: {
		name: "TupperBox",
		description:
			"Simplest, has the least data to download - system data isn't included.",
		converter: TupperBoxConverter,
		parserZod: TupperBoxSystem
	},
};

export * from "./openplural";
export * from "./pluralbuddy"
export * from "./pluralkit";
export * from "./tupperbox";