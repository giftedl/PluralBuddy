import { ObjectId } from "mongodb"
import { mongoClient } from "@/mongodb"

export const getOAuthConsents = async (userId: string) => {
    const appDb = mongoClient.db(process.env.WEBSITE_DB ?? "")
    const accounts = appDb.collection<{ accountId: string, userId: ObjectId }>("account")
    const matchingAccount = await accounts.findOne({ accountId: userId });

    if (!matchingAccount)
        return [];

    const consents = appDb.collection<{ clientId: string, userId: ObjectId, scopes: string | string[] }>("oauthConsent");
    const clients = appDb.collection<{ clientId: string, metadata: { aaid: string }, name: string }>("oauthClient");

    const userConsents = await consents.find({ userId: new ObjectId(matchingAccount.userId) }).toArray()
    
    return Promise.all(userConsents.filter(v => v.scopes.includes("system:ai-ap")).map(async (v) => ({ ...v, ...(await clients.findOne({ clientId: v.clientId })) })))
}