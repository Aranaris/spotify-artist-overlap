// import jwt from 'jsonwebtoken';
// import {cookies} from 'next/headers';
// import {redirect} from 'next/navigation';

export async function GET(req:Request) {
	const code = new URL(req.url).searchParams.get('code');

	if (!code) {
		return new Response('No code provided', {status: 400});
	}
}
