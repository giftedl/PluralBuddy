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

if (!values.userId) throw new Error("no user id");

const mongodb = new MongoClient(process.env.MONGO as string);
const normalDb = mongodb.db("pluralbuddy");
const system = await normalDb
	.collection<PUser>("users")
	.findOne({ userId: "616326184170422343" });
const alters = await normalDb
	.collection<PAlter>("alters")
	.find({ systemId: "616326184170422343" })
	.toArray();
const tags = await normalDb
	.collection<PTag>("tags")
	.find({ systemId: "616326184170422343" })
	.toArray();

await normalDb.collection<PUser>("users").updateOne(
	{ userId: "616326184170422343" },
	{
		$set: {
			"system.alterIds": alters.map((v) => v.alterId),
			"system.tagIds": tags.map((v) => v.tagId),
		},
	},
);

alterIds: [
  1473547966034743300,
  1473547966039068700,
  1473547966043394000,
  1473547966043525000,
  1473547966043656200,
  1473547966043787300,
  1473547966043918300,
  1473547966044049400,
  1473547966044180500,
  1473547966044311600,
  1473547966044442600,
  1473547966044573700,
  1473547966044704800,
  1473547966044835800,
  1473547966049161200,
  1473547966049292300,
  1473547966049423400,
  1473547966049554400,
  1473547966049685500,
  1473547966049816600,
  1473547966049947600,
  1473547966054273000,
  1473547966054404000,
  1473547966054535200,
  1473547966054666200,
  1473547966054797300,
  1473547966054928400,
  1473547966055059500,
  1473547966055190500,
  1473547966055321600,
  1473547966055452700,
  1473547966063972400,
  1473547966059909000,
  1473547966064234500,
  1473547966064365600,
  1473547966068691000,
  1473547966068822000,
  1473547966068953000
]