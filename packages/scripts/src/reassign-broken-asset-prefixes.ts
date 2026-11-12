import { DiscordSnowflake } from "@sapphire/snowflake";
import { Double, MongoClient } from "mongodb";
import { assetStringGeneration, PAlterObject, type PAlter, type PUser } from "plurography";

const mongodb = new MongoClient(process.env.MONGO as string);
const normalDb = mongodb.db("pluralbuddy");
const systems = normalDb.collection<PUser>("users");

const affectedSystems = await systems
  .find({
    // @ts-ignore Thats actually the whole issue.
    storagePrefix: null,
  })
  .toArray();

for (const system of affectedSystems) {
  await systems.updateOne(
    { userId: system.userId },
    {
      $set: {
        storagePrefix: assetStringGeneration(8),
      },
    },
  );
}

await mongodb.close();
console.log("done");
