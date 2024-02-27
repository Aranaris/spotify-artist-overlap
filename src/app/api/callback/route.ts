// import jwt from 'jsonwebtoken';
// import {redirect} from 'next/navigation';
import {getUserAccessToken} from '@/app/_lib/spotify';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export async function GET(req:Request) {
	const requestURL = new URL(req.url);

	const code = requestURL.searchParams.get('code');
	const state = requestURL.searchParams.get('state');
	const cookieState = cookies().get('state')?.value;

	if (!state && state === cookieState) {
		return new Response('State Mismatch', {status: 400});
	}

	if (!code) {
		return new Response('No code provided', {status: 400});
	}

	cookies().delete('state');

	const userAuthData = await getUserAccessToken(code);

	const {access_token} = userAuthData;
	console.log(access_token);
	redirect('/profile');
}
