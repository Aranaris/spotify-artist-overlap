import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: NextRequest) {
	console.log('testing spotify get top artists route...');
	console.log(request.cookies.get('session')?.value);
	//TODO parse jwt to get user id
	return Response.json({name: 'artist'});
}
