import { getSession } from "@/app/_lib/auth";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: NextRequest) {
	console.log('testing spotify get top artists route...');
	const parsed = await getSession();
	//TODO parse jwt to get user id
	return Response.json(parsed);
}
