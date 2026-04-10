import {
	APIApplicationCommand,
	APIApplicationEmoji,
	RESTGetAPIInteractionOriginalResponseResult,
	RESTPatchAPICurrentUserJSONBody,
	RESTPatchCurrentApplicationJSONBody,
	RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

export class DiscordClient {
	private botToken: string;

	constructor(token: string) {
		this.botToken = token;
	}

	async getOriginalMessage(id: string, token: string) {
		const response = await fetch(
			`https://discord.com/api/v10/webhooks/${id}/${token}/messages/@original`,
			{
				headers: {
					Authorization: `Bot ${this.botToken}`,
				},
			},
		);
		const interactionMessage =
			(await response.json()) as RESTGetAPIInteractionOriginalResponseResult;

		return interactionMessage;
	}

	async editOriginalInteraction(id: string, token: string, body: Omit<RESTPostAPIWebhookWithTokenJSONBody, 'avatar_url' | 'username'>) {
		const response = await fetch(
			`https://discord.com/api/v10/webhooks/${id}/${token}/messages/@original?with_components=true`,			
			{
				method: "PATCH",
				headers: {
					Authorization: `Bot ${this.botToken}`,
				},
				body: JSON.stringify(body)
			},
		)
		
		const interactionMessage =
			(await response.json()) as RESTGetAPIInteractionOriginalResponseResult;

		return interactionMessage;
	}

	async postApplicationCommands(
		id: string,
		commands: Array<APIApplicationCommand>,
	) {
		await fetch(`https://discord.com/api/v10/applications/${id}/commands`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${this.botToken}`,
			},
			method: "PUT",
			body: JSON.stringify(commands),
		});
	}

	async editCurrentUser(body: RESTPatchAPICurrentUserJSONBody) {
		await fetch("https://discord.com/api/v10/users/@me", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${this.botToken}`,
			},
			body: JSON.stringify(body),
		});
	}

	async editCurrentApplication(body: RESTPatchCurrentApplicationJSONBody) {
		await fetch("https://discord.com/api/v10/applications/@me", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${this.botToken}`,
			},
			body: JSON.stringify(body),
		});
	}

	async listEmojis(id: string) {
		const res = await fetch(
			`https://discord.com/api/v10/applications/${id}/emojis`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${this.botToken}`,
				},
			},
		);

		const emojis = (await res.json()).items as APIApplicationEmoji[];

		return emojis;
	}

	async createEmoji(
		id: string,
		body: { name: string; image: string },
	): Promise<APIApplicationEmoji> {
		const res = await fetch(
			`https://discord.com/api/v10/applications/${id}/emojis`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${this.botToken}`,
				},
				body: JSON.stringify(body),
			},
		);

		const emoji = await res.json();

		return emoji;
	}

	async deleteEmoji(clientId: string, emojiId: string) {
		await fetch(
			`https://discord.com/api/v10/applications/${clientId}/emojis/${emojiId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${this.botToken}`,
				},
			},
		);
	}
}
