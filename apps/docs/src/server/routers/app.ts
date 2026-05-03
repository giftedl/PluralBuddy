import {baseProcedure, createTRPCRouter} from "@/server/init";
import zlib from "node:zlib";
import {assetStringGeneration, PAlterObject, PSystem, PSystemObject, PTagObject, PUser} from "plurography";
import z from "zod";

const promiseDecompress = (buffer: Buffer) => new Promise<NonSharedBuffer>((y, n) => zlib.unzip(buffer, (err, data) => {
    if (err) return n(err);
    y(data);
}))

const promiseCompress = (data: string) => new Promise<NonSharedBuffer>((y,n) => zlib.gzip(data, (err, data) => {
    if (err) return n(err);
    y(data);
}))

const importSyntax = z.object({
    system: PSystemObject.or(z.null()),
    alters: PAlterObject.array().max(2000),
    tags: PTagObject.array().max(2000)
})

export const systemsAppRouter = createTRPCRouter({
    sync: baseProcedure.input(z.object({
        data: z.string(),
        prefer: z.enum(["local", "remote"])
    })).mutation(async ({ctx, input}) => {
        const buffer = new Buffer(input.data, "base64");
        const data = importSyntax.parse(JSON.parse((await promiseDecompress(buffer)).toString()));

        const db = ctx.mongo.db(
            `pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`
        )
            .collection<PUser>("users");

        const user = await db.findOne({userId: ctx.userId})
        const storagePrefix = user?.storagePrefix ?? assetStringGeneration(8)

        if (input.prefer === "local")
            await db
                .updateOne({userId: ctx.userId}, {
                    $set: {
                        system: data.system === null ? undefined : {
                            ...data.system,
                            associatedUserId: ctx.userId,
                        }, blacklisted: user?.blacklisted ?? false, storagePrefix, nudging: user?.nudging ?? {
                            blockedUsers: [],
                            currentlyEnabled: true,
                            dmReply: false
                        }
                    },
                    ...(data.system === null ? {$unset: {system: 1}} : {})
                }, {upsert: true})

        const zippableData = JSON.stringify(input.prefer === "local" ? data : {
            system: user?.system ? {
                ...user.system,
                associatedUserId: "@me"
            } : {},
            alters: [],
            tags: []
        })

        return {data: (await promiseCompress(zippableData)).toBase64(), prefer: input.prefer};
    })
})