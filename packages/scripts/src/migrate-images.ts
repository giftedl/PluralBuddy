import { MongoClient } from "mongodb";
import type { PAlter, PUser } from "plurography";

const mongodb = new MongoClient(process.env.MONGO as string);
const normalDb = mongodb.db("pluralbuddy");
const alters = normalDb.collection<PAlter>("alters");
const users = normalDb.collection<PUser>("users");

await alters.aggregate([
	{
		$match: {
			$or: [
				{
					avatarUrl: {
						$regex: /^https:\/\/pluralbuddy.giftedly.dev/,
					},
				},
				{
					banner: {
						$regex: /^https:\/\/pluralbuddy.giftedly.dev/,
					},
				},
			],
		},
	},
	{
		$set: {
			avatarUrl: {
				$replaceOne: {
					input: "$avatarUrl",
					find: "https://pluralbuddy.giftedly.dev/p/",
					replacement: "https://img.pb.giftedly.dev/",
				},
			},
			banner: {
				$replaceOne: {
					input: "$banner",
					find: "https://pluralbuddy.giftedly.dev/p/",
					replacement: "https://img.pb.giftedly.dev/",
				},
			},
		},
	},
]).toArray();

await users.aggregate([
	{
		$match: {
			$or: [
				{
					avatarUrl: {
						$regex: /^https:\/\/pluralbuddy.giftedly.dev/,
					},
				},
				{
					banner: {
						$regex: /^https:\/\/pluralbuddy.giftedly.dev/,
					},
				},
			],
		},
	},
	{
		$set: {
			avatarUrl: {
				$replaceOne: {
					input: "$avatarUrl",
					find: "https://pluralbuddy.giftedly.dev/p/",
					replacement: "https://img.pb.giftedly.dev/",
				},
			},
			banner: {
				$replaceOne: {
					input: "$banner",
					find: "https://pluralbuddy.giftedly.dev/p/",
					replacement: "https://img.pb.giftedly.dev/",
				},
			},
		},
	},
]).toArray();