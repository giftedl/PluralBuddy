import { api } from "@/lib/rpc";
import { NextRequest } from "next/server";

export async function GET() {
	const response = await api.stats.$get();

	return response;
}
