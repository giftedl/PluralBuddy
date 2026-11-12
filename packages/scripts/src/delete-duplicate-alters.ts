import { MongoClient, ObjectId } from "mongodb";
import type { PAlter } from "plurography";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    userId: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const mongodb = new MongoClient(process.env.MONGO as string);
const normalDb = mongodb.db("pluralbuddy");
const alters = await normalDb.collection<PAlter>("alters");

(
  await alters
    .aggregate([
      { $match: { systemId: values.userId } },
      {
        $group: {
          _id: "$username",
          count: { $sum: 1 },
          duplicates: { $addToSet: "$_id" },
        },
      },
    ])
    .toArray()
).forEach(async (c) => {
  const deletables = (c.duplicates as ObjectId[]).slice(1);

  await alters.deleteMany({ _id: { $in: deletables } });
});
