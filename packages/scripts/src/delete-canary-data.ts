import { MongoClient } from "mongodb";
import ora from "ora";
import type { PAlter, PTag, PUser } from "plurography";
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

if (!values.userId) throw new Error("no user id")

const mongodb = new MongoClient(process.env.MONGO as string);
const canaryDb = mongodb.db("pluralbuddy-canary");
const normalDb = mongodb.db("pluralbuddy");

const userSpinner = ora("dropping user object..").start()

// user object
const user = await canaryDb.collection<PUser>("users").findOne({ userId: values.userId });
if (!user ) throw new Error("no user object ?")

await canaryDb.collection<PUser>("users").deleteOne(user);

userSpinner.stop()

// tags
const tagSpinner = ora("deleting tags..").start()
const allTags = await canaryDb.collection<PTag>("tags").deleteMany({ systemId: values.userId })

tagSpinner.stop()

const alterSpinner = ora("deleting alters..").start()

// alters
const allAlters = await canaryDb.collection<PAlter>("alters").deleteMany({ systemId: values.userId })


alterSpinner.stop()