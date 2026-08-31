import { fileTypeFromBuffer } from "file-type";
import { S3mini } from "s3mini";
import type { Attachment } from "seyfert";
import sharp from "sharp";
import { FileTooBigException } from "./lib/file-too-big";

const s3 = new S3mini({
	accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
	secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
	endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.BUCKET_NAME}`,
	region: "auto",
});

export async function deleteAssetPrefix(storagePrefix: string) {
	const prefix = `${storagePrefix}`;

	const objects = await s3.listObjects("/", prefix);
	if (objects === null) return null;

	return await s3.deleteObjects(objects.map((c) => c.Key));
}

export async function uploadAttachment(
	attachment: Attachment,
	objectName: string,
	metadata: Record<string, string>,
	oldObject?: string,
	resize?: { width?: number, height?: number }
) {
	const attachmentUrl = attachment.url;
	const discordResponse = await fetch(attachmentUrl);


	if (!discordResponse.ok) {
		throw new Error("Failed to fetch the image from Discord.");
	}

	if (!discordResponse.body) {
		throw new Error("Response body is null.");
	}

	let buffer = await Bun.readableStreamToArrayBuffer(discordResponse.body);
	if (resize) {
		const arrBf = await sharp(buffer)
			.resize({ height: resize.height, width: resize.width })
			.webp()
			.toBuffer();

		buffer = arrBf.buffer;
	}
	if (Buffer.byteLength(buffer) > 1_000_000) {
		throw new FileTooBigException();
	}
	const fileType = await fileTypeFromBuffer(buffer);
	const headeredMetadata: Record<string, string> = {};

	Object.keys(metadata).forEach((c) => {
		headeredMetadata[`x-amz-meta-${c}`] = metadata[c] ?? "";
	});

	await s3.putObject(
		`${objectName}.${fileType?.ext}`,
		buffer,
		fileType?.mime,
		undefined,
		headeredMetadata,
	);

	if (oldObject) {
		await s3.deleteObject(oldObject);
	}

	return `https://img.pb${process.env.BUCKET_NAME?.endsWith("-canary") ? "c" : ""}.giftedly.dev/${objectName}.${fileType?.ext}`;
}

export function getOldObject({
	imageProperty = "",
	storagePrefix,
}: {
	imageProperty?: string | null;
	storagePrefix: string;
}) {
	return (imageProperty ?? "").startsWith("https://pluralbuddy.giftedly.dev") ||
		(imageProperty ?? "").startsWith(
			`https://img.pb${process.env.BUCKET_NAME?.endsWith("-canary") ? "c" : ""}.giftedly.dev`,
		)
		? `${(process.env.BRANCH ?? "a")[0]}/${storagePrefix}${(imageProperty ?? "").split(storagePrefix)[1]}`
		: undefined;
}
export async function deleteOldObject({
	imageProperty = "",
	storagePrefix,
}: {
	imageProperty?: string | null;
	storagePrefix: string;
}) {
	const oldObject = getOldObject({ imageProperty, storagePrefix });
	if (oldObject !== undefined) {
		return await s3.deleteObject(oldObject);
	}
}
