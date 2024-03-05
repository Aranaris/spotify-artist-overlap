import {encrypt} from '@/app/_lib/auth';
import {getUserAccessToken, getUserInfo} from '@/app/_lib/spotify';
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
		const access_token = await getUserAccessToken(code);
		const userData = await getUserInfo(access_token);

		await fetch(`http://localhost:3000/api/mongodb/user/${userData['id']}`, {
			method: 'POST',
			body: JSON.stringify(userData),
		});

		userData['expires'] = new Date(Date.now() + 3600 * 1000);
		const session = await encrypt(userData);

		cookies().set('session', session, {
			httpOnly: true,
			expires: userData['expires'],
		});

		return NextResponse.redirect(`http://localhost:3000/profile/${userData['id']}`);
	} catch (err) {
		console.error(err);
		return new Response('Internal server error', {status: 500});
	}

}
