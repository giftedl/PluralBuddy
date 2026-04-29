import z from "zod";
import * as path from "node:path";
import * as fs from "node:fs/promises";

export const UnauthorizedSchema = z.object({
	errors: z.array(
		z.object({
			type: z.enum(["no-access-token", "invalid-scopes", "unknown-token"]),
			friendly: z.string(),
		}),
	),
});
export const UnmatchedOAuthSchema = z.object({
	errors: z.array(
		z.object({
			type: z.literal("not-matching-oauth"),
			friendly: z.literal(
				"This endpoint requires the user currently logged in via OAuth.",
			),
		}),
	),
});

export const fetchAllFilesFromGivenFolder = async (fullPath: string) => {
	const files: string[] = [];
	const directory = await fs.readdir(fullPath);

	await Promise.all(
		directory.map(async (file) => {
			const absolutePath = path.join(fullPath, file);
			const nativeDir = await fs.stat(absolutePath);

			if (nativeDir.isDirectory()) {
				const filesFromNestedFolder =
					await fetchAllFilesFromGivenFolder(absolutePath);
				filesFromNestedFolder.forEach((file) => {
					files.push(file);
				});
			} else return files.push(absolutePath);
		}),
	);

	return files;
};
