import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO ?? "");

export const auth = betterAuth({
    database: mongodbAdapter(client.db("pluralbuddy-app")),
    socialProviders: {
        discord: {
            enabled: true,
            clientId: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string
        }
    }
});