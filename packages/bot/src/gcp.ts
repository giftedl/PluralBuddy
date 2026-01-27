import { fileTypeFromBuffer, fileTypeFromStream } from "file-type";
import { Readable } from "node:stream";
import type { Attachment } from "seyfert";

export async function getGcpAccessToken() {
	// GCP OAuth2 Service Account JWT authentication

	// 1. Gather credentials
	const clientEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
	let privateKey = process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY ?? "";

	// a. Fix escaped newlines for multiline key
	privateKey = privateKey.replace(/\\n/g, "\n");

	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: clientEmail,
		scope: "https://www.googleapis.com/auth/devstorage.full_control",
		aud: "https://oauth2.googleapis.com/token",
		exp: now + 3600,
		iat: now,
	};

	// b. JWT header
	const header = {
		alg: "RS256",
		typ: "JWT",
	};

	function base64url(input: string | Buffer) {
		return Buffer.from(input)
			.toString("base64")
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");
	}

	// 2. Create JWT token
	const headerEncoded = base64url(JSON.stringify(header));
	const payloadEncoded = base64url(JSON.stringify(payload));
	const data = `${headerEncoded}.${payloadEncoded}`;

	// 3. Sign JWT using RS256
	const crypto = await import("node:crypto");
	const signer = crypto.createSign("RSA-SHA256");
	signer.update(data);
	signer.end();
	const signature = signer.sign(privateKey);
	const signatureEncoded = base64url(signature);

	const jwt = `${data}.${signatureEncoded}`;

	// 4. Request access token from Google
	const params = new URLSearchParams();
	params.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
	params.set("assertion", jwt);

	const resp = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params.toString(),
	});

	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(`Failed to get GCP access token: ${resp.status} ${text}`);
	}

	const respBody = (await resp.json()) as { access_token: string };
	const accessToken = respBody.access_token;

	return accessToken;
}

export async function deleteAttachment(
	storagePrefix: string,
	accessToken: string,
) {
	const prefix = `${(process.env.BRANCH ?? "c")[0]}/${storagePrefix}`;

	const existingResponse = await (
		await fetch(
			`https://storage.googleapis.com/storage/v1/b/${process.env.GCP_BUCKET}?fields=lifecycle`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			},
		)
	).json();

	const deletionResponse = await fetch(
		`https://storage.googleapis.com/storage/v1/b/${process.env.GCP_BUCKET}?fields=lifecycle`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			method: "PATCH",
			body: JSON.stringify({
				lifecycle: {
					rule: [
						{
							action: { type: "Delete" },
							condition: {
								matchesPrefix: [prefix],
							},
						},
						...(existingResponse as any).lifecycle.rule,
					],
				},
			}),
		},
	);

	return deletionResponse;
}

export async function uploadDiscordAttachmentToGcp(
	attachment: Attachment,
	accessToken: string,
	bucketName: string,
	objectName: string,
	metadata: Record<string, string>,
) {
	const attachmentUrl = attachment.url;
	const discordResponse = await fetch(attachmentUrl);

	if (!discordResponse.ok) {
		throw new Error("Failed to fetch the image from Discord.");
	}

	if (!discordResponse.body) {
		throw new Error("Response body is null.");
	}

	const buffer = await Bun.readableStreamToArrayBuffer(discordResponse.body);
	const fileType = await fileTypeFromBuffer(buffer);
	const gcpUploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucketName)}/o?uploadType=media&name=${encodeURIComponent(objectName + `.${fileType?.ext}`)}`;
	const gcpMetadataUrl = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectName + `.${fileType?.ext}`)}`;

	const gcpResponse = await fetch(gcpUploadUrl, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type":
				attachment.contentType ?? fileType?.mime ?? "application/octet-stream",
		},
		body: buffer,
	});

	const a = await fetch(gcpMetadataUrl, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			metadata,
		}),
	});

	return {
		gcpResponse,
		newObject: objectName + `.${fileType?.ext}`,
	};
}
