import type z from "zod";
import { PAlter } from "@/pluralbuddy/alter";
import type { ImportNotation } from "@/pluralbuddy/import-notation";
import type { PSystem } from "@/pluralbuddy/system";
import { PTag } from "@/pluralbuddy/tag";
import OpenPluralConverter from "./openplural";
import PluralKitConverter from "./pluralkit";
import TupperBoxConverter from "./tupperbox";

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
	}
> = {
	openplural: {
		name: "OpenPlural",
		description:
			"Open source plurality spec in collaboration with plurality developers - Sheaf & Prism supported",
		converter: OpenPluralConverter,
	},
	pluralkit: {
		name: "PluralKit",
		description:
			"Supported import/export on most major plurality applications - including PluralKit itself.",
		converter: PluralKitConverter,
	},
	tupperbox: {
		name: "TupperBox",
		description:
			"Simplest, has the least data to download - system data isn't included.",
		converter: TupperBoxConverter,
	},
};
