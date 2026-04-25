import { api } from "@/lib/rpc";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const response = await api.stats.$get();
	const json = await response.json()

	return NextResponse.json(json);
}
