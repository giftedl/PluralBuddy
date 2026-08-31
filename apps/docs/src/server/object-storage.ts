import { S3mini } from "s3mini";

export async function deleteS3AssetPrefix(storagePrefix: string) {
	const s3 = new S3mini({
		accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
		endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.BUCKET_NAME}`,
		region: "auto",
	});

	const prefix = `${storagePrefix}`;

	const objects = await s3.listObjects("/", prefix);
	if (objects === null) return null;

	return await s3.deleteObjects(objects.map((c) => c.Key));
}