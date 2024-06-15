import {encrypt} from '@/app/_lib/auth';
import {getNewTokenFromSpotify, getUserInfo} from '@/app/_lib/spotify';
import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';
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

	try {
		const authData = await getNewTokenFromSpotify(code);
		if (authData.error) {
			throw new Error(authData.error.message);
		}

		const userData = await getUserInfo(authData['access_token']);
		const expires = new Date(Date.now() + authData['expires_in']);

		const userTokenData = {
			access_token: authData['access_token'],
			spotifyid: userData['id'],
			expires,
			scope: authData['scope'],
			refresh_token: authData['refresh_token'],
		};

		await fetch(`${process.env.BASE_URL}/api/mongodb/`, {
			method: 'POST',
			body: JSON.stringify(userTokenData),
		});

		const sessionExpiration = new Date(Date.now() + 3600 * 1000 * 24);
		const sessionCookieData = {
			spotifyid: userData['id'],
			expires: JSON.stringify(sessionExpiration),
			display_name: userData['display_name'],
		};

		const session = await encrypt(sessionCookieData);

		cookies().set('session', session, {
			httpOnly: true,
			expires,
		});

		return NextResponse.redirect(`${process.env.BASE_URL}/profile/${userData['id']}`);
	} catch (err) {
		console.error(err);
		return new Response('Internal server error', {status: 500});
	}

}
