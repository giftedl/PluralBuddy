import type z from "zod";
import type { ImportOutput } from ".";
import PluralKit, { type PKEntry } from "./pluralkit";
import PluralBuddy, { type PBEntry } from "./pluralbuddy";
import TupperBox, { type TBEntry } from "./tupperbox";

type ValidInputFunction<T> = (
	input: T,
) => Promise<z.infer<typeof ImportOutput>>;
type ImportController<T> = {
	add: ValidInputFunction<T>;
	replace: ValidInputFunction<T>;
	both: ValidInputFunction<T>;
	deleteM: ValidInputFunction<T>;
};

export const importControllers = {
	PluralKit: PluralKit satisfies ImportController<PKEntry>,
	PluralBuddy: PluralBuddy satisfies ImportController<PBEntry>,
	TupperBox: TupperBox satisfies ImportController<TBEntry>,
};
