// import jwt from 'jsonwebtoken';
// import {cookies} from 'next/headers';
// import {redirect} from 'next/navigation';
import { getUserAccessToken } from "@/app/_lib/spotify";

export async function GET(req:Request) {
	const requestURL = new URL(req.url);

	const code = requestURL.searchParams.get('code');
	const state = requestURL.searchParams.get('state');

	if (!state) {
		//TODO: verify state
		return new Response('State Mismatch', {status: 400});
	}

	if (!code) {
		return new Response('No code provided', {status: 400});
	}

	console.log(code);

	const stuff = await getUserAccessToken(code);

	return Response.json(stuff);
}
