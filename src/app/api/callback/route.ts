import jwt from 'jsonwebtoken';
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
		const jwtToken = jwt.sign({access_token}, process.env.JWT_SECRET_KEY, {
			expiresIn: '1h',
		});

		await fetch(`http://localhost:3000/api/mongodb/user/${userData['id']}`, {
			method: 'POST',
			body: JSON.stringify(userData),
		});

		cookies().set('auth', jwtToken, {
			httpOnly: true,
			maxAge: 3600,
		});
		cookies().set('userid', userData['id']);

		return NextResponse.redirect('http://localhost:3000/profile');
	} catch (err) {
		console.error(err);
		return new Response('Internal server error', {status: 500});
	}

}
