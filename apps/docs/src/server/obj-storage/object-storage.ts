import { fileTypeFromBuffer } from "file-type";
import { S3mini } from "s3mini";
import type { Attachment } from "seyfert";
import sharp from "sharp";
import { FileTooBigException } from "./file-too-big";

let s3: S3mini | null = null;

export function initalizeS3() {
	s3 = new S3mini({
		accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
		endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.BUCKET_NAME}`,
		region: "auto",
	});
}

export async function deleteAssetPrefix(storagePrefix: string) {
	if (!s3) return;

	const prefix = `${storagePrefix}`;

	const objects = await s3.listObjects("/", prefix);
	if (objects === null) return null;

	return await s3.deleteObjects(objects.map((c) => c.Key));
}

export async function uploadAttachment(
		attachment: ArrayBuffer,
		objectName: string,
		metadata: Record<string, string>,
		oldObject?: string
	) {
		console.log(oldObject)
		if (!s3) return "";

		if (Buffer.byteLength(attachment) > 1_000_000) {
			throw new FileTooBigException();
		}
		const fileType = await fileTypeFromBuffer(attachment);
		const headeredMetadata: Record<string, string> = {};

		if (!fileType?.mime.startsWith("image/"))
			throw new Error("Not an image.")

		Object.keys(metadata).forEach((c) => {
			headeredMetadata[`x-amz-meta-${c}`] = metadata[c] ?? "";
		});

		await s3.putObject(
			`${objectName}.${fileType?.ext}`,
			attachment,
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
		? `/${storagePrefix}${(imageProperty ?? "").split(storagePrefix)[1]}`
		: undefined;
}
export async function deleteOldObject({
	imageProperty = "",
	storagePrefix,
}: {
	imageProperty?: string | null;
	storagePrefix: string;
}) {
	if (!s3) return;
	const oldObject = getOldObject({ imageProperty, storagePrefix });
	if (oldObject !== undefined) {
		return await s3.deleteObject(oldObject);
	}
}
