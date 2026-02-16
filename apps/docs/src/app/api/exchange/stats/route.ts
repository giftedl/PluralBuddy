import { api } from "@/lib/rpc";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ user: string }> },
) {
	const response = await api.stats.$get();

	return response;
}
