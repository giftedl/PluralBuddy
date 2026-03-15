import {
	SimplyPluralGroup,
	SimplyPluralMember,
	SimplyPluralSystem,
} from "plurography";
import z from "zod";

export async function getSPAlters(
	key: string,
	uid: string,
): Promise<z.infer<typeof SimplyPluralMember>[]> {
	const request = await fetch(`https://api.apparyllis.com/v1/members/${uid}`, {
		headers: {
			Authorization: key,
		},
	});

	if (!request.ok) throw new Error("Error while getting alters");

	return z.array(SimplyPluralMember).parse(await request.json());
}

export async function getSPSystem(
	key: string,
): Promise<z.infer<typeof SimplyPluralSystem>> {
	const request = await fetch("https://api.apparyllis.com/v1/me", {
		headers: {
			Authorization: key,
		},
	});

	return SimplyPluralSystem.parse(await request.json());
}

export async function getSPTags(
	key: string,
	uid: string,
): Promise<z.infer<typeof SimplyPluralGroup>[]> {
	const request = await fetch(`https://api.apparyllis.com/v1/groups/${uid}`, {
		headers: {
			Authorization: key,
		},
	});

	return z.array(SimplyPluralGroup).parse(await request.json());
}
