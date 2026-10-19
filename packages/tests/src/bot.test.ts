import { describe, expect, test } from "bun:test";
import dotenv from "dotenv";
import { alterCollection, mongoClient, setupMongoDB } from "../../bot/src/mongodb";

dotenv.config({ path: "./.env.local" });

const { client, startTesting } = await import("bot");

process.chdir("../bot")

describe("general purpose bot testing", async () => {
	test("bot exists", async () => {
        await startTesting()
        
		expect(client).toBeObject();
	}, { retry: 3 });

    test("bot connected to gateway", async () => {
        expect(client.gateway.totalShards).toBeGreaterThan(0);
    })

	test("components loaded correctly", async () => {
		expect(client.components.commands.length).toBeGreaterThan(0);
	});

	test("commands loaded correctly", async () => {
		expect(client.commands.values.length).toBeGreaterThan(0);
	});
});

describe("i18n", async () => {

	test("default locale exists", async () => {
		expect(client.t("en").get().POLICY_MODAL_TITLE).not.toBeUndefined()
	})

})